import { Sequelize } from "sequelize";
import dotenv, { parse } from "dotenv";
dotenv.config();

const password = process.env.PG_PASSWORD;
const user = process.env.PG_USER;
const host = process.env.PG_HOST;
const database = process.env.PG_DATABASE;
const port = process.env.PG_PORT;

if (!password || !user || !host || !database || !port) {
    throw new Error("Please provide all the necessary environment variables");
}

export const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: "postgres",
    port: parseInt(port),
});
