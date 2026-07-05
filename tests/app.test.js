const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeText,
  filterTools,
  getInitials,
  resolveToolUrl,
  buildMailto,
  toggleFavorite,
} = require("../app.js");

const tools = [
  {
    name: "ChatGPT",
    description: "AI 对话助手",
    category: "AI 对话",
    tags: ["热门"],
  },
  {
    name: "Cursor",
    description: "智能代码编辑器",
    category: "编程开发",
    tags: ["开发"],
  },
];

test("normalizeText trims and lowercases text", () => {
  assert.equal(normalizeText("  ChatGPT  "), "chatgpt");
});

test("filterTools combines category and keyword filters", () => {
  assert.deepEqual(filterTools(tools, "编程开发", "代码"), [tools[1]]);
});

test("filterTools searches tags and supports all categories", () => {
  assert.deepEqual(filterTools(tools, "全部", "热门"), [tools[0]]);
});

test("getInitials returns a short fallback label", () => {
  assert.equal(getInitials("Microsoft Copilot"), "MC");
  assert.equal(getInitials("豆包"), "豆包");
});

test("resolveToolUrl prefers an approved affiliate URL and falls back to the website", () => {
  assert.equal(
    resolveToolUrl({ url: "https://example.com", affiliateUrl: "https://partner.example.com" }),
    "https://partner.example.com",
  );
  assert.equal(resolveToolUrl({ url: "https://example.com", affiliateUrl: "" }), "https://example.com");
});

test("buildMailto safely encodes its subject and body", () => {
  assert.equal(
    buildMailto("business@example.com", "首页横幅 ¥299", "产品名称：\n产品网址："),
    "mailto:business@example.com?subject=%E9%A6%96%E9%A1%B5%E6%A8%AA%E5%B9%85%20%C2%A5299&body=%E4%BA%A7%E5%93%81%E5%90%8D%E7%A7%B0%EF%BC%9A%0A%E4%BA%A7%E5%93%81%E7%BD%91%E5%9D%80%EF%BC%9A",
  );
});

test("toggleFavorite adds and removes a tool without duplicating it", () => {
  assert.deepEqual(toggleFavorite([], "ChatGPT"), ["ChatGPT"]);
  assert.deepEqual(toggleFavorite(["ChatGPT"], "ChatGPT"), []);
  assert.deepEqual(toggleFavorite(["Cursor"], "ChatGPT"), ["Cursor", "ChatGPT"]);
});
