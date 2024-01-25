export class SavePedidoError extends Error {
  constructor(data?: any) {
    super(`Erro ao salvar o pedido`);
    this.name = "SavePedidoError";
  }
}
