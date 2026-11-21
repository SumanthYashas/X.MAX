import { CheckCircle2, Cpu, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types/routing';

interface WhyXmaxSectionProps {
  onNavigate: (route: PageRoute) => void;
}

const ADVANTAGES = [
  {
    num: '01',
    title: 'Performance-Engineered Ad Creative',
    summary:
      'Every static banner, carousel, and 9:16 Reels video is structured around proven 3-second visual hooks and clear direct-response CTAs.',
    Icon: Cpu,
  },
  {
    num: '02',
    title: 'Human-Led Marketing Strategy',
    summary:
      'Positioning, buyer-psychology messaging, offer framing, and audience segmentation are guided by experienced performance marketers.',
    Icon: Sparkles,
  },
  {
    num: '03',
    title: 'Full-Funnel ROI Focus',
    summary:
      'We connect every deliverable to measurable marketing metrics—click-through rate, cost per lead, conversion rate, and blended ROAS.',
    Icon: Target,
  },
  {
    num: '04',
    title: 'Rapid A/B Creative Velocity',
    summary:
      'Structured weekly creative sprints ship fresh ad hooks and landing variants fast so your paid accounts never stall from fatigue.',
    Icon: Zap,
  },
  {
    num: '05',
    title: 'Transparent Marketing Scopes',
    summary:
      'Modular rate-card pricing and turnkey campaign packages. Ad spend goes directly to Meta and Google—zero hidden markups or lock-ins.',
    Icon: ShieldCheck,
  },
];

export function WhyXmaxSection({ onNavigate }: WhyXmaxSectionProps) {
  return (
    <section
      id="why-xmax"
      aria-label="05 Why X.MAX"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] py-[80px] md:py-[110px]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111418]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111418] text-white text-[12px] font-mono tracking-wider uppercase mb-3">
            <span className="text-[#ff5512] font-bold">05</span>
            <span>WHY X.MAX</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] md:text-[50px] font-medium tracking-[-0.025em] leading-[1.04] text-[#111418]">
            Performance creative, paid acquisition, and conversion engineering.
          </h2>
        </div>
        <p className="text-[15px] md:text-[16px] text-[#111418]/65 max-w-md leading-relaxed">
          Modern digital marketing demands scroll-stopping creative paired with disciplined attribution. Here is why growth brands choose X.MAX.
        </p>
      </div>

      {/* Grid of 5 Advantages */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ADVANTAGES.map((adv, idx) => {
          const Icon = adv.Icon;
          return (
            <motion.div
              key={adv.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                idx === 0
                  ? 'bg-[#12151b] text-white border border-white/10'
                  : 'bg-white text-[#111418] border border-[#111418]/10 hover:shadow-[0_16px_40px_rgba(17,20,24,0.05)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-[12px] ${
                      idx === 0 ? 'bg-white/10 text-[#ff5512]' : 'bg-[#111418]/5 text-[#ff5512]'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#ff5512]">
                    {adv.num}
                  </span>
                </div>

                <h3 className="text-[20px] sm:text-[22px] font-medium tracking-tight">
                  {adv.title}
                </h3>
                <p
                  className={`mt-2.5 text-[14px] leading-[1.6] ${
                    idx === 0 ? 'text-white/70' : 'text-[#111418]/65'
                  }`}
                >
                  {adv.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-[12px] opacity-60 font-mono">
                <span>Advantage {adv.num}</span>
                <span>Verified Quality</span>
              </div>
            </motion.div>
          );
        })}

        {/* 6th Card: Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[24px] p-6 sm:p-7 flex flex-col justify-between bg-[#f0f4fa] border border-[#111418]/10"
        >
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff5512] font-semibold block mb-2">
              OUR PROMISE
            </span>
            <h3 className="text-[20px] sm:text-[22px] font-medium tracking-tight text-[#111418]">
              Ideas Into Impact.
            </h3>
            <p className="mt-2 text-[14px] text-[#111418]/70 leading-relaxed">
              We stand behind our commitments: transparent milestone billing, professional file handoffs, and honest communication.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#111418]/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="text-[13px] font-medium text-[#ff5512] hover:underline cursor-pointer"
            >
              Start a Project Scope →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="text-[12px] text-[#111418]/50 hover:text-[#111418] cursor-pointer"
            >
              Read Terms
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
