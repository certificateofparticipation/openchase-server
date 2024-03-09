import Router, {Request, Response} from "express"

const router = Router();

/* GET home page. */
router.get('/api/v1/', (req: Request, res: Response) => {
    res.send("Openchase-server Version 1.0.0")
});

export default router
