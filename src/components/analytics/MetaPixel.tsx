"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { CONSENT_EVENT, hasMarketingConsent } from "@/lib/consent";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Meta Pixel — yalnızca çerez rızası verildiyse yüklenir.
 * NEXT_PUBLIC_META_PIXEL_ID tanımlı değilse hiç render edilmez (yerel geliştirmede sessiz).
 */
export function MetaPixel() {
  const [allowed, setAllowed] = useState(false);
  const pathname = usePathname();
  const loadedOnce = useRef(false);

  useEffect(() => {
    const sync = () => setAllowed(hasMarketingConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  // App Router'da sayfa geçişi script'i yeniden çalıştırmaz —
  // gezinmede PageView'ı elle gönderiyoruz. İlk yükleme script'in içinde.
  useEffect(() => {
    if (!allowed) return;
    if (!loadedOnce.current) {
      loadedOnce.current = true;
      return;
    }
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq === "function") fbq("track", "PageView");
  }, [pathname, allowed]);

  if (!PIXEL_ID || !allowed) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('set','autoConfig',false,'${PIXEL_ID}');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
