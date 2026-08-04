"use client";

import { useProducts } from "../../hooks/use-products";

export default function HomePage() {
  const { data, isPending, isError } = useProducts();

  return (
    <>
      <h1>TechForge</h1>
      <p>Modern PC hardware marketplace starter.</p>
      {isPending && <p>Loading...</p>}
      {isError && <p>Failed to load products.</p>}
      {data && (
        <ul>
          {data.map((product) => (
            <li key={product.id}>
              {product.name} — ${product.price}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
