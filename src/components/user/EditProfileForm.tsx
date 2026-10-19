"use client";

import { getProfile, updateProfile } from "@/server-actions/user/user";
import Button from "../ui/Button";
import Input from "../ui/Input";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  userProfile: Awaited<ReturnType<typeof getProfile>>;
}

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(20, "Phone number is too long."),
  email: z.email(),
  firstname: z.string().trim().min(2, "First name is required."),
  lastname: z.string().trim().min(2, "Last name is required."),
  country: z.string().trim().min(2, "Country is required."),
  state: z.string().trim().min(2, "State is required."),
  city: z.string().trim().min(2, "City is required."),
  postalCode: z.string().trim().optional(),
  street: z.string().trim().min(5, "Street address is required."),
});

export type EditProfileValues = z.infer<typeof editProfileSchema>;

export default function EditProfileForm({ userProfile }: Props) {
  const router = useRouter();
  const address = userProfile?.addresses[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: userProfile?.name ?? "",
      email: userProfile?.email ?? "",
      phone: userProfile?.phone ?? "",

      firstname: address?.firstName ?? "",
      lastname: address?.lastName ?? "",
      country: address?.country ?? "",
      city: address?.city ?? "",
      postalCode: address?.postalCode ?? "",
      state: address?.state ?? "",
      street: address?.street ?? "",
    },
  });

  const onSubmit: SubmitHandler<EditProfileValues> = async (data) => {
    const result = await updateProfile(data);

    if (!result.success) return toast.error(result.message);

    toast.success(result.message);
    router.refresh();
  };

  return (
    <form className="mt-10 space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {/* Personal Information */}
      <div className="rounded-2xl border border-border p-6">
        {/* Heading */}
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {/* User Information */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input
            {...register("name")}
            error={errors.name?.message}
            label="Full Name"
            placeholder="John Doe"
          />
          <Input
            {...register("phone")}
            label="Phone Number"
            placeholder="+212 622334455"
            error={errors.phone?.message}
          />
          <div className="md:col-span-2">
            <Input
              {...register("email")}
              label="Email Address"
              placeholder="john@gmail.com"
              error={errors.email?.message}
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="rounded-2xl border border-border p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        {/* User Information */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input
            {...register("firstname")}
            error={errors.firstname?.message}
            label="First Name"
          />
          <Input
            {...register("lastname")}
            error={errors.lastname?.message}
            label="Last Name"
          />
          <Input
            {...register("country")}
            error={errors.country?.message}
            label="Country"
          />
          <Input
            {...register("state")}
            error={errors.state?.message}
            label="State"
          />
          <Input
            {...register("city")}
            error={errors.city?.message}
            label="City"
          />
          <Input
            {...register("postalCode")}
            error={errors.postalCode?.message}
            label="Postal Code"
          />
          <div className="md:col-span-2">
            <Input
              {...register("street")}
              error={errors.street?.message}
              variant="textarea"
              label="Street Address "
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
