import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all users
    const users = await User.find();
    return res.status(201).json({ message: "Ok", users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const userSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // User signup
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).send("User already registered");
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and stored cookie

    return res
      .status(200)
      .json({ message: "Ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // User Login
    const { email, password } = req.body;
    // const hashedPassword = await hash(password, 10);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered");
    }
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send("Password is incorrect");
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res
      .status(200)
      .json({ message: "Ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user token change
    const user = await User.findOne({ id: res.locals.jwtData.id });
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permission didn't match");
    }
    return res
      .status(200)
      .json({ message: "Ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "ERROR", cause: (error as Error).message });
  }
};
