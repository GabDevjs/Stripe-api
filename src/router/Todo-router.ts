import { Router } from "express";
import { todoController } from "../controllers/TodoController";

export const todoRouter = Router();
todoRouter.get("/", todoController.index);
todoRouter.post("/", todoController.create);
