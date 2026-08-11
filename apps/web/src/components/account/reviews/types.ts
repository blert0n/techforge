export type Review = {
  id: string;
  productId: number;
  category: string;
  product: string;
  title: string;
  body: string;
  rating: number;
  date: Date;
  helpful: number;
};

export type PendingReview = {
  productId: number;
  category: string;
  product: string;
  purchasedAt: string;
  orderNumber: string;
};
