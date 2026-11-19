const menu = document.querySelector("#site-menu");
const toggle = document.querySelector(".menu-toggle");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".visually-hidden").textContent = open ? "Cerrar menú" : "Abrir menú";
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

const play = document.querySelector(".play");
const reel = document.querySelector(".reel-frame");

play.addEventListener("click", () => {
  const playing = play.getAttribute("aria-pressed") === "true";
  play.setAttribute("aria-pressed", String(!playing));
  reel.classList.toggle("is-playing", !playing);
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((node) => observer.observe(node));

const watermark = document.querySelector(".watermark");
const works = document.querySelector(".works");

function moveWatermark() {
  const rect = works.getBoundingClientRect();
  const view = window.innerHeight;
  const progress = (view - rect.top) / (view + rect.height);
  const shift = (progress - 0.35) * -180;
  watermark.style.transform = `translate(-50%, ${shift}px)`;
}

const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!motion) {
  moveWatermark();
  window.addEventListener("scroll", moveWatermark, { passive: true });
}

const photos = document.querySelectorAll(".split-photo img, .portrait img");

function parallax() {
  photos.forEach((image) => {
    const rect = image.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const offset = Math.max(-40, Math.min(40, center * -0.06));
    image.style.translate = `0 ${offset}px`;
  });
}

if (!motion) {
  parallax();
  window.addEventListener("scroll", parallax, { passive: true });
}
