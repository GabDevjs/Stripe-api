import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { Response } from "express";
import ApiError, { type APIError } from "../utils/api-error";
import logger from "../logger";

export abstract class BaseController {
  protected prisma = prisma;

  protected sendCreateUpdatedErrorResponse(response: Response, error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      const clientsErros = this.handleClientErrors(error);

      response.status(clientsErros.code).send(
        ApiError.format({
          code: clientsErros.code,
          message: clientsErros.message,
        })
      )
    } else {
      logger.error(JSON.stringify(error));
      response.status(500).send(
        ApiError.format({
          code: 500,
          message: 'Internal Server Error',
        })
      )
    }
  }

  private handleClientErrors(error: Prisma.PrismaClientKnownRequestError): { code: number, message: string } {
    if (error.code === 'P2002') {
      return {
        code: 409,
        message: 'Already exists'
      }
    }

    return {
      code: 400,
      message: error.message
    }
  }

  protected sendErrorResponse(response: Response, apiError: APIError): Response {
    return response.status(apiError.code).send(
      ApiError.format(apiError)
    )
  }
}