type ProductFormData = {
    name: string;
    price: number;
    stockQuantity: number;
    imageProductUrl: string;
    dueDate: string; // Esta é a data em formato ISO
    productId: string;
    category: string; // Categoria selecionada
    brand: string; // Marca selecionada
  };