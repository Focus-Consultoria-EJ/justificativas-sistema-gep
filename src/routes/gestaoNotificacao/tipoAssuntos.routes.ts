import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import TipoAssuntoController from "../../controllers/gestaoNotificacao/TipoAssunto.controller";

const tipoAssuntosRoutes = Router();

tipoAssuntosRoutes.route("/tipo-assuntos")
    .get(authMiddleware, TipoAssuntoController.select)
    .post(authMiddleware, gepAuthMiddleware, TipoAssuntoController.save);

tipoAssuntosRoutes.route("/tipo-assuntos/:id")
    .get(authMiddleware, TipoAssuntoController.select)
    .put(authMiddleware, gepAuthMiddleware, TipoAssuntoController.save)
    .delete(authMiddleware, gepAuthMiddleware, TipoAssuntoController.delete);

export default tipoAssuntosRoutes;

