import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { SocialSidebar } from "@/components/storefront/SocialSidebar";
import { ChatWidget } from "@/components/storefront/ChatWidget";
import type { ReactNode } from "react";

export default function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />
      <SocialSidebar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
