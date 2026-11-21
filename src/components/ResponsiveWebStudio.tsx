import { CSSProperties, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Expand,
  Heart,
  Menu,
  Minimize2,
  Minus,
  Monitor,
  Moon,
  Plus,
  Ruler,
  Search,
  ShoppingBag,
  Smartphone,
  Sun,
  Tablet,
  Trash2,
  X,
} from 'lucide-react';
import { PageRoute } from '../types/routing';
import {
  BASE_STUDIO_SETTINGS,
  SITE_ARCHETYPE_OVERRIDES,
  StudioThemePreset,
  WebDeviceType,
  WebSiteType,
  WebStudioSettings,
} from '../types/webStudioConfig';
import { WebStudioInspectorPanel } from './WebStudioInspectorPanel';

import ecomHeadphonesImg from '../assets/images/ecom_headphones_studio_1795081845615.jpg';
import ecomEspressoImg from '../assets/images/ecom_espresso_maker_1795081848569.jpg';
import clothingHeroImg from '../assets/images/clothing_streetwear_hero_1795081847597.jpg';
import clothingJacketImg from '../assets/images/clothing_utility_jacket_1795081847237.jpg';
import staticStudioHeroImg from '../assets/images/static_studio_hero_1795081848484.jpg';
import portraitPhoto from '../assets/images/fashion_editorial_portrait_1794927856556.jpg';
import luxuryVillaImg from '../assets/images/luxury_resort_villa_1794927856726.jpg';
import sneakerPhoto from '../assets/images/campaign_sneaker_ad_1794926293703.jpg';
import skincarePhoto from '../assets/images/layout_editorial_skincare_1794926294213.jpg';
import watchStudioPhoto from '../assets/images/photo_retouch_watch_1794926293928.jpg';

const WATCH_BG = '/assets/aistudio/watch_c20cf811.webp';
const SHOE_BG = '/assets/aistudio/shoe_547d4516.webp';
const SKINCARE_BG = '/assets/aistudio/skincare_fe153ad9.webp';

interface ResponsiveWebStudioProps {
  onNavigate: (route: PageRoute) => void;
}

interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  specs: string;
  material: string;
}

interface ClothingItem {
  id: string;
  name: string;
  collection: 'Outerwear' | 'Footwear' | 'Knitwear';
  price: number;
  image: string;
  fit: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
}

interface CartEntry {
  key: string;
  id: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  qty: number;
}

const ECOM_PRODUCTS: StoreProduct[] = [
  {
    id: 'audea-phones',
    name: 'Audea Walnut Reference',
    category: 'Audio',
    price: 24900,
    image: ecomHeadphonesImg,
    specs: '40mm Beryllium · ANC · 48h Battery',
    material: 'Anodized Aluminum & American Walnut',
  },
  {
    id: 'aurora-espresso',
    name: 'Aurora Dual-Boiler Espresso',
    category: 'Kitchen',
    price: 42500,
    image: ecomEspressoImg,
    specs: 'PID Thermal Control · 9 Bar Brass',
    material: 'Matte Powder Steel & Brushed Brass',
  },
  {
    id: 'chrono-mk4',
    name: 'Vanguard Tachymeter MK-IV',
    category: 'Horology',
    price: 18200,
    image: WATCH_BG,
    specs: 'Sapphire Crystal · 100m Water Resistant',
    material: '316L Brushed Surgical Steel',
  },
  {
    id: 'botanical-serum',
    name: 'Aesop Botanical Elixir',
    category: 'Living',
    price: 3450,
    image: SKINCARE_BG,
    specs: 'Cold-Pressed Botanicals · 50ml Amber',
    material: 'UV-Shielded Apothecary Glass',
  },
  {
    id: 'chronograph-basalt',
    name: 'Monolith Basalt Field Watch',
    category: 'Horology',
    price: 21500,
    image: watchStudioPhoto,
    specs: 'Automatic Caliber · Anti-Reflective',
    material: 'Sandblasted Titanium Case',
  },
  {
    id: 'nordic-hydra-mist',
    name: 'Solstice Barrier Concentrate',
    category: 'Living',
    price: 2950,
    image: skincarePhoto,
    specs: 'Ceramide Complex · Dermatologist Tested',
    material: 'Refillable Frosted Glass',
  },
];

const CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: 'vesper-coat',
    name: 'Architectural Wool Overcoat',
    collection: 'Outerwear',
    price: 16900,
    image: clothingHeroImg,
    fit: 'Relaxed Drop-Shoulder',
    colors: [
      { name: 'Charcoal', hex: '#27272a' },
      { name: 'Espresso', hex: '#451a03' },
      { name: 'Stone', hex: '#a8a29e' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'field-overshirt',
    name: 'Technical Twill Overshirt',
    collection: 'Outerwear',
    price: 6800,
    image: clothingJacketImg,
    fit: 'Boxy Tailored',
    colors: [
      { name: 'Olive Slate', hex: '#3f4739' },
      { name: 'Obsidian', hex: '#18181b' },
      { name: 'Warm Sand', hex: '#d6d3d1' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'velocity-runner',
    name: 'Velocity Carbon Runner',
    collection: 'Footwear',
    price: 11400,
    image: SHOE_BG,
    fit: 'True to Size · EU 40–45',
    colors: [
      { name: 'Blaze', hex: '#ea580c' },
      { name: 'Carbon', hex: '#18181b' },
      { name: 'Chalk', hex: '#e5e7eb' },
    ],
    sizes: ['41', '42', '43', '44'],
  },
  {
    id: 'scarlet-turtleneck',
    name: 'Merino Ribbed Turtleneck',
    collection: 'Knitwear',
    price: 5400,
    image: portraitPhoto,
    fit: 'Slim Structured',
    colors: [
      { name: 'Crimson', hex: '#dc2626' },
      { name: 'Ink', hex: '#0f172a' },
      { name: 'Ivory', hex: '#f5f5f4' },
    ],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'track-trainer-pro',
    name: 'Kinetic Trail Trainer',
    collection: 'Footwear',
    price: 9800,
    image: sneakerPhoto,
    fit: 'Structured Grip Sole',
    colors: [
      { name: 'Amber', hex: '#d97706' },
      { name: 'Graphite', hex: '#374151' },
    ],
    sizes: ['41', '42', '43', '44'],
  },
  {
    id: 'monolith-parka',
    name: 'All-Weather Storm Field Shell',
    collection: 'Outerwear',
    price: 14200,
    image: clothingJacketImg,
    fit: 'Relaxed Modular',
    colors: [
      { name: 'Forest', hex: '#14532d' },
      { name: 'Slate', hex: '#334155' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

const SITE_DOMAINS: Record<WebSiteType, string> = {
  ecommerce: 'audea-living.store',
  clothing: 'ateliervesper.com',
  static: 'arx-practice.studio',
};

function hexToRgba(hex: string, alphaPercent: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(alphaPercent / 100).toFixed(2)})`;
}

function SafeSiteImage({
  src,
  alt,
  className,
  style,
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  fallbackTitle: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 text-neutral-500 p-4 text-center ${
          className ?? ''
        }`}
      >
        <span className="font-mono text-[11px] uppercase tracking-wider">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={style}
      className={className}
    />
  );
}

export function ResponsiveWebStudio({ onNavigate }: ResponsiveWebStudioProps) {
  const [siteType, setSiteType] = useState<WebSiteType>('ecommerce');
  const [device, setDevice] = useState<WebDeviceType>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [expandedStage, setExpandedStage] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  // Unified 105-Setting Live State
  const [settings, setSettings] = useState<WebStudioSettings>(() => ({
    ...BASE_STUDIO_SETTINGS,
    ...SITE_ARCHETYPE_OVERRIDES.ecommerce,
  }));

  const updateSetting = <K extends keyof WebStudioSettings>(key: K, value: WebStudioSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: StudioThemePreset) => {
    setSettings((prev) => ({ ...prev, ...preset.patch }));
  };

  const handleSiteSwitch = (nextSite: WebSiteType) => {
    setSiteType(nextSite);
    setMobileMenuOpen(false);
    setEcomCartOpen(false);
    setClothCartOpen(false);
    setAnnouncementDismissed(false);
    setSettings((prev) => ({
      ...prev,
      ...SITE_ARCHETYPE_OVERRIDES[nextSite],
    }));
  };

  const handleResetAll = () => {
    setAnnouncementDismissed(false);
    setSettings({
      ...BASE_STUDIO_SETTINGS,
      ...SITE_ARCHETYPE_OVERRIDES[siteType],
    });
  };

  // Shared mobile drawer inside simulated preview
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ============================================
  // 1. E-COMMERCE STORE INTERACTIVE STATE
  // ============================================
  const [ecomCategory, setEcomCategory] = useState<string>('All');
  const [ecomSearch, setEcomSearch] = useState('');
  const [ecomCart, setEcomCart] = useState<CartEntry[]>([
    {
      key: 'audea-phones-Walnut',
      id: 'audea-phones',
      name: 'Audea Walnut Reference',
      price: 24900,
      image: ecomHeadphonesImg,
      variant: 'American Walnut · Wireless',
      qty: 1,
    },
  ]);
  const [ecomCartOpen, setEcomCartOpen] = useState(false);
  const [ecomWishlist, setEcomWishlist] = useState<string[]>(['aurora-espresso']);
  const [ecomQuickProduct, setEcomQuickProduct] = useState<StoreProduct | null>(null);
  const [ecomOrderSuccess, setEcomOrderSuccess] = useState<string | null>(null);
  const [ecomCustomerName, setEcomCustomerName] = useState('Aarav Mehta');
  const [ecomCustomerPhone, setEcomCustomerPhone] = useState('+91 98204 11890');

  // ============================================
  // 2. CLOTHING WEBSITE INTERACTIVE STATE
  // ============================================
  const [clothCategory, setClothCategory] = useState<'All' | 'Outerwear' | 'Footwear' | 'Knitwear'>('All');
  const [clothSelectedSizes, setClothSelectedSizes] = useState<Record<string, string>>({
    'vesper-coat': 'M',
    'field-overshirt': 'L',
    'velocity-runner': '42',
    'scarlet-turtleneck': 'M',
    'track-trainer-pro': '43',
    'monolith-parka': 'L',
  });
  const [clothSelectedColors, setClothSelectedColors] = useState<Record<string, number>>({
    'vesper-coat': 0,
    'field-overshirt': 0,
    'velocity-runner': 0,
    'scarlet-turtleneck': 0,
    'track-trainer-pro': 0,
    'monolith-parka': 0,
  });
  const [clothCart, setClothCart] = useState<CartEntry[]>([]);
  const [clothCartOpen, setClothCartOpen] = useState(false);
  const [clothSizeGuideOpen, setClothSizeGuideOpen] = useState(false);
  const [clothOrderRef, setClothOrderRef] = useState<string | null>(null);

  // ============================================
  // 3. STATIC WEBSITE INTERACTIVE STATE
  // ============================================
  const [staticSection, setStaticSection] = useState<'overview' | 'projects' | 'contact'>('overview');
  const [staticLeadName, setStaticLeadName] = useState('');
  const [staticLeadEmail, setStaticLeadEmail] = useState('');
  const [staticLeadScope, setStaticLeadScope] = useState('Private Residence');
  const [staticLeadNote, setStaticLeadNote] = useState('');
  const [staticLeadSubmitted, setStaticLeadSubmitted] = useState<string | null>(null);
  const [staticLeadError, setStaticLeadError] = useState<string | null>(null);

  const filteredEcomProducts = useMemo(() => {
    return ECOM_PRODUCTS.filter((p) => {
      const catMatch = ecomCategory === 'All' || p.category === ecomCategory;
      const searchMatch =
        !ecomSearch.trim() ||
        p.name.toLowerCase().includes(ecomSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(ecomSearch.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [ecomCategory, ecomSearch]);

  const filteredClothing = useMemo(() => {
    return CLOTHING_ITEMS.filter((item) => clothCategory === 'All' || item.collection === clothCategory);
  }, [clothCategory]);

  const addEcomToCart = (product: StoreProduct) => {
    setEcomOrderSuccess(null);
    const key = `${product.id}-default`;
    setEcomCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          variant: product.material.split('&')[0].trim(),
          qty: 1,
        },
      ];
    });
    setEcomCartOpen(true);
  };

  const addClothToCart = (item: ClothingItem) => {
    setClothOrderRef(null);
    const size = clothSelectedSizes[item.id] ?? item.sizes[0];
    const colorIdx = clothSelectedColors[item.id] ?? 0;
    const colorObj = item.colors[colorIdx] ?? item.colors[0];
    const key = `${item.id}-${size}-${colorObj.name}`;
    setClothCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          variant: `Size ${size} · ${colorObj.name}`,
          qty: 1,
        },
      ];
    });
    setClothCartOpen(true);
  };

  const ecomTotalCount = ecomCart.reduce((acc, item) => acc + item.qty, 0);
  const ecomSubtotal = ecomCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const clothTotalCount = clothCart.reduce((acc, item) => acc + item.qty, 0);
  const clothSubtotal = clothCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const isDesktop = device === 'desktop';
  const isTablet = device === 'tablet';
  const isMobile = device === 'mobile';
  const isDarkPreview = theme === 'dark';

  // Responsive Columns & Spacing derived directly from live Settings + Device
  const activeCols = isDesktop ? settings.desktopCols : isTablet ? settings.tabletCols : settings.mobileCols;
  const activePadX = isMobile && settings.compactMobileMode ? Math.max(8, settings.containerPadPx - 6) : settings.containerPadPx;
  const effectiveBorderOpacity = settings.highContrastBorders ? Math.max(32, settings.borderOpacity) : settings.borderOpacity;

  const canvasBgColor = isDarkPreview ? settings.canvasBgDark : settings.canvasBgLight;
  const cardBgColor = isDarkPreview ? settings.cardBgDark : settings.cardBgLight;
  const primaryTextColor = isDarkPreview ? settings.textPrimaryDark : settings.textPrimaryLight;
  const borderColorStr = isDarkPreview
    ? `rgba(255,255,255,${(effectiveBorderOpacity / 100).toFixed(2)})`
    : `rgba(0,0,0,${(effectiveBorderOpacity / 100).toFixed(2)})`;

  const resolvedButtonFg = settings.buttonTextColor === 'auto' ? '#ffffff' : settings.buttonTextColor;

  const cardAspectClass =
    settings.cardAspectRatio === '1:1'
      ? 'aspect-square'
      : settings.cardAspectRatio === '3:4'
      ? 'aspect-[3/4]'
      : settings.cardAspectRatio === '16:10'
      ? 'aspect-[16/10]'
      : 'aspect-[4/3]';

  const cardShadowCss =
    settings.cardShadowLevel === 'none'
      ? 'none'
      : settings.cardShadowLevel === 'subtle'
      ? '0 2px 8px rgba(0,0,0,0.06)'
      : settings.cardShadowLevel === 'medium'
      ? '0 8px 20px rgba(0,0,0,0.12)'
      : '0 14px 32px rgba(0,0,0,0.22)';

  const imageFilterCss = `brightness(${settings.imgBrightness}%) contrast(${settings.imgContrast}%) saturate(${settings.imgSaturate}%) grayscale(${settings.imgGrayscale}%) sepia(${settings.imgSepia}%)`;

  const buttonPadClass =
    settings.buttonSize === 'compact'
      ? 'px-2.5 py-1 text-[10.5px]'
      : settings.buttonSize === 'large'
      ? 'px-5 py-2.5 text-[13px]'
      : 'px-3.5 py-1.5 text-[11.5px]';

  const ctaButtonStyle: CSSProperties = {
    borderRadius: `${settings.buttonRadiusPx}px`,
    fontWeight: settings.buttonFontWeight,
    textTransform: settings.buttonUppercase ? 'uppercase' : 'none',
    boxShadow: settings.buttonShadow ? '0 6px 16px rgba(0,0,0,0.22)' : 'none',
    ...(settings.buttonStyle === 'solid'
      ? { backgroundColor: settings.accentColor, color: resolvedButtonFg }
      : settings.buttonStyle === 'outline'
      ? {
          backgroundColor: 'transparent',
          color: settings.accentColor,
          border: `1.5px solid ${settings.accentColor}`,
        }
      : {
          backgroundColor: hexToRgba(settings.accentColor, 16),
          color: settings.accentColor,
        }),
  };

  const priceClass =
    settings.priceFontStyle === 'mono'
      ? 'font-mono'
      : settings.priceFontStyle === 'serif'
      ? 'font-serif'
      : 'font-sans';

  const frameDimensionClass = isDesktop
    ? 'w-full min-h-[600px] max-h-[660px]'
    : isTablet
    ? 'w-full max-w-[560px] min-h-[600px] max-h-[660px]'
    : 'w-[310px] sm:w-[345px] min-h-[600px] max-h-[660px]';

  const renderContainerStyle: CSSProperties = {
    backgroundColor: canvasBgColor,
    color: primaryTextColor,
    fontFamily: `"${settings.bodyFont}", sans-serif`,
    fontSize: `${settings.bodySizePx}px`,
    lineHeight: settings.bodyLineHeight,
    backgroundImage: settings.overlayGridTexture
      ? `linear-gradient(to right, ${borderColorStr} 1px, transparent 1px), linear-gradient(to bottom, ${borderColorStr} 1px, transparent 1px)`
      : undefined,
    backgroundSize: settings.overlayGridTexture ? '24px 24px' : undefined,
  };

  const contentMeasureStyle: CSSProperties = {
    maxWidth: settings.maxContainerWidth === 'full' ? '100%' : settings.maxContainerWidth,
    marginInline: 'auto',
    paddingInline: `${activePadX}px`,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
      {/* LEFT / MAIN STAGE: RESPONSIVE DEVICE VIEWPORT */}
      <div
        className={`${
          expandedStage ? 'lg:col-span-12' : 'lg:col-span-8'
        } rounded-[16px] bg-[#14161f] border border-white/12 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Top Studio Toolbar: Site Switcher + Device Switcher + Theme + Expand */}
        <div className="bg-[#1b1e29] px-3.5 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-[12px]">
          <div className="flex items-center gap-1 p-1 bg-black/45 rounded-[9px] overflow-x-auto no-scrollbar max-w-full">
            {(
              [
                { id: 'ecommerce', label: 'E-Commerce Store' },
                { id: 'clothing', label: 'Clothing Brand' },
                { id: 'static', label: 'Static Website' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSiteSwitch(tab.id)}
                className={`px-3 py-1.5 rounded-[6px] text-[11.5px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  siteType === tab.id ? 'bg-white text-[#111418] shadow-xs' : 'text-white/65 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1 p-1 bg-black/40 rounded-[8px]">
              {(
                [
                  { id: 'desktop', label: 'Desktop 1440px', short: '1440px', Icon: Monitor },
                  { id: 'tablet', label: 'Tablet 768px', short: '768px', Icon: Tablet },
                  { id: 'mobile', label: 'Mobile 375px', short: '375px', Icon: Smartphone },
                ] as const
              ).map(({ id, label, short, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setDevice(id);
                    setMobileMenuOpen(false);
                  }}
                  title={label}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    device === id ? 'bg-[#10B981] text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{label}</span>
                  <span className="xl:hidden">{short}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              title="Toggle Light / Dark Storefront"
              className="px-2.5 py-1.5 rounded-[7px] bg-white/10 text-white font-mono text-[10.5px] hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              {isDarkPreview ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-300" />}
              <span className="hidden sm:inline">{isDarkPreview ? 'Light' : 'Dark'}</span>
            </button>

            <button
              type="button"
              onClick={() => setExpandedStage((v) => !v)}
              title={expandedStage ? 'Show 105-Setting Inspector' : 'Expand Full Viewport'}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-[7px] bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer text-[11px] whitespace-nowrap shrink-0"
            >
              {expandedStage ? <Minimize2 className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Viewport Simulation Stage */}
        <div className="flex-1 bg-[#090a0f] p-3 sm:p-5 flex flex-col items-center justify-center overflow-hidden">
          <div
            style={renderContainerStyle}
            className={`relative transition-all duration-300 rounded-[14px] overflow-hidden border shadow-2xl flex flex-col ${frameDimensionClass} ${
              isMobile ? 'border-white/25 ring-4 ring-white/5 rounded-[26px]' : 'border-white/15'
            }`}
          >
            {/* Browser Chrome Bar */}
            {isMobile ? (
              <div
                className={`px-4 py-2 border-b flex items-center justify-between text-[10px] font-mono shrink-0 ${
                  isDarkPreview ? 'bg-[#12151e] border-white/10 text-white/70' : 'bg-white border-black/10 text-neutral-600'
                }`}
              >
                <span className="tabular-nums font-semibold">9:41</span>
                <span className="w-16 h-3 rounded-full bg-black/80" />
                <span className="tabular-nums">375px · {activeCols} Col</span>
              </div>
            ) : (
              <div
                className={`px-3.5 py-2 border-b flex items-center justify-between gap-3 shrink-0 ${
                  isDarkPreview ? 'bg-[#171a24] border-white/10 text-white/70' : 'bg-[#f1f2f5] border-black/10 text-neutral-600'
                }`}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div
                  className={`flex-1 max-w-[320px] px-3 py-0.5 rounded-[5px] text-center font-mono text-[10.5px] truncate ${
                    isDarkPreview ? 'bg-black/35 text-white/70' : 'bg-white text-neutral-600 border border-black/8'
                  }`}
                >
                  https://{SITE_DOMAINS[siteType]}
                </div>
                <span className="font-mono text-[10px] tabular-nums opacity-70 whitespace-nowrap shrink-0">
                  {isDesktop ? '1440px' : '768px'} · {activeCols} Cols
                </span>
              </div>
            )}

            {/* SCROLLABLE WEBSITE INNER DOCUMENT */}
            <div
              className={`relative flex-1 overflow-y-auto no-scrollbar flex flex-col ${
                settings.smoothScroll ? 'scroll-smooth' : ''
              }`}
            >
              {/* Announcement Promo Banner */}
              {settings.showAnnouncementBar && !announcementDismissed && (
                <div
                  className="px-4 py-1.5 text-[10.5px] font-mono text-white flex items-center justify-between gap-2 shrink-0"
                  style={{ backgroundColor: settings.badgeBgColor }}
                >
                  <span className="truncate mx-auto">{settings.announcementText}</span>
                  <button
                    type="button"
                    aria-label="Dismiss banner"
                    onClick={() => setAnnouncementDismissed(true)}
                    className="opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* UNIFIED 3-ZONE NAVBAR (Adapted per Archetype) */}
              <header
                className={`${settings.headerSticky ? 'sticky top-0 z-20' : ''} border-b flex items-center justify-between gap-3 shrink-0`}
                style={{
                  height: `${settings.headerHeightPx}px`,
                  paddingInline: `${activePadX}px`,
                  borderColor: borderColorStr,
                  backgroundColor: hexToRgba(canvasBgColor, settings.headerBgOpacity),
                  backdropFilter: settings.headerBlurPx > 0 ? `blur(${settings.headerBlurPx}px)` : 'none',
                }}
              >
                <div className="min-w-0 shrink-0">
                  <span
                    className="tracking-tight font-bold whitespace-nowrap block leading-none"
                    style={{ fontFamily: `"${settings.headingFont}", sans-serif`, fontSize: '14.5px' }}
                  >
                    {settings.brandName}
                  </span>
                </div>

                {/* Desktop / Tablet Nav Links */}
                {!isMobile && settings.showNavLinks && (
                  <nav
                    className={`flex-1 flex items-center gap-4 text-[11.5px] font-medium ${
                      settings.navAlignment === 'left'
                        ? 'justify-start pl-4'
                        : settings.navAlignment === 'right'
                        ? 'justify-end pr-2'
                        : 'justify-center'
                    }`}
                  >
                    {siteType === 'ecommerce' &&
                      ['All', 'Audio', 'Kitchen', 'Horology', 'Living'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setEcomCategory(cat)}
                          className={`whitespace-nowrap shrink-0 cursor-pointer ${
                            ecomCategory === cat ? 'font-bold underline underline-offset-4' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}

                    {siteType === 'clothing' && (
                      <>
                        {(['All', 'Outerwear', 'Footwear', 'Knitwear'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setClothCategory(cat)}
                            className={`whitespace-nowrap shrink-0 cursor-pointer ${
                              clothCategory === cat ? 'font-bold underline underline-offset-4' : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                        {settings.showSizeGuideLink && (
                          <button
                            type="button"
                            onClick={() => setClothSizeGuideOpen(true)}
                            className="opacity-70 hover:opacity-100 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
                          >
                            <Ruler className="w-3 h-3" />
                            Size Guide
                          </button>
                        )}
                      </>
                    )}

                    {siteType === 'static' &&
                      (
                        [
                          { id: 'overview', label: 'Capabilities' },
                          { id: 'projects', label: 'Case Studies' },
                          { id: 'contact', label: 'Contact' },
                        ] as const
                      ).map((nav) => (
                        <button
                          key={nav.id}
                          type="button"
                          onClick={() => setStaticSection(nav.id)}
                          className={`whitespace-nowrap shrink-0 cursor-pointer ${
                            staticSection === nav.id ? 'font-bold underline underline-offset-4' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          {nav.label}
                        </button>
                      ))}
                  </nav>
                )}

                {/* Mobile Hamburger Trigger */}
                {isMobile && settings.showMobileHamburger && (
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    aria-label="Toggle Menu"
                    className="p-1.5 rounded-md hover:bg-current/10 cursor-pointer"
                  >
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>
                )}

                {/* Right Primary Header Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {siteType === 'ecommerce' && settings.enableWishlistBadge && (
                    <span className="font-mono text-[10px] opacity-65 hidden sm:inline tabular-nums">
                      ♥ {ecomWishlist.length}
                    </span>
                  )}

                  {siteType !== 'static' && settings.showCartButton ? (
                    <button
                      type="button"
                      onClick={() => (siteType === 'ecommerce' ? setEcomCartOpen(true) : setClothCartOpen(true))}
                      className={`inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-transform ${
                        settings.buttonHoverScale ? 'hover:scale-[1.03]' : ''
                      } ${buttonPadClass}`}
                      style={ctaButtonStyle}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className={settings.tabularNumerals ? 'tabular-nums' : ''}>
                        Bag ({siteType === 'ecommerce' ? ecomTotalCount : clothTotalCount})
                      </span>
                    </button>
                  ) : (
                    siteType === 'static' && (
                      <button
                        type="button"
                        onClick={() => setStaticSection('contact')}
                        className={`cursor-pointer whitespace-nowrap shrink-0 ${buttonPadClass}`}
                        style={ctaButtonStyle}
                      >
                        {settings.ctaLabel}
                      </button>
                    )
                  )}
                </div>
              </header>

              {/* Mobile Collapsible Drawer */}
              {isMobile && mobileMenuOpen && (
                <div className="px-4 py-3 border-b flex flex-wrap gap-2 text-[11.5px]" style={{ borderColor: borderColorStr }}>
                  {siteType === 'ecommerce' &&
                    ['All', 'Audio', 'Kitchen', 'Horology', 'Living'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setEcomCategory(cat);
                          setMobileMenuOpen(false);
                        }}
                        className={`px-2.5 py-1 rounded-[6px] border cursor-pointer ${
                          ecomCategory === cat ? 'font-bold bg-current/10' : ''
                        }`}
                        style={{ borderColor: borderColorStr }}
                      >
                        {cat}
                      </button>
                    ))}
                  {siteType === 'clothing' &&
                    (['All', 'Outerwear', 'Footwear', 'Knitwear'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setClothCategory(cat);
                          setMobileMenuOpen(false);
                        }}
                        className={`px-2.5 py-1 rounded-[6px] border cursor-pointer ${
                          clothCategory === cat ? 'font-bold bg-current/10' : ''
                        }`}
                        style={{ borderColor: borderColorStr }}
                      >
                        {cat}
                      </button>
                    ))}
                  {siteType === 'static' &&
                    (['overview', 'projects', 'contact'] as const).map((nav) => (
                      <button
                        key={nav}
                        type="button"
                        onClick={() => {
                          setStaticSection(nav);
                          setMobileMenuOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-[6px] border capitalize cursor-pointer"
                        style={{ borderColor: borderColorStr }}
                      >
                        {nav}
                      </button>
                    ))}
                </div>
              )}

              {/* HERO SECTION (Responsive split / stacked / overlay driven by settings) */}
              <section
                className="border-b"
                style={{
                  borderColor: borderColorStr,
                  paddingBlock: `${settings.sectionPadY}px`,
                }}
              >
                <div style={contentMeasureStyle}>
                  {settings.heroLayoutMode === 'overlay' || !settings.showHeroImage ? (
                    <div
                      className="relative overflow-hidden flex items-end"
                      style={{
                        borderRadius: `${settings.cardRadiusPx}px`,
                        minHeight: `${settings.heroMinHeightPx}px`,
                        border: settings.showCardBorder ? `${settings.cardBorderWidthPx}px solid ${borderColorStr}` : 'none',
                      }}
                    >
                      {settings.showHeroImage && (
                        <>
                          <SafeSiteImage
                            src={
                              siteType === 'ecommerce'
                                ? ecomHeadphonesImg
                                : siteType === 'clothing'
                                ? clothingHeroImg
                                : staticStudioHeroImg
                            }
                            alt={settings.heroHeadline}
                            className="absolute inset-0 w-full h-full"
                            style={{
                              objectFit: settings.imgObjectFit,
                              objectPosition: settings.imgFocalPosition,
                              filter: imageFilterCss,
                              transform: `scale(${settings.heroImageScale / 100})`,
                            }}
                            fallbackTitle={settings.brandName}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(to top, rgba(0,0,0,${(
                                settings.heroScrimOpacity / 100
                              ).toFixed(2)}) 10%, rgba(0,0,0,0.25) 60%, transparent 100%)`,
                            }}
                          />
                        </>
                      )}

                      <div
                        className={`relative z-10 p-4 sm:p-6 w-full ${settings.showHeroImage ? 'text-white' : ''}`}
                        style={{ textAlign: settings.heroTextAlign }}
                      >
                        <p className="font-mono text-[10px] tracking-wider uppercase opacity-80">{settings.heroKicker}</p>
                        <h4
                          className="mt-1 [text-wrap:balance]"
                          style={{
                            fontFamily: `"${settings.headingFont}", sans-serif`,
                            fontSize: `${isMobile ? Math.max(17, settings.heroTitleSizePx - 4) : settings.heroTitleSizePx}px`,
                            fontWeight: settings.heroTitleWeight,
                            letterSpacing: `${settings.heroTrackingEm}em`,
                            lineHeight: settings.heroLineHeight,
                            textTransform: settings.heroUppercase ? 'uppercase' : 'none',
                          }}
                        >
                          {settings.heroHeadline}
                        </h4>
                        <p className="mt-1.5 opacity-85 max-w-[46ch]" style={{ marginInline: settings.heroTextAlign === 'center' ? 'auto' : undefined }}>
                          {settings.heroSubline}
                        </p>
                        <div
                          className={`mt-3.5 flex flex-wrap items-center gap-3 ${
                            settings.heroTextAlign === 'center'
                              ? 'justify-center'
                              : settings.heroTextAlign === 'right'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (siteType === 'ecommerce') addEcomToCart(ECOM_PRODUCTS[0]);
                              else if (siteType === 'clothing') addClothToCart(CLOTHING_ITEMS[0]);
                              else setStaticSection('contact');
                            }}
                            className={`cursor-pointer transition-transform ${
                              settings.buttonHoverScale ? 'hover:scale-[1.03]' : ''
                            } ${buttonPadClass}`}
                            style={ctaButtonStyle}
                          >
                            {settings.ctaLabel} {settings.buttonShowArrow ? '→' : ''}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (siteType === 'ecommerce') setEcomQuickProduct(ECOM_PRODUCTS[0]);
                              else if (siteType === 'clothing') setClothSizeGuideOpen(true);
                              else setStaticSection('projects');
                            }}
                            className="text-[11px] font-mono underline opacity-85 cursor-pointer"
                          >
                            {settings.secondaryCtaLabel}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* SPLIT OR STACKED HERO */
                    <div
                      className={`grid items-center`}
                      style={{
                        gridTemplateColumns:
                          settings.heroLayoutMode === 'split' && isDesktop ? 'repeat(12, minmax(0, 1fr))' : '1fr',
                        gap: `${settings.gridGapPx}px`,
                      }}
                    >
                      <div
                        className={settings.heroLayoutMode === 'split' && isDesktop ? 'col-span-6' : ''}
                        style={{ textAlign: settings.heroTextAlign }}
                      >
                        <p className="font-mono text-[10px] tracking-wider uppercase" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                          {settings.heroKicker}
                        </p>
                        <h4
                          className="mt-1.5 [text-wrap:balance]"
                          style={{
                            fontFamily: `"${settings.headingFont}", sans-serif`,
                            fontSize: `${isMobile ? Math.max(17, settings.heroTitleSizePx - 4) : settings.heroTitleSizePx}px`,
                            fontWeight: settings.heroTitleWeight,
                            letterSpacing: `${settings.heroTrackingEm}em`,
                            lineHeight: settings.heroLineHeight,
                            textTransform: settings.heroUppercase ? 'uppercase' : 'none',
                          }}
                        >
                          {settings.heroHeadline}
                        </h4>
                        <p className="mt-2" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                          {settings.heroSubline}
                        </p>
                        <div
                          className={`mt-3.5 flex flex-wrap items-center gap-3 ${
                            settings.heroTextAlign === 'center'
                              ? 'justify-center'
                              : settings.heroTextAlign === 'right'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (siteType === 'ecommerce') addEcomToCart(ECOM_PRODUCTS[0]);
                              else if (siteType === 'clothing') addClothToCart(CLOTHING_ITEMS[0]);
                              else setStaticSection('contact');
                            }}
                            className={`cursor-pointer transition-transform ${
                              settings.buttonHoverScale ? 'hover:scale-[1.03]' : ''
                            } ${buttonPadClass}`}
                            style={ctaButtonStyle}
                          >
                            {settings.ctaLabel} {settings.buttonShowArrow ? '→' : ''}
                          </button>
                          <span className="font-mono text-[10.5px]" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                            {settings.brandTagline}
                          </span>
                        </div>
                      </div>

                      {settings.showHeroImage && (
                        <div
                          className={`${settings.heroLayoutMode === 'split' && isDesktop ? 'col-span-6' : ''} overflow-hidden`}
                          style={{
                            borderRadius: `${settings.cardRadiusPx}px`,
                            border: settings.showCardBorder ? `${settings.cardBorderWidthPx}px solid ${borderColorStr}` : 'none',
                            minHeight: `${Math.min(240, settings.heroMinHeightPx)}px`,
                          }}
                        >
                          <SafeSiteImage
                            src={
                              siteType === 'ecommerce'
                                ? ecomHeadphonesImg
                                : siteType === 'clothing'
                                ? clothingHeroImg
                                : staticStudioHeroImg
                            }
                            alt={settings.heroHeadline}
                            className="w-full h-full aspect-[4/3]"
                            style={{
                              objectFit: settings.imgObjectFit,
                              objectPosition: settings.imgFocalPosition,
                              filter: imageFilterCss,
                              transform: `scale(${settings.heroImageScale / 100})`,
                            }}
                            fallbackTitle={settings.brandName}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================================
                  MAIN ARCHETYPE CONTENT AREA (E-Commerce / Clothing / Static)
              ================================================================= */}
              {siteType !== 'static' ? (
                <section style={{ paddingBlock: `${settings.sectionPadY}px` }}>
                  <div style={contentMeasureStyle} className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h5
                          className="font-semibold tracking-tight"
                          style={{
                            fontFamily: `"${settings.headingFont}", sans-serif`,
                            fontSize: `${settings.sectionTitleSizePx}px`,
                          }}
                        >
                          {settings.collectionTitle}
                        </h5>
                        <p className="text-[11px]" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                          {settings.collectionSubtitle}
                        </p>
                      </div>

                      {siteType === 'ecommerce' && settings.showSearchBar && (
                        <div
                          className="flex items-center gap-2 px-2.5 py-1.5 border"
                          style={{
                            backgroundColor: cardBgColor,
                            borderColor: borderColorStr,
                            borderRadius: `${settings.inputRadiusPx}px`,
                          }}
                        >
                          <Search className="w-3.5 h-3.5 opacity-50" />
                          <input
                            type="text"
                            value={ecomSearch}
                            onChange={(e) => setEcomSearch(e.target.value)}
                            placeholder="Search catalog..."
                            className="bg-transparent text-[11.5px] focus:outline-none w-[125px] sm:w-[155px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* DYNAMIC N-COLUMN GRID BOUND TO DESKTOP / TABLET / MOBILE SETTINGS */}
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(${activeCols}, minmax(0, 1fr))`,
                        gap: `${settings.gridGapPx}px`,
                        alignItems: settings.cardEqualHeight ? 'stretch' : 'start',
                      }}
                    >
                      {siteType === 'ecommerce'
                        ? filteredEcomProducts.map((product) => {
                            const wished = ecomWishlist.includes(product.id);
                            return (
                              <article
                                key={product.id}
                                className={`group overflow-hidden flex flex-col transition-transform duration-150 ${
                                  settings.cardHoverLift ? 'hover:-translate-y-0.5' : ''
                                }`}
                                style={{
                                  backgroundColor: cardBgColor,
                                  borderRadius: `${settings.cardRadiusPx}px`,
                                  border: settings.showCardBorder
                                    ? `${settings.cardBorderWidthPx}px solid ${borderColorStr}`
                                    : 'none',
                                  boxShadow: cardShadowCss,
                                }}
                              >
                                <div
                                  className={`relative overflow-hidden ${cardAspectClass}`}
                                  style={{
                                    borderRadius: `${settings.imageRadiusPx}px`,
                                    margin: settings.imageRadiusPx > 0 ? `${Math.round(settings.cardPaddingPx / 2)}px` : undefined,
                                  }}
                                >
                                  <SafeSiteImage
                                    src={product.image}
                                    alt={product.name}
                                    className={`w-full h-full transition-transform duration-300 ${
                                      settings.imageHoverZoom ? 'group-hover:scale-[1.04]' : ''
                                    }`}
                                    style={{
                                      objectFit: settings.imgObjectFit,
                                      objectPosition: settings.imgFocalPosition,
                                      filter: imageFilterCss,
                                    }}
                                    fallbackTitle={product.name}
                                  />
                                  {settings.showWishlistHeart && (
                                    <button
                                      type="button"
                                      aria-label="Toggle wishlist"
                                      onClick={() =>
                                        setEcomWishlist((prev) =>
                                          prev.includes(product.id)
                                            ? prev.filter((id) => id !== product.id)
                                            : [...prev, product.id]
                                        )
                                      }
                                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/75 cursor-pointer"
                                    >
                                      <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    </button>
                                  )}
                                </div>

                                <div
                                  className="flex-1 flex flex-col justify-between gap-2"
                                  style={{ padding: `${settings.cardPaddingPx}px` }}
                                >
                                  <div>
                                    {(settings.showCardCategory || settings.showStockStatus) && (
                                      <div
                                        className="flex items-center gap-1.5 text-[10px] font-mono uppercase"
                                        style={{ opacity: settings.mutedTextOpacity / 100 }}
                                      >
                                        {settings.showCardCategory && <span>{product.category}</span>}
                                        {settings.showCardCategory && settings.showStockStatus && <span aria-hidden="true">·</span>}
                                        {settings.showStockStatus && <span>In Stock</span>}
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setEcomQuickProduct(product)}
                                      className="mt-0.5 text-left font-semibold tracking-tight hover:underline cursor-pointer block"
                                      style={{
                                        fontFamily: `"${settings.headingFont}", sans-serif`,
                                        fontSize: `${settings.cardTitleSizePx}px`,
                                      }}
                                    >
                                      {product.name}
                                    </button>
                                    {settings.showCardSpecs && (
                                      <p className="text-[10.5px] mt-0.5" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                                        {product.specs}
                                      </p>
                                    )}
                                  </div>

                                  {(settings.showCardPrice || settings.showQuickAddBtn) && (
                                    <div
                                      className="flex items-center justify-between pt-2"
                                      style={{
                                        borderTop: settings.cardFooterDivider ? `1px solid ${borderColorStr}` : 'none',
                                      }}
                                    >
                                      {settings.showCardPrice && (
                                        <span
                                          className={`text-[12.5px] font-semibold ${priceClass} ${
                                            settings.tabularNumerals ? 'tabular-nums' : ''
                                          }`}
                                        >
                                          {settings.currencySymbol}
                                          {product.price.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                      {settings.showQuickAddBtn && (
                                        <button
                                          type="button"
                                          onClick={() => addEcomToCart(product)}
                                          className="px-2.5 py-1 text-[10.5px] font-semibold cursor-pointer ml-auto"
                                          style={{ ...ctaButtonStyle, padding: '4px 10px' }}
                                        >
                                          + Add
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </article>
                            );
                          })
                        : filteredClothing.map((item) => {
                            const activeSize = clothSelectedSizes[item.id] ?? item.sizes[0];
                            const activeColorIdx = clothSelectedColors[item.id] ?? 0;
                            return (
                              <article
                                key={item.id}
                                className={`group overflow-hidden flex flex-col transition-transform duration-150 ${
                                  settings.cardHoverLift ? 'hover:-translate-y-0.5' : ''
                                }`}
                                style={{
                                  backgroundColor: cardBgColor,
                                  borderRadius: `${settings.cardRadiusPx}px`,
                                  border: settings.showCardBorder
                                    ? `${settings.cardBorderWidthPx}px solid ${borderColorStr}`
                                    : 'none',
                                  boxShadow: cardShadowCss,
                                }}
                              >
                                <div
                                  className={`relative overflow-hidden ${cardAspectClass}`}
                                  style={{
                                    borderRadius: `${settings.imageRadiusPx}px`,
                                    margin: settings.imageRadiusPx > 0 ? `${Math.round(settings.cardPaddingPx / 2)}px` : undefined,
                                  }}
                                >
                                  <SafeSiteImage
                                    src={item.image}
                                    alt={item.name}
                                    className={`w-full h-full transition-transform duration-300 ${
                                      settings.imageHoverZoom ? 'group-hover:scale-[1.04]' : ''
                                    }`}
                                    style={{
                                      objectFit: settings.imgObjectFit,
                                      objectPosition: settings.imgFocalPosition,
                                      filter: imageFilterCss,
                                    }}
                                    fallbackTitle={item.name}
                                  />
                                </div>

                                <div
                                  className="flex-1 flex flex-col justify-between gap-2"
                                  style={{ padding: `${settings.cardPaddingPx}px` }}
                                >
                                  <div>
                                    {(settings.showCardCategory || settings.showCardSpecs) && (
                                      <div
                                        className="flex items-center gap-1.5 text-[10px] font-mono uppercase"
                                        style={{ opacity: settings.mutedTextOpacity / 100 }}
                                      >
                                        {settings.showCardCategory && <span>{item.collection}</span>}
                                        {settings.showCardCategory && settings.showCardSpecs && <span aria-hidden="true">·</span>}
                                        {settings.showCardSpecs && <span>{item.fit}</span>}
                                      </div>
                                    )}
                                    <div className="mt-0.5 flex items-baseline justify-between gap-2">
                                      <h6
                                        className="font-semibold tracking-tight"
                                        style={{
                                          fontFamily: `"${settings.headingFont}", sans-serif`,
                                          fontSize: `${settings.cardTitleSizePx}px`,
                                        }}
                                      >
                                        {item.name}
                                      </h6>
                                      {settings.showCardPrice && (
                                        <span
                                          className={`text-[12px] font-semibold shrink-0 ${priceClass} ${
                                            settings.tabularNumerals ? 'tabular-nums' : ''
                                          }`}
                                        >
                                          {settings.currencySymbol}
                                          {item.price.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {settings.showColorSwatches && (
                                    <div className="flex items-center justify-between gap-2 pt-1">
                                      <div className="flex items-center gap-1.5">
                                        {item.colors.map((col, idx) => (
                                          <button
                                            key={col.name}
                                            type="button"
                                            title={col.name}
                                            onClick={() => setClothSelectedColors((prev) => ({ ...prev, [item.id]: idx }))}
                                            className={`w-4 h-4 rounded-full border cursor-pointer ${
                                              activeColorIdx === idx ? 'ring-2 ring-offset-1 ring-current' : 'border-black/20'
                                            }`}
                                            style={{ backgroundColor: col.hex }}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-[10px] font-mono" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                                        {item.colors[activeColorIdx]?.name}
                                      </span>
                                    </div>
                                  )}

                                  <div
                                    className="flex items-center justify-between gap-2 pt-2"
                                    style={{
                                      borderTop: settings.cardFooterDivider ? `1px solid ${borderColorStr}` : 'none',
                                    }}
                                  >
                                    <div className="flex items-center gap-1">
                                      {item.sizes.map((sz) => (
                                        <button
                                          key={sz}
                                          type="button"
                                          onClick={() => setClothSelectedSizes((prev) => ({ ...prev, [item.id]: sz }))}
                                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                                            activeSize === sz ? 'bg-current/15 font-bold underline' : 'opacity-55 hover:opacity-100'
                                          }`}
                                        >
                                          {sz}
                                        </button>
                                      ))}
                                    </div>
                                    {settings.showQuickAddBtn && (
                                      <button
                                        type="button"
                                        onClick={() => addClothToCart(item)}
                                        className="px-2.5 py-1 text-[10.5px] font-semibold cursor-pointer whitespace-nowrap shrink-0"
                                        style={{ ...ctaButtonStyle, padding: '4px 10px' }}
                                      >
                                        Add ({activeSize})
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                    </div>
                  </div>
                </section>
              ) : (
                /* STATIC ARCHITECTURE SITE BODY */
                <div style={{ paddingBlock: `${settings.sectionPadY}px` }}>
                  <div style={contentMeasureStyle} className="space-y-5">
                    {staticSection !== 'contact' && (
                      <div className="space-y-4">
                        <div className="flex items-baseline justify-between">
                          <h5
                            className="font-semibold tracking-tight"
                            style={{
                              fontFamily: `"${settings.headingFont}", sans-serif`,
                              fontSize: `${settings.sectionTitleSizePx}px`,
                            }}
                          >
                            {settings.collectionTitle}
                          </h5>
                          <span className="font-mono text-[10.5px]" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                            {settings.collectionSubtitle}
                          </span>
                        </div>

                        <div
                          className="grid"
                          style={{
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                            gap: `${settings.gridGapPx}px`,
                          }}
                        >
                          <div
                            className={isMobile ? '' : 'col-span-2'}
                            style={{
                              backgroundColor: cardBgColor,
                              borderRadius: `${settings.cardRadiusPx}px`,
                              border: settings.showCardBorder
                                ? `${settings.cardBorderWidthPx}px solid ${borderColorStr}`
                                : 'none',
                              padding: `${settings.cardPaddingPx}px`,
                              boxShadow: cardShadowCss,
                            }}
                          >
                            <span className="font-mono text-[10.5px]" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                              01. Civic &amp; Private Architecture
                            </span>
                            <h6
                              className="mt-1 font-semibold"
                              style={{
                                fontFamily: `"${settings.headingFont}", sans-serif`,
                                fontSize: `${settings.cardTitleSizePx}px`,
                              }}
                            >
                              Cast-in-situ concrete, timber &amp; solar envelope engineering.
                            </h6>
                            {settings.showCardSpecs && (
                              <p className="mt-1" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                                Complete schematic planning, BIM structural coordination, and site execution delivered with zero third-party handoffs.
                              </p>
                            )}
                          </div>

                          <div
                            className="flex flex-col justify-between"
                            style={{
                              backgroundColor: cardBgColor,
                              borderRadius: `${settings.cardRadiusPx}px`,
                              border: settings.showCardBorder
                                ? `${settings.cardBorderWidthPx}px solid ${borderColorStr}`
                                : 'none',
                              padding: `${settings.cardPaddingPx}px`,
                              boxShadow: cardShadowCss,
                            }}
                          >
                            <span className="font-mono text-[10.5px]" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                              Client Outcomes
                            </span>
                            <div>
                              <p
                                className={`text-[20px] font-semibold tracking-tight ${
                                  settings.tabularNumerals ? 'tabular-nums' : ''
                                }`}
                                style={{ color: settings.accentColor }}
                              >
                                +142%
                              </p>
                              <p className="text-[10.5px]" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                                Direct inquiries in 6 months
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className="overflow-hidden grid"
                          style={{
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, minmax(0, 1fr))',
                            backgroundColor: cardBgColor,
                            borderRadius: `${settings.cardRadiusPx}px`,
                            border: settings.showCardBorder
                              ? `${settings.cardBorderWidthPx}px solid ${borderColorStr}`
                              : 'none',
                            boxShadow: cardShadowCss,
                          }}
                        >
                          <div className={isMobile ? 'aspect-[16/9]' : 'col-span-5'}>
                            <SafeSiteImage
                              src={luxuryVillaImg}
                              alt="Solis Cliffside Pavilion"
                              className="w-full h-full"
                              style={{
                                objectFit: settings.imgObjectFit,
                                objectPosition: settings.imgFocalPosition,
                                filter: imageFilterCss,
                              }}
                              fallbackTitle="Solis Pavilion"
                            />
                          </div>
                          <div
                            className={`${isMobile ? '' : 'col-span-7'} flex flex-col justify-between gap-2`}
                            style={{ padding: `${settings.cardPaddingPx}px` }}
                          >
                            <div>
                              <div
                                className="text-[10px] font-mono flex items-center gap-1.5"
                                style={{ opacity: settings.mutedTextOpacity / 100 }}
                              >
                                <span>Hospitality Case Study</span>
                                <span aria-hidden="true">·</span>
                                <span>Completed 2026</span>
                              </div>
                              <h6
                                className="mt-1 font-semibold"
                                style={{
                                  fontFamily: `"${settings.headingFont}", sans-serif`,
                                  fontSize: `${settings.cardTitleSizePx}px`,
                                }}
                              >
                                Solis Monolithic Villa &amp; Pavilion
                              </h6>
                              <p className="mt-1" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                                Static pre-rendered digital flagship achieving instant mobile paint times and direct reservation capture.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStaticSection('contact')}
                              className="self-start text-[11.5px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                              style={{ color: settings.accentColor }}
                            >
                              Request Dossier <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Project Inquiry Form */}
                    <div className="space-y-3">
                      <h5
                        className="font-semibold tracking-tight"
                        style={{
                          fontFamily: `"${settings.headingFont}", sans-serif`,
                          fontSize: `${settings.sectionTitleSizePx}px`,
                        }}
                      >
                        02. Start a Project Inquiry
                      </h5>

                      {staticLeadSubmitted ? (
                        <div className="p-3.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/30 text-[12px] space-y-1.5">
                          <p className="font-semibold text-emerald-500 flex items-center gap-1.5">
                            <Check className="w-4 h-4" />
                            Inquiry Logged
                          </p>
                          <p>{staticLeadSubmitted}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setStaticLeadSubmitted(null);
                              setStaticLeadName('');
                              setStaticLeadEmail('');
                              setStaticLeadNote('');
                            }}
                            className="text-[11px] underline cursor-pointer opacity-75"
                          >
                            Send another inquiry
                          </button>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!staticLeadName.trim() || !staticLeadEmail.includes('@')) {
                              setStaticLeadError('Please enter your full name and a valid email address.');
                              return;
                            }
                            setStaticLeadError(null);
                            setStaticLeadSubmitted(
                              `Thank you, ${staticLeadName}. Reference #ARX-${Math.floor(200 + Math.random() * 799)} for ${staticLeadScope} has been queued.`
                            );
                          }}
                          style={{
                            backgroundColor: cardBgColor,
                            borderRadius: `${settings.cardRadiusPx}px`,
                            border: `${settings.cardBorderWidthPx}px solid ${borderColorStr}`,
                            padding: `${settings.cardPaddingPx}px`,
                          }}
                          className="space-y-2.5"
                        >
                          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2.5`}>
                            <input
                              type="text"
                              value={staticLeadName}
                              onChange={(e) => setStaticLeadName(e.target.value)}
                              placeholder="Full Name"
                              style={{ borderColor: borderColorStr, borderRadius: `${settings.inputRadiusPx}px` }}
                              className="px-2.5 py-1.5 border text-[11.5px] bg-transparent focus:outline-none"
                            />
                            <input
                              type="email"
                              value={staticLeadEmail}
                              onChange={(e) => setStaticLeadEmail(e.target.value)}
                              placeholder="Work Email"
                              style={{ borderColor: borderColorStr, borderRadius: `${settings.inputRadiusPx}px` }}
                              className="px-2.5 py-1.5 border text-[11.5px] bg-transparent focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            {['Private Residence', 'Commercial Studio', 'Static Web Build'].map((scope) => (
                              <button
                                key={scope}
                                type="button"
                                onClick={() => setStaticLeadScope(scope)}
                                className="px-2.5 py-1 border cursor-pointer transition-colors"
                                style={{
                                  borderRadius: `${settings.buttonRadiusPx}px`,
                                  borderColor: staticLeadScope === scope ? 'transparent' : borderColorStr,
                                  backgroundColor: staticLeadScope === scope ? settings.accentColor : 'transparent',
                                  color: staticLeadScope === scope ? resolvedButtonFg : 'inherit',
                                }}
                              >
                                {scope}
                              </button>
                            ))}
                          </div>
                          <textarea
                            rows={2}
                            value={staticLeadNote}
                            onChange={(e) => setStaticLeadNote(e.target.value)}
                            placeholder="Site location, timeline, and approximate scope..."
                            style={{ borderColor: borderColorStr, borderRadius: `${settings.inputRadiusPx}px` }}
                            className="w-full px-2.5 py-1.5 border text-[11.5px] bg-transparent focus:outline-none resize-none"
                          />
                          {staticLeadError && <p className="text-[11px] text-rose-500 font-medium">{staticLeadError}</p>}
                          <button type="submit" className={`cursor-pointer ${buttonPadClass}`} style={ctaButtonStyle}>
                            Submit Inquiry {settings.buttonShowArrow ? '→' : ''}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* GLOBAL CONFIGURABLE FOOTER */}
              {settings.showFooter && (
                <footer
                  className="mt-auto border-t text-[10.5px] flex flex-wrap items-center justify-between gap-2 shrink-0"
                  style={{
                    borderColor: borderColorStr,
                    paddingInline: `${activePadX}px`,
                    paddingBlock: '14px',
                    backgroundColor: settings.footerBgTint ? hexToRgba(settings.accentColor, 8) : 'transparent',
                    opacity: settings.mutedTextOpacity / 100 + 0.15,
                  }}
                >
                  <span>{settings.footerCopyright}</span>
                  <span className="font-mono">{settings.footerBadgeText}</span>
                </footer>
              )}

              {/* E-COMMERCE QUICK VIEW MODAL */}
              {ecomQuickProduct && (
                <div className="absolute inset-0 z-30 bg-black/65 backdrop-blur-xs p-4 flex items-center justify-center">
                  <div
                    className="w-full max-w-[350px] border p-4 shadow-2xl space-y-3"
                    style={{
                      backgroundColor: cardBgColor,
                      borderColor: borderColorStr,
                      borderRadius: `${settings.cardRadiusPx}px`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] uppercase" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                          {ecomQuickProduct.category}
                        </span>
                        <h5 className="text-[15px] font-semibold">{ecomQuickProduct.name}</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEcomQuickProduct(null)}
                        className="p-1 rounded hover:bg-current/10 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="aspect-[4/3] overflow-hidden" style={{ borderRadius: `${settings.imageRadiusPx || 8}px` }}>
                      <SafeSiteImage
                        src={ecomQuickProduct.image}
                        alt={ecomQuickProduct.name}
                        className="w-full h-full object-cover"
                        style={{ filter: imageFilterCss }}
                        fallbackTitle={ecomQuickProduct.name}
                      />
                    </div>
                    <div className="text-[11.5px] space-y-1">
                      <p>
                        <strong>Materials:</strong> {ecomQuickProduct.material}
                      </p>
                      <p style={{ opacity: settings.mutedTextOpacity / 100 }}>{ecomQuickProduct.specs}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: borderColorStr }}>
                      <span className="font-mono text-[14px] font-bold tabular-nums">
                        {settings.currencySymbol}
                        {ecomQuickProduct.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          addEcomToCart(ecomQuickProduct);
                          setEcomQuickProduct(null);
                        }}
                        className={`cursor-pointer ${buttonPadClass}`}
                        style={ctaButtonStyle}
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* E-COMMERCE SLIDE-OVER CART DRAWER */}
              {ecomCartOpen && (
                <div className="absolute inset-0 z-40 bg-black/50 flex justify-end">
                  <div
                    className="w-full max-w-[300px] h-full border-l p-4 flex flex-col justify-between shadow-2xl"
                    style={{ backgroundColor: cardBgColor, borderColor: borderColorStr }}
                  >
                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: borderColorStr }}>
                      <span className="text-[13px] font-semibold">Shopping Bag ({ecomTotalCount})</span>
                      <button
                        type="button"
                        onClick={() => setEcomCartOpen(false)}
                        className="p-1 rounded hover:bg-current/10 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar">
                      {ecomOrderSuccess ? (
                        <div className="p-3 rounded-[8px] bg-emerald-500/15 border border-emerald-500/30 text-[11.5px] space-y-1">
                          <p className="font-semibold text-emerald-500 flex items-center gap-1.5">
                            <Check className="w-4 h-4" />
                            Order Confirmed
                          </p>
                          <p>{ecomOrderSuccess}</p>
                        </div>
                      ) : ecomCart.length === 0 ? (
                        <p className="text-[12px] py-8 text-center" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                          Your shopping bag is empty.
                        </p>
                      ) : (
                        ecomCart.map((item) => (
                          <div
                            key={item.key}
                            className="flex gap-2.5 items-center pb-2.5 border-b"
                            style={{ borderColor: borderColorStr }}
                          >
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-[6px] object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11.5px] font-semibold truncate">{item.name}</p>
                              <p className="text-[10px] truncate" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                                {item.variant}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEcomCart((prev) =>
                                        prev
                                          .map((p) => (p.key === item.key ? { ...p, qty: p.qty - 1 } : p))
                                          .filter((p) => p.qty > 0)
                                      )
                                    }
                                    className="w-5 h-5 rounded border border-current/15 flex items-center justify-center cursor-pointer"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="font-mono text-[11px] tabular-nums">{item.qty}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEcomCart((prev) =>
                                        prev.map((p) => (p.key === item.key ? { ...p, qty: p.qty + 1 } : p))
                                      )
                                    }
                                    className="w-5 h-5 rounded border border-current/15 flex items-center justify-center cursor-pointer"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                                <span className="font-mono text-[11px] font-semibold tabular-nums">
                                  {settings.currencySymbol}
                                  {(item.price * item.qty).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() => setEcomCart((prev) => prev.filter((p) => p.key !== item.key))}
                              className="opacity-50 hover:opacity-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {ecomCart.length > 0 && !ecomOrderSuccess && (
                      <div className="pt-3 border-t space-y-2.5" style={{ borderColor: borderColorStr }}>
                        {settings.showCheckoutCod && (
                          <div className="space-y-1.5 text-[11px]">
                            <input
                              type="text"
                              value={ecomCustomerName}
                              onChange={(e) => setEcomCustomerName(e.target.value)}
                              placeholder="Full Name"
                              style={{ borderColor: borderColorStr, borderRadius: `${settings.inputRadiusPx}px` }}
                              className="w-full px-2.5 py-1.5 border bg-transparent focus:outline-none"
                            />
                            <input
                              type="text"
                              value={ecomCustomerPhone}
                              onChange={(e) => setEcomCustomerPhone(e.target.value)}
                              placeholder="Phone / UPI Verify"
                              style={{ borderColor: borderColorStr, borderRadius: `${settings.inputRadiusPx}px` }}
                              className="w-full px-2.5 py-1.5 border bg-transparent focus:outline-none"
                            />
                          </div>
                        )}
                        <div className="flex justify-between text-[12px] font-semibold">
                          <span>
                            {ecomSubtotal >= settings.freeShippingThreshold ? 'Subtotal (Free Express)' : 'Subtotal (+₹450 Ship)'}
                          </span>
                          <span className="font-mono tabular-nums">
                            {settings.currencySymbol}
                            {ecomSubtotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEcomOrderSuccess(
                              `Order #AU-${Math.floor(1000 + Math.random() * 8999)} confirmed for ${ecomCustomerName || 'Customer'}.`
                            );
                            setEcomCart([]);
                          }}
                          className={`w-full cursor-pointer ${buttonPadClass}`}
                          style={ctaButtonStyle}
                        >
                          Place Order · {settings.currencySymbol}
                          {ecomSubtotal.toLocaleString('en-IN')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CLOTHING SIZE GUIDE MODAL */}
              {clothSizeGuideOpen && (
                <div className="absolute inset-0 z-30 bg-black/65 backdrop-blur-xs p-4 flex items-center justify-center">
                  <div
                    className="w-full max-w-[350px] border p-4 shadow-2xl space-y-3"
                    style={{
                      backgroundColor: cardBgColor,
                      borderColor: borderColorStr,
                      borderRadius: `${settings.cardRadiusPx}px`,
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: borderColorStr }}>
                      <span className="text-[13px] font-semibold">Atelier Garment Measurements (cm)</span>
                      <button
                        type="button"
                        onClick={() => setClothSizeGuideOpen(false)}
                        className="p-1 rounded hover:bg-current/10 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <table className="w-full text-left font-mono text-[11px] tabular-nums">
                      <thead>
                        <tr className="border-b" style={{ borderColor: borderColorStr }}>
                          <th className="py-1.5">Size</th>
                          <th className="py-1.5">Chest</th>
                          <th className="py-1.5">Shoulder</th>
                          <th className="py-1.5">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['S', '112', '48', '70'],
                          ['M', '118', '50', '72'],
                          ['L', '124', '52', '74'],
                          ['XL', '130', '54', '76'],
                        ].map((row) => (
                          <tr key={row[0]} className="border-b" style={{ borderColor: borderColorStr }}>
                            <td className="py-1.5 font-bold">{row[0]}</td>
                            <td className="py-1.5">{row[1]} cm</td>
                            <td className="py-1.5">{row[2]} cm</td>
                            <td className="py-1.5">{row[3]} cm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CLOTHING WARDROBE BAG DRAWER */}
              {clothCartOpen && (
                <div className="absolute inset-0 z-40 bg-black/50 flex justify-end">
                  <div
                    className="w-full max-w-[290px] h-full border-l p-4 flex flex-col justify-between shadow-2xl"
                    style={{ backgroundColor: cardBgColor, borderColor: borderColorStr }}
                  >
                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: borderColorStr }}>
                      <span className="text-[13px] font-semibold">Selected Wardrobe ({clothTotalCount})</span>
                      <button
                        type="button"
                        onClick={() => setClothCartOpen(false)}
                        className="p-1 rounded hover:bg-current/10 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar">
                      {clothOrderRef ? (
                        <div className="p-3 rounded-[8px] bg-emerald-500/15 border border-emerald-500/30 text-[11.5px] space-y-1">
                          <p className="font-semibold text-emerald-500">Order Confirmed · {clothOrderRef}</p>
                          <p>Dispatched via express garment courier within 24 hours.</p>
                        </div>
                      ) : clothCart.length === 0 ? (
                        <p className="text-[12px] py-8 text-center" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                          No garments selected yet.
                        </p>
                      ) : (
                        clothCart.map((entry) => (
                          <div
                            key={entry.key}
                            className="flex gap-2.5 items-center pb-2.5 border-b"
                            style={{ borderColor: borderColorStr }}
                          >
                            <img src={entry.image} alt={entry.name} className="w-11 h-12 rounded-[6px] object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11.5px] font-semibold truncate">{entry.name}</p>
                              <p className="text-[10px] font-mono" style={{ opacity: settings.mutedTextOpacity / 100 }}>
                                {entry.variant}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-mono text-[11px] tabular-nums">Qty: {entry.qty}</span>
                                <span className="font-mono text-[11px] font-semibold tabular-nums">
                                  {settings.currencySymbol}
                                  {(entry.price * entry.qty).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {clothCart.length > 0 && !clothOrderRef && (
                      <div className="pt-3 border-t space-y-2.5" style={{ borderColor: borderColorStr }}>
                        <div className="flex justify-between text-[12px] font-semibold">
                          <span>Total Bag</span>
                          <span className="font-mono tabular-nums">
                            {settings.currencySymbol}
                            {clothSubtotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setClothOrderRef(`#AV-${Math.floor(4100 + Math.random() * 5000)}`);
                            setClothCart([]);
                          }}
                          className={`w-full cursor-pointer ${buttonPadClass}`}
                          style={ctaButtonStyle}
                        >
                          Checkout Lookbook →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT INSPECTOR COLUMN: 105-SETTING DESIGN SYSTEM STUDIO */}
      {!expandedStage && (
        <WebStudioInspectorPanel
          siteType={siteType}
          device={device}
          theme={theme}
          settings={settings}
          onUpdate={updateSetting}
          onApplyPreset={applyPreset}
          onReset={handleResetAll}
          onSwitchSite={handleSiteSwitch}
          onNavigate={onNavigate}
          ecomSubtotal={ecomSubtotal}
          clothSubtotal={clothSubtotal}
          staticLeadScope={staticLeadScope}
        />
      )}
    </div>
  );
}
