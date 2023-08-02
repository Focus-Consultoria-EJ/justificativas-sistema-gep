import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import NivelAdvertenciaController from "../../controllers/gestaoNotificacao/NivelAdvertencia.controller";

const nivelAdvertenciaRoutes = Router();

nivelAdvertenciaRoutes.route("/niveis-advertencia")
    .get(authMiddleware, gepAuthMiddleware, NivelAdvertenciaController.select)
    .post(authMiddleware, gepAuthMiddleware, NivelAdvertenciaController.save);

nivelAdvertenciaRoutes.route("/niveis-advertencia/:id")
    .get(authMiddleware, gepAuthMiddleware, NivelAdvertenciaController.select)
    .put(authMiddleware, gepAuthMiddleware, NivelAdvertenciaController.save)
    .delete(authMiddleware, gepAuthMiddleware, NivelAdvertenciaController.delete);

export default nivelAdvertenciaRoutes;

