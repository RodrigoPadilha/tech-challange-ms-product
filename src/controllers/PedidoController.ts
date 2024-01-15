import IHttpServer from "@adapters/ports/IHttpServer";
import { ok, serverError } from "../util/http-helper";

export class PedidoController {
    constructor(
        private readonly httpServer: IHttpServer, 
        //private readonly pedidoService: any
    ) {}

    registerEndpointListProducts() {
        this.httpServer.register(
            "get",
            "/producao",
            async function(params: any, body: any, query: any){
                try {
                    return ok({message: "Retorno OK"});
                } catch (error) {
                    return serverError(error)
                }
            }
        )
    }
}