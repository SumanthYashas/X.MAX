export type PageRoute = 'home' | 'pricing' | 'packages' | 'terms' | 'quote';

export const ROUTE_PATHS: Record<PageRoute, string> = {
  home: '/',
  pricing: '/pricing',
  packages: '/packages',
  terms: '/terms',
  quote: '/quote',
};

export const ROUTE_TITLES: Record<PageRoute, string> = {
  home: 'X.MAX — Ideas Into Impact | Digital Marketing, Creative, Branding & Web',
  pricing: 'Service Rate Card — X.MAX | Service Pricing Catalogue 2026–27',
  packages: 'Bundled Project Packages — X.MAX | Service Pricing Catalogue 2026–27',
  terms: 'Additional Charges & Commercial Terms — X.MAX',
  quote: 'Build Custom Quotation — X.MAX',
};

export function resolveRouteFromPath(pathname: string): PageRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  switch (normalized) {
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
    default:
      return 'home';
  }
}
