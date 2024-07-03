import { Sequelize } from "sequelize";
import 'dotenv/config';

export const sequelize = new Sequelize(
    process.env.DB_DATABASE, //db name
    process.env.DB_USER, //usere name
    process.env.DB_PASSWORD, //password
    {
        hots: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: console.log,
    }
);