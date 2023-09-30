import multer from "multer";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
export const FILE_MAX_SIZE = 3 * 1024 * 1024; // 3MB em bytes
export const ENABLE_UPLOAD_FILES = process.env.ENABLE_UPLOAD_FILES !== "false";

export default {
    localDir: {
        storage: multer.diskStorage({
            destination: path.resolve(__dirname, "..", "..", "uploads"),
            filename(req, file, cb)
            {
                cb(null, Date.now() + "_" + file.originalname);
            }
        }),
        limits: { fileSize: FILE_MAX_SIZE }
    },
    localMemory: {
        storage: multer.memoryStorage(),
        limits: { fileSize: FILE_MAX_SIZE }
    }
};