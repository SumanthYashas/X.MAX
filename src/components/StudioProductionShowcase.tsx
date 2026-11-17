import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Brush,
  Check,
  Crop,
  Download,
  Eye,
  Grid3X3,
  Layers,
  Megaphone,
  MousePointer2,
  Pipette,
  RotateCcw,
  Sparkles,
  Type,
  ZoomIn,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import skincarePhoto from '../assets/images/layout_editorial_skincare_1794926294213.jpg';
import sneakerPhoto from '../assets/images/campaign_sneaker_ad_1794926293703.jpg';
import { PageRoute } from '../types/routing';

const WATCH_BG = '/assets/aistudio/watch_c20cf811.webp';
const SHOE_BG = '/assets/aistudio/shoe_547d4516.webp';
const SKINCARE_BG = '/assets/aistudio/skincare_fe153ad9.webp';

interface StudioProductionShowcaseProps {
  onNavigate: (route: PageRoute) => void;
}

type StudioMode = 'poster' | 'layout' | 'campaign';
type PosterPresetId = 'shoe' | 'watch' | 'skincare';
type PsToolId = 'move' | 'type' | 'crop' | 'eyedropper' | 'brush' | 'zoom';
type PsMenuId = 'file' | 'edit' | 'image' | 'layer' | 'type' | 'filter' | 'view';
type FilterFxId = 'none' | 'vivid' | 'matte' | 'noir';
type ZoomPct = 85 | 100 | 108;
type AccentId = 'orange' | 'crimson' | 'emerald' | 'gold';
type LayoutPreset = 'spread' | 'poster' | 'packaging';
type AdFormat = 'portrait' | 'square' | 'story';
type AdCopyVariant = 'performance' | 'launch' | 'brand';

const FILTER_FX: Record<
  FilterFxId,
  { label: string; twClass: string; canvasFilter: string }
> = {
  none: {
    label: 'Natural Studio',
    twClass: '',
    canvasFilter: 'none',
  },
  vivid: {
    label: 'Vivid Contrast',
    twClass: 'contrast-[1.16] saturate-[1.22]',
    canvasFilter: 'contrast(116%) saturate(122%)',
  },
  matte: {
    label: 'Editorial Matte',
    twClass: 'contrast-[0.94] brightness-[1.05] saturate-[0.88]',
    canvasFilter: 'contrast(94%) brightness(105%) saturate(88%)',
  },
  noir: {
    label: 'Monochrome Noir',
    twClass: 'grayscale contrast-[1.22]',
    canvasFilter: 'grayscale(100%) contrast(122%)',
  },
};

const PS_MENU_LIST: Array<{ id: PsMenuId; label: string }> = [
  { id: 'file', label: 'File' },
  { id: 'edit', label: 'Edit' },
  { id: 'image', label: 'Image' },
  { id: 'layer', label: 'Layer' },
  { id: 'type', label: 'Type' },
  { id: 'filter', label: 'Filter' },
  { id: 'view', label: 'View' },
];

const ACCENTS: Record<
  AccentId,
  { label: string; hex: string; swatchClass: string; filterClass: string }
> = {
  orange: {
    label: 'X.MAX Orange',
    hex: '#ff5512',
    swatchClass: 'bg-[#ff5512]',
    filterClass: 'contrast-[1.06] saturate-[1.06]',
  },
  crimson: {
    label: 'Crimson Red',
    hex: '#ef4444',
    swatchClass: 'bg-[#ef4444]',
    filterClass: 'contrast-[1.08] saturate-[1.04]',
  },
  emerald: {
    label: 'Tactical Green',
    hex: '#22c55e',
    swatchClass: 'bg-[#22c55e]',
    filterClass: 'contrast-[1.05] saturate-[1.08]',
  },
  gold: {
    label: 'Amber Gold',
    hex: '#d97706',
    swatchClass: 'bg-[#d97706]',
    filterClass: 'sepia-[0.06] saturate-[1.12] contrast-[1.04]',
  },
};

interface PosterPresetConfig {
  id: PosterPresetId;
  shortName: string;
  docName: string;
  image: string;
  verticalTitle: string;
  kickerTop: string;
  kickerBottom: string;
  mottoLine1: string;
  mottoLine2: string;
  mottoHighlight: string;
  caption: string;
  year: string;
  defaultAccent: AccentId;
  topDark: boolean;
  bottomDark: boolean;
  verticalLightInk: boolean;
  objectPosClass: string;
}

const POSTER_PRESETS: Record<PosterPresetId, PosterPresetConfig> = {
  shoe: {
    id: 'shoe',
    shortName: 'Sneaker Drop',
    docName: 'Sneaker_Drop_2026.psd',
    image: SHOE_BG,
    verticalTitle: 'VELOCITY',
    kickerTop: 'NEW',
    kickerBottom: 'COLLECTION',
    mottoLine1: 'GO BOLD.',
    mottoLine2: 'RUN LIGHT.',
    mottoHighlight: 'GO FIRST.',
    caption: 'AIR CUSHIONING BUILT FOR STREET TEMPO.',
    year: '2026',
    defaultAccent: 'orange',
    topDark: true,
    bottomDark: true,
    verticalLightInk: true,
    objectPosClass: 'object-center',
  },
  watch: {
    id: 'watch',
    shortName: 'Tactical Watch',
    docName: 'Chrono_Tactical.psd',
    image: WATCH_BG,
    verticalTitle: 'TACTICAL',
    kickerTop: 'TWIN',
    kickerBottom: 'SENSOR',
    mottoLine1: 'BUILT HARD.',
    mottoLine2: 'READ FAST.',
    mottoHighlight: 'WR5BAR.',
    caption: 'SHOCK RESISTANT BEZEL · OLIVE EDITION.',
    year: '2026',
    defaultAccent: 'emerald',
    topDark: true,
    bottomDark: true,
    verticalLightInk: true,
    objectPosClass: 'object-center',
  },
  skincare: {
    id: 'skincare',
    shortName: 'Honey Skincare',
    docName: 'Propolis_Glow.psd',
    image: SKINCARE_BG,
    verticalTitle: 'PROPOLIS',
    kickerTop: 'GOLDEN',
    kickerBottom: 'SYNERGY',
    mottoLine1: 'PURE HONEY.',
    mottoLine2: 'DEEP GLOW.',
    mottoHighlight: 'DAILY.',
    caption: 'NOURISHING BOTANICAL SERUM & TONER.',
    year: '2026',
    defaultAccent: 'gold',
    topDark: true,
    bottomDark: false,
    verticalLightInk: false,
    objectPosClass: 'object-[50%_48%]',
  },
};

const QUICK_POSTER_NAMES = ['FASHION', 'LIMITED', 'X.MAX', 'ATELIER'];

const LAYOUT_PRESETS: Record<
  LayoutPreset,
  {
    shortName: string;
    title: string;
    spec: string;
    docName: string;
    dims: string;
    rulerX: string[];
    rulerY: string[];
    defaultHeading: string;
    defaultTag: string;
  }
> = {
  spread: {
    shortName: 'Brochure Spread',
    title: 'Brochure / Magazine Spread',
    spec: '16:10 · A4 Twin Fold',
    docName: 'Aurum_Spread_A4.psd',
    dims: '2480×1550',
    rulerX: ['0', '500', '1000', '1500', '2000', '2480 px'],
    rulerY: ['0', '520', '1040', '1550'],
    defaultHeading: 'Aurum Rituals.',
    defaultTag: '01 · Botanical Formulation',
  },
  poster: {
    shortName: 'Editorial Poster',
    title: 'Event / Campaign Poster',
    spec: '3:4 · Print & Digital',
    docName: 'Stone_Amber_Poster.psd',
    dims: '1080×1440',
    rulerX: ['0', '220', '440', '660', '880', '1080 px'],
    rulerY: ['0', '480', '960', '1440'],
    defaultHeading: 'Stone & Amber',
    defaultTag: 'Vol. 04 · Editorial Poster',
  },
  packaging: {
    shortName: 'Packaging Dieline',
    title: 'Packaging & Label Dieline',
    spec: '4:3 · Print Ready',
    docName: 'Serum_30ml_Dieline.psd',
    dims: '1600×1200',
    rulerX: ['0', '320', '640', '960', '1280', '1600 px'],
    rulerY: ['0', '400', '800', '1200'],
    defaultHeading: 'Botanical Serum Dieline',
    defaultTag: 'Spec · 30ml',
  },
};

const QUICK_LAYOUT_NAMES = ['Aurum Rituals.', 'Stone & Amber', 'Pure Monograph', 'Season Issue 04'];

const PS_TOOLS: Array<{
  id: PsToolId;
  label: string;
  shortcut: string;
  Icon: typeof MousePointer2;
}> = [
  { id: 'move', label: 'Move Tool', shortcut: 'V', Icon: MousePointer2 },
  { id: 'type', label: 'Editable Type', shortcut: 'T', Icon: Type },
  { id: 'crop', label: 'Crop & Bleed', shortcut: 'C', Icon: Crop },
  { id: 'brush', label: 'Retouch Brush', shortcut: 'B', Icon: Brush },
  { id: 'eyedropper', label: 'Color Sampler', shortcut: 'I', Icon: Pipette },
  { id: 'zoom', label: 'Zoom Artboard', shortcut: 'Z', Icon: ZoomIn },
];

const AD_FORMATS: Record<
  AdFormat,
  {
    label: string;
    shortName: string;
    ratioClass: string;
    dims: string;
    docName: string;
    channel: string;
    width: number;
    height: number;
    rulerX: string[];
    rulerY: string[];
  }
