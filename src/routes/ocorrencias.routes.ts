import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import OcorenciaController from "../controllers/Ocorencia.controller";

const ocorrenciaRoutes = Router();

ocorrenciaRoutes.route("/ocorrencias")
    .get(authMiddleware, adminMiddleware, OcorenciaController.select)
    .post(authMiddleware, OcorenciaController.save);

ocorrenciaRoutes.route("/ocorrencias/:id")
    .get(authMiddleware, adminMiddleware, OcorenciaController.select)
    .put(authMiddleware, adminMiddleware, OcorenciaController.save)
    .delete(authMiddleware, adminMiddleware, OcorenciaController.delete);

export default ocorrenciaRoutes;

