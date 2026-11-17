import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  ready3D: boolean;
  skip3DWait?: boolean;
  onStartExit: () => void;
}

export function Loader({ ready3D, skip3DWait = false, onStartExit }: LoaderProps) {
  const [removed, setRemoved] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const hasExitedRef = useRef(false);
  const minTimePassedRef = useRef(false);
  const ready3DRef = useRef(ready3D || skip3DWait);

  ready3DRef.current = ready3D || skip3DWait;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setRemoved(true);
      onStartExit();
      return;
    }

    const overlay = overlayRef.current;
    const logoWrap = logoWrapRef.current;
    const text = textRef.current;
    if (!overlay || !text) return;

    if (logoWrap) {
      gsap.set(logoWrap, { clipPath: 'inset(0 100% 0 0)', y: 10, opacity: 0 });
      gsap.to(logoWrap, {
        clipPath: 'inset(0 0% 0 0)',
        y: 0,
        opacity: 1,
        duration: 0.75,
        delay: 0.08,
        ease: 'expo.out',
      });
    }

    gsap.set(text, { yPercent: 110 });
    gsap.to(text, {
      yPercent: 0,
      duration: 0.7,
      delay: 0.22,
      ease: 'expo.out',
    });

    const triggerExit = () => {
      if (hasExitedRef.current) return;
      hasExitedRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          setRemoved(true);
        },
      });

      if (logoWrap) {
        tl.to(
          logoWrap,
          {
            y: -18,
            opacity: 0,
            duration: 0.45,
            ease: 'expo.in',
          },
          0
        );
      }

      tl.to(
        text,
        {
          yPercent: -110,
          duration: 0.55,
          ease: 'expo.in',
        },
        0.05
      ).to(
        overlay,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'expo.inOut',
          onStart: () => {
            onStartExit();
          },
        },
        '-=0.15'
      );
    };

    const minTimer = window.setTimeout(() => {
      minTimePassedRef.current = true;
      if (ready3DRef.current) {
        triggerExit();
      }
    }, 1400);

    const failsafeTimer = window.setTimeout(() => {
      triggerExit();
    }, 6000);

    const pollReady = window.setInterval(() => {
      if (minTimePassedRef.current && ready3DRef.current) {
        window.clearInterval(pollReady);
        triggerExit();
      }
    }, 60);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(failsafeTimer);
      window.clearInterval(pollReady);
    };
  }, [onStartExit]);

  if (removed) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#f4f7fb] px-6"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <div ref={logoWrapRef} className="overflow-hidden">
        <img
          src="/assets/aistudio/Asset_1_964a5860.png"
          alt="X.MAX"
          className="h-[26px] md:h-[32px] lg:h-[calc(38*var(--u))] w-auto object-contain select-none"
        />
      </div>
      <p className="overflow-hidden font-medium tracking-[-0.01em] text-[#111418]/75 text-[18px] md:text-[22px] lg:text-[calc(26*var(--u))]">
        <span ref={textRef} className="inline-block">
          Ideas into impact.
        </span>
      </p>
    </div>
  );
}
