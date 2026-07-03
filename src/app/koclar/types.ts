export type CoachType = "YKS" | "LGS" | "KPSS/AGS" | "DGS";
export type Availability = "open" | "low" | "full";
export type FilterType = "all" | CoachType;

export interface Coach {
  id: string;
  name: string;
  university: string;
  department: string;
  avatar_initials: string;
  avatar_color: string;
  avatar_text_color: string;
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
