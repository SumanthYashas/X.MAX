export type PageRoute = 'home' | 'pricing' | 'packages' | 'terms' | 'quote' | 'analytics' | 'demos';

export const ROUTE_PATHS: Record<PageRoute, string> = {
  home: '/',
  pricing: '/pricing',
  packages: '/packages',
  terms: '/terms',
  quote: '/quote',
  analytics: '/analytics',
  demos: '/demos',
};

export const ROUTE_TITLES: Record<PageRoute, string> = {
  home: 'X.MAX — Ideas Into Impact | Performance Digital Marketing Agency',
  pricing: 'Digital Marketing Rate Card — X.MAX | Campaign & Growth Pricing 2026–27',
  packages: 'Digital Marketing Growth Packages — X.MAX | Performance Launch Scopes',
  terms: 'Campaign Terms & Ad Spend Policies — X.MAX Digital Marketing',
  quote: 'Build Custom Digital Marketing Quote — X.MAX',
  analytics: 'Live Visitor Analytics, SEO & CAPI Hub — X.MAX',
  demos: 'Test Tools — X.MAX | Ad Creatives, Motion Ads, Meta Ads & Conversion Funnels',
};

export function resolveRouteFromPath(pathname: string): PageRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  switch (normalized) {
    case '/demos':
    case '/demo':
    case '/work':
    case '/workflows':
    case '/apps':
      return 'demos';
    case '/pricing':
    case '/services':
      return 'pricing';
    case '/packages':
    case '/bundles':
      return 'packages';
    case '/terms':
    case '/charges':
      return 'terms';
    case '/quote':
      return 'quote';
    case '/analytics':
    case '/seo':
      return 'analytics';
    default:
      return 'home';
  }
}
