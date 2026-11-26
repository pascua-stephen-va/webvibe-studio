import { useEffect, useRef } from 'react';
import type { ThemeMode } from '../utils/studioLogic';

interface HeroShaderCanvasProps {
  theme: ThemeMode;
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_dark;
  uniform vec2 u_pointer;
  uniform vec2 u_pointerVel;
  uniform float u_pointerActive;

  // Smooth 2D Simplex Noise (Ashima Arts) — zero grid/blocky artifacts
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Domain-warped FBM with irrational octave rotation
  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.52;
    mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 4; i++) {
      value += amp * snoise(p);
      p = rot * p * 1.92 + vec2(3.7, 1.9);
      amp *= 0.48;
    }
    return value;
  }

  // Sculpted organic liquid ribbons behind physical fluted glass
  // Returns vec2(ribbonEnergy, hotCoreEnergy)
  vec2 sampleFluidField(vec2 uv, float aspect, float t) {
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    // Responsive pointer momentum wake pulling liquid light behind glass ribs
    vec2 ptr = vec2((u_pointer.x - 0.5) * aspect, u_pointer.y - 0.5);
    vec2 toPtr = p - ptr;
    float ptrDist = length(toPtr);
    float ptrFalloff = exp(-ptrDist * ptrDist * 5.8) * u_pointerActive;
    p -= u_pointerVel * ptrFalloff * 0.22;

    // Silky low-frequency domain warping (smooth liquid bands, zero noisy crinkles)
    vec2 q = vec2(
      fbm(p * 0.68 + vec2(t * 0.09, -t * 0.07)),
      fbm(p * 0.68 + vec2(-t * 0.08, t * 0.09) + vec2(4.2, 1.7))
    );
    vec2 warped = p + q * 0.42;

    // Two sculpted sweeping liquid ribbons weaving across upper-right & mid-right
    float band1Coord = warped.y * 1.45 - warped.x * 0.58 - 0.12 + 0.14 * sin(t * 0.35 + warped.x * 1.2);
    float ribbon1 = exp(-band1Coord * band1Coord * 7.5);

    float band2Coord = warped.y * 1.15 + warped.x * 0.46 - 0.54 + 0.12 * cos(t * 0.28 - warped.y * 1.4);
    float ribbon2 = exp(-band2Coord * band2Coord * 9.0);

    // Soft secondary organic light pool drifting upper-right
    float organicMod = 0.68 + 0.32 * snoise(warped * 0.95 + vec2(t * 0.06, -t * 0.05));

    // Tight anchor envelopes in upper-right & mid-right (leaves 55-65% clean canvas)
    vec2 anchorUpperRight = vec2(0.80 + 0.045 * sin(t * 0.42), 0.76 + 0.035 * cos(t * 0.36));
    vec2 anchorMidRight = vec2(0.76 + 0.05 * cos(t * 0.34), 0.46 + 0.04 * sin(t * 0.40));
    vec2 anchorTopMid = vec2(0.54 + 0.04 * sin(t * 0.30), 0.86 + 0.03 * cos(t * 0.32));

    float d1 = length((uv - anchorUpperRight) * vec2(aspect * 0.96, 1.15));
    float d2 = length((uv - anchorMidRight) * vec2(aspect * 1.05, 1.18));
    float d3 = length((uv - anchorTopMid) * vec2(aspect * 1.18, 1.42));

    float envelope = clamp(
      exp(-d1 * d1 * 4.8) * 1.18 +
      exp(-d2 * d2 * 6.0) * 0.92 +
      exp(-d3 * d3 * 7.8) * 0.58,
      0.0,
      1.25
    );

    // Concentrated pointer-pulled light pool behind the glass
    float ptrPlume = exp(-ptrDist * ptrDist * 10.5) * u_pointerActive * 0.72;

    // Generous calm zone covering the entire headline + CTA column (bottom-left to mid-left)
    float calmX = smoothstep(0.72, 0.36, uv.x);
    float calmY = smoothstep(0.64, 0.20, uv.y);
    float headlineClearance = 1.0 - calmX * calmY * 0.94;

    float sculpted = (ribbon1 * 0.95 + ribbon2 * 0.78) * envelope * organicMod + ptrPlume;
    sculpted *= headlineClearance;

    // High threshold smoothstep preserves 55-65% crisp negative space with vivid flowing bands
    float ribbon = smoothstep(0.24, 0.88, sculpted);
    float hotCore = smoothstep(0.66, 1.08, sculpted);

    return vec2(ribbon, hotCore);
  }

  vec3 mapLightRamp(float energy, float core) {
    // Light Mode: #FFFFFF -> #C4B5FD crisp periwinkle -> saturated #532BFD flowing cores
    vec3 pureWhite = vec3(1.0000, 1.0000, 1.0000);  // #FFFFFF
    vec3 periwinkle = vec3(0.7686, 0.7098, 0.9922); // #C4B5FD
    vec3 brand = vec3(0.3255, 0.1686, 0.9922);      // #532BFD
    vec3 deepBrand = vec3(0.2650, 0.1180, 0.9000);

    vec3 col = mix(pureWhite, periwinkle, smoothstep(0.08, 0.52, energy));
    col = mix(col, brand, smoothstep(0.40, 0.86, energy));
    col = mix(col, deepBrand, core * 0.28);
    return col;
  }

  vec3 mapDarkRamp(float energy, float core) {
    // Dark Mode: #06060D -> #2E1065 deep indigo -> #532BFD -> #8B5CF6 -> tight #EDE9FE cores (~30% peak)
    vec3 obsidian = vec3(0.0235, 0.0235, 0.0510);   // #06060D
    vec3 deepIndigo = vec3(0.1804, 0.0627, 0.3961); // #2E1065
    vec3 brand = vec3(0.3255, 0.1686, 0.9922);      // #532BFD
    vec3 electric = vec3(0.5451, 0.3608, 0.9647);   // #8B5CF6
    vec3 highlight = vec3(0.9294, 0.9137, 0.9961);  // #EDE9FE

    vec3 col = mix(obsidian, deepIndigo, smoothstep(0.08, 0.44, energy));
    col = mix(col, brand, smoothstep(0.36, 0.74, energy));
    col = mix(col, electric, smoothstep(0.68, 0.96, energy));
    col = mix(col, highlight, core * 0.32);
    return col;
  }

  float hashGrain(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    float t = u_time;

    // Subtle 20-degree architectural tilted flutes (~20-24 across desktop)
    float angle = 0.34906585; // 20 degrees
    float ca = cos(angle);
    float sa = sin(angle);
    vec2 fluteAxis = vec2(ca, sa);

    // Aspect-corrected projection along flute axis
    vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float fluteDensity = clamp(u_resolution.x / 66.0, 15.0, 25.0) / max(aspect, 0.65);
    float projected = dot(centered, fluteAxis) * fluteDensity;

    float fluteCell = floor(projected);
    float fluteFrac = fract(projected);
    // Normalized cylindrical rib coordinate x in [-1, 1]
    float x = fluteFrac * 2.0 - 1.0;

    // Cylindrical glass lens normal & strong optical refraction distortion
    float nz = sqrt(max(0.08, 1.0 - x * x * 0.92));
    // Lens bending bends steeply near rib edges + subtle discrete glass-prism step per rib
    float cylinderBend = (x / (nz + 0.26)) * 0.026;
    float ribStep = (fract(sin(fluteCell * 12.7) * 43758.5453) - 0.5) * 0.004;
    float totalRefract = cylinderBend + ribStep;

    // Convert displacement back to UV space along flute normal
    vec2 refractVec = vec2(fluteAxis.x / aspect, fluteAxis.y) * totalRefract;

    // Tuned chromatic aberration (0.6 strength) concentrated along curved rib edges
    float edgeFactor = smoothstep(0.25, 0.98, abs(x));
    float caStrength = 0.60;
    vec2 caOffset = vec2(fluteAxis.x / aspect, fluteAxis.y) * (0.0115 * caStrength * edgeFactor * sign(x));

    vec2 uvR = uv + refractVec + caOffset;
    vec2 uvG = uv + refractVec;
    vec2 uvB = uv + refractVec - caOffset;

    vec2 fieldR = sampleFluidField(uvR, aspect, t);
    vec2 fieldG = sampleFluidField(uvG, aspect, t);
    vec2 fieldB = sampleFluidField(uvB, aspect, t);

    // Base clean canvas gradient (brightest bottom-left in light mode, deepest bottom-left in dark mode)
    float blClean = smoothstep(1.1, 0.05, length(uv - vec2(0.18, 0.16)));
    vec3 lightCanvas = mix(vec3(0.9569, 0.9569, 0.9725), vec3(1.0), blClean * 0.85);
    vec3 darkCanvas = mix(vec3(0.0510, 0.0431, 0.1176), vec3(0.0235, 0.0235, 0.0510), blClean * 0.85);

    // Chromatic RGB channel composition for both themes
    vec3 colLight;
    colLight.r = mapLightRamp(fieldR.x, fieldR.y).r;
    colLight.g = mapLightRamp(fieldG.x, fieldG.y).g;
    colLight.b = mapLightRamp(fieldB.x, fieldB.y).b;
    // Blend cleanly into pure airy editorial canvas where fluid energy is 0
    float lightPresence = smoothstep(0.02, 0.22, max(fieldG.x, max(fieldR.x, fieldB.x)));
    colLight = mix(lightCanvas, colLight, lightPresence);

    vec3 colDark;
    colDark.r = mapDarkRamp(fieldR.x, fieldR.y).r;
    colDark.g = mapDarkRamp(fieldG.x, fieldG.y).g;
    colDark.b = mapDarkRamp(fieldB.x, fieldB.y).b;
    float darkPresence = smoothstep(0.02, 0.22, max(fieldG.x, max(fieldR.x, fieldB.x)));
    colDark = mix(darkCanvas, colDark, darkPresence);

    // Physical Ribbed Glass Lighting (specular ridges + refraction edges / shadow grooves)
    // Specular ridge slightly offset from center to mimic overhead architectural studio light
    float ridgeHighlight = pow(max(0.0, 1.0 - abs(x + 0.34) * 2.2), 4.0);
    float rimGlint = pow(smoothstep(0.55, 0.96, abs(x)), 2.4);
    float valleyGroove = smoothstep(0.76, 1.0, abs(x));

    // Light mode glass finish: crisp white specular (up to 0.35) + delicate #E2E4F0 cool-gray refraction edges
    vec3 coolEdge = vec3(0.8863, 0.8941, 0.9412); // #E2E4F0
    float lightEdgeVisibility = mix(0.28, 0.52, lightPresence);
    colLight = mix(colLight, coolEdge, valleyGroove * lightEdgeVisibility * 0.48);
    colLight += vec3(1.0) * ridgeHighlight * mix(0.22, 0.35, lightPresence);
    colLight = clamp(colLight, 0.0, 1.0);

    // Dark mode glass finish: subtle dark shadow grooves between flutes + glossy specular rim highlights
    colDark *= (1.0 - valleyGroove * 0.42);
    vec3 darkRimTint = mix(vec3(0.5451, 0.3608, 0.9647), vec3(0.9294, 0.9137, 0.9961), 0.55);
    colDark += darkRimTint * ridgeHighlight * (0.065 + darkPresence * 0.18);
    colDark += vec3(0.78, 0.72, 1.0) * rimGlint * (0.025 + darkPresence * 0.09);

    // Smoothly interpolate themes via u_dark
    vec3 finalColor = mix(colLight, colDark, u_dark);

    // Subtle animated FilmGrain (0.024 in light mode, 0.035 in dark mode) to prevent banding
    float grainStrength = mix(0.024, 0.035, u_dark);
    float grain = hashGrain(gl_FragCoord.xy + vec2(fract(t * 17.3) * 100.0, fract(t * 29.1) * 100.0));
    finalColor += vec3(grain * grainStrength);

    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroShaderCanvas({ theme }: HeroShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeTargetRef = useRef<number>(theme === 'dark' ? 1 : 0);

  useEffect(() => {
    themeTargetRef.current = theme === 'dark' ? 1 : 0;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });

    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const darkLocation = gl.getUniformLocation(program, 'u_dark');
    const pointerLocation = gl.getUniformLocation(program, 'u_pointer');
    const pointerVelLocation = gl.getUniformLocation(program, 'u_pointerVel');
    const pointerActiveLocation = gl.getUniformLocation(program, 'u_pointerActive');

    const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = debugExt
      ? String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) ?? '')
      : '';
    const isSoftwareGl = /swiftshader|llvmpipe|software/i.test(rendererStr);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentDark = themeTargetRef.current;
    let isVisible = true;
    let rafId = 0;
    let lastNow = performance.now();
    let lastDraw = 0;
    const startTime = lastNow;

    // Smooth pointer momentum state
    const pointerTarget = { x: 0.74, y: 0.62 };
    const pointerSmooth = { x: 0.74, y: 0.62 };
    const pointerVel = { x: 0, y: 0 };
    let pointerActiveTarget = 0;
    let pointerActiveSmooth = 0;
    let idleTimeout = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const ny = Math.min(1, Math.max(0, 1 - (event.clientY - rect.top) / rect.height));
      pointerTarget.x = nx;
      pointerTarget.y = ny;
      pointerActiveTarget = 1;
      window.clearTimeout(idleTimeout);
      idleTimeout = window.setTimeout(() => {
        pointerActiveTarget = 0.25;
      }, 2400);
    };

    const handlePointerLeave = () => {
      pointerActiveTarget = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = isSoftwareGl ? 0.85 : Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const drawFrame = (now: number) => {
      resize();
      const dt = Math.min(0.08, Math.max(0.001, (now - lastNow) * 0.001));
      lastNow = now;

      // Smooth 0.45-0.55s exponential theme lerp without remounting WebGL
      const targetDark = themeTargetRef.current;
      if (reducedMotion) {
        currentDark = targetDark;
      } else {
        const themeAlpha = 1 - Math.exp(-dt * (isSoftwareGl ? 10 : 6.2));
        currentDark += (targetDark - currentDark) * themeAlpha;
        if (Math.abs(targetDark - currentDark) < 0.002) currentDark = targetDark;
      }

      // Pointer spring momentum
      const prevX = pointerSmooth.x;
      const prevY = pointerSmooth.y;
      const ptrAlpha = 1 - Math.exp(-dt * 4.8);
      pointerSmooth.x += (pointerTarget.x - pointerSmooth.x) * ptrAlpha;
      pointerSmooth.y += (pointerTarget.y - pointerSmooth.y) * ptrAlpha;

      const instVx = (pointerSmooth.x - prevX) / dt;
      const instVy = (pointerSmooth.y - prevY) / dt;
      const velAlpha = 1 - Math.exp(-dt * 6.0);
      pointerVel.x += (Math.max(-2.2, Math.min(2.2, instVx)) - pointerVel.x) * velAlpha;
      pointerVel.y += (Math.max(-2.2, Math.min(2.2, instVy)) - pointerVel.y) * velAlpha;

      pointerActiveSmooth +=
        (pointerActiveTarget - pointerActiveSmooth) * (1 - Math.exp(-dt * 3.0));

      const elapsed = reducedMotion ? 2.4 : (now - startTime) * 0.001;

      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(darkLocation, currentDark);
      gl.uniform2f(pointerLocation, pointerSmooth.x, pointerSmooth.y);
      gl.uniform2f(pointerVelLocation, pointerVel.x, pointerVel.y);
      gl.uniform1f(pointerActiveLocation, pointerActiveSmooth);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const minFrameInterval = isSoftwareGl ? 120 : 16;

    const tick = (now: number) => {
      const themeAnimating = Math.abs(themeTargetRef.current - currentDark) > 0.002;
      if (isVisible && (themeAnimating || now - lastDraw >= minFrameInterval)) {
        lastDraw = now;
        drawFrame(now);
      }
      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const handleResize = () => drawFrame(performance.now());
    window.addEventListener('resize', handleResize);

    // Render first frame immediately
    drawFrame(performance.now());
    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(tick);
    }

    // Ensure reduced-motion mode still updates cleanly on theme toggle
    const reducedMotionThemeTimer = reducedMotion
      ? window.setInterval(() => {
          if (Math.abs(themeTargetRef.current - currentDark) > 0.002) {
            drawFrame(performance.now());
          }
        }, 100)
      : 0;

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(idleTimeout);
      if (reducedMotionThemeTimer) window.clearInterval(reducedMotionThemeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div
      className="hero-fluted-fallback pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        data-testid="hero-shader-canvas"
        className="block h-full w-full"
      />
      {/* Delicate bottom edge blend into page background */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/30 to-transparent" />
    </div>
  );
}
