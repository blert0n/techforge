import AccountSidebar from "./dashboard/account-sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="
      flex-1
      w-full
      max-w-350
      mx-auto
      pt-4
      flex
      flex-col
      md:flex-row
      gap-8
    "
    >
      <AccountSidebar />

      <div
        className="
        flex-1
        space-y-8
      "
      >
        {children}
      </div>
    </main>
  );
}
