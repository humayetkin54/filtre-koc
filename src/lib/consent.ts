// Çerez rızası — pazarlama/izleme çerezleri yalnızca "accepted" durumunda çalışır.
// KVKK: zorunlu olmayan çerezler açık rıza gerektirir.

export const CONSENT_KEY = "rz_cookie_consent";
export const CONSENT_EVENT = "rz-consent-change";

export type ConsentValue = "accepted" | "rejected";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function hasMarketingConsent(): boolean {
  return readConsent() === "accepted";
}

export function setConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage kapalıysa sessizce geç — rıza verilmemiş sayılır
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Kaydı siler; çerez bandı yeniden görünür ve kullanıcı seçimini değiştirebilir. */
export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // yoksay
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

type Fbq = ((...args: unknown[]) => void) | undefined;

/**
 * Meta Pixel olayı gönderir. Rıza yoksa veya pixel yüklenmemişse hiçbir şey yapmaz —
 * çağıran tarafın kontrol etmesi gerekmez.
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!hasMarketingConsent()) return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  fbq("track", name, params);
}
