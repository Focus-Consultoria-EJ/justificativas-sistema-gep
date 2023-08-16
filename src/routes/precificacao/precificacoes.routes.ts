import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { precAuthMiddleware } from "../../middlewares/precAuth.middleware";
import PrecificacaoController from "../../controllers/precificacao/Precificacao.controller";

const PrecificacoesRoutes = Router();

PrecificacoesRoutes.route("/precificacoes")
    .get(authMiddleware, precAuthMiddleware, PrecificacaoController.select)
    .post(authMiddleware, precAuthMiddleware, PrecificacaoController.save);

PrecificacoesRoutes.route("/precificacoes/:id")
    .get(authMiddleware, precAuthMiddleware, PrecificacaoController.select)
    .put(authMiddleware, precAuthMiddleware, PrecificacaoController.save)
    .delete(authMiddleware, precAuthMiddleware, PrecificacaoController.delete);

export default PrecificacoesRoutes;

