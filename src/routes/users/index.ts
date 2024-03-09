import Router, {Request, Response} from "express"
import IDatabase from '../../databases/Database'
export default (database: IDatabase) => {
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

        database.getUser(username, hash).then((allowed: boolean) => {
            res.status(200)
            res.send(allowed)
        })
    })

    return router
}
