type AnalyticsPayload = {
  item_id: string;
  item_name: string;
  item_variant: string;
  currency: string;
  value: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function trackEvent(eventName: string, payload: AnalyticsPayload) {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, payload);
}

export function trackViewItem(payload: AnalyticsPayload) {
  trackEvent("view_item", payload);
}

export function trackSelectVariant(payload: AnalyticsPayload) {
  trackEvent("select_variant", payload);
}

export function trackBeginCheckout(payload: AnalyticsPayload) {
  trackEvent("begin_checkout", payload);
}

