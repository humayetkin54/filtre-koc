"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/app/auth/actions";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/koclar", label: "Koçlar" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/paketler", label: "Paketler" },
];

export default function Navbar({
  user,
  isCoach = false,
  unseenCount = 0,
  isAdmin = false,
}: {
  user: User | null;
  isCoach?: boolean;
  unseenCount?: number;
  isAdmin?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = isCoach ? navLinks.filter((l) => l.href === "/") : navLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/logo-navbar.svg" alt="Rekor Zeka" width={512} height={512} className="h-16 w-16" priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={isCoach ? "/koc-paneli" : "/randevularim"}
                className="relative rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                {isCoach ? "Koç Paneli" : "Randevularım"}
                {isCoach && unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unseenCount}
                  </span>
                )}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
                >
                  Talepler
                </Link>
              )}
              <Link
                href={isCoach ? "/koc-paneli" : "/profil"}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                {user.user_metadata?.full_name ?? user.email}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  Çıkış
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/koc-giris"
                className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
              >
                Eğitmen Girişi
              </Link>
              <Link
                href="/giris"
                className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                Öğrenci Girişi
              </Link>
              <Link
                href="/kayit"
                className="btn-primary px-4 py-2 text-sm"
              >
                Ücretsiz kaydol
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-200/80 bg-white/95 px-4 py-4 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4">
            {user ? (
              <>
                <span className="px-3 py-2 text-sm text-zinc-500">
                  {user.user_metadata?.full_name ?? user.email}
                </span>
                <Link
                  href={isCoach ? "/koc-paneli" : "/randevularim"}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  {isCoach ? "Koç Paneli" : "Randevularım"}
                  {isCoach && unseenCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unseenCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100"
                  >
                    Talepler
                  </Link>
                )}
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Çıkış yap
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/koc-giris"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-purple-50 px-3 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100"
                >
                  Eğitmen Girişi
                </Link>
                <Link
                  href="/giris"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  Öğrenci Girişi
                </Link>
                <Link
                  href="/kayit"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary px-3 py-2.5 text-sm"
                >
                  Ücretsiz kaydol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
