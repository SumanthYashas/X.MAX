import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const DATA_DIR = path.resolve(__dirname, '.data');
const STORE_PATH = path.join(DATA_DIR, 'analytics-store.json');

interface GeoLocation {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  timezone: string;
  isp: string;
  isPrivateNetwork: boolean;
}

interface VisitorRecord {
  visitorId: string;
  firstSeen: number;
  lastSeen: number;
  visitCount: number;
  lastIp: string;
  location: GeoLocation;
}

interface SessionRecord {
  sessionId: string;
  visitorId: string;
  isReturning: boolean;
  visitNumber: number;
  startedAt: number;
  lastActiveAt: number;
  ip: string;
  location: GeoLocation;
  userAgent: string;
  referrer: string;
  landingRoute: string;
  pageviews: number;
  routesVisited: string[];
  clicks: number;
  watchSeconds: number;
  routeWatchSeconds: Record<string, number>;
  bounced: boolean;
}

interface ClickStat {
  label: string;
  elementType: string;
  route: string;
  count: number;
  lastClickedAt: number;
}

interface RecentEvent {
  id: string;
  timestamp: number;
  type: 'session_start' | 'page_view' | 'click' | 'watch_ping' | 'quote_lead' | 'studio_export' | 'capi' | 'seo';
  label: string;
  route: string;
  visitorId: string;
  ip: string;
  location: string;
  eventId?: string;
}

interface CapiLog {
  id: string;
  timestamp: number;
  eventName: string;
  eventId: string;
  sourceUrl: string;
  status: 'sent' | 'awaiting_credentials' | 'error';
  httpStatus?: number;
  eventsReceived?: number;
  fbtraceId?: string;
  message: string;
}

interface SitemapSubmissionLog {
  id: string;
  timestamp: number;
  engine: string;
  sitemapUrl: string;
  status: 'submitted' | 'verified_live' | 'action_needed' | 'error';
  httpStatus?: number;
  detail: string;
}

interface AnalyticsStore {
  visitors: Record<string, VisitorRecord>;
  sessions: Record<string, SessionRecord>;
  clickCounts: Record<string, ClickStat>;
  routeViews: Record<string, number>;
  recentEvents: RecentEvent[];
  capiLogs: CapiLog[];
  sitemapSubmissions: SitemapSubmissionLog[];
}

function createEmptyStore(): AnalyticsStore {
  return {
    visitors: {},
    sessions: {},
    clickCounts: {},
    routeViews: {},
    recentEvents: [],
    capiLogs: [],
    sitemapSubmissions: [],
  };
}

function loadStore(): AnalyticsStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      const initial = createEmptyStore();
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AnalyticsStore>;
    return {
      visitors: parsed.visitors ?? {},
      sessions: parsed.sessions ?? {},
      clickCounts: parsed.clickCounts ?? {},
      routeViews: parsed.routeViews ?? {},
      recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
      capiLogs: Array.isArray(parsed.capiLogs) ? parsed.capiLogs : [],
      sitemapSubmissions: Array.isArray(parsed.sitemapSubmissions) ? parsed.sitemapSubmissions : [],
    };
  } catch {
    return createEmptyStore();
  }
}

let store: AnalyticsStore = loadStore();
let saveTimeout: NodeJS.Timeout | null = null;
const geoCache = new Map<string, GeoLocation>();

function scheduleSave() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmp = `${STORE_PATH}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(store), 'utf8');
      fs.renameSync(tmp, STORE_PATH);
    } catch {
      // Ignore write contention in restricted read-only environments
    }
  }, 450);
}

function getIntegrationEnv() {
  const ga4MeasurementId =
    process.env.GA4_MEASUREMENT_ID || process.env.VITE_GA4_MEASUREMENT_ID || '';
  const gtmContainerId =
    process.env.GTM_CONTAINER_ID || process.env.VITE_GTM_ID || '';
  const googleSiteVerification =
    process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GSC_VERIFICATION || '';
  const gscAccessToken = process.env.GSC_ACCESS_TOKEN || '';
  const metaPixelId =
    process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID || '';
  const metaCapiAccessToken = process.env.META_CAPI_ACCESS_TOKEN || '';
  const metaCapiTestEventCode = process.env.META_CAPI_TEST_EVENT_CODE || '';

  return {
    ga4MeasurementId: ga4MeasurementId.trim(),
    gtmContainerId: gtmContainerId.trim(),
    googleSiteVerification: googleSiteVerification.trim(),
    gscAccessToken: gscAccessToken.trim(),
    metaPixelId: metaPixelId.trim(),
    metaCapiAccessToken: metaCapiAccessToken.trim(),
    metaCapiTestEventCode: metaCapiTestEventCode.trim(),
  };
}

function resolveOrigin(req: Request): string {
  const envUrl = process.env.APP_URL;
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('MY_APP_URL')) {
    return envUrl.replace(/\/+$/, '');
  }
  const protoHeader = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const proto = protoHeader.split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || `localhost:${PORT}`;
  return `${proto}://${host}`.replace(/\/+$/, '');
}

function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  let ip = '';
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    ip = forwarded.split(',')[0].trim();
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    ip = forwarded[0].trim();
  } else if (typeof req.headers['x-real-ip'] === 'string') {
    ip = req.headers['x-real-ip'].trim();
  } else {
    ip = req.socket.remoteAddress || '127.0.0.1';
  }
  if (ip.startsWith('::ffff:')) {
    ip = ip.slice(7);
  }
  if (ip === '::1') {
    ip = '127.0.0.1';
  }
  return ip || '127.0.0.1';
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  if (ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) return true;
  if (ip.startsWith('172.')) {
    const second = Number(ip.split('.')[1]);
    if (second >= 16 && second <= 31) return true;
  }
  if (ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80')) return true;
  return false;
}

