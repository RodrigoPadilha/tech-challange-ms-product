import IHttpServer from "@adapters/ports/IHttpServer";
import { badRequest, created, ok, serverError } from "../util/http-helper";
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

  registerEndpointCreatePedido() {
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

  registerEndpointFindPedido() {
    this.httpServer.register(
      "get",
      "/producao/:pedidoId",
      async (params: any, body: any, query: any) => {
        try {
          const { pedidoId } = params;
          const pedido = await this.pedidoService.findPedido(pedidoId);
          if (!pedido) {
            return badRequest({ message: "Pedido não encontrado" });
          }
          return ok({ message: "Retorno OK", pedido });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointUpdatePedido() {
    this.httpServer.register(
      "put",
      "/producao/:pedidoId",
      async (params: any, body: any, query: any) => {
        try {
          const { pedidoId } = params;
          const pedidoUpdated = await this.pedidoService.updatePedido(pedidoId);
          if (!pedidoUpdated) {
            return badRequest({ message: "Pedido não encontrado" });
          }
          return ok({ message: "Retorno OK", pedidoUpdated });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }
}
