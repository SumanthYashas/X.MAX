import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCode2,
  Globe2,
  MapPin,
  MousePointerClick,
  RefreshCw,
  Send,
  ShieldCheck,
  TrendingDown,
  UserCheck,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnalyticsIntegrationConfig, getOrCreateVisitorId } from '../lib/analytics';
import { PageRoute } from '../types/routing';

interface AnalyticsDashboardProps {
  onNavigate: (route: PageRoute) => void;
}

interface SummaryResponse {
  currentSession: {
    ip: string;
    location: {
      city: string;
      region: string;
      country: string;
      countryCode: string;
      timezone: string;
      isp: string;
      isPrivateNetwork: boolean;
    };
  };
  kpis: {
    totalVisits: number;
    uniqueVisitors: number;
    sameVisitors: number;
    firstTimeVisitors: number;
    returningSessions: number;
    totalClicks: number;
    bounceRate: number;
    bouncedSessions: number;
    engagedSessions: number;
    totalWatchSeconds: number;
    avgWatchSeconds: number;
  };
  topClicks: Array<{
    label: string;
    elementType: string;
    route: string;
    count: number;
    lastClickedAt: number;
  }>;
  locationBreakdown: Array<{
    location: string;
    city: string;
    country: string;
    countryCode: string;
    sessions: number;
    uniqueVisitors: number;
    watchSeconds: number;
    clicks: number;
  }>;
  routeBreakdown: Array<{
    route: string;
    views: number;
    watchSeconds: number;
  }>;
  visitorFeed: Array<{
    sessionId: string;
    visitorId: string;
    visitorType: 'unique' | 'same';
    visitNumber: number;
    ip: string;
    location: string;
    countryCode: string;
    isp: string;
    landingRoute: string;
    pageviews: number;
    clicks: number;
    watchSeconds: number;
    bounced: boolean;
    startedAt: number;
    lastActiveAt: number;
  }>;
  recentEvents: Array<{
    id: string;
    timestamp: number;
    type: string;
    label: string;
    route: string;
    ip: string;
    location: string;
  }>;
  capiLogs: Array<{
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
  }>;
  sitemapSubmissions: Array<{
    id: string;
    timestamp: number;
    engine: string;
    sitemapUrl: string;
    status: 'submitted' | 'verified_live' | 'action_needed' | 'error';
    httpStatus?: number;
    detail: string;
  }>;
}

