"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/app/auth/actions";

const navLinks = [
  { href: "/", label: "Ana Sayfa", icon: "home" },
  { href: "/koclar", label: "Koçlar", icon: "people" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır", icon: "swap-horizontal" },
  { href: "/paketler", label: "Paketler", icon: "layers" },
];

export default function Navbar({
  user,
  isCoach = false,
  unseenCount = 0,
  isAdmin = false,
  hasPurchase = false,
}: {
  user: User | null;
  isCoach?: boolean;
  unseenCount?: number;
  isAdmin?: boolean;
  hasPurchase?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = isCoach
    ? navLinks.filter((l) => l.href === "/")
    : hasPurchase
    ? navLinks.filter((l) => l.href !== "/koclar")
    : navLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/logo-navbar.png" alt="Rekor Zeka" width={1316} height={1183} className="h-12 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-sm font-bold text-[#1e293b] transition-colors hover:text-[#0E8FA3]"
            >
              <ion-icon name={link.icon} aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/destek"
                title="Destek Merkezi"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#0E8FA3] transition-colors hover:bg-[#eef9f9]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                </svg>
                <span className="hidden lg:inline text-xs">Destek</span>
              </Link>
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
              {isCoach && (
                <Link
                  href="/koc-paneli/ogrencilerim"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  Öğrencilerim
                </Link>
              )}
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
                className="flex items-center gap-1.5 rounded-full bg-[#1e293b] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f172a]"
              >
                <ion-icon name="compass-outline" aria-hidden="true" />
                Eğitmen Girişi
                <ion-icon name="hand-right-outline" aria-hidden="true" />
              </Link>
              <Link
                href="/giris"
                className="flex items-center gap-1.5 rounded-full bg-[#0E8FA3] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c7689]"
              >
                <ion-icon name="school-outline" aria-hidden="true" />
                Öğrenci Girişi
                <ion-icon name="book-outline" aria-hidden="true" />
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
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-[#1e293b] transition-colors hover:bg-zinc-50 hover:text-[#0E8FA3]"
              >
                <ion-icon name={link.icon} aria-hidden="true" />
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
                {isCoach && (
                  <Link
                    href="/koc-paneli/ogrencilerim"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Öğrencilerim
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100"
                  >
                    Talepler
                  </Link>
                )}
                <Link
                  href="/destek"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#0E8FA3] hover:bg-[#eef9f9]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                  </svg>
                  Destek Merkezi
                </Link>
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
                  className="flex items-center justify-center gap-1.5 rounded-full bg-[#1e293b] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#0f172a]"
                >
                  <ion-icon name="compass-outline" aria-hidden="true" />
                  Eğitmen Girişi
                  <ion-icon name="hand-right-outline" aria-hidden="true" />
                </Link>
                <Link
                  href="/giris"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-[#0E8FA3] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7689]"
                >
                  <ion-icon name="school-outline" aria-hidden="true" />
                  Öğrenci Girişi
                  <ion-icon name="book-outline" aria-hidden="true" />
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
