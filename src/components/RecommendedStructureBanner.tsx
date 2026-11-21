import { useState } from 'react';
import { ChevronDown, ChevronUp, Compass, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute } from '../types/routing';

interface RecommendedStructureBannerProps {
  onNavigate: (route: PageRoute) => void;
}

const STRUCTURE_ITEMS = [
  {
    num: '01',
    title: 'HOME & HERO',
    summary: 'Digital Marketing Engine. Interactive 3D badge & performance ad timeline.',
    anchorId: 'top',
  },
  {
    num: '02',
    title: 'OUR SERVICES',
    summary: 'Meta Ads, Google Ads, Reels creatives, SEO, and CRO funnels with starting rates.',
    anchorId: 'services',
  },
  {
    num: '03',
    title: 'CAMPAIGN STUDIO',
    summary: 'Live social ad creatives, conversion landing grids, and paid campaign formats.',
    anchorId: 'work',
  },
  {
    num: '04',
    title: 'HOW WE WORK',
    summary: 'Audience audit, ad hooks, tracking pixels, campaign launch and ROAS scaling.',
    anchorId: 'how-we-work',
  },
  {
    num: '05',
    title: 'WHY X.MAX',
    summary: 'Full-funnel paid media strategy, rapid creative testing, and conversion focus.',
    anchorId: 'why-xmax',
  },
  {
    num: '06',
    title: 'PRICING',
    summary: 'Modular digital marketing deliverable rates and optional turnkey growth bundles.',
    anchorId: 'pricing',
  },
  {
    num: '07',
    title: 'CONTACT',
    summary: 'Campaign enquiry form, email and WhatsApp.',
    anchorId: 'contact',
  },
];

export function RecommendedStructureBanner({ onNavigate }: RecommendedStructureBannerProps) {
  const [expanded, setExpanded] = useState(false);

  const scrollToSection = (anchorId: string) => {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside
      aria-label="Recommended Website Structure Blueprint"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pt-8 pb-4"
    >
      <div className="rounded-[20px] bg-[#0d1017] border border-white/10 text-white overflow-hidden shadow-2xl">
        {/* Banner Top Strip */}
        <div className="px-5 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 bg-[#151922] border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-[8px] bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-white">
                  Recommended Website Structure
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                  7-Part Architecture
                </span>
              </div>
              <p className="text-[12px] text-white/60">
                Explore X.MAX&apos;s structured sections from Hero through Services, Work, and Contact.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-white/10 hover:bg-white/15 text-[12px] font-medium text-white transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Hide Blueprint' : 'View Blueprint Map'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Architecture Map */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {STRUCTURE_ITEMS.map((item) => (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => scrollToSection(item.anchorId)}
                    className="group text-left p-4 rounded-[14px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[12px] text-emerald-400 font-bold">
                          {item.num}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h4 className="text-[15px] font-medium text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[12.5px] text-white/65 leading-snug">
                        {item.summary}
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-mono text-white/40 group-hover:text-emerald-400 transition-colors">
                      Jump to #{item.anchorId} →
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
