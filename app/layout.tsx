import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/auth";
import { login, logout } from "./lib/actions";
import { FaPen, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project ideas",
  description: "A website for project ideas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-slate-900 p-2 flex justify-between">
          <div>
            <Link href="/" className="text-white text-xl">Project ideas</Link>
          </div>
          {
            session !== null && (
              <div className="flex gap-7 items-center">
                <Link href="/profile">
                  {session.user?.image && <img src={session.user?.image} alt="User image" width="30px" height="30px" className="rounded-full" />}
                  {!session.user?.image && <span className="text-white text-xl">{session.user?.name ?? ''}</span>}
                </Link>
                <Link href="/idea/create" className="text-white text-xl"><FaPen /></Link>
                <form action={logout} className="flex items-center">
                  <button className="text-white text-xl"><FaSignOutAlt /></button>
                </form>
              </div>
            )
          }
          {
            session === null && (
              <div className="flex items-center">
                <form action={login} className="flex items-center">
                  <button className="text-white text-xl"><FaSignInAlt /></button>
                </form>
              </div>
            )
          }
        </nav>
        {children}
      </body>
    </html>
  );
}
