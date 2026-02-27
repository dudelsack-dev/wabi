export interface Product {
  slug: string;
  name: string;
  nameJp: string;
  description: string;
  price: number;
  images: string[];
  category: "pottery" | "kitchenware";
  artisan: string;
  origin: string;
  inStock: boolean;
  stock?: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: { slug: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  content: string;
}
