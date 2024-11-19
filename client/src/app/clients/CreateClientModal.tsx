import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type CreateClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CreateClientParams) => void;
  onEdit: (formData: CreateClientParams) => void;
  clientToEdit?: CreateClientParams; // Produto a ser editado
};

const CreateClientModal = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  clientToEdit,
}: CreateClientModalProps) => {
  const [formData, setFormData] = useState<CreateClientParams>({
    userId: v4(),
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (clientToEdit) {
        setFormData(clientToEdit);
      } else {
        setFormData({
          userId: v4(),
          name: "",
          phone: "",
        });
      }
    }
  }, [isOpen, clientToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Limpa erros ao editar
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (clientToEdit) {
        await onEdit(formData); // Chama a função de editar se estiver editando
      } else {
        await onCreate(formData); // Caso contrário, chama a função de criar
      }
      onClose();  // Fecha o modal em caso de sucesso
    } catch (error: any) {
      // Verifica se é um erro de resposta de uma requisição
      if (error?.data?.error) {
        const errorMessage = error.data.error;

        // Lógica para mostrar o erro de nome ou telefone
        if (errorMessage.includes("nome")) {
          setErrors((prev) => ({ ...prev, name: errorMessage }));
        }
        if (errorMessage.includes("telefone")) {
          setErrors((prev) => ({ ...prev, phone: errorMessage }));
        }
      } else {
        console.error("Erro inesperado:", error);
      }
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    }

    setFormData({ ...formData, phone: value });
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={clientToEdit ? "Editar Cliente" : "Novo Cliente"} />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* Nome do Cliente */}
          <label htmlFor="name" className={labelCssStyles}>
            Nome do Cliente
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
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>} {/* Exibe erro de nome */}

          {/* WhatsApp */}
          <label htmlFor="phone" className={labelCssStyles}>
            WhatsApp
          </label>
          <input
            type="text"
            name="phone"
            placeholder="(DDD) 12345-6789"
            onChange={handlePhoneChange}
            value={formData.phone}
            className={inputCssStyles}
            required
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>} {/* Exibe erro de telefone */}

          {/* Botões */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {clientToEdit ? "Editar" : "Criar"}
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

export default CreateClientModal;
