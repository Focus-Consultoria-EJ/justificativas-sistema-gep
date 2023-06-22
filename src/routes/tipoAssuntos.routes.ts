import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import TipoAssuntoController from "../controllers/TipoAssunto.controller";

const tipoAssuntosRoutes = Router();

tipoAssuntosRoutes.route("/tipo-assuntos")
    .get(authMiddleware, adminMiddleware, TipoAssuntoController.select)
    .post(authMiddleware, adminMiddleware, TipoAssuntoController.save);

tipoAssuntosRoutes.route("/tipo-assuntos/:id")
    .get(authMiddleware, adminMiddleware, TipoAssuntoController.select)
    .put(authMiddleware, adminMiddleware, TipoAssuntoController.save)
    .delete(authMiddleware, adminMiddleware, TipoAssuntoController.delete);

export default tipoAssuntosRoutes;

