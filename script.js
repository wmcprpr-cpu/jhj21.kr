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
    yearEl.textContent = new Date().getFullYear().toString();
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
        const parentBtn = dropdown.querySelector(".nav__dropbtn");
        if (parentBtn) {
          parentBtn.setAttribute("aria-current", "page");
        }
      }
    }
  });
}

function closeMobileMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");

  const dropdownMenus = navMenu.querySelectorAll(".nav__dropdownmenu");
  const dropdownButtons = navMenu.querySelectorAll(".nav__dropbtn");

  dropdownMenus.forEach((menu) => menu.classList.remove("mobile-open"));
  dropdownButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
}

function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const clickedInsideNav = target.closest(".nav");
    const clickedToggle = target.closest("#navToggle");

    if (!clickedInsideNav && !clickedToggle && navMenu.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  const menuLinks = navMenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        closeMobileMenu();
      }
    });
  });
}

function setupDropdownForMobile() {
  const dropdownButtons = document.querySelectorAll(".nav__dropbtn");

  dropdownButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (window.innerWidth > 980) return;

      const dropdown = button.closest(".nav__dropdown");
      const menu = dropdown?.querySelector(".nav__dropdownmenu");
      if (!dropdown || !menu) return;

      // 모바일에서는 상위 메뉴 클릭 시 페이지 이동은 그대로 허용
      // 화살표나 별도 제어 없이 링크 자체를 막지 않음
      // 드롭다운 자동 노출만 처리
      const alreadyOpen = menu.classList.contains("mobile-open");

      document.querySelectorAll(".nav__dropdownmenu").forEach((el) => {
        if (el !== menu) el.classList.remove("mobile-open");
      });

      document.querySelectorAll(".nav__dropbtn").forEach((el) => {
        if (el !== button) el.setAttribute("aria-expanded", "false");
      });

      menu.classList.toggle("mobile-open", !alreadyOpen);
      button.setAttribute("aria-expanded", String(!alreadyOpen));
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
      behavior: "smooth",
    });
  });
}

function setupFooterClass() {
  const footer = document.querySelector("footer");
  if (footer && !footer.classList.contains("site-footer")) {
    footer.classList.add("site-footer");
  }
}

async function initLayout() {
  await loadPartial("siteHeader", "./assets/header.html");
  await loadPartial("siteFooter", "./assets/footer.html");

  setupFooterClass();
  setCurrentYear();
  setActiveMenu();
  setupMobileNav();
  setupDropdownForMobile();
  setupToTopButton();
}

document.addEventListener("DOMContentLoaded", initLayout);
