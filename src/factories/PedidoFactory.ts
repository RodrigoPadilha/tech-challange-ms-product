import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import IHttpServer from "@adapters/ports/IHttpServer";
import { PedidoController } from "@src/controllers/PedidoController";
import { RabbitQueue } from "@src/infra/messaging/adapters/rabbitQueue";
import { PedidoRepository } from "@src/repositories/PedidoRepository";
import { PedidoService } from "@src/services/PedidoService";

export class PedidoFactory {
  private readonly pedidoController: PedidoController;

  constructor(
    private readonly httpServer: IHttpServer,
    private readonly connection: IConnectionDatabase
  ) {
    const pedidoRepository = new PedidoRepository(this.connection);
    const pedidoService = new PedidoService(pedidoRepository);
    this.pedidoController = new PedidoController(
      this.httpServer,
      pedidoService,
      RabbitQueue.Instance
    );
  }

  makeListPedidosController = () => {
    this.pedidoController.registerEndpointListPedidos();
  };

  makeCreatePedidosController = () => {
    this.pedidoController.registerEndpointCreatePedido();
  };

  makeFindPedidosController = () => {
    this.pedidoController.registerEndpointFindPedido();
  };

  makeUpdatePedidosController = () => {
    this.pedidoController.registerEndpointUpdatePedido();
  };
}
