import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import ClientProvider from "@/components/clientProvider";
import { getServerSession } from "@/lib/api/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Student Access Portal | CI-UCBC",
  description: "Student Access Portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en" className={`${inter.variable}  antialiased`}>
      <body>
        <ClientProvider session={session}>{children}</ClientProvider>
      </body>
    </html>
  );
}
