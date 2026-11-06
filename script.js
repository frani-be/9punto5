const slides = [...document.querySelectorAll(".slide")];
const story = document.getElementById("story");

/* ---------- Ondas por tema ---------- */

const WAVE_PATHS = [
  "M0,620 C220,540 380,660 720,600 C1060,540 1200,660 1440,580 L1440,900 L0,900 Z",
  "M0,700 C260,640 480,740 760,680 C1040,620 1240,720 1440,660 L1440,900 L0,900 Z",
  "M0,780 C300,730 560,810 860,760 C1120,720 1300,790 1440,750 L1440,900 L0,900 Z",
  "M0,120 C280,60 560,140 860,90 C1120,50 1300,110 1440,70 L1440,0 L0,0 Z",
];

const WAVE_COLORS = {
  night: ["rgba(230,171,195,0.35)", "rgba(176,106,146,0.45)", "rgba(60,37,69,0.55)", "rgba(247,234,211,0.10)"],
  pink: ["rgba(253,241,234,0.35)", "rgba(212,137,172,0.4)", "rgba(143,79,119,0.35)", "rgba(253,241,234,0.45)"],
  cream: ["rgba(242,205,217,0.6)", "rgba(230,171,195,0.5)", "rgba(176,106,146,0.28)", "rgba(242,205,217,0.5)"],
};

function buildWaves(slide) {
  const theme = slide.dataset.waves || "night";
  const colors = WAVE_COLORS[theme];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 1440 900");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("waves");
  WAVE_PATHS.forEach((d, i) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", colors[i]);
    svg.appendChild(p);
  });
  slide.prepend(svg);
}

/* ---------- Sparkles ---------- */

const SPARKLE_PATH = "M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z";

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildSparkles(slide, index) {
  const count = parseInt(slide.dataset.sparkles || "0", 10);
  const rand = seededRandom(index * 137 + 42);
  for (let i = 0; i < count; i++) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList.add("sparkle");
    const size = 6 + rand() * 16;
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
    svg.style.left = `${4 + rand() * 92}%`;
    svg.style.top = `${4 + rand() * 88}%`;
    svg.style.animationDelay = `${rand() * 3.6}s`;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", SPARKLE_PATH);
    p.setAttribute("fill", slide.dataset.waves === "night" ? "rgba(247,234,211,0.85)" : "rgba(255,250,247,0.8)");
    svg.appendChild(p);
    slide.appendChild(svg);
  }
}

/* ---------- Assets: carga foto/video si existe, placeholder si no ---------- */

function loadAsset(slot) {
  const src = slot.dataset.src;
  const isVideo = slot.dataset.type === "video";
  if (isVideo) {
    const v = document.createElement("video");
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.controls = true;
    v.preload = "metadata";
    v.src = src;
    v.addEventListener("loadeddata", () => slot.classList.add("asset--loaded") || slot.prepend(v));
    v.addEventListener("error", () => v.remove());
    return;
  }
  const img = new Image();
  img.alt = slot.dataset.label || "";
  img.onload = () => {
    slot.classList.add("asset--loaded");
    slot.prepend(img);
  };
  img.src = src;
}

/* ---------- Nav: dots, contador, teclado ---------- */

const progress = document.querySelector(".progress");
const counterCurrent = document.getElementById("counterCurrent");
document.getElementById("counterTotal").textContent = String(slides.length).padStart(2, "0");

const dots = slides.map((slide, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-label", `Ir a la sección ${i + 1}`);
  b.addEventListener("click", () => slide.scrollIntoView({ behavior: "smooth" }));
  progress.appendChild(b);
  return b;
});

let current = 0;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      const i = slides.indexOf(e.target);
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        current = i;
        dots.forEach((d, j) => d.classList.toggle("active", j === i));
        counterCurrent.textContent = String(i + 1).padStart(2, "0");
      }
    });
  },
  { root: story, threshold: 0.55 }
);

slides.forEach((slide, i) => {
  buildWaves(slide);
  buildSparkles(slide, i);
  slide.querySelectorAll(".asset").forEach(loadAsset);
  observer.observe(slide);
});

document.addEventListener("keydown", (e) => {
  const next = { ArrowDown: 1, ArrowRight: 1, PageDown: 1, " ": 1, ArrowUp: -1, ArrowLeft: -1, PageUp: -1 }[e.key];
  if (!next || e.target.matches("input, textarea, video")) return;
  e.preventDefault();
  const target = Math.min(Math.max(current + next, 0), slides.length - 1);
  slides[target].scrollIntoView({ behavior: "smooth" });
});
