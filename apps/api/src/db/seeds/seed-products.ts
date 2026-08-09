import "dotenv/config";

import { eq } from "drizzle-orm";

import { db, pool } from "../client";
import {
  brand,
  category,
  product,
  productAttribute,
  productImage,
  productSpecification,
  specificationTemplate,
} from "../schema/index";

const catalog = {
  brands: [
    { name: "ASUS", slug: "asus" },
    { name: "AMD", slug: "amd" },
    { name: "Intel", slug: "intel" },
    { name: "Samsung", slug: "samsung" },
    { name: "Corsair", slug: "corsair" },
    { name: "Keychron", slug: "keychron" },
    { name: "Logitech", slug: "logitech" },
  ],
  categories: [
    {
      name: "Graphics Cards",
      slug: "graphics-cards",
      attributePrefix: "gpu",
      description: "Dedicated desktop graphics cards.",
      template: [
        {
          key: "chipset",
          label: "Graphics engine",
          group: "Core performance",
          format: "text",
          order: 1,
        },
        {
          key: "vramMb",
          label: "Video memory",
          group: "Core performance",
          unit: "MB",
          format: "number",
          order: 2,
        },
        {
          key: "cudaCores",
          label: "CUDA cores",
          group: "Core performance",
          format: "number",
          order: 3,
        },
        {
          key: "boostClockMhz",
          label: "Boost clock",
          group: "Core performance",
          unit: "MHz",
          format: "number",
          order: 4,
        },
        {
          key: "recommendedPsuWatts",
          label: "Recommended PSU",
          group: "Power",
          unit: "W",
          format: "number",
          order: 5,
        },
        {
          key: "powerConnectors",
          label: "Power connectors",
          group: "Power",
          format: "text",
          order: 6,
        },
      ],
    },
    {
      name: "Processors",
      slug: "processors",
      attributePrefix: "cpu",
      description: "Desktop CPUs for custom PC builds.",
      template: [
        {
          key: "socket",
          label: "Socket",
          group: "Architecture",
          format: "text",
          order: 1,
        },
        {
          key: "cores",
          label: "Core count",
          group: "Performance",
          format: "number",
          order: 2,
        },
        {
          key: "threads",
          label: "Thread count",
          group: "Performance",
          format: "number",
          order: 3,
        },
        {
          key: "baseClockGhz",
          label: "Base clock",
          group: "Performance",
          unit: "GHz",
          format: "number",
          order: 4,
        },
        {
          key: "boostClockGhz",
          label: "Boost clock",
          group: "Performance",
          unit: "GHz",
          format: "number",
          order: 5,
        },
        {
          key: "tdpWatts",
          label: "TDP",
          group: "Power",
          unit: "W",
          format: "number",
          order: 6,
        },
      ],
    },
    {
      name: "Storage",
      slug: "storage",
      attributePrefix: "storage",
      description: "Internal solid state storage.",
      template: [
        {
          key: "capacityGb",
          label: "Capacity",
          group: "Storage",
          unit: "GB",
          format: "number",
          order: 1,
        },
        {
          key: "interface",
          label: "Interface",
          group: "Storage",
          format: "text",
          order: 2,
        },
        {
          key: "formFactor",
          label: "Form factor",
          group: "Physical",
          format: "text",
          order: 3,
        },
        {
          key: "readSpeedMbps",
          label: "Sequential read",
          group: "Performance",
          unit: "MB/s",
          format: "number",
          order: 4,
        },
        {
          key: "writeSpeedMbps",
          label: "Sequential write",
          group: "Performance",
          unit: "MB/s",
          format: "number",
          order: 5,
        },
      ],
    },
    {
      name: "Memory",
      slug: "memory",
      attributePrefix: "memory",
      description: "Desktop memory kits.",
      template: [
        {
          key: "memoryType",
          label: "Memory type",
          group: "Memory",
          format: "text",
          order: 1,
        },
        {
          key: "capacityGb",
          label: "Capacity",
          group: "Memory",
          unit: "GB",
          format: "number",
          order: 2,
        },
        {
          key: "modules",
          label: "Module count",
          group: "Memory",
          format: "number",
          order: 3,
        },
        {
          key: "speedMtps",
          label: "Speed",
          group: "Performance",
          unit: "MT/s",
          format: "number",
          order: 4,
        },
        {
          key: "casLatency",
          label: "CAS latency",
          group: "Performance",
          format: "number",
          order: 5,
        },
      ],
    },
    {
      name: "Monitors",
      slug: "monitors",
      attributePrefix: "monitor",
      description: "Desktop gaming and productivity displays.",
      template: [
        {
          key: "screenSizeInches",
          label: "Screen size",
          group: "Display",
          unit: "in",
          format: "number",
          order: 1,
        },
        {
          key: "resolution",
          label: "Resolution",
          group: "Display",
          format: "text",
          order: 2,
        },
        {
          key: "panelType",
          label: "Panel type",
          group: "Display",
          format: "text",
          order: 3,
        },
        {
          key: "refreshRateHz",
          label: "Refresh rate",
          group: "Performance",
          unit: "Hz",
          format: "number",
          order: 4,
        },
        {
          key: "responseTimeMs",
          label: "Response time",
          group: "Performance",
          unit: "ms",
          format: "number",
          order: 5,
        },
        {
          key: "adaptiveSync",
          label: "Adaptive sync",
          group: "Gaming",
          format: "text",
          order: 6,
        },
      ],
    },
    {
      name: "Keyboards",
      slug: "keyboards",
      attributePrefix: "keyboard",
      description: "Mechanical and wireless computer keyboards.",
      template: [
        {
          key: "layout",
          label: "Layout",
          group: "General",
          format: "text",
          order: 1,
        },
        {
          key: "switchType",
          label: "Switch type",
          group: "Switches",
          format: "text",
          order: 2,
        },
        {
          key: "connection",
          label: "Connection",
          group: "Connectivity",
          format: "text",
          order: 3,
        },
        {
          key: "hotSwappable",
          label: "Hot-swappable",
          group: "Switches",
          format: "boolean",
          order: 4,
        },
        {
          key: "backlight",
          label: "Backlight",
          group: "Features",
          format: "text",
          order: 5,
        },
      ],
    },
    {
      name: "Mouse",
      slug: "mouse",
      attributePrefix: "mouse",
      description: "Gaming and productivity computer mouse.",
      template: [
        {
          key: "sensor",
          label: "Sensor",
          group: "Performance",
          format: "text",
          order: 1,
        },
        {
          key: "maxDpi",
          label: "Maximum DPI",
          group: "Performance",
          format: "number",
          order: 2,
        },
        {
          key: "weightGrams",
          label: "Weight",
          group: "Physical",
          unit: "g",
          format: "number",
          order: 3,
        },
        {
          key: "connection",
          label: "Connection",
          group: "Connectivity",
          format: "text",
          order: 4,
        },
        {
          key: "batteryLifeHours",
          label: "Battery life",
          group: "Battery",
          unit: "hours",
          format: "number",
          order: 5,
        },
      ],
    },
    {
      name: "Desktops",
      slug: "desktops",
      attributePrefix: "desktop",
      description: "Pre-built desktop computers and workstations.",
      template: [
        {
          key: "processor",
          label: "Processor",
          group: "Core",
          format: "text",
          order: 1,
        },
        {
          key: "graphicsCard",
          label: "Graphics card",
          group: "Core",
          format: "text",
          order: 2,
        },
        {
          key: "memoryGb",
          label: "Memory",
          group: "Memory",
          unit: "GB",
          format: "number",
          order: 3,
        },
        {
          key: "storageGb",
          label: "Storage",
          group: "Storage",
          unit: "GB",
          format: "number",
          order: 4,
        },
      ],
    },
    {
      name: "Laptops",
      slug: "laptops",
      attributePrefix: "laptop",
      description: "Notebook computers for work, school, and gaming.",
      template: [
        {
          key: "processor",
          label: "Processor",
          group: "Core",
          format: "text",
          order: 1,
        },
        {
          key: "graphicsCard",
          label: "Graphics card",
          group: "Core",
          format: "text",
          order: 2,
        },
        {
          key: "memoryGb",
          label: "Memory",
          group: "Memory",
          unit: "GB",
          format: "number",
          order: 3,
        },
        {
          key: "storageGb",
          label: "Storage",
          group: "Storage",
          unit: "GB",
          format: "number",
          order: 4,
        },
        {
          key: "screenSizeInches",
          label: "Screen size",
          group: "Display",
          unit: "in",
          format: "number",
          order: 5,
        },
        {
          key: "resolution",
          label: "Resolution",
          group: "Display",
          format: "text",
          order: 6,
        },
      ],
    },
  ],
  products: [
    {
      name: "ASUS ROG Strix GeForce RTX 4090 OC Edition",
      slug: "asus-rog-strix-rtx-4090-oc",
      sku: "ROG-STRIX-RTX4090-O24G-GAMING",
      brand: "asus",
      category: "graphics-cards",
      description:
        "Factory-overclocked GeForce RTX 4090 graphics card with 24 GB GDDR6X memory.",
      price: "1999.99",
      discountPrice: null,
      stock: 6,
      specifications: {
        chipset: "NVIDIA GeForce RTX 4090",
        vramMb: 24576,
        cudaCores: 16384,
        boostClockMhz: 2640,
        recommendedPsuWatts: 1000,
        powerConnectors: "1 x 16-pin",
        dimensionsMm: "357.6 x 149.3 x 70.1",
      },
      attributes: [
        ["gpu.chipset", "NVIDIA GeForce RTX 4090"],
        ["gpu.vramMb", "24576"],
        ["gpu.recommendedPsuWatts", "1000"],
      ],
    },
    {
      name: "AMD Ryzen 7 7800X3D",
      slug: "amd-ryzen-7-7800x3d",
      sku: "100-100000910WOF",
      brand: "amd",
      category: "processors",
      description:
        "Eight-core AM5 desktop processor with AMD 3D V-Cache technology.",
      price: "449.00",
      discountPrice: "389.00",
      stock: 24,
      specifications: {
        socket: "AM5",
        cores: 8,
        threads: 16,
        baseClockGhz: 4.2,
        boostClockGhz: 5.0,
        tdpWatts: 120,
        cacheMb: 96,
      },
      attributes: [
        ["cpu.socket", "AM5"],
        ["cpu.cores", "8"],
        ["cpu.tdpWatts", "120"],
      ],
    },
    {
      name: "Intel Core i9-14900K",
      slug: "intel-core-i9-14900k",
      sku: "BX8071514900K",
      brand: "intel",
      category: "processors",
      description:
        "24-core unlocked 14th-generation Intel Core desktop processor.",
      price: "589.00",
      discountPrice: "539.00",
      stock: 17,
      specifications: {
        socket: "LGA1700",
        cores: 24,
        threads: 32,
        baseClockGhz: 3.2,
        boostClockGhz: 6.0,
        tdpWatts: 125,
        cacheMb: 36,
      },
      attributes: [
        ["cpu.socket", "LGA1700"],
        ["cpu.cores", "24"],
        ["cpu.tdpWatts", "125"],
      ],
    },
    {
      name: "Samsung 990 PRO 2TB",
      slug: "samsung-990-pro-2tb",
      sku: "MZ-V9P2T0BW",
      brand: "samsung",
      category: "storage",
      description: "2 TB PCIe 4.0 NVMe M.2 solid state drive.",
      price: "189.99",
      discountPrice: "159.99",
      stock: 41,
      specifications: {
        capacityGb: 2000,
        interface: "PCIe 4.0 x4 NVMe",
        formFactor: "M.2 2280",
        readSpeedMbps: 7450,
        writeSpeedMbps: 6900,
      },
      attributes: [
        ["storage.capacityGb", "2000"],
        ["storage.interface", "PCIe 4.0"],
        ["storage.formFactor", "M.2 2280"],
      ],
    },
    {
      name: "Corsair Vengeance 32GB DDR5-6000",
      slug: "corsair-vengeance-32gb-ddr5-6000",
      sku: "CMK32GX5M2B6000C36",
      brand: "corsair",
      category: "memory",
      description: "32 GB (2 x 16 GB) DDR5 desktop memory kit.",
      price: "119.99",
      discountPrice: null,
      stock: 33,
      specifications: {
        memoryType: "DDR5",
        capacityGb: 32,
        modules: 2,
        speedMtps: 6000,
        casLatency: 36,
      },
      attributes: [
        ["memory.memoryType", "DDR5"],
        ["memory.capacityGb", "32"],
        ["memory.speedMtps", "6000"],
      ],
    },
    {
      name: "ASUS TUF Gaming VG27AQ1A",
      slug: "asus-tuf-gaming-vg27aq1a",
      sku: "VG27AQ1A",
      brand: "asus",
      category: "monitors",
      description:
        "27-inch QHD IPS gaming monitor with a 170 Hz overclocked refresh rate.",
      price: "329.99",
      discountPrice: "279.99",
      stock: 19,
      specifications: {
        screenSizeInches: 27,
        resolution: "2560 x 1440",
        panelType: "IPS",
        refreshRateHz: 170,
        responseTimeMs: 1,
        adaptiveSync: "NVIDIA G-SYNC Compatible / AMD FreeSync Premium",
      },
      attributes: [
        ["monitor.resolution", "2560x1440"],
        ["monitor.panelType", "IPS"],
        ["monitor.refreshRateHz", "170"],
      ],
    },
    {
      name: "Keychron K2 Wireless Mechanical Keyboard",
      slug: "keychron-k2-wireless-mechanical-keyboard",
      sku: "K2-C3",
      brand: "keychron",
      category: "keyboards",
      description:
        "75% wireless mechanical keyboard with hot-swappable switches and white backlighting.",
      price: "89.00",
      discountPrice: null,
      stock: 27,
      specifications: {
        layout: "75% ANSI",
        switchType: "Gateron Brown",
        connection: "Bluetooth 5.1 / USB-C",
        hotSwappable: true,
        backlight: "White LED",
      },
      attributes: [
        ["keyboard.layout", "75%"],
        ["keyboard.connection", "Wireless"],
        ["keyboard.hotSwappable", "true"],
      ],
    },
    {
      name: "Logitech G PRO X SUPERLIGHT 2",
      slug: "logitech-g-pro-x-superlight-2",
      sku: "910-006628",
      brand: "logitech",
      category: "mouse",
      description: "Lightweight wireless gaming mouse with the HERO 2 sensor.",
      price: "159.99",
      discountPrice: "139.99",
      stock: 22,
      specifications: {
        sensor: "HERO 2",
        maxDpi: 32000,
        weightGrams: 60,
        connection: "LIGHTSPEED wireless / USB-C",
        batteryLifeHours: 95,
      },
      attributes: [
        ["mouse.sensor", "HERO 2"],
        ["mouse.maxDpi", "32000"],
        ["mouse.connection", "Wireless"],
      ],
    },
  ],
} as const;

