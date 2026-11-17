import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

const STILL_SHEET_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261109_062058_badb8004-99df-4227-91bb-ecd9ca4d0adb.png&w=2048&q=85';
const VIDEO_SHEET_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261109_065027_c89c0a52-25ea-47a9-9e65-f17ff3ea5daf.mp4';

interface ClipConfig {
  id: number;
  track: 'V1' | 'V2';
  leftPct: string;
  bgPos: string;
  label: string;
  fallbackBg: string;
  cropX: number;
  cropY: number;
}

const K = 1280 / 2418;
const SRC_SIZE = 572 * K;
const ROW1_Y = 65.5 * (720 / 1360);
const ROW2_Y = 709.5 * (720 / 1360);

const CLIPS: ClipConfig[] = [
  {
    id: 0,
    track: 'V1',
    leftPct: '9.5%',
    bgPos: '5.217% 8.312%',
    label: 'Graphic Design',
    fallbackBg: 'linear-gradient(135deg, #c6dcf9 0%, #ff5512 100%)',
    cropX: 262 * K,
    cropY: ROW1_Y,
  },
  {
    id: 1,
    track: 'V2',
    leftPct: '22.9%',
    bgPos: '49.966% 8.312%',
    label: 'Brand Identity',
    fallbackBg: 'linear-gradient(135deg, #1633c8 0%, #0d1b6e 100%)',
    cropX: 922.5 * K,
    cropY: ROW1_Y,
  },
  {
    id: 2,
    track: 'V1',
    leftPct: '34.1%',
    bgPos: '94.851% 8.312%',
    label: 'Video & Motion',
    fallbackBg: 'linear-gradient(135deg, #ff6d28 0%, #1d4ed8 100%)',
    cropX: 1585 * K,
    cropY: ROW1_Y,
  },
  {
    id: 3,
    track: 'V2',
    leftPct: '50.6%',
    bgPos: '5.217% 90.04%',
    label: 'Web Development',
    fallbackBg: 'linear-gradient(135deg, #0b2478 0%, #ff5512 100%)',
    cropX: 262 * K,
    cropY: ROW2_Y,
  },
  {
    id: 4,
    track: 'V1',
    leftPct: '66.2%',
    bgPos: '49.966% 90.04%',
    label: 'Digital Marketing',
    fallbackBg: 'linear-gradient(135deg, #ff5512 0%, #fb923c 100%)',
    cropX: 922.5 * K,
    cropY: ROW2_Y,
  },
];

