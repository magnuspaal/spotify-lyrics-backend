import { Request, Response, NextFunction } from "express";
import cryptoJs from "crypto-js";

const auth = (req: Request, res: Response, next: NextFunction) => {
	const encryptedAccessToken = req.headers.authorization?.split(" ")[1];
	if (!encryptedAccessToken) {
		res.status(401);
		return res.send({ message: "Unauthorized" });
	}

	const [token, secret] = encryptedAccessToken.split(":");

	const unencryptedToken = cryptoJs.AES.decrypt(token, secret).toString(
		cryptoJs.enc.Utf8
	);

	req.headers.authorization = "Bearer " + unencryptedToken;
	return next();
};

export default auth;
