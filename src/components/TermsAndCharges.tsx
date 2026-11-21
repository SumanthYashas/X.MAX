import { ArrowRight, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ADDITIONAL_CHARGES,
  COMMERCIAL_TERMS,
  QUOTATION_POLICY,
} from '../data/xmaxCatalogue';
import { PageRoute } from '../types/routing';

interface TermsAndChargesProps {
  selectedAddons: Record<string, boolean>;
  onToggleAddon: (addonId: string) => void;
  onNavigate: (route: PageRoute) => void;
}

export function TermsAndCharges({
  selectedAddons,
  onToggleAddon,
  onNavigate,
}: TermsAndChargesProps) {
  return (
    <section
      id="terms"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pt-[96px] md:pt-[144px] pb-[72px] md:pb-[110px]"
    >
      <div className="max-w-2xl pb-10 mb-10 border-b border-[#111418]/10">
        <p className="text-[13px] font-medium tracking-[0.04em] text-[#111418]/50 mb-3">
          Digital Marketing Pricing · 2026–27
        </p>
        <h1 className="text-[32px] md:text-[48px] font-medium tracking-[-0.025em] leading-[1.06] text-[#111418] [text-wrap:balance]">
          Campaign Add-Ons &amp; Commercial Terms
        </h1>
        <p className="mt-3 text-[16px] md:text-[18px] leading-[1.55] text-[#111418]/70">
          Transparent billing policies, campaign kickoff milestones, and optional marketing add-ons.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
        {/* 03. Additional Charges */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <h2 className="text-[28px] md:text-[36px] font-medium tracking-[-0.02em] leading-[1.1] text-[#111418]">
            03. Additional Charges
          </h2>
          <p className="mt-3 text-[15px] leading-[1.55] text-[#111418]/65">
            These items are not included in individual service rates or bundled packages unless
            specifically stated in the approved quotation.
          </p>

          <div className="mt-6 bg-white rounded-[20px] border border-[#111418]/10 overflow-hidden">
            <div className="grid grid-cols-12 px-4 sm:px-5 py-3 bg-[#12151b] text-white/80 text-[11px] sm:text-[12px] font-medium tracking-[0.04em] uppercase">
              <span className="col-span-5 sm:col-span-6">Additional Item</span>
              <span className="col-span-3 text-right">Price</span>
              <span className="col-span-4 sm:col-span-3 text-right">Optional</span>
            </div>

            <ul className="divide-y divide-[#111418]/8">
              {ADDITIONAL_CHARGES.map((item) => {
                const active = Boolean(selectedAddons[item.id]);
                return (
                  <li
                    key={item.id}
                    className={`grid grid-cols-12 items-center px-4 sm:px-5 py-3.5 text-[13.5px] sm:text-[14px] md:text-[15px] transition-colors ${
                      active ? 'bg-[#ff5512]/[0.04]' : 'hover:bg-[#f4f7fb]/60'
                    }`}
                  >
                    <span className="col-span-5 sm:col-span-6 font-medium text-[#111418] pr-2">{item.name}</span>
                    <span className="col-span-3 text-right text-[#111418]/80 tabular-nums pr-2">
                      {item.priceLabel}
                    </span>
                    <div className="col-span-4 sm:col-span-3 flex justify-end">
                      {item.selectable ? (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.94 }}
                          onClick={() => onToggleAddon(item.id)}
                          aria-pressed={active}
                          className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[12px] font-medium transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#ff5512] text-white'
                              : 'border border-[#111418]/15 text-[#111418]/75 hover:bg-[#16191f] hover:text-white hover:border-[#16191f]'
                          }`}
                        >
                          {active ? (
                            <>
                              <Check className="w-3 h-3" aria-hidden="true" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" aria-hidden="true" />
                              Include
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <span className="text-[12px] text-[#111418]/40">By quote</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        {/* 04. Commercial Terms + 05. Quotation & Billing Policy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col gap-12"
        >
          <div>
            <h2 className="text-[28px] md:text-[36px] font-medium tracking-[-0.02em] leading-[1.1] text-[#111418]">
              04. Commercial Terms
            </h2>
            <p className="mt-3 text-[15px] leading-[1.55] text-[#111418]/65">
              Clear milestones and billing conditions agreed prior to project commencement.
            </p>

            <div className="mt-6 bg-white rounded-[20px] border border-[#111418]/10 overflow-hidden">
              <div className="grid grid-cols-12 px-4 sm:px-5 py-3 bg-[#12151b] text-white/80 text-[11px] sm:text-[12px] font-medium tracking-[0.04em] uppercase">
                <span className="col-span-5">Term</span>
                <span className="col-span-7">Condition</span>
              </div>
              <dl className="divide-y divide-[#111418]/8">
                {COMMERCIAL_TERMS.map((row) => (
                  <div
                    key={row.term}
                    className="grid grid-cols-12 items-center px-4 sm:px-5 py-3.5 text-[13.5px] sm:text-[14px] md:text-[15px] hover:bg-[#f4f7fb]/60 transition-colors"
                  >
                    <dt className="col-span-5 font-medium text-[#111418] pr-3">{row.term}</dt>
                    <dd className="col-span-7 text-[#111418]/75 tabular-nums">{row.condition}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <h2 className="text-[28px] md:text-[36px] font-medium tracking-[-0.02em] leading-[1.1] text-[#111418]">
              05. Quotation &amp; Billing Policy
            </h2>
            <ul className="mt-5 space-y-3.5 border-t border-[#111418]/10 pt-5">
              {QUOTATION_POLICY.map((point, index) => (
                <li
                  key={point}
                  className="flex items-start gap-3.5 text-[15px] leading-[1.55] text-[#111418]/80"
                >
                  <span className="font-mono text-[12px] font-medium text-[#ff5512] pt-[3px] tabular-nums">
                    0{index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Cross-Page Footer Bar */}
      <div className="mt-14 pt-8 border-t border-[#111418]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[15px] text-[#111418]/65">
          Ready to finalize your campaign scope and generate a marketing quotation?
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('pricing')}
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-white border border-[#111418]/15 text-[14px] font-medium text-[#111418] hover:bg-[#111418]/5 transition-colors cursor-pointer"
          >
            View Rate Card
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
