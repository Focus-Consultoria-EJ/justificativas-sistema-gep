import { Router } from "express";
import publicRoutes from "./public.routes";
import sharkRoutes from "./sharks.routes";
import celulaRoutes from "./celulas.routes";
import distanciaResRoutes from "./distancias.routes";
import tipoOcorrenciasRoutes from "./tipoOcorrencias.routes";
import tipoAssuntosRoutes from "./tipoAssuntos.routes";
import ocorrenciaRoutes from "./ocorrencias.routes";

const routes = Router();

routes.use(publicRoutes);
routes.use(sharkRoutes);
routes.use(celulaRoutes);
routes.use(distanciaResRoutes);
routes.use(tipoOcorrenciasRoutes);
routes.use(tipoAssuntosRoutes);
routes.use(ocorrenciaRoutes);

export default routes;