import express from "express";
import dotenv from "dotenv";
import spotifyApi from "../api/spotify-api";
import auth from "../middleware/auth";

dotenv.config();

const router = express.Router();

router.get("/", auth, (req, res) => {
	spotifyApi.get("/me/player", req, res);
});

export default router;
