"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ElementType } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  Package,
  Receipt,
  Truck,
  Settings,
  BookMarked,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href?: string;
  icon: ElementType;
  children?: { label: string; href: string; icon: ElementType }[];
};

const navItems: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Caisse (POS)",
    href: "/caisse",
    icon: ShoppingCart,
  },
  {
    label: "Stock",
    icon: Package,
    children: [
      { label: "Livres", href: "/stock/livres", icon: BookOpen },
      { label: "Fournitures", href: "/stock/fournitures", icon: Package },
    ],
  },
  {
    label: "Commandes en ligne",
    href: "/commandes",
    icon: ShoppingBag,
  },
  {
    label: "Ventes",
    href: "/ventes",
    icon: Receipt,
  },
  {
    label: "Fournisseurs",
    href: "/fournisseurs",
    icon: Truck,
  },
  {
    label: "Stock bas",
    href: "/stock/alertes",
    icon: AlertTriangle,
  },
  {
    label: "Paramètres",
    href: "/parametres",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Stock: true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (children: NavItem["children"]) =>
    children?.some((c) => pathname.startsWith(c.href));

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center shadow">
          <BookMarked className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">
            GestionLibrairy
          </p>
          <p className="text-slate-400 text-xs">Librairie & Papeterie</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          if (item.children) {
            const isOpen = openGroups[item.label] ?? false;
            const groupActive = isGroupActive(item.children);

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    groupActive
                      ? "text-white bg-sidebar-active"
                      : "text-slate-400 hover:text-white hover:bg-sidebar-hover"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4.5 h-4.5 shrink-0" size={18} />
                    {item.label}
                  </div>
                  {isOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                {isOpen && (
                  <div className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(child.href)
                            ? "text-white bg-sidebar-active font-medium"
                            : "text-slate-400 hover:text-white hover:bg-sidebar-hover"
                        )}
                      >
                        <child.icon size={16} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href!)
                  ? "text-white bg-sidebar-active"
                  : "text-slate-400 hover:text-white hover:bg-sidebar-hover"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-xs text-slate-500 text-center">
          v0.1.0 · © 2025 GestionLibrairy
        </p>
      </div>
    </aside>
  );
}
