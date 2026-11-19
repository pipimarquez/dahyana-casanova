const menu = document.querySelector("#site-menu");
const toggle = document.querySelector(".menu-toggle");

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".visually-hidden").textContent = open ? "Cerrar menú" : "Abrir menú";
  document.body.classList.toggle("menu-open", open);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

const play = document.querySelector(".play");
const reel = document.querySelector(".reel-frame");

if (play && reel) {
  play.addEventListener("click", () => {
    const playing = play.getAttribute("aria-pressed") === "true";
    play.setAttribute("aria-pressed", String(!playing));
    reel.classList.toggle("is-playing", !playing);
  });
}

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

const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const finePointer = window.matchMedia("(pointer: fine)").matches;

if (finePointer) {
  const cursor = document.createElement("div");
  cursor.className = "cursor-logo";
  cursor.setAttribute("aria-hidden", "true");
  const mark = document.createElement("img");
  mark.src = "assets/logo.png";
  mark.alt = "";
  cursor.append(mark);
  document.body.append(cursor);

  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let shown = false;
  const ease = motion ? 1 : 0.18;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!shown) {
        x = targetX;
        y = targetY;
        shown = true;
        cursor.style.opacity = "1";
      }
    },
    { passive: true }
  );

  function follow() {
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(follow);
  }

  follow();
}
