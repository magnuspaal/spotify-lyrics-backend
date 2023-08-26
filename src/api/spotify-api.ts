import dotenv from "dotenv";
import { Request, Response } from "express";
import axios, { AxiosError, AxiosResponse } from "axios";

dotenv.config();

class SpotifyApi {
	constructor() {}

	get(
		path: string,
		req: Request,
		res: Response,
		callbackResolve?: (body: any) => void,
		callbackReject?: (error: any, response: any, body: any) => void
	) {
		if (!req.headers.authorization) return
		axios.get("https://api.spotify.com/v1" + path,
			{
				headers: {
					"Authorization": req.headers.authorization,
					"Content-Type": "application/json",
				}
			}
		)
		.then((response: AxiosResponse) => {
			if (
				(response.status === 200 || response.status === 204)
			) {
				const body = response.data
				if (callbackResolve) return callbackResolve(body);
				if (body) return res.send(body);
				else return res.send();
			}
		})
		.catch((error: AxiosError) => {
			const data = error.response?.data
			if (callbackReject) return callbackReject(error, error.response, data);
				res.status(error.response?.status ?? 500);
				return res.send({
					message: error.message ?? "Unexpected error",
				});
		})
	}
}

const spotifyApi = new SpotifyApi();
export default spotifyApi;
