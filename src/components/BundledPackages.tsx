import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { BUNDLED_PACKAGES, formatINR } from '../data/xmaxCatalogue';
import { PageRoute } from '../types/routing';

interface BundledPackagesProps {
  selectedPackageId: string | null;
  onSelectPackage: (packageId: string) => void;
  onNavigate: (route: PageRoute) => void;
}

export function BundledPackages({
  selectedPackageId,
  onSelectPackage,
  onNavigate,
}: BundledPackagesProps) {
  return (
    <section
      id="packages"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pt-[96px] md:pt-[144px] pb-[72px] md:pb-[110px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl pb-10"
      >
        <p className="text-[13px] font-medium tracking-[0.04em] text-[#111418]/50 mb-3">
          One-Time Project Scopes
        </p>
        <h2 className="text-[32px] md:text-[48px] font-medium tracking-[-0.025em] leading-[1.06] text-[#111418] [text-wrap:balance]">
          02. Optional Bundled Project Packages
        </h2>
        <p className="mt-3 text-[16px] md:text-[18px] leading-[1.55] text-[#111418]/70">
          Bundles are optional, one-time project scopes for clients who want several services
          together. Individual service ordering remains available.
        </p>
      </motion.div>

      {/* Editorial Asymmetric Grid: 4 Standard + 1 Flagship Full-Span */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BUNDLED_PACKAGES.map((pkg, idx) => {
          const isSelected = selectedPackageId === pkg.id;
          const isFeatured = Boolean(pkg.featured);

          return (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: (idx % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -3 }}
              className={`rounded-[24px] p-6 sm:p-7 md:p-9 flex flex-col justify-between transition-[box-shadow,border-color] duration-200 ${
                isFeatured
                  ? 'md:col-span-2 bg-[#12151b] text-white'
                  : 'bg-white border border-[#111418]/10 text-[#111418] hover:shadow-[0_18px_40px_rgba(17,20,24,0.06)]'
              } ${
                isSelected ? 'ring-2 ring-[#ff5512]' : ''
              }`}
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pb-5 border-b border-current/10">
                  <div>
                    <p
                      className={`text-[12px] font-mono tracking-[0.04em] mb-1.5 ${
                        isFeatured ? 'text-[#ff5512]' : 'text-[#111418]/45'
                      }`}
                    >
                      0{idx + 1} · Optional Bundle
                    </p>
                    <h3 className="text-[22px] md:text-[26px] font-medium tracking-[-0.015em]">
                      {pkg.name}
                    </h3>
                  </div>

                  <p className="text-[28px] md:text-[34px] font-medium tracking-[-0.02em] tabular-nums">
                    {formatINR(pkg.price)}
                  </p>
                </div>

                <p
                  className={`mt-4 text-[15px] leading-[1.5] ${
                    isFeatured ? 'text-white/75' : 'text-[#111418]/70'
                  }`}
                >
                  {pkg.audience}
                </p>

                <ul
                  className={`mt-6 grid gap-x-8 gap-y-2.5 text-[14px] md:text-[15px] leading-[1.45] ${
                    isFeatured
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white/85'
                      : 'grid-cols-1 sm:grid-cols-2 text-[#111418]/80'
                  }`}
                >
                  {pkg.deliverables.map((del) => (
                    <li key={del} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45em] w-1.5 h-1.5 rounded-full shrink-0 bg-[#ff5512]"
                      />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-current/10 flex flex-wrap items-center justify-between gap-4">
                <span
                  className={`text-[13px] ${
                    isFeatured ? 'text-white/55' : 'text-[#111418]/50'
                  }`}
                >
                  Exact deliverables included · Additional scope quoted separately
                </span>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[11px] text-[14px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff5512] text-white hover:bg-[#e5490b]'
                      : isFeatured
                        ? 'bg-white text-[#12151b] hover:bg-white/90'
                        : 'bg-[#16191f] text-white hover:bg-[#2b3140]'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                  {isSelected ? 'Selected in Quote' : 'Select Package'}
                </motion.button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Cross-Page Footer Bar */}
      <div className="mt-14 pt-8 border-t border-[#111418]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[15px] text-[#111418]/65">
          Prefer to pick individual deliverables? Build a custom list from our rate card.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('pricing')}
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-white border border-[#111418]/15 text-[14px] font-medium text-[#111418] hover:bg-[#111418]/5 transition-colors cursor-pointer"
          >
            View Individual Rates
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('quote')}
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
