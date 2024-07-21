import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
	const { username, fullname, password, email } = req.body;
	const hashPassword = bcryptjs.hashSync(password, 10);
	const contact = Number(req.body.contact);
	try {
		const newUser = await UserModel.create({
			username,
			fullname,
			password: hashPassword,
			email,
			contact,
		});
		if (!newUser) return next(errorHandler(500, "Something went wrong"));
		const token = jwt.sign(
			{
				id: newUser._id,
				user: {
					username: newUser.username,
					email: newUser.email,
					fullname: newUser.fullname,
					profileImage: newUser.profileImage,
					role: newUser.role,
					isActve: newUser.isActive,
				},
			},
			process.env.JWT_SECRET
		);
		const { password: hashedPassword, ...rest } = newUser._doc;
		const expiryDate = new Date(Date.now() + 3600000); //1hr
		return res
			.cookie("access_token", token, {
				httpOnly: true,
				expires: expiryDate,
			})
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

export const signin = async (req, res, next) => {
	const { username, password } = req.body;
	try {
		let user = await UserModel.findOne({ username });
		if (!user) {
			return next(errorHandler(404, "User not found"));
		}
		const validatePassword = bcryptjs.compareSync(password, user.password);
		if (!validatePassword) {
			return next(errorHandler(401, "Incorrect Username or Password"));
		}
		const token = jwt.sign(
			{
				id: user._id,
				user: {
					username: user.username,
					email: user.email,
					fullname: user.fullname,
					profileImage: user.profileImage,
					role: user.role,
					isActve: user.isActive,
				},
			},
			process.env.JWT_SECRET
		);
		const { password: hashedPassword, ...rest } = user._doc;
		const expiryDate = new Date(Date.now() + 3600000); //1hr
		return res
			.cookie("access_token", token, {
				httpOnly: true,
				expires: expiryDate,
			})
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

export const google = async (req, res, next) => {
	const { fullname, email, profileImage } = req.body;
	const username = req.body.username.toLowerCase();
	const contact = Number(req.body.contact);
	try {
		const user = await UserModel.findOne({ username });
		if (!user) {
			const newUser = await UserModel.create({
				username,
				fullname,
				email,
				contact,
				profileImage,
			});
			if (!newUser)
				return next(errorHandler(500, "Something went wrong"));
			const token = jwt.sign(
				{
					id: newUser._id,
					user: {
						username: newUser.username,
						email: newUser.email,
						fullname: newUser.fullname,
						profileImage: newUser.profileImage,
						role: newUser.role,
						isActve: newUser.isActive,
					},
				},
				process.env.JWT_SECRET
			);
			const expiryDate = new Date(Date.now() + 3600000); //1hr
			const { password: hashedPassword, ...rest } = newUser._doc;
			return res
				.cookie("access_token", token, {
					httpOnly: true,
					expires: expiryDate,
				})
				.status(200)
				.json(rest);
		}
		const token = jwt.sign(
			{
				id: user._id,
				user: {
					username: user.username,
					email: user.email,
					fullname: user.fullname,
					profileImage: user.profileImage,
					role: user.role,
					isActve: user.isActive,
				},
			},
			process.env.JWT_SECRET
		);
		const expiryDate = new Date(Date.now() + 3600000); //1hr
		const { password: hashedPassword, ...rest } = user._doc;
		return res
			.cookie("access_token", token, {
				httpOnly: true,
				expires: expiryDate,
			})
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

export const signout = async (req, res, next) => {
	res.clearCookie("access_token").status(200).json("Signout Successfully");
};
