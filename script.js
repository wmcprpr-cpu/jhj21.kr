(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  // Active nav by file name
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav__menu a[data-page]").forEach(a => {
    if (a.dataset.page === path) a.classList.add("is-active");
  });

  // Mobile nav
  const toggle = $(".nav__toggle");
  const menu = $("#navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#navMenu a").forEach(a => a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  // Footer year
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // To top
  const toTop = $(".to-top");
  if (toTop) {
    const onScroll = () => {
      const sc = window.scrollY || document.documentElement.scrollTop;
      toTop.style.display = sc > 600 ? "grid" : "none";
      toTop.style.placeItems = "center";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Contact demo handler (GitHub Pages는 기본 폼 전송 불가)
  window.JJ21 = window.JJ21 || {};
  window.JJ21.handleFormSubmit = function (e) {
    e.preventDefault();
    const f = e.target;
    const data = new FormData(f);
    const payload = {
      name: (data.get("name") || "").toString().trim(),
      email: (data.get("email") || "").toString().trim(),
      type: (data.get("type") || "").toString().trim(),
      message: (data.get("message") || "").toString().trim(),
    };
    const out = f.querySelector(".form__result");
    if (!out) return false;
    out.style.display = "block";
    out.innerHTML =
      `<strong>입력 내용 확인(데모)</strong><br/>` +
      `성함: ${esc(payload.name)}<br/>이메일: ${esc(payload.email)}<br/>유형: ${esc(payload.type)}<br/>` +
      `내용: ${esc(payload.message).replace(/\n/g, "<br/>")}`;
    return false;
  };

  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
