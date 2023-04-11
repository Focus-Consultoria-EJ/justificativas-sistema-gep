import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
import sharkRoutes from "./routes/sharks.routes";
import ocorrenciasRoutes from "./routes/ocorrencias.routes";
import publicRoutes from "./routes/public.routes";
import tipoAssuntoRoutes from "./routes/tipoAssunto.routes";
import tipoOcorrencia from "./routes/tipoOcorrencia.routes";

const PORT = process.env.PORT;
const app = express();

/* Middlewares */
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Rotas
app.use("/api/", publicRoutes);
app.use("/api/", sharkRoutes);
app.use("/api/", ocorrenciasRoutes);
app.use("/api/", tipoAssuntoRoutes);
app.use("/api/", tipoOcorrencia);

app.listen(PORT, () => { console.log(`Server listen in ${PORT}`); });

    
