"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Props {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string | null;
}

export function AddToCartButton({ id, title, author, price, imageUrl }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ id, title, author, price, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
        added
          ? "bg-emerald-500 text-white"
          : "bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
      }`}
    >
      {added ? (
        <>
          <Check size={18} />
          Ajouté au panier !
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          Ajouter au panier
        </>
      )}
    </button>
  );
}
