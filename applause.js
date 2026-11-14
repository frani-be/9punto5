/* Aplausos -> logo 9punto5 (p5.js + p5.sound).
   Adaptado del sketch de "Infinite Patterns in the Digital Canvas" (JSNation):
   las particulas vagan con ruido; la energia del aplauso (microfono real o
   simulado) las atrae a puntos muestreados del SVG del logo. */
(() => {
  const host = document.getElementById("applauseArt");
  if (!host || typeof p5 === "undefined") return;

  const slide = host.closest(".slide");
  const meter = document.getElementById("apMeter");
  const status = document.getElementById("apStatus");

  const NIGHT = [30, 20, 36];
  const PALETTE = [
    [212, 137, 172],
    [159, 211, 180],
    [247, 234, 211],
    [230, 171, 195],
  ];
  const MAX_PARTS = 2000;

  let parts = [], targets = [], samplePts = [];
  let mic = null, ready = false, started = false;
  let simulated = 0, smoothLevel = 0, armed = false;

  new p5((p) => {
    /* ---------- muestreo del logo ---------- */

    const sampleFrom = (ctx2, w, h, step) => {
      const pts = [];
      const d = ctx2.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (d[(y * w + x) * 4 + 3] > 110) pts.push({ x, y });
        }
      }
      for (let i = pts.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      return pts.slice(0, MAX_PARTS);
    };

    const sampleFallback = () => {
      const off = document.createElement("canvas");
      off.width = 800; off.height = 300;
      const c = off.getContext("2d");
      c.fillStyle = "#fff";
      c.font = "800 190px Poppins, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("9punto5", 400, 150);
      return sampleFrom(c, 800, 300, 2);
    };

    /* el logo existe solo como hogares de particulas, nunca como imagen */
    const mapPts = () => {
      const ow = 599.5, oh = 560.8;
      const scale = Math.min((p.width * 0.62) / ow, (p.height * 0.62) / oh);
      const cx = p.width / 2, cy = p.height * 0.58;
      targets = samplePts.map((pt) => ({
        x: cx + (pt.x - ow / 2) * scale,
        y: cy + (pt.y - oh / 2) * scale,
        col: pt.col,
      }));
      parts = targets.map((t) => ({
        x: p.random(p.width), y: p.random(p.height),
        hx: t.x, hy: t.y, col: t.col, vx: 0, vy: 0,
      }));
    };

    const loadLogo = () => {
      const img = new Image();
      img.onload = () => {
        const ow = 599.5, oh = 560.8;
        const off = document.createElement("canvas");
        off.width = Math.round(ow); off.height = Math.round(oh);
        const c = off.getContext("2d");
        c.drawImage(img, 0, 0, ow, oh);
        let pts = sampleFrom(c, off.width, off.height, 2);
        if (pts.length < 400) pts = sampleFallback();
        pts.forEach((pt) => { pt.col = PALETTE[(Math.random() * PALETTE.length) | 0]; });
        samplePts = pts;
        mapPts();
      };
      img.onerror = () => {
        const pts = sampleFallback();
        pts.forEach((pt) => { pt.col = PALETTE[(Math.random() * PALETTE.length) | 0]; });
        samplePts = pts;
        mapPts();
      };
      img.src = "assets/9punto5-logo.svg";
    };

    /* ---------- aplauso ---------- */

    const applaud = () => {
      simulated = 1;
      if (status) {
        status.textContent = ready
          ? "Micrófono + aplausos simulados. Sigan aplaudiendo."
          : "Aplausos simulados dibujando el logo.";
      }
    };

    const enableMic = async () => {
      if (started) return;
      started = true;
      try {
        await p.userStartAudio();
        mic = new p5.AudioIn();
        mic.start(() => {
          ready = true;
          if (status) status.textContent = "Micrófono activo: el ruido de la sala dibuja el logo.";
          document.getElementById("apMic").textContent = "Micrófono activo";
        }, () => {
          started = false;
          if (status) status.textContent = "Micrófono no disponible. Usa Simular aplausos o toca la lámina.";
        });
      } catch (err) {
        started = false;
        if (status) status.textContent = "Micrófono no disponible. Simular aplausos funciona sin audio.";
      }
    };

    /* ---------- p5 ---------- */

    p.setup = () => {
      p.createCanvas(host.clientWidth, host.clientHeight);
      p.pixelDensity(1);
      p.background(NIGHT[0], NIGHT[1], NIGHT[2]);
      samplePts = [{ x: 300, y: 280, col: PALETTE[0] }];
      mapPts();
      loadLogo();
      p.noLoop();
    };

    p.draw = () => {
      p.background(NIGHT[0], NIGHT[1], NIGHT[2], 9);
      let raw = 0;
      if (ready && mic) { try { raw = mic.getLevel(); } catch (e) { raw = 0; } }
      simulated *= 0.965;
      smoothLevel = p.lerp(smoothLevel, Math.max(raw * 5, simulated), 0.12);
      const e = Math.max(p.constrain(smoothLevel, 0, 1), armed ? 0.12 : 0);
      if (meter) meter.style.width = `${e * 100}%`;

      /* mientras mas fuerte el aplauso, mas firme el logo; sin aplauso vagabunden libres y lejos */
      const k = 0.05 + e * 2.8;
      const wander = 1 - e;
      for (const pt of parts) {
        const na = p.noise(pt.x * 0.002, pt.y * 0.002, p.frameCount * 0.0008) * p.TAU * 3;
        pt.vx += (pt.hx - pt.x) * 0.028 * k;
        pt.vy += (pt.hy - pt.y) * 0.028 * k;
        pt.vx *= 0.82;
        pt.vy *= 0.82;
        const ox = pt.x, oy = pt.y;
        pt.x += pt.vx + Math.cos(na) * 3.2 * wander;
        pt.y += pt.vy + Math.sin(na) * 3.2 * wander;
        p.stroke(pt.col[0], pt.col[1], pt.col[2], 22 + e * 78);
        p.strokeWeight(0.7 + e * 1.9);
        p.line(ox, oy, pt.x, pt.y);
      }
      if (e > 0.15) {
        p.noFill();
        p.stroke(247, 234, 211, e * 16);
        p.strokeWeight(1);
        p.circle(p.width / 2, p.height * 0.58, 190 + e * 280);
        p.stroke(255, 255, 255, e * 8);
        p.circle(p.width / 2, p.height * 0.58, 215 + e * 320);
      }
    };

    p.windowResized = () => {
      if (host.clientWidth > 0) {
        p.resizeCanvas(host.clientWidth, host.clientHeight);
        mapPts();
      }
    };

    /* ---------- UI ---------- */

    document.getElementById("apMic").addEventListener("click", (e) => { e.stopPropagation(); enableMic(); });
    document.getElementById("apSim").addEventListener("click", (e) => { e.stopPropagation(); applaud(); });
    slide.addEventListener("pointerdown", (e) => {
      if (!e.target.closest("button")) applaud();
    });

    /* corre solo cuando la lamina esta visible; primera visita dispara aplausos */
    new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          p.loop();
          if (!armed) {
            armed = true;
            setTimeout(applaud, 1400);
            setTimeout(applaud, 2400);
            setTimeout(applaud, 3400);
          }
        } else {
          p.noLoop();
        }
      });
    }, { root: document.getElementById("story"), threshold: 0.4 }).observe(slide);
  }, host);
})();
