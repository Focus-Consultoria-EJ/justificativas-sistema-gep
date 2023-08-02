import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import OcorenciaController from "../../controllers/gestaoNotificacao/Ocorencia.controller";

const ocorrenciaRoutes = Router();

ocorrenciaRoutes.route("/ocorrencias")
    .get(authMiddleware,  gepAuthMiddleware, OcorenciaController.select)
    .post(authMiddleware, OcorenciaController.save);

ocorrenciaRoutes.route("/ocorrencias/:id")
    .get(authMiddleware, gepAuthMiddleware, OcorenciaController.select)
    .put(authMiddleware, gepAuthMiddleware, OcorenciaController.save)
    .delete(authMiddleware, gepAuthMiddleware, OcorenciaController.delete);

export default ocorrenciaRoutes;

