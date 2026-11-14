const slides = [...document.querySelectorAll(".slide")];
const story = document.getElementById("story");
const barFill = document.getElementById("barFill");
const counterCurrent = document.getElementById("counterCurrent");

document.getElementById("counterTotal").textContent = String(slides.length).padStart(2, "0");

/* ---------- Assets: carga foto/video si existe, placeholder si no ---------- */

function loadAsset(slot) {
  const src = slot.dataset.src;
  if (slot.dataset.type === "video") {
    const v = document.createElement("video");
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.controls = true;
    v.preload = "metadata";
    v.src = src;
    v.addEventListener("loadeddata", () => {
      slot.classList.add("asset--loaded");
      slot.prepend(v);
    });
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

/* ---------- Reveal + progreso ---------- */

let current = 0;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = slides.indexOf(e.target);
      e.target.classList.add("is-visible");
      current = i;
      counterCurrent.textContent = String(i + 1).padStart(2, "0");
      barFill.style.height = `${((i + 1) / slides.length) * 100}%`;
    });
  },
  { root: story, threshold: 0.55 }
);

slides.forEach((slide) => {
  slide.querySelectorAll(".asset").forEach(loadAsset);
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
