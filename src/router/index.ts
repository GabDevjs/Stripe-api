import { Router } from "express";
import { checkoutRouter } from "./checkout-router";

export const router = Router();
router.use("checkout", checkoutRouter);