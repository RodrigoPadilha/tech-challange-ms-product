import { ItemEntity } from "./ItemEntity";

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
    readonly valor: number,
    readonly status: PedidoStatus,
    readonly itens: ItemEntity[],
    readonly cliente: { nome: string; cpf: string },
    readonly id?: string
  ) {}
}
