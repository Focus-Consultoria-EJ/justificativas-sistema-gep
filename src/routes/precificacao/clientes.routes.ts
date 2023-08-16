import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { precAuthMiddleware } from "../../middlewares/precAuth.middleware";
import ClienteController from "../../controllers/precificacao/Cliente.controller";

const clientesRoutes = Router();

clientesRoutes.route("/clientes")
    .get(authMiddleware, precAuthMiddleware, ClienteController.select)
    .post(authMiddleware, precAuthMiddleware, ClienteController.save);

clientesRoutes.route("/clientes/:id")
    .get(authMiddleware, precAuthMiddleware, ClienteController.select)
    .put(authMiddleware, precAuthMiddleware, ClienteController.save)
    .delete(authMiddleware, precAuthMiddleware, ClienteController.delete);

export default clientesRoutes;

