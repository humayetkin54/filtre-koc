export type CoachType = "YKS" | "LGS" | "KPSS/AGS" | "DGS" | "PDR";
export type Availability = "open" | "low" | "full";
export type FilterType = "all" | CoachType;

// Psikolog / Psikolojik Danışman (PDR) koçlarda YKS derece rozeti gösterilmez —
// onların kimliği YKS sıralaması değil, psikoloji ünvanıdır.
export function isPdrCoach(coach: { types?: CoachType[]; department?: string | null }): boolean {
  if (coach.types?.includes("PDR")) return true;
  const d = (coach.department ?? "").toLocaleLowerCase("tr");
  return /psikolo|rehberl|\bpdr\b/.test(d);
}

export interface Coach {
  id: string;
  name: string;
  university: string;
  department: string;
  avatar_initials: string;
  avatar_color: string;
  avatar_text_color: string;
  avatar_url?: string | null;
  rank_type?: string | null;
  rank_value?: number | null;
  result_doc_path?: string | null;
  doc_verified?: boolean;
  rating: number;
  rating_count: number;
  current_students: number;
  max_students: number;
  net_increase: string;
  availability: Availability;
  types: CoachType[];
  price: number;
  bio?: string;
}