function formatDuration(totalSeconds: number): string {
  const secs = Math.max(0, Math.round(totalSeconds));
  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const rem = secs % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${rem}s`;
  }
  if (mins > 0) {
    return `${mins}m ${rem.toString().padStart(2, '0')}s`;
  }
  return `${rem}s`;
}

function formatRelativeTime(ts: number): string {
  const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export function AnalyticsDashboard({ onNavigate }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [config, setConfig] = useState<AnalyticsIntegrationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingSitemap, setSubmittingSitemap] = useState(false);
  const [testingCapi, setTestingCapi] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [sumResp, cfgResp] = await Promise.all([
        fetch('/api/analytics/summary'),
        fetch('/api/analytics/config'),
      ]);
      if (sumResp.ok) {
        const sumData = (await sumResp.json()) as SummaryResponse;
        setSummary(sumData);
      }
      if (cfgResp.ok) {
        const cfgData = (await cfgResp.json()) as AnalyticsIntegrationConfig;
        setConfig(cfgData);
      }
    } catch {
      // Keep previous snapshot cleanly on transient failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardData();
    const timer = window.setInterval(() => {
      void fetchDashboardData();
    }, 6000);
    return () => window.clearInterval(timer);
  }, [fetchDashboardData]);

  const handleSubmitSitemap = async () => {
    setSubmittingSitemap(true);
    setActionFeedback(null);
    try {
      const resp = await fetch('/api/seo/submit-sitemap', { method: 'POST' });
      const data = (await resp.json()) as { ok?: boolean; urlCount?: number; sitemapUrl?: string };
      if (resp.ok && data.ok) {
        setActionFeedback(
          `Audited ${data.urlCount ?? 6} routes at ${data.sitemapUrl ?? '/sitemap.xml'} and logged Search Console submission.`
        );
        await fetchDashboardData();
      }
    } catch {
      setActionFeedback('Could not reach sitemap submission endpoint.');
    } finally {
      setSubmittingSitemap(false);
    }
  };

  const handleTestCapi = async () => {
    setTestingCapi(true);
    setActionFeedback(null);
    const eventId = `capi_test_${Date.now()}`;

    // Fire matching browser Meta Pixel event when active so eventID deduplicates cleanly
    if (typeof window.fbq === 'function') {
      window.fbq(
        'track',
        'ViewContent',
        { content_name: 'X.MAX Analytics CAPI Diagnostic' },
        { eventID: eventId }
      );
    }

    try {
      const resp = await fetch('/api/analytics/test-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'ViewContent',
          eventId,
          visitorId: getOrCreateVisitorId(),
          route: '/analytics',
        }),
      });
      const data = (await resp.json()) as {
        log?: { message: string; status: string };
      };
      if (resp.ok && data.log) {
        setActionFeedback(data.log.message);
        await fetchDashboardData();
      }
    } catch {
      setActionFeedback('Unable to run CAPI dispatch check.');
    } finally {
      setTestingCapi(false);
    }
  };

  const handleResetAnalytics = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setConfirmReset(false);
    await fetch('/api/analytics/reset', { method: 'POST' });
    setActionFeedback('Cleared stored analytics history.');
    await fetchDashboardData();
  };

  const kpis = summary?.kpis;

  return (
    <section
      aria-label="X.MAX Visitor Analytics, SEO & Conversion Hub"
      className="mx-auto max-w-[1360px] px-[16px] sm:px-[24px] md:px-[60px] pt-[100px] sm:pt-[118px] pb-[90px] md:pb-[130px]"
    >
      {/* Top Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#111418]/10">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#111418]/55 hover:text-[#111418] transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back to Home
          </button>
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase text-[#ff5512] mb-1.5">
            First-Party Telemetry · SEO · Meta CAPI · GA4 &amp; GTM
          </p>
          <h1 className="text-[30px] sm:text-[42px] md:text-[48px] font-medium tracking-[-0.025em] leading-[1.06] text-[#111418]">
            Analytics &amp; Attribution Hub.
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => void fetchDashboardData()}
            className="inline-flex items-center gap-2 h-[40px] px-4 rounded-[10px] bg-white border border-[#111418]/12 text-[13px] font-medium text-[#111418] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleResetAnalytics}
            className={`h-[40px] px-4 rounded-[10px] text-[13px] font-medium transition-colors cursor-pointer ${
              confirmReset
                ? 'bg-[#ef4444] text-white'
                : 'bg-[#111418]/5 text-[#111418]/75 hover:bg-[#111418]/10'
            }`}
          >
            {confirmReset ? 'Confirm Reset Data' : 'Reset Metrics'}
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="mt-5 rounded-[14px] bg-[#12151b] text-white px-4 py-3 text-[13px] flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" aria-hidden="true" />
            {actionFeedback}
          </span>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-white/55 hover:text-white text-[12px] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Core Visitor & Engagement KPI Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[20px] bg-white border border-[#111418]/10 p-6"
        >
          <div className="flex items-center justify-between text-[#111418]/55">
            <span className="text-[13px] font-medium">Total Clicks</span>
            <MousePointerClick className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[34px] font-medium tracking-[-0.03em] text-[#111418] tabular-nums">
            {loading ? '—' : (kpis?.totalClicks ?? 0).toLocaleString()}
          </p>
          <p className="mt-1.5 text-[12.5px] text-[#111418]/55 truncate">
            {summary?.topClicks[0]
              ? `Top action: ${summary.topClicks[0].label} (${summary.topClicks[0].count}×)`
              : 'Click any CTA or button to record events'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="rounded-[20px] bg-white border border-[#111418]/10 p-6"
        >
          <div className="flex items-center justify-between text-[#111418]/55">
            <span className="text-[13px] font-medium">Bounce Rate</span>
            <TrendingDown className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[34px] font-medium tracking-[-0.03em] text-[#111418] tabular-nums">
            {loading ? '—' : `${kpis?.bounceRate ?? 0}%`}
          </p>
          <p className="mt-1.5 text-[12.5px] text-[#111418]/55 tabular-nums">
            {kpis?.engagedSessions ?? 0} engaged · {kpis?.bouncedSessions ?? 0} bounced (&lt;10s, 0 clicks)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[20px] bg-white border border-[#111418]/10 p-6"
        >
          <div className="flex items-center justify-between text-[#111418]/55">
            <span className="text-[13px] font-medium">Watch Time (Active Dwell)</span>
            <Clock className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[34px] font-medium tracking-[-0.03em] text-[#111418] tabular-nums">
            {loading ? '—' : formatDuration(kpis?.totalWatchSeconds ?? 0)}
          </p>
          <p className="mt-1.5 text-[12.5px] text-[#111418]/55 tabular-nums">
            Avg per session: {formatDuration(kpis?.avgWatchSeconds ?? 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-[20px] bg-white border border-[#111418]/10 p-6"
        >
          <div className="flex items-center justify-between text-[#111418]/55">
            <span className="text-[13px] font-medium">Unique Visitors</span>
            <Users className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[34px] font-medium tracking-[-0.03em] text-[#111418] tabular-nums">
            {loading ? '—' : (kpis?.uniqueVisitors ?? 0).toLocaleString()}
          </p>
          <p className="mt-1.5 text-[12.5px] text-[#111418]/55 tabular-nums">
            {kpis?.firstTimeVisitors ?? 0} single-visit · {kpis?.totalVisits ?? 0} total sessions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-[20px] bg-white border border-[#111418]/10 p-6"
        >
          <div className="flex items-center justify-between text-[#111418]/55">
            <span className="text-[13px] font-medium">Same (Returning) Visitors</span>
            <UserCheck className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[34px] font-medium tracking-[-0.03em] text-[#111418] tabular-nums">
            {loading ? '—' : (kpis?.sameVisitors ?? 0).toLocaleString()}
          </p>
          <p className="mt-1.5 text-[12.5px] text-[#111418]/55 tabular-nums">
            {kpis?.returningSessions ?? 0} repeat sessions from returning visitors
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] bg-[#12151b] text-white p-6"
        >
          <div className="flex items-center justify-between text-white/60">
            <span className="text-[13px] font-medium">Current IP &amp; Geo Location</span>
            <MapPin className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[22px] sm:text-[24px] font-mono font-medium tracking-[-0.02em] text-white truncate">
            {summary?.currentSession.ip ?? 'Detecting...'}
          </p>
          <p className="mt-1.5 text-[12.5px] text-white/70 truncate">
            {summary?.currentSession.location
              ? `${summary.currentSession.location.city}, ${summary.currentSession.location.country} (${summary.currentSession.location.timezone})`
              : 'Resolving server GeoIP...'}
          </p>
        </motion.div>
      </div>

      {/* Connected Integrations: Search Console, GA4, Tag Manager, Sitemap/Robots & Meta Pixel + CAPI */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SEO: Search Console + Sitemap & Robots.txt Submission */}
        <div className="lg:col-span-6 rounded-[24px] bg-[#12151b] text-white p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-5 h-5 text-[#ff5512]" aria-hidden="true" />
                <h2 className="text-[19px] font-medium">Search Console, Sitemap &amp; Robots.txt</h2>
              </div>
              <span
                className={`px-2.5 py-1 rounded-[6px] font-mono text-[11px] ${
                  config?.googleSiteVerification
                    ? 'bg-[#22c55e]/20 text-[#86efac]'
                    : 'bg-white/10 text-white/75'
                }`}
              >
                {config?.googleSiteVerification ? 'Verified Meta Active' : 'Sitemap Live'}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-[12px] bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-colors"
              >
                <div>
                  <p className="text-[13px] font-medium text-white">/sitemap.xml</p>
                  <p className="text-[11px] font-mono text-white/50">Dynamic XML index</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/55" aria-hidden="true" />
              </a>

              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-[12px] bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-colors"
              >
                <div>
                  <p className="text-[13px] font-medium text-white">/robots.txt</p>
                  <p className="text-[11px] font-mono text-white/50">Crawler directives</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/55" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12px]">
              <div className="rounded-[10px] bg-white/[0.04] border border-white/8 px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-white/60">GA4 Measurement</span>
                <span className="font-mono text-white">
                  {config?.ga4MeasurementId || 'Env GA4_MEASUREMENT_ID'}
                </span>
              </div>
              <div className="rounded-[10px] bg-white/[0.04] border border-white/8 px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-white/60">Tag Manager</span>
                <span className="font-mono text-white">
                  {config?.gtmContainerId || 'Env GTM_CONTAINER_ID'}
                </span>
              </div>
            </div>

            {summary?.sitemapSubmissions && summary.sitemapSubmissions.length > 0 && (
              <div className="mt-4 space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {summary.sitemapSubmissions.slice(0, 4).map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[8px] bg-white/[0.04] px-3 py-2 text-[11.5px] flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono text-[#ff5512]">{entry.engine}</span>
                      <p className="text-white/75 mt-0.5">{entry.detail}</p>
                    </div>
                    <span className="font-mono text-[10px] text-white/45 shrink-0">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] text-white/55">
              {config?.gscApiConfigured
                ? 'Search Console Sitemap API connected'
                : 'Live XML verified · Set GSC_ACCESS_TOKEN for API push'}
            </span>
            <button
              type="button"
              disabled={submittingSitemap}
              onClick={handleSubmitSitemap}
              className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] bg-[#ff5512] hover:bg-[#ff6a30] disabled:opacity-50 text-white text-[13px] font-medium transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              {submittingSitemap ? 'Submitting...' : 'Verify & Submit Sitemap'}
            </button>
          </div>
        </div>

        {/* Meta Pixel & Server-Side Conversions API (CAPI) */}
        <div className="lg:col-span-6 rounded-[24px] bg-[#12151b] text-white p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#ff5512]" aria-hidden="true" />
                <h2 className="text-[19px] font-medium">Meta Pixel &amp; Conversions API (CAPI)</h2>
              </div>
              <span
                className={`px-2.5 py-1 rounded-[6px] font-mono text-[11px] ${
                  config?.capiConfigured
                    ? 'bg-[#22c55e]/20 text-[#86efac]'
                    : 'bg-white/10 text-white/75'
                }`}
              >
                {config?.capiConfigured ? 'CAPI Connected' : 'Server Ready'}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12px]">
              <div className="rounded-[10px] bg-white/[0.04] border border-white/8 px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-white/60">Browser Pixel</span>
                <span className="font-mono text-white">
                  {config?.metaPixelId || 'Env META_PIXEL_ID'}
                </span>
              </div>
              <div className="rounded-[10px] bg-white/[0.04] border border-white/8 px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-white/60">Deduplication</span>
                <span className="font-mono text-[#ff5512]">Shared event_id + IP/UA</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
              {summary?.capiLogs && summary.capiLogs.length > 0 ? (
                summary.capiLogs.slice(0, 6).map((capi) => (
                  <div
                    key={capi.id}
                    className="rounded-[8px] bg-white/[0.04] px-3 py-2 text-[11.5px] flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white">
                          {capi.eventName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            capi.status === 'sent'
                              ? 'bg-[#22c55e]/20 text-[#86efac]'
                              : capi.status === 'error'
                                ? 'bg-[#ef4444]/20 text-[#fca5a5]'
                                : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {capi.status}
                        </span>
                      </div>
                      <p className="text-white/65 mt-0.5 truncate">{capi.message}</p>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 shrink-0">
                      {formatRelativeTime(capi.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[12.5px] text-white/50 py-4">
                  Page views and quote leads automatically queue matching browser Pixel &amp; server
                  CAPI events here.
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] text-white/55">
              Graph API v21.0 · Captures client_ip, user_agent, _fbp &amp; _fbc
            </span>
            <button
              type="button"
              disabled={testingCapi}
              onClick={handleTestCapi}
              className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] bg-white text-[#12151b] hover:bg-white/90 disabled:opacity-50 text-[13px] font-medium transition-colors cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5" aria-hidden="true" />
              {testingCapi ? 'Sending...' : 'Send Deduplicated CAPI Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Location Breakdown, Route Watch Time & Click Leaderboard */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* IP Geo Locations */}
        <div className="lg:col-span-4 rounded-[22px] bg-white border border-[#111418]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-medium text-[#111418]">Visitor Locations</h2>
            <MapPin className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          {summary?.locationBreakdown && summary.locationBreakdown.length > 0 ? (
            <div className="space-y-2.5">
              {summary.locationBreakdown.map((loc) => (
                <div
                  key={loc.location}
                  className="flex items-center justify-between py-2 border-b border-[#111418]/6 last:border-0 text-[13px]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-[#111418] truncate">{loc.location}</p>
                    <p className="text-[11.5px] text-[#111418]/50 font-mono">
                      {loc.uniqueVisitors} unique · {formatDuration(loc.watchSeconds)}
                    </p>
                  </div>
                  <span className="font-mono text-[12px] font-medium text-[#ff5512] shrink-0">
                    {loc.sessions} {loc.sessions === 1 ? 'visit' : 'visits'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#111418]/50">Awaiting location samples.</p>
          )}
        </div>

        {/* Route Views & Watch Time */}
        <div className="lg:col-span-4 rounded-[22px] bg-white border border-[#111418]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-medium text-[#111418]">Page Watch Time</h2>
            <Clock className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          {summary?.routeBreakdown && summary.routeBreakdown.length > 0 ? (
            <div className="space-y-2.5">
              {summary.routeBreakdown.map((r) => (
                <div
                  key={r.route}
                  className="flex items-center justify-between py-2 border-b border-[#111418]/6 last:border-0 text-[13px]"
                >
                  <div>
                    <p className="font-mono font-medium text-[#111418]">{r.route}</p>
                    <p className="text-[11.5px] text-[#111418]/50">
                      {r.views} page {r.views === 1 ? 'view' : 'views'}
                    </p>
                  </div>
                  <span className="font-mono text-[13px] font-medium text-[#111418]">
                    {formatDuration(r.watchSeconds)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#111418]/50">No route watch time yet.</p>
          )}
        </div>

        {/* Top Clicked Actions */}
        <div className="lg:col-span-4 rounded-[22px] bg-white border border-[#111418]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-medium text-[#111418]">Top Clicked Elements</h2>
            <Activity className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
          </div>
          {summary?.topClicks && summary.topClicks.length > 0 ? (
            <div className="space-y-2.5">
              {summary.topClicks.slice(0, 7).map((clk) => (
                <div
                  key={`${clk.route}-${clk.label}`}
                  className="flex items-center justify-between py-2 border-b border-[#111418]/6 last:border-0 text-[13px]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-[#111418] truncate">{clk.label}</p>
                    <p className="text-[11px] font-mono text-[#111418]/50">
                      {clk.elementType} · {clk.route}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-[6px] bg-[#111418]/5 font-mono text-[12px] font-semibold text-[#111418] shrink-0">
                    {clk.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#111418]/50">Click buttons across the site to log.</p>
          )}
        </div>
      </div>

      {/* Live Visitor Session & IP Tracking Table */}
      <div className="mt-6 rounded-[24px] bg-white border border-[#111418]/10 p-6 sm:p-7 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-[19px] font-medium text-[#111418]">
              Visitor IP, Location &amp; Session Log
            </h2>
            <p className="text-[13px] text-[#111418]/55">
              Tracks unique vs returning (same) visitors, IP address geo resolution, clicks, watch
              time, and bounce state.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-[#111418]/10 text-[11.5px] font-mono uppercase text-[#111418]/50">
                <th className="py-2.5 pr-4">Visitor Type</th>
                <th className="py-2.5 pr-4">IP Address</th>
                <th className="py-2.5 pr-4">Location</th>
                <th className="py-2.5 pr-4">Entry Route</th>
                <th className="py-2.5 pr-4">Clicks</th>
                <th className="py-2.5 pr-4">Watch Time</th>
                <th className="py-2.5 pr-4">Bounce State</th>
                <th className="py-2.5 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111418]/6 text-[13px]">
              {summary?.visitorFeed && summary.visitorFeed.length > 0 ? (
                summary.visitorFeed.map((sess) => (
                  <tr key={sess.sessionId} className="hover:bg-slate-50/70">
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11.5px] font-medium ${
                          sess.visitorType === 'same'
                            ? 'bg-[#ff5512]/12 text-[#c93d06]'
                            : 'bg-[#111418]/8 text-[#111418]'
                        }`}
                      >
                        {sess.visitorType === 'same'
                          ? `Same Visitor (#${sess.visitNumber})`
                          : 'Unique Visitor'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[12px] text-[#111418] whitespace-nowrap">
                      {sess.ip}
                    </td>
                    <td className="py-3 pr-4 text-[#111418]/75 whitespace-nowrap">
                      {sess.location}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[12px] text-[#111418]/65">
                      {sess.landingRoute}
                    </td>
                    <td className="py-3 pr-4 font-mono tabular-nums">{sess.clicks}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums">
                      {formatDuration(sess.watchSeconds)}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-mono ${
                          sess.bounced
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {sess.bounced ? 'Bounced' : 'Engaged'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-[11.5px] text-[#111418]/50 whitespace-nowrap">
                      {formatRelativeTime(sess.lastActiveAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#111418]/50">
                    Recording your first live session now...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