> = {
  portrait: {
    label: '4:5 Feed',
    shortName: '4:5 Portrait Feed',
    ratioClass: 'aspect-[4/5] w-[228px] sm:w-[274px] md:w-[298px]',
    dims: '1080 × 1350 px',
    docName: 'Apex_MetaFeed_4x5.psd',
    channel: 'Meta Feed · IG',
    width: 1080,
    height: 1350,
    rulerX: ['0', '200', '400', '600', '800', '1080 px'],
    rulerY: ['0', '450', '900', '1350'],
  },
  square: {
    label: '1:1 Square',
    shortName: '1:1 Carousel',
    ratioClass: 'aspect-square w-[236px] sm:w-[290px] md:w-[320px]',
    dims: '1080 × 1080 px',
    docName: 'Apex_Carousel_1x1.psd',
    channel: 'Carousel · Display',
    width: 1080,
    height: 1080,
    rulerX: ['0', '200', '400', '600', '800', '1080 px'],
    rulerY: ['0', '360', '720', '1080'],
  },
  story: {
    label: '9:16 Reel',
    shortName: '9:16 Reel / Story',
    ratioClass: 'aspect-[9/16] w-[178px] sm:w-[205px] md:w-[222px]',
    dims: '1080 × 1920 px',
    docName: 'Apex_Reels_9x16.psd',
    channel: 'Reels · Shorts · Stories',
    width: 1080,
    height: 1920,
    rulerX: ['0', '200', '400', '600', '800', '1080 px'],
    rulerY: ['0', '640', '1280', '1920'],
  },
};

const AD_COPY: Record<
  AdCopyVariant,
  { label: string; headline: string; subline: string; cta: string }
> = {
  performance: {
    label: 'Performance Hook',
    headline: 'Engineered for Night Miles.',
    subline: 'Zero-drag carbon plate · Limited Drop',
    cta: 'Shop Drop',
  },
  launch: {
    label: 'Launch Offer',
    headline: 'First 48H: Early Access.',
    subline: 'Complimentary express dispatch across India',
    cta: 'Claim Pair',
  },
  brand: {
    label: 'Minimal Brand',
    headline: 'APEX RUN SERIES 04',
    subline: 'Precision Cushioning. Matte Carbon.',
    cta: 'Explore Series',
  },
};