function buildSquirclePath(points = 160, exp = 4.2): string {
  const coords: string[] = [];
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    const x = 0.5 + 0.5 * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / exp);
    const y = 0.5 + 0.5 * Math.sign(st) * Math.pow(Math.abs(st), 2 / exp);
    coords.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(4)},${y.toFixed(4)}`);
  }
  return `${coords.join(' ')} Z`;
}

export function TimelineStatement() {
  const [paused, setPaused] = useState(false);
  const [timeSec, setTimeSec] = useState(2.4);
  const [videoReady, setVideoReady] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineBoxRef = useRef<HTMLDivElement | null>(null);
  const sentenceRef = useRef<HTMLHeadingElement | null>(null);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null, null, null]);
  const timelineSlotRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null]);
  const blockRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null]);
  const firstClipInnerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([null, null, null, null, null]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const inSentenceRef = useRef(false);
  const flightTlRef = useRef<gsap.core.Timeline | null>(null);
  const hasRevealedFirstRef = useRef(false);
  const videoDrawAllowedRef = useRef(true);

  const squircleD = useMemo(() => buildSquirclePath(160, 4.2), []);

  // Video + Playhead + Canvas crop loop
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section) return;

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: '200px' }
    );
    io.observe(section);

    if (video) {
      if (paused) {
        video.pause();
      } else {
        video.play().catch(() => {
          // Autoplay blocked or CORS issue; still image shows gracefully
        });
      }
    }

    let lastTime = performance.now();
    let rafId = 0;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (visible && !pausedRef.current) {
        setTimeSec((prev) => (prev + dt) % 6);

        if (
          video &&
          video.readyState >= 2 &&
          videoDrawAllowedRef.current &&
          !video.paused
        ) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          for (let i = 0; i < CLIPS.length; i++) {
            const c = canvasRefs.current[i];
            if (!c) continue;
            const rect = c.getBoundingClientRect();
            const targetSize = Math.max(64, Math.round(rect.width * dpr));
            if (c.width !== targetSize || c.height !== targetSize) {
              c.width = targetSize;
              c.height = targetSize;
            }
            const ctx = c.getContext('2d');
            if (!ctx) continue;
            try {
              ctx.drawImage(
                video,
                CLIPS[i].cropX,
                CLIPS[i].cropY,
                SRC_SIZE,
                SRC_SIZE,
                0,
                0,
                c.width,
                c.height
              );
            } catch {
              // Tainted canvas or CORS error: gracefully disable canvas draw and rely on still sheet
              videoDrawAllowedRef.current = false;
              setVideoReady(false);
              break;
            }
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, [paused]);

  // FLIP flight & First Reveal logic
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    const sentence = sentenceRef.current;
    const timelineBox = timelineBoxRef.current;
    if (!section || !sentence || !timelineBox) return;

    const computeTargets = () => {
      return CLIPS.map((_, i) => {
        const sSlot = slotRefs.current[i];
        const tSlot = timelineSlotRefs.current[i];
        if (!sSlot || !tSlot) return { x: 0, y: 0, scale: 1 };
        const sr = sSlot.getBoundingClientRect();
        const tr = tSlot.getBoundingClientRect();
        const scale = tr.width > 0 ? sr.width / tr.width : 1;
        const x = sr.left - tr.left + (sr.width - tr.width) / 2;
        const y = sr.top - tr.top + (sr.height - tr.height) / 2;
        return { x, y, scale };
      });
    };

    const snapToState = (toSentence: boolean) => {
      flightTlRef.current?.kill();
      const targets = toSentence ? computeTargets() : null;
      CLIPS.forEach((_, i) => {
        const block = blockRefs.current[i];
        if (!block) return;
        if (toSentence && targets) {
          gsap.set(block, {
            x: targets[i].x,
            y: targets[i].y,
            scale: targets[i].scale,
            rotation: 0,
            transformOrigin: 'center center',
          });
        } else {
          gsap.set(block, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            transformOrigin: 'center center',
          });
        }
      });
    };

    const flyTo = (toSentence: boolean) => {
      if (inSentenceRef.current === toSentence) return;
      inSentenceRef.current = toSentence;

      if (prefersReduced) {
        snapToState(toSentence);
        return;
      }

      flightTlRef.current?.kill();
      const tl = gsap.timeline();
      flightTlRef.current = tl;
      const targets = toSentence ? computeTargets() : null;

      CLIPS.forEach((_, i) => {
        const block = blockRefs.current[i];
        if (!block) return;
        const start = i * (toSentence ? 0.1 : 0.05);
        const dest = toSentence && targets ? targets[i] : { x: 0, y: 0, scale: 1 };
        const wobble = (Math.random() * 2 - 1) * 15;

        tl.to(
          block,
          {
            x: dest.x,
            y: dest.y,
            scale: dest.scale,
            duration: 1.5,
            ease: 'power2.inOut',
            transformOrigin: 'center center',
          },
          start
        );

        tl.to(
          block,
          {
            rotation: wobble,
            duration: 0.75,
            ease: 'power2.in',
          },
          start
        ).to(
          block,
          {
            rotation: 0,
            duration: 0.75,
            ease: 'power2.out',
          },
          start + 0.75
        );
      });
    };

    // Initial state on tracks after fonts settle
    document.fonts?.ready?.then(() => {
      snapToState(inSentenceRef.current);
    });

    let lastScrollY = window.scrollY;
    let sectionVisible = false;

    const io = new IntersectionObserver(
      (entries) => {
        sectionVisible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(section);

    const onScroll = () => {
      const currentY = window.scrollY;
      const dir = currentY > lastScrollY ? 'down' : currentY < lastScrollY ? 'up' : 'none';
      lastScrollY = currentY;

      // First reveal check
      if (!prefersReduced && !hasRevealedFirstRef.current && !inSentenceRef.current) {
        const tRect = timelineBox.getBoundingClientRect();
        if (tRect.top <= window.innerHeight + 300) {
          hasRevealedFirstRef.current = true;
          if (firstClipInnerRef.current) {
            gsap.fromTo(
              firstClipInnerRef.current,
              { y: -300, rotation: 15 },
              { y: 0, rotation: 0, duration: 2, ease: 'power1.out' }
            );
          }
        }
      }

      if (!sectionVisible || dir === 'none') return;

      const sRect = sentence.getBoundingClientRect();
      const sentenceInView = sRect.top < window.innerHeight && sRect.bottom > 0;
      if (sentenceInView) {
        if (dir === 'down') {
          flyTo(true);
        } else if (dir === 'up') {
          flyTo(false);
        }
      }
    };

    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        snapToState(inSentenceRef.current);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      flightTlRef.current?.kill();
    };
  }, []);

  const playheadLeftPct = `${8 + (89.6 * timeSec) / 6}%`;
  const formattedTime = `00:${Math.floor(timeSec).toString().padStart(2, '0')}.${Math.floor(
    (timeSec % 1) * 100
  )
    .toString()
    .padStart(2, '0')}`;

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="X.MAX creative motion timeline and philosophy"
    >
      {/* Hidden SVG squircle clip-path definition */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="xmax-squircle-clip" clipPathUnits="objectBoundingBox">
            <path d={squircleD} />
          </clipPath>
        </defs>
      </svg>

      {/* Hidden source video for motion tiles */}
      <video
        ref={videoRef}
        src={VIDEO_SHEET_URL}
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        preload="auto"
        onLoadedData={() => setVideoReady(true)}
        onError={() => {
          videoDrawAllowedRef.current = false;
          setVideoReady(false);
        }}
        className="hidden"
        aria-hidden="true"
      />

      {/* Block 1: Dark Timeline Panel */}
      <div className="relative z-[1] flex justify-center pt-[72px] px-[12px] pb-[20px] md:pt-[calc(150*var(--u))] md:px-[calc(68*var(--u))] md:pb-[calc(60*var(--u))]">
        <div
          ref={timelineBoxRef}
          className="relative w-full max-w-[calc(1400*var(--u))] aspect-[1372/640] md:aspect-[1372/500]"
        >
          {/* Dark editor surface */}
          <div
            className="absolute inset-0 bg-[#12151b] rounded-[16px] md:rounded-[calc(44*var(--u))]"
            style={{
              boxShadow:
                '0 calc(40*var(--u)) calc(70*var(--u)) rgba(40,60,110,.22), 0 calc(6*var(--u)) calc(14*var(--u)) rgba(20,30,60,.18)',
            }}
          />

          {/* Pause / Play button */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play timeline preview' : 'Pause timeline preview'}
            className="absolute z-[3] flex items-center justify-center bg-[#2a2f39] hover:bg-[#363c48] text-white transition-colors cursor-pointer left-[1.6%] top-[3.4%] w-[17px] h-[17px] rounded-[5px] md:left-[1.7%] md:top-[4.4%] md:w-[calc(40*var(--u))] md:h-[calc(40*var(--u))] md:rounded-[calc(11*var(--u))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {paused ? (
              <svg
                viewBox="0 0 11 12"
                className="w-[5px] h-[6px] md:w-[calc(11*var(--u))] md:h-[calc(12*var(--u))]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M1.5 1L10 6L1.5 11V1Z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 11 12"
                className="w-[5px] h-[6px] md:w-[calc(11*var(--u))] md:h-[calc(12*var(--u))]"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="3" height="10" rx="0.8" />
                <rect x="7" y="1" width="3" height="10" rx="0.8" />
              </svg>
            )}
          </button>

          {/* Time Ruler */}
          <div className="absolute left-[8%] right-[2.4%] top-[4.6%] h-[14px] md:top-[5.2%] md:h-[calc(28*var(--u))] flex items-center justify-between select-none pointer-events-none">
            {[0, 1, 2, 3, 4, 5, 6].map((sec, idx) => (
              <div key={sec} className="contents">
                <span className="text-[8px] md:text-[calc(13*var(--u))] font-semibold text-[#e9edf3] tabular-nums">
                  {sec}s
                </span>
                {idx < 6 && (
                  <>
                    <span className="w-[1px] h-[5px] md:h-[calc(10*var(--u))] bg-white/22" />
                    <span className="hidden md:inline-block w-[1px] h-[calc(10*var(--u))] bg-white/22" />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* V1 & V2 Lanes */}
          <div className="absolute left-[8%] right-[2.4%] top-[16%] h-[33%] rounded-[7px] md:rounded-[calc(14*var(--u))] bg-white/[0.05] pointer-events-none" />
          <div className="absolute left-[8%] right-[2.4%] top-[56%] h-[33%] rounded-[7px] md:rounded-[calc(14*var(--u))] bg-white/[0.05] pointer-events-none" />

          <span className="absolute left-[2.4%] md:left-[2.9%] top-[32.5%] -translate-y-1/2 font-mono font-semibold text-[8px] md:text-[calc(13*var(--u))] text-[#8d97a8] tracking-[0.04em] select-none pointer-events-none">
            V1
          </span>
          <span className="absolute left-[2.4%] md:left-[2.9%] top-[72.5%] -translate-y-1/2 font-mono font-semibold text-[8px] md:text-[calc(13*var(--u))] text-[#8d97a8] tracking-[0.04em] select-none pointer-events-none">
            V2
          </span>

          {/* Five Clip Slots */}
          {CLIPS.map((clip, i) => (
            <div
              key={clip.id}
              ref={(el) => {
                timelineSlotRefs.current[i] = el;
              }}
              style={{
                left: clip.leftPct,
                top: clip.track === 'V1' ? '18.5%' : '58.5%',
              }}
              className="absolute h-[28%] aspect-square"
            >
              <div
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className="relative z-[1] w-full h-full will-change-transform"
              >
                <div
                  ref={i === 0 ? firstClipInnerRef : undefined}
                  title={clip.label}
                  className="timeline-tile-glow relative w-full h-full overflow-hidden"
                  style={{
                    clipPath: 'url(#xmax-squircle-clip)',
                    backgroundImage: `url("${STILL_SHEET_URL}"), ${clip.fallbackBg}`,
                    backgroundSize: '358.04% 237.76%, cover',
                    backgroundPosition: `${clip.bgPos}, center`,
                  }}
                >
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[i] = el;
                    }}
                    className={`absolute inset-0 w-full h-full block transition-opacity duration-400 ${
                      videoReady ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Sweeping Orange Playhead */}
          <div
            style={{ left: playheadLeftPct }}
            className="pointer-events-none absolute top-[12.5%] bottom-[4.5%] z-[2] w-[1.5px] md:w-[calc(2*var(--u))] bg-[#ff5512]"
          >
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[2px] whitespace-nowrap rounded-[4px] md:rounded-[calc(6*var(--u))] bg-[#ff5512] text-white font-semibold tabular-nums text-[7.5px] px-[4px] py-[3px] md:text-[calc(11.5*var(--u))] md:px-[calc(7*var(--u))] md:py-[calc(5*var(--u))] leading-none">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Block 2: Statement with 5 inline target slots */}
      <div className="pt-[52px] px-[20px] pb-[64px] md:pt-[76px] md:px-[40px] md:pb-[76px] lg:pt-[calc(120*var(--u))] lg:px-[calc(90*var(--u))] lg:pb-[calc(120*var(--u))]">
        <h2
          ref={sentenceRef}
          className="mx-auto text-center font-medium text-[#111418] text-[8.4vw] leading-[1.15] tracking-[-0.012em] sm:text-[34px] md:text-[42px] md:leading-[1.12] lg:text-[calc(57.2*var(--u))] lg:leading-[1.08] md:max-w-[31.5ch]"
        >
          X.MAX{' '}
          <span
            ref={(el) => {
              slotRefs.current[0] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          turns raw ideas{' '}
          <span
            ref={(el) => {
              slotRefs.current[1] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          into
          <br className="hidden md:inline" /> brand identity,{' '}
          <span
            ref={(el) => {
              slotRefs.current[2] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          motion, web{' '}
          <span
            ref={(el) => {
              slotRefs.current[3] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          &amp;
          <br className="hidden md:inline" /> growth{' '}
          <span
            ref={(el) => {
              slotRefs.current[4] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          priced transparently.
        </h2>
      </div>
    </section>
  );
}
