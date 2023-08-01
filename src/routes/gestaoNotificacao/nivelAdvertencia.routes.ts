import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import NivelAdvertenciaController from "../../controllers/gestaoNotificacao/NivelAdvertencia.controller";

const nivelAdvertenciaRoutes = Router();

nivelAdvertenciaRoutes.route("/niveis-advertencia")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelAdvertenciaController.select)
    .post(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelAdvertenciaController.save);

nivelAdvertenciaRoutes.route("/niveis-advertencia/:id")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelAdvertenciaController.select)
    .put(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelAdvertenciaController.save)
    .delete(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelAdvertenciaController.delete);

export default nivelAdvertenciaRoutes;

