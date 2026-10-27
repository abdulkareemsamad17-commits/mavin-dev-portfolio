const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    }
  });
}

const testimonialCarousel = document.querySelector(".testimonial-carousel");

if (testimonialCarousel) {
  const track = testimonialCarousel.querySelector(".testimonial-track");
  const slides = [...testimonialCarousel.querySelectorAll(".testimonial-card")];
  const previousButton = testimonialCarousel.querySelector(".testimonial-previous");
  const nextButton = testimonialCarousel.querySelector(".testimonial-next");
  const rotationButton = testimonialCarousel.querySelector(".testimonial-rotation");
  const dots = [...testimonialCarousel.querySelectorAll(".testimonial-dot")];
  const status = testimonialCarousel.querySelector(".testimonial-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;
  let rotationPaused = reducedMotion.matches;
  let rotationTimer;
  let temporarilyPaused = false;

  const showSlide = (index, announce = false) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      const isCurrent = slideIndex === currentIndex;
      slide.setAttribute("aria-hidden", String(!isCurrent));
      if ("inert" in slide) {
        slide.inert = !isCurrent;
      }
    });

    dots.forEach((dot, dotIndex) => {
      if (dotIndex === currentIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (announce) {
      status.textContent = `Review ${currentIndex + 1} of ${slides.length}.`;
    }
  };

  const stopRotation = () => {
    window.clearInterval(rotationTimer);
    rotationTimer = undefined;
  };

  const startRotation = () => {
    stopRotation();
    if (!rotationPaused && !temporarilyPaused && !document.hidden) {
      rotationTimer = window.setInterval(() => showSlide(currentIndex + 1), 6000);
    }
  };

  const setRotationPaused = (paused) => {
    rotationPaused = paused;
    rotationButton.textContent = paused ? "Play" : "Pause";
    rotationButton.setAttribute(
      "aria-label",
      paused ? "Start automatic review rotation" : "Pause automatic review rotation",
    );
    if (paused) {
      stopRotation();
    } else {
      startRotation();
    }
  };

  previousButton.addEventListener("click", () => {
    showSlide(currentIndex - 1, true);
    startRotation();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1, true);
    startRotation();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index, true);
      startRotation();
    });
  });

  rotationButton.addEventListener("click", () => {
    if (rotationPaused) {
      temporarilyPaused = false;
    }
    setRotationPaused(!rotationPaused);
  });

  testimonialCarousel.addEventListener("pointerenter", () => {
    temporarilyPaused = true;
    stopRotation();
  });

  testimonialCarousel.addEventListener("pointerleave", () => {
    temporarilyPaused = false;
    startRotation();
  });

  testimonialCarousel.addEventListener("focusin", () => {
    temporarilyPaused = true;
    stopRotation();
  });

  testimonialCarousel.addEventListener("focusout", (event) => {
    if (!testimonialCarousel.contains(event.relatedTarget)) {
      temporarilyPaused = false;
      startRotation();
    }
  });

  document.addEventListener("visibilitychange", startRotation);
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      setRotationPaused(true);
    }
  });

  showSlide(0);
  setRotationPaused(rotationPaused);
  startRotation();
}
