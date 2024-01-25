import { PedidoStatus } from "@src/entities/PedidoEntity";

export class PedidoDto {
  constructor(
    readonly valor: number,
    readonly status: PedidoStatus,
    readonly itens: [
      {
        descricao: string;
        preco: number;
        tipo: "bebida" | "lanche" | "opcional" | "sobremesa";
        qtd: number;
      }
    ],
    readonly cliente: { nome: string; cpf: string },
    readonly id?: string
  ) {}
}
