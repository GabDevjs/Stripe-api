import { prisma } from "../lib/prisma";
import type { CustomRequest } from "../types/CustomRequest";
import type { Request, Response } from "express";
import type { IUser } from "../types/User";
import logger from "../logger";

type AuthenticateLogType = {
  error: string;
  code: number;
};

interface IAuthenticate {
  user: IUser;
}

export async function authenticate(
  req: Request | CustomRequest,
  res: Response,
): Promise<IAuthenticate> {
  const logs: AuthenticateLogType[] = [];
  const userId = req.headers["x-user-id"];

  if (!userId) {
    logs.push({
      error: "Header x-user-id is required",
      code: 403,
    });
  }

  const user = (await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
  })) as IUser;

  if (!user) {
    logs.push({
      error: "User not found, please check your credentials and try again.",
      code: 403,
    });
  }

  if (logs.length > 0) {
    await authenticateLogErro(logs, res);

    throw new Error(logs[0].error);
  }

  return {
    user,
  };
}

async function authenticateLogErro(logs: AuthenticateLogType[], res: Response) {
  logs.forEach((log) => {
    logger.error(log.error);
    res.status(log.code).send({
      error: log.error,
    });
  });
}
