export type CheckoutFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  saveAddress: boolean;
  paymentMethod: "card" | "paypal";
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
  billingSameAsShipping: boolean;
};

export type CheckoutItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
};
