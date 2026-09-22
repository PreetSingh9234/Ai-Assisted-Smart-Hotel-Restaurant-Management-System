import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AppLayout from "@/components/layout/AppLayout";
import { NoraProvider } from "@/context/NoraContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NORA Dashboard",
  description: "AI-Assisted Smart Hotel & Restaurant Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NoraProvider>
          <AppLayout>{children}</AppLayout>
        </NoraProvider>
      </body>
    </html>
  );
}
