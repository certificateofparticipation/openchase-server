import IDatabase from './Database'
import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client'

export default class sqlite_database implements IDatabase {
    prisma = new PrismaClient()

    constructor() {
        this.#initialize().then(() => {
            console.log("Successfully initialized database!")
        })
    }

    async #initialize() {
        let number = await this.prisma.user.count()
        if (number <= 0) {
            console.warn("There was no user accounts registered! Automatically making a default admin account...")
            // admin:admin
            bcrypt.hash("admin", 8, (err, hash) => {
                if (err) {
                    throw err
                }
                this.prisma.user.create({
                    data: {
                        name: "admin",
                        hash: hash,
                        admin: true
                    },
                }).then(() => {
                    console.log("Default user created! Log in with admin:admin")
                })
            })
        }
    }

    async getUser(name: string, hash: string): Promise<[boolean, boolean]> {
        let user = await this.prisma.user.findFirst({
            where: {
                name: name,
                hash: hash
            }
        })

        if (user == null) {
            return Promise.resolve([false, false])
        } else {
            return Promise.resolve([true, user.admin])
        }
    }
}