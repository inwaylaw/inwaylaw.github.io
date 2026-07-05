const nav = document.querySelector(".site-nav");
const menuButton = document.querySelector(".menu-button");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

const contactDialog = document.querySelector("#contact-dialog");
const contactOpenButton = document.querySelector("[data-contact-open]");
const contactCloseButtons = [...document.querySelectorAll("[data-contact-close]")];
let contactReturnFocus = null;

function closeContactDialog() {
  if (!contactDialog) return;

  if (contactDialog.open) {
    contactDialog.close();
  } else {
    contactDialog.removeAttribute("open");
  }
}

if (contactDialog && contactOpenButton) {
  contactOpenButton.addEventListener("click", () => {
    contactReturnFocus = document.activeElement;

    if (typeof contactDialog.showModal === "function") {
      contactDialog.showModal();
    } else {
      contactDialog.setAttribute("open", "");
    }

    const closeButton = contactDialog.querySelector("[data-contact-close]");
    closeButton?.focus({ preventScroll: true });
  });

  contactCloseButtons.forEach((button) => {
    button.addEventListener("click", closeContactDialog);
  });

  contactDialog.addEventListener("click", (event) => {
    if (event.target === contactDialog) {
      closeContactDialog();
    }
  });

  contactDialog.addEventListener("close", () => {
    if (contactReturnFocus instanceof HTMLElement) {
      contactReturnFocus.focus({ preventScroll: true });
    }
  });
}

const revealItems = [...document.querySelectorAll("[data-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionVideos = [...document.querySelectorAll("[data-motion-video]")];

if (reducedMotion) {
  motionVideos.forEach((video) => {
    video.removeAttribute("autoplay");
    video.pause();

    if (video.readyState >= 1) {
      video.currentTime = 0;
    } else {
      video.addEventListener(
        "loadedmetadata",
        () => {
          video.currentTime = 0;
        },
        { once: true }
      );
    }
  });
} else {
  motionVideos.forEach((video) => {
    video.muted = true;

    const playVideo = () => {
      const playRequest = video.play();

      if (playRequest) {
        playRequest.catch(() => {});
      }
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
    }
  });
}

if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const canvas = document.querySelector(".signal-canvas");
const ctx = canvas?.getContext("2d", { alpha: true });
const brushPalette = [
  { rgb: [217, 154, 61], alpha: 0.16 },
  { rgb: [240, 199, 117], alpha: 0.12 },
  { rgb: [199, 125, 107], alpha: 0.1 },
  { rgb: [159, 198, 189], alpha: 0.13 },
  { rgb: [66, 107, 82], alpha: 0.09 }
];
let brushStrokes = [];
let vortices = [];
let frame = 0;
let animationId = 0;
let pointer = { x: 0.5, y: 0.5 };

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  vortices = [
    { x: width * 0.18, y: height * 0.28, pull: 0.72, phase: 0.2 },
    { x: width * 0.58, y: height * 0.18, pull: -0.5, phase: 1.4 },
    { x: width * 0.82, y: height * 0.68, pull: 0.46, phase: 2.6 }
  ];

  const density = width < 680 ? 10500 : 7600;
  const count = Math.max(72, Math.min(190, Math.floor((width * height) / density)));
  brushStrokes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    length: 34 + Math.random() * 118,
    width: 0.7 + Math.random() * 2.1,
    phase: Math.random() * Math.PI * 2,
    speed: 0.0009 + Math.random() * 0.0018,
    drift: 0.06 + Math.random() * 0.18,
    palette: brushPalette[index % brushPalette.length]
  }));
}

function wrapStroke(stroke) {
  const margin = 120;
  if (stroke.x < -margin) stroke.x = window.innerWidth + margin;
  if (stroke.x > window.innerWidth + margin) stroke.x = -margin;
  if (stroke.y < -margin) stroke.y = window.innerHeight + margin;
  if (stroke.y > window.innerHeight + margin) stroke.y = -margin;
}

