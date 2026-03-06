document.addEventListener("DOMContentLoaded", async () => {
  await loadCommonLayout();
  initMobileMenu();
  initActiveMenu();
  initScrollTopButton();
});

/* =========================
   공통 Header / Footer 로드
========================= */
async function loadCommonLayout() {
  const headerTarget = document.getElementById("siteHeader");
  const footerTarget = document.getElementById("siteFooter");

  try {
    if (headerTarget) {
      const headerRes = await fetch("./assets/header.html");
      const headerHtml = await headerRes.text();
      headerTarget.innerHTML = headerHtml;
    }

    if (footerTarget) {
      const footerRes = await fetch("./assets/footer.html");
      const footerHtml = await footerRes.text();
      footerTarget.innerHTML = footerHtml;
    }
  } catch (error) {
    console.error("Header/Footer 로드 중 오류:", error);
  }
}

/* =========================
   모바일 메뉴 토글
========================= */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__menu");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");

    if (isOpen) {
      navMenu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    } else {
      navMenu.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
  });
}

/* =========================
   현재 페이지 메뉴 활성화
========================= */
function initActiveMenu() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav__menu a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    const fileName = href.replace("./", "");

    if (fileName === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/* =========================
   맨 위로 버튼
========================= */
function initScrollTopButton() {
  const topBtn = document.querySelector(".to-top");
  if (!topBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topBtn.classList.add("show");
    } else {
      topBtn.classList.remove("show");
    }
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
