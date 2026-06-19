"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function StoreSidebar() {
  const searchParams = useSearchParams();
  const currentRayon = searchParams.get("rayon");

  const categories = [
    {
      name: "Littérature",
      href: "/livres?rayon=litterature",
      rayons: ["litterature", "romans", "poesie", "theatre"],
      subcategories: [
        { name: "Romans", href: "/livres?rayon=romans" },
        { name: "Poésie", href: "/livres?rayon=poesie" },
        { name: "Théâtre", href: "/livres?rayon=theatre" },
      ],
    },
    { name: "BD & Mangas", href: "/livres?rayon=bd", rayons: ["bd", "bd-mangas"] },
    { name: "Jeunesse", href: "/livres?rayon=jeunesse", rayons: ["jeunesse"] },
    { name: "Vie pratique", href: "/livres?rayon=vie-pratique", rayons: ["vie-pratique"] },
    { name: "Sciences humaines", href: "/livres?rayon=sciences-humaines", rayons: ["sciences-humaines"] },
    { name: "Arts & Culture", href: "/livres?rayon=arts", rayons: ["arts"] },
    { name: "Droit & Économie", href: "/livres?rayon=droit", rayons: ["droit"] },
    { name: "Loisirs créatifs", href: "/livres?rayon=loisirs", rayons: ["loisirs"] },
    { name: "Scolaire & Pédagogique", href: "/livres?rayon=scolaire", rayons: ["scolaire"] },
    { name: "Voyages & Guides", href: "/livres?rayon=voyages", rayons: ["voyages"] },
    { name: "Informatique", href: "/livres?rayon=informatique", rayons: ["informatique"] },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 min-h-screen p-6 hidden lg:block">
      <h2 className="text-slate-500 font-bold text-sm tracking-wider uppercase mb-6">
        Rayons
      </h2>
      <nav className="flex flex-col gap-4">
        {categories.map((cat, idx) => {
          const isActive = cat.rayons?.includes(currentRayon || "");
          return (
            <div key={idx} className="flex flex-col gap-2">
              <Link
                href={cat.href}
                className={`text-lg transition-colors ${
                  isActive ? "text-blue-600 font-bold" : "text-slate-800 hover:text-blue-600"
                }`}
              >
                {cat.name}
              </Link>

              {cat.subcategories && (
                <div className="flex flex-col gap-2 pl-4 mt-1 border-l-2 border-slate-100 ml-1">
                  {cat.subcategories.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      href={sub.href}
                      className="text-slate-600 hover:text-blue-600 flex items-center gap-2"
                    >
                      <span className="text-slate-400">*</span>
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
