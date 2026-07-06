# AETHER 对比型 SEO 页面设计

日期：2026-07-06

## 目标

新增一批“工具对比”内容页，承接用户在选择两个工具时的搜索需求。对比页比普通推荐页更接近真实决策，适合把用户引回工具库、收藏工具、提交工具和商业合作入口。

成功标准：

- 新增 4 个静态对比页：
  - `/guides/chatgpt-vs-claude.html`
  - `/guides/midjourney-vs-canva-ai.html`
  - `/guides/cursor-vs-github-copilot.html`
  - `/guides/free-vs-paid-ai-tools.html`
- 首页“AI 工具选型指南”增加 4 个入口。
- `sitemap.xml` 包含新增 4 个 URL。
- 每个页面有独立 title、description、canonical、Open Graph、Twitter Card 和 JSON-LD。
- 内容强调选择逻辑，不编造价格、折扣、模型能力、免费额度或商用权承诺。
- 自动测试覆盖新增页面，并保持现有测试通过。

## 方案选择

继续使用静态 HTML。当前项目没有 CMS 和构建流程，静态页面最稳，也最容易被搜索引擎读取。

本批选择 4 个对比主题：

1. ChatGPT vs Claude：高搜索量、覆盖通用 AI 助手选择。
2. Midjourney vs Canva AI：覆盖 AI 绘图与设计交付场景。
3. Cursor vs GitHub Copilot：覆盖 AI 编程工具决策。
4. 免费 vs 付费 AI 工具：覆盖预算敏感用户和转化前教育。

## 页面结构

每页保持统一结构：

- 顶部导航。
- Hero：对比主题、适合人群、更新时间。
- 快速结论：先给选择建议。
- 对比表：按场景、优势、限制、适合人群比较。
- 场景建议：说明什么时候选 A，什么时候选 B。
- FAQ：回答新手常见问题。
- CTA：返回工具库、提交工具或商业合作。

## 文件边界

新增：

- `guides/chatgpt-vs-claude.html`
- `guides/midjourney-vs-canva-ai.html`
- `guides/cursor-vs-github-copilot.html`
- `guides/free-vs-paid-ai-tools.html`

修改：

- `index.html`
- `styles.css`
- `sitemap.xml`
- `README.md`
- `tests/file-compat.test.js`

不改：

- `app.js`
- `data.js`
- GitHub / Vercel 授权
- 支付、后台、统计、第三方脚本或密钥

## 测试

自动化测试覆盖：

- 12 个指南页文件存在。
- 每个指南页包含 SEO 元信息和 JSON-LD。
- 首页包含 12 个指南入口。
- `sitemap.xml` 包含 12 个指南 URL。
- HTML 页面不引入远程脚本或远程样式。

## 非目标

不做实时价格表、排行榜打分、自动更新、用户评论、后台 CMS、广告订单系统和任何第三方跟踪脚本。
