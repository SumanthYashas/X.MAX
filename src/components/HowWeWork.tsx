import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PageRoute } from '../types/routing';

interface HowWeWorkProps {
  onNavigate: (route: PageRoute) => void;
}

const WORKFLOW_STEPS = [
  {
    step: '01',
    phase: 'DISCOVER',
    title: 'Understand Your Business',
    detail:
      'We learn about your business, audience, competitors, goals and project requirements before work begins.',
  },
  {
    step: '02',
    phase: 'RESEARCH',
    title: 'Build Context',
    detail:
      'We review relevant market trends, audience needs, competitor activity and category conventions to inform the direction.',
  },
  {
    step: '03',
    phase: 'STRATEGIZE',
    title: 'Plan With Purpose',
    detail:
      'We develop a tailored creative or digital plan, define deliverables and agree on priorities, timelines and success measures.',
  },
  {
    step: '04',
    phase: 'CREATE',
    title: 'Combine Creativity & Technology',
    detail:
      'We develop the agreed work using professional creative software, modern production techniques and AI-assisted tools where useful.',
  },
  {
    step: '05',
    phase: 'OPTIMIZE',
    title: 'Review & Refine',
    detail:
      'We quality-check the work, incorporate agreed feedback and use available performance insights to identify practical improvements.',
  },
  {
    step: '06',
    phase: 'DELIVER',
    title: 'Finish With Precision',
    detail:
      'We deliver approved files and assets in the agreed formats, along with handover notes included in the project scope.',
  },
];

const TECH_TOOLS = [
  {
    code: 'Ps',
    tool: 'Adobe Photoshop',
    usage: 'Image editing, compositing, retouching and creative production.',
    bg: '#001E36',
    fg: '#31A8FF',
  },
  {
    code: 'Ai',
    tool: 'Adobe Illustrator',
    usage: 'Vector artwork, logo development and brand assets.',
    bg: '#330000',
    fg: '#FF9A00',
  },
  {
    code: 'Pr',
    tool: 'Adobe Premiere Pro',
    usage: 'Video editing, storytelling and social-first content.',
    bg: '#00005B',
    fg: '#9999FF',
  },
  {
    code: 'Ae',
    tool: 'Adobe After Effects',
    usage: 'Motion graphics, animation and visual effects.',
    bg: '#00005B',
    fg: '#9999FF',
  },
  {
    code: 'Lr',
    tool: 'Adobe Lightroom',
    usage: 'Photo enhancement, colour correction and image consistency.',
    bg: '#001E36',
    fg: '#31A8FF',
  },
  {
    code: 'Id',
    tool: 'Adobe InDesign',
    usage: 'Brochures, layouts, documents and multi-page publications.',
    bg: '#49021F',
    fg: '#FF3366',
  },
] as const;

function SoftwareTileIcon({
  code,
  bg,
  fg,
  size = 44,
}: {
  code: string;
  bg: string;
  fg: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className="shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
    >
      <rect x="0.5" y="0.5" width="43" height="43" rx="10" fill={bg} />
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="9"
        stroke={fg}
        strokeOpacity="0.28"
        strokeWidth="1"
      />
      <text
        x="22"
        y="27.5"
        textAnchor="middle"
        fill={fg}
        fontFamily="Inter Tight, Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="17"
        letterSpacing="-0.03em"
      >
        {code}
      </text>
    </svg>
  );
}

const AI_WORKFLOWS = [
  {
    area: 'Creative exploration',
    usage: 'Explore early concepts, visual directions and campaign ideas.',
  },
  {
    area: 'Research support',
    usage: 'Organize research, explore trends and assist competitor and audience analysis.',
  },
  {
    area: 'Content development',
    usage: 'Support brainstorming, outlines, copy variations and messaging refinement.',
  },
  {
    area: 'Image workflows',
    usage: 'Assist with image ideation, enhancement and selected production tasks.',
  },
  {
    area: 'Video workflows',
    usage: 'Support storyboarding, transcription, subtitles and editing preparation.',
  },
  {
    area: 'Marketing analysis',
    usage: 'Help interpret available campaign data and identify areas to investigate.',
  },
  {
    area: 'Workflow efficiency',
    usage: 'Reduce repetitive tasks and help organize production processes.',
  },
];

const WHY_XMAX = [
  {
    title: 'AI-Enhanced Workflows',
    detail:
      'We use modern AI tools selectively to support research, ideation and production efficiency.',
  },
  {
    title: 'Human-Led Creativity',
    detail:
      'Creative direction is guided by design expertise, brand understanding and human judgement.',
  },
  {
    title: 'Strategy-Driven Execution',
    detail:
      'We connect deliverables to client objectives instead of creating content without a clear purpose.',
  },
  {
    title: 'Efficient Production',
    detail:
      'Structured workflows help us manage time and maintain consistent quality.',
  },
  {
    title: 'Customized Solutions',
    detail:
      "Every project is scoped around the client's requirements, budget and goals.",
  },
];

