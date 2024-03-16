import Router from "express"
import jwt from "jsonwebtoken"

import {Database, JWTSecret} from "../../app"
import {stripBearer, verifyJWT, getHeader} from "../../utility/utility"

const router = Router();
router.get('/api/v1/users/login', (req, res) => {
    let username = getHeader(req, res, "username", 400, "No username was provided")
    if (username == null) {
        return;
    }
    let hash = getHeader(req, res, "hash", 400, "No hash was provided")
    if (hash == null) {
        return;
    }

    Database.getUser(username, hash).then((allowed: [boolean, boolean]) => {
        if (allowed[0]) {
            res.status(200)
            res.send(jwt.sign({
                name: username,
                admin: allowed[1]
            }, JWTSecret))
        } else {
            res.status(403)
            res.send()
        }
    })
})

router.get("/api/v1/users/create", (req, res) => {
    let token = getHeader(req, res, "Authorization", 400, "No authorization token was provided")
    if (token == null) {
        return;
    }
    token = stripBearer(token)
    verifyJWT(token).then((allowed: [boolean, boolean]) => {
        if (allowed[0]) {
            let username = getHeader(req, res, "username", 400, "No username was provided")
            if (username == null) {
                return;
            }
            let hash = getHeader(req, res, "hash", 400, "No hash was provided")
            if (hash == null) {
                return;
            }
            let admin = getHeader(req, res, "hash", 400, "No hash was provided")
            if (admin == null) {
                return;
            }
            Database.createUser(username, hash, admin == "true").then((status) => {
                if (status) {
                    res.status(200)
                    res.send()
                } else {
                    res.status(400)
                    res.send("User already exists")
                }
            })
        } else {
            res.status(403)
            res.send()
        }
    })
})

export default router
