import FrontendLayout from "@/components/layouts/FrontendLayout";
import BreadCrumb from "@/components/ui/BreadCrumb";
import EditProfileForm from "@/components/user/EditProfileForm";
import { getProfile } from "@/server-actions/user/user";

export const dynamic = "force-dynamic";

export default async function page() {
  const userProfile = await getProfile();

  return (
    <FrontendLayout>
      <section className="mx-auto max-w-4xl py-12">
        {/* Path */}
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Edit" },
          ]}
        />
        {/* Title */}
        <p className="text-muted-foreground mt-2">Edit your profile</p>
        {/* Form */}
        <EditProfileForm userProfile={userProfile} />
      </section>
    </FrontendLayout>
  );
}
