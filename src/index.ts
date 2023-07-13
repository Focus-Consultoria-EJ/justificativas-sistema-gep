import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";
import ErrorMiddleware from "./middlewares/Error.middleware";
import routes from "./routes/routes";

const PORT = process.env.PORT;
const app = express();

/* Middlewares */
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Rotas
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/", routes);

// Este middleware precisa sempre estar abaixo das rotas!
app.use(ErrorMiddleware.handle);

app.listen(PORT, () => { console.log(`Server listen in ${PORT}`); });

    
