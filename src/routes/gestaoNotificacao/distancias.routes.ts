import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import DistanciaResidenciaController from "../../controllers/gestaoNotificacao/DistanciaResidencia.controller";

const distanciaResRoutes = Router();

distanciaResRoutes.route("/distancias")
    .get(authMiddleware, adminMiddleware, DistanciaResidenciaController.select);
//.post(authMiddleware, adminMiddleware, DistanciaResidenciaController.save);

distanciaResRoutes.route("/distancias/:id")
    .get(authMiddleware, adminMiddleware, DistanciaResidenciaController.select);
//.put(authMiddleware, adminMiddleware, DistanciaResidenciaController.save)
//.delete(authMiddleware, adminMiddleware, DistanciaResidenciaController.delete);

export default distanciaResRoutes;

