import { Router } from "express";
import AuthController from "../controller/AuthController";
import SharkController from "../controller/SharkController";
import { authMiddleware } from "../middlewares/authMiddleware";

const publicRoutes = Router();

publicRoutes.post("/login", AuthController.login);
publicRoutes.get("/validateToken", authMiddleware, SharkController.getShark);

export default publicRoutes;

