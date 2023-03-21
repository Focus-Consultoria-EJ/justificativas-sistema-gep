import { Router } from "express";
import OcorrenciaController from "../controller/OcorrenciaController";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const ocorrenciasRoutes = Router();

ocorrenciasRoutes.get("/ocorrencias", authMiddleware, adminMiddleware, OcorrenciaController.select);
ocorrenciasRoutes.post("/ocorrencias/", authMiddleware, OcorrenciaController.save);
ocorrenciasRoutes.delete("/ocorrencias/:id", authMiddleware, adminMiddleware, OcorrenciaController.delete);
ocorrenciasRoutes.get("/ocorrencias/:id", authMiddleware, adminMiddleware, OcorrenciaController.select);
ocorrenciasRoutes.put("/ocorrencias/:id", authMiddleware, adminMiddleware, OcorrenciaController.save);

export default ocorrenciasRoutes;
