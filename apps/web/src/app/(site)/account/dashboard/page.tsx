import AccountLayout from "@/components/account/account-layout";
import AddressCard from "@/components/account/dashboard/address-card";
import ProfileInformation from "@/components/account/dashboard/profile-information";
import RecentOrders from "@/components/account/dashboard/recent-orders";
import WishlistPreview from "@/components/account/dashboard/wishlist-preview";

export default function AccountPage() {
  return (
    <div>
      <div className="mb-4">
        <h1
          className="
          text-3xl
          font-bold
          uppercase
          "
        >
          Welcome Back, Alex
        </h1>

        <p className="text-muted-foreground">
          Manage your orders, profile, and preferences.
        </p>
      </div>
      <div className="flex gap-8 flex-col">
        <RecentOrders />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProfileInformation />
          <AddressCard />
        </div>
        <WishlistPreview />
      </div>
    </div>
  );
}
