import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- IMPORTANTE: Adicione isso

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agenda Barber",
  description: "Agende seu corte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {children}
        <Toaster /> {/* <--- IMPORTANTE: Coloque isso aqui, antes de fechar o body */}
      </body>
    </html>
  );
}