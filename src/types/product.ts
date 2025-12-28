export type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  lastUpdated: string;
  status: ProductStatus;
}
