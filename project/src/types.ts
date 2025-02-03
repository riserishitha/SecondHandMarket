export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  seller_id: string;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}