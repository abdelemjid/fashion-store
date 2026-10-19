import FrontendLayout from "@/components/layouts/FrontendLayout";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import { logout } from "@/server-actions/auth/logout";
import { getProfile } from "@/server-actions/user/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiMapPin, FiPackage, FiUser } from "react-icons/fi";

export default async function page() {
  const userProfile = await getProfile();

  if (!userProfile) redirect("/signin");

  const address = userProfile.addresses[0];

  return (
    <FrontendLayout>
      <section className="mx-auto max-w-5xl py-12">
        {/* Path */}
        <div>
          <BreadCrumb
            items={[{ label: "Home", href: "/" }, { label: "Account" }]}
          />
          <p className="text-muted-foreground mt-2">
            Manage your profile, orders and account.
          </p>
        </div>
        {/* Profile Information */}
        <div className="mt-10 space-y-6">
          {/* Profile */}
          <div className="rounded-2xl border border-border p-6">
            {/* Profile Title */}
            <div className="mb-6 flex items-center gap-3">
              <FiUser className="text-primary" size={22} />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>

            {/* User Info */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Fullname */}
              <div>
                <p className="text-sm text-muted-foreground">Fullname</p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
              {/* Email */}
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userProfile.email}</p>
              </div>
              {/* Phone */}
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">
                  {userProfile.phone ?? "Not Provided"}
                </p>
              </div>
              {/* Member since */}
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {userProfile.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Profile Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              {/* Edit Profile */}
              <Link href="/account/edit">
                <Button leftIcon={<FaUser />}>Edit Profile</Button>
              </Link>
              {/* My Orders */}
              <Link href="/account/orders">
                <Button leftIcon={<FiPackage />} variant="outline">
                  My Orders
                </Button>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                leftIcon={<FiLogOut />}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Address */}
          {address ? (
            <div className="rounded-2xl border border-border p-6">
              {/* Address Title */}
              <div className="flex items-center gap-3 mb-3">
                <FiMapPin className="text-primary" size={22} />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>

              <div className="space-y-1">
                <p>
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>{address.country}</p>
                {address.postalCode && <p>{address.postalCode}</p>}
                <p>{address.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No shipping address added yet.
            </p>
          )}
        </div>
      </section>
    </FrontendLayout>
  );
}
