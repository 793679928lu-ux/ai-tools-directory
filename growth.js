(function (global) {
  "use strict";

  const STORAGE_KEY = "aether-growth-state";
  const data = global.AETHER_GROWTH_DATA;

  function readState() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        posts: parsed.posts && typeof parsed.posts === "object" ? parsed.posts : {},
        leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      };
    } catch {
      return { posts: {}, leads: [] };
    }
  }

  function writeState(state) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function moneyFromPackage(value) {
    const match = String(value || "").match(/¥(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  function postLink(post) {
    const base = data.links[post.linkType] || data.links.advertise;
    const source = encodeURIComponent(post.platform.split(" ")[0]);
    return `${base}?utm_source=${source}&utm_medium=organic_post&utm_campaign=aether_growth&utm_content=${post.id}`;
  }

  function postText(post) {
    return `${post.text}\n\n链接：${postLink(post)}\n\n${post.hashtags.join(" ")}`;
  }

  function postState(state, postId) {
    return state.posts[postId] || {
      published: false,
      impressions: 0,
      clicks: 0,
      replies: 0,
      leads: 0,
    };
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    global.clearTimeout(showToast.timer);
    showToast.timer = global.setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  function buildMetrics(state) {
    const postStats = data.posts.map((post) => postState(state, post.id));
    const total = postStats.reduce(
      (sum, item) => ({
        published: sum.published + (item.published ? 1 : 0),
        impressions: sum.impressions + Number(item.impressions || 0),
        clicks: sum.clicks + Number(item.clicks || 0),
        replies: sum.replies + Number(item.replies || 0),
        leads: sum.leads + Number(item.leads || 0),
      }),
      { published: 0, impressions: 0, clicks: 0, replies: 0, leads: 0 },
    );
    const closedValue = state.leads
      .filter((lead) => lead.status === "已成交")
      .reduce((sum, lead) => sum + moneyFromPackage(lead.package), 0);

    return [
      { label: "今日任务", value: "2 条", hint: "先完成后台顶部两条" },
      { label: "已发布", value: `${total.published} / ${data.posts.length}`, hint: "手动标记后统计" },
      { label: "总曝光", value: total.impressions, hint: "人工录入平台数据" },
      { label: "总点击", value: total.clicks, hint: "来自 UTM 或平台后台" },
      { label: "回复", value: total.replies, hint: "评论、私信、好友申请" },
      { label: "线索", value: state.leads.length + total.leads, hint: "登记线索 + 发帖线索" },
      { label: "已成交金额", value: `¥${closedValue}`, hint: "按登记套餐估算" },
    ];
  }

  function renderMetrics(state) {
    const container = document.querySelector("#growth-metrics");
    const fragment = document.createDocumentFragment();

    buildMetrics(state).forEach((metric) => {
      const card = document.createElement("article");
      card.className = "growth-metric-card";
      card.innerHTML = `<small>${metric.label}</small><strong>${metric.value}</strong><span>${metric.hint}</span>`;
      fragment.append(card);
    });

    container.replaceChildren(fragment);
  }

  function renderSegments() {
    const container = document.querySelector("#segment-grid");
    const fragment = document.createDocumentFragment();

    data.segments.forEach((segment) => {
      const card = document.createElement("article");
      card.className = "segment-card";
      card.innerHTML = `<h3>${segment.name}</h3><p><strong>痛点：</strong>${segment.pain}</p><p><strong>去哪里找：</strong>${segment.where}</p><p><strong>主推：</strong>${segment.offer}</p>`;
      fragment.append(card);
    });

    container.replaceChildren(fragment);
  }

  function createVisual(post) {
    const visual = document.createElement("div");
    visual.className = "post-visual";
    visual.innerHTML = `<span>AETHER</span><strong>${post.visualTitle}</strong><p>${post.visualSubtitle}</p><em>${post.cta}</em>`;
    return visual;
  }

  function createPostCard(post, state, compact) {
    const current = postState(state, post.id);
    const card = document.createElement("article");
    card.className = `campaign-card${current.published ? " is-published" : ""}`;
    card.dataset.postId = post.id;

    const tags = post.hashtags.map((tag) => `<span>${tag}</span>`).join("");
    card.innerHTML = `
      <div class="campaign-card-head">
        <div>
          <small>${post.day} · ${post.platform}</small>
          <h3>${post.visualTitle}</h3>
        </div>
        <span class="publish-status">${current.published ? "已发布" : "待发布"}</span>
      </div>
      <p class="campaign-audience"><strong>目标客户：</strong>${post.audience}</p>
      <p class="campaign-audience"><strong>目的：</strong>${post.goal}</p>
    `;
    card.append(createVisual(post));

    const copy = document.createElement("pre");
    copy.className = "post-copy";
    copy.textContent = postText(post);
    card.append(copy);

    const tagWrap = document.createElement("div");
    tagWrap.className = "post-tags";
    tagWrap.innerHTML = tags;
    card.append(tagWrap);

    const actions = document.createElement("div");
    actions.className = "post-actions";
    actions.innerHTML = `
      <button class="button primary-button" type="button" data-action="copy">复制文案</button>
      <button class="button secondary-button" type="button" data-action="download">下载图片</button>
      <button class="button secondary-button" type="button" data-action="publish">${current.published ? "取消发布" : "标记已发布"}</button>
    `;
    card.append(actions);

    if (!compact) {
      const stats = document.createElement("div");
      stats.className = "post-stats-form";
      stats.innerHTML = `
        <label>曝光<input data-stat="impressions" inputmode="numeric" value="${current.impressions || 0}" /></label>
        <label>点击<input data-stat="clicks" inputmode="numeric" value="${current.clicks || 0}" /></label>
        <label>回复<input data-stat="replies" inputmode="numeric" value="${current.replies || 0}" /></label>
        <label>线索<input data-stat="leads" inputmode="numeric" value="${current.leads || 0}" /></label>
      `;
      card.append(stats);
    }

    return card;
  }

  function nextTwoPosts(state) {
    const pending = data.posts.filter((post) => !postState(state, post.id).published);
    return (pending.length ? pending : data.posts).slice(0, 2);
  }

  function renderPosts(state) {
    const today = document.querySelector("#today-posts");
    const board = document.querySelector("#campaign-board");
    today.replaceChildren(...nextTwoPosts(state).map((post) => createPostCard(post, state, true)));
    board.replaceChildren(...data.posts.map((post) => createPostCard(post, state, false)));
  }

  function renderLeads(state) {
    const body = document.querySelector("#lead-table-body");
    const fragment = document.createDocumentFragment();

    state.leads.forEach((lead, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${lead.name}</td><td>${lead.source || "-"}</td><td>${lead.package}</td><td>${lead.status}</td><td>${lead.note || "-"}</td><td><button type="button" data-delete-lead="${index}">删除</button></td>`;
      fragment.append(row);
    });

    if (!state.leads.length) {
      const row = document.createElement("tr");
      row.innerHTML = '<td colspan="6">还没有登记线索。先发布今天两条，再把私信或评论里的客户录进来。</td>';
      fragment.append(row);
    }

    body.replaceChildren(fragment);
  }

  function renderAll(state) {
    renderMetrics(state);
    renderSegments();
    renderPosts(state);
    renderLeads(state);
  }

  async function copyPost(post) {
    await navigator.clipboard.writeText(postText(post));
    showToast("文案已复制");
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = String(text).split("");
    let line = "";
    let currentY = y;

    chars.forEach((char) => {
      const test = line + char;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = char;
        currentY += lineHeight;
      } else {
        line = test;
      }
    });

    if (line) ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  }

  function downloadImage(post) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
    gradient.addColorStop(0, "#070a18");
    gradient.addColorStop(0.55, "#171b35");
    gradient.addColorStop(1, "#07324a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 675);

    ctx.fillStyle = "rgba(126, 98, 255, 0.34)";
    ctx.beginPath();
    ctx.arc(1030, 80, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, 1084, 559);

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 34px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("AETHER", 92, 126);

    ctx.fillStyle = "#9ee8ff";
    ctx.font = "700 24px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(data.brand.offer, 92, 170);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 76px -apple-system, BlinkMacSystemFont, sans-serif";
    const nextY = wrapText(ctx, post.visualTitle, 92, 300, 820, 88);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 34px -apple-system, BlinkMacSystemFont, sans-serif";
    wrapText(ctx, post.visualSubtitle, 92, nextY + 12, 820, 46);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(92, 534, 280, 62);
    ctx.fillStyle = "#10162c";
    ctx.font = "800 26px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(post.cta, 122, 575);

    ctx.fillStyle = "#9aa4b5";
    ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(data.brand.contact, 410, 574);

    const link = document.createElement("a");
    link.download = `${post.id}-aether.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("图片已生成");
  }

  function updatePostStat(state, postId, field, value) {
    const current = postState(state, postId);
    state.posts[postId] = {
      ...current,
      [field]: Math.max(0, Number.parseInt(value || "0", 10) || 0),
    };
    writeState(state);
    renderMetrics(state);
  }

  function bindEvents(state) {
    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (action) {
        const card = event.target.closest("[data-post-id]");
        const post = data.posts.find((item) => item.id === card.dataset.postId);
        if (!post) return;

        if (action.dataset.action === "copy") {
          copyPost(post).catch(() => showToast("复制失败，请手动复制"));
        }
        if (action.dataset.action === "download") {
          downloadImage(post);
        }
        if (action.dataset.action === "publish") {
          const current = postState(state, post.id);
          state.posts[post.id] = { ...current, published: !current.published };
          writeState(state);
          renderAll(state);
        }
      }

      const deleteLead = event.target.closest("[data-delete-lead]");
      if (deleteLead) {
        state.leads.splice(Number(deleteLead.dataset.deleteLead), 1);
        writeState(state);
        renderAll(state);
      }
    });

    document.addEventListener("input", (event) => {
      const input = event.target.closest("[data-stat]");
      if (!input) return;
      const card = event.target.closest("[data-post-id]");
      updatePostStat(state, card.dataset.postId, input.dataset.stat, input.value);
    });

    document.querySelector("#lead-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      state.leads.unshift({
        name: formData.get("name"),
        source: formData.get("source"),
        contact: formData.get("contact"),
        package: formData.get("package"),
        status: formData.get("status"),
        note: formData.get("note"),
        createdAt: new Date().toISOString(),
      });
      writeState(state);
      form.reset();
      renderAll(state);
      showToast("线索已登记");
    });

    document.querySelector("#reset-growth-data").addEventListener("click", () => {
      if (!global.confirm("确认清空本机运营数据？这不会影响线上网站。")) return;
      global.localStorage.removeItem(STORAGE_KEY);
      const fresh = readState();
      state.posts = fresh.posts;
      state.leads = fresh.leads;
      renderAll(state);
      showToast("本机数据已清空");
    });
  }

  function init() {
    if (!data || typeof document === "undefined") return;
    const state = readState();
    renderAll(state);
    bindEvents(state);
  }

  global.AETHER_GROWTH = {
    postLink,
    postText,
    moneyFromPackage,
    readState,
  };

  init();
})(window);
