import { Router } from "express";
import SharkController from "../controllers/Shark.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { gepAuthMiddleware } from "../middlewares/gepAuth.middleware";

const sharkRoutes = Router();

sharkRoutes.route("/sharks")
    .get(authMiddleware, SharkController.select)
    .post(authMiddleware, gepAuthMiddleware, SharkController.save);
    
sharkRoutes.route("/sharks/:id")
    .get(authMiddleware, SharkController.select)
    .put(authMiddleware, gepAuthMiddleware, SharkController.save)
    .delete(authMiddleware, gepAuthMiddleware, SharkController.delete);

export default sharkRoutes;

