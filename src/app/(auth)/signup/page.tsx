"use client";

import FrontendLayout from "@/components/layouts/FrontendLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { signInWithGoogle } from "@/services/signInWithGoogle";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import z from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type FormValues = z.infer<typeof schema>;

export default function SingUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message as string);
      return;
    }

    toast.success("Registration Successful");
    router.replace("/account");
  };

  return (
    <FrontendLayout>
      <section className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Create Account
            </h2>

            <p className="mt-3">
              Join us and start shopping your favorite styles.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5 mt-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Fullname */}
            <Input
              label="Full Name"
              placeholder="John Doe"
              type="text"
              {...register("name")}
              error={errors.name?.message}
            />
            {/* Email Address */}
            <Input
              label="Email Address"
              placeholder="john@gmail.com"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            {/* Password */}
            <Input
              label="Password"
              placeholder="Create a Password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <Button
              fullWidth
              type="button"
              variant="outline"
              leftIcon={<FcGoogle size={18} />}
              onClick={signInWithGoogle}
            >
              Continue with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/signin">Sin in</Link>
          </p>
        </div>
      </section>
    </FrontendLayout>
  );
}
