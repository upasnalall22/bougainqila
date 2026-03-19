/**
 * Marketing & Analytics Integration Helper
 * 
 * This module provides utilities for Google Analytics 4, Google Ads,
 * and Meta (Facebook/Instagram) Pixel tracking.
 * 
 * Setup:
 * 1. Replace the placeholder IDs in index.html with your actual IDs:
 *    - GA4 Measurement ID: G-XXXXXXXXXX
 *    - Google Ads ID: AW-XXXXXXXXXX
 *    - Meta Pixel ID: XXXXXXXXXXXXXXXXX
 * 
 * 2. The gtag and fbq scripts are loaded in index.html.
 *    This module provides typed helpers for event tracking.
 */

// Extend window for gtag and fbq
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

// ─── Google Analytics 4 / Google Ads ───

export const trackPageView = (url: string, title?: string) => {
  window.gtag?.("event", "page_view", {
    page_location: url,
    page_title: title,
  });
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  window.gtag?.("event", eventName, params);
};

// E-commerce events (GA4 standard)
export const trackViewItem = (item: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  window.gtag?.("event", "view_item", {
    currency: "INR",
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
      },
    ],
  });
};

export const trackAddToCart = (item: {
  id: string;
  name: string;
  category?: string;
  price?: number;
  quantity?: number;
}) => {
  window.gtag?.("event", "add_to_cart", {
    currency: "INR",
    value: (item.price ?? 0) * (item.quantity ?? 1),
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity ?? 1,
      },
    ],
  });

  // Meta Pixel - AddToCart
  window.fbq?.("track", "AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: (item.price ?? 0) * (item.quantity ?? 1),
    currency: "INR",
  });
};

export const trackBeginCheckout = (value: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) => {
  window.gtag?.("event", "begin_checkout", {
    currency: "INR",
    value,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });

  // Meta Pixel - InitiateCheckout
  window.fbq?.("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    num_items: items.length,
    value,
    currency: "INR",
  });
};

export const trackPurchase = (transaction: {
  id: string;
  value: number;
  shipping?: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) => {
  window.gtag?.("event", "purchase", {
    transaction_id: transaction.id,
    value: transaction.value,
    currency: "INR",
    shipping: transaction.shipping ?? 0,
    items: transaction.items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });

  // Google Ads conversion (requires conversion label)
  window.gtag?.("event", "conversion", {
    send_to: "AW-XXXXXXXXXX/CONVERSION_LABEL",
    value: transaction.value,
    currency: "INR",
    transaction_id: transaction.id,
  });

  // Meta Pixel - Purchase
  window.fbq?.("track", "Purchase", {
    content_ids: transaction.items.map((i) => i.id),
    content_type: "product",
    value: transaction.value,
    currency: "INR",
    num_items: transaction.items.length,
  });
};

// ─── Meta Pixel Helpers ───

export const trackMetaViewContent = (item: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  window.fbq?.("track", "ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_category: item.category,
    content_type: "product",
    value: item.price,
    currency: "INR",
  });
};

export const trackMetaLead = (email?: string) => {
  window.fbq?.("track", "Lead", {
    content_name: "Newsletter Signup",
    ...(email ? { email } : {}),
  });
};

export const trackMetaContact = () => {
  window.fbq?.("track", "Contact");
};
