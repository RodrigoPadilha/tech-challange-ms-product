import IHttpServer from "@adapters/ports/IHttpServer";
import { badRequest, created, ok, serverError } from "../util/http-helper";
import { PedidoService } from "@src/services/PedidoService";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { IMessagingQueue } from "@src/infra/messaging/ports/queue";
import { PedidoDto } from "@src/services/interface";

export class PedidoController {
  constructor(
    private readonly httpServer: IHttpServer,
    private readonly pedidoService: PedidoService,
    private readonly messagingQueue: IMessagingQueue
  ) {
    this.subscribeToQueue();
  }

  private subscribeToQueue() {
    this.messagingQueue.subscribeToQueue(process.env.QUEUE_1, async (message: string) => {
      try {
        const pedido = JSON.parse(message) as PedidoDto;
        await this.pedidoService.createPedido(pedido);
      } catch (error) {
        console.log(error);
      }
    })
  }

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
          const { itens, cliente, valor } = body;
          const pedido = await this.pedidoService.createPedido({
            itens,
            cliente,
            valor,
            status: PedidoStatus.ABERTO,
          });
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
          const { newStatus } = body;
          const enumNewStatus: PedidoStatus =
            PedidoStatus[newStatus as keyof typeof PedidoStatus];
          const pedidoUpdated = await this.pedidoService.updatePedido(
            pedidoId,
            enumNewStatus
          );
          if (!pedidoUpdated) {
            return badRequest({ message: "Pedido não encontrado" });
          }
          return ok({ message: "Retorno OK", pedido: pedidoUpdated });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }
}
