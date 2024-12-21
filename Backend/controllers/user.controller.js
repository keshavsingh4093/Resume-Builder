import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import "dotenv/config";

const generateOtp = () => Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_USER_PASS,
  },
});

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const OTP = generateOtp();

        await transporter.sendMail({
          to: email,
          from: "resume@builder.com",
          subject: "OTP Verification for Resume Builder",
          html:
           `<p>OTP for Sign up on Resume builder</p>
            <h2>${OTP}</h2>`,
        });

        res.status(200).json({
            message: "OTP has been send successfully",
            OTP
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: "Something went wrong" });
    }
}

const signUpUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        console.log(email,name,password);

        const chechUser = await User.findOne({ email });

        if (chechUser) {
            console.log("user already exist with this email");
            return res.status(400).json({ message: "user had signed up already" });
        }

        const hashPassword = await argon2.hash(password);

        const user = new User({
            name,
            email,
            password: hashPassword
        });

        await user.save();

        res.status(201).json({
            message: "Signup successful"
        })

    } catch (error) {
        console.log(error.message);
        res.status(401).json({ message: "Invalid credentials" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            console.log("user is not present in database with this email");
            return res
              .status(400)
              .json({ message: "Incorrect email or password" });
        }

        const isValidUser = await argon2.verify(user.password, password);

        if (!isValidUser) {
            console.log("Incorrect email or password");
            return res.status(400).json({ message: "Incorrect email or password" });
        }

        const accessToken = jwt.sign(
          { email, name: user.name },
          process.env.JWT_ACCESS_PASS,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { email, name: user.name },
          process.env.JWT_REFRESH_PASS,
          { expiresIn: "7d" }
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, 
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({ message: "login successful" });

    } catch (error) {
        console.log(error.message);
        res.status(401).json(error.message);
    }
}

const forgotPassword = async (req, res) => {
   try {
       const { email } = req.body;

       const user = await User.findOne({ email });

       if (!user) {
           console.log("user is not present in database with this email");
           return res
             .status(400)
             .json({ message: "user not exist for this email" });
       }

       const resetToken = jwt.sign({ id: user._id, email, name: user.name }, process.env.JWT_RESET_PASS, { expiresIn: "5m" });

       const OTP = generateOtp();

       await transporter.sendMail({
         to: email,
         from: "resume@builder.com",
         subject: "Forgot Password OTP for Resume Builder",
         html: `<p>OTP for Forgot Password on Resume builder</p>
            <P>This OTP is valid for 5 minutes.</p>
            <h2>${OTP}</h2>`,
       });

       res.cookie("resetToken", resetToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 5 * 60 * 1000,
        });

       res.status(200).json({
         message: "OTP has been send successfully",
         OTP,
       });
       
   } catch (error) {
       console.log(error.message);
       res.status(400).json(error.message);
   }
    
}

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;

        const resetToken = req.cookies.resetToken;

        if (!resetToken) {
            console.log("reset token has been deleted from cookies");
            return res
              .status(400)
              .json({ message: "Otp was valid for only 5 minutes" });
        }

        const decode = jwt.verify(resetToken, process.env.JWT_RESET_PASS);

        const user = await User.findOne({ _id: decode.id });

        const hashPassword = await argon2.hash(password);

        user.password = hashPassword;

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.log("Invalid reset token");
        res.status(400).json({message:"Something went wrong"});
    }
}

const checkForToken = async (req, res, next) => {
    const accessToken = req.cookies["accessToken"];

    if (accessToken) {
        try {
            const decode = jwt.verify(accessToken, process.env.JWT_ACCESS_PASS);

            res.locals = decode;

            next();

        } catch (error) {
            console.log("invalid access token");
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } else {
        try {
            const refreshToken = req.cookies["refreshToken"];

            if (!refreshToken) {
                console.log("Neither Access nor Refresh token is present");
                return res.status(401).json({ message: "Unauthorized Access" });
            }

            const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_PASS);

            const newAccessToken = jwt.sign(
              { email: decode.email, name: decode.name },
                process.env.JWT_ACCESS_PASS,
              {expiresIn: "2m"}
            );
            
            res.cookie("accessToken", newAccessToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 2 * 60 * 1000,
            });

            res.locals = decode;
            next();

        } catch (error) {
            console.log("invalid refresh token");
            res.status(401).json({ message: "Unauthorized Access" });
        }
    }
    
}

export {
  sendOtp,
  signUpUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkForToken,
};