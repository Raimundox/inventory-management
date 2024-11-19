type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  imageProductUrl: string;
  dueDate: string; 
  productId: string;
  category: string; 
  brand: string; 
};

type CreateClientParams = {
  userId: String;
  name: String;
  phone: String;
};