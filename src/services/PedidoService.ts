export class PedidoService {
  async listPedidos() {
    return [
      {
        id: "abc",
        valor: "1.78",
        status: "Aberto",
        itens: [
          {
            a: "",
            b: "",
          },
        ],
        cliente: "Rodrigo",
      },
    ];
  }

  async createPedido() {
    return {
      id: "abc",
      valor: "1.78",
      status: "Aberto",
      itens: [
        {
          a: "",
          b: "",
        },
      ],
      cliente: "Rodrigo",
    };
  }

  async findPedido(pedidoId: string) {
    return {
      id: "abc",
      valor: "1.78",
      status: "Aberto",
      itens: [
        {
          a: "",
          b: "",
        },
      ],
      cliente: "Rodrigo",
    };
  }
}