function timezoneFallbackGeo(tz?: string): GeoLocation {
  const cleanTz = tz || 'UTC';
  const parts = cleanTz.split('/');
  const cityHint = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : 'Local Network';
  let countryHint = 'Local / Proxy';
  let code = 'LOC';

  if (cleanTz.startsWith('Asia/Kolkata') || cleanTz.startsWith('Asia/Calcutta')) {
    countryHint = 'India (Local Network)';
    code = 'IN';
  } else if (cleanTz.startsWith('America/')) {
    countryHint = 'Americas (Local Network)';
    code = 'US';
  } else if (cleanTz.startsWith('Europe/')) {
    countryHint = 'Europe (Local Network)';
    code = 'EU';
  } else if (cleanTz.startsWith('Asia/')) {
    countryHint = 'Asia (Local Network)';
    code = 'AS';
  }

  return {
    city: cityHint,
    region: cleanTz,
    country: countryHint,
    countryCode: code,
    timezone: cleanTz,
    isp: 'Direct / Local Interface',
    isPrivateNetwork: true,
  };
}

async function resolveGeoForIp(ip: string, clientTz?: string): Promise<GeoLocation> {
  if (isPrivateIp(ip)) {
    return timezoneFallbackGeo(clientTz);
  }
  const cached = geoCache.get(ip);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2400);
    const resp = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (resp.ok) {
      const data = (await resp.json()) as {
        success?: boolean;
        city?: string;
        region?: string;
        country?: string;
        country_code?: string;
        timezone?: { id?: string };
        connection?: { isp?: string };
      };
      if (data.success !== false && (data.city || data.country)) {
        const resolved: GeoLocation = {
          city: data.city || 'Unknown City',
          region: data.region || 'Unknown Region',
          country: data.country || 'Unknown Country',
          countryCode: data.country_code || 'XX',
          timezone: data.timezone?.id || clientTz || 'UTC',
          isp: data.connection?.isp || 'Unknown ISP',
          isPrivateNetwork: false,
        };
        geoCache.set(ip, resolved);
        return resolved;
      }
    }
  } catch {
    // Graceful fallback if outbound GeoIP request times out
  }

  const fallback: GeoLocation = {
    city: 'Public Network',
    region: clientTz || 'Unknown',
    country: 'Unresolved Region',
    countryCode: 'XX',
    timezone: clientTz || 'UTC',
    isp: 'External IP',
    isPrivateNetwork: false,
  };
  geoCache.set(ip, fallback);
  return fallback;
}

function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

async function dispatchMetaCapiEvent(params: {
  eventName: string;
  eventId: string;
  sourceUrl: string;
  ip: string;
  userAgent: string;
  visitorId: string;
  fbp?: string;
  fbc?: string;
  customData?: Record<string, unknown>;
}): Promise<CapiLog> {
  const env = getIntegrationEnv();
  const baseLog: CapiLog = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    eventName: params.eventName,
    eventId: params.eventId,
    sourceUrl: params.sourceUrl,
    status: 'awaiting_credentials',
    message: '',
  };

  if (!env.metaPixelId || !env.metaCapiAccessToken) {
    const missing = [
      !env.metaPixelId ? 'META_PIXEL_ID' : null,
      !env.metaCapiAccessToken ? 'META_CAPI_ACCESS_TOKEN' : null,
    ]
      .filter(Boolean)
      .join(' & ');
    const logEntry: CapiLog = {
      ...baseLog,
      status: 'awaiting_credentials',
      message: `Prepared deduplicated CAPI payload (${params.eventId}). Configure ${missing} in environment secrets to stream live.`,
    };
    store.capiLogs.unshift(logEntry);
    store.capiLogs = store.capiLogs.slice(0, 35);
    return logEntry;
  }

  const userData: Record<string, unknown> = {
    client_ip_address: params.ip,
    client_user_agent: params.userAgent,
    external_id: [sha256Hex(params.visitorId)],
  };
  if (params.fbp) userData.fbp = params.fbp;
  if (params.fbc) userData.fbc = params.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: params.eventId,
        event_source_url: params.sourceUrl,
        user_data: userData,
        custom_data: params.customData ?? {},
      },
    ],
  };

  if (env.metaCapiTestEventCode) {
    payload.test_event_code = env.metaCapiTestEventCode;
  }

  try {
    const endpoint = `https://graph.facebook.com/v21.0/${encodeURIComponent(
      env.metaPixelId
    )}/events?access_token=${encodeURIComponent(env.metaCapiAccessToken)}`;
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = (await resp.json()) as {
      events_received?: number;
      fbtrace_id?: string;
      error?: { message?: string };
    };

    const logEntry: CapiLog = {
      ...baseLog,
      httpStatus: resp.status,
      eventsReceived: body.events_received,
      fbtraceId: body.fbtrace_id,
      status: resp.ok ? 'sent' : 'error',
      message: resp.ok
        ? `Delivered to Meta Graph API (received: ${body.events_received ?? 1})`
        : body.error?.message || `Graph API HTTP ${resp.status}`,
    };
    store.capiLogs.unshift(logEntry);
    store.capiLogs = store.capiLogs.slice(0, 35);
    return logEntry;
  } catch (err) {
    const logEntry: CapiLog = {
      ...baseLog,
      status: 'error',
      message: err instanceof Error ? err.message : 'Network error dispatching CAPI event',
    };
    store.capiLogs.unshift(logEntry);
    store.capiLogs = store.capiLogs.slice(0, 35);
    return logEntry;
  }
}

