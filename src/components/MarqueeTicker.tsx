import { useEffect, useRef } from 'react';

interface TickerWordmark {
  label: string;
  className: string;
}

const TICKER_ITEMS: TickerWordmark[] = [
  { label: 'META ADS', className: 'font-archivo uppercase tracking-[-0.01em]' },
  { label: 'GOOGLE ADS', className: 'font-unbounded font-bold tracking-[0.02em]' },
  { label: 'REELS ADS', className: 'font-syncopate font-bold text-[19px] md:text-[20px] lg:text-[calc(26*var(--u))] tracking-[0.04em]' },
  { label: 'SEO AUDIT', className: 'font-michroma text-[19px] md:text-[19px] lg:text-[calc(25*var(--u))] tracking-[0.06em]' },
  { label: 'FUNNELS', className: 'font-inter-tight font-light text-[19px] md:text-[21px] lg:text-[calc(28*var(--u))] tracking-[0.36em]' },
  { label: 'Growth', className: 'font-inter-tight font-semibold tracking-[-0.03em]' },
  { label: 'CRO & UX', className: 'font-unbounded font-bold tracking-[0.02em]' },
  { label: 'ROAS SCALE', className: 'font-archivo uppercase' },
];

export function MarqueeTicker() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const list = listRef.current;
    if (!section || !track || !list) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let visible = false;
    let x = 0;
    let boost = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let rafId = 0;

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0 }
    );
    io.observe(section);

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollY);
      lastScrollY = currentY;
      boost += delta * 2.2;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (visible) {
        const vw = window.innerWidth;
        const isMobile = vw <= 767;
        const speedMult = isMobile ? 2.4 : 1;
        const listWidth = list.getBoundingClientRect().width;
        if (listWidth > 0) {
          x -= (70 + boost) * dt * (vw / 1536) * speedMult;
          if (x <= -listWidth) {
            x += listWidth;
          }
          track.style.transform = `translate3d(${x}px, 0, 0)`;
        }
      }

      boost *= Math.pow(0.04, dt);
      if (boost < 0.01) boost = 0;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const renderList = (isClone: boolean) => (
    <ul
      ref={isClone ? undefined : listRef}
      aria-hidden={isClone || undefined}
      className="flex shrink-0 items-center list-none m-0 gap-[48px] pr-[48px] text-[22px] md:gap-[64px] md:pr-[64px] md:text-[24px] lg:gap-[calc(96*var(--u))] lg:pr-[calc(96*var(--u))] lg:text-[calc(30*var(--u))] leading-none text-[#0c0e12]"
    >
      {TICKER_ITEMS.map((item) => (
        <li
          key={item.label}
          className={`flex items-center shrink-0 h-[32px] md:h-[36px] lg:h-[calc(48*var(--u))] whitespace-nowrap select-none ${item.className}`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );

  return (
    <section
      ref={sectionRef}
      aria-label="X.MAX core digital marketing disciplines"
      className="pt-[44px] pb-[16px] md:pt-[56px] md:pb-[24px] lg:pt-[calc(72*var(--u))] lg:pb-[calc(40*var(--u))]"
    >
      <p className="text-center px-[20px] text-[13.5px] md:text-[16px] lg:text-[calc(20.66*var(--u))] tracking-[0.033em] text-[rgba(15,20,30,0.42)]">
        Paid Acquisition • Performance Creatives • Reels Ads • SEO &amp; Funnels
      </p>

      <div className="marquee-mask w-full overflow-hidden mt-[28px] md:mt-[36px] lg:mt-[calc(52*var(--u))]">
        <div ref={trackRef} className="flex w-max will-change-transform">
          {renderList(false)}
          {renderList(true)}
        </div>
      </div>
    </section>
  );
}
