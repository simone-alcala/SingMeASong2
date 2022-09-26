import { Request, Response } from "express";

async function reset(req: Request, res: Response) {
  await recommendationService.reset();
  res.sendStatus(200);
}