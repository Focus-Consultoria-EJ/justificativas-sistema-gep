import { Router } from "express";
import SharkController from "../controllers/Shark.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { gepAuthMiddleware } from "../middlewares/gepAuth.middleware";

const sharkRoutes = Router();

sharkRoutes.route("/sharks")
    .get(authMiddleware, adminMiddleware, SharkController.select)
    .post(authMiddleware, gepAuthMiddleware, adminMiddleware, SharkController.save);
    
sharkRoutes.route("/sharks/:id")
    .get(authMiddleware, adminMiddleware, SharkController.select)
    .put(authMiddleware, gepAuthMiddleware, adminMiddleware, SharkController.save)
    .delete(authMiddleware, gepAuthMiddleware, adminMiddleware, SharkController.delete);

export default sharkRoutes;

