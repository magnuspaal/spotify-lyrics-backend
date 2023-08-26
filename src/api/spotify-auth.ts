import dotenv from "dotenv";
import { Request, Response } from "express";
import axios, { AxiosError, AxiosResponse } from "axios";
import qs from 'querystring'

dotenv.config();

const SPOTIFYCLIENTID = process.env.SPOTIFYCLIENTID,
	SPOTIFYCLIENTSECRET = process.env.SPOTIFYCLIENTSECRET;

class SpotifyAuth {
	constructor() {}

	post(
		form: any,
		req: Request,
		res: Response,
		callbackResolve: (body: any) => void,
		callbackReject?: (error: any, body: any) => void
	) {
		console.log(form)
		axios.post(
			"https://accounts.spotify.com/api/token",
			qs.stringify(form),
			{
				headers: {
					Authorization:
						"Basic " +
						Buffer.from(SPOTIFYCLIENTID + ":" + SPOTIFYCLIENTSECRET).toString(
							"base64"
						),
					"Content-Type": "application/x-www-form-urlencoded",
				}
			},
		).then((response: AxiosResponse) => {
			if (response.status === 200) {
				return callbackResolve(response.data);
			}
		}).catch((error: AxiosError) => {
			const data = error.response?.data
			if (callbackReject) return callbackReject(error, data);
			return res.send({ message: data.error_description });
		})
	}
}

const spotifyAuth = new SpotifyAuth();
export { spotifyAuth };
