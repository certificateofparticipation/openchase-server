import Router from "express"
import jwt from "jsonwebtoken"

import {Database, JWTSecret} from "../../app"
import {stripBearer, verifyJWT} from "../../utility/utility"

const router = Router();
router.get('/api/v1/users/login', (req, res) => {
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

    Database.getUser(username, hash).then((allowed: [boolean, boolean]) => {
        if (allowed[0]) {
            res.status(200)
            res.send(jwt.sign({admin: allowed[1]}, JWTSecret))
        } else {
            res.status(403)
            res.send()
        }
    })
})

router.get("/api/v1/users/test", (req, res) => {
    let token = req.get("Authorization")
    if (!token) {
        res.status(401)
        res.send("No authorization token given")
        return
    }
    token = stripBearer(token)
    verifyJWT(token).then((allowed: [boolean, boolean]) => {
        if (allowed[0]) {
            res.status(200)
            res.send(allowed[1])
        } else {
            res.status(403)
            res.send()
        }
    })
})

export default router
