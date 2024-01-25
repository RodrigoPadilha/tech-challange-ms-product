export class UpdatePedidoError extends Error {
  constructor(data?: any) {
    super(`Erro ao atualizar o pedido`);
    this.name = "UpdatePedidoError";
  }
}
