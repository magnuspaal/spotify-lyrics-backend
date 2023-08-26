import express, { Response, Request } from "express";
import dotenv from "dotenv";
import axios, { AxiosError, AxiosResponse } from "axios";
import { formatSongTitleAndArtist } from "../utils";
import auth from "../middleware/auth";
import spotifyApi from "../api/spotify-api";

dotenv.config();

const router = express.Router();

router.get("/", auth, async (req, res) => {
	const id = req.query.id;

	spotifyApi.get(`/tracks/${id}`, req, res);
});

router.get("/features", auth, async (req, res) => {
	const id = req.query.id;

	spotifyApi.get(`/audio-features/${id}`, req, res);
});

router.post("/lyrics", (req: Request, res: Response) => {
	const trackId = req.body.trackId;

	const url = 
	`https://spotify-lyric-api.herokuapp.com/?trackid=${trackId}`

	console.log("URL", url)

	axios
		.get(url)
		.then((response: AxiosResponse) => {
			res.status(response.status);
			return res.send(response.data);
		})
		.catch((error: AxiosError) => {
			res.status(error.response?.status || 500);
			return res.send({ message: error.response?.data });
		});
});

export default router;
