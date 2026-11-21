import { useEffect, useRef, useState } from 'react';
import {
  Download,
  Expand,
  Eye,
  EyeOff,
  Film,
  Grid,
  Hand,
  Minimize2,
  MousePointer2,
  Move,
  Pause,
  PenTool,
  Play,
  Plus,
  RotateCcw,
  Sliders,
  Type,
  Video,
  Volume2,
  VolumeX,
  ZoomIn,
} from 'lucide-react';
import { PageRoute } from '../types/routing';

const VFX_COFFEE_VIDEO = '/assets/aistudio/2a406482778e6b6eee9015718212361e_07f5a26c.mp4';
const ECOM_3D_VIDEO = '/assets/aistudio/6a80739483a43aca17379c229422e141_720w_01ea1399.mp4';

interface AfterEffectsStudioProps {
  onNavigate: (route: PageRoute) => void;
}

type AeCompPreset = 'vfx-coffee' | 'ecom-3d';
type AeAspectRatio = '16:9' | '9:16' | '1:1';
type AeAnimStyle = 'kinetic' | 'slide' | 'pulse' | 'cinematic';
type AeLutGrade = 'raw' | 'anamorphic' | 'vibrant' | 'warm' | 'noir';
type AeToolId = 'select' | 'hand' | 'zoom' | 'type' | 'anchor' | 'pen';

interface CompPresetConfig {
  id: AeCompPreset;
  name: string;
  docTitle: string;
  videoUrl: string;
  headline: string;
  subline: string;
  offerBadge: string;
  ctaLabel: string;
  brandHandle: string;
  accent: string;
  aspect: AeAspectRatio;
  lut: AeLutGrade;
  animStyle: AeAnimStyle;
  sceneLabels: [string, string, string];
}

const COMP_PRESETS: Record<AeCompPreset, CompPresetConfig> = {
  'vfx-coffee': {
    id: 'vfx-coffee',
    name: 'AR Coffee VFX Reel',
    docTitle: 'AR_Workspace_Coffee_VFX.aep',
    videoUrl: VFX_COFFEE_VIDEO,
    headline: 'MIXED REALITY REEL',
    subline: '3D TRACKING · MOTION UI · CREATIVE HOOK',
    offerBadge: 'VIRAL VFX HOOK · 9:16 REEL',
    ctaLabel: 'START A REEL CAMPAIGN',
    brandHandle: '@XMAX.MOTION',
    accent: '#9999FF',
    aspect: '9:16',
    lut: 'raw',
    animStyle: 'kinetic',
    sceneLabels: ['01 · App Dock Tap', '02 · AR Product Swap', '03 · Real-World Reveal'],
  },
  'ecom-3d': {
    id: 'ecom-3d',
    name: '3D E-Com Product Ad',
    docTitle: 'iAnanas_3D_Commerce_Ad.aep',
    videoUrl: ECOM_3D_VIDEO,
    headline: '3D STOREFRONT AD',
    subline: 'FLOATING CATALOG · D2C CONVERSION',
    offerBadge: 'WELCOME5 · 5% OFF CODE',
    ctaLabel: 'SHOP FULL CATALOG',
    brandHandle: '@IANANAS.STORE',
    accent: '#ff5512',
    aspect: '9:16',
    lut: 'raw',
    animStyle: 'slide',
    sceneLabels: ['01 · Phone Reveal', '02 · 3D Product Orbit', '03 · Promo Code Endcard'],
  },
};

const LUT_STYLES: Record<AeLutGrade, { label: string; cssFilter: string }> = {
  raw: {
    label: 'Original Cut',
    cssFilter: '',
  },
  anamorphic: {
    label: 'Anamorphic',
    cssFilter: 'contrast(114%) saturate(112%)',
  },
  vibrant: {
    label: 'Social Ad Pop',
    cssFilter: 'contrast(118%) saturate(126%)',
  },
  warm: {
    label: 'Warm Grade',
    cssFilter: 'sepia(12%) contrast(108%) saturate(114%)',
  },
  noir: {
    label: 'Cinema Noir',
    cssFilter: 'grayscale(100%) contrast(130%)',
  },
};

