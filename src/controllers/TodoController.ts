import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { BaseController } from './BaseController';

class TodoController extends BaseController {
  constructor() {
    super();
  }

  public async index(request: Request, response: Response) {
    const userId = request.headers['x-user-id'];

    if (!userId) {
      return response.status(403).send({
        error: 'Not authorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        stripeSubscriptionId: true,
        stripeSubscriptionStatus: true,
        _count: {
          select: {
            todos: true,
          },
        },
      },
    });

    if (!user) {
      return response.status(403).send({
        error: 'Not authorized',
      });
    }

    const hasQuotaAvailable = user._count.todos <= 5;
    const hasActiveSubscription = !!user.stripeSubscriptionId;

    if (
      !hasQuotaAvailable &&
      !hasActiveSubscription &&
      user.stripeSubscriptionStatus !== 'active'
    ) {
      return response.status(403).send({
        error: 'Not quota available. Please upgrade your plan.',
      });
    }

    const todos = await prisma.todo.findMany({
      where: {
        ownerId: user.id,
      },
    });

    return response.status(200).send(todos);
  }

  public async create(request: Request, response: Response) {
    const userId = request.headers['x-user-id'];

    if (!userId) {
      return response.status(403).send({
        error: 'Not authorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        stripeSubscriptionId: true,
        stripeSubscriptionStatus: true,
        _count: {
          select: {
            todos: true,
          },
        },
      },
    });

    if (!user) {
      return response.status(403).send({
        error: 'Not authorized',
      });
    }

    const hasQuotaAvailable = user._count.todos <= 5;
    const hasActiveSubscription = !!user.stripeSubscriptionId;

    if (
      !hasQuotaAvailable &&
      !hasActiveSubscription &&
      user.stripeSubscriptionStatus !== 'active'
    ) {
      return response.status(403).send({
        error: 'Not quota available. Please upgrade your plan.',
      });
    }

    const { title } = request.body;

    const todos = await prisma.todo.findMany({
      where: {
        title,
        ownerId: user.id,
      },
    });

    return response.status(200).send(todos);
  }
}

export const todoController = new TodoController();

