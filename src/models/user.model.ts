import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUser {
	_id: string;
	encryptedRefreshToken: string;
	expiresMs: number;
}

const userSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	encryptedRefreshToken: {
		type: String,
		required: true,
	},
	expiresMs: {
		type: Number,
		required: true,
	},
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
