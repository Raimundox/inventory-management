"use client";

import { useCreateClientMutation, useDeleteClientMutation, useEditClientMutation, useGetClientsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PlusCircleIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import CreateClientModal from "./CreateClientModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Nome", width: 200 },
  { field: "phone", headerName: "WhatsApp", width: 200 },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<CreateClientParams | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

 const { data: clients, isError, isLoading } = useGetClientsQuery(searchTerm);
  const [createClient] = useCreateClientMutation();
  const [editClient] = useEditClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  if (isLoading) {
    return <div className="py-4">Carregando...</div>;
  }

  if (isError || !clients) {
    return (
      <div className="text-center text-red-500 py-4">Falha ao buscar usuários</div>
    );
  }

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.warn("Nenhum cliente selecionado para exclusão.");
      return;
    }
  
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir ${selectedRows.length} cliente(s)?`
    );
  
    if (!confirmDelete) return;
    
    try {
      await deleteClient(selectedRows.map((id) => id));
      toast.success("Usuários excluídos com sucesso!");
    } catch (error) {
      alert("Erro ao excluir usuários.");
    }
  };

  const handleSelectionChange = (newSelection: any) => {
    setSelectedRows(newSelection); // Atualiza as linhas selecionadas
  };

  const openCreateModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: CreateClientParams) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCreateClient = async (clientData: CreateClientParams) => {
       await createClient(clientData).unwrap(); 
      toast.success("Cliente criado com sucesso!");
  };
  

  const handleEditClient = async (clientData: CreateClientParams) => {
      await editClient(clientData).unwrap();
      toast.success("Cliente atualizado com sucesso!");
  };

  return (
    <div className="flex flex-col">
       {/* SEARCH BAR */}
       <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Clientes" />
        <div className="flex gap-4">
          <button
            onClick={openCreateModal}
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Novo cliente
          </button>
          {selectedRows.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
            <TrashIcon className="w-5 h-5 !text-gray-200"/>
            </button>
          )}
        </div>
      </div>

      <DataGrid
        rows={clients}
        columns={columns}
        getRowId={(row) => row.userId}
        checkboxSelection
        disableRowSelectionOnClick
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        onRowClick={(params) => openEditModal(params.row)}
        onRowSelectionModelChange={handleSelectionChange}
      />

      {/* MODAL */}
      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateClient}
        onEdit={handleEditClient}
        clientToEdit={selectedClient}
      />

      {/* TOAST */}
      <ToastContainer />
    </div>
  );
};

export default Users;
