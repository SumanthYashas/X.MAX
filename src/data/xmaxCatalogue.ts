export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  onwards?: boolean;
  categoryId: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  shortTitle: string;
  index: string;
  description: string;
  items: ServiceItem[];
}

export interface BundledPackage {
  id: string;
  name: string;
  price: number;
  audience: string;
  deliverables: string[];
  featured?: boolean;
}

export interface AdditionalChargeItem {
  id: string;
  name: string;
  priceLabel: string;
  numericPrice?: number;
  isPercentage?: boolean;
  percentageValue?: number;
  selectable?: boolean;
}

export interface CommercialTerm {
  term: string;
  condition: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'graphic-design',
    title: 'Social & Ad Creatives',
    shortTitle: 'Ad Creatives',
    index: '01',
    description:
      'High-CTR static ads, scroll-stopping social creatives, and retargeting visuals engineered to lower CPA.',
    items: [
      { id: 'gd-social-post', name: 'Social media feed creative', price: 500, categoryId: 'graphic-design' },
      { id: 'gd-ig-story', name: 'Instagram / FB Story ad frame', price: 300, categoryId: 'graphic-design' },
      { id: 'gd-carousel', name: 'Paid social carousel (up to 5 slides)', price: 1500, categoryId: 'graphic-design' },
      { id: 'gd-poster', name: 'Campaign offer promo creative', price: 1000, categoryId: 'graphic-design' },
      { id: 'gd-ad-creative', name: 'Direct-response Meta/Google ad creative', price: 750, categoryId: 'graphic-design' },
      { id: 'gd-yt-thumb', name: 'YouTube & Reels hook thumbnail', price: 500, categoryId: 'graphic-design' },
      { id: 'gd-flyer', name: 'Lead magnet PDF / digital brochure', price: 1500, categoryId: 'graphic-design' },
      { id: 'gd-brochure', name: 'Digital campaign media kit deck', price: 3000, categoryId: 'graphic-design' },
      { id: 'gd-menu', name: 'Retargeting catalog ad creative set', price: 2000, categoryId: 'graphic-design' },
      { id: 'gd-infographic', name: 'Conversion infographic / comparison ad', price: 1500, categoryId: 'graphic-design' },
    ],
  },
  {
    id: 'branding-identity',
    title: 'Digital Campaign Identity',
    shortTitle: 'Campaign Brand',
    index: '02',
    description:
      'Digital-first brand positioning, social channel visual systems, and unified ad creative guidelines.',
    items: [
      { id: 'bi-logo', name: 'Digital brand mark & social avatar', price: 5000, categoryId: 'branding-identity' },
      { id: 'bi-logo-redesign', name: 'Social profile visual refresh', price: 3500, categoryId: 'branding-identity' },
      { id: 'bi-brand-identity', name: 'Full digital campaign identity system', price: 15000, categoryId: 'branding-identity' },
      { id: 'bi-business-card', name: 'Digital link-in-bio & e-card page', price: 1000, categoryId: 'branding-identity' },
      { id: 'bi-letterhead', name: 'Email newsletter header & signature kit', price: 1000, categoryId: 'branding-identity' },
      { id: 'bi-guidelines', name: 'Paid social & ad creative playbook', price: 5000, categoryId: 'branding-identity' },
      { id: 'bi-packaging', name: 'D2C product ad & hero visual kit', price: 5000, onwards: true, categoryId: 'branding-identity' },
      { id: 'bi-stationery', name: 'Omnichannel social banner & cover pack', price: 4000, categoryId: 'branding-identity' },
    ],
  },
  {
    id: 'video-production',
    title: 'Performance Video & Reels Ads',
    shortTitle: 'Video Ads',
    index: '03',
    description:
      'Thumb-stopping 9:16 Reels ads, UGC hooks, kinetic motion graphics, and product demos built for ROAS.',
    items: [
      { id: 'vp-basic-reel', name: 'Organic Instagram Reel / Shorts edit', price: 1500, categoryId: 'video-production' },
      { id: 'vp-adv-reel', name: 'High-retention UGC / paid ad reel edit', price: 3000, categoryId: 'video-production' },
      { id: 'vp-motion', name: 'Motion graphics performance video ad', price: 4000, categoryId: 'video-production' },
      { id: 'vp-promo', name: 'Campaign launch hero video ad (60s)', price: 5000, categoryId: 'video-production' },
      { id: 'vp-youtube', name: 'YouTube ad & VSL funnel video edit', price: 3000, onwards: true, categoryId: 'video-production' },
      { id: 'vp-product', name: 'E-commerce product demo ad reel', price: 3000, categoryId: 'video-production' },
      { id: 'vp-short-ad', name: 'Short-form Meta/TikTok ad (3 hooks)', price: 3000, categoryId: 'video-production' },
    ],
  },
  {
    id: 'website-development',
    title: 'Conversion Funnels & Landing Pages',
    shortTitle: 'Landing Funnels',
    index: '04',
    description:
      'High-speed, mobile-first campaign landing pages, lead funnels, and D2C storefronts built to convert ad traffic.',
    items: [
      { id: 'wd-landing', name: 'High-converting ad landing page', price: 8000, categoryId: 'website-development' },
      { id: 'wd-portfolio', name: 'Multi-step lead-gen funnel site', price: 15000, categoryId: 'website-development' },
      { id: 'wd-business', name: 'Growth-ready business marketing site', price: 20000, categoryId: 'website-development' },
      { id: 'wd-ecommerce', name: 'D2C conversion e-commerce storefront', price: 35000, categoryId: 'website-development' },
      { id: 'wd-redesign', name: 'CRO landing page & checkout redesign', price: 10000, onwards: true, categoryId: 'website-development' },
      { id: 'wd-maintenance', name: 'Pixel, CAPI & funnel speed optimization', price: 2000, onwards: true, categoryId: 'website-development' },
    ],
  },
  {
    id: 'digital-marketing',
    title: 'Paid Ads, SEO & Growth Strategy',
    shortTitle: 'Paid Ads & SEO',
    index: '05',
    description:
      'Full-funnel Meta & Google Ads setup, technical SEO audits, keyword roadmaps, and competitor ad intelligence.',
    items: [
      { id: 'dm-social-setup', name: 'Social channels & Business Manager setup', price: 2000, categoryId: 'digital-marketing' },
      { id: 'dm-social-strategy', name: 'Monthly social growth & funnel strategy', price: 3000, categoryId: 'digital-marketing' },
      { id: 'dm-content-cal', name: '30-day campaign content calendar', price: 2000, categoryId: 'digital-marketing' },
      { id: 'dm-meta-ads', name: 'Meta Ads campaign setup & CAPI pixel', price: 5000, categoryId: 'digital-marketing' },
      { id: 'dm-google-ads', name: 'Google Ads Search & Shopping setup', price: 5000, categoryId: 'digital-marketing' },
      { id: 'dm-seo-audit', name: 'Technical & local SEO audit', price: 3000, categoryId: 'digital-marketing' },
      { id: 'dm-keyword', name: 'High-intent buyer keyword research', price: 2000, categoryId: 'digital-marketing' },
      { id: 'dm-onpage-seo', name: 'On-page SEO & schema markup setup', price: 5000, onwards: true, categoryId: 'digital-marketing' },
      { id: 'dm-competitor', name: 'Competitor ad-library & funnel audit', price: 3000, categoryId: 'digital-marketing' },
    ],
  },
];

