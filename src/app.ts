import express, {Express} from "express"
import dotenv from "dotenv"
import * as crypto from "crypto";

import IDatabase from "./databases/Database"
import SQLiteDatabase from "./databases/sqlite-database"
import indexRouter from "./routes/index"
import usersRouter from "./routes/users/index"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000
const databaseType = process.env.DATABASE_TYPE || "sqlite"

export const JWTSecret = crypto.randomBytes(32).toString("hex")
export let Database: IDatabase;

switch (databaseType) {
    case "sqlite":
        console.log("Loading sqlite database")
        Database = new SQLiteDatabase()
        break
    /*
    case "mysql":
        console.log("Loading mysql database")
        const mysql_database = require("./databases/mysql-database")
        database = new mysql_database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE)
        break
     */
    default:
        throw new Error("Invalid database type!")
}

app.use(indexRouter)
app.use(usersRouter)

app.listen(port, () => {
    console.log(`App started at http://localhost:${port}`)
})