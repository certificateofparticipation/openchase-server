import Router, {Request, Response} from "express"

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200)
    res.send("Openchase-server Version 1.0.0")
});

export default router
