import { Router } from "express";
import SharkController from "../controllers/Shark.controller";

const publicRoutes = Router();

publicRoutes.route("/login")
    .post(SharkController.signIn);

publicRoutes.route("/forgot-password")
    .post(SharkController.forgotPassword);

publicRoutes.route("/reset-password")
    .post(SharkController.resetPassword);

export default publicRoutes;

