export type Product = {
  id: string;
  price: number;
  name: string;
  description: string;
};

export type NewProduct = Omit<Product, "id">;
