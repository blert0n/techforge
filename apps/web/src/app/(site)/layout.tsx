import { Header } from "../../components/layout/header/header";
import { Footer } from "../../components/layout/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-3 py-4 font-sans sm:px-4 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