function fieldAngle(x, y, time, phase) {
  let vx = 0.42;
  let vy = -0.08;

  vortices.forEach((vortex) => {
    const dx = x - vortex.x;
    const dy = y - vortex.y;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const reach = Math.max(window.innerWidth, window.innerHeight) * 0.82;
    const influence = Math.max(0, 1 - distance / reach) * vortex.pull;
    const pulse = 1 + Math.sin(time * 0.0012 + vortex.phase + phase) * 0.16;

    vx += (-dy / distance) * influence * pulse;
    vy += (dx / distance) * influence * pulse;
  });

  const pointerX = pointer.x * window.innerWidth;
  const pointerY = pointer.y * window.innerHeight;
  const pointerDistance = Math.max(Math.hypot(x - pointerX, y - pointerY), 1);
  const pointerInfluence = Math.max(0, 1 - pointerDistance / 420) * 0.18;
  vx += (pointerY - y) / pointerDistance * pointerInfluence;
  vy += (x - pointerX) / pointerDistance * pointerInfluence;

  return Math.atan2(vy, vx);
}

function drawVortexWhispers(time) {
  vortices.forEach((vortex, index) => {
    const palette = brushPalette[(index + 1) % brushPalette.length];
    const [red, green, blue] = palette.rgb;
    const rings = window.innerWidth < 680 ? 3 : 5;

    for (let ring = 0; ring < rings; ring += 1) {
      const radius = 56 + ring * 44 + Math.sin(time * 0.0009 + ring + vortex.phase) * 7;
      const start = time * 0.00016 * (index % 2 === 0 ? 1 : -1) + vortex.phase + ring * 0.52;
      const sweep = 1.15 + ring * 0.14;

      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineWidth = 0.8 + ring * 0.16;
      ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${0.04 + ring * 0.006})`;
      ctx.arc(vortex.x, vortex.y, radius, start, start + sweep);
      ctx.stroke();
    }
  });
}

function drawBrushField(time = 0) {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawVortexWhispers(time);

  brushStrokes.forEach((stroke) => {
    const angle = fieldAngle(stroke.x, stroke.y, time, stroke.phase);
    const breathing = Math.sin(time * stroke.speed + stroke.phase);
    const length = stroke.length * (0.86 + breathing * 0.08);
    const half = length / 2;
    const curve = Math.sin(stroke.phase + frame * 0.006) * length * 0.18;
    const [red, green, blue] = stroke.palette.rgb;

    if (!reducedMotion) {
      stroke.x += Math.cos(angle) * stroke.drift + Math.sin(time * 0.0008 + stroke.phase) * 0.05;
      stroke.y += Math.sin(angle) * stroke.drift * 0.72 + Math.cos(time * 0.0007 + stroke.phase) * 0.035;
      wrapStroke(stroke);
    }

    const startX = stroke.x - Math.cos(angle) * half;
    const startY = stroke.y - Math.sin(angle) * half;
    const endX = stroke.x + Math.cos(angle) * half;
    const endY = stroke.y + Math.sin(angle) * half;
    const controlX = stroke.x + Math.cos(angle + Math.PI / 2) * curve;
    const controlY = stroke.y + Math.sin(angle + Math.PI / 2) * curve;

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = stroke.width;
    ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${stroke.palette.alpha})`;
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = Math.max(0.4, stroke.width * 0.42);
    ctx.strokeStyle = `rgba(255, 250, 226, ${stroke.palette.alpha * 0.38})`;
    ctx.moveTo(startX + 2, startY + 1);
    ctx.quadraticCurveTo(controlX, controlY, endX - 1, endY - 2);
    ctx.stroke();
  });

  frame += 1;

  if (!reducedMotion) {
    animationId = window.requestAnimationFrame(drawBrushField);
  }
}

if (canvas && ctx) {
  resizeCanvas();
  drawBrushField();

  window.addEventListener(
    "resize",
    () => {
      resizeCanvas();
      if (reducedMotion) {
        drawBrushField();
      }
    },
    { passive: true }
  );
  window.addEventListener(
    "pointermove",
    (event) => {
      pointer = {
        x: event.clientX / Math.max(window.innerWidth, 1),
        y: event.clientY / Math.max(window.innerHeight, 1)
      };
    },
    { passive: true }
  );
}

window.addEventListener("beforeunload", () => {
  if (animationId) {
    window.cancelAnimationFrame(animationId);
  }
});
