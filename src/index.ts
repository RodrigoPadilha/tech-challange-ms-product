import { ExpressAdapter } from "@adapters/ExpressAdapter";
import { PrismaConnection } from "@adapters/PrismaConnection";
import IHttpServer from "@adapters/ports/IHttpServer";
import Router from "./infra/Router";
import { RabbitQueue } from "./infra/messaging/adapters/rabbitQueue";

const httpServer: IHttpServer = new ExpressAdapter();
const connection = new PrismaConnection();

const queue = RabbitQueue.Instance;
const router = new Router(httpServer, connection);

queue.connect().then(() => {
  queue.addQueue(process.env.QUEUE_1);
});

router.start();
httpServer.start(Number(process.env.SERVER_PORT) || 3000).then(() => {
    console.log('server started at port', Number(process.env.SERVER_PORT) || 3000)
})
