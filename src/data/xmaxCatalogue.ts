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
    title: 'Graphic Design',
    shortTitle: 'Graphic Design',
    index: '01',
    description: 'High-impact campaign creatives, print collateral, and social visuals crafted for scroll-stopping clarity.',
    items: [
      { id: 'gd-social-post', name: 'Social media post', price: 500, categoryId: 'graphic-design' },
      { id: 'gd-ig-story', name: 'Instagram story', price: 300, categoryId: 'graphic-design' },
      { id: 'gd-carousel', name: 'Carousel (up to 5 slides)', price: 1500, categoryId: 'graphic-design' },
      { id: 'gd-poster', name: 'Promotional poster', price: 1000, categoryId: 'graphic-design' },
      { id: 'gd-ad-creative', name: 'Advertising creative', price: 750, categoryId: 'graphic-design' },
      { id: 'gd-yt-thumb', name: 'YouTube thumbnail', price: 500, categoryId: 'graphic-design' },
      { id: 'gd-flyer', name: 'Flyer design', price: 1500, categoryId: 'graphic-design' },
      { id: 'gd-brochure', name: 'Brochure design', price: 3000, categoryId: 'graphic-design' },
      { id: 'gd-menu', name: 'Menu design', price: 2000, categoryId: 'graphic-design' },
      { id: 'gd-infographic', name: 'Infographic', price: 1500, categoryId: 'graphic-design' },
    ],
  },
  {
    id: 'branding-identity',
    title: 'Branding & Identity',
    shortTitle: 'Branding',
    index: '02',
    description: 'Cohesive visual identities, logos, packaging, and guidelines built to command recognition.',
    items: [
      { id: 'bi-logo', name: 'Logo design', price: 5000, categoryId: 'branding-identity' },
      { id: 'bi-logo-redesign', name: 'Logo redesign', price: 3500, categoryId: 'branding-identity' },
      { id: 'bi-brand-identity', name: 'Brand identity', price: 15000, categoryId: 'branding-identity' },
      { id: 'bi-business-card', name: 'Business card', price: 1000, categoryId: 'branding-identity' },
      { id: 'bi-letterhead', name: 'Letterhead', price: 1000, categoryId: 'branding-identity' },
      { id: 'bi-guidelines', name: 'Brand guidelines', price: 5000, categoryId: 'branding-identity' },
      { id: 'bi-packaging', name: 'Packaging design', price: 5000, onwards: true, categoryId: 'branding-identity' },
      { id: 'bi-stationery', name: 'Complete stationery', price: 4000, categoryId: 'branding-identity' },
    ],
  },
  {
    id: 'video-production',
    title: 'Video Production & Editing',
    shortTitle: 'Video & Motion',
    index: '03',
    description: 'Kinetic reels, motion graphics, product edits, and short-form performance ads engineered for retention.',
    items: [
      { id: 'vp-basic-reel', name: 'Basic reel editing', price: 1500, categoryId: 'video-production' },
      { id: 'vp-adv-reel', name: 'Advanced reel editing', price: 3000, categoryId: 'video-production' },
      { id: 'vp-motion', name: 'Motion graphics video', price: 4000, categoryId: 'video-production' },
      { id: 'vp-promo', name: 'Promotional video', price: 5000, categoryId: 'video-production' },
      { id: 'vp-youtube', name: 'YouTube video editing', price: 3000, onwards: true, categoryId: 'video-production' },
      { id: 'vp-product', name: 'Product video editing', price: 3000, categoryId: 'video-production' },
      { id: 'vp-short-ad', name: 'Short-form ad video', price: 3000, categoryId: 'video-production' },
    ],
  },
  {
    id: 'website-development',
    title: 'Website Development',
    shortTitle: 'Web Dev',
    index: '04',
    description: 'Fast, responsive landing pages, portfolios, business sites, and full e-commerce storefronts.',
    items: [
      { id: 'wd-landing', name: 'Landing page', price: 8000, categoryId: 'website-development' },
      { id: 'wd-portfolio', name: 'Portfolio website', price: 15000, categoryId: 'website-development' },
      { id: 'wd-business', name: 'Business website', price: 20000, categoryId: 'website-development' },
      { id: 'wd-ecommerce', name: 'E-commerce website', price: 35000, categoryId: 'website-development' },
      { id: 'wd-redesign', name: 'Website redesign', price: 10000, onwards: true, categoryId: 'website-development' },
      { id: 'wd-maintenance', name: 'Website maintenance', price: 2000, onwards: true, categoryId: 'website-development' },
    ],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    shortTitle: 'Marketing',
    index: '05',
    description: 'Paid acquisition setups, technical SEO audits, content calendars, and competitive intelligence.',
    items: [
      { id: 'dm-social-setup', name: 'Social media account setup', price: 2000, categoryId: 'digital-marketing' },
      { id: 'dm-social-strategy', name: 'Social media strategy', price: 3000, categoryId: 'digital-marketing' },
      { id: 'dm-content-cal', name: 'Content calendar', price: 2000, categoryId: 'digital-marketing' },
      { id: 'dm-meta-ads', name: 'Meta Ads campaign setup', price: 5000, categoryId: 'digital-marketing' },
      { id: 'dm-google-ads', name: 'Google Ads campaign setup', price: 5000, categoryId: 'digital-marketing' },
      { id: 'dm-seo-audit', name: 'SEO audit', price: 3000, categoryId: 'digital-marketing' },
      { id: 'dm-keyword', name: 'Keyword research', price: 2000, categoryId: 'digital-marketing' },
      { id: 'dm-onpage-seo', name: 'On-page SEO', price: 5000, onwards: true, categoryId: 'digital-marketing' },
      { id: 'dm-competitor', name: 'Competitor analysis', price: 3000, categoryId: 'digital-marketing' },
    ],
  },
];

