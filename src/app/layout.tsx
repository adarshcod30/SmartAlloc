import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartAlloc | AI-Powered Smart Resource Allocation",
  description: "Intelligent resource allocation platform using AI, ML & Generative AI to optimize enterprise compute, personnel, and budget allocation in real-time.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310B981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2L2 7l10 5 10-5-10-5z'/><path d='M2 17l10 5 10-5'/><path d='M2 12l10 5 10-5'/></svg>"
  }
};

import { GlobalNav } from "@/components/GlobalNav";
import Chatbot from "@/components/Chatbot";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#050505] text-white antialiased`}>
        <GlobalNav />
        <main>
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  );
}
