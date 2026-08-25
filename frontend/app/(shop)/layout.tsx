'use client'

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/header/Header";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
