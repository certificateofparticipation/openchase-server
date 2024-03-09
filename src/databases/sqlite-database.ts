import sqlite3, {Database} from "sqlite3"

class sqlite_database {
    connection: Database;
    constructor() {
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
        this.connection.prepare("CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user TEXT NOT NULL, hash TEXT NOT NULL, admin BOOL NOT NULL);").run()
        this.connection.prepare("CREATE TABLE IF NOT EXISTS experiences(experience_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, owner_id INT, FOREIGN KEY (owner_id) REFERENCES users (user_id));").run()
        this.connection.prepare("SELECT COUNT(*) FROM users;").get((err, rows: any) => {
            if (rows["COUNT(*)"] <= 0) {
                console.warn("There was no user accounts registered! Automatically making a default admin account...")
                // admin:admin
                this.connection.prepare("INSERT INTO users (user, hash, admin) VALUES (\"admin\", \"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918\", 1);").run()
                console.log("Default user created! Log in with admin:admin")
            }
        })
    }

    create_experience() {
    }
}

module.exports = sqlite_database