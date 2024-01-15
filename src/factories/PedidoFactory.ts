import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import IHttpServer from "@adapters/ports/IHttpServer";
import { PedidoController } from "@src/controllers/PedidoController";

export class PedidoFactory {
    private readonly pedidoController: PedidoController;
    //private readonly productDao: PedidoDao;
  
    constructor(
      private readonly httpServer: IHttpServer,
      private readonly connection: IConnectionDatabase
    ) {
      this.pedidoController = new PedidoController(this.httpServer);
      // this.pedidoDao = new ProductDao(this.connection);
    }

    makeListPedidosController = () => {
        this.pedidoController.registerEndpointListProducts()
    }
}