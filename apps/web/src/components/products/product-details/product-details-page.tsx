import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { ProductGallery } from "./product-gallery";
import { ProductOverview } from "./product-overview";
import { relatedProducts } from "./product-data";
import { ProductTabs } from "./product-tabs";
export default function ProductDetailsPage() { return <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="size-3" /><Link href="/category/components" className="hover:text-foreground">Components</Link><ChevronRight className="size-3" /><span className="font-medium text-foreground">NVIDIA GeForce RTX 4090</span></nav><section className="flex flex-col gap-10 lg:flex-row"><ProductGallery /><ProductOverview /></section><ProductTabs /><section className="border-t border-border pt-10"><h2 className="mb-6 text-xl font-bold">Related Products</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{relatedProducts.map((product) => <ProductCard key={product.name} product={product} />)}</div></section></main>; }
