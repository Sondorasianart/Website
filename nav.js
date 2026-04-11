document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const mobileQuery = window.matchMedia("(max-width: 900px)");

  if (!header || !button || !nav) {
    return;
  }

  const setMenuState = (open) => {
    header.classList.toggle("nav-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");

    if (mobileQuery.matches) {
      nav.hidden = !open;
    } else {
      nav.hidden = false;
    }
  };

  const syncMenuMode = () => {
    if (mobileQuery.matches) {
      setMenuState(false);
    } else {
      header.classList.remove("nav-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
      nav.hidden = false;
    }
  };

  button.addEventListener("click", () => {
    const nextOpen = button.getAttribute("aria-expanded") !== "true";
    setMenuState(nextOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileQuery.matches) {
        setMenuState(false);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileQuery.matches) {
      setMenuState(false);
    }
  });

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", syncMenuMode);
  } else {
    mobileQuery.addListener(syncMenuMode);
  }

  syncMenuMode();
});
