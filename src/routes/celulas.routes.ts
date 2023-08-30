import { Router } from "express";
import CelulaController from "../controllers/Celula.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const celulaRoutes = Router();

celulaRoutes.route("/celulas")
    .get(authMiddleware, CelulaController.select);
//.post(authMiddleware, CelulaController.save);

celulaRoutes.route("/celulas/:id")
    .get(authMiddleware, CelulaController.select);
//.put(authMiddleware, CelulaController.save)
//.delete(authMiddleware, CelulaController.delete);

export default celulaRoutes;

