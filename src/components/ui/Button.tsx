import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  paddingX?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface",
};

export default function Button({
  children,
  variant = "primary",
  paddingX = "px-4",
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${paddingX} ${fullWidth ? "w-full" : "w-fit"} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Left icon */}
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {/* Children */}
      <span>{children}</span>
      {/* Right icon */}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
}
