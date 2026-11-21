export type WebSiteType = 'ecommerce' | 'clothing' | 'static';
export type WebDeviceType = 'desktop' | 'tablet' | 'mobile';

export interface WebStudioSettings {
  // 1. Brand & Copywriting (15)
  brandName: string;
  brandTagline: string;
  heroKicker: string;
  heroHeadline: string;
  heroSubline: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  announcementText: string;
  showAnnouncementBar: boolean;
  collectionTitle: string;
  collectionSubtitle: string;
  footerCopyright: string;
  footerBadgeText: string;
  currencySymbol: '₹' | '$' | '€' | '£';
  freeShippingThreshold: number;

  // 2. Colors & Surface Palette (16)
  accentColor: string;
  secondaryAccent: string;
  canvasBgLight: string;
  canvasBgDark: string;
  cardBgLight: string;
  cardBgDark: string;
  textPrimaryLight: string;
  textPrimaryDark: string;
  mutedTextOpacity: number;
  borderOpacity: number;
  headerBgOpacity: number;
  headerBlurPx: number;
  heroScrimOpacity: number;
  buttonTextColor: 'auto' | '#ffffff' | '#111418';
  badgeBgColor: string;
  footerBgTint: boolean;

  // 3. Typography & Type Scale (14)
  headingFont: 'Archivo' | 'Plus Jakarta Sans' | 'Playfair Display' | 'Space Mono';
  bodyFont: 'Plus Jakarta Sans' | 'DM Sans' | 'Georgia' | 'IBM Plex Mono';
  heroTitleSizePx: number;
  heroTitleWeight: 400 | 500 | 600 | 700 | 800;
  heroTrackingEm: number;
  heroLineHeight: number;
  heroUppercase: boolean;
  heroTextAlign: 'left' | 'center' | 'right';
  bodySizePx: number;
  bodyLineHeight: number;
  sectionTitleSizePx: number;
  cardTitleSizePx: number;
  priceFontStyle: 'mono' | 'sans' | 'serif';
  tabularNumerals: boolean;

  // 4. Responsive Grid & Layout Geometry (14)
  desktopCols: 2 | 3 | 4;
  tabletCols: 1 | 2 | 3;
  mobileCols: 1 | 2;
  gridGapPx: number;
  containerPadPx: number;
  sectionPadY: number;
  maxContainerWidth: 'full' | '1200px' | '960px';
  heroLayoutMode: 'split' | 'stacked' | 'overlay';
  heroMinHeightPx: number;
  headerSticky: boolean;
  headerHeightPx: number;
  navAlignment: 'center' | 'left' | 'right';
  cardAspectRatio: '1:1' | '4:3' | '3:4' | '16:10';
  cardEqualHeight: boolean;

  // 5. Cards, Borders & Shadows (12)
  cardRadiusPx: number;
  imageRadiusPx: number;
  cardBorderWidthPx: number;
  cardPaddingPx: number;
  cardShadowLevel: 'none' | 'subtle' | 'medium' | 'elevated';
  cardHoverLift: boolean;
  imageHoverZoom: boolean;
  showCardBorder: boolean;
  showCardCategory: boolean;
  showCardSpecs: boolean;
  showCardPrice: boolean;
  cardFooterDivider: boolean;

  // 6. Buttons & Interactive Controls (12)
  buttonRadiusPx: number;
  buttonStyle: 'solid' | 'outline' | 'tinted';
  buttonSize: 'compact' | 'standard' | 'large';
  buttonUppercase: boolean;
  buttonFontWeight: 500 | 600 | 700;
  buttonShowArrow: boolean;
  buttonHoverScale: boolean;
  buttonShadow: boolean;
  inputRadiusPx: number;
  showWishlistHeart: boolean;
  showQuickAddBtn: boolean;
  showSearchBar: boolean;

  // 7. Media Effects & Image Grading (10)
  imgBrightness: number;
  imgContrast: number;
  imgSaturate: number;
  imgGrayscale: number;
  imgSepia: number;
  imgObjectFit: 'cover' | 'contain';
  imgFocalPosition: 'top' | 'center' | 'bottom';
  heroImageScale: number;
  showHeroImage: boolean;
  overlayGridTexture: boolean;

  // 8. Commerce, Navigation & Accessibility Features (12)
  showCartButton: boolean;
  showCheckoutCod: boolean;
  enableWishlistBadge: boolean;
  showSizeGuideLink: boolean;
  showColorSwatches: boolean;
  showStockStatus: boolean;
  showNavLinks: boolean;
  showMobileHamburger: boolean;
  showFooter: boolean;
  smoothScroll: boolean;
  highContrastBorders: boolean;
  compactMobileMode: boolean;
}

