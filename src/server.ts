import bodyParser from "body-parser";
import * as http from "http";
import cors from 'cors';
import { apiErrorValidator } from "./middlewares/erros";
import * as OpenApiValidator from 'express-openapi-validator';
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import type { Application } from "express";
import logger from "./logger";
import swaggerUi from 'swagger-ui-express';
import apiSchema from './docs/api-schema.json';
import express from "express";
import { router } from "./router/index";
export class SetupServer  {
  private server?: http.Server;
  private app: Application;

  constructor(private port = process.env.PORT || 3333) {
    this.app = express();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.setUpDocs();
    this.setupRouters();
    this.setupErrorHandlers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: "*",
      })
    )
  }

  private setupRouters(): void {
    this.app.get("/", (req, res) => {
      console.log("Hello World");
      res.send("Hello World");
    }
    );
    this.app.use('/api', router);

  }

  private setUpDocs() {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document,
        validateRequests: true,
        validateResponses: true,
      })
    )
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  public getApp(): Application {
    return this.app;
  }


  public close() {
    if (this.server) {
      new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }
}