function formatTimecode(seconds: number): string {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  const frames = Math.floor((safe % 1) * 30);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames
    .toString()
    .padStart(2, '0')}`;
}

export function AfterEffectsStudio({ onNavigate }: AfterEffectsStudioProps) {
  const [compPreset, setCompPreset] = useState<AeCompPreset>('vfx-coffee');
  const [aspectRatio, setAspectRatio] = useState<AeAspectRatio>('9:16');
  const [viewMode, setViewMode] = useState<'composition' | 'graph'>('composition');
  const [inspectorTab, setInspectorTab] = useState<'motion' | 'adcopy' | 'export'>('motion');
  const [activeTool, setActiveTool] = useState<AeToolId>('select');
  const [expandedCanvas, setExpandedCanvas] = useState(false);

  // Playback & Timecode synced with HTML5 <video>
  const [playing, setPlaying] = useState(true);
  const [aeTime, setAeTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(12);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5 | 2>(1);
  const [muted, setMuted] = useState(true);
  const [safeGuides, setSafeGuides] = useState(false);
  const [motionBlur, setMotionBlur] = useState(true);

  // Optional Overlays (off by default so baked-in video typography stays 100% clear)
  const [headline, setHeadline] = useState(COMP_PRESETS['vfx-coffee'].headline);
  const [subline, setSubline] = useState(COMP_PRESETS['vfx-coffee'].subline);
  const [offerBadge, setOfferBadge] = useState(COMP_PRESETS['vfx-coffee'].offerBadge);
  const [ctaLabel, setCtaLabel] = useState(COMP_PRESETS['vfx-coffee'].ctaLabel);
  const [brandHandle, setBrandHandle] = useState(COMP_PRESETS['vfx-coffee'].brandHandle);
  const [accentColor, setAccentColor] = useState(COMP_PRESETS['vfx-coffee'].accent);

  // Color & Motion Sliders
  const [titleScale, setTitleScale] = useState(100);
  const [titleOffsetY, setTitleOffsetY] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(35);
  const [animStyle, setAnimStyle] = useState<AeAnimStyle>('kinetic');
  const [lutGrade, setLutGrade] = useState<AeLutGrade>('raw');
  const [bgBrightness, setBgBrightness] = useState(100);
  const [bgSaturation, setBgSaturation] = useState(100);

  // Layer Visibility
  const [layers, setLayers] = useState({
    ctaBar: false,
    kineticText: false,
    offerTag: false,
    audioVisualizer: false,
    cameraZoom: false,
    vignette: false,
  });

  // Editable Timeline Keyframes (stored as normalized seconds based on duration)
  const [customKeyframes, setCustomKeyframes] = useState<Record<string, number[]>>({
    cameraZoom: [0.5, 4.2, 8.6],
    lutGrade: [0.0, 5.5, 10.2],
    kineticText: [1.5, 6.0],
    audioVisualizer: [0.8, 3.8, 7.4],
  });

  // Render Queue State
  const [exportFormat, setExportFormat] = useState<'reels-mp4' | 'prores-4k' | 'meta-square'>('reels-mp4');
  const [renderProgress, setRenderProgress] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentConfig = COMP_PRESETS[compPreset];

  const showFeedback = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2800);
  };

  // Switch video composition preset cleanly
  const applyPreset = (id: AeCompPreset) => {
    const cfg = COMP_PRESETS[id];
    setCompPreset(id);
    setAspectRatio(cfg.aspect);
    setHeadline(cfg.headline);
    setSubline(cfg.subline);
    setOfferBadge(cfg.offerBadge);
    setCtaLabel(cfg.ctaLabel);
    setBrandHandle(cfg.brandHandle);
    setAccentColor(cfg.accent);
    setAnimStyle(cfg.animStyle);
    setLutGrade(cfg.lut);
    setBgBrightness(100);
    setBgSaturation(100);
    setAeTime(0);
    setPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    showFeedback(`Loaded ${cfg.name}`);
  };

  // Sync HTML5 video play/pause, rate, and mute state
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.playbackRate = speed;
    vid.muted = muted;
    if (playing) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [playing, speed, muted, compPreset]);

  const seekVideoTo = (seconds: number) => {
    const clamped = Math.max(0, Math.min(videoDuration || 12, seconds));
    setAeTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const resetPlayhead = () => {
    seekVideoTo(0);
    setPlaying(true);
  };

  const addKeyframeAtPlayhead = (trackKey: string) => {
    const rounded = Number(aeTime.toFixed(1));
    setCustomKeyframes((prev) => {
      const list = prev[trackKey] ?? [];
      if (list.some((t) => Math.abs(t - rounded) < 0.2)) return prev;
      return { ...prev, [trackKey]: [...list, rounded].sort((a, b) => a - b) };
    });
    showFeedback(`Inserted keyframe at ${rounded.toFixed(1)}s`);
  };

  // Simulated Render Queue export
  const triggerRender = () => {
    if (renderProgress !== null) return;
    setRenderProgress(0);
    showFeedback(`Queued ${exportFormat.toUpperCase()} render...`);
    let prog = 0;
    const timer = setInterval(() => {
      prog += 12;
      setRenderProgress(Math.min(100, prog));
      if (prog >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setRenderProgress(null);
          showFeedback(`Exported ${currentConfig.docTitle.replace('.aep', '')}.mp4`);
        }, 500);
      }
    }, 160);
  };

  // Real HTML5 Canvas frame capture directly from the active <video> element
  const exportAdSnapshot = () => {
    const vid = videoRef.current;
    const dims =
      aspectRatio === '9:16'
        ? { w: 1080, h: 1920 }
        : aspectRatio === '1:1'
        ? { w: 1080, h: 1080 }
        : { w: 1920, h: 1080 };

    const canvas = document.createElement('canvas');
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#08090d';
    ctx.fillRect(0, 0, dims.w, dims.h);

    if (vid && vid.videoWidth > 0 && vid.videoHeight > 0) {
      const scale = Math.min(dims.w / vid.videoWidth, dims.h / vid.videoHeight);
      const dw = vid.videoWidth * scale;
      const dh = vid.videoHeight * scale;
      ctx.save();
      const filterStr = [
        `brightness(${bgBrightness}%)`,
        `saturate(${bgSaturation}%)`,
        LUT_STYLES[lutGrade].cssFilter,
      ]
        .filter(Boolean)
        .join(' ');
      ctx.filter = filterStr || 'none';
      ctx.drawImage(vid, (dims.w - dw) / 2, (dims.h - dh) / 2, dw, dh);
      ctx.restore();
    }

    if (layers.kineticText) {
      ctx.textAlign = 'center';
      ctx.font = `900 ${Math.round(dims.w * 0.08)}px "Archivo Black", Impact, sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(headline.toUpperCase(), dims.w / 2, dims.h * 0.54);
      ctx.font = '600 24px monospace';
      ctx.fillStyle = accentColor;
      ctx.fillText(subline.toUpperCase(), dims.w / 2, dims.h * 0.60);
    }

    if (layers.ctaBar && ctaLabel) {
      const btnW = Math.min(dims.w * 0.72, 540);
      const btnH = 84;
      const bx = (dims.w - btnW) / 2;
      const by = dims.h * 0.80;
      ctx.fillStyle = accentColor;
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.font = '800 30px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${ctaLabel.toUpperCase()} →`, dims.w / 2, by + 52);
    }

    const link = document.createElement('a');
    link.download = `${currentConfig.id}_Frame_${aspectRatio.replace(':', 'x')}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback(`Saved ${dims.w}×${dims.h} Video Frame PNG!`);
  };

  const safeDur = videoDuration > 0 ? videoDuration : 12;
  const phase = aeTime * 3.2;
  const amp = shakeIntensity / 100;
  const third = safeDur / 3;
  const currentSceneIdx = aeTime < third ? 0 : aeTime < third * 2 ? 1 : 2;

  const computedTextTransform = (() => {
    const scaleFactor = titleScale / 100;
    if (animStyle === 'kinetic') {
      const bounceY = Math.sin(phase) * (8 * amp);
      const pulseScale = 1 + Math.sin(phase * 0.8) * (0.05 * amp);
      return `translateY(${titleOffsetY + bounceY}px) scale(${(scaleFactor * pulseScale).toFixed(3)})`;
    }
    if (animStyle === 'slide') {
      const driftY = Math.cos(phase * 0.6) * (10 * amp);
      return `translateY(${titleOffsetY + driftY}px) scale(${scaleFactor.toFixed(3)})`;
    }
    if (animStyle === 'pulse') {
      const beat = 1 + Math.abs(Math.sin(phase * 1.4)) * (0.08 * amp);
      return `translateY(${titleOffsetY}px) scale(${(scaleFactor * beat).toFixed(3)})`;
    }
    return `translateY(${titleOffsetY}px) scale(${(scaleFactor * (1 + (aeTime / safeDur) * 0.06)).toFixed(3)})`;
  })();

  const computedCameraZoom = layers.cameraZoom
    ? `scale(${(1 + Math.sin(aeTime * 0.9) * 0.025 * (0.4 + amp) + 0.03).toFixed(3)})`
    : 'scale(1)';

  const combinedVideoFilter = [
    `brightness(${bgBrightness}%)`,
    `saturate(${bgSaturation}%)`,
    LUT_STYLES[lutGrade].cssFilter,
  ]
    .filter(Boolean)
    .join(' ');

  const viewportFrameClass =
    aspectRatio === '9:16'
      ? 'w-[230px] sm:w-[270px] aspect-[9/16]'
      : aspectRatio === '1:1'
      ? 'w-[280px] sm:w-[360px] aspect-square'
      : 'w-full max-w-[540px] aspect-[16/9]';

  const resolutionLabel =
    aspectRatio === '9:16' ? '1080 × 1920' : aspectRatio === '1:1' ? '1080 × 1080' : '3840 × 2160';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
      {/* MAIN AFTER EFFECTS WORKSPACE */}
      <div
        className={`${
          expandedCanvas ? 'lg:col-span-12' : 'lg:col-span-8'
        } rounded-[16px] bg-[#1a1b22] border border-white/12 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Responsive AE Top Application Bar */}
        <div className="bg-[#21232d] px-3 sm:px-4 py-2 border-b border-black/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/75">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-[5px] bg-[#00005B] border border-[#9999FF]/50 text-[#9999FF] font-bold text-[11px] flex items-center justify-center shrink-0">
              Ae
            </span>
            {/* Composition Switcher */}
            <div className="flex items-center gap-1 p-0.5 bg-black/35 rounded-[7px] overflow-x-auto no-scrollbar max-w-full">
              {(Object.keys(COMP_PRESETS) as AeCompPreset[]).map((key) => {
                const p = COMP_PRESETS[key];
                const active = compPreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    className={`px-2.5 py-1 rounded-[5px] text-[10.5px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active ? 'bg-[#9999FF] text-[#09091c] font-semibold' : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {notice && <span className="font-mono text-[10.5px] text-[#9999FF] truncate max-w-[180px]">{notice}</span>}
            <button
              type="button"
              onClick={() => setViewMode((v) => (v === 'composition' ? 'graph' : 'composition'))}
              className={`px-2.5 py-1 rounded-[5px] text-[10.5px] font-mono cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'graph' ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {viewMode === 'composition' ? 'Speed Graph' : 'Comp View'}
            </button>
            <button
              type="button"
              onClick={() => setExpandedCanvas((e) => !e)}
              title={expandedCanvas ? 'Restore Inspector' : 'Expand Workspace'}
              className="hidden lg:flex p-1.5 rounded-[5px] bg-white/10 text-white/80 hover:bg-white/20 cursor-pointer"
            >
              {expandedCanvas ? <Minimize2 className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Sub-Toolbar: Aspect Ratio, Safe Guides, Frame Spec */}
        <div className="bg-[#181922] px-3 sm:px-4 py-1.5 border-b border-white/8 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="font-mono text-[10px] text-white/40 hidden sm:inline">Format:</span>
            {(
              [
                { id: '9:16', label: '9:16 Reels Ad' },
                { id: '1:1', label: '1:1 Feed Ad' },
                { id: '16:9', label: '16:9 Wide Ad' },
              ] as const
            ).map((ar) => (
              <button
                key={ar.id}
                type="button"
                onClick={() => setAspectRatio(ar.id)}
                className={`px-2 py-0.5 rounded-[4px] font-mono text-[10px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  aspectRatio === ar.id ? 'bg-[#ff5512] text-white font-semibold' : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-white/55 tabular-nums">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className={`flex items-center gap-1 cursor-pointer ${!muted ? 'text-[#ff5512]' : 'text-white/55 hover:text-white'}`}
            >
              {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{muted ? 'Muted' : 'Audio ON'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSafeGuides((s) => !s)}
              className={`flex items-center gap-1 cursor-pointer ${safeGuides ? 'text-cyan-300' : 'text-white/45 hover:text-white'}`}
            >
              <Grid className="w-3 h-3" />
              <span className="hidden sm:inline">Safe Margins</span>
            </button>
            <button
              type="button"
              onClick={() => setMotionBlur((m) => !m)}
              className={`cursor-pointer hidden sm:inline ${motionBlur ? 'text-[#9999FF]' : 'text-white/45'}`}
            >
              Blur: {motionBlur ? 'ON' : 'OFF'}
            </button>
            <span>{resolutionLabel} · 60fps</span>
          </div>
        </div>

        {/* Center Stage: Left AE Toolbar (Desktop) + Composition Canvas */}
        <div className="flex flex-1 min-h-[380px] sm:min-h-[460px] bg-[#0b0c10] border-b border-black/40 overflow-hidden">
          {/* Left AE Vertical Tool Palette */}
          <div className="hidden sm:flex w-[42px] shrink-0 bg-[#191a21] border-r border-black/50 py-3 flex-col items-center gap-1.5">
            {(
              [
                { id: 'select', label: 'Selection (V)', Icon: MousePointer2 },
                { id: 'hand', label: 'Hand Pan (H)', Icon: Hand },
                { id: 'zoom', label: 'Zoom (Z)', Icon: ZoomIn },
                { id: 'type', label: 'Overlay Type (T)', Icon: Type },
                { id: 'anchor', label: 'Pan Behind (Y)', Icon: Move },
                { id: 'pen', label: 'Mask Pen (G)', Icon: PenTool },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => {
                  setActiveTool(id);
                  if (id === 'type') setInspectorTab('adcopy');
                }}
                className={`w-7 h-7 rounded-[5px] flex items-center justify-center transition-colors cursor-pointer ${
                  activeTool === id ? 'bg-[#9999FF]/25 text-[#9999FF] border border-[#9999FF]/45' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          {/* Composition Viewport Area */}
          <div className="flex-1 p-4 sm:p-6 flex items-center justify-center overflow-hidden relative">
            {viewMode === 'composition' ? (
              <div
                className={`relative bg-[#08090d] rounded-[10px] overflow-hidden shadow-2xl border border-white/15 flex flex-col justify-between transition-all duration-300 ${viewportFrameClass}`}
              >
                {/* Live MP4 Reel Video */}
                <div
                  className="absolute inset-0 transition-transform duration-150"
                  style={{
                    transform: computedCameraZoom,
                    filter: combinedVideoFilter || undefined,
                  }}
                >
                  <video
                    key={currentConfig.videoUrl}
                    ref={videoRef}
                    src={currentConfig.videoUrl}
                    autoPlay
                    muted={muted}
                    loop
                    playsInline
                    onLoadedMetadata={(e) => {
                      const d = e.currentTarget.duration;
                      if (d && Number.isFinite(d)) setVideoDuration(d);
                    }}
                    onTimeUpdate={(e) => {
                      setAeTime(e.currentTarget.currentTime);
                    }}
                    className="w-full h-full object-contain bg-[#08090d]"
                  />
                </div>

                {/* Optional Soft Vignette */}
                {layers.vignette && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(0,0,0,0) 54%, rgba(0,0,0,0.55) 100%)',
                    }}
                  />
                )}

                {/* AE Safe Margin Guides Overlay */}
                {safeGuides && (
                  <div className="absolute inset-3 border border-dashed border-cyan-300/40 pointer-events-none rounded-[4px] z-10">
                    <div className="absolute inset-3 border border-cyan-300/20" />
                    <span className="absolute top-0 left-1 font-mono text-[8px] text-cyan-300/75">TITLE SAFE</span>
                  </div>
                )}

                {/* Top Floating Audio & Scene Indicator */}
                <div className="relative z-10 p-2.5 flex items-center justify-between gap-2 text-white pointer-events-none">
                  <span className="font-mono text-[9px] text-cyan-300 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-[4px] tabular-nums">
                    S0{currentSceneIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? 'Unmute video audio' : 'Mute video audio'}
                    className="pointer-events-auto p-1.5 rounded-[5px] bg-black/60 backdrop-blur-xs text-white/85 hover:text-white cursor-pointer"
                  >
                    {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#ff5512]" />}
                  </button>
                </div>

                {/* Optional Kinetic Typography Overlay (OFF by default) */}
                {(layers.offerTag || layers.kineticText) && (
                  <div className="relative z-10 px-4 text-center my-auto flex flex-col items-center pointer-events-none">
                    {layers.offerTag && offerBadge && (
                      <span
                        className="mb-2 px-2.5 py-0.5 rounded-[4px] font-mono text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-white shadow-sm"
                        style={{ backgroundColor: accentColor }}
                      >
                        {offerBadge}
                      </span>
                    )}

                    {layers.kineticText && (
                      <div
                        className="transition-transform duration-75 bg-black/45 px-3 py-2 rounded-[8px] backdrop-blur-xs"
                        style={{
                          transform: computedTextTransform,
                          filter: motionBlur && playing ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.75))' : 'none',
                        }}
                      >
                        <h4
                          className={`font-archivo uppercase leading-[1.02] tracking-tight text-white [text-wrap:balance] ${
                            aspectRatio === '9:16'
                              ? 'text-[18px] sm:text-[22px]'
                              : aspectRatio === '1:1'
                              ? 'text-[22px] sm:text-[26px]'
                              : 'text-[24px] sm:text-[32px]'
                          }`}
                        >
                          {headline}
                        </h4>
                        <p
                          className="mt-1 font-mono text-[8.5px] sm:text-[10px] font-semibold tracking-widest uppercase"
                          style={{ color: accentColor }}
                        >
                          {subline}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Bottom CTA Endcard + Live Audio Spectrum */}
                {(layers.ctaBar || layers.audioVisualizer) && (
                  <div className="relative z-10 p-3 mt-auto space-y-2">
                    {layers.ctaBar && ctaLabel && (
                      <div
                        className="w-full py-2 px-3 rounded-[7px] text-center font-semibold text-[11px] sm:text-[12px] text-white shadow-lg"
                        style={{ backgroundColor: accentColor }}
                      >
                        {ctaLabel} →
                      </div>
                    )}

                    {layers.audioVisualizer && (
                      <div className="flex items-end justify-between gap-0.5 h-4 pointer-events-none opacity-85">
                        {Array.from({ length: 28 }).map((_, idx) => {
                          const barH = playing
                            ? Math.max(18, Math.round(Math.abs(Math.sin(aeTime * 4.5 + idx * 0.4)) * 100))
                            : 22 + ((idx * 17) % 45);
                          return (
                            <span
                              key={idx}
                              style={{ height: `${barH}%`, backgroundColor: idx % 2 === 0 ? accentColor : '#9999FF' }}
                              className="flex-1 rounded-t-[1px]"
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Speed Graph Editor Bezier Curve View */
              <div className="w-full max-w-[540px] aspect-[16/9] bg-[#0c0d12] rounded-[10px] p-4 sm:p-5 flex flex-col justify-between border border-cyan-400/30 font-mono text-[11px]">
                <div className="flex items-center justify-between text-white/75">
                  <span className="text-cyan-400 font-semibold">Cubic Bezier Velocity Curve</span>
                  <span className="tabular-nums">Motion Intensity: {shakeIntensity}%</span>
                </div>
                <svg className="w-full h-36" viewBox="0 0 500 120" fill="none">
                  <path
                    d={`M 0 105 C ${Math.round(80 + shakeIntensity)} 105, ${Math.round(240 - shakeIntensity * 0.6)} 15, 500 15`}
                    stroke="#9999FF"
                    strokeWidth="3"
                  />
                  <circle cx={Math.round(240 - shakeIntensity * 0.6)} cy="15" r="5" fill={accentColor} />
                  <circle cx="0" cy="105" r="5" fill={accentColor} />
                  <line
                    x1="0"
                    y1="105"
                    x2={Math.round(240 - shakeIntensity * 0.6)}
                    y2="15"
                    stroke={accentColor}
                    strokeDasharray="4 4"
                  />
                </svg>
                <div className="flex items-center justify-between text-[10px] text-white/50 tabular-nums">
                  <span>00:00 (Ease-In)</span>
                  <span className="text-[#9999FF]">Peak Velocity: {Math.round(1600 + shakeIntensity * 14)} px/s</span>
                  <span>{formatTimecode(safeDur)} (Hold)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Multi-Track Timeline & Ad Scene Sequencer */}
        <div className="bg-[#15161c] p-3 text-[11px] font-mono text-white/75 space-y-2.5">
          {/* Transport + Scrubber Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause Timeline' : 'Play Timeline'}
                className="w-7 h-7 rounded-[6px] bg-[#222530] text-white flex items-center justify-center hover:bg-[#2e3242] cursor-pointer"
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={resetPlayhead}
                aria-label="Reset Playhead"
                className="w-7 h-7 rounded-[6px] bg-[#222530] text-white flex items-center justify-center hover:bg-[#2e3242] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <span className="text-[#9999FF] font-semibold text-[11.5px] tabular-nums">
                {formatTimecode(aeTime)} / {formatTimecode(safeDur)}
              </span>
            </div>

            {/* Scene Quick-Jump Cuts */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
              {currentConfig.sceneLabels.map((label, idx) => {
                const startT = idx * third + 0.1;
                const active = currentSceneIdx === idx;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => seekVideoTo(startT)}
                    className={`px-2 py-0.5 rounded-[4px] text-[10px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      active ? 'bg-white/15 text-white font-semibold' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-1">
              {([0.5, 1, 1.5, 2] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer tabular-nums ${
                    speed === s ? 'bg-[#ff5512] text-white font-bold' : 'bg-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Track Lanes */}
          <div className="space-y-1.5">
            {[
              { key: 'cameraZoom', name: 'V1 · Footage & Cam Zoom', color: '#00f0ff', active: true },
              { key: 'vignette', name: 'FX1 · Soft Edge Vignette', color: '#9999FF', active: layers.vignette },
              { key: 'ctaBar', name: 'V2 · Offer & CTA Endcard', color: '#ff5512', active: layers.ctaBar },
              { key: 'audioVisualizer', name: 'A1 · Bass Spectrum Beat', color: '#10b981', active: layers.audioVisualizer },
            ].map((track) => {
              const kfs = customKeyframes[track.key] ?? [];
              return (
                <div key={track.key} className="flex items-center gap-2 h-6">
                  <button
                    type="button"
                    aria-label={`Toggle ${track.name}`}
                    onClick={() => {
                      if (track.key === 'cameraZoom') {
                        setLayers((prev) => ({ ...prev, cameraZoom: !prev.cameraZoom }));
                      } else {
                        setLayers((prev) => ({
                          ...prev,
                          [track.key]: !prev[track.key as keyof typeof prev],
                        }));
                      }
                    }}
                    className={`p-1 rounded hover:bg-white/10 cursor-pointer shrink-0 ${
                      track.key === 'cameraZoom'
                        ? layers.cameraZoom
                          ? 'text-white/80'
                          : 'text-white/25'
                        : track.active
                        ? 'text-white/80'
                        : 'text-white/25'
                    }`}
                  >
                    {(track.key === 'cameraZoom' ? layers.cameraZoom : track.active) ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </button>
                  <span className="w-24 sm:w-36 shrink-0 truncate text-[10px] text-white/80">{track.name}</span>
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      seekVideoTo(ratio * safeDur);
                    }}
                    className="flex-1 relative h-4 bg-white/[0.06] rounded-[3px] overflow-hidden cursor-ew-resize"
                  >
                    {kfs.map((kfTime) => (
                      <button
                        key={kfTime}
                        type="button"
                        title={`Jump to keyframe ${kfTime}s`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          seekVideoTo(kfTime);
                        }}
                        style={{
                          left: `${Math.min(98, (kfTime / safeDur) * 100)}%`,
                          backgroundColor: track.color,
                        }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rotate-45 cursor-pointer hover:scale-125 transition-transform"
                      />
                    ))}
                    <span
                      style={{ left: `${Math.min(100, (aeTime / safeDur) * 100)}%` }}
                      className="absolute inset-y-0 w-0.5 bg-[#ff5512]"
                    />
                  </div>
                  <button
                    type="button"
                    title="Add keyframe at playhead"
                    onClick={() => addKeyframeAtPlayhead(track.key)}
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white cursor-pointer shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT INSPECTOR PANEL */}
      {!expandedCanvas && (
        <div className="lg:col-span-4 rounded-[16px] bg-white/[0.04] border border-white/10 p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div>
                <span className="text-[13px] font-semibold text-white block">Ad Effect Controls</span>
                <span className="font-mono text-[10.5px] text-[#9999FF] truncate block max-w-[200px]">
                  {currentConfig.docTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={exportAdSnapshot}
                className="px-2.5 py-1.5 rounded-[7px] bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3 h-3" />
                Save Frame
              </button>
            </div>

            {/* Sub-Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/35 rounded-[9px] text-[11px]">
              {(
                [
                  { id: 'motion', label: 'Motion & LUT', Icon: Sliders },
                  { id: 'adcopy', label: 'Overlays', Icon: Type },
                  { id: 'export', label: 'Render Queue', Icon: Film },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setInspectorTab(id)}
                  className={`py-1.5 px-2 rounded-[6px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    inspectorTab === id ? 'bg-[#9999FF] text-[#09091c] font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: COLOR GRADING, LUTS & MOTION CURVES */}
            {inspectorTab === 'motion' && (
              <div className="space-y-3.5">
                {/* Lumetri Color LUT Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1.5">Lumetri Color LUT</label>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {(Object.keys(LUT_STYLES) as AeLutGrade[]).map((lutKey) => (
                      <button
                        key={lutKey}
                        type="button"
                        onClick={() => setLutGrade(lutKey)}
                        className={`py-1.5 px-2 rounded-[6px] transition-colors cursor-pointer ${
                          lutGrade === lutKey ? 'bg-white text-black font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {LUT_STYLES[lutKey].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transform & Color Grading Sliders */}
                <div className="space-y-2.5 font-mono text-[10.5px]">
                  <div>
                    <div className="flex justify-between text-white/70 mb-1 tabular-nums">
                      <span>Footage Exposure</span>
                      <span>{bgBrightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={65}
                      max={130}
                      value={bgBrightness}
                      onChange={(e) => setBgBrightness(Number(e.target.value))}
                      className="w-full accent-[#ff5512] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-white/70 mb-1 tabular-nums">
                      <span>Color Saturation</span>
                      <span>{bgSaturation}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={bgSaturation}
                      onChange={(e) => setBgSaturation(Number(e.target.value))}
                      className="w-full accent-[#9999FF] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-white/70 mb-1 tabular-nums">
                      <span>Camera Motion Intensity</span>
                      <span>{shakeIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={shakeIntensity}
                      onChange={(e) => setShakeIntensity(Number(e.target.value))}
                      className="w-full accent-[#9999FF] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Keyframe Engine */}
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1.5">Keyframe Motion Curve</label>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {(
                      [
                        { id: 'kinetic', label: 'Kinetic Bounce' },
                        { id: 'slide', label: 'Smooth Drift' },
                        { id: 'pulse', label: 'Beat Pulse' },
                        { id: 'cinematic', label: 'Slow Zoom' },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setAnimStyle(st.id)}
                        className={`py-1.5 px-2 rounded-[6px] transition-colors cursor-pointer ${
                          animStyle === st.id ? 'bg-[#9999FF] text-[#09091c] font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OPTIONAL END-CARD & CTA OVERLAYS */}
            {inspectorTab === 'adcopy' && (
              <div className="space-y-3">
                <p className="text-[11px] font-mono text-white/55 leading-relaxed">
                  Optional overlay layers are off by default so the video&apos;s own visuals remain clear.
                </p>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {(
                    [
                      { key: 'kineticText', label: 'Headline Layer' },
                      { key: 'offerTag', label: 'Offer Sticker' },
                      { key: 'ctaBar', label: 'CTA Endcard' },
                      { key: 'audioVisualizer', label: 'Audio Spectrum' },
                    ] as const
                  ).map((item) => {
                    const active = layers[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setLayers((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`px-2.5 py-1.5 rounded-[6px] border flex items-center justify-between cursor-pointer ${
                          active ? 'bg-[#9999FF]/20 border-[#9999FF]/50 text-white' : 'bg-transparent border-white/10 text-white/50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="font-mono text-[9.5px]">{active ? 'ON' : 'OFF'}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label htmlFor="ae-headline" className="block text-[11px] font-mono text-white/50 mb-1">
                    Overlay Headline
                  </label>
                  <input
                    id="ae-headline"
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setHeadline(e.target.value.toUpperCase());
                      setLayers((prev) => ({ ...prev, kineticText: true }));
                    }}
                    className="w-full px-3 py-2 rounded-[8px] bg-[#0c0e12] border border-white/15 text-[12.5px] text-white font-mono focus:border-[#9999FF] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="ae-offer" className="block text-[11px] font-mono text-white/50 mb-1">
                      Offer Sticker
                    </label>
                    <input
                      id="ae-offer"
                      type="text"
                      value={offerBadge}
                      onChange={(e) => {
                        setOfferBadge(e.target.value.toUpperCase());
                        setLayers((prev) => ({ ...prev, offerTag: true }));
                      }}
                      className="w-full px-2.5 py-1.5 rounded-[7px] bg-[#0c0e12] border border-white/15 text-[11px] text-white font-mono focus:border-[#9999FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="ae-cta" className="block text-[11px] font-mono text-white/50 mb-1">
                      Ad CTA Button
                    </label>
                    <input
                      id="ae-cta"
                      type="text"
                      value={ctaLabel}
                      onChange={(e) => {
                        setCtaLabel(e.target.value.toUpperCase());
                        setLayers((prev) => ({ ...prev, ctaBar: true }));
                      }}
                      className="w-full px-2.5 py-1.5 rounded-[7px] bg-[#0c0e12] border border-white/15 text-[11px] text-white font-mono focus:border-[#9999FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[10.5px] text-white/70 mb-1 tabular-nums">
                    <span>Overlay Offset Y</span>
                    <span>{titleOffsetY > 0 ? `+${titleOffsetY}` : titleOffsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    value={titleOffsetY}
                    onChange={(e) => setTitleOffsetY(Number(e.target.value))}
                    className="w-full accent-[#9999FF] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1.5">Ad Accent Color</label>
                  <div className="flex items-center gap-2">
                    {['#ff5512', '#9999FF', '#10b981', '#f59e0b', '#00f0ff', '#f43f5e'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setAccentColor(c)}
                        className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                          accentColor === c ? 'scale-115 border-white ring-2 ring-white/30' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXPORT PRESETS & LAYER STACK SUMMARY */}
            {inspectorTab === 'export' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1.5">Delivery Format Preset</label>
                  <div className="space-y-1.5 text-[11.5px]">
                    {(
                      [
                        { id: 'reels-mp4', title: 'Instagram / Meta Reels H.264', spec: '1080×1920 · 60fps · 24 Mbps' },
                        { id: 'meta-square', title: 'Meta Feed Square H.264', spec: '1080×1080 · 60fps · High Tier' },
                        { id: 'prores-4k', title: 'Broadcast Apple ProRes 422 HQ', spec: '3840×2160 · 10-bit Rec.709' },
                      ] as const
                    ).map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id)}
                        className={`w-full text-left px-3 py-2 rounded-[8px] border transition-colors cursor-pointer ${
                          exportFormat === fmt.id
                            ? 'bg-[#9999FF]/15 border-[#9999FF]/45 text-white'
                            : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="font-semibold text-[12px]">{fmt.title}</div>
                        <div className="font-mono text-[10px] opacity-65 tabular-nums">{fmt.spec}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Video FX Switches */}
                <div className="pt-1 space-y-1.5">
                  <span className="block text-[11px] font-mono text-white/50">Composition FX</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {(
                      [
                        { key: 'cameraZoom', label: '3D Cam Push' },
                        { key: 'vignette', label: 'Soft Vignette' },
                        { key: 'ctaBar', label: 'CTA Endcard' },
                        { key: 'audioVisualizer', label: 'Beat Bars' },
                      ] as const
                    ).map((item) => {
                      const active = layers[item.key];
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setLayers((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className={`px-2.5 py-1.5 rounded-[6px] border flex items-center justify-between cursor-pointer ${
                            active ? 'bg-white/10 border-white/25 text-white' : 'bg-transparent border-white/10 text-white/40'
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="font-mono text-[9.5px]">{active ? 'ON' : 'OFF'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Render Queue Progress Feedback */}
            {renderProgress !== null && (
              <div className="p-3 rounded-[10px] bg-[#9999FF]/10 border border-[#9999FF]/30 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-white tabular-nums">
                  <span>Encoding Frame {Math.round((renderProgress / 100) * 360)}/360</span>
                  <span className="text-[#9999FF]">{renderProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff5512] to-[#9999FF] transition-all duration-150"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={triggerRender}
              disabled={renderProgress !== null}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-[#9999FF]/20 text-[#9999FF] border border-[#9999FF]/40 text-[13px] font-medium hover:bg-[#9999FF]/30 transition-colors cursor-pointer shadow-sm"
            >
              <Video className="w-3.5 h-3.5" />
              {renderProgress !== null ? 'Rendering Video...' : 'Queue Render Video Ad'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="text-[12px] text-white/60 hover:text-white underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Rates →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
