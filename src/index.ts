import { SetupServer } from './server';
import logger from './logger';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer();
    await server.init();
    server.start();
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();