import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullname: {
			type: String,
			required: true,
		},
		password: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		contact: {
			type: Number,
			required: true,
		},
		dob: {
			type: Date,
		},
		profileImage: {
			type: String,
			default:
				"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
		},
		role: {
			type: String,
			default: "user",
		},
		lastLogin: {
			type: Date,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const UserModel = model("User", userSchema);

export default UserModel;
