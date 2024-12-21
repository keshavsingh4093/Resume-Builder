import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";
import "dotenv/config"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const uploadResume = async (req, res) => {
    try {
      const resume = req.files.resume;
        
      const email = res.locals.email;

      const result = await cloudinary.uploader.upload(resume.tempFilePath, { resource_type: "auto" });

      const url = cloudinary.url(result.public_id, { transformation: [{ quality: "auto", fetch_format: "auto" }] });

      console.log(url);

      const user = await User.findOne({ email });
      
      user.resumes.push(url);

      await user.save();

      res.status(200).json({ message: "resume upload successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
}

const getResumes = async (req, res) => {
  try {
    const email = res.locals.email;

    const user = await User.findOne({ email });

    console.log(user.resumes);
    res.status(200).json({ resumes: user.resumes });

  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
}

export { uploadResume, getResumes };

