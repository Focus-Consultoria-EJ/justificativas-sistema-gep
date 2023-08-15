import { Router } from "express";
import publicRoutes from "./public.routes";
import sharkRoutes from "./sharks.routes";
import celulaRoutes from "./celulas.routes";
import distanciaResRoutes from "./gestaoNotificacao/distancias.routes";
import tipoOcorrenciasRoutes from "./gestaoNotificacao/tipoOcorrencias.routes";
import tipoAssuntosRoutes from "./gestaoNotificacao/tipoAssuntos.routes";
import ocorrenciaRoutes from "./gestaoNotificacao/ocorrencias.routes";
import nivelGratificacaoRoutes from "./gestaoNotificacao/nivelGratificacao.routes";
import nivelAdvertenciaRoutes from "./gestaoNotificacao/nivelAdvertencia.routes";
import servicosRoutes from "./precificacao/servicos.routes";

const routes = Router();

routes.use(publicRoutes);
routes.use(sharkRoutes);
routes.use(celulaRoutes);

// Gestão de Notificação
routes.use(distanciaResRoutes);
routes.use(tipoOcorrenciasRoutes);
routes.use(tipoAssuntosRoutes);
routes.use(ocorrenciaRoutes);
routes.use(nivelGratificacaoRoutes);
routes.use(nivelAdvertenciaRoutes);

// Precificação
routes.use(servicosRoutes);

export default routes;