import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Desktops",
    price: "From $1099",
    image: "/images/home/categories-desktop.png",
  },
  {
    name: "Laptops",
    price: "From $799",
    image: "/images/home/categories-laptop.png",
  },
  {
    name: "GPUs",
    price: "From $299",
    image: "/images/home/categories-gpu.png",
  },
  {
    name: "CPUs",
    price: "From $149",
    image: "/images/home/categories-cpu.png",
  },
  {
    name: "Monitors",
    price: "From $249",
    image: "/images/home/categories-monitor.png",
  },
  {
    name: "Accessories",
    price: "From $49",
    image: "/images/home/categories-accessory.png",
  },
];

export function CategorySection() {
  return (
    <section className="bg-background py-10">
      <div className="mx-auto w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Shop by Category
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Find exactly what you need for your build
            </p>
          </div>

          <Link
            href="#"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              href="#"
              key={category.name}
              className="cat-card group block h-36"
            >
              <img
                src={category.image}
                alt={category.name}
                className="cat-img h-full w-full object-cover"
              />

              <div className="cat-overlay" />

              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold leading-tight text-white">
                      {category.name}
                    </p>

                    <p className="text-[10px] text-white/50">
                      {category.price}
                    </p>
                  </div>

                  <ArrowRight
                    className="
                      cat-arrow
                      h-3 w-3
                      text-white
                    "
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
