"use client";

import { useSearchStore } from "@/store/search.store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { IoBagOutline, IoSearch } from "react-icons/io5";
import CartCount from "./CartCount";

const navLinks = [
  { link: "/", label: "Home" },
  { link: "/shop", label: "Shop" },
  { link: "/about", label: "About" },
  { link: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { toggleSearch } = useSearchStore();

  const pathname = usePathname();
  const router = useRouter();
  const [toggled, setToggled] = useState(false);

  return (
    <header className="border-b border-border bg-background">
      {/* Navbar */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold tracking-tight text-foreground"
        >
          Fashion.
        </Link>

        {/* Laptop Navbar */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.link;

            return (
              <Link
                className={`relative text-sm font-medium uppercase transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                href={link.link}
                key={link.link}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Laptop Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => toggleSearch()}
              className="rounded-full p-2 text-foreground transition-colors hover:bg-surface cursor-pointer"
            >
              <IoSearch size={22} />
            </button>
            {/* User Button */}
            <button
              onClick={() => router.push("/signin")}
              className="rounded-full p-2 text-foreground transition-colors hover:bg-surface cursor-pointer"
            >
              <FaRegUser size={22} />
            </button>
            {/* Cart Badge */}
            <button
              onClick={() => router.push("/cart")}
              className="relative rounded-full p-2 text-foreground transition-colors hover:bg-surface cursor-pointer"
            >
              <IoBagOutline size={23} />
              <CartCount />
            </button>
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={() => setToggled(!toggled)}
            className="text-2xl text-foreground md:hidden cursor-pointer"
          >
            {toggled ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {toggled && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-4 py-4">
            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                href={link.link}
                key={link.link}
                onClick={() => setToggled(false)}
                className="rounded-md px-2 py-3 text-muted-foreground transition hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Button */}
            <button
              onClick={() => router.push("/signin")}
              className="mt-4 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
