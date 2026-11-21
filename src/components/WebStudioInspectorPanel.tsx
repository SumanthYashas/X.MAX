import { useMemo, useState } from 'react';
import { Copy, Download, RotateCcw, Search, Sliders } from 'lucide-react';
import { PageRoute } from '../types/routing';
import {
  STUDIO_STYLE_PRESETS,
  StudioThemePreset,
  WebDeviceType,
  WebSiteType,
  WebStudioSettings,
} from '../types/webStudioConfig';

interface WebStudioInspectorPanelProps {
  siteType: WebSiteType;
  device: WebDeviceType;
  theme: 'light' | 'dark';
  settings: WebStudioSettings;
  onUpdate: <K extends keyof WebStudioSettings>(key: K, value: WebStudioSettings[K]) => void;
  onApplyPreset: (preset: StudioThemePreset) => void;
  onReset: () => void;
  onSwitchSite: (site: WebSiteType) => void;
  onNavigate: (route: PageRoute) => void;
  ecomSubtotal: number;
  clothSubtotal: number;
  staticLeadScope: string;
}

type CategoryId =
  | 'all'
  | 'brand'
  | 'colors'
  | 'typography'
  | 'grid'
  | 'cards'
  | 'buttons'
  | 'media'
  | 'features';

type SettingControlDef =
  | {
      type: 'text' | 'textarea';
      key: keyof WebStudioSettings;
      label: string;
      category: Exclude<CategoryId, 'all'>;
    }
  | {
      type: 'number' | 'range';
      key: keyof WebStudioSettings;
      label: string;
      category: Exclude<CategoryId, 'all'>;
      min: number;
      max: number;
      step?: number;
      unit?: string;
    }
  | {
      type: 'color';
      key: keyof WebStudioSettings;
      label: string;
      category: Exclude<CategoryId, 'all'>;
    }
  | {
      type: 'boolean';
      key: keyof WebStudioSettings;
      label: string;
      category: Exclude<CategoryId, 'all'>;
    }
  | {
      type: 'select';
      key: keyof WebStudioSettings;
      label: string;
      category: Exclude<CategoryId, 'all'>;
      options: Array<{ value: string | number; label: string }>;
    };

