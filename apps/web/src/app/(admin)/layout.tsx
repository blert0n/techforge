import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "../../components/layout/auth/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header className="fixed top-0 left-0 z-50">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          Back to Store
        </Link>
      </Header>

      <main className="flex w-full flex-1 items-center justify-center px-4 pt-28 pb-16">
        {children}
      </main>

      <footer className="w-full border-t border-border bg-card px-6 py-3.5">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TechForge. All rights reserved.
          &nbsp;&middot;&nbsp;
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          &nbsp;&middot;&nbsp;
          <Link
            href="/terms"
            className="transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>
        </p>
      </footer>
    </div>
  );
}
