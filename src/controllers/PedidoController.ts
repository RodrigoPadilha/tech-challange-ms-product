import IHttpServer from "@adapters/ports/IHttpServer";
import { ok, serverError } from "../util/http-helper";
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
}
