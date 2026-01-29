"use client";

import { apiSlice } from "@/store/apiSlice";
import type {
  Product,
  ProductCreateInput,
  ProductsListParams,
  ProductsListResponse
} from "@/features/products/types";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsListResponse, ProductsListParams>({
      query: (params) => ({
        url: "/api/products",
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          search: params.search || "",
          category: params.category || "",
          brand: params.brand || "",
          gender: params.gender || "",
          size: params.size || "",
          color: params.color || "",
          minPrice: params.minPrice === "" ? "" : params.minPrice,
          maxPrice: params.maxPrice === "" ? "" : params.maxPrice,
          isActive: params.isActive === "" ? "" : params.isActive
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Products" as const, id: p._id })),
              { type: "Products" as const, id: "LIST" }
            ]
          : [{ type: "Products" as const, id: "LIST" }]
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/api/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Products", id }]
    }),
    createProduct: builder.mutation<Product, ProductCreateInput>({
      query: (body) => ({
        url: "/api/products",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }]
    }),
    updateProduct: builder.mutation<Product, { id: string; patch: Partial<ProductCreateInput> }>({
      query: ({ id, patch }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: patch
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Products", id: arg.id },
        { type: "Products", id: "LIST" }
      ]
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }]
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productsApi;
