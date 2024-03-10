import sqlite3, {Database} from "sqlite3"
import IDatabase from './Database'
import bcrypt from "bcrypt"

export default class sqlite_database implements IDatabase {
    connection: Database;
    jwtSecret: string;

    constructor(jwtSecret: string) {
        this.jwtSecret = jwtSecret
        this.connection = new sqlite3.Database("./database.db", (err) => {
            if (err) {
                console.error("Something went wrong while connecting to the database!")
                throw err
            }

            this.#initialize()
        })
    }

    #initialize() {
        console.log("Initializing database")
        this.connection.prepare(`CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user TEXT NOT NULL, hash TEXT NOT NULL, admin BOOL NOT NULL);`).run()
        this.connection.prepare(`CREATE TABLE IF NOT EXISTS experiences (experience_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, owner_id INT, FOREIGN KEY (owner_id) REFERENCES users (user_id));`).run()
        this.connection.prepare(`SELECT COUNT(*) FROM users;`).get((err, rows: any) => {
            if (err) {
                throw err
            }
            if (rows["COUNT(*)"] <= 0) {
                console.warn("There was no user accounts registered! Automatically making a default admin account...")
                // admin:admin
                bcrypt.hash("admin", process.env.SALT_ROUNDS || 8, (err, hash) => {
                    if (err) {
                        throw err
                    }
                    this.connection.prepare(`INSERT INTO users (user, hash, admin) VALUES ("admin", ?, 1);`).run(hash)
                    console.log("Default user created! Log in with admin:admin")
                })

            }
        })
    }

    async getUser(user: string, hash: string): Promise<[boolean, boolean]> {
        return new Promise<[boolean, boolean]>((res, rej) => {
            this.connection.prepare("SELECT * FROM users WHERE user = ? AND hash = ?").get([user, hash], (err, rows: any) => {
                if (err) {
                    rej(err)
                }
                if (rows) {
                    if (rows["admin"] == 1) {
                        res([true, true])
                    } else {
                        res([true, false])
                    }
                } else {
                    res([false, false])
                }

            })
        })
    }
}