import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import DistanciaResidenciaController from "../../controllers/gestaoNotificacao/DistanciaResidencia.controller";

const distanciaResRoutes = Router();

distanciaResRoutes.route("/distancias")
    .get(authMiddleware, DistanciaResidenciaController.select);
//.post(authMiddleware, DistanciaResidenciaController.save);

distanciaResRoutes.route("/distancias/:id")
    .get(authMiddleware, DistanciaResidenciaController.select);
//.put(authMiddleware, DistanciaResidenciaController.save)
//.delete(authMiddleware, DistanciaResidenciaController.delete);

export default distanciaResRoutes;

