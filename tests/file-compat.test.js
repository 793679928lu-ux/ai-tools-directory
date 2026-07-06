const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const growthPage = fs.readFileSync(path.join(root, "growth.html"), "utf8");
const guidePages = [
  {
    path: "guides/ai-writing-tools.html",
    title: "AI 写作工具推荐",
  },
  {
    path: "guides/ai-image-tools.html",
    title: "AI 绘图工具推荐",
  },
  {
    path: "guides/ai-coding-tools.html",
    title: "AI 编程工具推荐",
  },
  {
    path: "guides/ai-video-tools.html",
    title: "AI 视频工具推荐",
  },
  {
    path: "guides/ai-ppt-tools.html",
    title: "AI PPT 工具推荐",
  },
  {
    path: "guides/ai-search-tools.html",
    title: "AI 搜索工具推荐",
  },
  {
    path: "guides/ai-music-tools.html",
    title: "AI 音乐工具推荐",
  },
  {
    path: "guides/free-ai-tools.html",
    title: "免费 AI 工具合集",
  },
  {
    path: "guides/chatgpt-vs-claude.html",
    title: "ChatGPT vs Claude",
  },
  {
    path: "guides/midjourney-vs-canva-ai.html",
    title: "Midjourney vs Canva AI",
  },
  {
    path: "guides/cursor-vs-github-copilot.html",
    title: "Cursor vs GitHub Copilot",
  },
  {
    path: "guides/free-vs-paid-ai-tools.html",
    title: "免费 AI 工具 vs 付费 AI 工具",
  },
  {
    path: "guides/ai-tools-directory-overview.html",
    title: "AI 工具导航总览",
  },
  {
    path: "guides/ai-tools-for-students.html",
    title: "适合学生的 AI 工具",
  },
  {
    path: "guides/ai-tools-for-creators.html",
    title: "适合自媒体的 AI 工具",
  },
  {
    path: "guides/ai-tools-for-cross-border-ecommerce.html",
    title: "适合跨境电商的 AI 工具",
  },
  {
    path: "guides/ai-tools-for-programmers.html",
    title: "适合程序员的 AI 工具",
  },
].map((page) => ({
  ...page,
  source: fs.readFileSync(path.join(root, page.path), "utf8"),
}));
const landingPages = [
  {
    path: "advertise.html",
    title: "AETHER 广告合作",
  },
  {
    path: "submit-tool.html",
    title: "提交 AI 工具",
  },
].map((page) => ({
  ...page,
  source: fs.readFileSync(path.join(root, page.path), "utf8"),
}));

