import { useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Brush,
  Check,
  Crop,
  Download,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Move,
  Pipette,
  Share2,
  ShoppingBag,
  Sliders,
  Sparkles,
  Type,
  X,
  ZoomIn,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PageRoute } from '../types/routing';
import { AfterEffectsStudio } from './AfterEffectsStudio';
import { ResponsiveWebStudio } from './ResponsiveWebStudio';

import sneakerPhoto from '../assets/images/campaign_sneaker_ad_1794926293703.jpg';

const FASHION_POST = '/assets/aistudio/images_7ecd594a.jpg';
const NAUGHTEE_NIGHTS_POST = '/assets/aistudio/Naughtee_Cafe__Brighter_Nights_79b3bddb.png';
const ASTROX_AGENCY_POST = '/assets/aistudio/ASTRO_X_04eaf7ef.png';
const NAUGHTEE_BURGER_POST = '/assets/aistudio/post_1_74c44a0b.png';

interface WorkflowAppDemosProps {
  onNavigate: (route: PageRoute) => void;
}

type AppId = 'photoshop' | 'aftereffects' | 'meta' | 'website';

interface AppMeta {
  id: AppId;
  name: string;
  tag: string;
  category: string;
  iconBg: string;
  iconFg: string;
  badge: string;
  turnaround: string;
  deliverables: string;
  summary: string;
}

const APPS: Record<AppId, AppMeta> = {
  photoshop: {
    id: 'photoshop',
    name: 'Adobe Photoshop CC',
    tag: 'Performance Ad Creatives & Carousels',
    category: 'Direct-Response Social Ads',
    iconBg: '#001E36',
    iconFg: '#31A8FF',
    badge: 'Ps',
    turnaround: '24–48 Hours',
    deliverables: '4:5 Meta Feed PNG, 1:1 Carousel Cuts, 9:16 Story Ads, Editable Layered PSD',
    summary:
      'High-CTR static ad creatives, direct-response offer hooks, social proof badges, retargeting promo frames, and conversion-tuned visual grading.',
  },
  aftereffects: {
    id: 'aftereffects',
    name: 'Adobe After Effects CC',
    tag: 'Reels & Performance Video Ads',
    category: 'Short-Form Paid Video & Hooks',
    iconBg: '#00005B',
    iconFg: '#9999FF',
    badge: 'Ae',
    turnaround: '3–5 Business Days',
    deliverables: '9:16 Reels Video Ads, 1:1 Feed Cuts, 3D Product Motion, Multi-Track Keyframed Project',
    summary:
      'Mixed-reality VFX reels and 3D e-commerce video ads with real-time playback, timeline scrubbing, Lumetri LUT grading, color saturation, and frame capture.',
  },
  meta: {
    id: 'meta',
    name: 'Meta Ads Manager',
    tag: 'Paid Acquisition Campaigns',
    category: 'Full-Funnel Conversion Ads',
    iconBg: '#0866FF',
    iconFg: '#FFFFFF',
    badge: 'Meta',
    turnaround: 'Setup in 48h · Daily Optimization',
    deliverables: '4:5 Feed & 9:16 Reel Creatives, Instant Experience Checkout, CAPI Pixel Setup',
    summary:
      'Advantage+ shopping campaigns, interactive story/reel ads with live comments & instant checkout sheets, audience size estimators, and ROAS calculators.',
  },
  website: {
    id: 'website',
    name: 'Conversion Funnel Studio',
    tag: '105+ Live CRO Settings · D2C Storefronts, Apparel & Lead Landing Pages',
    category: 'High-Converting Ad Destinations',
    iconBg: '#10B981',
    iconFg: '#FFFFFF',
    badge: 'Code',
    turnaround: '5–10 Business Days',
    deliverables: '105 Live CRO & Design Tokens, D2C Storefront, Campaign Lookbook, Fast Lead-Gen Landing Pages',
    summary:
      'Interactive Conversion Funnel Studio with 105+ live typography, color, layout, offer banner, and checkout controls across Desktop, Tablet, and Mobile ad traffic.',
  },
};

type PsPosterPreset = 'fashion' | 'naughtee-nights' | 'astrox' | 'naughtee-burger';

const PS_POST_ASSETS: Record<
  PsPosterPreset,
  {
    src: string;
    label: string;
    docName: string;
    title: string;
    tagline: string;
    metaLine: string;
    subLine: string;
    ctaLine: string;
    accent: string;
    notice: string;
  }
