import { PrismaClient as BasePrismaClient } from "@prisma/client";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
/* import {
  OrderStatus as OrderStatusPrisma,
  Category as CategoryPrisma,
} from "@prisma/client";

import { ClientEntity } from "@application/entities/ClientEntity";
import { OrderEntity } from "@application/entities/OrderEntity";
import { OrderFilter } from "@application/usecases/ports/IOrderDao";
import { ProductEntity } from "@application/entities/ProductEntity";
import { ProductFilter } from "@application/usecases/ports/IProductDao"; */

export class PrismaClient extends BasePrismaClient {
  // Aqui você pode adicionar métodos personalizados ou personalizar o comportamento do PrismaClient, se necessário
}

export class PrismaConnection implements IConnectionDatabase {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getConnection(): PrismaClient {
    return this.prisma;
  }

  async connect(): Promise<void> {
    // Lógica para conectar ao banco de dados
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    // Lógica para desconectar do banco de dados
    await this.prisma.$disconnect();
  }

  
}
