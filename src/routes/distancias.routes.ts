import { Router } from "express";
import DistanciaResidenciaController from "../controllers/DistanciaResidencia.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const distanciaResRoutes = Router();

distanciaResRoutes.route("/distancias")
    .get(authMiddleware, adminMiddleware, DistanciaResidenciaController.select)
    .post(authMiddleware, adminMiddleware, DistanciaResidenciaController.save);

distanciaResRoutes.route("/distancias/:id")
    .get(authMiddleware, adminMiddleware, DistanciaResidenciaController.select)
    .put(authMiddleware, adminMiddleware, DistanciaResidenciaController.save)
    .delete(authMiddleware, adminMiddleware, DistanciaResidenciaController.delete);

export default distanciaResRoutes;

