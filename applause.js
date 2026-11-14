/* Aplausos -> logo de 9punto5.
   Adaptado del sketch de "Infinite Patterns in the Digital Canvas" (JSNation):
   particulas que vagan con ruido; la energia del aplauso (microfono real o
   simulado) las atrae a puntos muestreados del SVG del logo. */
(() => {
  const canvas = document.getElementById("applauseCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const NIGHT = "30, 20, 36";
  const PALETTE = [
    [212, 137, 172],   // rosa
    [159, 211, 180],   // verde claro
    [247, 234, 211],   // crema estrella
    [230, 171, 195],   // rosa suave
  ];
  const MAX_PARTS = 1600;

  let W = 0, H = 0;
  let parts = [], targets = [], samplePts = [];
  let running = false, armed = false;
  let simulated = 0, smooth = 0;
  let audioCtx = null, analyser = null, micData = null;

  const meter = document.getElementById("apMeter");
  const status = document.getElementById("apStatus");
  const slide = canvas.closest(".slide");

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- muestreo del logo ---------- */

  function sampleFrom(imageData, w, h, step) {
    const pts = [];
    const d = imageData.data;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const a = d[(y * w + x) * 4 + 3];
        if (a > 110) pts.push({ x, y });
      }
    }
    for (let i = pts.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    return pts.slice(0, MAX_PARTS);
  }

  function sampleFallback() {
    const off = document.createElement("canvas");
    off.width = 800; off.height = 300;
    const c = off.getContext("2d");
    c.fillStyle = "#fff";
    c.font = "800 190px Poppins, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("9punto5", 400, 150);
    return sampleFrom(c.getImageData(0, 0, 800, 300), 800, 300, 3);
  }

  function mapPts() {
    const ow = 599.5, oh = 560.8;
    const scale = Math.min((W * 0.46) / ow, (H * 0.5) / oh);
    const cx = W / 2, cy = H * 0.6;
    targets = samplePts.map((pt) => ({
      x: cx + (pt.x - ow / 2) * scale,
      y: cy + (pt.y - oh / 2) * scale,
      col: pt.col,
    }));
    parts = targets.map((t) => ({
      x: rand(0, W), y: rand(0, H),
      hx: t.x, hy: t.y, col: t.col,
      vx: 0, vy: 0, s: rand(0, 1000),
    }));
  }

  function loadLogo() {
    const img = new Image();
    img.onload = () => {
      const ow = 599.5, oh = 560.8;
      const off = document.createElement("canvas");
      off.width = Math.round(ow); off.height = Math.round(oh);
      const c = off.getContext("2d");
      c.drawImage(img, 0, 0, ow, oh);
      let pts = sampleFrom(c.getImageData(0, 0, off.width, off.height), off.width, off.height, 2);
      if (pts.length < 400) pts = sampleFallback();
      pts.forEach((p) => { p.col = PALETTE[(Math.random() * PALETTE.length) | 0]; });
      samplePts = pts;
      mapPts();
    };
    img.onerror = () => {
      const pts = sampleFallback();
      pts.forEach((p) => { p.col = PALETTE[(Math.random() * PALETTE.length) | 0]; });
      samplePts = pts;
      mapPts();
    };
    img.src = "assets/9punto5-logo.svg";
  }

  /* ---------- energia (aplausos) ---------- */

  function micLevel() {
    if (!analyser) return 0;
    analyser.getByteTimeDomainData(micData);
    let sum = 0;
    for (let i = 0; i < micData.length; i += 4) sum += Math.abs(micData[i] - 128);
    return sum / (micData.length / 4) / 64;
  }

  function applaud() {
    simulated = 1;
    if (status) {
      status.textContent = analyser
        ? "Micrófono + aplausos simulados. Sigan aplaudiendo."
        : "Aplausos simulados dibujando el logo.";
    }
  }

  async function enableMic() {
    if (analyser) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      micData = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser);
      if (status) status.textContent = "Micrófono activo: el ruido de la sala dibuja el logo.";
      document.getElementById("apMic").textContent = "Micrófono activo";
    } catch (e) {
      if (status) status.textContent = "Micrófono no disponible. Usa Simular aplausos o toca la pantalla.";
    }
  }

  /* ---------- bucle ---------- */

  let frame = 0;

  function draw() {
    frame++;
    ctx.fillStyle = `rgba(${NIGHT}, 0.1)`;
    ctx.fillRect(0, 0, W, H);

    simulated *= 0.955;
    smooth = lerp(smooth, Math.max(micLevel() * 4, simulated), 0.12);
    const e = clamp(Math.max(smooth, armed ? 0.34 : 0), 0, 1);
    if (meter) meter.style.width = `${e * 100}%`;

    const k = 0.05 + e * 2.3;
    const wander = 1 - e;
    ctx.lineCap = "round";

    for (const pt of parts) {
      const a = Math.sin(pt.x * 0.008 + frame * 0.006 + pt.s) * 2.2 +
                Math.cos(pt.y * 0.007 - frame * 0.004);
      pt.vx += (pt.hx - pt.x) * 0.026 * k;
      pt.vy += (pt.hy - pt.y) * 0.026 * k;
      pt.vx *= 0.82;
      pt.vy *= 0.82;
      const ox = pt.x, oy = pt.y;
      pt.x += pt.vx + Math.cos(a) * 1.5 * wander;
      pt.y += pt.vy + Math.sin(a) * 1.5 * wander;
      ctx.strokeStyle = `rgba(${pt.col[0]}, ${pt.col[1]}, ${pt.col[2]}, ${0.22 + e * 0.68})`;
      ctx.lineWidth = 0.7 + e * 1.7;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }

    if (e > 0.15) {
      ctx.strokeStyle = `rgba(247, 234, 211, ${e * 0.10})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.6, 170 + e * 240, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function loop() {
    if (running && slide.classList.contains("is-visible")) draw();
    requestAnimationFrame(loop);
  }

  function resize() {
    W = canvas.width = canvas.clientWidth;
    H = canvas.height = canvas.clientHeight;
    ctx.fillStyle = `rgb(${NIGHT})`;
    ctx.fillRect(0, 0, W, H);
    if (samplePts.length) mapPts();
  }

  /* ---------- arranque ---------- */

  document.getElementById("apMic").addEventListener("click", (e) => { e.stopPropagation(); enableMic(); });
  document.getElementById("apSim").addEventListener("click", (e) => { e.stopPropagation(); applaud(); });
  slide.addEventListener("pointerdown", (e) => {
    if (!e.target.closest("button")) applaud();
  });

  new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      running = true;
      if (!armed) {
        armed = true;
        setTimeout(applaud, 350);
        setTimeout(applaud, 900);
        setTimeout(applaud, 1500);
      }
    });
  }, { root: document.getElementById("story"), threshold: 0.4 }).observe(slide);

  window.addEventListener("resize", resize);
  resize();
  loadLogo();
  loop();
})();
