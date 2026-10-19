"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import SidebarContent from "./SidebarContent";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [toggled, setToggled] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 w-full z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Admin Panel
        </Link>

        {/* Menu Button */}
        <button
          onClick={() => setToggled(true)}
          className="rounded-lg border border-border p-2"
        >
          <FiMenu size={22} />
        </button>
      </header>

      {/* overlay */}
      {toggled && (
        <div
          onClick={() => setToggled(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-border bg-background transition-transform duration-300 lg:hidden ${toggled ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Menu */}
        <button
          onClick={() => setToggled(false)}
          className="absolute right-4 top-5 rounded-lg p-2 hover:bg-surface"
        >
          <FiX />
        </button>

        {/* Side Content */}
        <SidebarContent
          pathname={pathname}
          closeSidebar={() => setToggled(false)}
        />
      </aside>

      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-border bg-background lg:flex">
        <SidebarContent
          pathname={pathname}
          closeSidebar={() => setToggled(false)}
        />
      </aside>
    </>
  );
}
