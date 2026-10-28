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
  const dots = [...testimonialCarousel.querySelectorAll(".testimonial-dot")];
  const status = testimonialCarousel.querySelector(".testimonial-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;
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
    if (!reducedMotion.matches && !temporarilyPaused && !document.hidden) {
      rotationTimer = window.setInterval(() => showSlide(currentIndex + 1), 6000);
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
      stopRotation();
    } else {
      startRotation();
    }
  });

  showSlide(0);
  startRotation();
}

const auditForm = document.querySelector("#audit-form");

if (auditForm) {
  const auditStatus = auditForm.querySelector("#audit-status");
  const submitButton = auditForm.querySelector("#audit-submit");
  const originalButtonText = submitButton.textContent;
  const accessKeyInput = auditForm.elements.namedItem("access_key");
  const auditFields = [
    {
      input: auditForm.querySelector("#audit-name"),
      error: auditForm.querySelector("#audit-name-error"),
      requiredMessage: "Please enter your full name.",
      invalidMessage: "Please check your full name.",
      required: true,
    },
    {
      input: auditForm.querySelector("#audit-email"),
      error: auditForm.querySelector("#audit-email-error"),
      requiredMessage: "Please enter your email address.",
      invalidMessage: "Please enter a valid email address.",
      required: true,
    },
    {
      input: auditForm.querySelector("#audit-url"),
      error: auditForm.querySelector("#audit-url-error"),
      invalidMessage: "Please enter a valid store URL starting with https://.",
      required: false,
    },
    {
      input: auditForm.querySelector("#audit-message"),
      error: auditForm.querySelector("#audit-message-error"),
      requiredMessage: "Please enter a message.",
      invalidMessage: "Please check your message.",
      required: true,
    },
  ];
  let isSubmitting = false;

  const setFieldError = (field, message = "") => {
    field.error.textContent = message;
    if (message) {
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.input.removeAttribute("aria-invalid");
    }
  };

  const validateField = (field) => {
    const value = field.input.value.trim();
    let message = "";

    if (field.required && !value) {
      message = field.requiredMessage;
    } else if (value && !field.input.checkValidity()) {
      message = field.invalidMessage;
    } else if (field.input.type === "url" && value) {
      try {
        const parsedUrl = new URL(value);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          message = field.invalidMessage;
        }
      } catch {
        message = field.invalidMessage;
      }
    }

    setFieldError(field, message);
    return !message;
  };

  const setStatus = (message, state) => {
    auditStatus.textContent = message;
    auditStatus.dataset.state = state;
  };

  auditFields.forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.hasAttribute("aria-invalid")) {
        validateField(field);
      }
    });
  });

  auditForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setStatus("", "");
    const isValid = auditFields.map(validateField).every(Boolean);
    if (!isValid) {
      setStatus("Please check the highlighted fields and try again.", "error");
      auditFields.find((field) => field.input.getAttribute("aria-invalid") === "true")
        ?.input.focus();
      return;
    }

    const accessKey = accessKeyInput.value.trim();
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      setStatus("This form is not configured yet. Please try again later.", "error");
      return;
    }

    for (const field of auditFields) {
      field.input.value = field.input.value.trim();
    }

    const formData = new FormData(auditForm);
    const improvements = formData.getAll("improvements[]");
    formData.delete("improvements[]");
    formData.set("improvements", improvements.length ? improvements.join(", ") : "Not specified");

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setStatus("Sending your message...", "");

    try {
      const response = await fetch(auditForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        setStatus("The contact service returned an unexpected response. Please try again.", "error");
        return;
      }

      if (!result || typeof result !== "object") {
        setStatus("The contact service returned an unexpected response. Please try again.", "error");
        return;
      }

      if (!response.ok || result.success !== true) {
        const serviceMessage = typeof result.message === "string"
          ? result.message
          : result.body && typeof result.body.message === "string"
            ? result.body.message
            : "";
        setStatus(
          serviceMessage
            ? serviceMessage
            : "Your message could not be sent. Please try again.",
          "error",
        );
        return;
      }

      auditForm.reset();
      auditFields.forEach((field) => setFieldError(field));
      setStatus(
        "Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon.",
        "success",
      );
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("A connection problem prevented your message from sending. Please try again.", "error");
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
