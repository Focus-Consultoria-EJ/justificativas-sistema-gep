import { Router } from "express";
import CelulaController from "../controllers/Celula.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const celulaRoutes = Router();

celulaRoutes.route("/celulas")
    .get(authMiddleware, adminMiddleware, CelulaController.select);
//.post(authMiddleware, adminMiddleware, CelulaController.save);

celulaRoutes.route("/celulas/:id")
    .get(authMiddleware, adminMiddleware, CelulaController.select);
//.put(authMiddleware, adminMiddleware, CelulaController.save)
//.delete(authMiddleware, adminMiddleware, CelulaController.delete);

export default celulaRoutes;

