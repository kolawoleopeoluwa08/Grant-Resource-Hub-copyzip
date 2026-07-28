import { Router, type IRouter } from "express";
import healthRouter from "./health";
import grantsRouter from "./applications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(grantsRouter);

export default router;