async function seedProducts() {
  await db.transaction(async (tx) => {
    const brandIds = new Map<string, number>();
    const categoryIds = new Map<string, number>();

    for (const item of catalog.brands) {
      const [savedBrand] = await tx
        .insert(brand)
        .values(item)
        .onConflictDoUpdate({
          target: brand.slug,
          set: { name: item.name, updatedAt: new Date() },
        })
        .returning({ id: brand.id });
      brandIds.set(item.slug, savedBrand.id);
    }

    for (const item of catalog.categories) {
      const [savedCategory] = await tx
        .insert(category)
        .values({
          name: item.name,
          slug: item.slug,
          attributePrefix: item.attributePrefix,
          description: item.description,
        })
        .onConflictDoUpdate({
          target: category.slug,
          set: {
            name: item.name,
            attributePrefix: item.attributePrefix,
            description: item.description,
            updatedAt: new Date(),
          },
        })
        .returning({ id: category.id });
      categoryIds.set(item.slug, savedCategory.id);

      await tx
        .insert(specificationTemplate)
        .values({ categoryId: savedCategory.id, fields: [...item.template] })
        .onConflictDoUpdate({
          target: specificationTemplate.categoryId,
          set: { fields: [...item.template], updatedAt: new Date() },
        });
    }

    for (const item of catalog.products) {
      const brandId = brandIds.get(item.brand);
      const categoryId = categoryIds.get(item.category);

      if (!brandId || !categoryId) {
        throw new Error(`Missing brand or category for ${item.sku}`);
      }

      const [savedProduct] = await tx
        .insert(product)
        .values({
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          brandId,
          categoryId,
          description: item.description,
          price: item.price,
          discountPrice: item.discountPrice,
          stock: item.stock,
          status: "active",
        })
        .onConflictDoUpdate({
          target: product.sku,
          set: {
            name: item.name,
            slug: item.slug,
            brandId,
            categoryId,
            description: item.description,
            price: item.price,
            discountPrice: item.discountPrice,
            stock: item.stock,
            status: "active",
            updatedAt: new Date(),
          },
        })
        .returning({ id: product.id });

      await tx
        .insert(productSpecification)
        .values({
          productId: savedProduct.id,
          specifications: item.specifications,
        })
        .onConflictDoUpdate({
          target: productSpecification.productId,
          set: { specifications: item.specifications, updatedAt: new Date() },
        });

      await tx
        .delete(productAttribute)
        .where(eq(productAttribute.productId, savedProduct.id));
      await tx.insert(productAttribute).values(
        item.attributes.map(([attributeName, attributeValue]) => ({
          productId: savedProduct.id,
          attributeName,
          attributeValue,
        })),
      );

      await tx
        .delete(productImage)
        .where(eq(productImage.productId, savedProduct.id));
      await tx.insert(productImage).values({
        productId: savedProduct.id,
        url: `https://placehold.co/1200x900?text=${encodeURIComponent(item.name)}`,
        altText: item.name,
        position: 0,
      });
    }
  });
}

seedProducts()
  .then(() => console.log("Product catalog seeded successfully."))
  .catch((error: unknown) => {
    console.error("Failed to seed product catalog", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
