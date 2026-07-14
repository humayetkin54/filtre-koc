// Hızlı Okuma erişim kuralları (paket vaadiyle birebir):
//   1 Aylık        → erişim yok
//   3 Aylık        → satın alımdan itibaren 30 gün
//   6 Aylık        → satın alımdan itibaren 60 gün
//   Sınava Kadar   → sınırsız (paket aktif olduğu sürece)
//   Hızlı Okuma kategorisi (Rekor Hız) → 30 gün
//   Eski planlar (Aylık/Yıllık) → sınırsız (mevcut kullanıcılar korunur)

const DAY = 24 * 60 * 60 * 1000;

export type HizliOkumaAccess = {
  allowed: boolean;
  unlimited: boolean;
  daysLeft: number | null; // sınırlı erişimde kalan gün
  reason: "no-package" | "plan-excluded" | "expired" | "ok";
};

type PurchaseLite = { plan: string | null; category: string | null; created_at: string };

function windowDays(p: PurchaseLite): number | "unlimited" | "none" {
  if ((p.category ?? "") === "Hızlı Okuma") return 30;
  switch (p.plan) {
    case "1 Aylık":
      return "none";
    case "3 Aylık":
      return 30;
    case "6 Aylık":
      return 60;
    case "Sınava Kadar":
      return "unlimited";
    case "Aylık":
    case "Yıllık":
      return "unlimited"; // eski planlar — mevcut kullanıcı korunur
    default:
      return "unlimited"; // bilinmeyen plan: kilitleme riskine girme
  }
}

export function hizliOkumaAccess(purchases: PurchaseLite[]): HizliOkumaAccess {
  if (!purchases || purchases.length === 0) {
    return { allowed: false, unlimited: false, daysLeft: null, reason: "no-package" };
  }

  let bestDaysLeft: number | null = null;
  let sawExcluded = false;
  let sawExpired = false;

  for (const p of purchases) {
    const w = windowDays(p);
    if (w === "unlimited") {
      return { allowed: true, unlimited: true, daysLeft: null, reason: "ok" };
    }
    if (w === "none") {
      sawExcluded = true;
      continue;
    }
    const expires = new Date(p.created_at).getTime() + w * DAY;
    const left = Math.ceil((expires - Date.now()) / DAY);
    if (left > 0) {
      bestDaysLeft = Math.max(bestDaysLeft ?? 0, left);
    } else {
      sawExpired = true;
    }
  }

  if (bestDaysLeft !== null) {
    return { allowed: true, unlimited: false, daysLeft: bestDaysLeft, reason: "ok" };
  }
  return {
    allowed: false,
    unlimited: false,
    daysLeft: null,
    reason: sawExpired ? "expired" : sawExcluded ? "plan-excluded" : "no-package",
  };
}
