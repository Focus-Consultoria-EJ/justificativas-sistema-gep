import { Router } from "express";
import CelulaController from "../controllers/Celula.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const celulaRoutes = Router();

celulaRoutes.route("/celulas")
    .get(authMiddleware, adminMiddleware, CelulaController.select)
    .post(authMiddleware, adminMiddleware, CelulaController.save);

celulaRoutes.route("/celulas/:id")
    .get(authMiddleware, adminMiddleware, CelulaController.select)
    .put(authMiddleware, adminMiddleware, CelulaController.save)
    .delete(authMiddleware, adminMiddleware, CelulaController.delete);

export default celulaRoutes;

