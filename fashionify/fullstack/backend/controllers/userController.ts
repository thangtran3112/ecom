import { Request, Response } from "express";
import userModel from "../models/userModel";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id: string) => {
  //if we are using expriresIn, we need to delete the user if the token expires
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    // expiresIn: "1d",
  });
};

// Route for user login
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/*
 * Route for user register.
 * This is simplified. In actualy project, we have to send user an email validation link.
 * This would avoid malicious users to create fake accounts with other people's email address.
 * There could also be a captcha to avoid bot registrations.
 */
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password. Better to use Zod
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a longer password",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req: Request, res: Response) => {};

export { loginUser, registerUser, adminLogin };
