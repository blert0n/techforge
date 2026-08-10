"use client";

import { useState } from "react";
import {
  Barcode,
  Box,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  Laptop,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TrackingTimeline, type TrackingDetails } from "./tracking-timeline";

const activeOrders: TrackingDetails[] = [
  {
    id: "TF-89420-11",
    orderedAt: "Oct 24, 2023",
    total: "$1,399.63",
    products: [
      "Intel Core i9-13900K Processor",
      "ASUS ROG Maximus Z790 Hero Motherboard",
    ],
    icons: [Cpu, Box],
    itemSummary: "2 items · Qty: 1 each",
    trackingNumber: "7489204821039204",
    carrier: "FedEx Priority",
    arrival: "Arriving Tomorrow by 8 PM",
    steps: ["Oct 24", "Oct 25", "Oct 26", "Oct 27"],
    activeStep: 2,
    history: [
      ["Package in transit — Oakland Distribution Hub", "Oct 26, 2:34 PM"],
      ["Departed FedEx facility — Memphis, TN", "Oct 26, 6:10 AM"],
      ["Picked up by carrier — TechForge Warehouse", "Oct 25, 4:22 PM"],
      ["Order confirmed and payment processed", "Oct 24, 11:05 AM"],
    ],
  },
  {
    id: "TF-89280-08",
    orderedAt: "Oct 20, 2023",
    total: "$2,199.00",
    products: ["ASUS ROG Zephyrus G16 Gaming Laptop"],
    icons: [Laptop],
    itemSummary: "1 item · Qty: 1",
    trackingNumber: "7820359504193847",
    carrier: "UPS Ground",
    arrival: "Preparing for shipment",
    steps: ["Oct 20", "Oct 21", "—", "—"],
    activeStep: 1,
    history: [
      ["Order is being prepared at TechForge Warehouse", "Oct 21, 10:16 AM"],
      ["Payment confirmed", "Oct 20, 4:42 PM"],
      ["Order placed", "Oct 20, 4:40 PM"],
    ],
  },
];

export function ActiveOrder() {
  const [index, setIndex] = useState(0);
  const order = activeOrders[index];
  const switchOrder = (direction: -1 | 1) =>
    setIndex(
      (current) =>
        (current + direction + activeOrders.length) % activeOrders.length,
    );

  return (
    <section className="overflow-hidden rounded-xl border border-primary/30 bg-card shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-border bg-primary/5 px-6 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="size-2 animate-pulse rounded-full bg-blue-500" />
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Order #{order.id} · {order.orderedAt}
            </p>
            <h2 className="font-bold">Active Shipment</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => switchOrder(-1)}
            >
              <ChevronLeft />
              <span className="sr-only">Previous active order</span>
            </Button>
            <span className="min-w-12 text-center text-xs text-muted-foreground">
              {index + 1} / {activeOrders.length}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => switchOrder(1)}
            >
              <ChevronRight />
              <span className="sr-only">Next active order</span>
            </Button>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-600">
            {order.activeStep === 1 ? "Processing" : "In Transit"}
          </span>
          <b>{order.total}</b>
        </div>
      </div>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex gap-3">
            {order.icons.map((Icon, iconIndex) => (
              <span
                key={iconIndex}
                className="grid size-16 place-items-center rounded-lg border border-border bg-muted text-muted-foreground"
              >
                <Icon className="size-6" />
              </span>
            ))}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{order.products[0]}</p>
            {order.products.slice(1).map((product) => (
              <p key={product} className="text-xs text-muted-foreground">
                {product}
              </p>
            ))}
            <p className="mt-1 text-xs text-muted-foreground">
              {order.itemSummary}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button">
              <Truck />
              Track package
            </Button>
            <Button type="button" variant="outline">
              Details
            </Button>
          </div>
        </div>
        <TrackingTimeline order={order} />
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Barcode className="size-4" />
          Tracking #: <b className="text-foreground">{order.trackingNumber}</b>
          <Button type="button" variant="link" size="sm">
            <Copy />
            Copy
          </Button>
          <span>·</span>
          <Truck className="size-4" />
          Carrier: <b className="text-foreground">{order.carrier}</b>
        </div>
      </div>
    </section>
  );
}