> = {
  fashion: {
    src: FASHION_POST,
    label: 'Fashion Collection',
    docName: 'Fashion_2026_Collection_4x5.psd',
    title: 'FASHION 2026',
    tagline: 'NEW COLLECTION · BE BOLD. BE STYLISH. BE YOU.',
    metaLine: 'META 4:5 FEED AD · APPAREL CAMPAIGN',
    subLine: 'EDITORIAL LOOKBOOK · HIGH-CTR SOCIAL CREATIVE',
    ctaLine: 'SHOP 2026 COLLECTION →',
    accent: '#ef4444',
    notice: 'Loaded Fashion Collection 2026 Post (1200×1500)',
  },
  'naughtee-nights': {
    src: NAUGHTEE_NIGHTS_POST,
    label: 'Naughtee Cafe Nights',
    docName: 'Naughtee_Cafe_Brighter_Nights.psd',
    title: 'NAUGHTEE CAFE',
    tagline: 'GOOD FOOD MAKES BRIGHTER NIGHTS',
    metaLine: 'BRAND CAMPAIGN AD · NIGHTLIFE & CAFE',
    subLine: 'ATMOSPHERIC VISUAL STORYTELLING · META FEED',
    ctaLine: 'ORDER LATE NIGHT DELIVERY →',
    accent: '#f59e0b',
    notice: 'Loaded Naughtee Cafe Brighter Nights Post',
  },
  astrox: {
    src: ASTROX_AGENCY_POST,
    label: 'Astro X Agency',
    docName: 'AstroX_Design_Builds_Brands.psd',
    title: 'DESIGN THAT BUILDS BRANDS',
    tagline: 'STRATEGY · CREATIVITY · MEASURABLE IMPACT',
    metaLine: 'B2B AGENCY POST · DIGITAL MARKETING',
    subLine: 'BRANDING · UI/UX DESIGN · PAID SOCIAL MEDIA',
    ctaLine: 'BOOK A GROWTH CONSULTATION →',
    accent: '#ef4444',
    notice: 'Loaded Astro X Brand Agency Post',
  },
  'naughtee-burger': {
    src: NAUGHTEE_BURGER_POST,
    label: 'Naughtee Burger Ad',
    docName: 'Naughtee_Cafe_Burger_Post.psd',
    title: 'NO DRAMA. JUST CHEESE.',
    tagline: 'BURGERS ARE SIMPLE · 100% VEG & DELICIOUS',
    metaLine: 'F&B PERFORMANCE AD · INSTAGRAM 4:5',
    subLine: 'HIGH-ENGAGEMENT MEME HOOK · @NAUGHTEE_CAFE',
    ctaLine: 'ORDER COMBO NOW →',
    accent: '#f59e0b',
    notice: 'Loaded Naughtee Cafe Burger Ad Post',
  },
};

type PsCanvasRatio = '4:5' | '1:1' | '9:16';

