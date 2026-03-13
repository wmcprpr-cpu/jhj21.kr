(function () {
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }

  function getPosts() {
    if (!Array.isArray(window.SITE_POSTS)) return [];
    return [...window.SITE_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createCard(post) {
    return `
      <article class="news-card-item">
        <div class="news-card-item__top">
          <span class="news-card-item__tag">${escapeHtml(post.tag)}</span>
          <time class="news-card-item__date" datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
        </div>
        <h3 class="news-card-item__title">${escapeHtml(post.title)}</h3>
        <p class="news-card-item__summary">${escapeHtml(post.summary)}</p>
        <a class="news-card-item__link" href="${escapeHtml(post.link || "#")}">자세히 보기</a>
      </article>
    `;
  }

  function renderHomeRecent() {
    const target = document.getElementById("recentNewsList");
    if (!target) return;

    const posts = getPosts().slice(0, 3);

    if (!posts.length) {
      target.innerHTML = `<div class="news-empty"><p>등록된 최근 소식이 아직 없습니다.</p></div>`;
      return;
    }

    target.innerHTML = posts.map(createCard).join("");
  }

  function renderCategoryList(type, elementId) {
    const target = document.getElementById(elementId);
    if (!target) return;

    const posts = getPosts().filter((post) => post.type === type);

    if (!posts.length) {
      target.innerHTML = `<div class="news-empty"><p>등록된 게시물이 아직 없습니다.</p></div>`;
      return;
    }

    target.innerHTML = posts.map(createCard).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;

    renderHomeRecent();

    if (page === "news") renderCategoryList("news", "newsList");
    if (page === "press") renderCategoryList("press", "pressList");
    if (page === "activity") renderCategoryList("activity", "activityList");
  });
})();