export const ALL_SERVICES: ServiceItem[] = SERVICE_CATEGORIES.flatMap((c) => c.items);

export const BUNDLED_PACKAGES: BundledPackage[] = [
  {
    id: 'brand-essentials',
    name: 'Social Launch Kit',
    price: 15000,
    audience: 'For startups establishing a consistent social media & digital ad foundation.',
    deliverables: [
      'Digital brand mark (2 concepts)',
      'Social profile & banner sizes',
      'Ad-ready color palette',
      'Typography system',
      'Link-in-bio funnel layout',
      '3 scroll-stopping social creatives',
      'Channel optimization checklist',
    ],
  },
  {
    id: 'brand-builder',
    name: 'Content & Reels Engine',
    price: 25000,
    audience: 'For brands scaling organic reach, engagement, and paid social creative volume.',
    deliverables: [
      'Complete digital campaign identity',
      'Social visual & ad hook playbook',
      'Email header & signature kit',
      '5 high-CTR social creatives',
      '2 multi-slide ad carousels',
      '2 high-retention reel ad edits',
    ],
  },
  {
    id: 'digital-presence',
    name: 'Lead-Gen & SEO Presence',
    price: 40000,
    audience: 'For businesses capturing inbound search traffic and converting paid clicks.',
    deliverables: [
      'Digital campaign brand identity',
      '8 performance social creatives',
      '4 professionally edited ad reels',
      'Meta & IG Business account setup',
      '30-day content & funnel strategy',
      'High-converting ad landing page',
      'Technical & on-page SEO setup',
    ],
  },
  {
    id: 'business-launch',
    name: 'Paid Acquisition Launch',
    price: 55000,
    audience: 'For D2C and service brands launching full-funnel Meta Ads campaigns.',
    deliverables: [
      'Digital campaign identity',
      '12 social & ad creatives',
      '6 edited reel video ads',
      '4 A/B split-test ad variations',
      'Business Manager & CAPI pixel setup',
      'Conversion funnel site (up to 5 pages)',
      'On-page SEO optimization',
      'Meta Ads campaign architecture',
      '90-day digital marketing roadmap',
    ],
  },
  {
    id: 'complete-brand-experience',
    name: 'Omnichannel Growth Scale',
    price: 75000,
    audience: 'For ambitious brands seeking complete Meta, Google, SEO, and CRO scale.',
    featured: true,
    deliverables: [
      'Full digital brand & ad system',
      '15 high-converting ad creatives',
      '8 advanced UGC & motion reel ads',
      '5 direct-response ad hook variants',
      '5-page CRO conversion website',
      'Complete on-page & schema SEO',
      'Social channels & CAPI tracking setup',
      'Meta Ads full-funnel campaign setup',
      'Google Ads Search & Shopping setup',
      'Competitor ad-library intelligence',
      'Omnichannel growth strategy',
    ],
  },
];

