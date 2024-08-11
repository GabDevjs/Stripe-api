import { Router } from "express";
import { stripeWebhookController } from "../controllers/StripeWebhookController";

export const stripeWebHookRouter = Router();
stripeWebHookRouter.get("/init", stripeWebhookController.init);
