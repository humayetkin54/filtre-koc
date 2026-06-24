import Link from "next/link";

const footerLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/koclar", label: "Koçlar" },
  { href: "/paketler", label: "Paketler" },
  { href: "/iletisim", label: "İletişim" },
];

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70">
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0e0e14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold text-[#3a4cff]">Rekor Zeka</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Hedefinize uygun koçu bulun, kişiselleştirilmiş eğitimle
              başarınızı artırın.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Bağlantılar</p>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Sosyal Medya</p>
            <div className="mt-4 flex gap-3">
              <SocialIcon>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0 1.622c-3.157 0-3.528.012-4.764.07-1.058.048-1.633.22-2.015.367-.506.197-.868.433-1.248.813-.38.38-.616.742-.813 1.248-.147.382-.319.957-.367 2.015-.058 1.236-.07 1.607-.07 4.764s.012 3.528.07 4.764c.048 1.058.22 1.633.367 2.015.197.506.433.868.813 1.248.38.38.742.616 1.248.813.382.147.957.319 2.015.367 1.236.058 1.607.07 4.764.07s3.528-.012 4.764-.07c1.058-.048 1.633-.22 2.015-.367.506-.197.868-.433 1.248-.813.38-.38.616-.742.813-1.248.147-.382.319-.957.367-2.015.058-1.236.07-1.607.07-4.764s-.012-3.528-.07-4.764c-.048-1.058-.22-1.633-.367-2.015-.197-.506-.433-.868-.813-1.248-.38-.38-.742-.616-1.248-.813-.382-.147-.957-.319-2.015-.367-1.236-.058-1.607-.07-4.764-.07zM12 7.378a4.622 4.622 0 100 9.244 4.622 4.622 0 000-9.244zm0 7.622a3 3 0 110-6 3 3 0 010 6zm4.804-8.884a1.08 1.08 0 100 2.16 1.08 1.08 0 000-2.16z" />
                </svg>
              </SocialIcon>
              <SocialIcon>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.062 2.062 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © 2026 Rekor Zeka
        </div>
      </div>
    </footer>
  );
}
