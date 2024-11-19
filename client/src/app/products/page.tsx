"use client";

import { useCreateProductMutation, useEditProductMutation, useGetProductsQuery } from "@/state/api";
import { EditIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import { toast } from "react-toastify";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null); // Para armazenar o produto sendo editado

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [editProduct] = useEditProductMutation();

  const openCreateModal = () => {
    setSelectedProduct(null); // Garante que ao clicar em "Criar", não há um produto selecionado para edição
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductFormData) => {
    setSelectedProduct(product); // Define o produto selecionado para edição
    setIsModalOpen(true);
  };

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      await createProduct(productData);
      toast.success("Produto criado com sucesso!");
    } catch (error) {
      toast.error("Falha ao criar produto.");
    }
  };

  const handleEditProduct = async (productData: ProductFormData) => {
    try {
      await editProduct(productData);
      toast.success("Produto atualizado com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Falha ao atualizar produto.");
    }
  };

  if (isLoading) {
    return <div className="py-4">Carregando...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Falha ao buscar produtos
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Produtos" />
        <button
          onClick={openCreateModal}
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Criar Produto
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          products?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.imageProductUrl}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36"
                />
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">R${product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Estoque: {product.stockQuantity}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Validade: {new Date(product.dueDate).toLocaleDateString("pt-BR")}
                </div>
                <button
                  onClick={() => openEditModal(product)}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                >
                  <EditIcon className="w-5 h-5 inline-block mr-1" /> Editar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        onEdit={handleEditProduct}
        productToEdit={selectedProduct} // Passando o produto selecionado para o modal de edição
      />
    </div>
  );
};

export default Products;
