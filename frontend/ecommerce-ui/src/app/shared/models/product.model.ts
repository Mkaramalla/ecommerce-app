export interface Product {
  id: number;
  name: string;
  description: string;
  image: string | null;
  price: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProductRequest {
  name: string;
  description: string;
  image?: string | null;
  price: number;
  status: 'active' | 'inactive';
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  data?: Product | Product[];
}

