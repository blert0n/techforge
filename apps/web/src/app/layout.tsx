import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechForge",
  description: "Modern PC hardware marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
