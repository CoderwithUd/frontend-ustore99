export type UserRole = "seller" | "super_admin";

export type ProductGender = "men" | "women" | "kids" | "unisex" | "";

export type ProductPricing = {
  mrp?: number;
  sellingPrice: number;
  currency?: string;
  taxPercent?: number;
};

export type ProductVariant = {
  sku: string;
  size?: string;
  color?: string;
  stock?: number;
  price?: number;
};

export type ProductImage = {
  url: string;
  alt?: string;
};

export type Product = {
  _id: string;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  gender?: ProductGender;
  material?: string;
  pricing?: ProductPricing;
  variants?: ProductVariant[];
  images?: ProductImage[];
  tags?: string[];
  isActive?: boolean;
};

export type ProductsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  gender?: string;
  size?: string;
  color?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  isActive?: boolean | "";
};

export type ProductsListResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ProductCreateInput = Omit<Product, "_id">;
