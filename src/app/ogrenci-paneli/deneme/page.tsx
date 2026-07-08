import { createClient, createAdminClient } from "@/lib/supabase/server";
import { DenemeForm } from "./deneme-form";
import { ResultsTabs } from "./results-tabs";

function NetChart({ data }: { data: { date: string; net: number; name: string }[] }) {
  if (data.length < 2) return null;
  const maxNet = Math.max(...data.map(d => d.net), 1);
  const w = 600, h = 200, pad = 40;
  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - (d.net / maxNet) * (h - pad * 2),
    ...d,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minWidth: 300 }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="#f0f0f0" strokeWidth={1} />
        ))}
        {/* Line */}
        <path d={pathD} fill="none" stroke="#0E8FA3" strokeWidth={2.5} strokeLinejoin="round" />
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="#0E8FA3" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={10} fill="#374151">{p.net.toFixed(1)}</text>
            <text x={p.x} y={h - 8} textAnchor="middle" fontSize={9} fill="#9ca3af">{new Date(p.date).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default async function DenemePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: results } = await admin
    .from("deneme_results")
    .select("*")
    .eq("student_id", user!.id)
    .order("exam_date", { ascending: false });

  const chartData = [...(results ?? [])].reverse().map(r => ({
    date: r.exam_date, net: r.net_total ?? 0, name: r.exam_name,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">📝 Deneme Sonuçları</h1>
        <p className="text-sm text-gray-500">Deneme sınavı netlerini girerek gelişimini takip et.</p>
      </div>

      {/* Grafik */}
      {chartData.length >= 2 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Toplam Net Grafiği</h2>
          <NetChart data={chartData} />
        </div>
      )}

      {/* Sonuç ekle */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Yeni Sonuç Ekle</h2>
        <DenemeForm />
      </div>

      {/* Sonuçlar — sınav türü sekmeleriyle */}
      <ResultsTabs results={results ?? []} />
    </div>
  );
}
