const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeText, filterTools, getInitials } = require("../app.js");

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
