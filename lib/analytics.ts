type EventPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

export async function trackServerEvent(name: string, payload: EventPayload = {}) {
  console.info("analytics", { name, ...payload });
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
