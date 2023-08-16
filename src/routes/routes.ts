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
import porteClientesRoutes from "./precificacao/porteClientes.routes";
import clientesRoutes from "./precificacao/clientes.routes";
import TipoPrecoRoutes from "./precificacao/tipoPrecos.routes";
import PrecificacoesRoutes from "./precificacao/precificacoes.routes";

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
routes.use(porteClientesRoutes);
routes.use(clientesRoutes);
routes.use(TipoPrecoRoutes);
routes.use(PrecificacoesRoutes);

export default routes;