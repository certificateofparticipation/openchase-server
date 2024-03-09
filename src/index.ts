import express, {Express} from "express"
import indexRouter from "./routes/index"

const app: Express = express()
const port = process.env.PORT || 3000

app.use(indexRouter)

const databaseType = process.env.DATABASE_TYPE || "sqlite"
let database;
switch (databaseType) {
    case "sqlite":
        console.log("Loading sqlite database")
        const sqlite_database = require("./databases/sqlite-database")
        database = new sqlite_database()
        break
    /*
    case "mysql":
        console.log("Loading mysql database")
        const mysql_database = require("./databases/mysql-database")
        database = new mysql_database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE)
        break
     */
    default:
        console.error("Invalid database type!")
}

database.create_experience()

app.listen(port, () => {
    console.log(`App started at http://localhost:${port}`)
})