test("entry page uses ordered local classic scripts", () => {
  const dataIndex = html.indexOf('<script src="data.js"></script>');
  const appIndex = html.indexOf('<script src="app.js"></script>');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > dataIndex);
  assert.doesNotMatch(html, /<script[^>]+type=["']module["']/i);
});

test("html pages do not require remote styles or scripts", () => {
  [
    html,
    growthPage,
    ...guidePages.map((page) => page.source),
    ...landingPages.map((page) => page.source),
  ].forEach((source) => {
    assert.doesNotMatch(source, /<script[^>]+src=["']https?:/i);
    assert.doesNotMatch(
      source,
      /<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i,
    );
  });
});

test("data script loads without network or module APIs", () => {
  const source = fs.readFileSync(path.join(root, "data.js"), "utf8");
  const context = { window: {} };

  vm.runInNewContext(source, context);

  assert.equal(context.window.AETHER_DATA.brand.name, "AETHER");
  assert.equal(context.window.AETHER_DATA.brand.tagline, "AI DISCOVERY OS");
  assert.equal(context.window.AETHER_DATA.tools.length, 19);
  assert.equal(context.window.AETHER_DATA.categories[0], "全部");
  assert.equal(context.window.AETHER_DATA.business.email, "793679928@qq.com");
  assert.equal(context.window.AETHER_DATA.business.wechat, "793679928");
  assert.equal(context.window.AETHER_DATA.business.packages.length, 5);
  assert.equal(context.window.AETHER_DATA.ads.banner.url, "advertise.html");
  assert.equal(context.window.AETHER_DATA.ads.native.url, "advertise.html");
  assert.equal(context.window.AETHER_DATA.seo.url, "https://ai-tools-directory-swart.vercel.app/");
  assert.equal(context.window.AETHER_DATA.business.highlights.length, 4);
  assert.equal(context.window.AETHER_DATA.business.faq.length, 5);
});

test("growth data script loads the campaign queue", () => {
  const source = fs.readFileSync(path.join(root, "growth-data.js"), "utf8");
  const context = { window: {} };

  vm.runInNewContext(source, context);

  assert.equal(context.window.AETHER_GROWTH_DATA.brand.name, "AETHER");
  assert.equal(context.window.AETHER_GROWTH_DATA.segments.length, 4);
  assert.equal(context.window.AETHER_GROWTH_DATA.posts.length, 14);
  assert.equal(context.window.AETHER_GROWTH_DATA.posts[0].platform, "微信朋友圈 / 允许推广的 AI 社群");
  assert.equal(
    context.window.AETHER_GROWTH_DATA.links.advertise,
    "https://ai-tools-directory-swart.vercel.app/advertise.html",
  );
});

test("entry page contains the AETHER system and monetization surfaces", () => {
  assert.match(html, /<title>AETHER — AI 工具导航与发现系统<\/title>/);
  assert.match(html, /id="system-sidebar"/);
  assert.match(html, /id="tool-dock"/);
  assert.match(html, /id="search-overlay"/);
  assert.match(html, /id="advertise"/);
  assert.match(html, /id="submit"/);
  assert.match(html, /href="advertise\.html"/);
  assert.match(html, /href="submit-tool\.html"/);
  assert.match(html, /id="guides"/);
  assert.match(html, /guides\/ai-writing-tools\.html/);
  assert.match(html, /guides\/ai-image-tools\.html/);
  assert.match(html, /guides\/ai-coding-tools\.html/);
  assert.match(html, /guides\/ai-video-tools\.html/);
  assert.match(html, /guides\/ai-ppt-tools\.html/);
  assert.match(html, /guides\/ai-search-tools\.html/);
  assert.match(html, /guides\/ai-music-tools\.html/);
  assert.match(html, /guides\/free-ai-tools\.html/);
  assert.match(html, /guides\/chatgpt-vs-claude\.html/);
  assert.match(html, /guides\/midjourney-vs-canva-ai\.html/);
  assert.match(html, /guides\/cursor-vs-github-copilot\.html/);
  assert.match(html, /guides\/free-vs-paid-ai-tools\.html/);
  assert.match(html, /guides\/ai-tools-directory-overview\.html/);
  assert.match(html, /guides\/ai-tools-for-students\.html/);
  assert.match(html, /guides\/ai-tools-for-creators\.html/);
  assert.match(html, /guides\/ai-tools-for-cross-border-ecommerce\.html/);
  assert.match(html, /guides\/ai-tools-for-programmers\.html/);
  assert.match(html, /id="business-highlights"/);
  assert.match(html, /id="business-faq-list"/);
  assert.match(html, /广告与联盟披露/);
  assert.doesNotMatch(html, /AI 指南针|hello@example\.com/);
});

test("entry page exposes crawlable SEO metadata and structured data", () => {
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/ai-tools-directory-swart\.vercel\.app\/" \/>/,
  );
  assert.match(html, /<meta name="robots" content="index,follow" \/>/);
  assert.match(html, /<meta property="og:title" content="AETHER — AI 工具导航与发现系统" \/>/);
  assert.match(html, /<meta name="twitter:card" content="summary" \/>/);

  const match = html.match(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
  );
  assert.ok(match);

  const jsonLd = JSON.parse(match[1]);
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.ok(jsonLd["@graph"].some((item) => item["@type"] === "WebSite"));
  assert.ok(jsonLd["@graph"].some((item) => item["@type"] === "ItemList"));
  assert.ok(jsonLd["@graph"].some((item) => item["@type"] === "ContactPoint"));
});

test("robots and sitemap point search engines to the production site", () => {
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(
    robots,
    /Sitemap: https:\/\/ai-tools-directory-swart\.vercel\.app\/sitemap\.xml/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/ai-tools-directory-swart\.vercel\.app\/<\/loc>/,
  );
  guidePages.forEach((page) => {
    assert.match(
      sitemap,
      new RegExp(
        `<loc>https://ai-tools-directory-swart\\.vercel\\.app/${page.path}</loc>`,
      ),
    );
  });
  landingPages.forEach((page) => {
    assert.match(
      sitemap,
      new RegExp(
        `<loc>https://ai-tools-directory-swart\\.vercel\\.app/${page.path}</loc>`,
      ),
    );
  });
  assert.doesNotMatch(sitemap, /growth\.html/);
});

test("guide pages expose standalone SEO metadata and structured data", () => {
  guidePages.forEach((page) => {
    assert.match(page.source, new RegExp(`<title>[^<]*${page.title}[^<]*</title>`));
    assert.match(page.source, /<meta\s+name="description"\s+content="[^"]+"\s*\/>/);
    assert.match(
      page.source,
      new RegExp(
        `<link\\s+rel="canonical"\\s+href="https://ai-tools-directory-swart\\.vercel\\.app/${page.path}"\\s*/>`,
      ),
    );
    assert.match(page.source, /<meta property="og:type" content="article" \/>/);
    assert.match(page.source, /<meta name="twitter:card" content="summary" \/>/);
    assert.match(page.source, /href="\.\.\/index\.html#directory"/);

    const match = page.source.match(
      /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
    );
    assert.ok(match);

    const jsonLd = JSON.parse(match[1]);
    assert.equal(jsonLd["@context"], "https://schema.org");
    assert.equal(jsonLd["@type"], "Article");
    assert.match(jsonLd.mainEntityOfPage, new RegExp(page.path));
  });
});

test("monetization landing pages expose SEO metadata and conversion copy", () => {
  landingPages.forEach((page) => {
    assert.match(page.source, new RegExp(`<title>[^<]*${page.title}[^<]*</title>`));
    assert.match(page.source, /<meta\s+name="description"\s+content="[^"]+"\s*\/>/);
    assert.match(
      page.source,
      new RegExp(
        `<link\\s+rel="canonical"\\s+href="https://ai-tools-directory-swart\\.vercel\\.app/${page.path}"\\s*/>`,
      ),
    );
    assert.match(page.source, /<meta property="og:type" content="website" \/>/);
    assert.match(page.source, /<meta name="twitter:card" content="summary" \/>/);
    assert.match(page.source, /793679928@qq\.com/);
    assert.match(page.source, /793679928/);

    const match = page.source.match(
      /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
    );
    assert.ok(match);

    const jsonLd = JSON.parse(match[1]);
    assert.equal(jsonLd["@context"], "https://schema.org");
    assert.equal(jsonLd["@type"], "WebPage");
    assert.match(jsonLd.mainEntityOfPage, new RegExp(page.path));
  });

  assert.match(landingPages[0].source, /Media Kit/);
  assert.match(landingPages[0].source, /招商话术/);
  assert.match(landingPages[0].source, /¥499/);
  assert.match(landingPages[1].source, /提交你的 AI 工具/);
  assert.match(landingPages[1].source, /¥99/);
  assert.match(landingPages[1].source, /加急审核/);
});

test("growth console is noindex and exposes local operations tools", () => {
  assert.match(growthPage, /<title>AETHER 获客运营后台<\/title>/);
  assert.match(growthPage, /<meta name="robots" content="noindex,nofollow" \/>/);
  assert.match(growthPage, /id="growth-metrics"/);
  assert.match(growthPage, /id="today-posts"/);
  assert.match(growthPage, /id="campaign-board"/);
  assert.match(growthPage, /id="lead-form"/);
  assert.match(growthPage, /<script src="growth-data\.js"><\/script>\s*<script src="growth\.js"><\/script>/);
  assert.match(growthPage, /每天执行 2 条合规图文发布任务/);
});
