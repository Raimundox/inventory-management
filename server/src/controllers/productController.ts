import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString().toLowerCase(); // Converte o termo de busca para minúsculas

    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search, // Busca sem diferenciar maiúsculas e minúsculas
          mode: "insensitive", // Modo que ignora case-sensitive no Prisma
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao recuperar os produtos" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      productId,
      name,
      price,
      stockQuantity,
      imageProductUrl,
      dueDate,
      category,
      brand
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !price || !stockQuantity || !dueDate || !category) {
      res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
      return;
    }

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { categoryId: category },
    });

    if (!existingCategory) {
      res.status(400).json({ error: "Categoria inválida." });
      return;
    }

    // Criar o produto
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        stockQuantity,
        imageProductUrl,
        dueDate: new Date(dueDate),
        categoryId: category, // Relaciona o produto com a categoria
        brandId: brand, 
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Agora deu erro", error);
    res.status(500).json({ error: "Erro interno do servidor. Tente novamente mais tarde." });
  }
};

export const editProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      productId,
      name,
      price,
      stockQuantity,
      imageProductUrl,
      dueDate,
      categoryId,
      brand,
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!productId || !name || !price || !stockQuantity || !dueDate || !categoryId) {
      res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
      return;
    }

    // Verificar se o produto existe
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });

    if (!existingProduct) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { categoryId: categoryId },
    });

    if (!existingCategory) {
      res.status(400).json({ error: "Categoria inválida." });
      return;
    }

    // Atualizar o produto
    const updatedProduct = await prisma.products.update({
      where: { productId },
      data: {
        name,
        price,
        stockQuantity,
        imageProductUrl,
        dueDate: new Date(dueDate),
        categoryId: categoryId, // Atualiza o relacionamento com a categoria
        brandId: brand,       // Atualiza o relacionamento com a marca
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor. Tente novamente mais tarde." });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString().toLowerCase(); // Converte o termo de busca para minúsculas

    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: search, // Busca sem diferenciar maiúsculas e minúsculas
          mode: "insensitive", // Modo que ignora case-sensitive no Prisma
        },
      },
    });

    res.json(categories); // Retorna as categorias encontradas
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao recuperar as categorias" });
  }
};

export const getBrands = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString().toLowerCase(); // Converte o termo de busca para minúsculas

    const brands = await prisma.brand.findMany({
      where: {
        name: {
          contains: search, // Busca sem diferenciar maiúsculas e minúsculas
          mode: "insensitive", // Modo que ignora case-sensitive no Prisma
        },
      },
    });

    res.json(brands); // Retorna as marcas encontradas
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao recuperar as marcas" });
  }
};