const SETTING_CONTROLS: SettingControlDef[] = [
  // === 1. BRAND & COPYWRITING (15) ===
  { type: 'text', key: 'brandName', label: 'Brand Wordmark', category: 'brand' },
  { type: 'text', key: 'brandTagline', label: 'Brand Subtitle Tag', category: 'brand' },
  { type: 'text', key: 'heroKicker', label: 'Hero Eyebrow Kicker', category: 'brand' },
  { type: 'text', key: 'heroHeadline', label: 'Hero H1 Headline', category: 'brand' },
  { type: 'textarea', key: 'heroSubline', label: 'Hero Subline Copy', category: 'brand' },
  { type: 'text', key: 'ctaLabel', label: 'Primary CTA Text', category: 'brand' },
  { type: 'text', key: 'secondaryCtaLabel', label: 'Secondary CTA Text', category: 'brand' },
  { type: 'boolean', key: 'showAnnouncementBar', label: 'Show Promo Announcement Bar', category: 'brand' },
  { type: 'text', key: 'announcementText', label: 'Announcement Copy', category: 'brand' },
  { type: 'text', key: 'collectionTitle', label: 'Section H2 Title', category: 'brand' },
  { type: 'text', key: 'collectionSubtitle', label: 'Section Subtitle', category: 'brand' },
  { type: 'text', key: 'footerCopyright', label: 'Footer Legal Line', category: 'brand' },
  { type: 'text', key: 'footerBadgeText', label: 'Footer Trust Text', category: 'brand' },
  {
    type: 'select',
    key: 'currencySymbol',
    label: 'Store Currency',
    category: 'brand',
    options: [
      { value: '₹', label: '₹ INR' },
      { value: '$', label: '$ USD' },
      { value: '€', label: '€ EUR' },
      { value: '£', label: '£ GBP' },
    ],
  },
  { type: 'range', key: 'freeShippingThreshold', label: 'Free Dispatch Min', category: 'brand', min: 0, max: 30000, step: 1000 },

  // === 2. COLORS & SURFACE PALETTE (16) ===
  { type: 'color', key: 'accentColor', label: 'Primary Accent Color', category: 'colors' },
  { type: 'color', key: 'secondaryAccent', label: 'Secondary Accent', category: 'colors' },
  { type: 'color', key: 'canvasBgLight', label: 'Light Canvas Background', category: 'colors' },
  { type: 'color', key: 'canvasBgDark', label: 'Dark Canvas Background', category: 'colors' },
  { type: 'color', key: 'cardBgLight', label: 'Light Card Surface', category: 'colors' },
  { type: 'color', key: 'cardBgDark', label: 'Dark Card Surface', category: 'colors' },
  { type: 'color', key: 'textPrimaryLight', label: 'Light Primary Ink', category: 'colors' },
  { type: 'color', key: 'textPrimaryDark', label: 'Dark Primary Ink', category: 'colors' },
  { type: 'range', key: 'mutedTextOpacity', label: 'Muted Text Opacity', category: 'colors', min: 35, max: 90, step: 5, unit: '%' },
  { type: 'range', key: 'borderOpacity', label: 'Border Line Opacity', category: 'colors', min: 0, max: 50, step: 2, unit: '%' },
  { type: 'range', key: 'headerBgOpacity', label: 'Header Opacity', category: 'colors', min: 50, max: 100, step: 5, unit: '%' },
  { type: 'range', key: 'headerBlurPx', label: 'Header Backdrop Blur', category: 'colors', min: 0, max: 24, step: 2, unit: 'px' },
  { type: 'range', key: 'heroScrimOpacity', label: 'Hero Media Scrim', category: 'colors', min: 10, max: 95, step: 5, unit: '%' },
  {
    type: 'select',
    key: 'buttonTextColor',
    label: 'CTA Text Contrast',
    category: 'colors',
    options: [
      { value: 'auto', label: 'Auto' },
      { value: '#ffffff', label: 'White' },
      { value: '#111418', label: 'Dark' },
    ],
  },
  { type: 'color', key: 'badgeBgColor', label: 'Announcement Tint', category: 'colors' },
  { type: 'boolean', key: 'footerBgTint', label: 'Tinted Footer Band', category: 'colors' },

  // === 3. TYPOGRAPHY & TYPE SCALE (14) ===
  {
    type: 'select',
    key: 'headingFont',
    label: 'Heading Font Family',
    category: 'typography',
    options: [
      { value: 'Plus Jakarta Sans', label: 'Jakarta' },
      { value: 'Archivo', label: 'Archivo' },
      { value: 'Playfair Display', label: 'Playfair' },
      { value: 'Space Mono', label: 'Space Mono' },
    ],
  },
  {
    type: 'select',
    key: 'bodyFont',
    label: 'Body Font Family',
    category: 'typography',
    options: [
      { value: 'Plus Jakarta Sans', label: 'Jakarta' },
      { value: 'DM Sans', label: 'DM Sans' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'IBM Plex Mono', label: 'IBM Mono' },
    ],
  },
  { type: 'range', key: 'heroTitleSizePx', label: 'Hero Heading Size', category: 'typography', min: 16, max: 36, step: 1, unit: 'px' },
  {
    type: 'select',
    key: 'heroTitleWeight',
    label: 'Hero Heading Weight',
    category: 'typography',
    options: [
      { value: 400, label: '400' },
      { value: 500, label: '500' },
      { value: 600, label: '600' },
      { value: 700, label: '700' },
      { value: 800, label: '800' },
    ],
  },
  { type: 'range', key: 'heroTrackingEm', label: 'Hero Letter Tracking', category: 'typography', min: -0.05, max: 0.1, step: 0.01, unit: 'em' },
  { type: 'range', key: 'heroLineHeight', label: 'Hero Line Height', category: 'typography', min: 0.95, max: 1.5, step: 0.05 },
  { type: 'boolean', key: 'heroUppercase', label: 'Uppercase Display Title', category: 'typography' },
  {
    type: 'select',
    key: 'heroTextAlign',
    label: 'Hero Alignment',
    category: 'typography',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
  { type: 'range', key: 'bodySizePx', label: 'Body Copy Size', category: 'typography', min: 10, max: 15, step: 0.5, unit: 'px' },
  { type: 'range', key: 'bodyLineHeight', label: 'Body Line Height', category: 'typography', min: 1.2, max: 1.9, step: 0.05 },
  { type: 'range', key: 'sectionTitleSizePx', label: 'Section Title Size', category: 'typography', min: 12, max: 22, step: 1, unit: 'px' },
  { type: 'range', key: 'cardTitleSizePx', label: 'Card Title Size', category: 'typography', min: 11, max: 18, step: 0.5, unit: 'px' },
  {
    type: 'select',
    key: 'priceFontStyle',
    label: 'Price Typeface Style',
    category: 'typography',
    options: [
      { value: 'mono', label: 'Mono' },
      { value: 'sans', label: 'Sans' },
      { value: 'serif', label: 'Serif' },
    ],
  },
  { type: 'boolean', key: 'tabularNumerals', label: 'Tabular Lining Numerals', category: 'typography' },

  // === 4. RESPONSIVE GRID & LAYOUT GEOMETRY (14) ===
  {
    type: 'select',
    key: 'desktopCols',
    label: 'Desktop Grid Columns (1440px)',
    category: 'grid',
    options: [
      { value: 2, label: '2 Cols' },
      { value: 3, label: '3 Cols' },
      { value: 4, label: '4 Cols' },
    ],
  },
  {
    type: 'select',
    key: 'tabletCols',
    label: 'Tablet Grid Columns (768px)',
    category: 'grid',
    options: [
      { value: 1, label: '1 Col' },
      { value: 2, label: '2 Cols' },
      { value: 3, label: '3 Cols' },
    ],
  },
  {
    type: 'select',
    key: 'mobileCols',
    label: 'Mobile Grid Columns (375px)',
    category: 'grid',
    options: [
      { value: 1, label: '1 Col' },
      { value: 2, label: '2 Cols' },
    ],
  },
  { type: 'range', key: 'gridGapPx', label: 'Grid Gutter Gap', category: 'grid', min: 6, max: 28, step: 2, unit: 'px' },
  { type: 'range', key: 'containerPadPx', label: 'Container Side Padding', category: 'grid', min: 8, max: 32, step: 2, unit: 'px' },
  { type: 'range', key: 'sectionPadY', label: 'Section Vertical Padding', category: 'grid', min: 10, max: 36, step: 2, unit: 'px' },
  {
    type: 'select',
    key: 'maxContainerWidth',
    label: 'Content Container Measure',
    category: 'grid',
    options: [
      { value: 'full', label: 'Full Bleed' },
      { value: '1200px', label: '1200px' },
      { value: '960px', label: '960px' },
    ],
  },
  {
    type: 'select',
    key: 'heroLayoutMode',
    label: 'Hero Structure Mode',
    category: 'grid',
    options: [
      { value: 'split', label: 'Split 50/50' },
      { value: 'stacked', label: 'Stacked' },
      { value: 'overlay', label: 'Full Overlay' },
    ],
  },
  { type: 'range', key: 'heroMinHeightPx', label: 'Hero Banner Height', category: 'grid', min: 140, max: 300, step: 10, unit: 'px' },
  { type: 'boolean', key: 'headerSticky', label: 'Sticky Navigation Header', category: 'grid' },
  { type: 'range', key: 'headerHeightPx', label: 'Navbar Height', category: 'grid', min: 38, max: 66, step: 2, unit: 'px' },
  {
    type: 'select',
    key: 'navAlignment',
    label: 'Nav Links Alignment',
    category: 'grid',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
  {
    type: 'select',
    key: 'cardAspectRatio',
    label: 'Product Image Ratio',
    category: 'grid',
    options: [
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '16:10', label: '16:10' },
    ],
  },
  { type: 'boolean', key: 'cardEqualHeight', label: 'Equal Row Height Stretch', category: 'grid' },

  // === 5. CARDS, BORDERS & SHADOWS (12) ===
  { type: 'range', key: 'cardRadiusPx', label: 'Card Corner Radius', category: 'cards', min: 0, max: 24, step: 2, unit: 'px' },
  { type: 'range', key: 'imageRadiusPx', label: 'Inner Image Radius', category: 'cards', min: 0, max: 20, step: 2, unit: 'px' },
  { type: 'range', key: 'cardBorderWidthPx', label: 'Card Border Thickness', category: 'cards', min: 0, max: 3, step: 1, unit: 'px' },
  { type: 'range', key: 'cardPaddingPx', label: 'Card Content Padding', category: 'cards', min: 6, max: 20, step: 2, unit: 'px' },
  {
    type: 'select',
    key: 'cardShadowLevel',
    label: 'Card Shadow Elevation',
    category: 'cards',
    options: [
      { value: 'none', label: 'None' },
      { value: 'subtle', label: 'Subtle' },
      { value: 'medium', label: 'Medium' },
      { value: 'elevated', label: 'Elevated' },
    ],
  },
  { type: 'boolean', key: 'cardHoverLift', label: 'Hover Lift Animation', category: 'cards' },
  { type: 'boolean', key: 'imageHoverZoom', label: 'Image Hover Scale', category: 'cards' },
  { type: 'boolean', key: 'showCardBorder', label: 'Show Card Outline Border', category: 'cards' },
  { type: 'boolean', key: 'showCardCategory', label: 'Show Category Eyebrow', category: 'cards' },
  { type: 'boolean', key: 'showCardSpecs', label: 'Show Product Specs Line', category: 'cards' },
  { type: 'boolean', key: 'showCardPrice', label: 'Show Card Pricing', category: 'cards' },
  { type: 'boolean', key: 'cardFooterDivider', label: 'Card Price Divider Line', category: 'cards' },

  // === 6. BUTTONS & CONTROLS (12) ===
  { type: 'range', key: 'buttonRadiusPx', label: 'Button Corner Radius', category: 'buttons', min: 0, max: 32, step: 2, unit: 'px' },
  {
    type: 'select',
    key: 'buttonStyle',
    label: 'Button Visual Style',
    category: 'buttons',
    options: [
      { value: 'solid', label: 'Solid Fill' },
      { value: 'outline', label: 'Outline' },
      { value: 'tinted', label: 'Tinted' },
    ],
  },
  {
    type: 'select',
    key: 'buttonSize',
    label: 'Button Density Size',
    category: 'buttons',
    options: [
      { value: 'compact', label: 'Compact' },
      { value: 'standard', label: 'Standard' },
      { value: 'large', label: 'Large' },
    ],
  },
  { type: 'boolean', key: 'buttonUppercase', label: 'Uppercase Button Text', category: 'buttons' },
  {
    type: 'select',
    key: 'buttonFontWeight',
    label: 'Button Font Weight',
    category: 'buttons',
    options: [
      { value: 500, label: '500' },
      { value: 600, label: '600' },
      { value: 700, label: '700' },
    ],
  },
  { type: 'boolean', key: 'buttonShowArrow', label: 'Include CTA Arrow Icon', category: 'buttons' },
  { type: 'boolean', key: 'buttonHoverScale', label: 'Hover Button Scale', category: 'buttons' },
  { type: 'boolean', key: 'buttonShadow', label: 'Drop Shadow on Primary CTA', category: 'buttons' },
  { type: 'range', key: 'inputRadiusPx', label: 'Form & Search Input Radius', category: 'buttons', min: 0, max: 20, step: 2, unit: 'px' },
  { type: 'boolean', key: 'showWishlistHeart', label: 'Show Wishlist Heart Button', category: 'buttons' },
  { type: 'boolean', key: 'showQuickAddBtn', label: 'Show Quick + Add Action', category: 'buttons' },
  { type: 'boolean', key: 'showSearchBar', label: 'Show Catalog Search Box', category: 'buttons' },

  // === 7. MEDIA EFFECTS & IMAGE GRADING (10) ===
  { type: 'range', key: 'imgBrightness', label: 'Image Brightness', category: 'media', min: 70, max: 130, step: 5, unit: '%' },
  { type: 'range', key: 'imgContrast', label: 'Image Contrast', category: 'media', min: 80, max: 145, step: 5, unit: '%' },
  { type: 'range', key: 'imgSaturate', label: 'Image Saturation', category: 'media', min: 0, max: 160, step: 5, unit: '%' },
  { type: 'range', key: 'imgGrayscale', label: 'Monochrome Grayscale', category: 'media', min: 0, max: 100, step: 10, unit: '%' },
  { type: 'range', key: 'imgSepia', label: 'Warm Sepia Tone', category: 'media', min: 0, max: 60, step: 5, unit: '%' },
  {
    type: 'select',
    key: 'imgObjectFit',
    label: 'Image Fit Mode',
    category: 'media',
    options: [
      { value: 'cover', label: 'Cover' },
      { value: 'contain', label: 'Contain' },
    ],
  },
  {
    type: 'select',
    key: 'imgFocalPosition',
    label: 'Image Focal Crop Anchor',
    category: 'media',
    options: [
      { value: 'top', label: 'Top' },
      { value: 'center', label: 'Center' },
      { value: 'bottom', label: 'Bottom' },
    ],
  },
  { type: 'range', key: 'heroImageScale', label: 'Hero Image Zoom Scale', category: 'media', min: 100, max: 125, step: 5, unit: '%' },
  { type: 'boolean', key: 'showHeroImage', label: 'Display Hero Media Frame', category: 'media' },
  { type: 'boolean', key: 'overlayGridTexture', label: 'Subtle Architectural Grid Overlay', category: 'media' },

  // === 8. COMMERCE, NAVIGATION & ACCESSIBILITY (12) ===
  { type: 'boolean', key: 'showCartButton', label: 'Show Bag / Cart Header Action', category: 'features' },
  { type: 'boolean', key: 'showCheckoutCod', label: 'Enable COD & UPI Checkout Form', category: 'features' },
  { type: 'boolean', key: 'enableWishlistBadge', label: 'Show Saved Count in Header', category: 'features' },
  { type: 'boolean', key: 'showSizeGuideLink', label: 'Show Apparel Size Guide Link', category: 'features' },
  { type: 'boolean', key: 'showColorSwatches', label: 'Show Apparel Color Swatches', category: 'features' },
  { type: 'boolean', key: 'showStockStatus', label: 'Show In-Stock Indicator', category: 'features' },
  { type: 'boolean', key: 'showNavLinks', label: 'Show Top Navbar Links', category: 'features' },
  { type: 'boolean', key: 'showMobileHamburger', label: 'Mobile Drawer Menu Toggle', category: 'features' },
  { type: 'boolean', key: 'showFooter', label: 'Render Footer Section', category: 'features' },
  { type: 'boolean', key: 'smoothScroll', label: 'Smooth Viewport Scrolling', category: 'features' },
  { type: 'boolean', key: 'highContrastBorders', label: 'Accessibility High-Contrast Borders', category: 'features' },
  { type: 'boolean', key: 'compactMobileMode', label: 'Compact Mobile Density (375px)', category: 'features' },
];

const CATEGORY_TABS: Array<{ id: CategoryId; label: string }> = [
  { id: 'all', label: `All (${SETTING_CONTROLS.length})` },
  { id: 'brand', label: 'Brand' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Type' },
  { id: 'grid', label: 'Grid' },
  { id: 'cards', label: 'Cards' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'media', label: 'Media' },
  { id: 'features', label: 'Features' },
];

export function WebStudioInspectorPanel({
  siteType,
  device,
  theme,
  settings,
  onUpdate,
  onApplyPreset,
  onReset,
  onSwitchSite,
  onNavigate,
  ecomSubtotal,
  clothSubtotal,
  staticLeadScope,
}: WebStudioInspectorPanelProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectorView, setInspectorView] = useState<'controls' | 'code'>('controls');
  const [codeTab, setCodeTab] = useState<'Page.tsx' | 'tokens.css' | 'theme.config.json'>('Page.tsx');
  const [notice, setNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2600);
  };

  const filteredControls = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SETTING_CONTROLS.filter((ctrl) => {
      const catOk = activeCategory === 'all' || ctrl.category === activeCategory;
      const queryOk = !q || ctrl.label.toLowerCase().includes(q) || String(ctrl.key).toLowerCase().includes(q);
      return catOk && queryOk;
    });
  }, [activeCategory, searchQuery]);

  const liveCodeSnippet = useMemo(() => {
    if (codeTab === 'theme.config.json') {
      return JSON.stringify(
        {
          archetype: siteType,
          activeViewport: device,
          themeMode: theme,
          totalConfigurableProperties: SETTING_CONTROLS.length,
          tokens: {
            accentColor: settings.accentColor,
            headingFont: settings.headingFont,
            bodyFont: settings.bodyFont,
            cardRadiusPx: settings.cardRadiusPx,
            buttonRadiusPx: settings.buttonRadiusPx,
            grid: {
              desktopCols: settings.desktopCols,
              tabletCols: settings.tabletCols,
              mobileCols: settings.mobileCols,
              gapPx: settings.gridGapPx,
            },
          },
        },
        null,
        2
      );
    }
    if (codeTab === 'tokens.css') {
      return `:root {
  --brand-accent: ${settings.accentColor};
  --font-heading: "${settings.headingFont}", sans-serif;
  --font-body: "${settings.bodyFont}", sans-serif;
  --card-radius: ${settings.cardRadiusPx}px;
  --button-radius: ${settings.buttonRadiusPx}px;
  --grid-gap: ${settings.gridGapPx}px;
  --container-pad: ${settings.containerPadPx}px;
}`;
    }
    const subtotal = siteType === 'ecommerce' ? ecomSubtotal : clothSubtotal;
    return `// ${SETTING_CONTROLS.length} Active Studio Properties Bound
export function LiveGeneratedPage() {
  return (
    <ThemeProvider accent="${settings.accentColor}" mode="${theme}">
      <Navbar brand="${settings.brandName}" sticky={${settings.headerSticky}} />
      <Hero layout="${settings.heroLayoutMode}" title="${settings.heroHeadline}" />
      <ResponsiveGrid cols={{ lg: ${settings.desktopCols}, md: ${settings.tabletCols}, sm: ${settings.mobileCols} }} gap={${settings.gridGapPx}}>
        {/* ${siteType === 'static' ? `Lead Scope: ${staticLeadScope}` : `Subtotal: ${settings.currencySymbol}${subtotal.toLocaleString('en-IN')}`} */}
      </ResponsiveGrid>
    </ThemeProvider>
  );
}`;
  }, [codeTab, siteType, device, theme, settings, ecomSubtotal, clothSubtotal, staticLeadScope]);

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(liveCodeSnippet).catch(() => {});
    }
    showToast(`Copied ${codeTab}`);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xmax_${siteType}_theme_105_settings.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON Config');
  };

  return (
    <div className="lg:col-span-4 rounded-[16px] bg-white/[0.04] border border-white/10 p-4 sm:p-5 flex flex-col justify-between gap-4 lg:max-h-[700px]">
      {/* Header Row */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-white">Design System Studio</span>
              <span className="font-mono text-[10px] text-[#10B981] font-semibold tabular-nums">
                {SETTING_CONTROLS.length} Settings
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/50">
              Live Sync · {device === 'desktop' ? '1440px' : device === 'tablet' ? '768px' : '375px'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {notice && <span className="font-mono text-[10px] text-emerald-400">{notice}</span>}
            <button
              type="button"
              onClick={onReset}
              title="Reset all settings to defaults"
              className="p-1.5 rounded-[7px] bg-white/8 hover:bg-white/15 text-white/75 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Archetype Switcher + Inspector Mode Switch */}
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-[8px] flex-1 text-[10.5px]">
            {(
              [
                { id: 'ecommerce', label: 'E-Com' },
                { id: 'clothing', label: 'Clothing' },
                { id: 'static', label: 'Static' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSwitchSite(item.id)}
                className={`py-1 px-1.5 rounded-[5px] font-medium transition-colors cursor-pointer ${
                  siteType === item.id ? 'bg-[#10B981] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setInspectorView((v) => (v === 'controls' ? 'code' : 'controls'))}
            className="px-2.5 py-1.5 rounded-[7px] bg-white/10 hover:bg-white/20 text-white font-mono text-[10.5px] cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sliders className="w-3 h-3 text-[#10B981]" />
            {inspectorView === 'controls' ? 'View Code' : '105 Controls'}
          </button>
        </div>

        {/* One-Click Theme Style Presets */}
        <div>
          <span className="block text-[10px] font-mono text-white/45 mb-1">Quick Theme Presets</span>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            {STUDIO_STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onApplyPreset(preset);
                  showToast(`Applied ${preset.label}`);
                }}
                className="py-1.5 px-1 rounded-[6px] bg-white/5 hover:bg-white/15 border border-white/8 text-white/80 font-medium truncate cursor-pointer transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Filter Search + Category Strip */}
        {inspectorView === 'controls' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] bg-[#0c0e12] border border-white/15">
              <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${SETTING_CONTROLS.length} customizable settings...`}
                className="w-full bg-transparent text-[11.5px] text-white focus:outline-none placeholder:text-white/35"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] font-mono text-white/50 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-[6px] text-[10.5px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-white text-[#111418] font-semibold'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SCROLLABLE BODY: EITHER LIVE 105 CONTROLS OR GENERATED CODE */}
      {inspectorView === 'controls' ? (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[380px] sm:max-h-[420px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-3 gap-y-2.5 content-start">
          {filteredControls.length === 0 ? (
            <p className="text-[12px] text-white/50 text-center py-6 col-span-full">
              No settings match &ldquo;{searchQuery}&rdquo;.
            </p>
          ) : (
            filteredControls.map((ctrl) => {
              const rawVal = settings[ctrl.key];

              if (ctrl.type === 'boolean') {
                const boolVal = Boolean(rawVal);
                return (
                  <div
                    key={ctrl.key}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-[8px] bg-black/25 border border-white/8"
                  >
                    <span className="text-[11px] text-white/85 truncate">{ctrl.label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={boolVal}
                      onClick={() => onUpdate(ctrl.key, (!boolVal) as WebStudioSettings[typeof ctrl.key])}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 flex items-center ${
                        boolVal ? 'bg-[#10B981] justify-end' : 'bg-white/15 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                );
              }

              if (ctrl.type === 'range') {
                const numVal = Number(rawVal);
                return (
                  <div key={ctrl.key} className="px-3 py-2 rounded-[8px] bg-black/25 border border-white/8 space-y-1">
                    <div className="flex items-center justify-between text-[10.5px] font-mono">
                      <span className="text-white/80 font-sans truncate">{ctrl.label}</span>
                      <span className="text-[#10B981] tabular-nums shrink-0">
                        {numVal}
                        {ctrl.unit ?? ''}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={ctrl.min}
                      max={ctrl.max}
                      step={ctrl.step ?? 1}
                      value={numVal}
                      onChange={(e) => onUpdate(ctrl.key, Number(e.target.value) as WebStudioSettings[typeof ctrl.key])}
                      className="w-full accent-[#10B981] cursor-pointer h-1.5"
                    />
                  </div>
                );
              }

              if (ctrl.type === 'color') {
                const strVal = String(rawVal);
                return (
                  <div
                    key={ctrl.key}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-[8px] bg-black/25 border border-white/8"
                  >
                    <span className="text-[11px] text-white/85 truncate">{ctrl.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10px] text-white/55 uppercase">{strVal}</span>
                      <input
                        type="color"
                        value={strVal}
                        onChange={(e) => onUpdate(ctrl.key, e.target.value as WebStudioSettings[typeof ctrl.key])}
                        className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer p-0"
                      />
                    </div>
                  </div>
                );
              }

              if (ctrl.type === 'select') {
                return (
                  <div key={ctrl.key} className="px-3 py-2 rounded-[8px] bg-black/25 border border-white/8 space-y-1.5">
                    <span className="block text-[10.5px] text-white/75">{ctrl.label}</span>
                    <div className="flex flex-wrap gap-1">
                      {ctrl.options.map((opt) => {
                        const active = String(rawVal) === String(opt.value);
                        return (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => onUpdate(ctrl.key, opt.value as WebStudioSettings[typeof ctrl.key])}
                            className={`px-2 py-1 rounded-[5px] text-[10px] font-mono cursor-pointer transition-colors ${
                              active
                                ? 'bg-[#10B981] text-white font-semibold'
                                : 'bg-white/8 text-white/65 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (ctrl.type === 'textarea') {
                return (
                  <div key={ctrl.key} className="px-3 py-2 rounded-[8px] bg-black/25 border border-white/8 space-y-1">
                    <span className="block text-[10.5px] font-mono text-white/60">{ctrl.label}</span>
                    <textarea
                      rows={2}
                      value={String(rawVal)}
                      onChange={(e) => onUpdate(ctrl.key, e.target.value as WebStudioSettings[typeof ctrl.key])}
                      className="w-full px-2 py-1 rounded-[6px] bg-[#0c0e12] border border-white/12 text-[11px] text-white focus:border-[#10B981] focus:outline-none resize-none"
                    />
                  </div>
                );
              }

              return (
                <div key={ctrl.key} className="px-3 py-2 rounded-[8px] bg-black/25 border border-white/8 space-y-1">
                  <span className="block text-[10.5px] font-mono text-white/60">{ctrl.label}</span>
                  <input
                    type="text"
                    value={String(rawVal)}
                    onChange={(e) => onUpdate(ctrl.key, e.target.value as WebStudioSettings[typeof ctrl.key])}
                    className="w-full px-2 py-1 rounded-[6px] bg-[#0c0e12] border border-white/12 text-[11.5px] text-white focus:border-[#10B981] focus:outline-none"
                  />
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2 min-h-[300px]">
          <div className="flex items-center gap-1 text-[10.5px] font-mono">
            {(['Page.tsx', 'tokens.css', 'theme.config.json'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCodeTab(tab)}
                className={`px-2 py-1 rounded-[5px] transition-colors cursor-pointer ${
                  codeTab === tab ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <pre className="flex-1 p-3 rounded-[8px] bg-[#0b0c10] border border-white/10 font-mono text-[10px] leading-relaxed text-emerald-300/90 overflow-auto max-h-[340px]">
            {liveCodeSnippet}
          </pre>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[9px] bg-[#10B981]/20 text-[#34d399] border border-[#10B981]/40 text-[12px] font-medium hover:bg-[#10B981]/30 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Code
        </button>
        <button
          type="button"
          onClick={handleDownloadJson}
          title="Download 105-setting JSON theme schema"
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[9px] bg-white/8 hover:bg-white/15 text-white text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          JSON
        </button>
        <button
          type="button"
          onClick={() => onNavigate('pricing')}
          className="text-[12px] text-white/60 hover:text-white underline cursor-pointer whitespace-nowrap shrink-0 pl-1"
        >
          Rates →
        </button>
      </div>
    </div>
  );
}
