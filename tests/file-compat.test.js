const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

test("entry page uses ordered local classic scripts", () => {
  const dataIndex = html.indexOf('<script src="data.js"></script>');
  const appIndex = html.indexOf('<script src="app.js"></script>');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > dataIndex);
  assert.doesNotMatch(html, /<script[^>]+type=["']module["']/i);
});

test("entry page does not require remote styles or scripts", () => {
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i);
  assert.doesNotMatch(
    html,
    /<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i,
  );
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
  assert.equal(context.window.AETHER_DATA.seo.url, "https://ai-tools-directory-swart.vercel.app/");
  assert.equal(context.window.AETHER_DATA.business.highlights.length, 4);
  assert.equal(context.window.AETHER_DATA.business.faq.length, 5);
});

test("entry page contains the AETHER system and monetization surfaces", () => {
  assert.match(html, /<title>AETHER — AI 工具导航与发现系统<\/title>/);
  assert.match(html, /id="system-sidebar"/);
  assert.match(html, /id="tool-dock"/);
  assert.match(html, /id="search-overlay"/);
  assert.match(html, /id="advertise"/);
  assert.match(html, /id="submit"/);
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
});
