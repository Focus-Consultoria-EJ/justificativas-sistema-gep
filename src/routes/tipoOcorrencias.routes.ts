import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import TipoOcorenciaController from "../controllers/TipoOcorencia.controller";

const tipoOcorrenciasRoutes = Router();

tipoOcorrenciasRoutes.route("/tipo-ocorrencias")
    .get(authMiddleware, adminMiddleware, TipoOcorenciaController.select)
    .post(authMiddleware, adminMiddleware, TipoOcorenciaController.save);

tipoOcorrenciasRoutes.route("/tipo-ocorrencias/:id")
    .put(authMiddleware, adminMiddleware, TipoOcorenciaController.save)
    .delete(authMiddleware, adminMiddleware, TipoOcorenciaController.delete);

export default tipoOcorrenciasRoutes;

