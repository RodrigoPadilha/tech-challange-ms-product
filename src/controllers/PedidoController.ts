import IHttpServer from "@adapters/ports/IHttpServer";
import { created, ok, serverError } from "../util/http-helper";
import { PedidoService } from "@src/services/PedidoService";

export class PedidoController {
  constructor(
    private readonly httpServer: IHttpServer,
    private readonly pedidoService: PedidoService
  ) {}

  registerEndpointListPedidos() {
    this.httpServer.register(
      "get",
      "/producao",
      async (params: any, body: any, query: any) => {
        try {
          const pedidos = await this.pedidoService.listPedidos();
          return ok({ message: "Retorno OK", pedidos });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointCreatePedidos() {
    this.httpServer.register(
      "post",
      "/producao",
      async (params: any, body: any, query: any) => {
        try {
          const { itens, cliente, preco } = body;
          const pedido = await this.pedidoService.createPedido();
          return created({ message: "Retorno OK", pedido });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }
}
