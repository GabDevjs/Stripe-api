import type { Request, Response } from "express";
import { createCheckoutSession } from "../lib/stripe";
import { authenticate } from "../utils/authenticate";
import { BaseController } from "./BaseController";

class CheckoutController extends BaseController {
  constructor() {
    super();
  }

  public async create(req: Request, res: Response) {
    try {
      const { user } = await authenticate(req, res);

      const checkout = await createCheckoutSession(user.id, user.email);

      return res.send(checkout);
    } catch (error) {
      return this.sendCreateUpdatedErrorResponse(res, error);
    }
  }
}

export const checkoutController = new CheckoutController();
