import type { Request, Response } from "express";
import { config } from "../config";
import {
  handleProcessWebhookCheckout,
  handleProcessWebhookUpdatedSubscription,
  stripe,
} from "../lib/stripe";

import Stripe from "stripe";
import logger from "../logger";
import { BaseController } from "./BaseController";

class StripeWebhookController extends BaseController {
  private event: Stripe.Event;

  constructor() {
    super();
    this.event = {} as Stripe.Event;  
  }

  public async init(req: Request, res: Response) {
    if (!config.stripe.webhookSecret) {
      logger.error("⚠️ STRIPE_WEBHOOK_SECRET_KEY is not set.");
      return res.sendStatus(400);
    }

    const signature = req.headers["stripe-signature"] as string;

    try {
      await this.webhooksConstructEventAsync(
        req,
        signature,
        config.stripe.webhookSecret
      )
    } catch (error) {
      logger.error("⚠️  Webhook signature verification failed.", this.formatErrorMessage(error));
      return res.sendStatus(400);
    }

    try {
      switch (this.getEventType()) {
        case "checkout.session.completed":
          // eslint-disable-next-line no-case-declarations
          const eventData = this.getEventData();
          await handleProcessWebhookCheckout(eventData.object as Stripe.Checkout.Session | any);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
          // eslint-disable-next-line no-case-declarations
          const subscriptionEventData = this.getEventData()
          await handleProcessWebhookUpdatedSubscription(subscriptionEventData.object as Stripe.Subscription | any);
          break;
        default:
          logger.error(`Unhandled event type ${this.getEventType()}`);
      }

      return res.json({ received: true });
    } catch (error) {
      logger.error(this.formatErrorMessage(error));
      return res.status(500).json({ error: this.formatErrorMessage(error) });
    }
  }

  private async webhooksConstructEventAsync(
    req: Request,
    signature: string,
    secret: string
  ): Promise<void> {
    const newEvent = stripe.webhooks.constructEvent(
      req.body,
      signature,
      secret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );

    this.setEvent(newEvent);
  } 

  private formatErrorMessage(error: Error | unknown): string { 
    return error instanceof Error ? error.message : "Unknown error";
  }

  private getEventType(): string {
    return this.event.type;
  } 

  private getEventData(): Stripe.Event.Data {
    return  {
      object:  this.event.data
    };
  }

  private setEvent(event: Stripe.Event) { 
    this.event = event;
  }
}

export const stripeWebhookController = new StripeWebhookController();
