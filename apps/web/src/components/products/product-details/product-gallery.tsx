"use client";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productImages } from "./product-data";
export function ProductGallery() { const [selected, setSelected] = useState(0); return <div className="w-full lg:w-1/2"><div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8"><Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full border border-border bg-card"><Heart /></Button><Image src={productImages[selected]} alt="NVIDIA GeForce RTX 4090" width={640} height={640} className="h-full w-full object-contain" /></div><div className="mt-4 grid grid-cols-4 gap-3">{productImages.map((image, index) => <Button key={image} type="button" variant="outline" onClick={() => setSelected(index)} className={`h-auto aspect-square p-2 ${selected === index ? "border-2 border-primary" : ""}`}><Image src={image} alt="Product thumbnail" width={100} height={100} className="h-full w-full object-contain" /></Button>)}</div></div>; }
