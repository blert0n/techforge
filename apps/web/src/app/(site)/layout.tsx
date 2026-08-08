import { Header } from "../../components/layout/header/header";
import { Footer } from "../../components/layout/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <main
        style={{ flex: 1, padding: "16px 32px 16px", fontFamily: "sans-serif" }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
