import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import { gepAuthMiddleware } from "../../middlewares/gepAuth.middleware";
import NivelGratificacaoController from "../../controllers/gestaoNotificacao/NivelGratificacao.controller";

const nivelGratificacaoRoutes = Router();

nivelGratificacaoRoutes.route("/niveis-gratificacao")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelGratificacaoController.select)
    .post(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelGratificacaoController.save);

nivelGratificacaoRoutes.route("/niveis-gratificacao/:id")
    .get(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelGratificacaoController.select)
    .put(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelGratificacaoController.save)
    .delete(authMiddleware, gepAuthMiddleware, adminMiddleware, NivelGratificacaoController.delete);

export default nivelGratificacaoRoutes;

