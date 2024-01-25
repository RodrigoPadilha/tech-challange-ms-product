-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('aberto', 'cancelado', 'aguardandoPagamento', 'pago', 'emPreparacao', 'pronto', 'entregue');

-- CreateTable
CREATE TABLE "PedidoProps" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" "StatusPedido" NOT NULL,
    "clienteId" TEXT NOT NULL,

    CONSTRAINT "PedidoProps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL,
    "pedidoPropsId" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- AddForeignKey
ALTER TABLE "PedidoProps" ADD CONSTRAINT "PedidoProps_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_pedidoPropsId_fkey" FOREIGN KEY ("pedidoPropsId") REFERENCES "PedidoProps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
