import { Plus } from "lucide-react";
import Link from "next/link";

export default function AddressCard() {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
          Default Address
        </h2>

        <Link
          href="/account/addresses"
          className="text-sm font-medium text-primary hover:underline"
        >
          Manage
        </Link>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">Alex Smith</p>

            <p className="text-sm text-muted-foreground">
              123 Tech Avenue, Suite 400
            </p>

            <p className="text-sm text-muted-foreground">
              San Francisco, CA 94105
            </p>

            <p className="text-sm text-muted-foreground">United States</p>
          </div>

          <span
            className="
              rounded
              bg-muted
              px-2
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-muted-foreground
            "
          >
            Default
          </span>
        </div>

        <Link
          href="/account/addresses/new"
          className="
            mt-6
            flex
            items-center
            gap-2
            text-sm
            font-bold
            text-primary
            transition-colors
            hover:text-primary/80
          "
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Link>
      </div>
    </section>
  );
}
