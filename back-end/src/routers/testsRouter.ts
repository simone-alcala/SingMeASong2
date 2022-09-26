import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController.js";

const testsRouter = Router();

testsRouter.delete("/reset-database", recommendationController.reset);

export default testsRouter;