const THREE_PILLARS = [
  {
    title: 'Creativity',
    caption: 'Ideas that stand out.',
  },
  {
    title: 'Technology',
    caption: 'Intelligence that accelerates.',
  },
  {
    title: 'Strategy',
    caption: 'Execution that matters.',
  },
];

type CapabilityTab = 'tech' | 'ai' | 'why';

export function HowWeWork({ onNavigate }: HowWeWorkProps) {
  const [activeTab, setActiveTab] = useState<CapabilityTab>('tech');

  return (
    <section
      id="how-we-work"
      aria-label="How X.MAX works"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pb-[88px] md:pb-[124px]"
    >
      {/* Part A: Approach & Promise */}
      <div className="pt-[64px] md:pt-[88px] border-t border-[#111418]/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end"
        >
          <div className="lg:col-span-6">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[#111418]/50 mb-3">
              How We Work · Our Approach &amp; Technology
            </p>
            <h2 className="text-[32px] md:text-[46px] font-medium tracking-[-0.025em] leading-[1.06] text-[#111418] [text-wrap:balance]">
              We don&rsquo;t just create. We innovate, optimize and deliver.
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-3 text-[15px] md:text-[16px] leading-[1.6] text-[#111418]/75">
            <p>
              At X.MAX, we combine creative expertise, advanced digital tools and AI-assisted
              workflows to help brands communicate clearly, work smarter and build stronger digital
              experiences.
            </p>
            <p>
              Our work is human-led and technology-enabled. We select the right tools for each
              brief while keeping strategy, craft and client objectives at the centre of every
              project.
            </p>
            <p className="text-[#111418] font-medium pt-1">
              Our promise: thoughtful creative work, purposeful strategy and transparent project
              delivery.
            </p>
          </div>
        </motion.div>

        {/* Three Pillars Row */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {THREE_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[20px] bg-white border border-[#111418]/10 px-6 py-5 flex items-baseline justify-between gap-4"
            >
              <div>
                <p className="text-[12px] font-mono text-[#ff5512] mb-1">0{i + 1}</p>
                <h3 className="text-[19px] font-medium tracking-[-0.01em] text-[#111418]">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-[14px] text-[#111418]/65 text-right">{pillar.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Part B: 01. Our Workflow (6 Steps) */}
      <div className="mt-16 pt-12 border-t border-[#111418]/10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4"
        >
          <p className="font-mono text-[13px] font-medium text-[#ff5512] mb-2">01. Our Workflow</p>
          <h3 className="text-[26px] md:text-[32px] font-medium tracking-[-0.02em] leading-[1.12] text-[#111418]">
            Six clear stages from brief to handover.
          </h3>
          <p className="mt-3 text-[15px] leading-[1.6] text-[#111418]/70">
            A clear process keeps projects focused, collaborative and aligned with the approved
            scope.
          </p>
        </motion.div>

        <div className="lg:col-span-8 bg-white rounded-[24px] border border-[#111418]/10 divide-y divide-[#111418]/10 overflow-hidden">
          {WORKFLOW_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-6 md:px-8 md:py-6 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-7 hover:bg-[#f4f7fb]/60 transition-colors"
            >
              <div className="flex items-center gap-3 sm:w-[140px] shrink-0 pt-0.5">
                <span className="font-mono text-[13px] font-semibold text-[#ff5512] tabular-nums">
                  {item.step}
                </span>
                <span className="font-mono text-[12px] font-semibold tracking-[0.04em] text-[#111418]">
                  {item.phase}
                </span>
              </div>

              <div className="flex-1">
                <h4 className="text-[18px] font-medium tracking-[-0.01em] text-[#111418]">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-[#111418]/70">
                  {item.detail}
                </p>
                {item.step === '04' && (
                  <div
                    className="mt-3.5 flex flex-wrap items-center gap-2"
                    aria-label="Adobe Creative Cloud software suite"
                  >
                    {TECH_TOOLS.map((sw) => (
                      <div key={sw.code} title={sw.tool} className="group">
                        <SoftwareTileIcon code={sw.code} bg={sw.bg} fg={sw.fg} size={28} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Part C: Interactive Switcher for 02. Technology, 03. AI Innovation, 04. Why X.MAX */}
      <div className="mt-16 pt-12 border-t border-[#111418]/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[#111418]/50 mb-2">
              Creative Stack &amp; Intelligence
            </p>
            <h3 className="text-[26px] md:text-[34px] font-medium tracking-[-0.02em] leading-[1.1] text-[#111418]">
              Creative thinking. Advanced technology. Intelligent execution.
            </h3>
          </div>

          <div
            role="tablist"
            aria-label="X.MAX technology and approach details"
            className="w-full sm:w-auto max-w-full overflow-x-auto no-scrollbar flex items-center gap-1 p-1.5 bg-[#e8edf5] rounded-[14px] self-start lg:self-auto"
          >
            {[
              { id: 'tech' as const, label: '02. Technology Stack' },
              { id: 'ai' as const, label: '03. AI Innovation' },
              { id: 'why' as const, label: '04. Why X.MAX' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative whitespace-nowrap shrink-0 px-4 py-2 rounded-[10px] text-[13px] md:text-[14px] font-medium transition-colors cursor-pointer ${
                    active ? 'text-[#111418]' : 'text-[#111418]/65 hover:text-[#111418]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="how-we-work-tab"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-white rounded-[10px] shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === 'tech' && (
              <motion.div
                key="tab-tech"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[24px] border border-[#111418]/10 overflow-hidden"
              >
                <div className="px-6 md:px-8 py-5 border-b border-[#111418]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-[18px] font-medium text-[#111418]">
                    02. Our Technology Advantage
                  </h4>
                  <p className="text-[13px] text-[#111418]/60">
                    Industry-standard tools selected for each project&rsquo;s deliverables and
                    production needs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#111418]/8">
                  {[TECH_TOOLS.slice(0, 3), TECH_TOOLS.slice(3)].map((column, colIdx) => (
                    <ul key={colIdx} className="divide-y divide-[#111418]/8">
                      {column.map((item) => (
                        <li
                          key={item.tool}
                          className="group px-6 md:px-8 py-5 flex items-start gap-4 hover:bg-[#f4f7fb]/60 transition-colors"
                        >
                          <SoftwareTileIcon code={item.code} bg={item.bg} fg={item.fg} size={44} />
                          <div className="min-w-0">
                            <p className="text-[16px] font-medium text-[#111418]">{item.tool}</p>
                            <p className="mt-1 text-[14px] leading-[1.55] text-[#111418]/65">
                              {item.usage}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="tab-ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[24px] border border-[#111418]/10 overflow-hidden"
              >
                <div className="px-6 md:px-8 py-5 border-b border-[#111418]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-[18px] font-medium text-[#111418]">
                    03. AI-Powered Innovation
                  </h4>
                  <p className="text-[13px] text-[#111418]/60">
                    AI enhances capabilities—never replacing human creativity, judgement, or
                    accountability.
                  </p>
                </div>

                <ul className="divide-y divide-[#111418]/8">
                  {AI_WORKFLOWS.map((item) => (
                    <li
                      key={item.area}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 px-6 md:px-8 py-4 items-baseline"
                    >
                      <span className="sm:col-span-4 text-[15px] font-medium text-[#111418]">
                        {item.area}
                      </span>
                      <span className="sm:col-span-8 text-[14px] md:text-[15px] text-[#111418]/70">
                        {item.usage}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {activeTab === 'why' && (
              <motion.div
                key="tab-why"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[24px] border border-[#111418]/10 overflow-hidden"
              >
                <div className="px-6 md:px-8 py-5 border-b border-[#111418]/10">
                  <h4 className="text-[18px] font-medium text-[#111418]">
                    04. Why Choose X.MAX?
                  </h4>
                </div>

                <ul className="divide-y divide-[#111418]/8">
                  {WHY_XMAX.map((item, i) => (
                    <li
                      key={item.title}
                      className="px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
                    >
                      <div className="sm:w-[260px] shrink-0 flex items-baseline gap-3">
                        <span className="font-mono text-[12px] text-[#ff5512] tabular-nums">
                          0{i + 1}
                        </span>
                        <span className="text-[16px] font-medium text-[#111418]">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[15px] leading-[1.55] text-[#111418]/70">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Closing Dark Banner from PDF Page 4 */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 rounded-[24px] bg-[#12151b] text-white p-7 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-[12px] tracking-[0.04em] text-[#ff5512] mb-2">
              IDEAS INTO IMPACT · THINK BEYOND. CREATE BETTER. DELIVER SMARTER.
            </p>
            <p className="text-[16px] md:text-[18px] leading-[1.55] text-white/90">
              We believe the future of digital marketing belongs to brands that combine imagination
              with intelligence—bringing creativity, technology and strategy together.
            </p>
            <p className="mt-2.5 text-[12px] leading-[1.5] text-white/50">
              Note: AI tools and methods are selected according to project needs. Specific tools,
              deliverables, performance outcomes and timelines are confirmed in each approved
              quotation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="whitespace-nowrap shrink-0 h-[46px] px-5 rounded-[12px] bg-white/10 hover:bg-white/15 text-white text-[14px] font-medium transition-colors cursor-pointer"
            >
              Explore Pricing
            </button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('quote')}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 h-[46px] px-6 rounded-[12px] bg-[#ff5512] hover:bg-[#e5490b] text-white text-[14px] font-medium transition-colors cursor-pointer"
            >
              Build Custom Quote
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
