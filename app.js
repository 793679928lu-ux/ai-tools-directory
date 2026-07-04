(function (global) {
  "use strict";

  function normalizeText(value) {
    return String(value || "").trim().toLocaleLowerCase("zh-CN");
  }

  function filterTools(tools, category, query) {
    const normalizedQuery = normalizeText(query);

    return tools.filter((tool) => {
      const categoryMatches = category === "全部" || tool.category === category;
      const haystack = normalizeText(
        [tool.name, tool.description, tool.category, ...(tool.tags || [])].join(" "),
      );

      return categoryMatches && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }

  function getInitials(name) {
    const words = String(name || "").trim().split(/\s+/);

    if (words.length > 1) {
      return words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    }

    const word = words[0] || "";
    return /^[\u4e00-\u9fff]/.test(word)
      ? word.slice(0, 2)
      : word.slice(0, 2).toUpperCase();
  }

  const publicApi = { normalizeText, filterTools, getInitials };

  const state = {
    category: "全部",
    query: "",
  };

  function isExternalUrl(url) {
    return /^https?:\/\//i.test(url);
  }

  function applyLinkSafety(link, url) {
    link.href = url;
    if (isExternalUrl(url)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  }

  function createArrowIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<path d="M4 10h12M11 5l5 5-5 5" />';
    return svg;
  }

  function createToolCard(tool) {
    const card = document.createElement("a");
    card.className = `tool-card${tool.featured ? " is-featured" : ""}`;
    applyLinkSafety(card, tool.url);

    const top = document.createElement("div");
    top.className = "tool-card-top";

    const icon = document.createElement("span");
    icon.className = "tool-icon";
    icon.textContent = getInitials(tool.name);
    icon.style.setProperty("--tool-accent", tool.accent);
    icon.setAttribute("aria-hidden", "true");

    const nameBlock = document.createElement("span");
    nameBlock.className = "tool-name-block";

    const titleLine = document.createElement("span");
    titleLine.className = "tool-title-line";

    const title = document.createElement("strong");
    title.textContent = tool.name;
    titleLine.append(title);

    if (tool.featured) {
      const badge = document.createElement("span");
      badge.className = "badge badge-featured";
      badge.textContent = "推荐";
      titleLine.append(badge);
    }

    const category = document.createElement("span");
    category.className = "tool-category";
    category.textContent = tool.category;

    nameBlock.append(titleLine, category);
    top.append(icon, nameBlock, createArrowIcon());

    const description = document.createElement("p");
    description.textContent = tool.description;

    const tagList = document.createElement("span");
    tagList.className = "tag-list";
    tool.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.textContent = tag;
      tagList.append(tagElement);
    });

    card.append(top, description, tagList);
    return card;
  }

  function createNativeAd(ad) {
    const card = document.createElement("a");
    card.className = "native-ad";
    applyLinkSafety(card, ad.url);

    const label = document.createElement("span");
    label.className = "ad-label";
    label.textContent = ad.label;

    const icon = document.createElement("span");
    icon.className = "native-ad-icon";
    icon.textContent = "AD";
    icon.setAttribute("aria-hidden", "true");

    const title = document.createElement("strong");
    title.textContent = ad.title;

    const description = document.createElement("p");
    description.textContent = ad.description;

    const cta = document.createElement("span");
    cta.className = "text-link";
    cta.append(ad.cta, createArrowIcon());

    card.append(label, icon, title, description, cta);
    return card;
  }

  function renderCategories(data) {
    const categoryList = document.querySelector("#category-list");
    const fragment = document.createDocumentFragment();

    data.categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button";
      button.dataset.category = category;
      button.textContent = category;
      button.setAttribute("aria-pressed", String(category === state.category));
      fragment.append(button);
    });

    categoryList.replaceChildren(fragment);
  }

  function renderKeywords(data) {
    const keywordList = document.querySelector("#keyword-list");
    const fragment = document.createDocumentFragment();

    data.keywords.forEach((keyword) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "keyword-button";
      button.dataset.keyword = keyword;
      button.textContent = keyword;
      fragment.append(button);
    });

    keywordList.replaceChildren(fragment);
  }

  function renderBannerAd(data) {
    const container = document.querySelector("#banner-ad");
    const ad = data.ads.banner;
    const link = document.createElement("a");
    link.className = "banner-ad";
    applyLinkSafety(link, ad.url);

    const label = document.createElement("span");
    label.className = "ad-label banner-label";
    label.textContent = ad.label;

    const art = document.createElement("span");
    art.className = "banner-art";
    art.setAttribute("aria-hidden", "true");
    art.innerHTML =
      '<span class="art-ring"></span><span class="art-dot art-dot-one"></span><span class="art-dot art-dot-two"></span><span class="art-grid"></span>';

    const copy = document.createElement("span");
    copy.className = "banner-copy";

    const eyebrow = document.createElement("small");
    eyebrow.textContent = ad.eyebrow;

    const title = document.createElement("strong");
    title.textContent = ad.title;

    const description = document.createElement("span");
    description.textContent = ad.description;

    copy.append(eyebrow, title, description);

    const cta = document.createElement("span");
    cta.className = "button button-light banner-cta";
    cta.append(ad.cta, createArrowIcon());

    link.append(label, art, copy, cta);
    container.replaceChildren(link);
  }

  function renderTools(data) {
    const toolGrid = document.querySelector("#tool-grid");
    const resultCount = document.querySelector("#result-count");
    const emptyState = document.querySelector("#empty-state");
    const clearSearchButton = document.querySelector("#clear-search");
    const tools = filterTools(data.tools, state.category, state.query);
    const fragment = document.createDocumentFragment();

    tools.forEach((tool, index) => {
      fragment.append(createToolCard(tool));
      if (index === 5) {
        fragment.append(createNativeAd(data.ads.native));
      }
    });

    if (tools.length > 0 && tools.length < 6) {
      fragment.append(createNativeAd(data.ads.native));
    }

    toolGrid.replaceChildren(fragment);
    resultCount.textContent = `显示 ${tools.length} 个工具`;
    emptyState.hidden = tools.length !== 0;
    toolGrid.hidden = tools.length === 0;
    clearSearchButton.hidden = !state.query;

    document.querySelectorAll(".category-button").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === state.category),
      );
    });
  }

  function clearFilters(data) {
    state.category = "全部";
    state.query = "";
    document.querySelector("#tool-search").value = "";
    renderTools(data);
  }

  function initDirectory() {
    const data = global.AI_DIRECTORY_DATA;
    if (!data) return;

    const searchInput = document.querySelector("#tool-search");
    const categoryList = document.querySelector("#category-list");
    const keywordList = document.querySelector("#keyword-list");

    renderCategories(data);
    renderKeywords(data);
    renderBannerAd(data);
    renderTools(data);

    searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      renderTools(data);
    });

    categoryList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      state.category = button.dataset.category;
      renderTools(data);
    });

    keywordList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-keyword]");
      if (!button) return;
      state.query = button.dataset.keyword;
      searchInput.value = state.query;
      renderTools(data);
      document.querySelector("#directory").scrollIntoView({ behavior: "smooth" });
    });

    document
      .querySelector("#clear-search")
      .addEventListener("click", () => clearFilters(data));
    document
      .querySelector("#clear-filters")
      .addEventListener("click", () => clearFilters(data));

    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.focus();
      }
    });
  }

  publicApi.initDirectory = initDirectory;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicApi;
  }

  global.AIToolsApp = publicApi;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDirectory);
    } else {
      initDirectory();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
