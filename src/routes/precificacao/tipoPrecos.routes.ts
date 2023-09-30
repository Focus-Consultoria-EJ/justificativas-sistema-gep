import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { precAuthMiddleware } from "../../middlewares/precAuth.middleware";
import TipoPrecoController from "../../controllers/precificacao/TipoPreco.controller";

const TipoPrecoRoutes = Router();

TipoPrecoRoutes.route("/tipo-precos")
    .get(authMiddleware, TipoPrecoController.select)
    .post(authMiddleware, precAuthMiddleware, TipoPrecoController.save);

TipoPrecoRoutes.route("/tipo-precos/:id")
    .get(authMiddleware, TipoPrecoController.select)
    .put(authMiddleware, precAuthMiddleware, TipoPrecoController.save)
    .delete(authMiddleware, precAuthMiddleware, TipoPrecoController.delete);

export default TipoPrecoRoutes;

