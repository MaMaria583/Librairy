import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { StoreSidebar } from "@/components/storefront/StoreSidebar";
import type { ReactNode } from "react";

export default function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex flex-1 container mx-auto bg-white shadow-sm my-4 rounded-xl overflow-hidden border border-slate-200">
        <StoreSidebar />
        <main className="flex-1 overflow-x-hidden min-h-full">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
