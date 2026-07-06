# AETHER

一个采用 macOS/iOS 系统化视觉、可直接运行的中文 AI 工具导航网站。

## 运行

双击 `index.html` 即可打开，无需安装依赖或启动服务。

如果需要通过本地网址预览，也可以在当前目录启动任意静态文件服务。

## 修改工具

编辑 `data.js` 中的 `tools` 数组。每个工具包含：

```js
{
  name: "工具名称",
  description: "一句话介绍",
  category: "AI 对话",
  tags: ["热门", "写作"],
  url: "https://example.com/",
  accent: "#8b5cf6",
  featured: true
}
```

- `category` 应使用 `categories` 数组中已有的分类。
- `featured` 可省略；设为 `true` 时显示“编辑精选”标签。
- `affiliateUrl` 可省略；只有获得官方联盟专属链接后才填写。
- `accent` 控制图标和卡片的强调色。

## 商业合作与广告

编辑 `data.js` 中的 `business` 和 `ads`：

- `ads.native`：工具列表中的原生广告卡。
- `business.packages`：广告套餐与价格。
- `business.highlights`：广告合作卖点。
- `business.faq`：商业合作常见问题。
- `business.email`、`business.wechat`：公开商务联系方式。

广告链接当前指向独立广告合作页。成交广告可把 `url` 替换为实际落地页；外部链接会自动在新标签页打开。

独立成交页：

- `advertise.html`：广告合作 / Media Kit，维护套餐、广告位样例、流程、风险说明和招商话术。
- `submit-tool.html`：提交工具页面，维护免费提交、¥99 加急审核、所需资料和审核规则。

更新套餐或联系方式时，需要同步检查首页商业合作区、`data.js`、这两个独立页面和测试。

## SEO 与搜索收录

- `index.html`：维护标题、描述、canonical、Open Graph、Twitter Card 和 JSON-LD。
- `data.js` 中的 `seo`：维护站点 URL、标题、描述和关键词。
- `robots.txt`：告诉搜索引擎允许抓取网站，并声明 sitemap 地址。
- `sitemap.xml`：维护线上首页、商业化页面和指南页地址。更换域名后需要同步更新。

## 新增指南页

指南页放在 `guides/` 目录，当前已有 17 篇原创 SEO 内容页。新增文章时需要同步：

- 新建一个独立 HTML 文件，并设置 title、description、canonical、Open Graph 和 JSON-LD。
- 在首页 `#guides` 区域增加入口卡片。
- 在 `sitemap.xml` 增加对应 URL。
- 更新测试，确保新页面能被检查到。

## 文件说明

- `index.html`：页面结构。
- `styles.css`：视觉和响应式布局。
- `data.js`：工具、分类、广告、价格和联系方式。
- `app.js`：搜索、筛选、收藏、商务联系和渲染逻辑。
- `guides/`：原创 SEO 内容页。
- `robots.txt` / `sitemap.xml`：搜索引擎抓取入口。
- `tests/`：逻辑与静态文件兼容测试。

## 运行测试

```bash
node --test tests/*.test.js
```