export const BASE_STUDIO_SETTINGS: WebStudioSettings = {
  // 1. Brand & Copywriting
  brandName: 'AUDEΛ',
  brandTagline: 'Architectural Hardware · Objects',
  heroKicker: 'Autumn Drop · Limited Small-Batch Hardware',
  heroHeadline: 'Tactile objects built for daily ritual.',
  heroSubline: 'Precision industrial audio, horology, and architectural homeware crafted in small batches.',
  ctaLabel: 'Shop Collection',
  secondaryCtaLabel: 'View Specs',
  announcementText: 'Complimentary Express Dispatch on Orders Above ₹15,000',
  showAnnouncementBar: true,
  collectionTitle: 'Featured Objects',
  collectionSubtitle: 'Studio-graded industrial releases',
  footerCopyright: 'AUDEΛ Living Objects · Engineered in Bengaluru',
  footerBadgeText: '2-Year Hardware Warranty · COD & UPI',
  currencySymbol: '₹',
  freeShippingThreshold: 15000,

  // 2. Colors & Surface Palette
  accentColor: '#ff5512',
  secondaryAccent: '#10b981',
  canvasBgLight: '#faf9f7',
  canvasBgDark: '#0d0f14',
  cardBgLight: '#ffffff',
  cardBgDark: '#161922',
  textPrimaryLight: '#111418',
  textPrimaryDark: '#f4f4f5',
  mutedTextOpacity: 62,
  borderOpacity: 12,
  headerBgOpacity: 92,
  headerBlurPx: 10,
  heroScrimOpacity: 75,
  buttonTextColor: 'auto',
  badgeBgColor: '#18181b',
  footerBgTint: false,

  // 3. Typography & Type Scale
  headingFont: 'Plus Jakarta Sans',
  bodyFont: 'Plus Jakarta Sans',
  heroTitleSizePx: 23,
  heroTitleWeight: 600,
  heroTrackingEm: -0.02,
  heroLineHeight: 1.12,
  heroUppercase: false,
  heroTextAlign: 'left',
  bodySizePx: 12,
  bodyLineHeight: 1.55,
  sectionTitleSizePx: 14,
  cardTitleSizePx: 13,
  priceFontStyle: 'mono',
  tabularNumerals: true,

  // 4. Responsive Grid & Layout Geometry
  desktopCols: 3,
  tabletCols: 2,
  mobileCols: 1,
  gridGapPx: 14,
  containerPadPx: 18,
  sectionPadY: 18,
  maxContainerWidth: 'full',
  heroLayoutMode: 'split',
  heroMinHeightPx: 210,
  headerSticky: true,
  headerHeightPx: 48,
  navAlignment: 'center',
  cardAspectRatio: '4:3',
  cardEqualHeight: true,

  // 5. Cards, Borders & Shadows
  cardRadiusPx: 10,
  imageRadiusPx: 0,
  cardBorderWidthPx: 1,
  cardPaddingPx: 12,
  cardShadowLevel: 'subtle',
  cardHoverLift: true,
  imageHoverZoom: true,
  showCardBorder: true,
  showCardCategory: true,
  showCardSpecs: true,
  showCardPrice: true,
  cardFooterDivider: true,

  // 6. Buttons & Interactive Controls
  buttonRadiusPx: 7,
  buttonStyle: 'solid',
  buttonSize: 'standard',
  buttonUppercase: false,
  buttonFontWeight: 600,
  buttonShowArrow: true,
  buttonHoverScale: true,
  buttonShadow: false,
  inputRadiusPx: 7,
  showWishlistHeart: true,
  showQuickAddBtn: true,
  showSearchBar: true,

  // 7. Media Effects & Image Grading
  imgBrightness: 100,
  imgContrast: 102,
  imgSaturate: 100,
  imgGrayscale: 0,
  imgSepia: 0,
  imgObjectFit: 'cover',
  imgFocalPosition: 'center',
  heroImageScale: 100,
  showHeroImage: true,
  overlayGridTexture: false,

  // 8. Commerce, Navigation & Accessibility Features
  showCartButton: true,
  showCheckoutCod: true,
  enableWishlistBadge: true,
  showSizeGuideLink: true,
  showColorSwatches: true,
  showStockStatus: true,
  showNavLinks: true,
  showMobileHamburger: true,
  showFooter: true,
  smoothScroll: true,
  highContrastBorders: false,
  compactMobileMode: false,
};

