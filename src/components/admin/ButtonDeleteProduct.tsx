"use client";

import { deleteProduct } from "@/server-actions/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";

interface Props {
  productId: string;
}

export default function ButtonDeleteProduct({ productId }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const result = await deleteProduct(productId);
      if (!result.success) return toast.error(result.message);

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-lg p-2 text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : <FaTrashAlt />}
    </button>
  );
}
