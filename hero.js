document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));

  if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let index = slides.findIndex((slide) => slide.classList.contains("active"));
  index = index >= 0 ? index : 0;

  window.setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 8200);
});
