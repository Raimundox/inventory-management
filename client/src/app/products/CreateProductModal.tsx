import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import axios from 'axios'; // Você pode usar axios ou fetch para as chamadas de API
import {useGetBrandsQuery, useGetCategoriesQuery } from "@/state/api";

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
  onEdit: (formData: ProductFormData) => void;
  productToEdit?: ProductFormData; // Produto a ser editado
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  productToEdit,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    productId: v4(),
    name: "",
    price: 0,
    stockQuantity: 0,
    imageProductUrl: "",
    dueDate: "",
    category: "",
    brand: "",
  });

  // Dados das categorias e marcas
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const { data: getCategories } = useGetCategoriesQuery();
  const { data: getBrands } = useGetBrandsQuery();

  // Carregar categorias e marcas da API
  useEffect(() => {
    if (getCategories) {
      setCategories(getCategories);
    }
    if (getBrands) {
      setBrands(getBrands);
    }
  }, [getCategories, getBrands]);

  // Resetando o estado quando o modal for aberto para criar um produto
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData(productToEdit);
      } else {
        setFormData({
          productId: v4(),
          name: "",
          price: 0,
          stockQuantity: 0,
          imageProductUrl: "",
          dueDate: "",
          category: "",
          brand: "",
        });
      }
    }
  }, [isOpen, productToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity"
          ? parseFloat(value)
          : value,
    });
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      category: e.target.value,
    });
  };

  const handleBrandChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      brand: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productToEdit) {
      onEdit(formData); // Se for editar, chama o método de edição
    } else {
      onCreate(formData); // Se for criar, chama o método de criação
    }
    onClose(); // Fecha o modal após o envio
  };

  const formatDateForInput = (date: string) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={productToEdit ? "Editar Produto" : "Criar Novo Produto"} />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Nome do Produto
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Preço
          </label>
          <input
            type="number"
            name="price"
            placeholder="Preço"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Quantidade em Estoque
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Quantidade em Estoque"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />

          {/* IMAGE PRODUCT URL */}
          <label htmlFor="imageProductUrl" className={labelCssStyles}>
            URL da Imagem
          </label>
          <input
            type="text"
            name="imageProductUrl"
            placeholder="URL da Imagem"
            onChange={handleChange}
            value={formData.imageProductUrl}
            className={inputCssStyles}
          />

          {/* CATEGORY */}
          <label htmlFor="category" className={labelCssStyles}>
            Categoria
          </label>
          <select
            name="category"
            onChange={handleCategoryChange}
            value={formData.category}
            className={inputCssStyles}
          >
            <option value="">Selecione uma categoria</option>
            {categories?.map((category: any) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>

          {/* BRAND */}
          <label htmlFor="brand" className={labelCssStyles}>
            Marca
          </label>
          <select
            name="brand"
            onChange={handleBrandChange}
            value={formData.brand}
            className={inputCssStyles}
          >
            <option value="">Selecione uma marca</option>
            {brands?.map((brand: any) => (
              <option key={brand.brandId} value={brand.brandId}>
                {brand.name}
              </option>
            ))}
          </select>

          {/* DUE DATE */}
          <label htmlFor="dueDate" className={labelCssStyles}>
            Data de Validade
          </label>
          <input
            type="date"
            name="dueDate"
            onChange={handleChange}
            value={formatDateForInput(formData.dueDate)}
            className={inputCssStyles}
          />

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {productToEdit ? "Editar" : "Criar"}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
