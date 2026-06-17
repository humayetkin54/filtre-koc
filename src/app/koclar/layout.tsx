import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export default function KoclarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${sora.variable} font-sans`}>{children}</div>;
}
