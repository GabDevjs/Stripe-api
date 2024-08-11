import { Router } from "express";
import { userController } from "../controllers/UserController";

export const userRouter = Router();
userRouter.get("/", userController.index);
userRouter.get("/:id", userController.show);
userRouter.post("/", userController.create);
