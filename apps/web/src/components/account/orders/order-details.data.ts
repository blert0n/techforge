export const orderDetails = [
  {
    id: "TF-89420-11",
    date: "October 24, 2023",
    status: "Shipped",
    total: "$1,399.63",
    trackingNumber: "UPS-1Z999AA1012345678",
    carrier: "UPS",
    delivery: "Friday, October 27",
    items: [
      {
        brand: "Intel",
        name: "Core i9-13900K Processor",
        price: "$589.99",
        quantity: 1,
      },
      {
        brand: "ASUS",
        name: "ROG Maximus Z790 Hero Motherboard",
        price: "$799.99",
        quantity: 1,
      },
    ],
    history: [
      ["In transit — Oakland Distribution Hub", "Oct 26, 2:34 PM"],
      ["Departed UPS facility — Memphis, TN", "Oct 26, 6:10 AM"],
      ["Shipment picked up", "Oct 25, 4:22 PM"],
      ["Order confirmed", "Oct 24, 11:05 AM"],
    ],
    shipping: {
      name: "Alex Smith",
      line1: "123 Tech Avenue, Suite 400",
      line2: "San Francisco, CA 94105",
      country: "United States",
      phone: "+1 (415) 555-0182",
    },
    billing: {
      name: "Alex Smith",
      line1: "123 Tech Avenue, Suite 400",
      line2: "San Francisco, CA 94105",
      country: "United States",
    },
  },
] as const;
export type OrderDetails = (typeof orderDetails)[number];
