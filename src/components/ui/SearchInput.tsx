"use client";

import { useEffect, useRef } from "react";
import { useSearchStore } from "@/store/search.store";
import { FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export default function SearchInput() {
  const { toggledSearch, closeSearch } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus after the open animation starts
  useEffect(() => {
    if (toggledSearch) inputRef.current?.focus();
  }, [toggledSearch]);

  return (
    <div
      aria-hidden={!toggledSearch}
      // `inert` keeps the hidden input out of the tab order (React 19 accepts a boolean)
      inert={!toggledSearch}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
        toggledSearch
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="border-b border-border bg-surface py-5">
          <div className="mx-auto w-full max-w-5xl px-6">
            <div
              className={`rounded-xl border border-border bg-background transition-transform duration-300 ease-out ${
                toggledSearch ? "translate-y-0" : "-translate-y-2"
              }`}
            >
              <div className="flex h-14 items-center gap-4 px-5">
                <FaSearch
                  className="shrink-0 text-muted-foreground"
                  size={18}
                />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for products..."
                  className="h-full w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                />

                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface hover:text-foreground"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
