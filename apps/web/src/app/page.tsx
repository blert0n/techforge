import type { Product } from "@techforge/types";

const sampleProducts: Product[] = [
  { id: "1", name: "RTX 4080", price: 999, category: "GPU" },
  { id: "2", name: "Ryzen 7 7800X3D", price: 379, category: "CPU" },
];

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>TechForge</h1>
      <p>Modern PC hardware marketplace starter.</p>
      <ul>
        {sampleProducts.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
