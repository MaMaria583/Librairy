import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import type { ReactNode } from "react";

export default function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen text-slate-900" style={{ backgroundImage: "url('/images/books/bg-pattern.jpg')", backgroundSize: "cover", backgroundAttachment: "fixed", backgroundPosition: "center" }}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
