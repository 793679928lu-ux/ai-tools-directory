# AETHER 专题聚合 SEO 页面设计

日期：2026-07-06

## 目标

新增 5 个专题聚合页，把现有工具库和 12 篇指南页按人群、用途和商业场景串起来，提高站内链接密度，并承接更明确的搜索需求。

成功标准：

- 新增 5 个静态专题页：
  - `/guides/ai-tools-directory-overview.html`
  - `/guides/ai-tools-for-students.html`
  - `/guides/ai-tools-for-creators.html`
  - `/guides/ai-tools-for-cross-border-ecommerce.html`
  - `/guides/ai-tools-for-programmers.html`
- 首页“AI 工具选型指南”增加 5 个专题入口。
- `sitemap.xml` 包含新增 5 个 URL。
- README 当前指南数量更新到 17。
- 自动测试覆盖 17 个指南页。
- 线上部署后打开总览页给用户检查。

## 页面定位

1. AI 工具导航总览页：解释 AETHER 如何按对话、图像、视频、办公、编程、音频分类使用。
2. 适合学生的 AI 工具：聚焦学习、资料整理、写作、PPT、编程入门。
3. 适合自媒体的 AI 工具：聚焦选题、脚本、封面、视频、配音和音乐。
4. 适合跨境电商的 AI 工具：聚焦产品文案、图片、短视频、竞品调研、客服和店铺运营。
5. 适合程序员的 AI 工具：聚焦项目理解、代码补全、调试、原型开发和技术资料检索。

## 方案选择

继续采用手写静态 HTML 页面，不引入 CMS、构建工具、数据库或第三方脚本。理由：

- 当前内容页数量仍可手动维护。
- 静态页面最稳定，部署简单。
- 搜索引擎可以直接抓取。
- 不涉及密钥、账号或外部写入。

## 内容规则

- 保守描述工具用途，不写固定价格、永久免费、确定商用权或未验证能力。
- 对学生、跨境电商、程序员等场景给出任务导向建议，不做夸大收益承诺。
- 每页都把用户导回工具库、相关指南和提交/商业合作入口。
- 所有外链使用官网或现有工具库中的公开 URL。

## 文件边界

新增：

- `guides/ai-tools-directory-overview.html`
- `guides/ai-tools-for-students.html`
- `guides/ai-tools-for-creators.html`
- `guides/ai-tools-for-cross-border-ecommerce.html`
- `guides/ai-tools-for-programmers.html`

修改：

- `index.html`
- `sitemap.xml`
- `README.md`
- `tests/file-compat.test.js`

预计不需要修改：

- `app.js`
- `data.js`
- GitHub / Vercel 授权

## 测试

自动化测试覆盖：

- 17 个指南页存在。
- 每个指南页有 SEO 元信息和 JSON-LD。
- 首页包含 17 个指南入口。
- `sitemap.xml` 包含 17 个指南 URL。
- HTML 页面不引入远程脚本或远程样式。

人工验证覆盖：

- 线上 5 个新增专题页返回 200。
- 线上 sitemap 包含 5 个新增 URL。
- 在浏览器打开总览页给用户检查。

## 非目标

不做 CMS、文章后台、站内搜索、实时价格、访问统计、支付、登录、广告订单后台和任何密钥配置。
