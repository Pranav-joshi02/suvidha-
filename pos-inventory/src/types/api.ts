export type UserRole = "ADMIN" | "STAFF";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ProductDTO {
  id: string;
  name: string;
  sku?: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface SaleItemDTO {
  productId: string;
  name: string;
  quantity: number;
  price: number; // sell price
  cost: number; // cost price
}

export interface SaleDTO {
  id: string;
  createdAt: string; // ISO
  items: SaleItemDTO[];
  totals: { total: number; cost: number; profit: number };
  soldById: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface BalanceSheetRowDTO {
  date: string; // yyyy-mm-dd
  revenue: number;
  cost: number;
  profit: number;
}
