const slides = [...document.querySelectorAll(".slide")];
const story = document.getElementById("story");
const barFill = document.getElementById("barFill");
const counterCurrent = document.getElementById("counterCurrent");

document.getElementById("counterTotal").textContent = String(slides.length).padStart(2, "0");

/* ---------- Decoración: ondas suaves en slides oscuras ---------- */

const WAVE_PATHS = [
  "M0,660 C220,590 420,700 720,640 C1020,580 1220,680 1440,620 L1440,900 L0,900 Z",
  "M0,760 C280,710 520,790 840,750 C1120,716 1300,780 1440,740 L1440,900 L0,900 Z",
];

function buildWaves(slide) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 1440 900");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("waves");
  WAVE_PATHS.forEach((d, i) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", ["rgba(212,137,172,0.14)", "rgba(95,150,120,0.10)"][i]);
    svg.appendChild(p);
  });
  slide.prepend(svg);
}

/* ---------- Sparkles mínimos ---------- */

const SPARKLE_PATH = "M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z";

function sparkleColor(slide) {
  if (slide.classList.contains("slide--dark")) return "rgba(255,250,247,0.8)";
  if (slide.classList.contains("slide--blush")) return "rgba(212,137,172,0.55)";
  if (slide.classList.contains("slide--sage")) return "rgba(95,150,120,0.5)";
  return "rgba(162,91,130,0.4)";
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildSparkles(slide, index) {
  const count = slide.dataset.decor !== undefined ? 14 : parseInt(slide.dataset.sparkles || "0", 10);
  if (!count) return;
  const rand = seededRandom(index * 137 + 42);
  for (let i = 0; i < count; i++) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList.add("sparkle");
    const size = 5 + rand() * 13;
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
    svg.style.left = `${4 + rand() * 92}%`;
    svg.style.top = `${4 + rand() * 88}%`;
    svg.style.animationDelay = `${rand() * 3.6}s`;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", SPARKLE_PATH);
    p.setAttribute("fill", sparkleColor(slide));
    svg.appendChild(p);
    slide.appendChild(svg);
  }
}

/* ---------- Reveal + progreso ---------- */

let current = 0;
const logo = document.getElementById("siteLogo");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = slides.indexOf(e.target);
      e.target.classList.add("is-visible");
      current = i;
      counterCurrent.textContent = String(i + 1).padStart(2, "0");
      barFill.style.height = `${((i + 1) / slides.length) * 100}%`;
      if (logo) logo.classList.toggle("logo--on-dark", e.target.classList.contains("slide--dark"));
    });
  },
  { root: story, threshold: 0.55 }
);

slides.forEach((slide, i) => {
  if (slide.dataset.decor !== undefined) buildWaves(slide);
  buildSparkles(slide, i);
  observer.observe(slide);
});

/* ---------- Teclado ---------- */

document.addEventListener("keydown", (e) => {
  const dir = { ArrowDown: 1, ArrowRight: 1, PageDown: 1, " ": 1, ArrowUp: -1, ArrowLeft: -1, PageUp: -1 }[e.key];
  if (!dir || e.target.matches("input, textarea, video")) return;
  e.preventDefault();
  const target = Math.min(Math.max(current + dir, 0), slides.length - 1);
  slides[target].scrollIntoView({ behavior: "smooth" });
});