export const SITE_ARCHETYPE_OVERRIDES: Record<WebSiteType, Partial<WebStudioSettings>> = {
  ecommerce: {
    brandName: 'AUDEΛ',
    brandTagline: 'Architectural Hardware · Objects',
    heroKicker: 'Autumn Drop · Limited Small-Batch Hardware',
    heroHeadline: 'Tactile objects built for daily ritual.',
    heroSubline: 'Precision industrial audio, horology, and architectural homeware crafted in small batches.',
    ctaLabel: 'Shop Collection',
    collectionTitle: 'Featured Objects',
    collectionSubtitle: 'Studio-graded industrial releases',
    accentColor: '#ff5512',
    headingFont: 'Plus Jakarta Sans',
    heroLayoutMode: 'split',
    cardAspectRatio: '4:3',
    cardRadiusPx: 10,
    buttonRadiusPx: 7,
    footerCopyright: 'AUDEΛ Living Objects · 2-Year Warranty',
  },
  clothing: {
    brandName: 'ATELIER VESPER',
    brandTagline: 'Winter Uniform · Structured Tailoring',
    heroKicker: 'Autumn / Winter Collection · Issue 04',
    heroHeadline: 'Winter Uniform · Structured Silhouettes.',
    heroSubline: 'Heavyweight virgin wool tailoring, technical overshirts, and weather-sealed urban footwear.',
    ctaLabel: 'Explore Lookbook',
    collectionTitle: 'Garment Archive',
    collectionSubtitle: 'Select colorway and garment sizing',
    accentColor: '#18181b',
    headingFont: 'Playfair Display',
    heroLayoutMode: 'overlay',
    cardAspectRatio: '3:4',
    cardRadiusPx: 4,
    buttonRadiusPx: 2,
    footerCopyright: 'Atelier Vesper · Garment Dispatch Within 24h',
  },
  static: {
    brandName: 'ARX Practice',
    brandTagline: 'Bengaluru · Zurich Architecture',
    heroKicker: '01 · Architectural Advisory & Spatial Engineering',
    heroHeadline: 'Architecture engineered with spatial permanence.',
    heroSubline: 'Independent architectural practice designing civic pavilions, private residences, and timber studios.',
    ctaLabel: 'Book Consultation',
    collectionTitle: '01. Practice Capabilities',
    collectionSubtitle: 'Monolithic concrete, timber & solar envelopes',
    accentColor: '#0284c7',
    headingFont: 'Archivo',
    heroLayoutMode: 'overlay',
    cardAspectRatio: '16:10',
    cardRadiusPx: 8,
    buttonRadiusPx: 6,
    footerCopyright: 'ARX Practice · Static Pre-Rendered Edge Build',
  },
};

export interface StudioThemePreset {
  id: string;
  label: string;
  patch: Partial<WebStudioSettings>;
}

export const STUDIO_STYLE_PRESETS: StudioThemePreset[] = [
  {
    id: 'swiss',
    label: 'Swiss Grid',
    patch: {
      headingFont: 'Archivo',
      cardRadiusPx: 0,
      buttonRadiusPx: 0,
      inputRadiusPx: 0,
      heroUppercase: true,
      cardBorderWidthPx: 2,
      borderOpacity: 25,
      cardShadowLevel: 'none',
      accentColor: '#ff5512',
      overlayGridTexture: true,
    },
  },
  {
    id: 'luxury',
    label: 'Editorial Serif',
    patch: {
      headingFont: 'Playfair Display',
      bodyFont: 'Georgia',
      cardRadiusPx: 4,
      buttonRadiusPx: 999,
      heroUppercase: false,
      cardBorderWidthPx: 1,
      borderOpacity: 12,
      cardShadowLevel: 'subtle',
      accentColor: '#78350f',
      overlayGridTexture: false,
    },
  },
  {
    id: 'minimal',
    label: 'Soft Modern',
    patch: {
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Plus Jakarta Sans',
      cardRadiusPx: 16,
      imageRadiusPx: 12,
      cardPaddingPx: 10,
      buttonRadiusPx: 10,
      cardShadowLevel: 'medium',
      accentColor: '#10b981',
      overlayGridTexture: false,
    },
  },
  {
    id: 'mono',
    label: 'Cinema Noir',
    patch: {
      headingFont: 'Space Mono',
      bodyFont: 'IBM Plex Mono',
      imgGrayscale: 100,
      imgContrast: 128,
      cardRadiusPx: 6,
      buttonRadiusPx: 4,
      accentColor: '#18181b',
      highContrastBorders: true,
    },
  },
];