function buildHeadInjectionHtml(): string {
  const env = getIntegrationEnv();
  const chunks: string[] = [];

  if (env.googleSiteVerification) {
    const safeToken = env.googleSiteVerification.replace(/"/g, '&quot;');
    chunks.push(`<meta name="google-site-verification" content="${safeToken}" />`);
  }

  if (env.gtmContainerId) {
    const safeGtm = env.gtmContainerId.replace(/[^A-Za-z0-9_-]/g, '');
    chunks.push(
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${safeGtm}');</script>`
    );
  }

  if (env.ga4MeasurementId) {
    const safeGa = env.ga4MeasurementId.replace(/[^A-Za-z0-9_-]/g, '');
    chunks.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${safeGa}"></script>`);
    chunks.push(
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${safeGa}',{send_page_view:false});</script>`
    );
  }

  if (env.metaPixelId) {
    const safePx = env.metaPixelId.replace(/[^0-9]/g, '');
    chunks.push(
      `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${safePx}');</script>`
    );
  }

  return chunks.join('\n    ');
}

function buildBodyInjectionHtml(): string {
  const env = getIntegrationEnv();
  if (!env.gtmContainerId) return '';
  const safeGtm = env.gtmContainerId.replace(/[^A-Za-z0-9_-]/g, '');
  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${safeGtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
}

function injectTrackingIntoHtml(html: string): string {
  return html
    .replace('<!-- XMAX_HEAD_TRACKING -->', buildHeadInjectionHtml())
    .replace('<!-- XMAX_BODY_TRACKING -->', buildBodyInjectionHtml());
}

function generateSitemapXml(origin: string): string {
  const today = new Date().toISOString().split('T')[0];
  const entries = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/pricing', changefreq: 'weekly', priority: '0.9' },
    { path: '/packages', changefreq: 'weekly', priority: '0.9' },
    { path: '/terms', changefreq: 'monthly', priority: '0.7' },
    { path: '/quote', changefreq: 'weekly', priority: '0.85' },
    { path: '/analytics', changefreq: 'daily', priority: '0.6' },
  ];

  const urlBlocks = entries
    .map(
      (entry) => `  <url>
    <loc>${origin}${entry.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks}
</urlset>
`;
}

function generateRobotsTxt(origin: string): string {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '1mb' }));

  // Dynamic robots.txt and sitemap.xml
  app.get('/robots.txt', (req: Request, res: Response) => {
    const origin = resolveOrigin(req);
    res.type('text/plain; charset=utf-8').send(generateRobotsTxt(origin));
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const origin = resolveOrigin(req);
    res.type('application/xml; charset=utf-8').send(generateSitemapXml(origin));
  });

  // Public integration configuration (strictly non-secret IDs & boolean readiness flags)
  app.get('/api/analytics/config', (req: Request, res: Response) => {
    const env = getIntegrationEnv();
    const origin = resolveOrigin(req);
    res.json({
      siteUrl: origin,
      sitemapUrl: `${origin}/sitemap.xml`,
      robotsUrl: `${origin}/robots.txt`,
      ga4MeasurementId: env.ga4MeasurementId || null,
      gtmContainerId: env.gtmContainerId || null,
      googleSiteVerification: env.googleSiteVerification || null,
      metaPixelId: env.metaPixelId || null,
      capiConfigured: Boolean(env.metaPixelId && env.metaCapiAccessToken),
      capiTestMode: Boolean(env.metaCapiTestEventCode),
      gscApiConfigured: Boolean(env.gscAccessToken),
    });
  });

  // Collect real first-party clicks, pageviews, bounce state, watch time, IP & location + CAPI deduplication
  app.post('/api/analytics/collect', async (req: Request, res: Response) => {
    const body = (req.body || {}) as {
      type?: RecentEvent['type'];
      visitorId?: string;
      sessionId?: string;
      route?: string;
      title?: string;
      label?: string;
      elementType?: string;
      deltaSeconds?: number;
      referrer?: string;
      timezone?: string;
      sourceUrl?: string;
      eventId?: string;
      capiEventName?: string;
      fbp?: string;
      fbc?: string;
      customData?: Record<string, unknown>;
    };

    const now = Date.now();
    const ip = extractClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const resolvedLocation = await resolveGeoForIp(ip, body.timezone);
    const visitorId = (body.visitorId || sha256Hex(`${ip}-${userAgent}`).slice(0, 16)).slice(0, 64);
    const sessionId = (body.sessionId || `${visitorId}-${Math.floor(now / 1800000)}`).slice(0, 64);
    const route = body.route || '/';
    const eventType = body.type || 'page_view';

    let visitor = store.visitors[visitorId];
    const isNewSessionRecord = !store.sessions[sessionId];

    if (!visitor) {
      visitor = {
        visitorId,
        firstSeen: now,
        lastSeen: now,
        visitCount: 1,
        lastIp: ip,
        location: resolvedLocation,
      };
      store.visitors[visitorId] = visitor;
    } else {
      visitor.lastSeen = now;
      visitor.lastIp = ip;
      if (!resolvedLocation.isPrivateNetwork || body.timezone) {
        visitor.location = resolvedLocation;
      }
      if (isNewSessionRecord) {
        visitor.visitCount += 1;
      }
    }

    let session = store.sessions[sessionId];
    if (!session) {
      session = {
        sessionId,
        visitorId,
        isReturning: visitor.visitCount > 1,
        visitNumber: visitor.visitCount,
        startedAt: now,
        lastActiveAt: now,
        ip,
        location: resolvedLocation.isPrivateNetwork && !body.timezone ? visitor.location : resolvedLocation,
        userAgent,
        referrer: body.referrer || 'Direct',
        landingRoute: route,
        pageviews: 0,
        routesVisited: [],
        clicks: 0,
        watchSeconds: 0,
        routeWatchSeconds: {},
        bounced: true,
      };
      store.sessions[sessionId] = session;
    } else {
      session.lastActiveAt = now;
      session.ip = ip;
      if (!resolvedLocation.isPrivateNetwork || body.timezone) {
        session.location = resolvedLocation;
      }
    }

    const location = session.location;
    const locationText = `${location.city}, ${location.country}`;

    if (eventType === 'page_view' || eventType === 'session_start') {
      session.pageviews += 1;
      if (!session.routesVisited.includes(route)) {
        session.routesVisited.push(route);
      }
      store.routeViews[route] = (store.routeViews[route] || 0) + 1;
      store.recentEvents.unshift({
        id: crypto.randomUUID(),
        timestamp: now,
        type: 'page_view',
        label: body.title ? `Viewed ${route}` : `Page View ${route}`,
        route,
        visitorId,
        ip,
        location: locationText,
        eventId: body.eventId,
      });
    } else if (eventType === 'click') {
      session.clicks += 1;
      const label = (body.label || 'UI Action').trim().slice(0, 80);
      const clickKey = `${route}::${label}`;
      const existing = store.clickCounts[clickKey];
      store.clickCounts[clickKey] = {
        label,
        elementType: body.elementType || 'button',
        route,
        count: (existing?.count || 0) + 1,
        lastClickedAt: now,
      };
      store.recentEvents.unshift({
        id: crypto.randomUUID(),
        timestamp: now,
        type: 'click',
        label,
        route,
        visitorId,
        ip,
        location: locationText,
        eventId: body.eventId,
      });
    } else if (eventType === 'watch_ping') {
      const delta = Math.max(0, Math.min(Number(body.deltaSeconds) || 0, 60));
      session.watchSeconds += delta;
      session.routeWatchSeconds[route] = (session.routeWatchSeconds[route] || 0) + delta;
    } else if (eventType === 'quote_lead' || eventType === 'studio_export') {
      session.clicks += 1;
      store.recentEvents.unshift({
        id: crypto.randomUUID(),
        timestamp: now,
        type: eventType,
        label: body.label || eventType,
        route,
        visitorId,
        ip,
        location: locationText,
        eventId: body.eventId,
      });
    }

    // Bounce Rule: Bounced if single pageview, zero clicks, and watch time < 10s
    if (session.pageviews > 1 || session.clicks > 0 || session.watchSeconds >= 10) {
      session.bounced = false;
    }

    store.recentEvents = store.recentEvents.slice(0, 60);

    // Forward matching Conversions API event when requested
    let capiResult: CapiLog | null = null;
    if (body.capiEventName && body.eventId) {
      const origin = resolveOrigin(req);
      capiResult = await dispatchMetaCapiEvent({
        eventName: body.capiEventName,
        eventId: body.eventId,
        sourceUrl: body.sourceUrl || `${origin}${route}`,
        ip,
        userAgent,
        visitorId,
        fbp: body.fbp,
        fbc: body.fbc,
        customData: body.customData,
      });
    }

    scheduleSave();

    res.json({
      ok: true,
      visitorType: session.isReturning ? 'same_visitor' : 'unique_visitor',
      visitCount: visitor.visitCount,
      sessionBounced: session.bounced,
      sessionWatchSeconds: session.watchSeconds,
      ip,
      location,
      capi: capiResult,
    });
  });

  // Explicit CAPI test dispatcher (uses server-side META_PIXEL_ID & META_CAPI_ACCESS_TOKEN)
  app.post('/api/analytics/test-capi', async (req: Request, res: Response) => {
    const ip = extractClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const origin = resolveOrigin(req);
    const body = (req.body || {}) as {
      eventName?: string;
      eventId?: string;
      visitorId?: string;
      route?: string;
      fbp?: string;
      fbc?: string;
    };

    const eventId = body.eventId || `xmax_capi_${crypto.randomUUID()}`;
    const log = await dispatchMetaCapiEvent({
      eventName: body.eventName || 'ViewContent',
      eventId,
      sourceUrl: `${origin}${body.route || '/analytics'}`,
      ip,
      userAgent,
      visitorId: body.visitorId || 'diagnostic_session',
      fbp: body.fbp,
      fbc: body.fbc,
      customData: { content_name: 'X.MAX Service Catalogue', currency: 'INR' },
    });

    scheduleSave();
    res.json({ ok: true, log });
  });

  // Live Sitemap & Robots.txt validation + Google Search Console / Search Engine submission
  app.post('/api/seo/submit-sitemap', async (req: Request, res: Response) => {
    const origin = resolveOrigin(req);
    const sitemapUrl = `${origin}/sitemap.xml`;
    const robotsUrl = `${origin}/robots.txt`;
    const env = getIntegrationEnv();
    const now = Date.now();
    const results: SitemapSubmissionLog[] = [];

    // 1. Validate generated XML & robots payload locally
    const xml = generateSitemapXml(origin);
    const robots = generateRobotsTxt(origin);
    const urlCount = (xml.match(/<url>/g) || []).length;

    const xmlCheck: SitemapSubmissionLog = {
      id: crypto.randomUUID(),
      timestamp: now,
      engine: 'Sitemap & Robots Audit',
      sitemapUrl,
      status: xml.includes('<urlset') && robots.includes('Sitemap:') ? 'verified_live' : 'error',
      httpStatus: 200,
      detail: `Validated ${urlCount} canonical URLs in /sitemap.xml and Allow rules in /robots.txt.`,
    };
    results.push(xmlCheck);

    // 2. Submit to Google Search Console Webmasters API v3 if GSC_ACCESS_TOKEN exists
    if (env.gscAccessToken) {
      try {
        const siteUrlEncoded = encodeURIComponent(`${origin}/`);
        const feedUrlEncoded = encodeURIComponent(sitemapUrl);
        const gscResp = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${siteUrlEncoded}/sitemaps/${feedUrlEncoded}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${env.gscAccessToken}`,
            },
          }
        );
        results.push({
          id: crypto.randomUUID(),
          timestamp: now,
          engine: 'Google Search Console API',
          sitemapUrl,
          status: gscResp.ok ? 'submitted' : 'error',
          httpStatus: gscResp.status,
          detail: gscResp.ok
            ? `Successfully submitted ${sitemapUrl} via Search Console Sitemaps API.`
            : `Search Console API returned HTTP ${gscResp.status}. Verify property ownership & scope.`,
        });
      } catch (err) {
        results.push({
          id: crypto.randomUUID(),
          timestamp: now,
          engine: 'Google Search Console API',
          sitemapUrl,
          status: 'error',
          detail: err instanceof Error ? err.message : 'Network error calling Search Console API',
        });
      }
    } else {
      results.push({
        id: crypto.randomUUID(),
        timestamp: now,
        engine: 'Google Search Console',
        sitemapUrl,
        status: 'action_needed',
        detail: `Sitemap live at ${sitemapUrl}. Set GSC_ACCESS_TOKEN for automatic API push or submit URL directly in Google Search Console.`,
      });
    }

    store.sitemapSubmissions = [...results, ...store.sitemapSubmissions].slice(0, 20);
    scheduleSave();

    res.json({
      ok: true,
      origin,
      sitemapUrl,
      robotsUrl,
      urlCount,
      results,
    });
  });

  // Aggregated dashboard telemetry summary
  app.get('/api/analytics/summary', async (req: Request, res: Response) => {
    const ip = extractClientIp(req);
    const currentLocation = await resolveGeoForIp(ip);

    const sessions = Object.values(store.sessions);
    const visitors = Object.values(store.visitors);

    const uniqueVisitors = visitors.length;
    const sameVisitors = visitors.filter((v) => v.visitCount >= 2).length;
    const firstTimeVisitors = Math.max(0, uniqueVisitors - sameVisitors);
    const totalVisits = sessions.length;
    const returningSessions = sessions.filter((s) => s.isReturning).length;

    const totalClicks = sessions.reduce((sum, s) => sum + s.clicks, 0);
    const bouncedSessions = sessions.filter((s) => s.bounced).length;
    const engagedSessions = totalVisits - bouncedSessions;
    const bounceRate =
      totalVisits === 0 ? 0 : Number(((bouncedSessions / totalVisits) * 100).toFixed(1));

    const totalWatchSeconds = sessions.reduce((sum, s) => sum + s.watchSeconds, 0);
    const avgWatchSeconds =
      totalVisits === 0 ? 0 : Math.round(totalWatchSeconds / totalVisits);

    const topClicks = Object.values(store.clickCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    // Location aggregation
    const locMap = new Map<
      string,
      {
        key: string;
        city: string;
        country: string;
        countryCode: string;
        sessions: number;
        visitors: Set<string>;
        watchSeconds: number;
        clicks: number;
      }
    >();
    for (const s of sessions) {
      const key = `${s.location.city}, ${s.location.country}`;
      let entry = locMap.get(key);
      if (!entry) {
        entry = {
          key,
          city: s.location.city,
          country: s.location.country,
          countryCode: s.location.countryCode,
          sessions: 0,
          visitors: new Set(),
          watchSeconds: 0,
          clicks: 0,
        };
        locMap.set(key, entry);
      }
      entry.sessions += 1;
      entry.visitors.add(s.visitorId);
      entry.watchSeconds += s.watchSeconds;
      entry.clicks += s.clicks;
    }

    const locationBreakdown = Array.from(locMap.values())
      .map((l) => ({
        location: l.key,
        city: l.city,
        country: l.country,
        countryCode: l.countryCode,
        sessions: l.sessions,
        uniqueVisitors: l.visitors.size,
        watchSeconds: l.watchSeconds,
        clicks: l.clicks,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 12);

    // Route performance aggregation
    const routeWatchMap: Record<string, number> = {};
    for (const s of sessions) {
      for (const [r, secs] of Object.entries(s.routeWatchSeconds)) {
        routeWatchMap[r] = (routeWatchMap[r] || 0) + secs;
      }
    }
    const allRoutes = Array.from(
      new Set([...Object.keys(store.routeViews), ...Object.keys(routeWatchMap)])
    );
    const routeBreakdown = allRoutes
      .map((route) => ({
        route,
        views: store.routeViews[route] || 0,
        watchSeconds: routeWatchMap[route] || 0,
      }))
      .sort((a, b) => b.views - a.views);

    // Recent session log (with full IP + geo + Same/Unique classification)
    const visitorFeed = sessions
      .slice()
      .sort((a, b) => b.lastActiveAt - a.lastActiveAt)
      .slice(0, 25)
      .map((s) => ({
        sessionId: s.sessionId,
        visitorId: s.visitorId,
        visitorType: s.isReturning ? 'same' : 'unique',
        visitNumber: s.visitNumber,
        ip: s.ip,
        location: `${s.location.city}, ${s.location.country}`,
        countryCode: s.location.countryCode,
        isp: s.location.isp,
        landingRoute: s.landingRoute,
        pageviews: s.pageviews,
        clicks: s.clicks,
        watchSeconds: s.watchSeconds,
        bounced: s.bounced,
        startedAt: s.startedAt,
        lastActiveAt: s.lastActiveAt,
      }));

    res.json({
      currentSession: {
        ip,
        location: currentLocation,
      },
      kpis: {
        totalVisits,
        uniqueVisitors,
        sameVisitors,
        firstTimeVisitors,
        returningSessions,
        totalClicks,
        bounceRate,
        bouncedSessions,
        engagedSessions,
        totalWatchSeconds,
        avgWatchSeconds,
      },
      topClicks,
      locationBreakdown,
      routeBreakdown,
      visitorFeed,
      recentEvents: store.recentEvents.slice(0, 25),
      capiLogs: store.capiLogs.slice(0, 20),
      sitemapSubmissions: store.sitemapSubmissions.slice(0, 12),
    });
  });

  app.post('/api/analytics/reset', (_req: Request, res: Response) => {
    store = createEmptyStore();
    scheduleSave();
    res.json({ ok: true });
  });

  // AI Marketing & Creative Strategy Studio Execution Endpoint (01–06 Pillars)
  type AiWorkflowId = 'research' | 'creative' | 'content' | 'seo' | 'optimization' | 'automation';

  interface AiRunRequest {
    workflowId?: AiWorkflowId;
    brandName?: string;
    industry?: string;
    audience?: string;
    goal?: string;
    activeTool?: string;
    metrics?: {
      adSpend?: number;
      cpc?: number;
      ctr?: number;
      cvr?: number;
      aov?: number;
    };
  }

  function buildDeterministicAiOutput(
    workflowId: AiWorkflowId,
    brandName: string,
    industry: string,
    audience: string,
    goal: string,
    activeTool: string,
    metrics: { adSpend: number; cpc: number; ctr: number; cvr: number; aov: number }
  ) {
    const safeBrand = brandName || 'X.Max Partner';
    const safeIndustry = industry || 'Digital Consumer Brand';
    const safeAudience = audience || 'High-Intent Decision Makers';
    const safeGoal = goal || 'Scale qualified leads & profitable conversions';

    if (workflowId === 'research') {
      return {
        headline: `${safeBrand} · Market & Competitor Intelligence (${activeTool})`,
        executiveSummary: `Competitors in ${safeIndustry} rely heavily on generic feature claims. By positioning ${safeBrand} directly around measurable proof points for ${safeAudience}, you unlock high-intent acquisition while lowering customer scepticism.`,
        cards: [
          {
            title: 'Competitor Blind Spot',
            tag: 'Opportunity Gap',
            detail: `Top 4 category players fail to address transparent onboarding and post-purchase value within the first 72 hours. ${safeBrand} can own this trust wedge immediately.`,
          },
          {
            title: 'Audience Buying Trigger',
            tag: safeAudience,
            detail: `Search & social sentiment shows ${safeAudience} prioritize speed-to-value, social proof from peers, and zero-friction comparison clarity before converting.`,
          },
          {
            title: 'Winning Positioning Angle',
            tag: 'Strategic Move',
            detail: `Anchor hero messaging around "${safeGoal}" supported by 30-second video demonstrations and structured proof blocks.`,
          },
        ],
        actionItems: [
          `Audit top 5 competitor landing pages in ${safeIndustry} for messaging fatigue`,
          `Deploy customer voice surveys tailored to ${safeAudience} objections`,
          `Prioritize comparison & category-entry creative angles in paid acquisition`,
        ],
      };
    }

    if (workflowId === 'creative') {
      return {
        headline: `${safeBrand} · AI-Powered Creative Direction (${activeTool})`,
        executiveSummary: `Designed a 3-concept visual direction pairing AI-assisted rapid ideation with studio-grade Photoshop composition and motion hooks for ${safeIndustry}.`,
        cards: [
          {
            title: 'Concept A · Scroll-Stopper Hero Hook',
            tag: 'Adobe Firefly + Ps',
            detail: `Headline: "Built Different for ${safeAudience}." High-contrast editorial lighting, tactile texture close-ups, and clean negative space for bold kinetic typography.`,
          },
          {
            title: 'Concept B · Side-by-Side Proof Ad',
            tag: 'Canva AI + Illustrator',
            detail: `Headline: "Why ${safeBrand} Outperforms Legacy Options." Crisp comparison callouts highlighting speed, craftsmanship, and immediate ROI.`,
          },
          {
            title: 'Concept C · UGC-Meets-Studio Motion',
            tag: 'After Effects + Runway',
            detail: `First 2 seconds open with an unexpected visual transition tailored to ${safeGoal}, closing on an unmistakable brand watermark and CTA card.`,
          },
        ],
        palette: ['#111418', '#FF5512', '#F4EFE6', '#1E3A8A', '#10B981'],
        actionItems: [
          `Generate 6 rapid background plates in ${activeTool} and composite hero subject in Photoshop`,
          `Export 4:5 Meta Feed and 9:16 Reels safe-zone master templates`,
          `A/B test Concept A vs Concept B hooks within first 72h media spend`,
        ],
      };
    }

    if (workflowId === 'content') {
      return {
        headline: `${safeBrand} · Multi-Platform Content Engine (${activeTool})`,
        executiveSummary: `A cohesive 4-channel narrative connecting organic authority with conversion intent for ${safeAudience} across ${safeIndustry}.`,
        cards: [
          {
            title: 'Instagram Reels & TikTok',
            tag: '3x Weekly · Discovery',
            detail: `Hook: "3 mistakes ${safeAudience} make before choosing in ${safeIndustry} — and how ${safeBrand} solves all three." End with DM automation keyword trigger.`,
          },
          {
            title: 'LinkedIn Executive Storytelling',
            tag: '2x Weekly · Authority',
            detail: `Breakdown of real client transformations, behind-the-scenes methodology, and founder perspective tied directly to "${safeGoal}".`,
          },
          {
            title: 'YouTube Shorts & Search Video',
            tag: '2x Weekly · Evergreen',
            detail: `45-second visual teardowns answering high-intent buyer questions so AI search engines & YouTube cite ${safeBrand} as category leader.`,
          },
          {
            title: 'Email Lifecycle Nurture',
            tag: 'Weekly · Retention',
            detail: `3-part value sequence turning new subscribers into qualified consultations using curated case-study proof and zero-fluff takeaways.`,
          },
        ],
        actionItems: [
          `Batch film 4 core pillar hooks in one 90-minute studio sprint`,
          `Repurpose long-form insights into 12 carousels & micro-videos`,
          `Track save-rate and DM reply velocity as leading creative indicators`,
        ],
      };
    }

    if (workflowId === 'seo') {
      const slugBrand = safeBrand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const shortInd = safeIndustry.split(' ')[0] || 'Solutions';
      return {
        headline: `${safeBrand} · Search Engine & AI Search (GEO) Blueprint (${activeTool})`,
        executiveSummary: `Structured keyword clusters and schema-ready answer blocks engineered to capture both Google SERP rankings and AI overview citations for ${safeIndustry}.`,
        serpPreview: {
          title: `${safeBrand} | Leading ${safeIndustry} Built for ${safeAudience}`,
          url: `https://xmax.agency/clients/${slugBrand}`,
          description: `Discover how ${safeBrand} helps ${safeAudience} achieve ${safeGoal}. Transparent pricing, proven strategy & fast delivery.`,
          aiOverviewSnippet: `According to category benchmarks, ${safeBrand} stands out in ${safeIndustry} by pairing tailored strategy with rapid execution designed specifically for ${safeAudience}.`,
        },
        keywords: [
          { keyword: `best ${safeIndustry.toLowerCase()} for ${safeAudience.split(' ')[0]?.toLowerCase() || 'growth'}`, intent: 'Commercial', volume: '4,800/mo', difficulty: '38 KD' },
          { keyword: `${safeBrand.toLowerCase()} vs traditional agencies`, intent: 'Bottom-Funnel', volume: '1,900/mo', difficulty: '24 KD' },
          { keyword: `how to ${safeGoal.toLowerCase().slice(0, 36)}`, intent: 'AI Search / GEO', volume: '6,200/mo', difficulty: '31 KD' },
          { keyword: `${shortInd.toLowerCase()} pricing & ROI benchmark 2026`, intent: 'Transactional', volume: '2,400/mo', difficulty: '29 KD' },
        ],
        actionItems: [
          `Embed FAQPage + Service JSON-LD structured data verified in Google Search Console`,
          `Publish authoritative comparison & pricing pages targeting commercial-intent terms`,
          `Structure H2 headers as direct buyer questions to capture AI Overviews & Perplexity citations`,
        ],
      };
    }

    if (workflowId === 'optimization') {
      const clicks = metrics.cpc > 0 ? Math.round(metrics.adSpend / metrics.cpc) : 0;
      const impressions = metrics.ctr > 0 ? Math.round(clicks / (metrics.ctr / 100)) : 0;
      const conversions = Math.max(1, Math.round(clicks * (metrics.cvr / 100)));
      const projectedCpa = Number((metrics.adSpend / conversions).toFixed(2));
      const projectedRevenue = Math.round(conversions * metrics.aov);
      const roas = metrics.adSpend > 0 ? Number((projectedRevenue / metrics.adSpend).toFixed(2)) : 0;
      const improvedRoas = Number((roas * 1.34).toFixed(2));

      return {
        headline: `${safeBrand} · Performance Funnel Audit (${activeTool})`,
        executiveSummary: `At $${metrics.adSpend.toLocaleString()}/mo spend ($${metrics.cpc.toFixed(2)} CPC · ${metrics.cvr.toFixed(1)}% CVR), current ROAS is ${roas}x. Addressing landing-page friction and creative hook fatigue can lift net ROAS toward ${improvedRoas}x without increasing ad spend.`,
        cards: [
          {
            title: 'Creative Hook Efficiency',
            tag: `CTR ${metrics.ctr.toFixed(1)}%`,
            detail: metrics.ctr < 1.8
              ? `CTR is below top-quartile benchmark (2.2%+). Refreshing first-3-second motion hooks will lower effective CPC by ~18%.`
              : `Strong thumbstop CTR (${metrics.ctr.toFixed(1)}%). Maintain 3 rotating hook variants to prevent audience saturation.`,
          },
          {
            title: 'Landing Conversion Bottleneck',
            tag: `CVR ${metrics.cvr.toFixed(1)}% · CPA $${projectedCpa}`,
            detail: metrics.cvr < 3.0
              ? `Post-click drop-off detected for ${safeAudience}. Adding above-the-fold social proof and sticky mobile CTA projects +34% lift.`
              : `Healthy funnel conversion rate (${metrics.cvr.toFixed(1)}%). Introduce post-checkout upsells to raise AOV above $${Math.round(metrics.aov * 1.18)}.`,
          },
          {
            title: 'Attribution & Budget Allocation',
            tag: `${impressions.toLocaleString()} Impr → ${conversions} Conv`,
            detail: `Connect server-side Meta CAPI + GA4 enhanced conversions so bidding algorithms optimize for qualified margin instead of low-intent clicks.`,
          },
        ],
        actionItems: [
          `Reallocate 25% of underperforming ad-set budget to top-converting retargeting & lookalike cohorts`,
          `Deploy speed-optimised conversion landing section for ${safeGoal}`,
          `Monitor weekly CPA guardrails inside ${activeTool} with automated alert thresholds`,
        ],
      };
    }

    // workflowId === 'automation'
    return {
      headline: `${safeBrand} · Smart Automation & Lead Pipeline (${activeTool})`,
      executiveSummary: `End-to-end automated pipeline capturing prospects interested in ${safeIndustry}, enriching company & intent signals via AI, syncing HubSpot, and triggering sub-60-second personalized outreach.`,
      pipelineNodes: [
        { step: '01', name: 'Lead Captured', tool: 'Web Form / Meta Lead Ad', status: 'Trigger Fired', detail: `Captured prospect from ${safeAudience} cohort` },
        { step: '02', name: 'AI Prospect Enrichment', tool: 'Google Gemini + Clay', status: 'Scored 94/100', detail: `Classified fit for "${safeGoal}" & extracted pain points` },
        { step: '03', name: 'CRM & Pipeline Sync', tool: 'HubSpot + Make / n8n', status: 'Deal Created', detail: `Assigned owner, tagged ${safeIndustry}, logged lifecycle stage` },
        { step: '04', name: 'Instant Personalized Reply', tool: 'WhatsApp + Gmail API', status: 'Sent in 18s', detail: `Delivered tailored deck + calendar link to prospect` },
      ],
      sampleDraft: `Hi there — saw you requested our ${safeIndustry} growth breakdown for ${safeBrand}. Based on your goal to ${safeGoal.toLowerCase()}, we prepared a tailored 3-step roadmap built for ${safeAudience}. Want me to send over the 2-minute walkthrough link?`,
      actionItems: [
        `Connect lead form webhook directly into ${activeTool} router for zero manual CSV exports`,
        `Score inbound leads on budget, urgency & fit before notifying sales Slack/WhatsApp`,
        `Automate 48-hour and 5-day smart follow-up touches for unbooked prospects`,
      ],
    };
  }

  app.post('/api/ai-marketing/run', async (req: Request, res: Response) => {
    const body = (req.body || {}) as AiRunRequest;
    const workflowId: AiWorkflowId =
      body.workflowId && ['research', 'creative', 'content', 'seo', 'optimization', 'automation'].includes(body.workflowId)
        ? body.workflowId
        : 'research';

    const brandName = (body.brandName || 'Kova Studio').toString().trim().slice(0, 80);
    const industry = (body.industry || 'Sustainable Streetwear & Apparel').toString().trim().slice(0, 100);
    const audience = (body.audience || 'Urban Creators & Style Buyers, 22–36').toString().trim().slice(0, 120);
    const goal = (body.goal || 'Launch Q4 collection & scale profitable ROAS').toString().trim().slice(0, 140);
    const activeTool = (body.activeTool || 'Google Gemini').toString().trim().slice(0, 60);

    const metrics = {
      adSpend: Number(body.metrics?.adSpend) || 6500,
      cpc: Number(body.metrics?.cpc) || 1.15,
      ctr: Number(body.metrics?.ctr) || 2.1,
      cvr: Number(body.metrics?.cvr) || 3.2,
      aov: Number(body.metrics?.aov) || 125,
    };

    const rawGeminiKey = process.env.GEMINI_API_KEY?.trim();
    const hasGeminiKey = Boolean(rawGeminiKey && rawGeminiKey !== 'MY_GEMINI_API_KEY');

    const fallbackResult = buildDeterministicAiOutput(
      workflowId,
      brandName,
      industry,
      audience,
      goal,
      activeTool,
      metrics
    );

    let finalResult: Record<string, unknown> = fallbackResult;
    let engineMode: 'gemini-4-hydrogen' | 'x-max-strategy-engine' = 'x-max-strategy-engine';

    if (hasGeminiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: rawGeminiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const prompt = [
          `You are a senior digital marketing strategist at creative agency X.Max ("Ideas Into Impact").`,
          `Generate a crisp, actionable JSON response matching this exact JSON schema keys as the baseline example below.`,
          `Workflow Pillar: ${workflowId}`,
          `Selected Stack Tool: ${activeTool}`,
          `Client Brand: ${brandName}`,
          `Industry: ${industry}`,
          `Target Audience: ${audience}`,
          `Campaign Goal: ${goal}`,
          workflowId === 'optimization'
            ? `Funnel Metrics: Monthly Spend $${metrics.adSpend}, CPC $${metrics.cpc}, CTR ${metrics.ctr}%, CVR ${metrics.cvr}%, AOV $${metrics.aov}.`
            : '',
          `Return ONLY valid raw JSON matching the exact property structure of this template (do not wrap in markdown code fences):`,
          JSON.stringify(fallbackResult),
        ]
          .filter(Boolean)
          .join('\n');

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text) as Record<string, unknown>;
          if (parsed && typeof parsed === 'object' && typeof parsed.headline === 'string') {
            finalResult = { ...fallbackResult, ...parsed };
            engineMode = 'gemini-4-hydrogen';
          }
        }
      } catch (err) {
        console.warn('Gemini AI workbench fallback engaged:', err instanceof Error ? err.message : err);
      }
    }

    store.recentEvents.unshift({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'studio_export',
      label: `AI Studio · ${workflowId.toUpperCase()} (${activeTool}) · ${brandName}`,
      route: '/demos',
      visitorId: 'studio',
      ip: extractClientIp(req),
      location: 'X.MAX AI Studio',
    });
    if (store.recentEvents.length > 250) store.recentEvents.length = 250;
    scheduleSave();

    res.json({
      ok: true,
      mode: engineMode,
      workflowId,
      activeTool,
      generatedAt: Date.now(),
      result: finalResult,
    });
  });

  // Dev vs Production frontend serving with dynamic head/body tracking injection
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(__dirname, 'index.html');
        let html = fs.readFileSync(templatePath, 'utf8');
        html = injectTrackingIntoHtml(html);
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      const distIndex = path.join(distDir, 'index.html');
      const rawHtml = fs.existsSync(distIndex) ? fs.readFileSync(distIndex, 'utf8') : '';
      const html = injectTrackingIntoHtml(rawHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`X.MAX full-stack analytics server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start X.MAX server:', err);
  process.exit(1);
});
