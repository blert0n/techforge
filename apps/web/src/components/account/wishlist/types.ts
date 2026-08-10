export type WishlistProduct = {
  id: string;
  brand: string;
  category: string;
  name: string;
  price: number;
  oldPrice?: number;
  reviews: number;
  rating: number;
  image?: string;
  inStock: boolean;
};
