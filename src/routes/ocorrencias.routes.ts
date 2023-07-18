import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import OcorenciaController from "../controllers/Ocorencia.controller";
import { gepAuthMiddleware } from "../middlewares/gepAuth.middleware";

const ocorrenciaRoutes = Router();

ocorrenciaRoutes.route("/ocorrencias")
    .get(authMiddleware,  gepAuthMiddleware, adminMiddleware, OcorenciaController.select)
    .post(authMiddleware, OcorenciaController.save);

ocorrenciaRoutes.route("/ocorrencias/:id")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, OcorenciaController.select)
    .put(authMiddleware, gepAuthMiddleware, adminMiddleware, OcorenciaController.save)
    .delete(authMiddleware, gepAuthMiddleware, adminMiddleware, OcorenciaController.delete);

export default ocorrenciaRoutes;

