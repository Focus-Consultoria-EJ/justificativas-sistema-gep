import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import TipoAssuntoController from "../controllers/TipoAssunto.controller";
import { gepAuthMiddleware } from "../middlewares/gepAuth.middleware";

const tipoAssuntosRoutes = Router();

tipoAssuntosRoutes.route("/tipo-assuntos")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoAssuntoController.select)
    .post(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoAssuntoController.save);

tipoAssuntosRoutes.route("/tipo-assuntos/:id")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoAssuntoController.select)
    .put(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoAssuntoController.save)
    .delete(authMiddleware, gepAuthMiddleware, adminMiddleware, TipoAssuntoController.delete);

export default tipoAssuntosRoutes;

