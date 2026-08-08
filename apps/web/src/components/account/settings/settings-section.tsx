import type { ReactNode } from "react";

export function SettingsSection({
  title,
  description,
  children,
  danger = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={`rounded-xl border bg-card shadow-sm ${danger ? "border-destructive/30" : "border-border"}`}
    >
      <div
        className={`border-b p-6 ${danger ? "border-destructive/20" : "border-border"}`}
      >
        <h2
          className={`text-lg font-bold uppercase tracking-wider ${danger ? "text-destructive" : "text-foreground"}`}
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
