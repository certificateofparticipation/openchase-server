import Router, {Request, Response} from "express"
import jwt from "jsonwebtoken"

import IDatabase from "../../databases/Database"
export default (database: IDatabase, jwtSecret: string) => {
    const router = Router();

    router.get('/api/v1/users/login', (req: Request, res: Response) => {
        let username = req.get("username")
        let hash = req.get("hash")
        if (!username) {
            res.status(400)
            res.send("No username was provided")
            return
        }
        if (!hash) {
            res.status(400)
            res.send("No hash was provided")
            return
        }

        database.getUser(username, hash).then((allowed: [boolean, boolean]) => {
            if (allowed[0]) {
                res.status(200)
                res.send(jwt.sign({admin: allowed[1]}, jwtSecret))
            } else {
                res.status(403)
                res.send()
            }
        })
    })

    return router
}
