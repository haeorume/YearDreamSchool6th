/**
 * 실습 문법표 — practice-cheat-sheet.json 렌더링 (단독 페이지)
 */
(() => {
  const DATA_URL = "data/practice-cheat-sheet.json";
  const CATEGORY_ICONS = {
    python: "🐍",
    sql: "🗃️",
    numpy: "🔢",
    pandas: "🐼",
    viz: "📊",
  };

  let sheetData = null;
  let activeCategory = "all";
  let searchQuery = "";
  const el = {
    root: document.getElementById("practice-cheat-sheet-view"),
    filters: document.getElementById("cheat-sheet-filters"),
    search: document.getElementById("cheat-sheet-search"),
    grid: document.getElementById("cheat-sheet-grid"),
    meta: document.getElementById("cheat-sheet-meta"),
  };

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function loadData() {
    if (sheetData) return sheetData;
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("문법표 데이터를 불러오지 못했습니다.");
    sheetData = await res.json();
    return sheetData;
  }

  function filteredCards() {
    if (!sheetData) return [];
    const q = searchQuery.trim().toLowerCase();
    return sheetData.cards.filter((card) => {
      if (activeCategory !== "all" && card.category !== activeCategory) return false;
      if (!q) return true;
      const blob = [
        card.title,
        card.formula,
        card.example,
        card.tip,
        ...(card.sampleQuestions || []),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }

  function usePageGrid(cards) {
    return cards.length > 0;
  }

  function useGroupedAll(cards) {
    if (searchQuery.trim()) return false;
    return activeCategory === "all" && cards.length > 0;
  }

  function shortenExample(text, maxLines = 4) {
    const lines = String(text || "").split("\n");
    if (lines.length <= maxLines) return text;
    return `${lines.slice(0, maxLines).join("\n")}\n…`;
  }

  function renderCardHtml(card, pageGrid) {
    const cat = escapeHtml(card.category);
    const example = pageGrid ? shortenExample(card.example, 6) : card.example;
    const icon = CATEGORY_ICONS[card.category] || "📌";
    const tipBlock = card.tip
      ? `<p class="cheat-pattern-tip">${escapeHtml(card.tip)}</p>`
      : "";

    if (!pageGrid) {
      return (
        `<article class="cheat-card" data-category="${cat}">` +
        `<header class="cheat-card-head">` +
        `<span class="cheat-card-icon">${icon}</span>` +
        `<h3 class="cheat-card-title">${escapeHtml(card.title)}</h3>` +
        `<span class="cheat-card-count">${card.problemCount}문항</span>` +
        `</header>` +
        `<div class="cheat-card-body">` +
        `<p class="cheat-label">공식</p>` +
        `<pre class="cheat-formula"><code>${escapeHtml(card.formula)}</code></pre>` +
        `<p class="cheat-label">실습 예시</p>` +
        `<pre class="cheat-example"><code>${escapeHtml(example)}</code></pre>` +
        tipBlock +
        `</div></article>`
      );
    }

    return (
      `<article class="cheat-pattern-card cat-${cat}" data-category="${cat}">` +
      `<header class="cheat-pattern-head">` +
      `<span class="cheat-pattern-icon" aria-hidden="true">${icon}</span>` +
      `<h3 class="cheat-pattern-title">${escapeHtml(card.title)}</h3>` +
      `<span class="cheat-pattern-count">${card.problemCount}문항</span>` +
      `</header>` +
      `<div class="cheat-pattern-block">` +
      `<span class="cheat-pattern-label">공식</span>` +
      `<pre class="cheat-pattern-code cheat-pattern-code--formula"><code>${escapeHtml(card.formula)}</code></pre>` +
      `</div>` +
      `<div class="cheat-pattern-block">` +
      `<span class="cheat-pattern-label">실습 예시</span>` +
      `<pre class="cheat-pattern-code cheat-pattern-code--example"><code>${escapeHtml(example)}</code></pre>` +
      `</div>` +
      tipBlock +
      `</article>`
    );
  }

  function renderFilters() {
    if (!el.filters || !sheetData) return;
    el.filters.innerHTML = "";
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = `cheat-filter-btn${activeCategory === "all" ? " active" : ""}`;
    allBtn.dataset.cat = "all";
    allBtn.textContent = `전체 (${sheetData.cards.length})`;
    el.filters.appendChild(allBtn);

    for (const cat of sheetData.categories) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cheat-filter-btn${activeCategory === cat.id ? " active" : ""}`;
      btn.dataset.cat = cat.id;
      const count = sheetData.meta.byCategory[cat.id] || 0;
      btn.textContent = `${CATEGORY_ICONS[cat.id] || ""} ${cat.label} (${count})`;
      el.filters.appendChild(btn);
    }

    el.filters.querySelectorAll(".cheat-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat || "all";
        renderFilters();
        renderGrid();
      });
    });
  }

  function applyLayoutMode(cards) {
    const pageGrid = usePageGrid(cards);
    const groupedAll = useGroupedAll(cards);
    el.root?.classList.toggle("cheat-sheet--page", pageGrid);
    el.root?.classList.toggle("cheat-sheet--grouped", groupedAll);
    el.grid?.classList.toggle("cheat-sheet-grid--page", pageGrid);

    if (el.grid) {
      el.grid.dataset.count = String(cards.length);
      el.grid.dataset.category = activeCategory === "all" ? "" : activeCategory;
      el.grid.dataset.grouped = groupedAll ? "1" : "";
    }
    return pageGrid;
  }

  function renderGroupedAll(cards) {
    const byCat = new Map();
    for (const card of cards) {
      if (!byCat.has(card.category)) byCat.set(card.category, []);
      byCat.get(card.category).push(card);
    }

    return sheetData.categories
      .filter((cat) => byCat.has(cat.id))
      .map((cat) => {
        const items = byCat.get(cat.id) || [];
        const icon = CATEGORY_ICONS[cat.id] || "📌";
        const heading =
          `<h3 class="cheat-group-heading cat-${escapeHtml(cat.id)}">` +
          `<span class="cheat-group-heading-inner">` +
          `${icon} ${escapeHtml(cat.label)} <small>(${items.length}개 패턴)</small>` +
          `</span></h3>`;
        const cardsHtml = items.map((card) => renderCardHtml(card, true)).join("");
        return heading + cardsHtml;
      })
      .join("");
  }

  function renderGrid() {
    if (!el.grid) return;
    const cards = filteredCards();
    if (!cards.length) {
      el.grid.innerHTML = '<p class="cheat-sheet-empty">검색 결과가 없습니다.</p>';
      applyLayoutMode([]);
      return;
    }

    const pageGrid = usePageGrid(cards);
    const groupedAll = useGroupedAll(cards);

    if (groupedAll) {
      el.grid.innerHTML = renderGroupedAll(cards);
    } else {
      el.grid.innerHTML = cards.map((card) => renderCardHtml(card, pageGrid)).join("");
    }

    applyLayoutMode(cards);
    el.grid.scrollTo(0, 0);
  }

  function renderMeta() {
    if (!el.meta || !sheetData) return;
    const m = sheetData.meta;
    el.meta.textContent = `실습 ${m.practiceItemCount}문항에서 추출한 ${m.cardCount}개 문법 패턴`;
  }

  async function refresh(category = "all") {
    if (!el.root) return;
    activeCategory = category || "all";
    try {
      await loadData();
      renderMeta();
      renderFilters();
      renderGrid();
    } catch (err) {
      if (el.grid) {
        el.grid.innerHTML = `<p class="cheat-sheet-empty">${escapeHtml(err.message)}</p>`;
      }
      applyLayoutMode([]);
    }
  }

  function bindEvents() {
    el.search?.addEventListener("input", () => {
      searchQuery = el.search.value;
      renderGrid();
    });
  }

  function init() {
    bindEvents();
    refresh("all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
