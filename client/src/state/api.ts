import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  dueDate: string;
  imageProductUrl: string;
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Clients", "Expenses", "Categories", "Brands"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search: search.toLowerCase() } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    editProduct: build.mutation<void, ProductFormData>({
      query: (productData) => ({
        url: "/products/edit", 
        method: "PUT", 
        body: productData, 
      }),
      invalidatesTags: ["Products"], 
    }),
    getClients: build.query<User[], string | void>({
      query: (search) => ({
        url: "/clients",
        params: search ? { search: search.toLowerCase() } : {},
      }),
      providesTags: ["Clients"],
    }),
    createClient: build.mutation<void, CreateClientParams>({
      query: (clientData) => ({
        url: "/clients", 
        method: "POST", 
        body: clientData, 
      }),
      invalidatesTags: ["Clients"], 
    }),
    editClient: build.mutation<void, CreateClientParams>({
      query: (productData) => ({
        url: "/clients/edit", 
        method: "PUT", 
        body: productData, 
      }),
      invalidatesTags: ["Clients"], 
    }),
    deleteClient: build.mutation<void, CreateClientParams>({
      query: (productData) => ({
        url: "/clients/delete", 
        method: "DELETE", 
        body: productData, 
      }),
      invalidatesTags: ["Clients"], 
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
    getCategories: build.query<string[], void>({
      query: () => "/products/categories",  
      providesTags: ["Categories"],
    }),
    getBrands: build.query<string[], void>({
      query: () => "/products/brands",  
      providesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useEditClientMutation,
  useDeleteClientMutation,
  useGetExpensesByCategoryQuery,
  useGetCategoriesQuery, // Hook para buscar categorias
  useGetBrandsQuery, // Hook para buscar marcas
} = api;

