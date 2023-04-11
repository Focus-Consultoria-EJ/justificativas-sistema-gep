import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import TipoOcorrenciaController from "../controller/TipoOcorrenciaController";

const tipoOcorrencia = Router();

tipoOcorrencia.get("/tipo-ocorrencias", authMiddleware, adminMiddleware, TipoOcorrenciaController.select);
tipoOcorrencia.post("/tipo-ocorrencias", authMiddleware, adminMiddleware, TipoOcorrenciaController.save);
tipoOcorrencia.put("/tipo-ocorrencias/:id", authMiddleware, adminMiddleware, TipoOcorrenciaController.save);
tipoOcorrencia.delete("/tipo-ocorrencias/:id", authMiddleware, adminMiddleware, TipoOcorrenciaController.delete);

export default tipoOcorrencia;

