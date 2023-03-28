import { Router } from "express";
import SharkController from "../controller/SharkController";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
import multerConfig from "../config/multerS3";

const sharkRoutes = Router();

sharkRoutes.get("/sharks", authMiddleware, adminMiddleware, SharkController.select);
sharkRoutes.get("/sharks/profile", authMiddleware, SharkController.getShark);
sharkRoutes.post("/sharks/", authMiddleware, adminMiddleware, multer(multerConfig).single("file"), SharkController.save);
sharkRoutes.delete("/sharks/:id", authMiddleware, adminMiddleware, SharkController.delete);
sharkRoutes.get("/sharks/:id", authMiddleware, adminMiddleware, SharkController.select);
sharkRoutes.put("/sharks/:id", authMiddleware, adminMiddleware, multer(multerConfig).single("file"), SharkController.save);

export default sharkRoutes;

