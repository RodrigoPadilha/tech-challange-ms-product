import { PedidoStatus } from "@src/entities/PedidoEntity";

export class PedidoDto {
  constructor(
    readonly valor: number,
    readonly status: PedidoStatus,
    readonly itens: [{}],
    readonly cliente: { nome: string; cpf: string },
    readonly id?: string
  ) {}
}
