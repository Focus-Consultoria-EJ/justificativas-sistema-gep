import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: Number(process.env.MAILER_PORT),
    secure: true,
    auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASS,
    }
});

export default transport;

