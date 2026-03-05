// script.js
(function () {
  const inject = async (id, url) => {
    const el = document.getElementById(id);
    if (!el) return;
    const res = await fetch(url, { cache: "no-store" });
    el.innerHTML = await res.text();
  };

  const setActiveNav = () => {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#navMenu a").forEach(a => {
      const href = (a.getAttribute("href") || "").replace("./", "");
      if (href === path) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };

  const bindNavToggle = () => {
    const btn = document.querySelector(".nav__toggle");
    const menu = document.getElementById("navMenu");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // 바깥 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      const within = menu.contains(e.target) || btn.contains(e.target);
      if (!within) {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  };

  const bindTopButton = () => {
    const btn = document.querySelector(".to-top");
    if (!btn) return;

    const onScroll = () => {
      if (window.scrollY > 500) btn.classList.add("show");
      else btn.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const setYear = () => {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  };

  // ---- bootstrap ----
  document.addEventListener("DOMContentLoaded", async () => {
    await inject("siteHeader", "./assets/header.html");
    await inject("siteFooter", "./assets/footer.html");

    setActiveNav();
    bindNavToggle();
    bindTopButton();
    setYear();
  });
})();
