import { sendOtp, signUpUser, loginUser, forgotPassword, resetPassword, checkForToken } from "../controllers/user.controller.js"
import { uploadResume, getResumes } from "../controllers/resumeController.js";
import { User } from "../models/user.model.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
    res.status(200).json("hello from Resume Builder API");
})

userRouter.post("/send-otp", sendOtp);

userRouter.post("/signup", signUpUser);

userRouter.post("/login", loginUser);

userRouter.post("/forgot-password", forgotPassword);

userRouter.post("/reset-password", resetPassword);

userRouter.use(checkForToken);

userRouter.get("/get-user-details", async(req, res) => {
    const email = res.locals.email;

    const user = await User.findOne({ email });
            
    res.status(200).json({name:user.name,email:user.email});
})

userRouter.post("/upload-resume", uploadResume);

userRouter.get("/get-resumes", getResumes);

export { userRouter };