export const ADDITIONAL_CHARGES: AdditionalChargeItem[] = [
  { id: 'add-concept', name: 'Additional A/B ad hook creative', priceLabel: '₹1,000', numericPrice: 1000, selectable: true },
  { id: 'add-revision', name: 'Additional creative revision round', priceLabel: '₹500 onwards', numericPrice: 500, selectable: true },
  { id: 'add-urgent', name: '24-hour rush campaign launch', priceLabel: '25% extra', isPercentage: true, percentageValue: 0.25, selectable: true },
  { id: 'add-source', name: 'Editable campaign source files (PSD/AEP)', priceLabel: '₹1,000 onwards', numericPrice: 1000, selectable: true },
  { id: 'add-stock', name: 'Licensed stock & music assets', priceLabel: 'Actual cost' },
  { id: 'add-photo', name: 'Studio product shoot for ads', priceLabel: 'Custom quotation' },
  { id: 'add-video', name: 'Creator UGC video shoot', priceLabel: 'Custom quotation' },
  { id: 'add-page', name: 'Additional A/B funnel landing page', priceLabel: '₹2,000', numericPrice: 2000, selectable: true },
  { id: 'add-hosting', name: 'Campaign domain, SSL & server CAPI', priceLabel: 'Actual cost' },
  { id: 'add-ad-mgmt', name: 'Monthly Meta & Google Ads management', priceLabel: '₹5,000 onwards', numericPrice: 5000, selectable: true },
  { id: 'add-platform', name: 'Additional ad channel setup (LinkedIn/YT)', priceLabel: '₹1,000', numericPrice: 1000, selectable: true },
];

export const COMMERCIAL_TERMS: CommercialTerm[] = [
  { term: 'Campaign kickoff advance', condition: '50% advance to begin production' },
  { term: 'Final milestone payment', condition: '50% prior to final asset & launch handover' },
  { term: 'Creative revisions', condition: '2 rounds per major ad deliverable' },
  { term: 'GST', condition: 'Extra, if applicable' },
  { term: 'Paid ad spend budget', condition: 'Billed directly on client Meta / Google accounts' },
  { term: 'Third-party SaaS / stock', condition: 'Charged separately at actuals' },
  { term: 'Campaign launch timeline', condition: 'Confirmed according to channel scope' },
  { term: 'Proposal validity', condition: '15 days' },
];

export const QUOTATION_POLICY: string[] = [
  'Brands may select modular digital marketing services or a turnkey growth package.',
  'X.MAX issues a custom campaign scope based on channels, ad creative volume, and launch timeline.',
  'Package pricing covers the exact campaign deliverables listed. Extra A/B creatives or ad spend management are scoped separately.',
  'Rates shown are starting retainers/project fees and adjust for enterprise multi-market campaigns.',
  'Production and ad account onboarding begin upon written scope approval and advance receipt.',
];

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
