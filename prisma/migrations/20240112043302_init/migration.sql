-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('aberto', 'cancelado', 'aguardandoPagamento', 'pago', 'emPreparacao', 'pronto', 'entregue');

-- CreateEnum
CREATE TYPE "TipoItem" AS ENUM ('bebida', 'lanche', 'opcional', 'sobremesa');

-- CreateTable
CREATE TABLE "PedidoProps" (
    "id" TEXT NOT NULL,
    "status" "StatusPedido" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "clienteId" TEXT NOT NULL,

    CONSTRAINT "PedidoProps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "tipo" "TipoItem" NOT NULL,
    "descricao" TEXT NOT NULL,
    "aceitaOpcional" BOOLEAN NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "pedidoPropsId" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PedidoProps" ADD CONSTRAINT "PedidoProps_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_pedidoPropsId_fkey" FOREIGN KEY ("pedidoPropsId") REFERENCES "PedidoProps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
