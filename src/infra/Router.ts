import IHttpServer from "@adapters/ports/IHttpServer";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { PedidoFactory } from "@src/factories/PedidoFactory";

export default class Router {
  constructor(
    readonly httpServer: IHttpServer,
    readonly connection: IConnectionDatabase
  ) {}

  start() {
    console.log("> [Router] starting...");

    const pedidoFacotry = new PedidoFactory(this.httpServer, this.connection);
    pedidoFacotry.makeListPedidosController();
    pedidoFacotry.makeCreatePedidosController();
    pedidoFacotry.makeFindPedidosController();
    pedidoFacotry.makeUpdatePedidosController();
  }
}
