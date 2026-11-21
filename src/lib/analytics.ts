export interface AnalyticsIntegrationConfig {
  siteUrl: string;
  sitemapUrl: string;
  robotsUrl: string;
  ga4MeasurementId: string | null;
  gtmContainerId: string | null;
  googleSiteVerification: string | null;
  metaPixelId: string | null;
  capiConfigured: boolean;
  capiTestMode: boolean;
  gscApiConfigured: boolean;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const VID_KEY = 'xmax_vid_v1';
const SID_KEY = 'xmax_sid_v1';

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getOrCreateVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VID_KEY) || readCookie(VID_KEY);
    if (existing) {
      window.localStorage.setItem(VID_KEY, existing);
      return existing;
    }
    const created = generateId('v');
    window.localStorage.setItem(VID_KEY, created);
    writeCookie(VID_KEY, created, 60 * 60 * 24 * 365 * 2);
    return created;
  } catch {
    return generateId('v');
  }
}

export function getOrCreateSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SID_KEY);
    if (existing) return existing;
    const created = generateId('s');
    window.sessionStorage.setItem(SID_KEY, created);
    return created;
  } catch {
    return generateId('s');
  }
}

function syncMetaCookies() {
  if (typeof window === 'undefined') return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid && !readCookie('_fbc')) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      writeCookie('_fbc', fbc, 60 * 60 * 24 * 90);
    }
    if (!readCookie('_fbp')) {
      const rand = Math.floor(1000000000 + Math.random() * 9000000000);
      writeCookie('_fbp', `fb.1.${Date.now()}.${rand}`, 60 * 60 * 24 * 90);
    }
  } catch {
    // Ignore storage restriction errors
  }
}

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function fireGtagEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

function firePixelEvent(
  eventName: string,
  eventId: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq === 'function') {
    if (params) {
      window.fbq('track', eventName, params, { eventID: eventId });
    } else {
      window.fbq('track', eventName, {}, { eventID: eventId });
    }
  }
}

async function postCollect(payload: Record<string, unknown>, useBeacon = false) {
  const body = JSON.stringify({
    ...payload,
    visitorId: getOrCreateVisitorId(),
    sessionId: getOrCreateSessionId(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sourceUrl: window.location.href,
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
  });

  if (useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics/collect', blob);
    return;
  }

  try {
    await fetch('/api/analytics/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // Silently absorb telemetry network hiccups without breaking UX
  }
}

export function trackPageView(routePath: string, title: string) {
  syncMetaCookies();
  const eventId = generateId('pv');

  fireGtagEvent('page_view', {
    page_path: routePath,
    page_title: title,
    page_location: window.location.href,
  });
  pushDataLayer({
    event: 'xmax_page_view',
    page_path: routePath,
    page_title: title,
    event_id: eventId,
  });
  firePixelEvent('PageView', eventId, { content_name: title, page_path: routePath });

  void postCollect({
    type: 'page_view',
    route: routePath,
    title,
    referrer: document.referrer || 'Direct',
    eventId,
    capiEventName: 'PageView',
    customData: { content_name: title, page_path: routePath },
  });
}

export function trackClick(label: string, elementType: string, routePath: string) {
  const eventId = generateId('clk');
  const cleanLabel = label.trim().slice(0, 80) || elementType;

  fireGtagEvent('ui_click', {
    event_category: elementType,
    event_label: cleanLabel,
    page_path: routePath,
  });
  pushDataLayer({
    event: 'xmax_click',
    click_label: cleanLabel,
    element_type: elementType,
    page_path: routePath,
    event_id: eventId,
  });

  void postCollect({
    type: 'click',
    route: routePath,
    label: cleanLabel,
    elementType,
    eventId,
  });
}

export function sendWatchHeartbeat(routePath: string, deltaSeconds: number, useBeacon = false) {
  if (deltaSeconds <= 0) return;
  fireGtagEvent('user_engagement', {
    engagement_time_msec: Math.round(deltaSeconds * 1000),
    page_path: routePath,
  });
  pushDataLayer({
    event: 'xmax_watch_time',
    watch_seconds: deltaSeconds,
    page_path: routePath,
  });

  void postCollect(
    {
      type: 'watch_ping',
      route: routePath,
      deltaSeconds,
    },
    useBeacon
  );
}

export function trackLeadConversion(
  label: string,
  routePath: string,
  estimatedValueInr?: number
) {
  const eventId = generateId('lead');
  const customData: Record<string, unknown> = {
    content_name: label,
    currency: 'INR',
    ...(estimatedValueInr ? { value: estimatedValueInr } : {}),
  };

  fireGtagEvent('generate_lead', {
    event_label: label,
    currency: 'INR',
    value: estimatedValueInr ?? 0,
  });
  pushDataLayer({
    event: 'xmax_lead',
    lead_label: label,
    value_inr: estimatedValueInr ?? 0,
    event_id: eventId,
  });
  firePixelEvent('Lead', eventId, customData);

  void postCollect({
    type: 'quote_lead',
    route: routePath,
    label,
    eventId,
    capiEventName: 'Lead',
    customData,
  });
}
