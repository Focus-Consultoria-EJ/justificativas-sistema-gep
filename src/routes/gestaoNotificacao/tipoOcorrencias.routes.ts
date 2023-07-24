import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import TipoOcorenciaController from "../../controllers/gestaoNotificacao/TipoOcorencia.controller";

const tipoOcorrenciasRoutes = Router();

tipoOcorrenciasRoutes.route("/tipo-ocorrencias")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.select)
    .post(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.save);

tipoOcorrenciasRoutes.route("/tipo-ocorrencias/:id")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.select)
    .put(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.save)
    .delete(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoOcorenciaController.delete);

export default tipoOcorrenciasRoutes;

