import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import TipoOcorenciaController from "../../controllers/gestaoNotificacao/TipoOcorencia.controller";

const tipoOcorrenciasRoutes = Router();

tipoOcorrenciasRoutes.route("/tipo-ocorrencias")
    .get(authMiddleware, gepAuthMiddleware, TipoOcorenciaController.select)
    .post(authMiddleware, gepAuthMiddleware, TipoOcorenciaController.save);

tipoOcorrenciasRoutes.route("/tipo-ocorrencias/:id")
    .get(authMiddleware, gepAuthMiddleware, TipoOcorenciaController.select)
    .put(authMiddleware, gepAuthMiddleware, TipoOcorenciaController.save)
    .delete(authMiddleware, gepAuthMiddleware, TipoOcorenciaController.delete);

export default tipoOcorrenciasRoutes;

