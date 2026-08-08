import { Award, Headset, ShieldCheck, Truck } from "lucide-react";

const trustIndicators = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% protected checkout",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free on orders over $500",
  },
  {
    icon: Award,
    title: "Official Warranty",
    description: "Authorized retailer",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "Expert hardware help",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12">
      <div className="mx-auto w-full">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {trustIndicators.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
