import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project ideas",
  description: "A website for project ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-slate-900 p-2 flex justify-between">
          <div>
            <Link href="/" className="text-white text-xl">Project ideas</Link>
          </div>
          <div>
            <Link href="/idea/create" className="text-white text-xl">New idea</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
