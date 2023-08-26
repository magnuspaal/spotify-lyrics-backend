import express, { Request, Response } from "express";
import { generateRandomString } from "../utils";
import dotenv from "dotenv";
import User from "../models/user.model";
import moment from "moment";
import cryptoJs from "crypto-js";
import { spotifyAuth } from "../api/spotify-auth";

dotenv.config();

let SPOTIFYCLIENTID = process.env.SPOTIFYCLIENTID,
	API_URL = process.env.API_URL ?? "",
	FRONT_URL = process.env.FRONT_URL ?? "";

const router = express.Router();

router.get("/login", (req, res) => {
	var scope = "user-read-currently-playing \
	user-read-playback-state";
	var state = generateRandomString();

	var auth_query_parameters = new URLSearchParams({
		response_type: "code",
		client_id: SPOTIFYCLIENTID,
		scope: scope,
		redirect_uri: `${API_URL}/auth/callback`,
		state: state,
	} as Record<string, string>);

	res.redirect(
		"https://accounts.spotify.com/authorize/?" +
			auth_query_parameters.toString()
	);
});

router.get("/callback", (req, res) => {
	var code = req.query.code;

	spotifyAuth.post(
		{
			code,
			redirect_uri: `${API_URL}/auth/callback`,
			grant_type: "authorization_code",
		},
		req,
		res,
		async (body: {
			expires_in: number;
			access_token: string;
			refresh_token: string;
		}) => {
			const expiresMs = moment().add(body.expires_in, "s").unix();

			const secretKey = cryptoJs.lib.WordArray.random(16).toString();

			const encryptedAccessToken = cryptoJs.AES.encrypt(
				body.access_token,
				secretKey
			).toString();

			const encryptedRefreshToken = cryptoJs.AES.encrypt(
				body.refresh_token,
				secretKey
			).toString();

			await User.updateOne(
				{ _id: encryptedAccessToken },
				{
					encryptedRefreshToken,
					expiresMs,
				},
				{ upsert: true }
			);

			var authQueryParameters = new URLSearchParams({
				secret: secretKey,
				token: encryptedAccessToken,
			} as Record<string, string>);

			res.redirect(FRONT_URL + "?" + authQueryParameters.toString());
		},
		(error: any, body: any) => {
			console.log(body)
			res.redirect(FRONT_URL);
		}
	);
});

router.post("/token", async (req: Request, res: Response) => {
	const currentTime = moment().unix();
	const user = await User.findOne({ _id: req.body.token });
	const secretKey = req.body.secret;
	if (!user || !secretKey) return res.send();
	console.log("GET /token - User requested: ", user._id.slice(0, 20));
	if (user.expiresMs < currentTime) {
		spotifyAuth.post(
			{
				grant_type: "refresh_token",
				refresh_token: cryptoJs.AES.decrypt(
					user.encryptedRefreshToken,
					secretKey
				).toString(cryptoJs.enc.Utf8),
			},
			req,
			res,
			async (body: { access_token: string; expires_in: number }) => {
				const expiresMs = moment().add(body.expires_in, "s").unix();
				return User.findOne({ _id: user._id })
					.then((user) => {
						if (user) {
							const newAccessToken = cryptoJs.AES.encrypt(
								body.access_token,
								secretKey
							).toString();
							User.insertMany(
								[
									{
										_id: newAccessToken,
										encryptedRefreshToken: user.encryptedRefreshToken,
										expiresMs,
									},
								],
								{},
								(err, docs) => {
									if (err) {
										console.log("GET /token - User creation error: ", err);
									}
									console.log(
										"GET /token - User created: ",
										JSON.stringify(docs)
									);
									User.deleteMany({ _id: req.body.token }, (err) => {
										if (err) {
											console.log("GET /token - User not deleted error: ", err);
										}
										console.log(
											"GET /token - Access Token expired for: ",
											req.body.token.slice(0, 20),
											" new token: ",
											newAccessToken.slice(0, 20)
										);
										return res.send({
											accessToken: newAccessToken,
										});
									});
								}
							);
						} else {
							return res.send();
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
		);
	} else {
		return res.send({
			accessToken: user._id,
		});
	}
});

export default router;
