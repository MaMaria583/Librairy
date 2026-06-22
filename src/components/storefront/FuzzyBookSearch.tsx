"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import { BookCard } from "./BookCard";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string | null;
  genre?: string | null;
}

interface Props {
  books: Book[];
  query: string;
}

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function FuzzyBookSearch({ books, query }: Props) {
  const normalizedBooks = useMemo(
    () => books.map((b) => ({ ...b, _title: normalize(b.title), _author: normalize(b.author) })),
    [books]
  );

  const fuse = useMemo(
    () =>
      new Fuse(normalizedBooks, {
        keys: ["_title", "_author", "genre"],
        threshold: 0.4,
        distance: 200,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [normalizedBooks]
  );

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return books;
    return fuse.search(q).map((r) => r.item);
  }, [fuse, query, books]);

  if (results.length === 0) {
    return (
      <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-pink-200">
        <p className="text-lg text-slate-500 font-medium">
          Aucun résultat pour &quot;{query}&quot;.
        </p>
        <p className="text-sm text-slate-400 mt-1">Essayez avec d&apos;autres mots.</p>
        <Link href="/livres" className="mt-4 inline-block text-[#1e3a5f] hover:underline text-sm">
          Voir tous les livres
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-slate-500 text-sm mb-6">
        {results.length} résultat{results.length > 1 ? "s" : ""} pour &quot;{query}&quot;
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
}
