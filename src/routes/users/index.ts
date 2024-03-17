import Router from "express"
import jwt from "jsonwebtoken"

import {Database, JWTSecret} from "../../app"
import {getHeaders, verifyAuthorization} from "../../utility/utility"

const router = Router();
router.get('/login', (req, res) => {
    getHeaders(req, "name", "hash").then(([name, hash]) => {
        Database.getUser(name, hash).then((user) => {
            res.status(200)
            res.send(jwt.sign({
                name: user.name,
                admin: user.admin
            }, JWTSecret))
        }).catch(() => {
            res.status(403)
            res.send()
        })
    }).catch((rej) => {
        res.status(400)
        res.send("No " + rej + " was provided")
    })
})

router.get("/create", (req, res) => {
    verifyAuthorization(req).then((token) => {
        if (!token.admin) {
            res.status(403)
            res.send()
            return;
        }
        getHeaders(req, "name", "hash", "admin").then(([name, hash, admin]) => {
            Database.createUser(name, hash, admin == "true").then((status) => {
                if (status) {
                    res.status(200)
                    res.send()
                } else {
                    res.status(400)
                    res.send("User already exists")
                }
            })
        }).catch((rej) => {
            res.status(400)
            res.send("No " + rej + " was provided")
        })
    }).catch((code) => {
        res.status(code)
        res.send(code == 400 ? "No authorization token was provided" : "Invalid authorization token")
    })
})

export default router
