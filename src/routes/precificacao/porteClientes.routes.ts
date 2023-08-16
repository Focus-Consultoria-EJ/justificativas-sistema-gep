import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { precAuthMiddleware } from "../../middlewares/precAuth.middleware";
import PorteClienteController from "../../controllers/precificacao/PorteCliente.controller";

const porteClientesRoutes = Router();

porteClientesRoutes.route("/portes-cliente")
    .get(authMiddleware, PorteClienteController.select)
    .post(authMiddleware, precAuthMiddleware, PorteClienteController.save);

porteClientesRoutes.route("/portes-cliente/:id")
    .get(authMiddleware, PorteClienteController.select)
    .put(authMiddleware, precAuthMiddleware, PorteClienteController.save)
    .delete(authMiddleware, precAuthMiddleware, PorteClienteController.delete);

export default porteClientesRoutes;

