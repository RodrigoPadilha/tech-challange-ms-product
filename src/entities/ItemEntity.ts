export enum ItemTipo {
  BEBIDA = "bebida",
  LANCHE = "lanche",
  OPCIONAL = "opcional",
  SOBREMESA = "sobremesa",
}

export class ItemEntity {
  descricao: string;
  qtd: number;
}
