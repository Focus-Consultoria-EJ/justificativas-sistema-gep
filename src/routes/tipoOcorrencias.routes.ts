import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import TipoOcorenciaController from "../controllers/TipoOcorencia.controller";
import { gepAuthMiddleware } from "../middlewares/gepAuth.middleware";

const tipoOcorrenciasRoutes = Router();

tipoOcorrenciasRoutes.route("/tipo-ocorrencias")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.select)
    .post(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.save);

tipoOcorrenciasRoutes.route("/tipo-ocorrencias/:id")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.select)
    .put(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.save)
    .delete(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.delete);

export default tipoOcorrenciasRoutes;

