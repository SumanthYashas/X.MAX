import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Check,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const STILL_SHEET_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261109_062058_badb8004-99df-4227-91bb-ecd9ca4d0adb.png&w=2048&q=85';
const VIDEO_SHEET_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261109_065027_c89c0a52-25ea-47a9-9e65-f17ff3ea5daf.mp4';

interface ClipConfig {
  id: number;
  track: 'V1' | 'V2';
  leftPct: string;
  timeSecMark: number;
  bgPos: string;
  label: string;
  layerCode: string;
  fallbackBg: string;
  cropX: number;
  cropY: number;
}

type AeMenuId = 'comp' | 'layer' | 'effect' | 'view';

const K = 1280 / 2418;
const SRC_SIZE = 572 * K;
const ROW1_Y = 65.5 * (720 / 1360);
const ROW2_Y = 709.5 * (720 / 1360);

const CLIPS: ClipConfig[] = [
  {
    id: 0,
    track: 'V1',
    leftPct: '15.2%',
    timeSecMark: 0.4,
    bgPos: '5.217% 8.312%',
    label: 'Ad Creatives',
    layerCode: 'AD_KIT_01',
    fallbackBg: 'linear-gradient(135deg, #c6dcf9 0%, #ff5512 100%)',
    cropX: 262 * K,
    cropY: ROW1_Y,
  },
  {
    id: 1,
    track: 'V2',
    leftPct: '27.8%',
    timeSecMark: 1.5,
    bgPos: '49.966% 8.312%',
    label: 'Meta & Google Ads',
    layerCode: 'PAID_MEDIA_02',
    fallbackBg: 'linear-gradient(135deg, #1633c8 0%, #0d1b6e 100%)',
    cropX: 922.5 * K,
    cropY: ROW1_Y,
  },
  {
    id: 2,
    track: 'V1',
    leftPct: '39.4%',
    timeSecMark: 2.6,
    bgPos: '94.851% 8.312%',
    label: 'Reels Video Ads',
    layerCode: 'REELS_AD_03',
    fallbackBg: 'linear-gradient(135deg, #ff6d28 0%, #1d4ed8 100%)',
    cropX: 1585 * K,
    cropY: ROW1_Y,
  },
  {
    id: 3,
    track: 'V2',
    leftPct: '55.0%',
    timeSecMark: 3.9,
    bgPos: '5.217% 90.04%',
    label: 'Landing Funnels',
    layerCode: 'FUNNEL_04',
    fallbackBg: 'linear-gradient(135deg, #0b2478 0%, #ff5512 100%)',
    cropX: 262 * K,
    cropY: ROW2_Y,
  },
  {
    id: 4,
    track: 'V1',
    leftPct: '70.2%',
    timeSecMark: 5.1,
    bgPos: '49.966% 90.04%',
    label: 'SEO & Analytics',
    layerCode: 'GROWTH_05',
    fallbackBg: 'linear-gradient(135deg, #ff5512 0%, #fb923c 100%)',
    cropX: 922.5 * K,
    cropY: ROW2_Y,
  },
];

