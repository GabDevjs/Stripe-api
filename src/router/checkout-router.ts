import { Router } from "express";
import { checkoutController } from "../controllers/CheckoutController";

export const checkoutRouter = Router();
checkoutRouter.post("/", checkoutController.create);