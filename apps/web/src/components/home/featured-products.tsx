import Link from "next/link";
import {
  ProductCard,
  type ProductCardData,
} from "@/components/products/product-card";

const products: ProductCardData[] = [
  {
    brand: "NVIDIA",
    name: "GeForce RTX 4090 24GB GDDR6X Graphics Card",
    price: "$1,599.99",
    oldPrice: "$1,799.99",
    reviews: 128,
    badge: "Sale",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_15e084a956_8128be831b8c77af.png",
    rating: 4.5,
  },
  {
    brand: "AMD",
    name: "Ryzen 9 7950X3D 16-Core, 32-Thread Desktop Processor",
    price: "$699.00",
    reviews: 342,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_637a4c032c_2977b806c59c029b.png",
    rating: 5,
  },
  {
    brand: "ASUS",
    name: 'ROG Strix Scar 16 (2024) Gaming Laptop, 16" Nebula HDR',
    price: "$2,899.00",
    reviews: 89,
    badge: "Best Seller",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_8a58ef8de2_daf6d5c7753d69bc.png",
    rating: 4,
  },
  {
    brand: "Samsung",
    name: 'Odyssey OLED G9 49" Curved Smart Gaming Monitor',
    price: "$1,299.99",
    reviews: 215,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_c9d6ea51f6_7dec3fb022fbe4a5.png",
    rating: 5,
  },
];

export function FeaturedProducts() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto w-full">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Featured Products
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Handpicked high-performance hardware
            </p>
          </div>

          <Link
            href="#"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
