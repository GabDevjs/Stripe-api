import { Router } from "express";
import { checkoutRouter } from "./checkout-router";
import { stripeWebHookRouter } from "./Stripe-webhook-router";
import { todoRouter } from "./Todo-router";
import { userRouter } from "./User-router";

export const router = Router();
router.use("checkout", checkoutRouter);
router.use("stripe-webhook", stripeWebHookRouter);
router.use("todo", todoRouter);
router.use("user", userRouter);