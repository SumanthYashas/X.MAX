import { useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICE_CATEGORIES, formatINR } from '../data/xmaxCatalogue';
import { PageRoute } from '../types/routing';

interface ServiceRateCardProps {
  selectedServices: Record<string, number>;
  onUpdateServiceQty: (serviceId: string, delta: number) => void;
  onJumpToQuote: () => void;
  onNavigate: (route: PageRoute) => void;
}

export function ServiceRateCard({
  selectedServices,
  onUpdateServiceQty,
  onJumpToQuote,
  onNavigate,
}: ServiceRateCardProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICE_CATEGORIES.filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
      .map((cat) => ({
        ...cat,
        items: q ? cat.items.filter((item) => item.name.toLowerCase().includes(q)) : cat.items,
      }))
      .filter((cat) => cat.items.length > 0);
  }, [activeCategory, query]);

  const totalSelectedItems = Object.values(selectedServices).reduce((acc, qty) => acc + qty, 0);

  return (
    <section
      id="services"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pt-[96px] md:pt-[144px] pb-[72px] md:pb-[110px]"
    >
      {/* Editorial Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-[#111418]/10"
      >
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.04em] text-[#111418]/50 mb-3">
            Digital Marketing Rate Card · 2026–27
          </p>
          <h2 className="text-[32px] md:text-[48px] font-medium tracking-[-0.025em] leading-[1.06] text-[#111418] [text-wrap:balance]">
            01. Individual Marketing &amp; Ad Deliverables
          </h2>
          <p className="mt-3 text-[16px] md:text-[18px] leading-[1.55] text-[#111418]/70">
            Transparent starting rates for paid social creatives, reels video ads, SEO, and
            conversion funnels. Pick any combination to assemble a custom growth scope.
          </p>
        </div>

        <AnimatePresence>
          {totalSelectedItems > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onJumpToQuote}
              className="whitespace-nowrap shrink-0 px-4 py-2.5 rounded-[11px] bg-[#16191f] text-white text-[14px] font-medium hover:bg-[#2b3140] transition-colors cursor-pointer tabular-nums"
            >
              Review Scope ({totalSelectedItems})
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Interactive Filter Bar & Search */}
      <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter service categories"
          className="w-full lg:w-auto max-w-full overflow-x-auto no-scrollbar flex items-center md:flex-wrap gap-1 p-1.5 bg-[#e8edf5] rounded-[14px]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={`relative whitespace-nowrap shrink-0 px-3.5 py-2 rounded-[10px] text-[13px] md:text-[14px] font-medium transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'text-[#111418]'
                : 'text-[#111418]/65 hover:text-[#111418]'
            }`}
          >
            {activeCategory === 'all' && (
              <motion.span
                layoutId="service-tab-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 bg-white rounded-[10px] shadow-sm"
              />
            )}
            <span className="relative z-10">All Channels</span>
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative whitespace-nowrap shrink-0 px-3.5 py-2 rounded-[10px] text-[13px] md:text-[14px] font-medium transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'text-[#111418]'
                  : 'text-[#111418]/65 hover:text-[#111418]'
              }`}
            >
              {activeCategory === cat.id && (
                <motion.span
                  layoutId="service-tab-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 bg-white rounded-[10px] shadow-sm"
                />
              )}
              <span className="relative z-10">{cat.shortTitle}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-[290px] shrink-0">
          <Search
            className="w-4 h-4 text-[#111418]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search marketing services..."
            aria-label="Search digital marketing services"
            className="w-full h-[42px] pl-10 pr-9 rounded-[12px] bg-white border border-[#111418]/12 text-[14px] text-[#111418] placeholder:text-[#111418]/40 focus:outline-none focus:border-[#111418]/40 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear service search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#111418]/50 hover:text-[#111418] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Rate Card Tables */}
      {filteredCategories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-[20px] bg-white border border-[#111418]/10 p-12 text-center"
        >
          <p className="text-[16px] text-[#111418]/70">
            No services match &ldquo;{query}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-[10px] bg-[#16191f] text-white text-[14px] font-medium hover:bg-[#2b3140] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </motion.div>
      ) : (
        <div className="mt-10 space-y-12">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10"
            >
              {/* Left Sticky Discipline Intro */}
              <div className="lg:col-span-4 lg:pt-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-medium text-[#ff5512] tabular-nums">
                    {category.index}
                  </span>
                  <h3 className="text-[22px] md:text-[26px] font-medium tracking-[-0.015em] text-[#111418]">
                    {category.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-[15px] leading-[1.55] text-[#111418]/65 max-w-sm">
                  {category.description}
                </p>
                <p className="mt-3 text-[13px] text-[#111418]/45 tabular-nums">
                  {category.items.length} services available
                </p>
              </div>

              {/* Right Rate Card Surface */}
              <div className="lg:col-span-8 bg-white rounded-[22px] border border-[#111418]/10 overflow-hidden">
                <div className="grid grid-cols-12 px-4 sm:px-5 md:px-7 py-3.5 bg-[#12151b] text-white/80 text-[11px] sm:text-[12px] font-medium tracking-[0.04em] uppercase">
                  <span className="col-span-5 sm:col-span-6 md:col-span-7">Service</span>
                  <span className="col-span-3 text-right">Price</span>
                  <span className="col-span-4 sm:col-span-3 md:col-span-2 text-right">Scope</span>
                </div>

                <ul className="divide-y divide-[#111418]/8">
                  {category.items.map((item) => {
                    const qty = selectedServices[item.id] || 0;
                    return (
                      <li
                        key={item.id}
                        className={`grid grid-cols-12 items-center px-4 sm:px-5 md:px-7 py-4 transition-colors duration-150 ${
                          qty > 0 ? 'bg-[#ff5512]/[0.04]' : 'hover:bg-[#f4f7fb]/70'
                        }`}
                      >
                        <div className="col-span-5 sm:col-span-6 md:col-span-7 pr-2 sm:pr-3">
                          <span className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#111418] leading-snug block">
                            {item.name}
                          </span>
                        </div>

                        <div className="col-span-3 text-right pr-2 sm:pr-3 md:pr-5">
                          <span className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-[#111418] tabular-nums">
                            {formatINR(item.price)}
                            {item.onwards ? (
                              <span className="block sm:inline text-[11px] sm:text-[13px] md:text-[15px] text-[#111418]/55 font-normal">
                                {' '}
                                onwards
                              </span>
                            ) : null}
                          </span>
                        </div>

                        <div className="col-span-4 sm:col-span-3 md:col-span-2 flex justify-end">
                          {qty === 0 ? (
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={() => onUpdateServiceQty(item.id, 1)}
                              aria-label={`Add ${item.name} to quote`}
                              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-[9px] border border-[#111418]/15 text-[12.5px] sm:text-[13px] font-medium text-[#111418] hover:bg-[#16191f] hover:text-white hover:border-[#16191f] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              Add
                            </motion.button>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center rounded-[9px] bg-[#16191f] text-white p-0.5"
                            >
                              <button
                                type="button"
                                onClick={() => onUpdateServiceQty(item.id, -1)}
                                aria-label={`Decrease quantity for ${item.name}`}
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[7px] hover:bg-white/15 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                              <span className="w-5 sm:w-6 text-center text-[12.5px] sm:text-[13px] font-medium tabular-nums">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateServiceQty(item.id, 1)}
                                aria-label={`Increase quantity for ${item.name}`}
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[7px] hover:bg-white/15 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cross-Page Footer Bar */}
      <div className="mt-14 pt-8 border-t border-[#111418]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[15px] text-[#111418]/65">
          Looking for a turnkey campaign rollout? Explore our optional digital marketing bundles.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('packages')}
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-white border border-[#111418]/15 text-[14px] font-medium text-[#111418] hover:bg-[#111418]/5 transition-colors cursor-pointer"
          >
            View Bundled Packages
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onJumpToQuote}
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-[#16191f] text-white text-[14px] font-medium hover:bg-[#2b3140] transition-colors cursor-pointer"
          >
            Go to Quote Builder
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
