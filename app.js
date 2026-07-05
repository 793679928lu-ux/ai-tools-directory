(function (global) {
  "use strict";

  const FAVORITES_KEY = "aether-favorites";

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

  function resolveToolUrl(tool) {
    return tool.affiliateUrl || tool.url;
  }

  function buildMailto(email, subject, body) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function toggleFavorite(favorites, toolName) {
    const next = [...favorites];
    const index = next.indexOf(toolName);

    if (index === -1) {
      next.push(toolName);
    } else {
      next.splice(index, 1);
    }

    return next;
  }

  const publicApi = {
    normalizeText,
    filterTools,
    getInitials,
    resolveToolUrl,
    buildMailto,
    toggleFavorite,
  };

  const state = {
    view: "推荐",
    category: "全部",
    query: "",
    favorites: [],
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

  function readFavorites() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(FAVORITES_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
    } catch {
      return [];
    }
  }

  function writeFavorites(favorites) {
    try {
      global.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } catch {
      return false;
    }
  }

  function createArrowIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<path d="M5 15 15 5M8 5h7v7" />';
    return svg;
  }

  function createToolCard(tool, data) {
    const card = document.createElement("article");
    const isFavorite = state.favorites.includes(tool.name);
    card.className = `tool-card${tool.featured ? " is-featured" : ""}`;
    card.style.setProperty("--tool-accent", tool.accent);

    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "favorite-button";
    favorite.dataset.favorite = tool.name;
    favorite.setAttribute(
      "aria-label",
      isFavorite ? `取消收藏 ${tool.name}` : `收藏 ${tool.name}`,
    );
    favorite.setAttribute("aria-pressed", String(isFavorite));
    favorite.textContent = isFavorite ? "♥" : "♡";

    const link = document.createElement("a");
    link.className = "tool-link";
    applyLinkSafety(link, resolveToolUrl(tool));
    link.setAttribute("aria-label", `打开 ${tool.name}`);

    const top = document.createElement("span");
    top.className = "tool-card-top";

    const icon = document.createElement("span");
    icon.className = "tool-icon";
    icon.textContent = getInitials(tool.name);
    icon.setAttribute("aria-hidden", "true");

    const badges = document.createElement("span");
    badges.className = "tool-badges";
    if (tool.featured) {
      const badge = document.createElement("span");
      badge.className = "badge badge-featured";
      badge.textContent = "编辑精选";
      badges.append(badge);
    }
    if (tool.affiliateUrl) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "联盟";
      badges.append(badge);
    }

    top.append(icon, badges);

    const title = document.createElement("strong");
    title.className = "tool-title";
    title.textContent = tool.name;

    const description = document.createElement("span");
    description.className = "tool-description";
    description.textContent = tool.description;

    const footer = document.createElement("span");
    footer.className = "tool-card-footer";

    const category = document.createElement("span");
    category.className = "tool-category";
    category.textContent = tool.category;

    const arrow = document.createElement("span");
    arrow.className = "tool-open";
    arrow.append(createArrowIcon());

    footer.append(category, arrow);
    link.append(top, title, description, footer);
    card.append(link, favorite);

    favorite.addEventListener("click", () => {
      state.favorites = toggleFavorite(state.favorites, tool.name);
      const saved = writeFavorites(state.favorites);
      renderTools(data);
      showToast(
        saved
          ? state.favorites.includes(tool.name)
            ? `已收藏 ${tool.name}`
            : `已取消收藏 ${tool.name}`
          : "当前浏览器无法保存收藏",
      );
    });

    return card;
  }

  function createSponsoredCard(ad) {
    const card = document.createElement("a");
    card.className = "sponsor-card";
    applyLinkSafety(card, ad.url);

    const label = document.createElement("span");
    label.className = "sponsor-label";
    label.textContent = "赞助 · 商业合作";

    const title = document.createElement("strong");
    title.textContent = ad.title;

    const description = document.createElement("span");
    description.textContent = ad.description;

    const cta = document.createElement("span");
    cta.className = "sponsor-cta";
    cta.textContent = `${ad.cta} →`;

    card.append(label, title, description, cta);
    return card;
  }

  function toolsForCurrentView(data) {
    let tools = filterTools(data.tools, state.category, state.query);

    if (state.view === "收藏") {
      tools = tools.filter((tool) => state.favorites.includes(tool.name));
    } else if (state.view === "推荐" && !state.query) {
      tools = tools.filter((tool) => tool.featured);
    }

    return tools;
  }

  function renderTools(data) {
    const toolGrid = document.querySelector("#tool-grid");
    const resultCount = document.querySelector("#result-count");
    const emptyState = document.querySelector("#empty-state");
    const tools = toolsForCurrentView(data);
    const fragment = document.createDocumentFragment();

    tools.forEach((tool, index) => {
      fragment.append(createToolCard(tool, data));
      if (index === 1) {
        fragment.append(createSponsoredCard(data.ads.native));
      }
    });

    if (tools.length === 1) {
      fragment.append(createSponsoredCard(data.ads.native));
    }

    toolGrid.replaceChildren(fragment);
    resultCount.textContent = `显示 ${tools.length} 个工具`;
    emptyState.hidden = tools.length !== 0;
    toolGrid.hidden = tools.length === 0;
    renderActiveControls();
  }

  function renderActiveControls() {
    document.querySelectorAll("[data-view]").forEach((control) => {
      control.setAttribute("aria-pressed", String(control.dataset.view === state.view));
    });
    document.querySelectorAll("[data-keyword]").forEach((control) => {
      control.setAttribute(
        "aria-pressed",
        String(normalizeText(control.dataset.keyword) === normalizeText(state.query)),
      );
    });
  }

  function selectView(view, data) {
    state.view = view;
    state.category = data.categories.includes(view) ? view : "全部";
    renderTools(data);
  }

  function setQuery(value, data) {
    state.query = value;
    const toolbarValue = document.querySelector("#search-value");
    const overlayInput = document.querySelector("#spotlight-search");
    toolbarValue.textContent = value || "搜索工具、用途或工作流...";
    if (overlayInput.value !== value) overlayInput.value = value;
    renderTools(data);
  }

  function clearFilters(data) {
    state.view = "推荐";
    state.category = "全部";
    setQuery("", data);
  }

  function openSearch() {
    const overlay = document.querySelector("#search-overlay");
    overlay.hidden = false;
    document.body.classList.add("overlay-open");
    global.requestAnimationFrame(() => document.querySelector("#spotlight-search").focus());
  }

  function closeSearch() {
    const overlay = document.querySelector("#search-overlay");
    overlay.hidden = true;
    document.body.classList.remove("overlay-open");
    document.querySelector("#search-trigger").focus();
  }

  let toastTimer;
  function showToast(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    global.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = global.setTimeout(() => {
      toast.hidden = true;
    }, 2600);
  }

  function renderPricing(data) {
    const grid = document.querySelector("#pricing-grid");
    const fragment = document.createDocumentFragment();

    data.business.packages.forEach((item) => {
      const card = document.createElement("article");
      card.className = `price-card${item.recommended ? " is-recommended" : ""}`;

      if (item.recommended) {
        const badge = document.createElement("span");
        badge.className = "price-badge";
        badge.textContent = "首发推荐";
        card.append(badge);
      }

      const name = document.createElement("h3");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.className = "price";
      price.innerHTML = `<strong>${item.price}</strong><span>/ ${item.period}</span>`;

      const description = document.createElement("p");
      description.textContent = item.description;

      const body = [
        `咨询套餐：${item.name}`,
        `价格：${item.price} / ${item.period}`,
        "",
        "产品名称：",
        "产品网址：",
        "希望上线时间：",
      ].join("\n");
      const link = document.createElement("a");
      link.className = "button secondary-button";
      link.href = buildMailto(
        data.business.email,
        `AETHER 商业合作：${item.name}`,
        body,
      );
      link.textContent = "邮件咨询";

      card.append(name, price, description, link);
      fragment.append(card);
    });

    grid.replaceChildren(fragment);
  }

  function configureBusiness(data) {
    renderPricing(data);

    const email = document.querySelector("#business-email");
    email.textContent = data.business.email;
    email.href = buildMailto(
      data.business.email,
      "AETHER 商业合作咨询",
      "产品名称：\n产品网址：\n希望合作位置：\n希望上线时间：",
    );

    document.querySelector("#wechat-value").textContent = data.business.wechat;
    document.querySelector("#business-disclaimer").textContent =
      data.business.disclaimer;
    document.querySelector("#affiliate-disclosure").textContent =
      data.business.disclosure;

    document.querySelector("#copy-wechat").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(data.business.wechat);
        showToast("微信号已复制");
      } catch {
        showToast(`请手动复制微信号：${data.business.wechat}`);
      }
    });

    document.querySelector("#free-submit").href = buildMailto(
      data.business.email,
      "免费提交 AI 工具",
      "工具名称：\n工具网址：\n一句话介绍：\n适用分类：",
    );
    document.querySelector("#priority-submit").href = buildMailto(
      data.business.email,
      "AETHER ¥99 加急审核",
      "工具名称：\n工具网址：\n一句话介绍：\n微信号：\n\n我已了解付费加急不保证收录。",
    );
  }

  function initDirectory() {
    const data = global.AETHER_DATA;
    if (!data || typeof document === "undefined") return;

    state.favorites = readFavorites();
    const overlayInput = document.querySelector("#spotlight-search");

    renderTools(data);
    configureBusiness(data);

    document.addEventListener("click", (event) => {
      const viewControl = event.target.closest("[data-view]");
      if (viewControl) {
        selectView(viewControl.dataset.view, data);
        document.querySelector("#directory").scrollIntoView({ behavior: "smooth" });
        return;
      }

      const keywordControl = event.target.closest("[data-keyword]");
      if (keywordControl) {
        setQuery(keywordControl.dataset.keyword, data);
        document.querySelector("#directory").scrollIntoView({ behavior: "smooth" });
      }
    });

    overlayInput.addEventListener("input", (event) => {
      setQuery(event.target.value, data);
    });

    document.querySelector("#search-trigger").addEventListener("click", openSearch);
    document.querySelector("#mobile-search").addEventListener("click", openSearch);
    document.querySelector("#close-search").addEventListener("click", closeSearch);
    document.querySelector("#search-overlay").addEventListener("click", (event) => {
      if (event.target.id === "search-overlay") closeSearch();
    });
    document
      .querySelector("#clear-filters")
      .addEventListener("click", () => clearFilters(data));

    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      } else if (event.key === "Escape" && !document.querySelector("#search-overlay").hidden) {
        closeSearch();
      }
    });
  }

  publicApi.initDirectory = initDirectory;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicApi;
  }

  global.AETHERApp = publicApi;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDirectory);
    } else {
      initDirectory();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
