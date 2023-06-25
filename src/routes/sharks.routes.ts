import { Router } from "express";
import SharkController from "../controllers/Shark.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const sharkRoutes = Router();

sharkRoutes.route("/sharks")
    .get(authMiddleware, adminMiddleware, SharkController.select)
    .post(authMiddleware, adminMiddleware, SharkController.save);
    
sharkRoutes.route("/sharks/:id")
    .get(authMiddleware, adminMiddleware, SharkController.select)
    .put(authMiddleware, adminMiddleware, SharkController.save)
    .delete(authMiddleware, adminMiddleware, SharkController.delete);

export default sharkRoutes;

