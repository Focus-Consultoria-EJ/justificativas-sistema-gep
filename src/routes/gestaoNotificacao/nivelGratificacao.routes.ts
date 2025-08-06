import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import NivelGratificacaoController from "../../controllers/gestaoNotificacao/NivelGratificacao.controller";

const nivelGratificacaoRoutes = Router();

nivelGratificacaoRoutes.route("/niveis-gratificacao")
    .get(authMiddleware, NivelGratificacaoController.select)
    .post(authMiddleware, gepAuthMiddleware, NivelGratificacaoController.save);

nivelGratificacaoRoutes.route("/niveis-gratificacao/:id")
    .get(authMiddleware, NivelGratificacaoController.select)
    .put(authMiddleware, gepAuthMiddleware, NivelGratificacaoController.save)
    .delete(authMiddleware, gepAuthMiddleware, NivelGratificacaoController.delete);

export default nivelGratificacaoRoutes;

