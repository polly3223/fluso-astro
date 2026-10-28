(() => {
  const button = document.querySelector(".nav-menu-button");
  const menu = document.querySelector(".mobile-menu");
  const backdrop = document.querySelector(".nav-backdrop");
  const closeTargets = document.querySelectorAll("[data-nav-close]");

  if (!button || !menu || !backdrop) return;

  let closeTimer;

  const setHidden = (hidden) => {
    menu.hidden = hidden;
    backdrop.hidden = hidden;
  };

  const openMenu = () => {
    window.clearTimeout(closeTimer);
    setHidden(false);
    button.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      document.body.classList.add("nav-open");
    });
  };

  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    button.setAttribute("aria-expanded", "false");
    closeTimer = window.setTimeout(() => setHidden(true), 160);
  };

  button.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeTargets.forEach((target) => {
    target.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMenu();
      button.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && document.body.classList.contains("nav-open")) {
      closeMenu();
    }
  });
})();
