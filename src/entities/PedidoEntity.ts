export enum PedidoStatus {
  ABERTO = "aberto",
  CANCELADO = "cancelado",
  AGUARDANDO_PAGAMENTO = "aguardandoPagamento",
  PAGO = "pago",
  EM_PREPARACAO = "emPreparacao",
  PRONTO = "pronto",
  ENTREGUE = "entregue",
}
export class PedidoEntity {
  constructor(
    private readonly valor: number,
    private readonly status: PedidoStatus,
    private readonly itens: [{}],
    private readonly cliente: { nome: string; cpf: string },
    private readonly id?: string
  ) {}

  getId() {
    return this.id;
  }
  /*
  getValor() {
    return this.valor;
  }

  getStatus() {
    return this.status;
  }

  getItens() {
    return this.itens;
  }

  getCliente() {
    return this.cliente;
  } */
}
