import express, {Express} from "express"
import dotenv from "dotenv"
import * as crypto from "crypto";

import IDatabase from "./databases/Database"
import indexRouter from "./routes/index"
import usersRouter from "./routes/users/index"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

const jwtSecret = crypto.randomBytes(32).toString("hex")

const databaseType = process.env.DATABASE_TYPE || "sqlite"
let database: IDatabase;
switch (databaseType) {
    case "sqlite":
        console.log("Loading sqlite database")
        const sqlite_database = require("./databases/sqlite-database")
        database = new sqlite_database(jwtSecret)
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
app.use(usersRouter(database, jwtSecret))

app.listen(port, () => {
    console.log(`App started at http://localhost:${port}`)
})