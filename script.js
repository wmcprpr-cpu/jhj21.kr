async function loadPartial(targetId, filePath) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(filePath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${filePath} load failed: ${response.status}`);
    }

    const html = await response.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function normalizePath(pathname) {
  const path = pathname.split("#")[0].split("?")[0];
  if (!path || path === "/") return "/index.html";
  return path.endsWith("/") ? `${path}index.html` : path;
}

function setActiveMenu() {
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll(".nav__menu a[href]");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    const linkUrl = new URL(href, window.location.origin);
    const linkPath = normalizePath(linkUrl.pathname);

    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");

      const dropdown = link.closest(".nav__dropdown");
      if (dropdown) {
        const parentLink = dropdown.querySelector(".nav__item-row .nav__link");
        if (parentLink) {
          parentLink.setAttribute("aria-current", "page");
        }
      }
    }
  });
}

function closeAllDropdowns() {
  document.querySelectorAll(".nav__dropdownmenu").forEach((menu) => {
    menu.classList.remove("mobile-open");
  });

  document.querySelectorAll(".nav__dropbtn").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

function closeMobileMenu() {
  const navMenu = document.getElementById("navMenu");
  const navToggle = document.getElementById("navToggle");

  if (!navMenu || !navToggle) return;

  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  closeAllDropdowns();
}

function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const clickedInsideHeader = target.closest(".header");
    const clickedTopbar = target.closest(".topbar");

    if (!clickedInsideHeader && !clickedTopbar) {
      closeMobileMenu();
    }
  });

  const menuLinks = navMenu.querySelectorAll("a[href]");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        setTimeout(() => {
          closeMobileMenu();
        }, 10);
      }
    });
  });
}

function setupDropdownButtons() {
  const dropdownButtons = document.querySelectorAll(".nav__dropbtn");

  dropdownButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (window.innerWidth > 980) return;

      const dropdown = button.closest(".nav__dropdown");
      const menu = dropdown?.querySelector(".nav__dropdownmenu");
      if (!dropdown || !menu) return;

      const willOpen = !menu.classList.contains("mobile-open");

      document.querySelectorAll(".nav__dropdownmenu").forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.classList.remove("mobile-open");
        }
      });

      document.querySelectorAll(".nav__dropbtn").forEach((otherButton) => {
        if (otherButton !== button) {
          otherButton.setAttribute("aria-expanded", "false");
        }
      });

      menu.classList.toggle("mobile-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });
}

function setupToTopButton() {
  const toTopBtn = document.querySelector(".to-top");
  if (!toTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      toTopBtn.classList.add("show");
    } else {
      toTopBtn.classList.remove("show");
    }
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

async function initLayout() {
  await loadPartial("siteHeader", "./assets/header.html");
  await loadPartial("siteFooter", "./assets/footer.html");

  setCurrentYear();
  setActiveMenu();
  setupMobileNav();
  setupDropdownButtons();
  setupToTopButton();
}

document.addEventListener("DOMContentLoaded", initLayout);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker 등록 완료:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker 등록 실패:", error);
      });
  });
}