export const ALL_SERVICES: ServiceItem[] = SERVICE_CATEGORIES.flatMap((c) => c.items);

export const BUNDLED_PACKAGES: BundledPackage[] = [
  {
    id: 'brand-essentials',
    name: 'Brand Essentials',
    price: 15000,
    audience: 'For startups establishing their brand identity.',
    deliverables: [
      'Logo design with 2 concepts',
      'Logo variations',
      'Brand colour palette',
      'Typography selection',
      'Business card design',
      '3 social media creatives',
      'Basic brand guidelines',
    ],
  },
  {
    id: 'brand-builder',
    name: 'Brand Builder',
    price: 25000,
    audience: 'For businesses building a professional brand image.',
    deliverables: [
      'Complete logo design',
      'Brand identity system',
      'Brand guidelines',
      'Business card and letterhead',
      '5 social media creatives',
      '2 promotional posters',
      '2 reel edits',
    ],
  },
  {
    id: 'digital-presence',
    name: 'Digital Presence',
    price: 40000,
    audience: 'For businesses establishing their online presence.',
    deliverables: [
      'Complete brand identity',
      '8 social media creatives',
      '4 professionally edited reels',
      'Social media account setup',
      'Content strategy',
      'Landing page design and development',
      'Basic on-page SEO',
    ],
  },
  {
    id: 'business-launch',
    name: 'Business Launch',
    price: 55000,
    audience: 'For businesses launching or expanding digitally.',
    deliverables: [
      'Complete brand identity',
      '12 social media creatives',
      '6 edited reels',
      '4 advertising creatives',
      'Social media account setup',
      'Business website (up to 5 pages)',
      'Basic SEO setup',
      'Meta Ads campaign setup',
      'Digital marketing strategy',
    ],
  },
  {
    id: 'complete-brand-experience',
    name: 'Complete Brand Experience',
    price: 75000,
    audience: 'For businesses seeking a comprehensive branding and digital launch.',
    featured: true,
    deliverables: [
      'Complete brand identity',
      '15 social media creatives',
      '8 advanced reels',
      '5 advertising creatives',
      '5-page business website',
      'On-page SEO setup',
      'Social media account setup',
      'Meta Ads campaign setup',
      'Google Ads campaign setup',
      'Competitor analysis',
      'Digital marketing strategy',
    ],
  },
];

export const ADDITIONAL_CHARGES: AdditionalChargeItem[] = [
  { id: 'add-concept', name: 'Additional design concept', priceLabel: '₹1,000', numericPrice: 1000, selectable: true },
  { id: 'add-revision', name: 'Additional revision round', priceLabel: '₹500 onwards', numericPrice: 500, selectable: true },
  { id: 'add-urgent', name: 'Urgent delivery', priceLabel: '25% extra', isPercentage: true, percentageValue: 0.25, selectable: true },
  { id: 'add-source', name: 'Source / editable files', priceLabel: '₹1,000 onwards', numericPrice: 1000, selectable: true },
  { id: 'add-stock', name: 'Premium stock assets', priceLabel: 'Actual cost' },
  { id: 'add-photo', name: 'Professional photography', priceLabel: 'Custom quotation' },
  { id: 'add-video', name: 'Professional videography', priceLabel: 'Custom quotation' },
  { id: 'add-page', name: 'Additional website page', priceLabel: '₹2,000', numericPrice: 2000, selectable: true },
  { id: 'add-hosting', name: 'Website hosting / domain', priceLabel: 'Actual cost' },
  { id: 'add-ad-mgmt', name: 'Ad campaign management', priceLabel: '₹5,000 onwards', numericPrice: 5000, selectable: true },
  { id: 'add-platform', name: 'Additional platform setup', priceLabel: '₹1,000', numericPrice: 1000, selectable: true },
];

export const COMMERCIAL_TERMS: CommercialTerm[] = [
  { term: 'Project advance', condition: '50% advance to begin work' },
  { term: 'Final payment', condition: '50% before final delivery' },
  { term: 'Revisions', condition: '2 rounds per major deliverable' },
  { term: 'GST', condition: 'Extra, if applicable' },
  { term: 'Advertising budget', condition: 'Not included' },
  { term: 'Third-party expenses', condition: 'Charged separately' },
  { term: 'Project timeline', condition: 'Confirmed according to scope' },
  { term: 'Quotation validity', condition: '15 days' },
];

export const QUOTATION_POLICY: string[] = [
  'Clients may select individual services, quantities or an optional bundled project.',
  'X.MAX will issue a custom quotation based on the selected deliverables, complexity and timeline.',
  'Bundle pricing applies only to the exact deliverables listed in that bundle. Any additional requirement is quoted separately.',
  'Prices shown are starting rates and may change for complex or specialised work.',
  'Work begins after written approval of the quotation and receipt of the advance payment.',
];

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
