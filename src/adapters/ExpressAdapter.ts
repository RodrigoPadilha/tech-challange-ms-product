import { Server } from "http";
import express, { Application, Request, Response } from "express";
import IHttpServer from "@adapters/ports/IHttpServer";
import { HttpResponse } from "@src/util/http-helper";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "@src/infra/docs/swagger.json";

export class ExpressAdapter implements IHttpServer {
  app: Application;
  private server: Server;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupHealthCheck();
    this.setupDocs();
  }

  private setupMiddlewares() {
    this.app.use(express.json());
  }

  private setupHealthCheck(): void {
    this.app.get("/health", (req, resp) => {
      resp.send(`Hello World ${process.env.DB_HOST}: ${process.env.DB_PORT}`);
    });
  }

  private setupDocs(): void {
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  async register(
    method: string,
    url: string,
    callback: Function
  ): Promise<void> {
    this.app[method](url, async function (req: Request, res: Response) {
      const output: HttpResponse = await callback(
        req.params,
        req.body,
        req.query
      );
      res.status(output.statusCode).json(output.body);
    });
  }

  async start(port: number): Promise<void> {
    console.log(`> [ExpressAdapter] starting...`);
    this.server = this.app.listen(port, () => {
      console.log(`> [ExpressAdapter] Server is running on port ${port}`);
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
      console.log("> [ExpressAdapter] Server has been stopped");
    }
  }
}