const KEYFRAME_MARKS = [0.6, 1.8, 3.0, 4.2, 5.4];

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
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);
  const [videoReady, setVideoReady] = useState(false);

  // Interactive After Effects CC workspace state
  const [openMenu, setOpenMenu] = useState<AeMenuId | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<number>(2);
  const [trackVisible, setTrackVisible] = useState<{ V1: boolean; V2: boolean }>({
    V1: true,
    V2: true,
  });
  const [soloTrack, setSoloTrack] = useState<'V1' | 'V2' | null>(null);
  const [showKeyframes, setShowKeyframes] = useState(true);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [motionBlurPreview, setMotionBlurPreview] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [clipsInSentence, setClipsInSentence] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineBoxRef = useRef<HTMLDivElement | null>(null);
  const trackAreaRef = useRef<HTMLDivElement | null>(null);
  const menuBarRef = useRef<HTMLDivElement | null>(null);
  const sentenceRef = useRef<HTMLHeadingElement | null>(null);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null, null, null]);
  const timelineSlotRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null]);
  const blockRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null]);
  const firstClipInnerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([null, null, null, null, null]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const flyToFnRef = useRef<((toSentence: boolean) => void) | null>(null);

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const isScrubbingRef = useRef(isScrubbing);
  isScrubbingRef.current = isScrubbing;
  const inSentenceRef = useRef(false);
  const flightTlRef = useRef<gsap.core.Timeline | null>(null);
  const hasRevealedFirstRef = useRef(false);
  const videoDrawAllowedRef = useRef(true);

  const squircleD = useMemo(() => buildSquirclePath(160, 4.2), []);

  // Ensure scrubbing stops even if pointer is released outside track area
  useEffect(() => {
    if (!isScrubbing) return;
    const stopScrub = () => setIsScrubbing(false);
    window.addEventListener('pointerup', stopScrub);
    return () => window.removeEventListener('pointerup', stopScrub);
  }, [isScrubbing]);

  // Dismiss menus on outside pointerdown or Escape
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

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
      video.playbackRate = speed;
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

      if (visible && !pausedRef.current && !isScrubbingRef.current) {
        setTimeSec((prev) => (prev + dt * speedRef.current) % 6);
      }

      if (
        visible &&
        video &&
        video.readyState >= 2 &&
        videoDrawAllowedRef.current &&
        (!video.paused || isScrubbingRef.current)
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
            videoDrawAllowedRef.current = false;
            setVideoReady(false);
            break;
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
  }, [paused, speed]);

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
      setClipsInSentence(toSentence);

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

    flyToFnRef.current = flyTo;

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

  const seekToTime = (sec: number) => {
    const clamped = Math.max(0, Math.min(5.99, sec));
    setTimeSec(clamped);
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration) && v.duration > 0) {
      try {
        v.currentTime = (clamped / 6) * v.duration;
      } catch {
        // Ignore seek errors on unbuffered streams
      }
    }
  };

  const scrubAtClientX = (clientX: number) => {
    const area = trackAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seekToTime(ratio * 5.99);
  };

  const resetAeTimeline = () => {
    setPaused(false);
    setSpeed(1);
    setTrackVisible({ V1: true, V2: true });
    setSoloTrack(null);
    setShowKeyframes(true);
    setShowGridOverlay(false);
    setMotionBlurPreview(false);
    setSelectedClipId(2);
    seekToTime(0);
    setOpenMenu(null);
    if (inSentenceRef.current) {
      flyToFnRef.current?.(false);
    }
  };

  const isTrackDimmed = (track: 'V1' | 'V2') => {
    if (!trackVisible[track]) return true;
    if (soloTrack && soloTrack !== track) return true;
    return false;
  };

  const activeClip = CLIPS[selectedClipId] ?? CLIPS[0];
  // Track area starts at 13.5% left, right edge is 2.4% (width = 84.1%)
  const playheadLeftPct = `${13.5 + (84.1 * timeSec) / 6}%`;
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

      {/* Block 1: Interactive Adobe After Effects (Ae) CC Timeline Workspace */}
      <div className="relative z-[1] flex justify-center pt-[72px] px-[12px] pb-[20px] md:pt-[calc(150*var(--u))] md:px-[calc(68*var(--u))] md:pb-[calc(60*var(--u))]">
        <div
          className="w-full max-w-[calc(1400*var(--u))] flex flex-col rounded-[16px] md:rounded-[calc(44*var(--u))] bg-[#12151b] border border-white/10"
          style={{
            boxShadow:
              '0 calc(40*var(--u)) calc(70*var(--u)) rgba(40,60,110,.22), 0 calc(6*var(--u)) calc(14*var(--u)) rgba(20,30,60,.18)',
          }}
        >
          {/* After Effects Top Application Bar */}
          <div
            ref={menuBarRef}
            className="relative z-40 rounded-t-[16px] md:rounded-t-[calc(44*var(--u))] bg-[#23262e] border-b border-black/45 px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-white"
          >
            <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 min-w-0">
              <span
                aria-hidden="true"
                className="inline-flex items-center justify-center w-6 h-6 mr-1.5 rounded-[6px] bg-[#00005B] border border-[#9999FF]/45 text-[#9999FF] font-bold text-[11.5px] tracking-[-0.03em] shrink-0"
              >
                Ae
              </span>

              {(
                [
                  { id: 'comp', label: 'Composition' },
                  { id: 'layer', label: 'Layer' },
                  { id: 'effect', label: 'Effect' },
                  { id: 'view', label: 'View' },
                ] as Array<{ id: AeMenuId; label: string }>
              ).map(({ id, label }) => {
                const isOpen = openMenu === id;
                return (
                  <div key={id} className="relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      onClick={() => setOpenMenu(isOpen ? null : id)}
                      onMouseEnter={() => {
                        if (openMenu && openMenu !== id) setOpenMenu(id);
                      }}
                      className={`px-2 py-1 rounded-[5px] text-[11px] transition-colors cursor-pointer select-none ${
                        isOpen
                          ? 'bg-[#3b82f6] text-white'
                          : 'text-white/75 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>

                    {isOpen && (
                      <div
                        role="menu"
                        aria-label={`${label} menu`}
                        className={`absolute top-full mt-1 w-[220px] rounded-[9px] bg-[#2b2e36] border border-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.65)] py-1.5 text-[11.5px] text-white z-50 ${
                          id === 'effect' || id === 'view'
                            ? 'right-0 sm:left-0 sm:right-auto'
                            : 'left-0'
                        }`}
                      >
                        {id === 'comp' && (
                          <>
                            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                              1920 × 1080 · 60 fps
                            </div>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setPaused((p) => !p);
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>{paused ? 'Play Preview' : 'Pause Preview'}</span>
                              <span className="font-mono text-[10px] text-white/50">Space</span>
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                seekToTime(0);
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Jump to 00:00</span>
                              <span className="font-mono text-[10px] text-white/50">Home</span>
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                const next = !inSentenceRef.current;
                                flyToFnRef.current?.(next);
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>
                                {clipsInSentence ? 'Dock Clips Back to Timeline' : 'Fly Clips to Statement'}
                              </span>
                            </button>
                            <div className="my-1 border-t border-white/10" />
                            <button
                              type="button"
                              role="menuitem"
                              onClick={resetAeTimeline}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Reset Composition</span>
                              <span className="font-mono text-[10px] text-white/50">⌥R</span>
                            </button>
                          </>
                        )}

                        {id === 'layer' && (
                          <>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() =>
                                setTrackVisible((prev) => ({ ...prev, V1: !prev.V1 }))
                              }
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Track V1 (Motion)</span>
                              {trackVisible.V1 && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() =>
                                setTrackVisible((prev) => ({ ...prev, V2: !prev.V2 }))
                              }
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Track V2 (Brand)</span>
                              {trackVisible.V2 && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            <div className="my-1 border-t border-white/10" />
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setSoloTrack((prev) => (prev === 'V1' ? null : 'V1'));
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Solo Track V1</span>
                              {soloTrack === 'V1' && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setSoloTrack((prev) => (prev === 'V2' ? null : 'V2'));
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Solo Track V2</span>
                              {soloTrack === 'V2' && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          </>
                        )}

                        {id === 'effect' && (
                          <>
                            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                              Time Stretch Speed
                            </div>
                            {([0.5, 1, 1.5] as const).map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setSpeed(rate);
                                  setOpenMenu(null);
                                }}
                                className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                              >
                                <span>Playback Rate: {rate}×</span>
                                {speed === rate && <Check className="w-3.5 h-3.5 shrink-0" />}
                              </button>
                            ))}
                            <div className="my-1 border-t border-white/10" />
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setMotionBlurPreview((v) => !v);
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Motion Blur Effect</span>
                              {motionBlurPreview && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          </>
                        )}

                        {id === 'view' && (
                          <>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setShowKeyframes((v) => !v);
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Keyframe Diamonds</span>
                              {showKeyframes && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setShowGridOverlay((v) => !v);
                                setOpenMenu(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#3b82f6] transition-colors cursor-pointer"
                            >
                              <span>Proportional Grid Guides</span>
                              {showGridOverlay && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#181a20] border border-white/10 text-[11px] font-mono text-white/75">
                <span>XMAX_AdReel_Comp.aep</span>
                <span className="text-white/35">·</span>
                <span className="text-[#9999FF]">60 fps</span>
              </div>

              {/* Speed pills */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-[6px] bg-[#181a20] border border-white/10 font-mono text-[10px]">
                {([0.5, 1, 1.5] as const).map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeed(rate)}
                    className={`px-1.5 py-0.5 rounded-[4px] transition-colors cursor-pointer ${
                      speed === rate
                        ? 'bg-[#ff5512] text-white'
                        : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {rate}×
                  </button>
                ))}
              </div>

              <span className="px-2 py-0.5 rounded-[5px] bg-[#181a20] border border-white/10 font-mono text-[11px] text-[#60a5fa] tabular-nums">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Core Timeline Stage (Preserves Exact GSAP FLIP Geometry) */}
          <div
            ref={timelineBoxRef}
            className="relative w-full aspect-[1372/620] md:aspect-[1372/440]"
          >
            {/* Transport Play / Pause + Reset */}
            <div className="absolute z-[3] left-[1.6%] top-[3.5%] flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play timeline preview' : 'Pause timeline preview'}
                className="flex items-center justify-center bg-[#2a2f39] hover:bg-[#363c48] text-white transition-colors cursor-pointer w-[24px] h-[24px] rounded-[6px] md:w-[calc(38*var(--u))] md:h-[calc(34*var(--u))] md:rounded-[calc(9*var(--u))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {paused ? (
                  <Play className="w-3 h-3 md:w-[calc(14*var(--u))] md:h-[calc(14*var(--u))]" />
                ) : (
                  <Pause className="w-3 h-3 md:w-[calc(14*var(--u))] md:h-[calc(14*var(--u))]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => seekToTime(0)}
                aria-label="Reset playhead to start"
                title="Jump to 00:00"
                className="hidden sm:flex items-center justify-center bg-[#1e222a] hover:bg-[#2a2f39] text-white/75 hover:text-white transition-colors cursor-pointer w-[24px] h-[24px] rounded-[6px] md:w-[calc(32*var(--u))] md:h-[calc(34*var(--u))] md:rounded-[calc(9*var(--u))]"
              >
                <RotateCcw className="w-3 h-3 md:w-[calc(12*var(--u))] md:h-[calc(12*var(--u))]" />
              </button>
            </div>

            {/* Interactive Scrubbing Time Ruler */}
            <div
              ref={trackAreaRef}
              onPointerDown={(e) => {
                setIsScrubbing(true);
                scrubAtClientX(e.clientX);
              }}
              onPointerMove={(e) => {
                if (isScrubbing) scrubAtClientX(e.clientX);
              }}
              onPointerUp={() => setIsScrubbing(false)}
              onPointerLeave={() => setIsScrubbing(false)}
              title="Click or drag along timeline ruler to scrub playhead"
              className="absolute left-[13.5%] right-[2.4%] top-[3.5%] h-[18px] md:top-[4.4%] md:h-[calc(28*var(--u))] flex items-center justify-between select-none cursor-ew-resize z-[3]"
            >
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

            {/* Track V1 Header Controls (Left Column) */}
            <div className="absolute left-[1.6%] w-[10.8%] top-[16%] h-[33%] rounded-[6px] md:rounded-[calc(10*var(--u))] bg-white/[0.04] border border-white/6 px-1.5 sm:px-2 flex flex-col justify-center gap-1 z-[3]">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono font-semibold text-[8px] sm:text-[10px] md:text-[calc(12*var(--u))] text-[#93c5fd]">
                  V1
                </span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    type="button"
                    onClick={() => setTrackVisible((p) => ({ ...p, V1: !p.V1 }))}
                    aria-label={trackVisible.V1 ? 'Hide V1 track' : 'Show V1 track'}
                    aria-pressed={trackVisible.V1}
                    className="p-0.5 rounded text-white/70 hover:text-white cursor-pointer"
                  >
                    {trackVisible.V1 ? (
                      <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : (
                      <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/30" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoloTrack((p) => (p === 'V1' ? null : 'V1'))}
                    aria-label="Solo V1 track"
                    aria-pressed={soloTrack === 'V1'}
                    className={`px-1 rounded text-[7px] sm:text-[9px] font-mono font-bold cursor-pointer ${
                      soloTrack === 'V1'
                        ? 'bg-[#ff5512] text-white'
                        : 'bg-white/10 text-white/55 hover:text-white'
                    }`}
                  >
                    S
                  </button>
                </div>
              </div>
              <span className="hidden md:block text-[calc(10*var(--u))] font-mono text-white/40 truncate">
                Ad Hooks
              </span>
            </div>

            {/* Track V2 Header Controls (Left Column) */}
            <div className="absolute left-[1.6%] w-[10.8%] top-[56%] h-[33%] rounded-[6px] md:rounded-[calc(10*var(--u))] bg-white/[0.04] border border-white/6 px-1.5 sm:px-2 flex flex-col justify-center gap-1 z-[3]">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono font-semibold text-[8px] sm:text-[10px] md:text-[calc(12*var(--u))] text-[#c4b5fd]">
                  V2
                </span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    type="button"
                    onClick={() => setTrackVisible((p) => ({ ...p, V2: !p.V2 }))}
                    aria-label={trackVisible.V2 ? 'Hide V2 track' : 'Show V2 track'}
                    aria-pressed={trackVisible.V2}
                    className="p-0.5 rounded text-white/70 hover:text-white cursor-pointer"
                  >
                    {trackVisible.V2 ? (
                      <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : (
                      <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/30" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoloTrack((p) => (p === 'V2' ? null : 'V2'))}
                    aria-label="Solo V2 track"
                    aria-pressed={soloTrack === 'V2'}
                    className={`px-1 rounded text-[7px] sm:text-[9px] font-mono font-bold cursor-pointer ${
                      soloTrack === 'V2'
                        ? 'bg-[#ff5512] text-white'
                        : 'bg-white/10 text-white/55 hover:text-white'
                    }`}
                  >
                    S
                  </button>
                </div>
              </div>
              <span className="hidden md:block text-[calc(10*var(--u))] font-mono text-white/40 truncate">
                CTA Cut
              </span>
            </div>

            {/* V1 & V2 Horizontal Track Lanes (Clickable to Scrub Playhead) */}
            <div
              onPointerDown={(e) => {
                setIsScrubbing(true);
                scrubAtClientX(e.clientX);
              }}
              onPointerMove={(e) => {
                if (isScrubbing) scrubAtClientX(e.clientX);
              }}
              onPointerUp={() => setIsScrubbing(false)}
              className="absolute left-[13.5%] right-[2.4%] top-[16%] h-[33%] rounded-[7px] md:rounded-[calc(14*var(--u))] bg-white/[0.05] cursor-ew-resize"
            >
              {showGridOverlay && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid grid-cols-6 border border-white/10 rounded-[inherit]"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="border-r border-white/10 last:border-r-0" />
                  ))}
                </div>
              )}
              {showKeyframes &&
                [0.4, 2.6, 5.1].map((kf, idx) => (
                  <button
                    key={kf}
                    type="button"
                    aria-label={`Jump playhead to V1 keyframe ${kf}s`}
                    onClick={(e) => {
                      e.stopPropagation();
                      seekToTime(kf);
                    }}
                    style={{ left: `${(kf / 6) * 100}%` }}
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 md:w-2.5 md:h-2.5 rotate-45 cursor-pointer transition-transform hover:scale-125 ${
                      idx === 1 ? 'bg-[#ff5512]' : 'bg-[#60a5fa]'
                    }`}
                  />
                ))}
            </div>

            <div
              onPointerDown={(e) => {
                setIsScrubbing(true);
                scrubAtClientX(e.clientX);
              }}
              onPointerMove={(e) => {
                if (isScrubbing) scrubAtClientX(e.clientX);
              }}
              onPointerUp={() => setIsScrubbing(false)}
              className="absolute left-[13.5%] right-[2.4%] top-[56%] h-[33%] rounded-[7px] md:rounded-[calc(14*var(--u))] bg-white/[0.05] cursor-ew-resize"
            >
              {showGridOverlay && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid grid-cols-6 border border-white/10 rounded-[inherit]"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="border-r border-white/10 last:border-r-0" />
                  ))}
                </div>
              )}
              {showKeyframes &&
                [1.5, 3.9].map((kf) => (
                  <button
                    key={kf}
                    type="button"
                    aria-label={`Jump playhead to V2 keyframe ${kf}s`}
                    onClick={(e) => {
                      e.stopPropagation();
                      seekToTime(kf);
                    }}
                    style={{ left: `${(kf / 6) * 100}%` }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 md:w-2.5 md:h-2.5 rotate-45 bg-[#a78bfa] cursor-pointer transition-transform hover:scale-125"
                  />
                ))}
            </div>

            {/* Five Squircle Keyframe Clips */}
            {CLIPS.map((clip, i) => {
              const dimmed = isTrackDimmed(clip.track);
              const isSelected = selectedClipId === clip.id;
              return (
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
                    onClick={() => {
                      setSelectedClipId(clip.id);
                      seekToTime(clip.timeSecMark);
                    }}
                    className="relative z-[1] w-full h-full will-change-transform cursor-pointer"
                  >
                    <div
                      ref={i === 0 ? firstClipInnerRef : undefined}
                      title={`${clip.label} — click to inspect keyframes`}
                      className={`timeline-tile-glow relative w-full h-full overflow-hidden transition-[opacity,filter] duration-200 ${
                        dimmed ? 'opacity-20 grayscale' : 'opacity-100'
                      } ${motionBlurPreview ? 'blur-[0.6px] contrast-110' : ''} ${
                        isSelected && !clipsInSentence
                          ? 'ring-2 ring-[#3b82f6] ring-offset-2 ring-offset-[#12151b]'
                          : ''
                      }`}
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
              );
            })}

            {/* Sweeping Orange Ae Playhead */}
            <div
              style={{ left: playheadLeftPct }}
              className="pointer-events-none absolute top-[11%] bottom-[4%] z-[2] w-[1.5px] md:w-[calc(2*var(--u))] bg-[#ff5512]"
            >
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[2px] whitespace-nowrap rounded-[4px] md:rounded-[calc(6*var(--u))] bg-[#ff5512] text-white font-semibold tabular-nums text-[7.5px] px-[4px] py-[2px] md:text-[calc(11*var(--u))] md:px-[calc(7*var(--u))] md:py-[calc(4*var(--u))] leading-none">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* After Effects Bottom Layer Inspector & Keyframe Dock */}
          <div className="rounded-b-[16px] md:rounded-b-[calc(44*var(--u))] bg-[#191c24] border-t border-white/10 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-[11px] text-white">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/45 mr-1">
                Active Layer:
              </span>
              {CLIPS.map((clip) => {
                const selected = selectedClipId === clip.id;
                return (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => {
                      setSelectedClipId(clip.id);
                      seekToTime(clip.timeSecMark);
                    }}
                    className={`px-2 py-1 rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selected
                        ? 'bg-[#3b82f6] text-white'
                        : 'bg-white/[0.06] text-white/65 hover:text-white'
                    }`}
                  >
                    {clip.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 ml-auto font-mono text-[10.5px]">
              <span className="hidden lg:inline text-white/50">
                {activeClip.layerCode} · Track {activeClip.track} · Keyframe{' '}
                {KEYFRAME_MARKS[activeClip.id]}s
              </span>
              <button
                type="button"
                onClick={() => flyToFnRef.current?.(!inSentenceRef.current)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] transition-colors cursor-pointer whitespace-nowrap ${
                  clipsInSentence
                    ? 'bg-white text-[#12151b] font-semibold'
                    : 'bg-[#ff5512] hover:bg-[#ff6d28] text-white font-medium'
                }`}
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                {clipsInSentence ? 'Dock to Timeline' : 'Preview Keyframe Flight'}
              </button>
            </div>
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
          turns ad spend{' '}
          <span
            ref={(el) => {
              slotRefs.current[1] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          into
          <br className="hidden md:inline" /> thumb-stopping{' '}
          <span
            ref={(el) => {
              slotRefs.current[2] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          creatives, funnels{' '}
          <span
            ref={(el) => {
              slotRefs.current[3] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          &amp;
          <br className="hidden md:inline" /> scale{' '}
          <span
            ref={(el) => {
              slotRefs.current[4] = el;
            }}
            aria-hidden="true"
            className="inline-block align-baseline w-[1.15em] h-[1.15em] mx-[0.2em] mt-[-0.05em] mb-[-0.2em] md:w-[1em] md:h-[1em] md:mt-[0.1em] md:mb-[-0.15em]"
          />{' '}
          built to convert.
        </h2>
      </div>
    </section>
  );
}
