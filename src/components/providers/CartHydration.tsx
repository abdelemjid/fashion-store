"use client";

import { useCartStore } from "@/store/cart.store";
import { useEffect } from "react";

export default function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