export function StudioProductionShowcase({ onNavigate }: StudioProductionShowcaseProps) {
  const [mode, setMode] = useState<StudioMode>('poster');

  // Shared Photoshop CC Workspace State
  const [accentId, setAccentId] = useState<AccentId>(POSTER_PRESETS.shoe.defaultAccent);
  const [activePsTool, setActivePsTool] = useState<PsToolId>('move');
  const [openPsMenu, setOpenPsMenu] = useState<PsMenuId | null>(null);
  const [filterFx, setFilterFx] = useState<FilterFxId>('none');
  const [zoomPct, setZoomPct] = useState<ZoomPct>(100);
  const [showRulers, setShowRulers] = useState(true);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Poster Design State
  const [posterPresetId, setPosterPresetId] = useState<PosterPresetId>('shoe');
  const [verticalTitle, setVerticalTitle] = useState(POSTER_PRESETS.shoe.verticalTitle);
  const [kickerTop, setKickerTop] = useState(POSTER_PRESETS.shoe.kickerTop);
  const [kickerBottom, setKickerBottom] = useState(POSTER_PRESETS.shoe.kickerBottom);
  const [mottoHighlight, setMottoHighlight] = useState(POSTER_PRESETS.shoe.mottoHighlight);
  const [posterYear, setPosterYear] = useState(POSTER_PRESETS.shoe.year);
  const [showTransformBox, setShowTransformBox] = useState(true);
  const [posterLayers, setPosterLayers] = useState({
    verticalWordmark: true,
    editorialCopy: true,
    colorGrade: true,
  });

  // Layout Editing State
  const [showGuides, setShowGuides] = useState(true);
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>('spread');
  const [layoutHeading, setLayoutHeading] = useState(LAYOUT_PRESETS.spread.defaultHeading);
  const [layoutTag, setLayoutTag] = useState(LAYOUT_PRESETS.spread.defaultTag);
  const [layoutLayers, setLayoutLayers] = useState({
    copyLayer: true,
    photoLayer: true,
  });

  // Ad Campaign State
  const [adFormat, setAdFormat] = useState<AdFormat>('portrait');
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [adCopyVariant, setAdCopyVariant] = useState<AdCopyVariant>('performance');
  const [adHeadline, setAdHeadline] = useState(AD_COPY.performance.headline);
  const [adSubline, setAdSubline] = useState(AD_COPY.performance.subline);
  const [adCta, setAdCta] = useState(AD_COPY.performance.cta);
  const [campaignLayers, setCampaignLayers] = useState({
    headerBadge: true,
    copyStack: true,
    contrastScrim: true,
  });

  // Fallback tracking if image fails
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});

  const menuBarRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const layoutHeadingInputRef = useRef<HTMLInputElement>(null);
  const adHeadlineInputRef = useRef<HTMLInputElement>(null);
  const noticeTimerRef = useRef<number | null>(null);

  const activePreset = POSTER_PRESETS[posterPresetId];
  const activeAccent = ACCENTS[accentId];
  const activeLayoutMeta = LAYOUT_PRESETS[layoutPreset];
  const activeAdMeta = AD_FORMATS[adFormat];

  const notifyAction = (msg: string) => {
    setStatusNotice(msg);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => {
      setStatusNotice(null);
    }, 2600);
  };

  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenPsMenu(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPsMenu(null);
    };
    window.addEventListener('pointerdown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('pointerdown', handleOutside);
      window.removeEventListener('keydown', handleKey);
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const switchMode = (nextMode: StudioMode) => {
    setMode(nextMode);
    setOpenPsMenu(null);
  };

  const applyPreset = (id: PosterPresetId) => {
    const p = POSTER_PRESETS[id];
    setPosterPresetId(id);
    setVerticalTitle(p.verticalTitle);
    setKickerTop(p.kickerTop);
    setKickerBottom(p.kickerBottom);
    setMottoHighlight(p.mottoHighlight);
    setPosterYear(p.year);
    setAccentId(p.defaultAccent);
    setPosterLayers({ verticalWordmark: true, editorialCopy: true, colorGrade: true });
  };

  const applyLayoutPreset = (id: LayoutPreset) => {
    const p = LAYOUT_PRESETS[id];
    setLayoutPreset(id);
    setLayoutHeading(p.defaultHeading);
    setLayoutTag(p.defaultTag);
    setLayoutLayers({ copyLayer: true, photoLayer: true });
    notifyAction(`Opened ${p.docName}`);
  };

  const applyAdCopyVariant = (id: AdCopyVariant) => {
    const v = AD_COPY[id];
    setAdCopyVariant(id);
    setAdHeadline(v.headline);
    setAdSubline(v.subline);
    setAdCta(v.cta);
    setCampaignLayers({ headerBadge: true, copyStack: true, contrastScrim: true });
  };

  const resetActiveStudio = () => {
    setActivePsTool('move');
    setFilterFx('none');
    setZoomPct(100);
    setShowRulers(true);
    setOpenPsMenu(null);

    if (mode === 'poster') {
      applyPreset('shoe');
      setShowTransformBox(true);
      notifyAction('Poster workspace reset');
    } else if (mode === 'layout') {
      applyLayoutPreset('spread');
      setAccentId('orange');
      setShowGuides(true);
      notifyAction('Layout workspace reset');
    } else {
      setAdFormat('portrait');
      applyAdCopyVariant('performance');
      setAccentId('orange');
      setShowSafeZones(true);
      notifyAction('Ad campaign reset');
    }
  };

  const cycleAccent = () => {
    const order: AccentId[] = ['orange', 'crimson', 'emerald', 'gold'];
    const next = order[(order.indexOf(accentId) + 1) % order.length];
    setAccentId(next);
    notifyAction(`Accent: ${ACCENTS[next].label}`);
  };

  const focusActiveTypeInput = () => {
    setActivePsTool('type');
    setOpenPsMenu(null);
    requestAnimationFrame(() => {
      const target =
        mode === 'poster'
          ? titleInputRef.current
          : mode === 'layout'
            ? layoutHeadingInputRef.current
            : adHeadlineInputRef.current;
      target?.focus();
      target?.select();
    });
  };

  const loadCanvasImage = async (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('load failed'));
      img.src = src;
    });
    return img;
  };

  const drawCoverImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    applyGrade = true
  ) => {
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const dx = x + (w - drawW) / 2;
    const dy = y + (h - drawH) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    const fx = FILTER_FX[filterFx].canvasFilter;
    ctx.filter = fx !== 'none' ? fx : applyGrade ? 'contrast(106%) saturate(106%)' : 'none';
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
  };

  const triggerPngDownload = (canvas: HTMLCanvasElement, docName: string) => {
    const fileName = docName.replace(/\.psd$/i, '.png');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifyAction(`Exported ${fileName}`);
  };

  const exportPosterPng = async () => {
    setOpenPsMenu(null);
    const width = 1080;
    const height = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#10131a';
    ctx.fillRect(0, 0, width, height);

    try {
      const img = await loadCanvasImage(activePreset.image);
      drawCoverImage(ctx, img, 0, 0, width, height, posterLayers.colorGrade);
    } catch {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#090b10');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    const scrim = activePreset.bottomDark
      ? ctx.createLinearGradient(0, 0, width, 0)
      : ctx.createLinearGradient(0, 0, 0, height);
    if (activePreset.bottomDark) {
      scrim.addColorStop(0, 'rgba(10,13,20,0.58)');
      scrim.addColorStop(0.52, 'rgba(10,13,20,0.12)');
      scrim.addColorStop(1, 'rgba(10,13,20,0.08)');
    } else {
      scrim.addColorStop(0, 'rgba(20,14,4,0.22)');
      scrim.addColorStop(0.48, 'rgba(255,255,255,0)');
    }
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, width, height);

    if (posterLayers.verticalWordmark) {
      ctx.save();
      ctx.translate(width * 0.805, height * 0.5);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 220px "Archivo Black", Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = activePreset.verticalLightInk
        ? activeAccent.hex
        : 'rgba(255,255,255,0.85)';
      ctx.fillStyle = activePreset.verticalLightInk
        ? 'rgba(255,255,255,0.92)'
        : 'rgba(17,20,24,0.88)';
      const titleText = (verticalTitle || 'STUDIO').toUpperCase();
      ctx.fillText(titleText, 0, 0);
      ctx.strokeText(titleText, 0, 0);
      ctx.restore();
    }

    if (posterLayers.editorialCopy) {
      const topInk = activePreset.topDark ? '#ffffff' : '#111418';
      const bottomInk = activePreset.bottomDark ? '#ffffff' : '#111418';
      const pad = 54;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '900 58px "Archivo Black", Impact, sans-serif';
      ctx.fillStyle = topInk;
      ctx.fillText((kickerTop || 'NEW').toUpperCase(), pad, pad);
      ctx.fillStyle = activeAccent.hex;
      ctx.fillText((kickerBottom || 'COLLECTION').toUpperCase(), pad, pad + 56);

      ctx.font = '300 52px "Inter Tight", sans-serif';
      ctx.fillStyle = bottomInk;
      ctx.fillText(activePreset.mottoLine1, pad, height - 350);
      ctx.fillText(activePreset.mottoLine2, pad, height - 294);
      ctx.font = '600 52px "Inter Tight", sans-serif';
      ctx.fillStyle = activeAccent.hex;
      ctx.fillText((mottoHighlight || 'BE YOU.').toUpperCase(), pad, height - 238);

      ctx.fillStyle = activeAccent.hex;
      ctx.fillRect(pad, height - 170, 210, 5);

      ctx.font = '700 26px "Inter Tight", sans-serif';
      ctx.fillStyle = activePreset.bottomDark ? 'rgba(255,255,255,0.85)' : 'rgba(17,20,24,0.80)';
      ctx.fillText(activePreset.caption, pad, height - 144, width * 0.56);

      ctx.font = '900 62px "Archivo Black", Impact, sans-serif';
      ctx.fillStyle = activeAccent.hex;
      ctx.fillText(posterYear || '2026', pad, height - 98);
    }

    triggerPngDownload(canvas, activePreset.docName);
  };

  const exportLayoutPng = async () => {
    setOpenPsMenu(null);
    const width = layoutPreset === 'spread' ? 1600 : layoutPreset === 'poster' ? 1080 : 1400;
    const height = layoutPreset === 'spread' ? 1000 : layoutPreset === 'poster' ? 1440 : 1050;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = layoutPreset === 'packaging' ? '#f3efe8' : '#ebe6de';
    ctx.fillRect(0, 0, width, height);

    if (layoutLayers.photoLayer) {
      try {
        const img = await loadCanvasImage(skincarePhoto);
        if (layoutPreset === 'spread') {
          drawCoverImage(ctx, img, width / 2, 0, width / 2, height);
        } else if (layoutPreset === 'poster') {
          drawCoverImage(ctx, img, 80, 160, width - 160, height - 340);
        } else {
          drawCoverImage(ctx, img, 70, 70, width * 0.54, height - 140);
        }
      } catch {
        ctx.fillStyle = '#d8d0c3';
        ctx.fillRect(width / 2, 0, width / 2, height);
      }
    }

    if (layoutLayers.copyLayer) {
      ctx.fillStyle = '#111418';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      if (layoutPreset === 'spread') {
        ctx.font = '500 22px monospace';
        ctx.fillStyle = activeAccent.hex;
        ctx.fillText((layoutTag || '01 · BOTANICAL FORMULATION').toUpperCase(), 72, 72);
        ctx.font = '600 84px "Inter Tight", sans-serif';
        ctx.fillStyle = '#111418';
        ctx.fillText(layoutHeading || 'Aurum Rituals.', 72, height * 0.42, width * 0.4);
      } else if (layoutPreset === 'poster') {
        ctx.font = '500 22px monospace';
        ctx.fillStyle = activeAccent.hex;
        ctx.fillText((layoutTag || 'VOL. 04').toUpperCase(), 80, 78);
        ctx.font = '600 68px "Inter Tight", sans-serif';
        ctx.fillStyle = '#111418';
        ctx.fillText(layoutHeading || 'Stone & Amber', 80, height - 135, width - 220);
      } else {
        const leftX = width * 0.65;
        ctx.font = '600 22px monospace';
        ctx.fillStyle = activeAccent.hex;
        ctx.fillText((layoutTag || 'SPEC · 30ML').toUpperCase(), leftX, 88);
        ctx.font = '600 54px "Inter Tight", sans-serif';
        ctx.fillStyle = '#111418';
        ctx.fillText(layoutHeading || 'Botanical Serum Dieline', leftX, 140, width * 0.3);
      }
    }

    triggerPngDownload(canvas, activeLayoutMeta.docName);
  };

  const exportCampaignPng = async () => {
    setOpenPsMenu(null);
    const { width, height, dims, docName } = activeAdMeta;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#14171d';
    ctx.fillRect(0, 0, width, height);

    try {
      const img = await loadCanvasImage(sneakerPhoto);
      drawCoverImage(ctx, img, 0, 0, width, height);
    } catch {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1f242e');
      grad.addColorStop(1, '#0b0d11');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    if (campaignLayers.contrastScrim) {
      const scrim = ctx.createLinearGradient(0, 0, 0, height);
      scrim.addColorStop(0, 'rgba(0,0,0,0.4)');
      scrim.addColorStop(0.5, 'rgba(0,0,0,0.2)');
      scrim.addColorStop(1, 'rgba(0,0,0,0.88)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, width, height);
    }

    if (campaignLayers.headerBadge) {
      ctx.fillStyle = 'rgba(255,255,255,0.86)';
      ctx.font = '500 24px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SPONSORED · X.MAX CREATIVE', 56, 68);
      ctx.textAlign = 'right';
      ctx.fillText(dims, width - 56, 68);
    }

    if (campaignLayers.copyStack) {
      ctx.textAlign = 'left';
      ctx.fillStyle = activeAccent.hex;
      ctx.font = '600 26px monospace';
      ctx.fillText('CAMPAIGN VARIANT', 56, height - 290);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 60px "Inter Tight", sans-serif';
      ctx.fillText(adHeadline || 'Engineered for Night Miles.', 56, height - 220, width - 112);

      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.font = '400 32px "Inter Tight", sans-serif';
      ctx.fillText(adSubline || 'Zero-drag carbon plate · Limited Drop', 56, height - 156, width - 112);

      ctx.fillStyle = activeAccent.hex;
      ctx.fillRect(56, height - 106, 260, 62);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 28px "Inter Tight", sans-serif';
      ctx.fillText(`${adCta || 'Shop Drop'} →`, 84, height - 66);
    }

    triggerPngDownload(canvas, docName);
  };

  // Current active workspace metadata driven by `mode`
  const currentDocName =
    mode === 'poster'
      ? activePreset.docName
      : mode === 'layout'
        ? activeLayoutMeta.docName
        : activeAdMeta.docName;

  const currentRulerX =
    mode === 'poster'
      ? ['0', '200', '400', '600', '800', '1080 px']
      : mode === 'layout'
        ? activeLayoutMeta.rulerX
        : activeAdMeta.rulerX;

  const currentRulerY =
    mode === 'poster'
      ? ['0', '450', '900', '1350']
      : mode === 'layout'
        ? activeLayoutMeta.rulerY
        : activeAdMeta.rulerY;

  const guidesEnabled =
    mode === 'poster' ? showTransformBox : mode === 'layout' ? showGuides : showSafeZones;

  const guidesButtonLabel =
    mode === 'poster'
      ? `Transform Guides: ${showTransformBox ? 'ON' : 'OFF'}`
      : mode === 'layout'
        ? `12-Col Guides: ${showGuides ? 'ON' : 'OFF'}`
        : `Safe Zones: ${showSafeZones ? 'ON' : 'OFF'}`;

  const toggleModeGuides = () => {
    if (mode === 'poster') setShowTransformBox((v) => !v);
    else if (mode === 'layout') setShowGuides((v) => !v);
    else setShowSafeZones((v) => !v);
  };

  const handleActiveExport = () => {
    if (mode === 'poster') void exportPosterPng();
    else if (mode === 'layout') void exportLayoutPng();
    else void exportCampaignPng();
  };

  const renderPhotoshopStage = (artboard: ReactNode) => (
    <div className="lg:col-span-8 rounded-[16px] sm:rounded-[20px] bg-[#1e2025] border border-white/12 flex flex-col">
      {/* Photoshop Top Menu & Document Tab */}
      <div
        ref={menuBarRef}
        className="relative z-40 rounded-t-[16px] sm:rounded-t-[20px] bg-[#26282e] border-b border-black/40 px-2.5 sm:px-3 py-1.5 flex flex-wrap items-center justify-between gap-2"
      >
        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 min-w-0">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-6 h-6 mr-1.5 rounded-[6px] bg-[#001E36] border border-[#31A8FF]/40 text-[#31A8FF] font-bold text-[12px] tracking-[-0.03em] shrink-0"
          >
            Ps
          </span>

          {PS_MENU_LIST.map(({ id, label }) => {
            const isOpen = openPsMenu === id;
            return (
              <div key={id} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => setOpenPsMenu(isOpen ? null : id)}
                  onMouseEnter={() => {
                    if (openPsMenu && openPsMenu !== id) {
                      setOpenPsMenu(id);
                    }
                  }}
                  className={`px-2 py-1 rounded-[5px] text-[11px] transition-colors cursor-pointer select-none ${
                    isOpen
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </button>

                {isOpen && (
                  <div
                    role="menu"
                    aria-label={`${label} menu`}
                    className={`absolute top-full mt-1 w-[224px] rounded-[9px] bg-[#2b2e36] border border-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.65)] py-1.5 text-[11.5px] text-white z-50 ${
                      id === 'filter' || id === 'view'
                        ? 'right-0 sm:left-0 sm:right-auto'
                        : 'left-0'
                    }`}
                  >
                    {id === 'file' && (
                      <>
                        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                          {mode === 'poster'
                            ? 'Open Poster PSD'
                            : mode === 'layout'
                              ? 'Open Layout PSD'
                              : 'Open Ad Placement'}
                        </div>

                        {mode === 'poster' &&
                          (Object.keys(POSTER_PRESETS) as PosterPresetId[]).map((presetKey) => {
                            const preset = POSTER_PRESETS[presetKey];
                            const selected = posterPresetId === presetKey;
                            return (
                              <button
                                key={presetKey}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  applyPreset(presetKey);
                                  setOpenPsMenu(null);
                                  notifyAction(`Opened ${preset.docName}`);
                                }}
                                className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                              >
                                <span>{preset.shortName}</span>
                                {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                              </button>
                            );
                          })}

                        {mode === 'layout' &&
                          (Object.keys(LAYOUT_PRESETS) as LayoutPreset[]).map((layoutKey) => {
                            const meta = LAYOUT_PRESETS[layoutKey];
                            const selected = layoutPreset === layoutKey;
                            return (
                              <button
                                key={layoutKey}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  applyLayoutPreset(layoutKey);
                                  setOpenPsMenu(null);
                                }}
                                className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                              >
                                <span>{meta.shortName}</span>
                                {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                              </button>
                            );
                          })}

                        {mode === 'campaign' &&
                          (Object.keys(AD_FORMATS) as AdFormat[]).map((formatKey) => {
                            const meta = AD_FORMATS[formatKey];
                            const selected = adFormat === formatKey;
                            return (
                              <button
                                key={formatKey}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setAdFormat(formatKey);
                                  setOpenPsMenu(null);
                                  notifyAction(`Opened ${meta.docName}`);
                                }}
                                className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                              >
                                <span>{meta.shortName}</span>
                                {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                              </button>
                            );
                          })}

                        <div className="my-1 border-t border-white/10" />
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleActiveExport}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Download className="w-3 h-3" />
                            Export Artboard (.png)
                          </span>
                          <span className="font-mono text-[10px] text-white/50">⌘E</span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setOpenPsMenu(null);
                            onNavigate('quote');
                          }}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>Request Custom Quote</span>
                        </button>
                      </>
                    )}

                    {id === 'edit' && (
                      <>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            cycleAccent();
                            setOpenPsMenu(null);
                          }}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>Cycle Accent Palette</span>
                          <span className="font-mono text-[10px] text-white/50">⇧A</span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            toggleModeGuides();
                            setOpenPsMenu(null);
                          }}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>
                            {mode === 'poster'
                              ? 'Free Transform Box'
                              : mode === 'layout'
                                ? '12-Col Margin Guides'
                                : 'Meta / Reel Safe Zones'}
                          </span>
                          <span className="font-mono text-[10px] text-white/50">
                            {guidesEnabled ? 'ON' : 'OFF'}
                          </span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setActivePsTool('crop');
                            if (mode === 'poster') setShowTransformBox(true);
                            else if (mode === 'layout') setShowGuides(true);
                            else setShowSafeZones(true);
                            setOpenPsMenu(null);
                          }}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>Crop &amp; Safe Grid</span>
                          <span className="font-mono text-[10px] text-white/50">C</span>
                        </button>
                        <div className="my-1 border-t border-white/10" />
                        <button
                          type="button"
                          role="menuitem"
                          onClick={resetActiveStudio}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>Reset Workspace Defaults</span>
                          <span className="font-mono text-[10px] text-white/50">⌥R</span>
                        </button>
                      </>
                    )}

                    {id === 'image' && (
                      <>
                        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                          Color Lookup LUT &amp; Accent
                        </div>
                        {(Object.keys(ACCENTS) as AccentId[]).map((idKey) => {
                          const item = ACCENTS[idKey];
                          return (
                            <button
                              key={idKey}
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setAccentId(idKey);
                                if (mode === 'poster') {
                                  setPosterLayers((prev) => ({ ...prev, colorGrade: true }));
                                }
                                setOpenPsMenu(null);
                                notifyAction(`Accent: ${item.label}`);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span className="inline-flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${item.swatchClass}`} />
                                {item.label}
                              </span>
                              {accentId === idKey && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                        {mode === 'poster' && (
                          <>
                            <div className="my-1 border-t border-white/10" />
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setPosterLayers((prev) => ({
                                  ...prev,
                                  colorGrade: !prev.colorGrade,
                                }));
                                setOpenPsMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Color LUT Active</span>
                              {posterLayers.colorGrade && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {id === 'layer' && (
                      <>
                        {mode === 'poster' &&
                          [
                            { key: 'verticalWordmark' as const, label: 'Vertical Display Type' },
                            { key: 'editorialCopy' as const, label: 'Editorial Copy Block' },
                            { key: 'colorGrade' as const, label: 'Color Lookup Adjustment' },
                          ].map((layer) => (
                            <button
                              key={layer.key}
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setPosterLayers((prev) => ({
                                  ...prev,
                                  [layer.key]: !prev[layer.key],
                                }));
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>{layer.label}</span>
                              {posterLayers[layer.key] && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          ))}

                        {mode === 'layout' && (
                          <>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() =>
                                setLayoutLayers((prev) => ({ ...prev, copyLayer: !prev.copyLayer }))
                              }
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Editorial Copy Layer</span>
                              {layoutLayers.copyLayer && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() =>
                                setLayoutLayers((prev) => ({
                                  ...prev,
                                  photoLayer: !prev.photoLayer,
                                }))
                              }
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Product Photo Smart Object</span>
                              {layoutLayers.photoLayer && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => setShowGuides((v) => !v)}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>12-Column Baseline Grid</span>
                              {showGuides && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          </>
                        )}

                        {mode === 'campaign' && (
                          <>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() =>
                                setCampaignLayers((prev) => ({
                                  ...prev,
                                  headerBadge: !prev.headerBadge,
                                }))
                              }
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Sponsored Top Bar</span>
                              {campaignLayers.headerBadge && (
                                <Check className="w-3.5 h-3.5 shrink-0" />
                              )}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() =>
                                setCampaignLayers((prev) => ({
                                  ...prev,
                                  copyStack: !prev.copyStack,
                                }))
                              }
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Ad Headline &amp; CTA</span>
                              {campaignLayers.copyStack && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() =>
                                setCampaignLayers((prev) => ({
                                  ...prev,
                                  contrastScrim: !prev.contrastScrim,
                                }))
                              }
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Legibility Gradient Scrim</span>
                              {campaignLayers.contrastScrim && (
                                <Check className="w-3.5 h-3.5 shrink-0" />
                              )}
                            </button>
                          </>
                        )}

                        <div className="my-1 border-t border-white/10" />
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            if (mode === 'poster') {
                              setPosterLayers({
                                verticalWordmark: true,
                                editorialCopy: true,
                                colorGrade: true,
                              });
                            } else if (mode === 'layout') {
                              setLayoutLayers({ copyLayer: true, photoLayer: true });
                            } else {
                              setCampaignLayers({
                                headerBadge: true,
                                copyStack: true,
                                contrastScrim: true,
                              });
                            }
                            setOpenPsMenu(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          Show All Layers
                        </button>
                      </>
                    )}

                    {id === 'type' && (
                      <>
                        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                          {mode === 'poster'
                            ? 'Display Title Presets'
                            : mode === 'layout'
                              ? 'Editorial Heading Presets'
                              : 'Copy Hook Presets'}
                        </div>

                        {mode === 'poster' &&
                          QUICK_POSTER_NAMES.map((word) => (
                            <button
                              key={word}
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setVerticalTitle(word);
                                setPosterLayers((prev) => ({ ...prev, verticalWordmark: true }));
                                setOpenPsMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span className="font-mono">{word}</span>
                              {verticalTitle === word && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          ))}

                        {mode === 'layout' &&
                          QUICK_LAYOUT_NAMES.map((heading) => (
                            <button
                              key={heading}
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setLayoutHeading(heading);
                                setLayoutLayers((prev) => ({ ...prev, copyLayer: true }));
                                setOpenPsMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span className="truncate">{heading}</span>
                              {layoutHeading === heading && (
                                <Check className="w-3.5 h-3.5 shrink-0" />
                              )}
                            </button>
                          ))}

                        {mode === 'campaign' &&
                          (Object.keys(AD_COPY) as AdCopyVariant[]).map((variantKey) => (
                            <button
                              key={variantKey}
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                applyAdCopyVariant(variantKey);
                                setOpenPsMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>{AD_COPY[variantKey].label}</span>
                              {adCopyVariant === variantKey && (
                                <Check className="w-3.5 h-3.5 shrink-0" />
                              )}
                            </button>
                          ))}

                        <div className="my-1 border-t border-white/10" />
                        <button
                          type="button"
                          role="menuitem"
                          onClick={focusActiveTypeInput}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>
                            {mode === 'poster'
                              ? 'Edit Vertical Title'
                              : mode === 'layout'
                                ? 'Edit Layout Heading'
                                : 'Edit Ad Headline'}
                          </span>
                          <span className="font-mono text-[10px] text-white/50">T</span>
                        </button>
                      </>
                    )}

                    {id === 'filter' && (
                      <>
                        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                          Camera Raw Filter
                        </div>
                        {(Object.keys(FILTER_FX) as FilterFxId[]).map((fxKey) => (
                          <button
                            key={fxKey}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setFilterFx(fxKey);
                              setOpenPsMenu(null);
                              notifyAction(`Filter: ${FILTER_FX[fxKey].label}`);
                            }}
                            className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                          >
                            <span>{FILTER_FX[fxKey].label}</span>
                            {filterFx === fxKey && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        ))}
                      </>
                    )}

                    {id === 'view' && (
                      <>
                        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                          Canvas Zoom
                        </div>
                        {([85, 100, 108] as ZoomPct[]).map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setZoomPct(pct);
                              setOpenPsMenu(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                          >
                            <span>
                              {pct === 85
                                ? 'Fit Screen (85%)'
                                : pct === 100
                                  ? 'Actual Size (100%)'
                                  : 'Zoom In (108%)'}
                            </span>
                            {zoomPct === pct && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        ))}
                        <div className="my-1 border-t border-white/10" />
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setShowRulers((v) => !v);
                            setOpenPsMenu(null);
                          }}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>Pixel Rulers</span>
                          <span className="font-mono text-[10px] text-white/50">
                            {showRulers ? '⌘R ✓' : '⌘R'}
                          </span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            toggleModeGuides();
                            setOpenPsMenu(null);
                          }}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                        >
                          <span>
                            {mode === 'poster'
                              ? 'Transform Guides'
                              : mode === 'layout'
                                ? '12-Col Grid Guides'
                                : 'Meta & Reel Safe Zones'}
                          </span>
                          <span className="font-mono text-[10px] text-white/50">
                            {guidesEnabled ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#1a1c20] border border-white/10 text-[11px] font-mono text-white/80 max-w-full truncate">
          <span className="truncate">{currentDocName}</span>
          <span className="text-white/40 shrink-0">@ {zoomPct}%</span>
        </div>
      </div>

      {/* Photoshop Secondary Options Bar */}
      <div className="bg-[#22242a] border-b border-black/35 px-3 py-1.5 flex items-center justify-between gap-2 text-[11px] text-white/60">
        <div className="flex items-center gap-3 min-w-0 truncate">
          <span className="font-mono text-white/85 shrink-0">
            {PS_TOOLS.find((t) => t.id === activePsTool)?.label} (
            {PS_TOOLS.find((t) => t.id === activePsTool)?.shortcut})
          </span>
          <span className="hidden sm:inline text-white/40">·</span>
          <span className="hidden sm:inline truncate text-white/70">
            {statusNotice ?? `Filter: ${FILTER_FX[filterFx].label} · Blend: Normal · 100%`}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleModeGuides}
          className={`shrink-0 px-2 py-0.5 rounded text-[10.5px] font-mono transition-colors cursor-pointer ${
            guidesEnabled
              ? 'bg-[#3b82f6]/20 text-[#93c5fd] border border-[#3b82f6]/40'
              : 'bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          {guidesButtonLabel}
        </button>
      </div>

      {/* Photoshop Main Body: Left Tool Dock + Rulers + Centered Artboard */}
      <div className="flex-1 flex min-h-[390px] sm:min-h-[460px] rounded-b-[16px] sm:rounded-b-[20px] overflow-hidden">
        {/* Left Vertical Tool Dock */}
        <div
          role="toolbar"
          aria-label="Photoshop canvas tools"
          className="w-[36px] sm:w-[42px] shrink-0 bg-[#25272d] border-r border-black/40 py-2.5 flex flex-col items-center justify-between"
        >
          <div className="flex flex-col items-center gap-1">
            {PS_TOOLS.map(({ id, label, shortcut, Icon }) => {
              const selected = activePsTool === id;
              return (
                <button
                  key={id}
                  type="button"
                  title={`${label} (${shortcut})`}
                  aria-label={label}
                  aria-pressed={selected}
                  onClick={() => {
                    setActivePsTool(id);
                    if (id === 'zoom') {
                      setZoomPct((prev) => (prev === 108 ? 100 : 108));
                    } else if (id === 'type') {
                      focusActiveTypeInput();
                    }
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[6px] flex items-center justify-center transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#3b3f48] text-white ring-1 ring-white/20'
                      : 'text-white/55 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="relative w-6 h-6 mt-3"
            title={`Foreground ${activeAccent.hex}`}
          >
            <span className="absolute right-0 bottom-0 w-3.5 h-3.5 rounded-[2px] bg-white border border-black/50" />
            <span
              className="absolute left-0 top-0 w-3.5 h-3.5 rounded-[2px] border border-white/60 shadow-sm"
              style={{ backgroundColor: activeAccent.hex }}
            />
          </div>
        </div>

        {/* Rulers + Centered Dark Pasteboard */}
        <div className="flex-1 flex flex-col bg-[#16181d] overflow-hidden">
          {showRulers && (
            <div
              aria-hidden="true"
              className="h-[18px] bg-[#202228] border-b border-black/40 pl-[18px] px-3 flex items-center justify-between font-mono text-[8.5px] text-white/35 select-none"
            >
              {currentRulerX.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
          )}

          <div className="flex-1 flex relative overflow-hidden">
            {showRulers && (
              <div
                aria-hidden="true"
                className="w-[18px] shrink-0 bg-[#202228] border-r border-black/40 py-3 flex flex-col items-center justify-between font-mono text-[8px] text-white/35 select-none"
              >
                {currentRulerY.map((tick, idx) => (
                  <span key={tick} className={idx > 0 ? '-rotate-90' : ''}>
                    {tick}
                  </span>
                ))}
              </div>
            )}

            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-7 overflow-hidden bg-[radial-gradient(#242730_1px,transparent_1px)] [background-size:16px_16px]">
              <div
                className={`transition-transform duration-300 ${
                  zoomPct === 85
                    ? 'scale-[0.88]'
                    : zoomPct === 108
                      ? 'scale-[1.06]'
                      : 'scale-100'
                }`}
              >
                {artboard}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="creative-studio"
      aria-label="X.MAX poster design, layout design, and ad campaign studio"
      className="px-[12px] pt-[12px] pb-[64px] md:px-[40px] md:pt-[20px] md:pb-[96px] lg:px-[calc(68*var(--u))] lg:pb-[calc(110*var(--u))]"
    >
      <div className="mx-auto w-full max-w-[1360px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-[#12151b] text-white rounded-[20px] sm:rounded-[26px] md:rounded-[34px] lg:rounded-[calc(44*var(--u))] p-4 sm:p-6 md:p-8"
          style={{
            boxShadow:
              '0 40px 70px rgba(40,60,110,.22), 0 6px 14px rgba(20,30,60,.18)',
          }}
        >
          {/* Top Studio Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div
              role="tablist"
              aria-label="Creative studio discipline preview"
              className="w-full md:w-auto max-w-full overflow-x-auto no-scrollbar flex items-center gap-1 p-1 bg-white/[0.06] rounded-[12px]"
            >
              {[
                { id: 'poster' as const, label: 'Poster Design', Icon: Sparkles },
                { id: 'layout' as const, label: 'Layout Editing', Icon: Grid3X3 },
                { id: 'campaign' as const, label: 'Ad Campaign', Icon: Megaphone },
              ].map(({ id, label, Icon }) => {
                const active = mode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchMode(id)}
                    className={`relative whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-[9px] text-[13px] sm:text-[13.5px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      active ? 'text-[#12151b]' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="studio-showcase-tab"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 bg-white rounded-[9px]"
                      />
                    )}
                    <Icon className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Contextual Studio Spec Readout */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 text-[12px] font-mono text-white/55 tabular-nums">
              {mode === 'poster' && (
                <>
                  <span>Ps · {activePreset.docName}</span>
                  <span className="text-[#ff5512]">
                    {zoomPct}% · {FILTER_FX[filterFx].label} · 1080×1350
                  </span>
                </>
              )}
              {mode === 'layout' && (
                <>
                  <span>Ps · {activeLayoutMeta.docName}</span>
                  <span className="text-[#ff5512]">
                    {zoomPct}% · {FILTER_FX[filterFx].label} · {activeLayoutMeta.dims}
                  </span>
                </>
              )}
              {mode === 'campaign' && (
                <>
                  <span>Ps · {activeAdMeta.docName}</span>
                  <span className="text-[#ff5512]">
                    {zoomPct}% · {FILTER_FX[filterFx].label} · {activeAdMeta.channel}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Workspace Body */}
          <div className="mt-5 sm:mt-6">
            <AnimatePresence mode="wait">
              {mode === 'poster' && (
                <motion.div
                  key="studio-poster"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
                >
                  {renderPhotoshopStage(
                    <div className="relative w-[232px] sm:w-[286px] md:w-[314px] aspect-[4/5] shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
                      {/* Live Editable Poster Artboard over Clean Text-Free Photography */}
                      <div className="relative w-full h-full overflow-hidden select-none bg-[#10131a]">
                        <div className={`absolute inset-0 transition-[filter] duration-200 ${FILTER_FX[filterFx].twClass}`}>
                          {!imgFailed[posterPresetId] ? (
                            <img
                              src={activePreset.image}
                              alt={`${activePreset.shortName} studio background for live poster editing`}
                              onError={() =>
                                setImgFailed((p) => ({
                                  ...p,
                                  [posterPresetId]: true,
                                }))
                              }
                              className={`absolute inset-0 w-full h-full object-cover transition-[filter] duration-200 ${
                                activePreset.objectPosClass
                              } ${posterLayers.colorGrade ? activeAccent.filterClass : ''}`}
                              draggable={false}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                          )}
                        </div>

                        {/* Balanced Scrims for Sharp Typography Contrast */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background: activePreset.bottomDark
                              ? 'linear-gradient(90deg, rgba(10,13,20,0.58) 0%, rgba(10,13,20,0.12) 52%, rgba(10,13,20,0.08) 100%)'
                              : 'linear-gradient(180deg, rgba(20,14,4,0.22) 0%, rgba(255,255,255,0) 48%)',
                          }}
                        />

                        {/* Vertical Giant Display Wordmark */}
                        {posterLayers.verticalWordmark && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute top-[3%] bottom-[3%] right-[2.5%] w-[34%] flex items-center justify-center overflow-hidden"
                          >
                            <span
                              className="font-archivo uppercase text-[50px] sm:text-[64px] md:text-[70px] leading-[0.82] tracking-[-0.04em] whitespace-nowrap origin-center rotate-90"
                              style={{
                                color: activePreset.verticalLightInk
                                  ? 'rgba(255,255,255,0.92)'
                                  : 'rgba(17,20,24,0.88)',
                                WebkitTextStroke: activePreset.verticalLightInk
                                  ? `1.5px ${activeAccent.hex}`
                                  : '1.5px rgba(255,255,255,0.85)',
                                textShadow: activePreset.verticalLightInk
                                  ? '0 8px 24px rgba(0,0,0,0.35)'
                                  : '0 8px 20px rgba(255,255,255,0.25)',
                              }}
                            >
                              {verticalTitle || 'STUDIO'}
                            </span>
                          </div>
                        )}

                        {/* Left Column Editorial Typography Stack */}
                        {posterLayers.editorialCopy && (
                          <div className="relative z-10 h-full w-[64%] p-3.5 sm:p-4 flex flex-col justify-between">
                            <div className={activePreset.topDark ? 'text-white' : 'text-[#111418]'}>
                              <p className="font-archivo uppercase text-[15px] sm:text-[18px] leading-[0.95] tracking-[-0.03em] drop-shadow-sm">
                                {kickerTop || 'NEW'}
                              </p>
                              <p
                                className="font-archivo uppercase text-[15px] sm:text-[18px] leading-[0.95] tracking-[-0.03em] drop-shadow-sm"
                                style={{ color: activeAccent.hex }}
                              >
                                {kickerBottom || 'COLLECTION'}
                              </p>
                            </div>

                            <div
                              className={`space-y-1.5 sm:space-y-2 ${
                                activePreset.bottomDark ? 'text-white' : 'text-[#111418]'
                              }`}
                            >
                              <div className="font-inter-tight font-light text-[14px] sm:text-[17px] leading-[1.05] tracking-[-0.02em] uppercase">
                                <p>{activePreset.mottoLine1}</p>
                                <p>{activePreset.mottoLine2}</p>
                                <p
                                  className="font-semibold"
                                  style={{ color: activeAccent.hex }}
                                >
                                  {mottoHighlight || 'BE YOU.'}
                                </p>
                              </div>

                              <div
                                className="w-16 h-[1.5px]"
                                style={{ backgroundColor: activeAccent.hex }}
                              />

                              <p
                                className={`text-[7.5px] sm:text-[8.5px] font-bold uppercase leading-[1.2] tracking-[0.02em] max-w-[20ch] ${
                                  activePreset.bottomDark
                                    ? 'text-white/85'
                                    : 'text-[#111418]/80'
                                }`}
                              >
                                {activePreset.caption}
                              </p>

                              <div className="pt-0.5 sm:pt-1">
                                <p
                                  className="font-archivo text-[16px] sm:text-[20px] leading-[0.9] tracking-[-0.04em]"
                                  style={{ color: activeAccent.hex }}
                                >
                                  {posterYear || '2026'}
                                </p>
                                <p className="font-mono text-[7px] uppercase tracking-[0.08em] opacity-75">
                                  COLLECTION
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Transform Bounding Box / Crop Grid */}
                      {showTransformBox && (
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                          {activePsTool === 'crop' ? (
                            <div className="absolute inset-0 border-2 border-white/85 grid grid-cols-3 grid-rows-3">
                              {Array.from({ length: 9 }).map((_, idx) => (
                                <span key={idx} className="border border-white/25" />
                              ))}
                            </div>
                          ) : (
                            <div className="absolute top-[3%] bottom-[3%] right-[2.5%] w-[34%] border border-[#3b82f6]">
                              <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#3b82f6]" />
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#3b82f6]" />
                              <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#3b82f6]" />
                              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#3b82f6]" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right Inspector: Poster Design Settings */}
                  <div className="lg:col-span-4 rounded-[16px] sm:rounded-[20px] bg-white/[0.04] border border-white/8 p-4 sm:p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-white">
                          <Layers className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
                          <span>Poster Properties</span>
                        </div>
                        <button
                          type="button"
                          onClick={resetActiveStudio}
                          aria-label="Reset poster design settings"
                          className="inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-white transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" aria-hidden="true" />
                          Reset
                        </button>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-mono text-white/50 mb-2">
                          Studio Background
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(Object.keys(POSTER_PRESETS) as PosterPresetId[]).map((id) => {
                            const p = POSTER_PRESETS[id];
                            const active = posterPresetId === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => applyPreset(id)}
                                className={`px-2 py-2 rounded-[9px] text-[12px] font-medium text-center transition-colors cursor-pointer truncate ${
                                  active
                                    ? 'bg-[#ff5512] text-white'
                                    : 'bg-white/[0.06] text-white/75 hover:bg-white/[0.1] hover:text-white'
                                }`}
                              >
                                {p.shortName}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <div>
                          <label
                            htmlFor="poster-vertical-title"
                            className="block text-[11.5px] font-mono text-white/55 mb-1"
                          >
                            Poster Display Name (Vertical)
                          </label>
                          <input
                            ref={titleInputRef}
                            id="poster-vertical-title"
                            type="text"
                            value={verticalTitle}
                            onChange={(e) =>
                              setVerticalTitle(e.target.value.toUpperCase().slice(0, 12))
                            }
                            placeholder="VELOCITY"
                            className="w-full h-[36px] px-3 rounded-[9px] bg-[#0e1015] border border-white/12 text-[13px] font-medium text-white tracking-[0.03em] focus:outline-none focus:border-[#ff5512] transition-colors"
                          />
                          <div className="mt-1.5 grid grid-cols-4 gap-1">
                            {QUICK_POSTER_NAMES.map((presetWord) => (
                              <button
                                key={presetWord}
                                type="button"
                                onClick={() => setVerticalTitle(presetWord)}
                                className={`py-1 rounded-[6px] text-[10.5px] font-mono transition-colors cursor-pointer truncate ${
                                  verticalTitle === presetWord
                                    ? 'bg-white text-[#12151b] font-semibold'
                                    : 'bg-white/[0.05] text-white/60 hover:text-white'
                                }`}
                              >
                                {presetWord}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label
                              htmlFor="poster-kicker-top"
                              className="block text-[11px] font-mono text-white/50 mb-1"
                            >
                              Header Line 1
                            </label>
                            <input
                              id="poster-kicker-top"
                              type="text"
                              value={kickerTop}
                              onChange={(e) =>
                                setKickerTop(e.target.value.toUpperCase().slice(0, 14))
                              }
                              placeholder="NEW"
                              className="w-full h-[34px] px-2.5 rounded-[8px] bg-[#0e1015] border border-white/12 text-[12px] text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="poster-kicker-bottom"
                              className="block text-[11px] font-mono text-white/50 mb-1"
                            >
                              Collection Name
                            </label>
                            <input
                              id="poster-kicker-bottom"
                              type="text"
                              value={kickerBottom}
                              onChange={(e) =>
                                setKickerBottom(e.target.value.toUpperCase().slice(0, 16))
                              }
                              placeholder="COLLECTION"
                              className="w-full h-[34px] px-2.5 rounded-[8px] bg-[#0e1015] border border-white/12 text-[12px] text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label
                              htmlFor="poster-highlight"
                              className="block text-[11px] font-mono text-white/50 mb-1"
                            >
                              Tagline Accent
                            </label>
                            <input
                              id="poster-highlight"
                              type="text"
                              value={mottoHighlight}
                              onChange={(e) =>
                                setMottoHighlight(e.target.value.toUpperCase().slice(0, 14))
                              }
                              placeholder="GO FIRST."
                              className="w-full h-[34px] px-2.5 rounded-[8px] bg-[#0e1015] border border-white/12 text-[12px] text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="poster-year"
                              className="block text-[11px] font-mono text-white/50 mb-1"
                            >
                              Year
                            </label>
                            <input
                              id="poster-year"
                              type="text"
                              value={posterYear}
                              onChange={(e) => setPosterYear(e.target.value.slice(0, 8))}
                              placeholder="2026"
                              className="w-full h-[34px] px-2.5 rounded-[8px] bg-[#0e1015] border border-white/12 text-[12px] font-mono tabular-nums text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-mono text-white/50 mb-2">
                          Accent Ink &amp; Color LUT
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(Object.keys(ACCENTS) as AccentId[]).map((id) => {
                            const item = ACCENTS[id];
                            const selected = accentId === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setAccentId(id)}
                                title={item.label}
                                aria-label={item.label}
                                className={`flex items-center justify-center gap-1.5 h-[32px] rounded-[8px] border transition-colors cursor-pointer ${
                                  selected
                                    ? 'border-white bg-white/12'
                                    : 'border-white/10 bg-white/[0.04] hover:border-white/30'
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full ${item.swatchClass}`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {[
                          { key: 'verticalWordmark' as const, label: 'Vertical Display Type' },
                          { key: 'editorialCopy' as const, label: 'Editorial Copy Block' },
                          { key: 'colorGrade' as const, label: 'Color Lookup Adjustment' },
                        ].map((layer) => {
                          const enabled = posterLayers[layer.key];
                          return (
                            <button
                              key={layer.key}
                              type="button"
                              onClick={() =>
                                setPosterLayers((prev) => ({
                                  ...prev,
                                  [layer.key]: !prev[layer.key],
                                }))
                              }
                              aria-pressed={enabled}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[12px] transition-colors cursor-pointer ${
                                enabled
                                  ? 'bg-white/[0.07] text-white'
                                  : 'bg-white/[0.02] text-white/40 hover:text-white/75'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <Eye
                                  className={`w-3.5 h-3.5 ${
                                    enabled ? 'text-[#ff5512]' : 'text-white/25'
                                  }`}
                                  aria-hidden="true"
                                />
                                {layer.label}
                              </span>
                              <span className="font-mono text-[10.5px] text-white/45">
                                {enabled ? 'Visible' : 'Hidden'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-white/60">
                      <span>Poster &amp; Campaign Print</span>
                      <button
                        type="button"
                        onClick={() => onNavigate('pricing')}
                        className="text-white hover:text-[#ff5512] font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        From ₹800 →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {mode === 'layout' && (
                <motion.div
                  key="studio-layout"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
                >
                  {renderPhotoshopStage(
                    <div
                      className={`relative bg-[#ebe6de] text-[#111418] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.65)] transition-all duration-300 ${
                        layoutPreset === 'spread'
                          ? 'w-[280px] sm:w-[440px] md:w-[500px] aspect-[16/10]'
                          : layoutPreset === 'poster'
                            ? 'w-[225px] sm:w-[270px] md:w-[290px] aspect-[3/4]'
                            : 'w-[270px] sm:w-[375px] md:w-[410px] aspect-[4/3]'
                      }`}
                    >
                      {layoutPreset === 'spread' ? (
                        <div className="grid grid-cols-12 h-full">
                          <div className="col-span-6 p-3.5 sm:p-5 flex flex-col justify-between border-r border-black/10">
                            {layoutLayers.copyLayer ? (
                              <>
                                <div
                                  className="text-[8px] sm:text-[9.5px] font-mono uppercase tracking-[0.08em] truncate"
                                  style={{ color: activeAccent.hex }}
                                >
                                  {layoutTag || '01 · Botanical Formulation'}
                                </div>
                                <div>
                                  <h3 className="text-[18px] sm:text-[24px] font-medium tracking-[-0.03em] leading-[1.0] text-[#111418]">
                                    {layoutHeading || 'Aurum Rituals.'}
                                  </h3>
                                  <p className="mt-1.5 sm:mt-2.5 text-[9.5px] sm:text-[11px] leading-[1.4] text-[#111418]/70 max-w-[24ch]">
                                    Print &amp; digital editorial layouts structured around crisp
                                    baseline rhythm and product clarity.
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] font-mono text-[#111418]/50 pt-2 border-t border-black/10">
                                  <span>12-Col Grid</span>
                                  <span>Spread A4</span>
                                </div>
                              </>
                            ) : (
                              <div className="h-full" />
                            )}
                          </div>
                          <div
                            className={`col-span-6 relative overflow-hidden bg-[#d8d0c3] ${FILTER_FX[filterFx].twClass}`}
                          >
                            {layoutLayers.photoLayer && !imgFailed.skincareLayout && (
                              <img
                                src={skincarePhoto}
                                alt="Aurum amber skincare serum bottle on travertine plinth editorial spread"
                                onError={() =>
                                  setImgFailed((p) => ({ ...p, skincareLayout: true }))
                                }
                                className={`w-full h-full object-cover ${activeAccent.filterClass}`}
                                draggable={false}
                              />
                            )}
                          </div>
                        </div>
                      ) : layoutPreset === 'poster' ? (
                        <div className="relative h-full flex flex-col justify-between p-3.5 sm:p-4">
                          {layoutLayers.copyLayer && (
                            <div className="relative z-10 flex items-center justify-between text-[8.5px] font-mono uppercase tracking-[0.08em] text-[#111418]/80">
                              <span className="truncate">{layoutTag || 'Vol. 04'}</span>
                              <span style={{ color: activeAccent.hex }}>Editorial</span>
                            </div>
                          )}
                          <div
                            className={`relative flex-1 my-2.5 overflow-hidden rounded-[4px] bg-[#d8d0c3] ${FILTER_FX[filterFx].twClass}`}
                          >
                            {layoutLayers.photoLayer && !imgFailed.skincareLayout && (
                              <img
                                src={skincarePhoto}
                                alt="Luxury packaging poster layout showcase"
                                onError={() =>
                                  setImgFailed((p) => ({ ...p, skincareLayout: true }))
                                }
                                className={`w-full h-full object-cover ${activeAccent.filterClass}`}
                                draggable={false}
                              />
                            )}
                          </div>
                          {layoutLayers.copyLayer && (
                            <div className="relative z-10 flex items-end justify-between gap-2">
                              <h3 className="text-[16px] sm:text-[20px] font-medium tracking-[-0.025em] leading-none truncate">
                                {layoutHeading || 'Stone & Amber'}
                              </h3>
                              <span
                                className="font-mono text-[8.5px] shrink-0"
                                style={{ color: activeAccent.hex }}
                              >
                                300 DPI
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-12 h-full p-3.5 sm:p-4 gap-3 bg-[#f3efe8]">
                          <div
                            className={`col-span-7 relative overflow-hidden rounded-[4px] bg-[#d8d0c3] ${FILTER_FX[filterFx].twClass}`}
                          >
                            {layoutLayers.photoLayer && !imgFailed.skincareLayout && (
                              <img
                                src={skincarePhoto}
                                alt="Product spec sheet packaging layout"
                                onError={() =>
                                  setImgFailed((p) => ({ ...p, skincareLayout: true }))
                                }
                                className={`w-full h-full object-cover ${activeAccent.filterClass}`}
                                draggable={false}
                              />
                            )}
                          </div>
                          <div className="col-span-5 flex flex-col justify-between py-1">
                            {layoutLayers.copyLayer && (
                              <>
                                <div>
                                  <span
                                    className="font-mono text-[8.5px] uppercase block truncate"
                                    style={{ color: activeAccent.hex }}
                                  >
                                    {layoutTag || 'Spec · 30ml'}
                                  </span>
                                  <h3 className="mt-1 text-[14px] sm:text-[18px] font-medium tracking-[-0.02em] leading-[1.08]">
                                    {layoutHeading || 'Botanical Serum Dieline'}
                                  </h3>
                                </div>
                                <div className="space-y-1 text-[8.5px] sm:text-[10px] font-mono text-[#111418]/70 border-t border-black/10 pt-2">
                                  <div className="flex justify-between">
                                    <span>Bleed</span>
                                    <span>3.0 mm</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Foil</span>
                                    <span>Spot Matte</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Ink</span>
                                    <span>CMYK Coated</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {(showGuides || activePsTool === 'crop') && (
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                          {activePsTool === 'crop' ? (
                            <div className="absolute inset-0 border-2 border-[#3b82f6] grid grid-cols-3 grid-rows-3">
                              {Array.from({ length: 9 }).map((_, idx) => (
                                <span key={idx} className="border border-[#3b82f6]/35" />
                              ))}
                            </div>
                          ) : (
                            <>
                              <div
                                className="absolute inset-3 sm:inset-4 border"
                                style={{ borderColor: `${activeAccent.hex}99` }}
                              />
                              <div className="absolute inset-x-3 sm:inset-x-4 inset-y-0 grid grid-cols-12 gap-1 sm:gap-1.5">
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="h-full bg-[#2563eb]/[0.08] border-x border-[#2563eb]/20"
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right Inspector Panel: Layout Controls */}
                  <div className="lg:col-span-4 rounded-[16px] sm:rounded-[20px] bg-white/[0.04] border border-white/8 p-4 sm:p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-white">
                          <Grid3X3 className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
                          <span>Layout Properties</span>
                        </div>
                        <button
                          type="button"
                          onClick={resetActiveStudio}
                          aria-label="Reset layout workspace"
                          className="inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-white transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" aria-hidden="true" />
                          Reset
                        </button>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-mono text-white/50 mb-2">
                          Print &amp; Editorial Format
                        </p>
                        <div className="space-y-1.5">
                          {(Object.keys(LAYOUT_PRESETS) as LayoutPreset[]).map((optKey) => {
                            const opt = LAYOUT_PRESETS[optKey];
                            const selected = layoutPreset === optKey;
                            return (
                              <button
                                key={optKey}
                                type="button"
                                onClick={() => applyLayoutPreset(optKey)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-[9px] text-left transition-colors cursor-pointer ${
                                  selected
                                    ? 'bg-[#ff5512] text-white'
                                    : 'bg-white/[0.06] text-white/75 hover:bg-white/[0.1]'
                                }`}
                              >
                                <span className="text-[12.5px] font-medium">{opt.title}</span>
                                <span
                                  className={`font-mono text-[10.5px] tabular-nums ${
                                    selected ? 'text-white/90' : 'text-white/45'
                                  }`}
                                >
                                  {opt.spec}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label
                            htmlFor="layout-heading-input"
                            className="block text-[11.5px] font-mono text-white/55 mb-1"
                          >
                            Layout Heading
                          </label>
                          <input
                            ref={layoutHeadingInputRef}
                            id="layout-heading-input"
                            type="text"
                            value={layoutHeading}
                            onChange={(e) => setLayoutHeading(e.target.value.slice(0, 28))}
                            placeholder="Aurum Rituals."
                            className="w-full h-[36px] px-3 rounded-[9px] bg-[#0e1015] border border-white/12 text-[13px] font-medium text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="layout-tag-input"
                            className="block text-[11px] font-mono text-white/50 mb-1"
                          >
                            Section Label
                          </label>
                          <input
                            id="layout-tag-input"
                            type="text"
                            value={layoutTag}
                            onChange={(e) => setLayoutTag(e.target.value.slice(0, 28))}
                            placeholder="01 · Botanical Formulation"
                            className="w-full h-[34px] px-2.5 rounded-[8px] bg-[#0e1015] border border-white/12 text-[12px] text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-mono text-white/50 mb-2">
                          Accent Palette
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(Object.keys(ACCENTS) as AccentId[]).map((id) => {
                            const item = ACCENTS[id];
                            const selected = accentId === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setAccentId(id)}
                                title={item.label}
                                aria-label={item.label}
                                className={`flex items-center justify-center h-[32px] rounded-[8px] border transition-colors cursor-pointer ${
                                  selected
                                    ? 'border-white bg-white/12'
                                    : 'border-white/10 bg-white/[0.04] hover:border-white/30'
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full ${item.swatchClass}`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => setShowGuides((v) => !v)}
                          aria-pressed={showGuides}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[12px] transition-colors cursor-pointer ${
                            showGuides
                              ? 'bg-white/[0.07] text-white'
                              : 'bg-white/[0.02] text-white/40 hover:text-white/75'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Eye
                              className={`w-3.5 h-3.5 ${
                                showGuides ? 'text-[#ff5512]' : 'text-white/25'
                              }`}
                              aria-hidden="true"
                            />
                            12-Column Margin Grid
                          </span>
                          <span className="font-mono text-[10.5px] text-white/45">
                            {showGuides ? 'Visible' : 'Hidden'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setLayoutLayers((p) => ({ ...p, copyLayer: !p.copyLayer }))
                          }
                          aria-pressed={layoutLayers.copyLayer}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[12px] transition-colors cursor-pointer ${
                            layoutLayers.copyLayer
                              ? 'bg-white/[0.07] text-white'
                              : 'bg-white/[0.02] text-white/40 hover:text-white/75'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Eye
                              className={`w-3.5 h-3.5 ${
                                layoutLayers.copyLayer ? 'text-[#ff5512]' : 'text-white/25'
                              }`}
                              aria-hidden="true"
                            />
                            Editorial Copy Layer
                          </span>
                          <span className="font-mono text-[10.5px] text-white/45">
                            {layoutLayers.copyLayer ? 'Visible' : 'Hidden'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-white/60">
                      <span>Brochures, Decks &amp; Packaging</span>
                      <button
                        type="button"
                        onClick={() => onNavigate('pricing')}
                        className="text-white hover:text-[#ff5512] font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        View Design Rates →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {mode === 'campaign' && (
                <motion.div
                  key="studio-campaign"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
                >
                  {renderPhotoshopStage(
                    <div
                      className={`relative overflow-hidden bg-[#14171d] border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.65)] transition-all duration-300 ${activeAdMeta.ratioClass}`}
                    >
                      <div
                        className={`absolute inset-0 transition-[filter] duration-200 ${FILTER_FX[filterFx].twClass}`}
                      >
                        {!imgFailed.sneakerAd ? (
                          <img
                            src={sneakerPhoto}
                            alt="Commercial sneaker performance ad campaign creative"
                            onError={() =>
                              setImgFailed((p) => ({ ...p, sneakerAd: true }))
                            }
                            className={`w-full h-full object-cover ${activeAccent.filterClass}`}
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1f242e] to-[#0b0d11]" />
                        )}
                      </div>

                      {campaignLayers.contrastScrim && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35"
                        />
                      )}

                      {(showSafeZones || activePsTool === 'crop') && (
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                          {activePsTool === 'crop' ? (
                            <div className="absolute inset-0 border-2 border-[#3b82f6] grid grid-cols-3 grid-rows-3">
                              {Array.from({ length: 9 }).map((_, idx) => (
                                <span key={idx} className="border border-[#3b82f6]/35" />
                              ))}
                            </div>
                          ) : (
                            <>
                              <div
                                className="absolute inset-x-0 top-0 h-[12%] border-b border-dashed flex items-center justify-center"
                                style={{
                                  borderColor: `${activeAccent.hex}b3`,
                                  backgroundColor: `${activeAccent.hex}14`,
                                }}
                              >
                                <span className="font-mono text-[8.5px] text-white/80 tracking-[0.06em] uppercase">
                                  Header Safe Zone
                                </span>
                              </div>
                              <div
                                className="absolute inset-x-0 bottom-0 h-[16%] border-t border-dashed"
                                style={{
                                  borderColor: `${activeAccent.hex}b3`,
                                  backgroundColor: `${activeAccent.hex}14`,
                                }}
                              />
                            </>
                          )}
                        </div>
                      )}

                      {campaignLayers.headerBadge && (
                        <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-white/85">
                          <span>Sponsored · X.MAX</span>
                          <span>{activeAdMeta.dims}</span>
                        </div>
                      )}

                      {campaignLayers.copyStack && (
                        <div className="absolute bottom-3.5 left-3.5 right-3.5">
                          <p
                            className="font-mono text-[9.5px] tracking-[0.05em] uppercase"
                            style={{ color: activeAccent.hex }}
                          >
                            Campaign Variant
                          </p>
                          <h3 className="mt-0.5 text-[16px] sm:text-[20px] font-semibold tracking-[-0.02em] leading-[1.08] text-white">
                            {adHeadline || 'Engineered for Night Miles.'}
                          </h3>
                          <p className="mt-1 text-[10.5px] sm:text-[11.5px] text-white/75 line-clamp-2">
                            {adSubline || 'Zero-drag carbon plate · Limited Drop'}
                          </p>
                          <div
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-white text-[11px] font-medium"
                            style={{ backgroundColor: activeAccent.hex }}
                          >
                            <span>{adCta || 'Shop Drop'}</span>
                            <ArrowRight className="w-3 h-3" aria-hidden="true" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right Inspector Panel: Ad Placement & Copy Controls */}
                  <div className="lg:col-span-4 rounded-[16px] sm:rounded-[20px] bg-white/[0.04] border border-white/8 p-4 sm:p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-white">
                          <Megaphone className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
                          <span>Ad Placement &amp; Copy</span>
                        </div>
                        <button
                          type="button"
                          onClick={resetActiveStudio}
                          aria-label="Reset ad campaign workspace"
                          className="inline-flex items-center gap-1 text-[12px] text-white/55 hover:text-white transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" aria-hidden="true" />
                          Reset
                        </button>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-mono text-white/50 mb-2">
                          Channel Aspect Ratio
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(Object.keys(AD_FORMATS) as AdFormat[]).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setAdFormat(key)}
                              className={`py-2 px-2 rounded-[9px] text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                adFormat === key
                                  ? 'bg-[#ff5512] text-white'
                                  : 'bg-white/[0.06] text-white/70 hover:text-white'
                              }`}
                            >
                              {AD_FORMATS[key].label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-mono text-white/50 mb-2">
                          Copy Hook Preset
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(Object.keys(AD_COPY) as AdCopyVariant[]).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => applyAdCopyVariant(key)}
                              className={`px-2 py-2 rounded-[8px] text-[11px] font-medium text-center transition-colors cursor-pointer truncate ${
                                adCopyVariant === key
                                  ? 'bg-white text-[#12151b] font-semibold'
                                  : 'bg-white/[0.05] text-white/70 hover:text-white'
                              }`}
                            >
                              {AD_COPY[key].label.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label
                            htmlFor="campaign-headline-input"
                            className="block text-[11.5px] font-mono text-white/55 mb-1"
                          >
                            Ad Headline
                          </label>
                          <input
                            ref={adHeadlineInputRef}
                            id="campaign-headline-input"
                            type="text"
                            value={adHeadline}
                            onChange={(e) => setAdHeadline(e.target.value.slice(0, 38))}
                            placeholder="Engineered for Night Miles."
                            className="w-full h-[36px] px-3 rounded-[9px] bg-[#0e1015] border border-white/12 text-[13px] font-medium text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label
                              htmlFor="campaign-subline-input"
                              className="block text-[11px] font-mono text-white/50 mb-1"
                            >
                              Subline
                            </label>
                            <input
                              id="campaign-subline-input"
                              type="text"
                              value={adSubline}
                              onChange={(e) => setAdSubline(e.target.value.slice(0, 48))}
                              placeholder="Zero-drag carbon plate"
                              className="w-full h-[34px] px-2.5 rounded-[8px] bg-[#0e1015] border border-white/12 text-[12px] text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="campaign-cta-input"
                              className="block text-[11px] font-mono text-white/50 mb-1"
                            >
                              CTA Button
                            </label>
                            <input
                              id="campaign-cta-input"
                              type="text"
                              value={adCta}
                              onChange={(e) => setAdCta(e.target.value.slice(0, 14))}
                              placeholder="Shop Drop"
                              className="w-full h-[34px] px-2.5 rounded-[8px] bg-[#0e1015] border border-white/12 text-[12px] text-white focus:outline-none focus:border-[#ff5512] transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-mono text-white/50 mb-2">
                          CTA Accent Color
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(Object.keys(ACCENTS) as AccentId[]).map((id) => {
                            const item = ACCENTS[id];
                            const selected = accentId === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setAccentId(id)}
                                title={item.label}
                                aria-label={item.label}
                                className={`flex items-center justify-center h-[32px] rounded-[8px] border transition-colors cursor-pointer ${
                                  selected
                                    ? 'border-white bg-white/12'
                                    : 'border-white/10 bg-white/[0.04] hover:border-white/30'
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full ${item.swatchClass}`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => setShowSafeZones((v) => !v)}
                          aria-pressed={showSafeZones}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[12px] transition-colors cursor-pointer ${
                            showSafeZones
                              ? 'bg-white/[0.07] text-white'
                              : 'bg-white/[0.02] text-white/40 hover:text-white/75'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Eye
                              className={`w-3.5 h-3.5 ${
                                showSafeZones ? 'text-[#ff5512]' : 'text-white/25'
                              }`}
                              aria-hidden="true"
                            />
                            Meta &amp; Reel UI Safe Zones
                          </span>
                          <span className="font-mono text-[10.5px] text-white/45">
                            {showSafeZones ? 'Visible' : 'Hidden'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCampaignLayers((p) => ({ ...p, copyStack: !p.copyStack }))
                          }
                          aria-pressed={campaignLayers.copyStack}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[12px] transition-colors cursor-pointer ${
                            campaignLayers.copyStack
                              ? 'bg-white/[0.07] text-white'
                              : 'bg-white/[0.02] text-white/40 hover:text-white/75'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Eye
                              className={`w-3.5 h-3.5 ${
                                campaignLayers.copyStack ? 'text-[#ff5512]' : 'text-white/25'
                              }`}
                              aria-hidden="true"
                            />
                            Ad Headline &amp; CTA Layer
                          </span>
                          <span className="font-mono text-[10.5px] text-white/45">
                            {campaignLayers.copyStack ? 'Visible' : 'Hidden'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-white/60">
                      <span>Meta, Google &amp; YouTube Ads</span>
                      <button
                        type="button"
                        onClick={() => onNavigate('quote')}
                        className="text-white hover:text-[#ff5512] font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Build Campaign Quote →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Clean Statement Anchor below the Studio Panel */}
        <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[#111418]/50 mb-2">
              Studio Production · Posters, Layouts &amp; Ad Campaigns
            </p>
            <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-medium tracking-[-0.025em] leading-[1.1] text-[#111418] [text-wrap:balance]">
              Craft bold posters, align every layout, and launch ad campaigns built to convert.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="whitespace-nowrap shrink-0 h-[44px] px-5 rounded-[12px] bg-white border border-[#111418]/14 text-[14px] font-medium text-[#111418] hover:bg-[#111418]/5 transition-colors cursor-pointer"
            >
              View Service Rates
            </button>
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 h-[44px] px-5 rounded-[12px] bg-[#16191f] text-white text-[14px] font-medium hover:bg-[#2b3140] transition-colors cursor-pointer"
            >
              Start a Campaign Scope
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
