import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import UserModel from "../models/userModel.js";

export const test = (req, res) => {
	res.json({
		message: "Controller working fine!!",
	});
};

export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "Can only update your account"));
	try {
		let { fullname, password, profileImage } = req.body;

		if (!fullname && fullname?.trim().length === 0) {
			fullname = undefined;
		}
		if (!password && password?.trim().length === 0) {
			password = undefined;
		}
		if (!profileImage && profileImage?.trim().length === 0) {
			profileImage = undefined;
		}
		let updateUser;
		if (password) {
			password = bcryptjs.hashSync(password, 10);
			updateUser = await UserModel.findByIdAndUpdate(
				req.params.id,
				{
					$set: {
						fullname,
						password,
						profileImage,
					},
				},
				{
					new: true,
				}
			);
		} else {
			updateUser = await UserModel.findByIdAndUpdate(
				req.params.id,
				{
					$set: {
						fullname,
						profileImage,
					},
				},
				{
					new: true,
				}
			);
		}
		const { password: hashedPassword, ...rest } = updateUser._doc;
		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "Can only delete your account"));

	try {
		await UserModel.findByIdAndDelete(req.params.id);
		res.clearCookie("access_token")
			.status(200)
			.json("User deleted successfully");
	} catch (error) {
		next(error);
	}
};