export function WorkflowAppDemos({ onNavigate }: WorkflowAppDemosProps) {
  const [selectedApp, setSelectedApp] = useState<AppId>('photoshop');

  // ==========================================
  // 1. PHOTOSHOP STATE (Social & Ad Posts)
  // ==========================================
  const [psPreset, setPsPreset] = useState<PsPosterPreset>('fashion');
  const [psAspectRatio, setPsAspectRatio] = useState<PsCanvasRatio>('4:5');
  const [psExposure, setPsExposure] = useState<number>(100);
  const [psSaturation, setPsSaturation] = useState<number>(100);
  const [psFilter, setPsFilter] = useState<'raw' | 'anamorphic' | 'vivid' | 'noir'>('raw');
  const [psActiveTool, setPsActiveTool] = useState<'move' | 'type' | 'crop' | 'brush' | 'eyedropper' | 'zoom'>('move');
  const [psLayers, setPsLayers] = useState({
    cropGuides: true,
    thirdsGrid: false,
    vignette: false,
    frameMatte: false,
  });
  const [psNotice, setPsNotice] = useState<string | null>(null);

  // ==========================================
  // 2. META ADS MANAGER STATE
  // ==========================================
  const [metaPlacement, setMetaPlacement] = useState<'feed' | 'story' | 'fb'>('feed');
  const [metaCampaignStatus, setMetaCampaignStatus] = useState(true);
  const [metaDailyBudget, setMetaDailyBudget] = useState(2500);
  const [metaTargetAudience, setMetaTargetAudience] = useState<'metro' | 'luxury' | 'panIndia'>('metro');
  const [metaAdFormat, setMetaAdFormat] = useState<'single' | 'carousel'>('single');
  const [metaHeadline, setMetaHeadline] = useState('Velocity Apex Run Series 04');
  const [metaPrimaryText, setMetaPrimaryText] = useState(
    'Engineered for maximum street tempo. Carbon-plated sprint soles with ultra-light breathable air mesh. Order before midnight for complimentary express dispatch across India.'
  );
  const [metaCta, setMetaCta] = useState('Shop Now');
  const [metaLikes, setMetaLikes] = useState(2480);
  const [metaLiked, setMetaLiked] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);
  const [metaCommentModal, setMetaCommentModal] = useState(false);
  const [metaCommentsList, setMetaCommentsList] = useState([
    { user: 'rohit_sharma_run', text: 'Fit is true to size? Just placed order for Mumbai delivery!', time: '2h ago' },
    { user: 'ananya_design', text: 'Typography on the sole packaging is insane 🔥', time: '4h ago' },
  ]);
  const [metaNewComment, setMetaNewComment] = useState('');
  const [metaInstantSheet, setMetaInstantSheet] = useState(false);
  const [metaNotice, setMetaNotice] = useState<string | null>(null);

  const showFeedback = (setter: (msg: string | null) => void, msg: string) => {
    setter(msg);
    setTimeout(() => setter(null), 2800);
  };

  // Preset configuration for Photoshop social & ad posts
  const applyPsPostPreset = (preset: PsPosterPreset) => {
    const cfg = PS_POST_ASSETS[preset];
    setPsPreset(preset);
    setPsFilter('raw');
    setPsExposure(100);
    setPsSaturation(100);
    showFeedback(setPsNotice, cfg.notice);
  };

  const getPsExportDimensions = () => {
    if (psAspectRatio === '1:1') return { width: 1080, height: 1080 };
    if (psAspectRatio === '9:16') return { width: 1080, height: 1920 };
    return { width: 1200, height: 1500 };
  };

  // Real HTML5 Canvas High-Res Social Post Exporter
  const exportPsPosterCanvas = async () => {
    const { width, height } = getPsExportDimensions();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = psLayers.frameMatte ? '#f8fafc' : '#0e1015';
    ctx.fillRect(0, 0, width, height);

    const imgSrc = PS_POST_ASSETS[psPreset].src;
    const pad = psLayers.frameMatte ? 48 : 0;
    const targetW = width - pad * 2;
    const targetH = height - pad * 2;

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('image load failed'));
        img.src = imgSrc;
      });

      const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const dx = (width - drawW) / 2;
      const dy = (height - drawH) / 2;

      const gradeFilter =
        psFilter === 'anamorphic'
          ? 'contrast(116%) saturate(112%) brightness(98%)'
          : psFilter === 'noir'
          ? 'grayscale(100%) contrast(135%)'
          : psFilter === 'vivid'
          ? 'contrast(122%) saturate(130%)'
          : '';

      ctx.save();
      ctx.filter = `brightness(${psExposure}%) saturate(${psSaturation}%) ${gradeFilter}`.trim();
      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();
    } catch {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);
    }

    if (psLayers.vignette) {
      const radial = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.28,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.72
      );
      radial.addColorStop(0, 'rgba(0,0,0,0)');
      radial.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    }

    const link = document.createElement('a');
    link.download = `${psPreset}_${width}x${height}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback(setPsNotice, `Downloaded ${width}×${height} Post PNG!`);
  };

  const currentMeta = APPS[selectedApp];

  return (
    <div className="pt-[80px] md:pt-[100px] lg:pt-[110px] pb-[100px] bg-[#f4f7fb] text-[#111418] min-h-screen">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Top Editorial Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111418]/10">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-mono tracking-[0.06em] uppercase text-[#ff5512] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>04 · Interactive Digital Marketing Tools</span>
            </div>
            <h1 className="text-[34px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.03em] leading-[1.04] text-[#111418] [text-wrap:balance]">
              Test Our Digital Marketing Workflow Live.
            </h1>
            <p className="mt-3 text-[15px] sm:text-[17px] text-[#111418]/70 max-w-2xl leading-[1.55]">
              Interactive sandboxes for direct-response ad creatives, 9:16 Reels video ads, live Meta Ads
              Manager campaigns, and mobile conversion landing funnels.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#16191f] text-white text-[14px] font-medium hover:bg-[#2b3140] transition-colors cursor-pointer shadow-sm"
            >
              Start Project Scope
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-App Segmented Switcher Strip (Fully Responsive) */}
        <div className="mt-6 flex items-center overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white rounded-[16px] border border-[#111418]/10 shadow-xs">
          {(Object.keys(APPS) as AppId[]).map((appKey) => {
            const app = APPS[appKey];
            const isSelected = selectedApp === appKey;
            return (
              <button
                key={appKey}
                type="button"
                onClick={() => setSelectedApp(appKey)}
                className={`relative shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] text-[13px] sm:text-[14px] font-medium transition-all cursor-pointer select-none ${
                  isSelected ? 'text-[#111418] shadow-sm' : 'text-[#111418]/65 hover:text-[#111418] hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="workflow-app-pill"
                    transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                    className="absolute inset-0 bg-[#f1f5f9] rounded-[12px] border border-slate-200"
                  />
                )}
                <span
                  className="relative z-10 w-6 h-6 rounded-[6px] flex items-center justify-center font-bold text-[10.5px] shrink-0"
                  style={{
                    background: app.iconBg,
                    color: app.iconFg,
                  }}
                >
                  {app.badge.slice(0, 2)}
                </span>
                <span className="relative z-10 whitespace-nowrap">
                  {`${app.name.split(' ')[0]} ${app.id === 'meta' ? 'Ads' : app.id === 'website' ? 'Studio' : ''}`.trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Application Stage Container */}
        <div className="mt-6 rounded-[24px] bg-[#12151b] text-white p-4 sm:p-6 md:p-8 shadow-[0_30px_70px_rgba(20,30,60,0.2)] border border-white/10 overflow-hidden">
          {/* Top Stage Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 text-[12px]">
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-[8px] flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0"
                style={{ background: currentMeta.iconBg, color: currentMeta.iconFg }}
              >
                {currentMeta.badge.slice(0, 2)}
              </span>
              <div>
                <p className="font-semibold text-white text-[14px] leading-tight">{currentMeta.name}</p>
                <p className="text-white/55 text-[11px] font-mono">{currentMeta.tag}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-white/60 font-mono text-[11px]">
              <span>Category: <strong className="text-white">{currentMeta.category}</strong></span>
              <span className="hidden md:inline">·</span>
              <span>Speed: <strong className="text-[#ff5512]">{currentMeta.turnaround}</strong></span>
            </div>
          </div>

          {/* Interactive Workspaces */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {/* =========================================================================
                  1. PHOTOSHOP DEMO: SOCIAL MEDIA & PERFORMANCE AD POSTS
              ========================================================================= */}
              {selectedApp === 'photoshop' && (
                <motion.div
                  key="demo-photoshop"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                >
                  {/* Ps Window Frame */}
                  <div className="lg:col-span-8 rounded-[16px] bg-[#1e2025] border border-white/12 flex flex-col overflow-hidden">
                    {/* Photoshop Menu Strip */}
                    <div className="bg-[#26282e] px-3 py-1.5 border-b border-black/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/70">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-[4px] bg-[#001E36] border border-[#31A8FF]/40 text-[#31A8FF] font-bold text-[10px] flex items-center justify-center">
                          Ps
                        </span>
                        <div className="flex items-center gap-2 text-[10.5px]">
                          <span className="hover:text-white cursor-pointer" onClick={() => exportPsPosterCanvas()}>File (Export PNG)</span>
                          <span className="hover:text-white cursor-pointer" onClick={() => setPsLayers((p) => ({ ...p, vignette: !p.vignette }))}>Image</span>
                          <span className="hover:text-white cursor-pointer" onClick={() => setPsLayers((p) => ({ ...p, frameMatte: !p.frameMatte }))}>Layer</span>
                          <span className="hover:text-white cursor-pointer" onClick={() => setPsFilter((f) => (f === 'raw' ? 'vivid' : f === 'vivid' ? 'noir' : 'raw'))}>Filter</span>
                          <span className="hover:text-white cursor-pointer" onClick={() => setPsLayers((p) => ({ ...p, cropGuides: !p.cropGuides }))}>View</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
                        <span>{PS_POST_ASSETS[psPreset].docName}</span>
                        <span className="text-[#31A8FF]">@ 100% (sRGB/8#)</span>
                      </div>
                    </div>

                    {/* Photoshop Options & Notice */}
                    <div className="bg-[#22242a] px-3 py-1 border-b border-black/30 flex items-center justify-between text-[10.5px] font-mono text-white/60">
                      <span>
                        Tool: {psActiveTool.toUpperCase()} · Canvas {psAspectRatio} ·{' '}
                        {psAspectRatio === '1:1' ? '1080×1080' : psAspectRatio === '9:16' ? '1080×1920' : '1200×1500'} px
                      </span>
                      {psNotice && <span className="text-[#31A8FF] animate-pulse font-semibold">{psNotice}</span>}
                    </div>

                    {/* Canvas Area with Left Tool Rail & Live Post Artwork */}
                    <div className="flex-1 flex min-h-[460px] sm:min-h-[540px]">
                      {/* Left Tool Dock */}
                      <div className="w-[38px] shrink-0 bg-[#25272d] border-r border-black/40 py-3 flex flex-col items-center gap-2.5 text-white/60">
                        <Move
                          onClick={() => setPsActiveTool('move')}
                          className={`w-3.5 h-3.5 cursor-pointer ${psActiveTool === 'move' ? 'text-[#31A8FF]' : 'hover:text-white'}`}
                        />
                        <Type
                          onClick={() => setPsActiveTool('type')}
                          className={`w-3.5 h-3.5 cursor-pointer ${psActiveTool === 'type' ? 'text-[#31A8FF]' : 'hover:text-white'}`}
                        />
                        <Crop
                          onClick={() => {
                            setPsActiveTool('crop');
                            setPsLayers((p) => ({ ...p, cropGuides: !p.cropGuides }));
                          }}
                          className={`w-3.5 h-3.5 cursor-pointer ${psActiveTool === 'crop' ? 'text-[#31A8FF]' : 'hover:text-white'}`}
                        />
                        <Brush
                          onClick={() => setPsActiveTool('brush')}
                          className={`w-3.5 h-3.5 cursor-pointer ${psActiveTool === 'brush' ? 'text-[#31A8FF]' : 'hover:text-white'}`}
                        />
                        <Pipette
                          onClick={() => setPsActiveTool('eyedropper')}
                          className={`w-3.5 h-3.5 cursor-pointer ${psActiveTool === 'eyedropper' ? 'text-[#31A8FF]' : 'hover:text-white'}`}
                        />
                        <ZoomIn
                          onClick={() => setPsActiveTool('zoom')}
                          className={`w-3.5 h-3.5 cursor-pointer ${psActiveTool === 'zoom' ? 'text-[#31A8FF]' : 'hover:text-white'}`}
                        />
                        <div
                          className="mt-auto w-4 h-4 rounded-[3px] border border-white/60 shadow-xs"
                          style={{ backgroundColor: PS_POST_ASSETS[psPreset].accent }}
                        />
                      </div>

                      {/* Artboard Pasteboard */}
                      <div className="flex-1 bg-[#14161a] p-3 sm:p-6 flex items-center justify-center overflow-hidden bg-[radial-gradient(#272a33_1px,transparent_1px)] [background-size:16px_16px]">
                        {/* Dynamic Aspect-Ratio Social Post Artboard */}
                        <div
                          className={`relative rounded-[4px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 select-none transition-all duration-300 ${
                            psAspectRatio === '1:1'
                              ? 'w-[290px] sm:w-[360px] aspect-square'
                              : psAspectRatio === '9:16'
                              ? 'w-[225px] sm:w-[255px] aspect-[9/16]'
                              : 'w-[290px] sm:w-[350px] aspect-[4/5]'
                          } ${psLayers.frameMatte ? 'p-3 sm:p-4 bg-[#f8fafc]' : 'bg-[#0e1015]'}`}
                        >
                          <div className="relative w-full h-full overflow-hidden bg-[#0e1015]">
                            {/* Clean Post Artwork (no text overlays) */}
                            <img
                              src={PS_POST_ASSETS[psPreset].src}
                              alt={PS_POST_ASSETS[psPreset].label}
                              style={{
                                filter: [
                                  `brightness(${psExposure}%)`,
                                  `saturate(${psSaturation}%)`,
                                  psFilter === 'anamorphic'
                                    ? 'contrast(115%) saturate(112%)'
                                    : psFilter === 'noir'
                                    ? 'grayscale(100%) contrast(135%)'
                                    : psFilter === 'vivid'
                                    ? 'contrast(125%) saturate(135%)'
                                    : '',
                                ]
                                  .filter(Boolean)
                                  .join(' '),
                              }}
                              className="w-full h-full object-contain transition-all duration-200"
                            />

                            {/* Optional Subtle Outer Vignette */}
                            {psLayers.vignette && (
                              <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  background:
                                    'radial-gradient(circle at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.52) 100%)',
                                }}
                              />
                            )}

                            {/* Optional Rule-of-Thirds Composition Grid */}
                            {psLayers.thirdsGrid && (
                              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                                {Array.from({ length: 9 }).map((_, idx) => (
                                  <div key={idx} className="border border-white/18" />
                                ))}
                              </div>
                            )}

                            {/* Crop / Safe-Zone Frame Guides */}
                            {psLayers.cropGuides && (
                              <div className="absolute inset-2 border border-cyan-400/35 pointer-events-none z-20">
                                <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-cyan-400" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-cyan-400" />
                                <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-cyan-400" />
                                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-cyan-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ps Inspector Column */}
                  <div className="lg:col-span-4 rounded-[16px] bg-white/[0.04] border border-white/10 p-5 flex flex-col justify-between gap-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-[13px] font-semibold text-white">Post Creative Inspector</span>
                        <span className="font-mono text-[10.5px] text-[#31A8FF]">{psAspectRatio} Social Suite</span>
                      </div>

                      {/* 4 Uploaded Post Selector Presets */}
                      <div>
                        <label className="block text-[11px] font-mono text-white/50 mb-1.5">Social Campaign Posts</label>
                        <div className="grid grid-cols-2 gap-1.5 text-[11.5px]">
                          {(Object.keys(PS_POST_ASSETS) as PsPosterPreset[]).map((presetKey) => {
                            const item = PS_POST_ASSETS[presetKey];
                            const active = psPreset === presetKey;
                            return (
                              <button
                                key={presetKey}
                                type="button"
                                onClick={() => applyPsPostPreset(presetKey)}
                                className={`p-1.5 rounded-[9px] font-medium text-left transition-colors cursor-pointer flex items-center gap-2 border ${
                                  active
                                    ? 'bg-[#ff5512] text-white border-[#ff5512]'
                                    : 'bg-white/5 text-white/75 border-white/10 hover:bg-white/10'
                                }`}
                              >
                                <img
                                  src={item.src}
                                  alt=""
                                  className="w-7 h-9 rounded-[4px] object-cover shrink-0 bg-black/40"
                                />
                                <span className="truncate text-[11px] leading-tight">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Canvas Aspect Ratio Format */}
                      <div>
                        <label className="block text-[11px] font-mono text-white/50 mb-1.5">Canvas Placement Format</label>
                        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                          {(
                            [
                              { id: '4:5', label: '4:5 Feed' },
                              { id: '1:1', label: '1:1 Square' },
                              { id: '9:16', label: '9:16 Story' },
                            ] as const
                          ).map((fmt) => (
                            <button
                              key={fmt.id}
                              type="button"
                              onClick={() => setPsAspectRatio(fmt.id)}
                              className={`py-1.5 px-2 rounded-[7px] transition-colors cursor-pointer font-medium ${
                                psAspectRatio === fmt.id
                                  ? 'bg-[#31A8FF] text-[#05131f] font-semibold'
                                  : 'bg-white/5 text-white/75 hover:bg-white/10'
                              }`}
                            >
                              {fmt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Camera Raw Exposure & Saturation Adjustments */}
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-white/55 mb-1">
                            <span>Camera Raw Exposure</span>
                            <span className="text-[#31A8FF] tabular-nums">{psExposure}%</span>
                          </div>
                          <input
                            type="range"
                            min={75}
                            max={125}
                            value={psExposure}
                            onChange={(e) => setPsExposure(Number(e.target.value))}
                            className="w-full accent-[#31A8FF] cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-white/55 mb-1">
                            <span>Color Vibrance / Saturation</span>
                            <span className="text-[#ff5512] tabular-nums">{psSaturation}%</span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={150}
                            value={psSaturation}
                            onChange={(e) => setPsSaturation(Number(e.target.value))}
                            className="w-full accent-[#ff5512] cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Camera Grade Filter */}
                      <div>
                        <label className="block text-[11px] font-mono text-white/50 mb-1.5">Ad Color Grade</label>
                        <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                          {[
                            { id: 'raw' as const, label: 'Original' },
                            { id: 'anamorphic' as const, label: 'Scroll-Pop' },
                            { id: 'vivid' as const, label: 'Vivid' },
                            { id: 'noir' as const, label: 'Noir' },
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setPsFilter(f.id)}
                              className={`py-1.5 rounded-[6px] transition-colors cursor-pointer ${
                                psFilter === f.id ? 'bg-white text-black font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Non-Text Layer Stack Switches */}
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[11px] font-mono text-white/50 mb-1">Artboard Layers &amp; Guides</label>
                        <button
                          type="button"
                          onClick={() => setPsLayers((p) => ({ ...p, cropGuides: !p.cropGuides }))}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] bg-white/5 hover:bg-white/10 text-[11.5px] text-white/80 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            {psLayers.cropGuides ? <Eye className="w-3.5 h-3.5 text-[#31A8FF]" /> : <EyeOff className="w-3.5 h-3.5 text-white/30" />}
                            {psAspectRatio} Safe-Zone Guides
                          </span>
                          <span className="font-mono text-[9.5px] text-white/40">{psLayers.cropGuides ? 'ON' : 'OFF'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPsLayers((p) => ({ ...p, thirdsGrid: !p.thirdsGrid }))}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] bg-white/5 hover:bg-white/10 text-[11.5px] text-white/80 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            {psLayers.thirdsGrid ? <Eye className="w-3.5 h-3.5 text-[#31A8FF]" /> : <EyeOff className="w-3.5 h-3.5 text-white/30" />}
                            Rule-of-Thirds Grid
                          </span>
                          <span className="font-mono text-[9.5px] text-white/40">{psLayers.thirdsGrid ? 'ON' : 'OFF'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPsLayers((p) => ({ ...p, vignette: !p.vignette }))}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] bg-white/5 hover:bg-white/10 text-[11.5px] text-white/80 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            {psLayers.vignette ? <Eye className="w-3.5 h-3.5 text-[#31A8FF]" /> : <EyeOff className="w-3.5 h-3.5 text-white/30" />}
                            Soft Edge Vignette
                          </span>
                          <span className="font-mono text-[9.5px] text-white/40">{psLayers.vignette ? 'ON' : 'OFF'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPsLayers((p) => ({ ...p, frameMatte: !p.frameMatte }))}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] bg-white/5 hover:bg-white/10 text-[11.5px] text-white/80 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            {psLayers.frameMatte ? <Eye className="w-3.5 h-3.5 text-[#31A8FF]" /> : <EyeOff className="w-3.5 h-3.5 text-white/30" />}
                            Clean Gallery Frame Matte
                          </span>
                          <span className="font-mono text-[9.5px] text-white/40">{psLayers.frameMatte ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={exportPsPosterCanvas}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-[#31A8FF]/20 text-[#31A8FF] border border-[#31A8FF]/40 text-[13px] font-medium hover:bg-[#31A8FF]/30 transition-colors cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export {psAspectRatio === '1:1' ? '1080×1080' : psAspectRatio === '9:16' ? '1080×1920' : '1200×1500'} (.png)
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('pricing')}
                        className="text-[12px] text-white/60 hover:text-white underline cursor-pointer"
                      >
                        Rates →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* =========================================================================
                  2. AFTER EFFECTS DEMO: ADS VIDEO EDITING & MOTION VFX STUDIO
              ========================================================================= */}
              {selectedApp === 'aftereffects' && (
                <motion.div
                  key="demo-aftereffects"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <AfterEffectsStudio onNavigate={onNavigate} />
                </motion.div>
              )}

              {/* =========================================================================
                  3. META ADS MANAGER DEMO: ADVANCED CAMPAIGN, REELS & CONVERSIONS
              ========================================================================= */}
              {selectedApp === 'meta' && (
                <motion.div
                  key="demo-meta"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                >
                  {/* Meta Window */}
                  <div className="lg:col-span-8 rounded-[16px] bg-[#14171f] border border-white/12 flex flex-col overflow-hidden">
                    {/* Meta Top Header */}
                    <div className="bg-[#1a1f2c] px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-[12px]">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-[5px] bg-[#0866FF] flex items-center justify-center font-bold text-white text-[14px]">
                          ∞
                        </div>
                        <span className="font-semibold text-white">Meta Ads Manager</span>
                        <span className="hidden sm:inline text-white/40">· Campaigns &gt; Conversions Q4</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMetaCampaignStatus((v) => !v)}
                          className={`px-2.5 py-1 rounded-[6px] font-mono text-[10.5px] font-semibold transition-colors cursor-pointer ${
                            metaCampaignStatus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {metaCampaignStatus ? 'DELIVERY: ACTIVE' : 'PAUSED'}
                        </button>
                      </div>
                    </div>

                    {/* Meta Metric Telemetry Strip */}
                    <div className="bg-[#10131a] px-4 py-2.5 border-b border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-white/45 block">Daily Budget</span>
                        <span className="text-white font-semibold">₹{metaDailyBudget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-white/45 block">Est. 24h Reach</span>
                        <span className="text-white font-semibold">{(metaDailyBudget * 34.2).toFixed(0)} users</span>
                      </div>
                      <div>
                        <span className="text-white/45 block">Avg. CTR</span>
                        <span className="text-emerald-400 font-semibold">3.88% (High Tier)</span>
                      </div>
                      <div>
                        <span className="text-white/45 block">Target ROAS</span>
                        <span className="text-[#0866FF] font-semibold">4.4× Return</span>
                      </div>
                    </div>

                    {/* Meta Placement Switcher Strip */}
                    <div className="bg-[#171b26] px-4 py-1.5 border-b border-white/6 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 font-mono text-[10px]">Placement:</span>
                        {[
                          { id: 'feed' as const, label: 'Instagram Feed (4:5)' },
                          { id: 'story' as const, label: 'Reels / Stories (9:16)' },
                          { id: 'fb' as const, label: 'Facebook Feed' },
                        ].map((pl) => (
                          <button
                            key={pl.id}
                            type="button"
                            onClick={() => setMetaPlacement(pl.id)}
                            className={`px-2 py-0.5 rounded-[4px] cursor-pointer transition-colors ${
                              metaPlacement === pl.id ? 'bg-[#0866FF] text-white font-medium' : 'text-white/60 hover:text-white'
                            }`}
                          >
                            {pl.label}
                          </button>
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-white/40">Live Device Simulation</span>
                    </div>

                    {/* Meta Center Preview Area */}
                    <div className="flex-1 bg-[#090b10] p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                      {/* Realistic Smartphone / Instagram Frame */}
                      <div
                        className={`rounded-[24px] bg-[#000000] border-2 border-white/20 p-2.5 shadow-2xl flex flex-col justify-between transition-all duration-300 ${
                          metaPlacement === 'story'
                            ? 'w-[230px] aspect-[9/16]'
                            : 'w-[270px] sm:w-[300px] aspect-[4/5]'
                        }`}
                      >
                        {/* Feed Top Handle */}
                        <div className="flex items-center justify-between pb-2 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-[10px] font-bold text-white">
                              X
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-white leading-tight flex items-center gap-1">
                                xmax.agency
                                <Check className="w-2.5 h-2.5 text-blue-400 bg-blue-400/20 rounded-full" />
                              </p>
                              <p className="text-[9px] text-white/50 leading-tight">Sponsored</p>
                            </div>
                          </div>
                          <span className="text-white/60 text-[12px] cursor-pointer">•••</span>
                        </div>

                        {/* Image Creative */}
                        <div className="relative flex-1 rounded-[10px] overflow-hidden bg-slate-900">
                          <img
                            src={sneakerPhoto}
                            alt="Meta Ad Creative"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                            <span className="text-[9.5px] font-bold tracking-wider text-white bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-[4px]">
                              LIMITED DROP 2026
                            </span>
                            <span className="text-[9.5px] font-mono text-emerald-400 font-semibold">IN STOCK</span>
                          </div>
                        </div>

                        {/* Bottom CTA Bar & Social Actions */}
                        <div className="pt-2 px-1 space-y-1.5">
                          {/* Action Button Bar */}
                          <div
                            onClick={() => setMetaInstantSheet(true)}
                            className="flex items-center justify-between py-1 px-2.5 rounded-[6px] bg-[#1a1f2c] border border-white/10 hover:border-[#0866FF]/60 cursor-pointer transition-colors"
                          >
                            <div className="truncate">
                              <p className="text-[8.5px] font-mono text-white/50 uppercase">xmax.agency</p>
                              <p className="text-[10.5px] font-medium text-white truncate max-w-[150px]">{metaHeadline}</p>
                            </div>
                            <span className="px-2 py-1 rounded-[4px] bg-[#0866FF] text-white font-semibold text-[10px] shrink-0">
                              {metaCta}
                            </span>
                          </div>

                          {/* Social Interaction Bar (Like / Comment / Share / Save) */}
                          <div className="flex items-center justify-between text-white/80 pt-0.5 px-0.5">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setMetaLiked((l) => !l);
                                  setMetaLikes((c) => (metaLiked ? c - 1 : c + 1));
                                }}
                                className="flex items-center gap-1 cursor-pointer hover:text-red-400"
                              >
                                <Heart className={`w-3.5 h-3.5 ${metaLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                <span className="text-[10px] font-mono font-medium">{metaLikes}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setMetaCommentModal(true)}
                                className="flex items-center gap-1 cursor-pointer hover:text-blue-400"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-mono">{metaCommentsList.length}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => showFeedback(setMetaNotice, 'Shared campaign link to clipboard!')}
                                className="cursor-pointer hover:text-white"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => setMetaSaved((s) => !s)}
                              className="cursor-pointer hover:text-white"
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${metaSaved ? 'fill-white text-white' : ''}`} />
                            </button>
                          </div>

                          {/* Caption */}
                          <p className="line-clamp-2 text-[9.5px] text-white/70 leading-snug">
                            <strong className="text-white">xmax.agency</strong> {metaPrimaryText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Comments Drawer Modal */}
                    {metaCommentModal && (
                      <div className="p-3 bg-[#11141b] border-t border-white/10 flex flex-col gap-2 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Live Ad Comments ({metaCommentsList.length})</span>
                          <button type="button" onClick={() => setMetaCommentModal(false)} className="text-white/50 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[10px] text-white/80">
                          {metaCommentsList.map((c, i) => (
                            <p key={i}>
                              <strong className="text-white">{c.user}:</strong> {c.text}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={metaNewComment}
                            onChange={(e) => setMetaNewComment(e.target.value)}
                            placeholder="Add a simulated customer comment..."
                            className="flex-1 px-2.5 py-1 bg-black/40 border border-white/10 rounded-[6px] text-white text-[10px] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!metaNewComment.trim()) return;
                              setMetaCommentsList((p) => [...p, { user: 'you_verified', text: metaNewComment, time: 'Just now' }]);
                              setMetaNewComment('');
                            }}
                            className="px-2.5 py-1 bg-[#0866FF] text-white rounded-[6px] text-[10px] font-semibold cursor-pointer"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Simulated Instant Experience Checkout Sheet */}
                    {metaInstantSheet && (
                      <div className="p-3 bg-[#0a192f] border-t border-[#0866FF]/30 flex items-center justify-between text-[11px] text-white">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-emerald-400" />
                          <span>Instant Checkout Sheet triggered: Velocity Apex Sneaker (₹7,499)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMetaInstantSheet(false)}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono cursor-pointer"
                        >
                          Close Preview
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Meta Inspector Column */}
                  <div className="lg:col-span-4 rounded-[16px] bg-white/[0.04] border border-white/10 p-5 flex flex-col justify-between gap-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-[13px] font-semibold text-white">Meta Targeting Matrix</span>
                        <span className="font-mono text-[10.5px] text-[#0866FF]">Advantage+ Suite</span>
                      </div>

                      {/* Daily Budget Slider */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-white/60 mb-1">
                          <span>Daily Ad Spend</span>
                          <span className="text-[#0866FF] font-bold">₹{metaDailyBudget.toLocaleString()} / day</span>
                        </div>
                        <input
                          type="range"
                          min={500}
                          max={15000}
                          step={500}
                          value={metaDailyBudget}
                          onChange={(e) => setMetaDailyBudget(Number(e.target.value))}
                          className="w-full accent-[#0866FF] cursor-pointer"
                        />
                      </div>

                      {/* Headline Editor */}
                      <div>
                        <label htmlFor="meta-head" className="block text-[11px] font-mono text-white/50 mb-1">
                          Ad Card Headline
                        </label>
                        <input
                          id="meta-head"
                          type="text"
                          value={metaHeadline}
                          onChange={(e) => setMetaHeadline(e.target.value)}
                          className="w-full px-3 py-2 rounded-[8px] bg-[#0c0e12] border border-white/15 text-[12px] text-white focus:border-[#0866FF] focus:outline-none"
                        />
                      </div>

                      {/* Primary Textarea */}
                      <div>
                        <label htmlFor="meta-body" className="block text-[11px] font-mono text-white/50 mb-1">
                          Primary Caption Body
                        </label>
                        <textarea
                          id="meta-body"
                          rows={2}
                          value={metaPrimaryText}
                          onChange={(e) => setMetaPrimaryText(e.target.value)}
                          className="w-full px-3 py-2 rounded-[8px] bg-[#0c0e12] border border-white/15 text-[11.5px] text-white/90 focus:border-[#0866FF] focus:outline-none resize-none"
                        />
                      </div>

                      {/* CTA Selector */}
                      <div>
                        <label className="block text-[11px] font-mono text-white/50 mb-1.5">Call to Action Button</label>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          {['Shop Now', 'Order Now', 'Get Offer', 'Learn More'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setMetaCta(c)}
                              className={`py-1.5 rounded-[6px] transition-colors cursor-pointer ${
                                metaCta === c ? 'bg-[#0866FF] text-white font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Audience Estimator Meter */}
                      <div className="p-3 rounded-[10px] bg-white/[0.03] border border-white/8 space-y-1.5 font-mono text-[10.5px]">
                        <div className="flex justify-between text-white/80">
                          <span>Audience Definition:</span>
                          <span className="text-emerald-400 font-semibold">Broad &amp; High-Intent</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden flex">
                          <span className="w-1/3 bg-amber-400" />
                          <span className="w-1/2 bg-emerald-400" />
                          <span className="w-1/6 bg-red-400" />
                        </div>
                        <p className="text-[9.5px] text-white/50">Est. Audience Pool: 18.2M - 21.5M active buyers</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => showFeedback(setMetaNotice, 'Audited Conversion Tracking Pixel & CAPI')}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-[#0866FF]/20 text-[#60a5fa] border border-[#0866FF]/40 text-[13px] font-medium hover:bg-[#0866FF]/30 transition-colors cursor-pointer shadow-sm"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        Verify CAPI Tracking Pixel
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('pricing')}
                        className="text-[12px] text-white/60 hover:text-white underline cursor-pointer"
                      >
                        Rates →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* =========================================================================
                  4. RESPONSIVE WEB STUDIO: E-COMMERCE, CLOTHING & STATIC WEBSITES
              ========================================================================= */}
              {selectedApp === 'website' && (
                <motion.div
                  key="demo-website"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ResponsiveWebStudio onNavigate={onNavigate} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Detailed Application Deliverables Breakdown */}
        <div className="mt-12 bg-white rounded-[24px] border border-[#111418]/10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#111418]/10">
            <div>
              <span className="font-mono text-[11px] text-[#ff5512] uppercase tracking-wider font-semibold">
                Production Standards · {currentMeta.name}
              </span>
              <h3 className="text-[22px] md:text-[26px] font-medium tracking-tight text-[#111418]">
                What We Deliver With {currentMeta.name.split(' ')[0]}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('pricing')}
                className="px-4 py-2 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#111418] text-[13px] font-medium transition-colors cursor-pointer"
              >
                View Full Rate Card
              </button>
              <button
                type="button"
                onClick={() => onNavigate('quote')}
                className="px-4 py-2 rounded-[10px] bg-[#ff5512] hover:bg-[#e5490b] text-white text-[13px] font-medium transition-colors cursor-pointer"
              >
                Add to Quote →
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-[14px] bg-[#f8fafc] border border-slate-200/80">
              <p className="font-mono text-[11px] text-slate-500 uppercase tracking-wide">Production Scope</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-800 font-medium">
                {currentMeta.summary}
              </p>
            </div>

            <div className="p-4 rounded-[14px] bg-[#f8fafc] border border-slate-200/80">
              <p className="font-mono text-[11px] text-slate-500 uppercase tracking-wide">Deliverable File Specs</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-800 font-medium">
                {currentMeta.deliverables}
              </p>
            </div>

            <div className="p-4 rounded-[14px] bg-[#f8fafc] border border-slate-200/80">
              <p className="font-mono text-[11px] text-slate-500 uppercase tracking-wide">Standard Turnaround</p>
              <p className="mt-2 text-[16px] text-[#ff5512] font-semibold">
                {currentMeta.turnaround}
              </p>
              <p className="mt-1 text-[12px] text-slate-500">
                Guaranteed delivery timeline with iterative milestone checkpoints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
