export class FindPedidoError extends Error {
  constructor(data?: any) {
    super(`Erro ao buscar pedido por Id`);
    this.name = "FindPedidoError";
  }
}
