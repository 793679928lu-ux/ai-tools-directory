const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("entry page uses ordered local classic scripts", () => {
  const dataIndex = html.indexOf('<script src="data.js"></script>');
  const appIndex = html.indexOf('<script src="app.js"></script>');

  assert.ok(dataIndex > -1);
  assert.ok(appIndex > dataIndex);
  assert.doesNotMatch(html, /<script[^>]+type=["']module["']/i);
});

test("entry page does not require remote styles or scripts", () => {
  assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)=["']https?:/i);
});

test("data script loads without network or module APIs", () => {
  const source = fs.readFileSync(path.join(root, "data.js"), "utf8");
  const context = { window: {} };

  vm.runInNewContext(source, context);

  assert.equal(context.window.AI_DIRECTORY_DATA.tools.length, 19);
  assert.equal(context.window.AI_DIRECTORY_DATA.categories[0], "全部");
});
