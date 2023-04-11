import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import TipoAssuntoController from "../controller/TipoAssuntoController";

const tipoAssuntoRoutes = Router();

tipoAssuntoRoutes.get("/tipo-assuntos", authMiddleware, adminMiddleware, TipoAssuntoController.select);
tipoAssuntoRoutes.post("/tipo-assuntos", authMiddleware, adminMiddleware, TipoAssuntoController.save);
tipoAssuntoRoutes.put("/tipo-assuntos/:id", authMiddleware, adminMiddleware, TipoAssuntoController.save);
tipoAssuntoRoutes.delete("/tipo-assuntos/:id", authMiddleware, adminMiddleware, TipoAssuntoController.delete);

export default tipoAssuntoRoutes;

