import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString().toLowerCase();
    
    const users = await prisma.clients.findMany({
      where: {
        name: {
          contains: search, // Busca sem diferenciar maiúsculas e minúsculas
          mode: "insensitive", // Modo que ignora case-sensitive no Prisma
        },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, phone } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !userId || !phone) {
      res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
      return;
    }

    // Verificar se o nome já existe
    const existingName = await prisma.clients.findUnique({
      where: { name },
    });

    if (existingName) {
      res.status(400).json({ error: "Já existe um cliente com este nome." });
      return;
    }

    // Verificar se o telefone já existe
    const existingPhone = await prisma.clients.findFirst({
      where: { phone },
    });

    if (existingPhone) {
      res.status(400).json({ error: "Já existe um cliente com este número de telefone." });
      return;
    }

    // Criar o cliente
    const client = await prisma.clients.create({
      data: {
        userId,
        name,
        phone,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor. Tente novamente mais tarde." });
  }
};

export const editClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
        userId,
        name,
        phone,
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!userId || !name) {
      res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
      return;
    }

      // Verificar se o nome já existe
      const existingName = await prisma.clients.findUnique({
        where: { name },
      });
  
      if (existingName) {
        res.status(400).json({ error: "Já existe um cliente com este nome." });
        return;
      }
  
      // Verificar se o telefone já existe
      const existingPhone = await prisma.clients.findFirst({
        where: { phone },
      });
  
      if (existingPhone) {
        res.status(400).json({ error: "Já existe um cliente com este número de telefone." });
        return;
      }
  
    // Atualizar o produto
    const updatedClient = await prisma.clients.update({
      where: { userId },
      data: {
        userId,
        name,
        phone,
      },
    });
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error("Erro ao editar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor. Tente novamente mais tarde." });
  }
};

export const deleteUser  = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userIds = Array.isArray(req.body) ? req.body : req.body.userIds;

    if (!Array.isArray(userIds) || userIds.length === 0) {
       res.status(400).json({ error: "IDs de usuário inválidos ou ausentes." });
    }
    
    // Excluir usuários pelo ID
    await prisma.clients.deleteMany({
      where: {
        userId: {
          in: userIds, // IDs a serem excluídos
        },
      },
    });

    res.status(200).json({ message: "Usuários excluídos com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuários." });
  }
};
