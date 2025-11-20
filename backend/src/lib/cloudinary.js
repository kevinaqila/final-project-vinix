import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-photos",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export const orderFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "order-files",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx", "xls", "xlsx", "txt", "zip"],
    resource_type: "auto", // Allow both images and raw files
  },
});

export default cloudinary;
