import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import RAPIER from '@dimforge/rapier3d-compat';
import gsap from 'gsap';

interface HeroKeychainProps {
  entranceStarted: boolean;
  onReady3D: () => void;
  onExploreClick: () => void;
}

const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _vecC = new THREE.Vector3();
const _quatA = new THREE.Quaternion();
const _quatB = new THREE.Quaternion();
const _mat4 = new THREE.Matrix4();
const _scaleVec = new THREE.Vector3(1, 1, 1);
const _upVec = new THREE.Vector3(0, 1, 0);
const _idQuat = new THREE.Quaternion(0, 0, 0, 1);

function detectSoftwareGl(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createInstagramTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 256, 256, 0);
  grad.addColorStop(0.0, '#f09433');
  grad.addColorStop(0.25, '#e6683c');
  grad.addColorStop(0.5, '#dc2743');
  grad.addColorStop(0.75, '#cc2366');
  grad.addColorStop(1.0, '#515bd4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const warmCorner = ctx.createRadialGradient(42, 214, 4, 42, 214, 150);
  warmCorner.addColorStop(0, 'rgba(245, 166, 35, 0.55)');
  warmCorner.addColorStop(1, 'rgba(245, 166, 35, 0)');
  ctx.fillStyle = warmCorner;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createMetaGradientTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, '#0052cc');
  grad.addColorStop(0.45, '#0064e0');
  grad.addColorStop(0.75, '#0081fb');
  grad.addColorStop(1.0, '#0099ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function buildYouTubePlayGeometry(): THREE.ExtrudeGeometry {
  const tri = new THREE.Shape();
  tri.moveTo(-0.13, 0.16);
  tri.lineTo(0.19, 0);
  tri.lineTo(-0.13, -0.16);
  tri.closePath();

  const geo = new THREE.ExtrudeGeometry(tri, {
    depth: 0.032,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}

function buildInstagramRingGeometry(): THREE.ExtrudeGeometry {
  const outer = new THREE.Shape();
  const s = 0.23;
  const r = 0.07;
  outer.moveTo(-s + r, -s);
  outer.lineTo(s - r, -s);
  outer.quadraticCurveTo(s, -s, s, -s + r);
  outer.lineTo(s, s - r);
  outer.quadraticCurveTo(s, s, s - r, s);
  outer.lineTo(-s + r, s);
  outer.quadraticCurveTo(-s, s, -s, s - r);
  outer.lineTo(-s, -s + r);
  outer.quadraticCurveTo(-s, -s, -s + r, -s);

  const inner = new THREE.Path();
  const si = 0.175;
  const ri = 0.045;
  inner.moveTo(-si + ri, -si);
  inner.lineTo(si - ri, -si);
  inner.quadraticCurveTo(si, -si, si, -si + ri);
  inner.lineTo(si, si - ri);
  inner.quadraticCurveTo(si, si, si - ri, si);
  inner.lineTo(-si + ri, si);
  inner.quadraticCurveTo(-si, si, -si, si - ri);
  inner.lineTo(-si, -si + ri);
  inner.quadraticCurveTo(-si, -si, -si + ri, -si);
  outer.holes.push(inner);

  const geo = new THREE.ExtrudeGeometry(outer, {
    depth: 0.165,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 16,
  });
  geo.center();
  return geo;
}

function buildMetaInfinityGeometry(): THREE.TubeGeometry {
  const pts: THREE.Vector3[] = [];
  const count = 96;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const denom = 1 + 0.55 * Math.sin(t) * Math.sin(t);
    const x = (0.5 * Math.cos(t)) / denom;
    const y = (0.52 * Math.sin(t) * Math.cos(t)) / denom;
    const z = 0.065 * Math.sin(t);
    pts.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  return new THREE.TubeGeometry(curve, 128, 0.088, 24, true);
}

function buildLinkedInInGeometry(): THREE.ExtrudeGeometry {
  // Dot of 'i'
  const iDot = new THREE.Shape();
  iDot.absarc(-0.175, 0.165, 0.052, 0, Math.PI * 2, false);

  // Stem of 'i'
  const iStem = new THREE.Shape();
  iStem.moveTo(-0.22, 0.065);
  iStem.lineTo(-0.13, 0.065);
  iStem.lineTo(-0.13, -0.21);
  iStem.lineTo(-0.22, -0.21);
  iStem.closePath();

  // 'n' letter
  const nShape = new THREE.Shape();
  nShape.moveTo(-0.055, 0.065);
  nShape.lineTo(0.03, 0.065);
  nShape.lineTo(0.03, 0.025);
  nShape.quadraticCurveTo(0.075, 0.078, 0.145, 0.075);
  nShape.quadraticCurveTo(0.245, 0.072, 0.245, -0.05);
  nShape.lineTo(0.245, -0.21);
  nShape.lineTo(0.155, -0.21);
  nShape.lineTo(0.155, -0.065);
  nShape.quadraticCurveTo(0.155, 0.0, 0.1, 0.0);
  nShape.quadraticCurveTo(0.035, 0.0, 0.035, -0.07);
  nShape.lineTo(0.035, -0.21);
  nShape.lineTo(-0.055, -0.21);
  nShape.closePath();

  const geo = new THREE.ExtrudeGeometry([iDot, iStem, nShape], {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.007,
    bevelSegments: 2,
    curveSegments: 20,
  });
  geo.translate(0, 0.02, -0.014);
  return geo;
}

export function HeroKeychain({ entranceStarted, onReady3D, onExploreClick }: HeroKeychainProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headlineSpanRef = useRef<HTMLSpanElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  const rigRef = useRef<THREE.Group | null>(null);
  const bodiesRef = useRef<RAPIER.RigidBody[]>([]);
  const hasPlayedEntranceRef = useRef(false);
  const readyCallbackRef = useRef(onReady3D);
  readyCallbackRef.current = onReady3D;
  const entranceStartedRef = useRef(entranceStarted);
  entranceStartedRef.current = entranceStarted;

  // Text & 3D entrance trigger when loader starts wiping
  useEffect(() => {
    if (!entranceStarted || hasPlayedEntranceRef.current) return;
    hasPlayedEntranceRef.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (headlineSpanRef.current) {
      gsap.fromTo(
        headlineSpanRef.current,
        { yPercent: 105 },
        { yPercent: 0, duration: 1.2, delay: 0.35, ease: 'expo.out' }
      );
    }

    const subAndBtn = [subtitleRef.current, ctaRef.current].filter(Boolean);
    if (subAndBtn.length > 0) {
      gsap.fromTo(
        subAndBtn,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, delay: 0.55, stagger: 0.1, ease: 'expo.out' }
      );
    }

    if (rigRef.current) {
      const dummy = { progress: 0 };
      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo(
        rigRef.current.position,
        { y: -4 },
        { y: 0, duration: 1.5, ease: 'elastic.out(1, 1)' },
        0
      );
      tl.to(
        dummy,
        {
          progress: 1,
          duration: 1.15,
          ease: 'none',
          onUpdate: () => {
            const gScale = dummy.progress >= 1 ? 1 : -0.25;
            for (const b of bodiesRef.current) {
              try {
                b.setGravityScale(gScale, true);
              } catch {
                // ignore if disposed
              }
            }
          },
          onComplete: () => {
            for (const b of bodiesRef.current) {
              try {
                b.setGravityScale(1, true);
              } catch {
                // ignore
              }
            }
          },
        },
        0
      );
    }
  }, [entranceStarted]);

  useEffect(() => {
    const heroEl = heroRef.current;
    const canvas = canvasRef.current;
    if (!heroEl || !canvas) return;

    let disposed = false;
    let rafId = 0;
    let timeoutId = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let world: RAPIER.World | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    let envRT: THREE.WebGLRenderTarget | null = null;
    const disposables: Array<{ dispose: () => void }> = [];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    const init = async () => {
      try {
        await RAPIER.init();
      } catch {
        readyCallbackRef.current();
        return;
      }
      if (disposed) return;

      const width = heroEl.clientWidth || window.innerWidth;
      const height = heroEl.clientHeight || window.innerHeight;
      const aspect = width / Math.max(1, height);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isSoftwareGl,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.84;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0xe3e9f2, 0);

      const scene = new THREE.Scene();

      pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      envRT = pmrem.fromScene(roomEnv, 0.04);
      roomEnv.dispose();
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.62;

      // Directional rim & key lights
      const rimTarget = new THREE.Object3D();
      rimTarget.position.set(0, 2.2, 0);
      scene.add(rimTarget);

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.95);
      rimLight.position.set(-29, -14.8, -35);
      rimLight.target = rimTarget;
      scene.add(rimLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
      keyLight.position.set(6, 10, 12);
      scene.add(keyLight);

      // Camera rig
      const skipEntranceDrop = prefersReduced || entranceStartedRef.current;
      const rig = new THREE.Group();
      rig.position.set(0, skipEntranceDrop ? 0 : -4, 10);
      scene.add(rig);
      rigRef.current = rig;

      const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 500);
      const updateCameraOffset = (a: number) => {
        if (a >= 1.25) {
          camera.position.set(0, 1.06, -4.4);
        } else if (a >= 0.9) {
          camera.position.set(0, 0.85, -3.2);
        } else {
          const portraitZ = a < 0.55 ? 3.2 : 2.5;
          camera.position.set(0, -1.0, portraitZ);
        }
        camera.aspect = a;
        camera.updateProjectionMatrix();
      };
      updateCameraOffset(aspect);
      rig.add(camera);

      // Shared materials
      const steelRingMat = new THREE.MeshStandardMaterial({
        color: 0xcfd3da,
        metalness: 1,
        roughness: 0.18,
      });
      const chainLinkMat = new THREE.MeshStandardMaterial({
        color: 0xa9afba,
        metalness: 1,
        roughness: 0.2,
      });
      disposables.push(steelRingMat, chainLinkMat);

      // Main keyring at (0, 3.2, 0)
      const mainRingCenter = new THREE.Vector3(0, 3.2, 0);
      const mainRingGeo = new THREE.TorusGeometry(0.5, 0.04, 24, 64);
      const mainRingMesh = new THREE.Mesh(mainRingGeo, steelRingMat);
      mainRingMesh.position.copy(mainRingCenter);
      scene.add(mainRingMesh);
      disposables.push(mainRingGeo);

      // Physics world
      world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
      world.integrationParameters.numSolverIterations = 8;
      const GROUP_NONE = 0;
      const GROUP_TAGS = 1 << 1;
      const GROUP_CHAIN = 1 << 2;

      const maskTags = (GROUP_TAGS << 16) | GROUP_TAGS;
      const maskChainLink = (GROUP_CHAIN << 16) | GROUP_NONE;
      const maskRing = (GROUP_CHAIN << 16) | (GROUP_TAGS | GROUP_CHAIN);

      // Build charm 3D meshes
      const loopGeo = new THREE.TorusGeometry(0.075, 0.0225, 16, 36);
      disposables.push(loopGeo);
      const makeLoop = (y: number, radiusScale = 1) => {
        const m = new THREE.Mesh(loopGeo, steelRingMat);
        m.rotation.y = Math.PI / 2;
        m.position.y = y;
        if (radiusScale !== 1) m.scale.setScalar(radiusScale);
        return m;
      };

      const whiteGlyphMat = new THREE.MeshPhysicalMaterial({
        color: 0xf4f6fa,
        roughness: 0.24,
        clearcoat: 0.55,
        clearcoatRoughness: 0.12,
      });
      disposables.push(whiteGlyphMat);

      // 1. YouTube Play Charm
      const youtubeGroup = new THREE.Group();
      const ytBodyGeo = new RoundedBoxGeometry(0.96, 0.68, 0.14, 5, 0.15);
      const ytMat = new THREE.MeshPhysicalMaterial({
        color: 0xd90429,
        roughness: 0.24,
        metalness: 0.04,
        clearcoat: 0.72,
        clearcoatRoughness: 0.1,
      });
      const ytPlayGeo = buildYouTubePlayGeometry();
      const ytPlayFront = new THREE.Mesh(ytPlayGeo, whiteGlyphMat);
      ytPlayFront.position.z = 0.068;
      const ytPlayBack = new THREE.Mesh(ytPlayGeo, whiteGlyphMat);
      ytPlayBack.position.z = -0.068;
      ytPlayBack.rotation.y = Math.PI;
      youtubeGroup.add(new THREE.Mesh(ytBodyGeo, ytMat), ytPlayFront, ytPlayBack, makeLoop(0.43));
      disposables.push(ytBodyGeo, ytMat, ytPlayGeo);

      // 2. Instagram Camera Charm
      const instagramGroup = new THREE.Group();
      const igTex = createInstagramTexture();
      igTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const igBodyGeo = new RoundedBoxGeometry(0.76, 0.76, 0.135, 5, 0.18);
      const igBodyMat = new THREE.MeshPhysicalMaterial({
        map: igTex,
        roughness: 0.24,
        metalness: 0.04,
        clearcoat: 0.68,
        clearcoatRoughness: 0.12,
      });
      const igFrameGeo = buildInstagramRingGeometry();
      const igLensGeo = new THREE.TorusGeometry(0.095, 0.026, 18, 36);
      const igLensFront = new THREE.Mesh(igLensGeo, whiteGlyphMat);
      igLensFront.position.z = 0.072;
      const igLensBack = new THREE.Mesh(igLensGeo, whiteGlyphMat);
      igLensBack.position.z = -0.072;
      const igFlashGeo = new THREE.SphereGeometry(0.028, 16, 16);
      const igFlashFront = new THREE.Mesh(igFlashGeo, whiteGlyphMat);
      igFlashFront.position.set(0.115, 0.115, 0.074);
      const igFlashBack = new THREE.Mesh(igFlashGeo, whiteGlyphMat);
      igFlashBack.position.set(-0.115, 0.115, -0.074);
      instagramGroup.add(
        new THREE.Mesh(igBodyGeo, igBodyMat),
        new THREE.Mesh(igFrameGeo, whiteGlyphMat),
        igLensFront,
        igLensBack,
        igFlashFront,
        igFlashBack,
        makeLoop(0.47)
      );
      disposables.push(igTex, igBodyGeo, igBodyMat, igFrameGeo, igLensGeo, igFlashGeo);

      // 3. Meta Infinity Loop Charm
      const metaGroup = new THREE.Group();
      const metaTex = createMetaGradientTexture();
      metaTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const metaGeo = buildMetaInfinityGeometry();
      const metaMat = new THREE.MeshPhysicalMaterial({
        map: metaTex,
        roughness: 0.2,
        metalness: 0.1,
        iridescence: 0.35,
        iridescenceIOR: 1.38,
        clearcoat: 0.78,
        clearcoatRoughness: 0.09,
      });
      const metaClaspGeo = new THREE.TorusGeometry(0.105, 0.024, 16, 32);
      const metaClasp = new THREE.Mesh(metaClaspGeo, steelRingMat);
      metaClasp.rotation.x = Math.PI / 2;
      const metaPinGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.32, 16);
      const metaPin = new THREE.Mesh(metaPinGeo, steelRingMat);
      metaPin.position.y = 0.19;
      metaGroup.add(new THREE.Mesh(metaGeo, metaMat), metaClasp, metaPin, makeLoop(0.38));
      disposables.push(metaTex, metaGeo, metaMat, metaClaspGeo, metaPinGeo);

      // 4. LinkedIn [in] Charm
      const linkedinGroup = new THREE.Group();
      const liBodyGeo = new RoundedBoxGeometry(0.76, 0.76, 0.135, 5, 0.14);
      const liMat = new THREE.MeshPhysicalMaterial({
        color: 0x084da1,
        roughness: 0.24,
        metalness: 0.04,
        clearcoat: 0.72,
        clearcoatRoughness: 0.1,
      });
      const liEmblemGeo = buildLinkedInInGeometry();
      const liEmblemFront = new THREE.Mesh(liEmblemGeo, whiteGlyphMat);
      liEmblemFront.position.z = 0.068;
      const liEmblemBack = new THREE.Mesh(liEmblemGeo, whiteGlyphMat);
      liEmblemBack.position.z = -0.068;
      liEmblemBack.rotation.y = Math.PI;
      linkedinGroup.add(
        new THREE.Mesh(liBodyGeo, liMat),
        liEmblemFront,
        liEmblemBack,
        makeLoop(0.47)
      );
      disposables.push(liBodyGeo, liMat, liEmblemGeo);

      // 5. X / X.MAX Brand Orange Monogram Charm
      const letterGroup = new THREE.Group();
      const mainXShape = new THREE.Shape();
      mainXShape.moveTo(-0.4, 0.35);
      mainXShape.lineTo(-0.16, 0.35);
      mainXShape.lineTo(0.36, -0.35);
      mainXShape.lineTo(0.14, -0.35);
      mainXShape.lineTo(-0.06, -0.1);
      mainXShape.lineTo(-0.26, -0.35);
      mainXShape.lineTo(-0.42, -0.35);
      mainXShape.lineTo(-0.16, 0.02);
      mainXShape.lineTo(-0.34, 0.24);
      mainXShape.closePath();

      const upperRightStroke = new THREE.Shape();
      upperRightStroke.moveTo(0.05, 0.22);
      upperRightStroke.lineTo(0.18, 0.35);
      upperRightStroke.lineTo(0.39, 0.35);
      upperRightStroke.lineTo(0.19, 0.06);
      upperRightStroke.closePath();

      const letterGeo = new THREE.ExtrudeGeometry([mainXShape, upperRightStroke], {
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.09,
        bevelSize: 0.04,
        bevelSegments: 8,
      });
      letterGeo.center();
      const enamelMat = new THREE.MeshPhysicalMaterial({
        color: 0xf24405,
        roughness: 0.25,
        clearcoat: 0.72,
        clearcoatRoughness: 0.1,
      });
      letterGroup.add(new THREE.Mesh(letterGeo, enamelMat), makeLoop(0.54));
      disposables.push(letterGeo, enamelMat);

      interface CharmSpec {
        thetaDeg: number;
        phiDeg: number;
        z: number;
        colliderType: 'cuboid' | 'ball';
        dims: [number, number, number];
        density: number;
        offset: number;
        links: number;
        linkLen: number;
        isBeadStrand?: boolean;
        mesh: THREE.Group;
      }

      const specs: CharmSpec[] = [
        {
          thetaDeg: -52,
          phiDeg: -66,
          z: -0.22,
          colliderType: 'cuboid',
          dims: [0.48, 0.36, 0.1],
          density: 1.5,
          offset: 0.51,
          links: 13,
          linkLen: 0.085,
          mesh: youtubeGroup,
        },
        {
          thetaDeg: -22,
          phiDeg: -24,
          z: 0.45,
          colliderType: 'cuboid',
          dims: [0.38, 0.4, 0.1],
          density: 1.5,
          offset: 0.55,
          links: 17,
          linkLen: 0.085,
          mesh: instagramGroup,
        },
        {
          thetaDeg: 10,
          phiDeg: 6,
          z: 0.8,
          colliderType: 'cuboid',
          dims: [0.5, 0.32, 0.12],
          density: 1.6,
          offset: 0.46,
          links: 14,
          linkLen: 0.085,
          mesh: metaGroup,
        },
        {
          thetaDeg: 42,
          phiDeg: 38,
          z: 0.2,
          colliderType: 'cuboid',
          dims: [0.38, 0.4, 0.1],
          density: 1.5,
          offset: 0.55,
          links: 18,
          linkLen: 0.085,
          mesh: linkedinGroup,
        },
        {
          thetaDeg: 82,
          phiDeg: 90,
          z: -0.25,
          colliderType: 'cuboid',
          dims: [0.42, 0.48, 0.12],
          density: 1.6,
          offset: 0.62,
          links: 13,
          linkLen: 0.085,
          mesh: letterGroup,
        },
      ];

      const startRingGeo = new THREE.TorusGeometry(0.12, 0.0144, 14, 36);
      const endRingGeo = new THREE.TorusGeometry(0.08, 0.0144, 14, 32);
      const ovalLinkGeo = new THREE.TorusGeometry(0.062, 0.02, 12, 24);
      ovalLinkGeo.scale(1, 1.5, 1);
      disposables.push(startRingGeo, endRingGeo, ovalLinkGeo);

      interface BuiltChain {
        startRingBody: RAPIER.RigidBody;
        startRingMesh: THREE.Mesh;
        endRingBody: RAPIER.RigidBody;
        endRingMesh: THREE.Mesh;
        charmBody: RAPIER.RigidBody;
        charmMesh: THREE.Group;
        linkBodies: RAPIER.RigidBody[];
        linkDirs: THREE.Vector3[];
        instancedMesh: THREE.InstancedMesh;
        isBeadStrand: boolean;
      }

      const chains: BuiltChain[] = [];
      const allDynamicBodies: RAPIER.RigidBody[] = [];

      for (const spec of specs) {
        const thetaRad = THREE.MathUtils.degToRad(spec.thetaDeg - 90);
        const baseX = mainRingCenter.x + 0.5 * Math.cos(thetaRad);
        const baseY = mainRingCenter.y + 0.5 * Math.sin(thetaRad);

        // 1. Fixed anchor
        const anchorBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.fixed().setTranslation(baseX, baseY, 0)
        );

        // 2. Start ring
        const startRingBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(baseX, baseY, 0)
            .setLinearDamping(2.3)
            .setAngularDamping(2.9)
            .setCanSleep(true)
        );
        world.createCollider(
          RAPIER.ColliderDesc.cuboid(0.12 * 0.12, 0.12, 0.12)
            .setDensity(5)
            .setCollisionGroups(maskRing),
          startRingBody
        );
        world.createImpulseJoint(
          RAPIER.JointData.spherical({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }),
          anchorBody,
          startRingBody,
          true
        );

        const startRingMesh = new THREE.Mesh(startRingGeo, steelRingMat);
        startRingMesh.rotation.y = Math.PI / 2;
        const startRingHolder = new THREE.Group();
        startRingHolder.add(startRingMesh);
        scene.add(startRingHolder);

        // 3. N link bodies spawned sequentially down the chain
        const linkBodies: RAPIER.RigidBody[] = [];
        const linkDirs: THREE.Vector3[] = [];
        for (let i = 0; i < spec.links; i++) {
          const linkY = baseY - 0.12 - i * spec.linkLen;
          const lb = world.createRigidBody(
            RAPIER.RigidBodyDesc.dynamic()
              .setTranslation(baseX, linkY, 0)
              .setLinearDamping(2.3)
              .setAngularDamping(2.9)
              .setCanSleep(true)
          );
          world.createCollider(
            RAPIER.ColliderDesc.ball(0.1).setDensity(1).setCollisionGroups(maskChainLink),
            lb
          );
          if (i === 0) {
            world.createImpulseJoint(
              RAPIER.JointData.spherical({ x: 0, y: -0.12, z: 0 }, { x: 0, y: 0, z: 0 }),
              startRingBody,
              lb,
              true
            );
          } else {
            world.createImpulseJoint(
              RAPIER.JointData.spherical({ x: 0, y: -spec.linkLen, z: 0 }, { x: 0, y: 0, z: 0 }),
              linkBodies[i - 1],
              lb,
              true
            );
          }
          linkBodies.push(lb);
          linkDirs.push(new THREE.Vector3(0, -1, 0));
          allDynamicBodies.push(lb);
        }

        // 4. End ring
        const endRingY = baseY - 0.12 - (spec.links - 1) * spec.linkLen - 0.08;
        const endRingBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(baseX, endRingY, 0)
            .setLinearDamping(2.3)
            .setAngularDamping(2.9)
            .setCanSleep(true)
        );
        world.createCollider(
          RAPIER.ColliderDesc.cuboid(0.08 * 0.12, 0.08, 0.08)
            .setDensity(5)
            .setCollisionGroups(maskRing),
          endRingBody
        );
        world.createImpulseJoint(
          RAPIER.JointData.spherical({ x: 0, y: -0.08, z: 0 }, { x: 0, y: 0, z: 0 }),
          linkBodies[linkBodies.length - 1],
          endRingBody,
          true
        );

        const endRingMesh = new THREE.Mesh(endRingGeo, steelRingMat);
        endRingMesh.rotation.y = Math.PI / 2;
        const endRingHolder = new THREE.Group();
        endRingHolder.add(endRingMesh);
        scene.add(endRingHolder);

        // 5. Charm body
        const charmBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(baseX, endRingY - spec.offset, spec.z)
            .setLinearDamping(2.3)
            .setAngularDamping(2.9)
            .setCanSleep(true)
        );
        const charmCollider =
          spec.colliderType === 'ball'
            ? RAPIER.ColliderDesc.ball(spec.dims[0])
            : RAPIER.ColliderDesc.cuboid(spec.dims[0], spec.dims[1], spec.dims[2]);
        charmCollider.setDensity(spec.density).setCollisionGroups(maskTags);
        world.createCollider(charmCollider, charmBody);

        world.createImpulseJoint(
          RAPIER.JointData.fixed(
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0, w: 1 },
            { x: 0, y: spec.offset, z: 0 },
            { x: 0, y: 0, z: 0, w: 1 }
          ),
          endRingBody,
          charmBody,
          true
        );

        // 6. Constant outward fan force
        const phiRad = THREE.MathUtils.degToRad(spec.phiDeg - 90);
        charmBody.addForce(
          { x: 1.25 * Math.cos(phiRad), y: 0.65 * Math.sin(phiRad), z: spec.z * 0.7 },
          true
        );

        scene.add(spec.mesh);

        const instancedMesh = new THREE.InstancedMesh(ovalLinkGeo, chainLinkMat, spec.links);
        instancedMesh.frustumCulled = false;
        scene.add(instancedMesh);

        allDynamicBodies.push(startRingBody, endRingBody, charmBody);
        chains.push({
          startRingBody,
          startRingMesh: startRingHolder as unknown as THREE.Mesh,
          endRingBody,
          endRingMesh: endRingHolder as unknown as THREE.Mesh,
          charmBody,
          charmMesh: spec.mesh,
          linkBodies,
          linkDirs,
          instancedMesh,
          isBeadStrand: Boolean(spec.isBeadStrand),
        });
      }

      bodiesRef.current = allDynamicBodies;

      // Initial gravity scale
      if (!prefersReduced && !entranceStartedRef.current) {
        for (const b of allDynamicBodies) {
          b.setGravityScale(-0.25, true);
        }
      }

      // Warm up physics slightly or fully settle for reduced motion / remount
      const warmupSteps = prefersReduced || entranceStartedRef.current ? 240 : 12;
      world.timestep = 1 / 60;
      for (let i = 0; i < warmupSteps; i++) {
        world.step();
      }

      // Sync visual transforms helper
      const clampYaw = (body: RAPIER.RigidBody, limitRad: number) => {
        const r = body.rotation();
        _quatA.set(r.x, r.y, r.z, r.w);
        _vecA.set(0, 0, 1).applyQuaternion(_quatA);
        const yaw = Math.atan2(_vecA.x, _vecA.z);
        if (Math.abs(yaw) > limitRad) {
          const targetYaw = limitRad * Math.sign(yaw);
          const corr = targetYaw - yaw;
          _quatB.setFromAxisAngle(_upVec, corr);
          _quatA.premultiply(_quatB);
          body.setRotation({ x: _quatA.x, y: _quatA.y, z: _quatA.z, w: _quatA.w }, false);
          const av = body.angvel();
          body.setAngvel({ x: av.x, y: 0, z: av.z }, false);
        }
      };

      const syncMeshes = (dt: number) => {
        const yaw15 = THREE.MathUtils.degToRad(15);
        const yaw12 = THREE.MathUtils.degToRad(12);
        const dirLerp = Math.min(1, 10 * dt);

        for (const ch of chains) {
          clampYaw(ch.startRingBody, yaw15);
          clampYaw(ch.endRingBody, yaw12);
          clampYaw(ch.charmBody, yaw12);

          if (!ch.charmBody.isSleeping()) {
            const cr = ch.charmBody.rotation();
            _quatA.set(cr.x, cr.y, cr.z, cr.w);
            _quatA.slerp(_idQuat, 0.001);
            ch.charmBody.setRotation(
              { x: _quatA.x, y: _quatA.y, z: _quatA.z, w: _quatA.w },
              false
            );
          }

          const sp = ch.startRingBody.translation();
          const sr = ch.startRingBody.rotation();
          ch.startRingMesh.position.set(sp.x, sp.y, sp.z);
          ch.startRingMesh.quaternion.set(sr.x, sr.y, sr.z, sr.w);

          const ep = ch.endRingBody.translation();
          const er = ch.endRingBody.rotation();
          ch.endRingMesh.position.set(ep.x, ep.y, ep.z);
          ch.endRingMesh.quaternion.set(er.x, er.y, er.z, er.w);

          const cp = ch.charmBody.translation();
          const cr = ch.charmBody.rotation();
          ch.charmMesh.position.set(cp.x, cp.y, cp.z);
          ch.charmMesh.quaternion.set(cr.x, cr.y, cr.z, cr.w);

          const n = ch.linkBodies.length;
          for (let i = 0; i < n; i++) {
            const lp = ch.linkBodies[i].translation();
            _vecA.set(lp.x, lp.y, lp.z);

            if (i < n - 1) {
              const np = ch.linkBodies[i + 1].translation();
              _vecB.set(np.x - lp.x, np.y - lp.y, np.z - lp.z);
            } else {
              const pp = ch.linkBodies[i - 1].translation();
              _vecB.set(lp.x - pp.x, lp.y - pp.y, lp.z - pp.z);
            }
            if (_vecB.lengthSq() > 1e-6) {
              _vecB.normalize();
              ch.linkDirs[i].lerp(_vecB, dirLerp).normalize();
            }

            _quatA.setFromUnitVectors(_upVec, ch.linkDirs[i]);
            if (!ch.isBeadStrand) {
              const twist = THREE.MathUtils.degToRad(i * 16 + (i % 2 === 1 ? 90 : 0));
              _quatB.setFromAxisAngle(_upVec, twist);
              _quatA.multiply(_quatB);
            }

            _mat4.compose(_vecA, _quatA, _scaleVec);
            ch.instancedMesh.setMatrixAt(i, _mat4);
          }
          ch.instancedMesh.instanceMatrix.needsUpdate = true;
        }
      };

      syncMeshes(1 / 60);
      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }
      renderer.render(scene, camera);
      readyCallbackRef.current();

      if (prefersReduced) {
        return;
      }

      // Pointer ray push interaction
      let pointerInside = false;
      const pointerNdc = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const hitPoint = new THREE.Vector3();

      const onPointerMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom && rect.width > 0 && rect.height > 0) {
          pointerInside = true;
          pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        } else {
          pointerInside = false;
        }
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      const onResize = () => {
        if (!heroEl || !renderer) return;
        const w = heroEl.clientWidth || window.innerWidth;
        const h = heroEl.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        updateCameraOffset(w / Math.max(1, h));
      };
      window.addEventListener('resize', onResize);

      let inView = true;
      const io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0 }
      );
      io.observe(heroEl);

      // Software WebGL loop pacing
      const afterDraw = (cb: () => void) => {
        if (disposed || !renderer) return;
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || !gl.fenceSync) {
          timeoutId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            timeoutId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            timeoutId = window.setTimeout(cb, 80);
          }
        };
        timeoutId = window.setTimeout(poll, 5);
      };

      let lastTime = performance.now();
      let accumulator = 0;

      const tick = () => {
        if (disposed || !renderer || !world) return;
        const now = performance.now();
        const frameDt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        if (inView) {
          accumulator += frameDt;
          const stepDt = 1 / 60;
          while (accumulator >= stepDt) {
            if (pointerInside) {
              raycaster.setFromCamera(pointerNdc, camera);
              if (raycaster.ray.intersectPlane(zPlane, hitPoint)) {
                for (const ch of chains) {
                  const cp = ch.charmBody.translation();
                  _vecC.set(cp.x - hitPoint.x, cp.y - hitPoint.y, cp.z - hitPoint.z);
                  const d = _vecC.length();
                  if (d > 0.0001 && d < 2) {
                    const mag = (4.4 * Math.pow(1 - d / 2, 2) * stepDt) / d;
                    ch.charmBody.applyImpulse(
                      { x: _vecC.x * mag, y: _vecC.y * mag, z: _vecC.z * mag },
                      true
                    );
                  }
                }
              }
            }
            world.step();
            accumulator -= stepDt;
          }
          syncMeshes(frameDt);
          // Subtle damped camera parallax on mouse movement
          const targetRigX = pointerInside ? pointerNdc.x * 0.18 : 0;
          rig.position.x = THREE.MathUtils.damp(rig.position.x, targetRigX, 4.5, frameDt);
          renderer.render(scene, camera);
        }

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          rafId = requestAnimationFrame(tick);
        }
      };

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        rafId = requestAnimationFrame(tick);
      }

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('resize', onResize);
        io.disconnect();
      };
    };

    let cleanupListeners: (() => void) | undefined;
    init().then((fn) => {
      cleanupListeners = fn;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      cleanupListeners?.();
      disposables.forEach((d) => d.dispose());
      envRT?.dispose();
      pmrem?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="hero-u-scope relative w-full h-[100svh] md:h-screen min-h-[520px] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #dbe3ee 0%, #eef2f8 62%, #f4f7fb 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full block"
      />

      <div className="pointer-events-none relative z-[2] flex h-full w-full flex-col justify-end items-start px-[20px] pb-[9svh] gap-[14px] sm:px-[32px] sm:pb-[10svh] md:flex-row md:items-end md:justify-between md:px-[36px] md:pb-[44px] md:gap-[28px] lg:px-[calc(90*var(--u))] lg:pb-[calc(64*var(--u))] lg:gap-[calc(40*var(--u))]">
        <h1 className="font-medium text-[#111418] text-left tracking-[-0.03em] text-[13.8vw] leading-[0.96] sm:text-[11vw] md:text-[clamp(58px,8.2vw,92px)] lg:text-[calc(128*var(--u))] lg:leading-[0.94] whitespace-nowrap">
          <span className="block overflow-hidden pb-[0.08em] mb-[-0.08em]">
            <span ref={headlineSpanRef} className="inline-block">
              Ideas into
              <br />
              Impact.
            </span>
          </span>
        </h1>

        <div className="flex flex-col items-start md:pb-[4px] lg:pb-[calc(10*var(--u))]">
          <p
            ref={subtitleRef}
            className="text-[#111418] text-[15.5px] leading-[1.25] tracking-[0.01em] sm:text-[17px] md:text-[18px] md:leading-[1.2] lg:text-[calc(23.5*var(--u))] lg:leading-[1.15]"
          >
            Digital marketing, creative,
            <br />
            branding &amp; web — priced clearly.
          </p>
          <button
            ref={ctaRef}
            type="button"
            onClick={onExploreClick}
            className="pointer-events-auto hero-cta-btn mt-[18px] h-[44px] px-[22px] rounded-[12px] text-[15px] md:mt-[20px] md:h-[44px] md:px-[24px] md:text-[15px] lg:mt-[calc(28*var(--u))] lg:h-[calc(48*var(--u))] lg:px-[calc(29*var(--u))] lg:rounded-[calc(13*var(--u))] lg:text-[calc(16*var(--u))] bg-[#16191f] text-white tracking-[0.02em] font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111418]"
          >
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
}
