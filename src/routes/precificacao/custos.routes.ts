import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { precAuthMiddleware } from "../../middlewares/precAuth.middleware";
import CustoController from "../../controllers/precificacao/Custo.controller";

const CustoRoutes = Router();

CustoRoutes.route("/custos")
    .get(authMiddleware, CustoController.select)
    .post(authMiddleware, precAuthMiddleware, CustoController.save);

CustoRoutes.route("/custos/:id")
    .get(authMiddleware, CustoController.select)
    .put(authMiddleware, precAuthMiddleware, CustoController.save)
    .delete(authMiddleware, precAuthMiddleware, CustoController.delete);

export default CustoRoutes;

