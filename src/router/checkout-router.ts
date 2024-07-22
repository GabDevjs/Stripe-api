import { Router } from "express";
import { checkoutController } from "../controllers/Checkout";

export const checkoutRouter = Router();
checkoutRouter.post("/", checkoutController.create);