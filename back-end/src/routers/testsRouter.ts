import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController.js";

const testsRouter = Router();

testsRouter.post("/reset-database", recommendationController.reset);

export default testsRouter;