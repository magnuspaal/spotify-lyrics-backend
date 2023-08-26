import express from "express";
import dotenv from "dotenv";
import auth from "./routes/auth";
import player from "./routes/player";
import track from "./routes/track";
import cors from "cors";
import mongoose from "mongoose";

const port = 5000;

dotenv.config();

var app = express();

const MONGO_URL = process.env.MONGO_URL as string;

const ALLOWED_URLS = process.env.ALLOWED_URLS?.split(",") as string[];

mongoose
	.connect(MONGO_URL)
	.then(() => console.log(`Connected to ${MONGO_URL}`))
	.catch((error) => console.log(error));

app.set("trust proxy", 1);

app.use(
	cors({
		origin: ALLOWED_URLS,
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})
);

app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/player", player);
app.use("/api/track", track);

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
