import { Router } from "express";
import ServicoController from "../../controllers/precificacao/Servico.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { precAuthMiddleware } from "../../middlewares/precAuth.middleware";

const servicosRoutes = Router();

servicosRoutes.route("/servicos")
    .get(authMiddleware, ServicoController.select)
    .post(authMiddleware, precAuthMiddleware, ServicoController.save);

servicosRoutes.route("/servicos/:id")
    .get(authMiddleware, ServicoController.select)
    .put(authMiddleware, precAuthMiddleware, ServicoController.save)
    .delete(authMiddleware, precAuthMiddleware, ServicoController.delete);

export default servicosRoutes;

