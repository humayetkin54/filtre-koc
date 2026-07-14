import Link from "next/link";
import type { ReactNode } from "react";

// Markdown-lite → JSX: ## başlık, - liste, **kalın**, [metin](/link)
function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Önce linkler, sonra kalın: tek regex ile sırayla tara
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      parts.push(
        <Link key={`${keyPrefix}-${i++}`} href={m[2]} className="font-semibold text-[#0E8FA3] underline decoration-[#0E8FA3]/30 underline-offset-2 hover:decoration-[#0E8FA3]">
          {m[1]}
        </Link>
      );
    } else if (m[3]) {
      parts.push(<strong key={`${keyPrefix}-${i++}`} className="font-semibold text-gray-900">{m[3]}</strong>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function renderContent(content: string): ReactNode[] {
  const blocks = content.split(/\n\n+/);
  const out: ReactNode[] = [];

  blocks.forEach((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("## ")) {
      out.push(
        <h2 key={bi} className="mt-10 mb-3 text-2xl font-bold tracking-tight text-gray-900">
          {inline(trimmed.slice(3), `h${bi}`)}
        </h2>
      );
      return;
    }

    const lines = trimmed.split("\n");
    if (lines.every((l) => l.trim().startsWith("- "))) {
      out.push(
        <ul key={bi} className="my-4 space-y-2">
          {lines.map((l, li) => (
            <li key={li} className="flex items-start gap-2 leading-relaxed text-gray-600">
              <span className="mt-1 font-bold text-[#0E8FA3]">•</span>
              <span>{inline(l.trim().slice(2), `l${bi}-${li}`)}</span>
            </li>
          ))}
        </ul>
      );
      return;
    }

    out.push(
      <p key={bi} className="my-4 leading-relaxed text-gray-600">
        {inline(trimmed, `p${bi}`)}
      </p>
    );
  });

  return out;
}
