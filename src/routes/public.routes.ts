import { Router } from "express";
import SharkController from "../controllers/Shark.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const publicRoutes = Router();

publicRoutes.route("/login")
    .post(SharkController.signIn);
    
publicRoutes.route("/validateToken")
    .get(authMiddleware, SharkController.getSharkFromRequest);

export default publicRoutes;

