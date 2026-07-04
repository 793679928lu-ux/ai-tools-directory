# AI 指南针

一个简洁、深色、可直接运行的中文 AI 工具导航网站。

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
- `featured` 可省略；设为 `true` 时显示“推荐”标签。
- `accent` 控制图标和卡片的强调色。

## 修改广告

编辑 `data.js` 中的：

- `ads.banner`：首屏横幅广告。
- `ads.native`：工具列表中的原生广告卡。

广告链接当前指向页面内的合作区域。发布前可把 `url` 替换为实际广告落地页；外部链接会自动在新标签页打开。

## 修改联系方式

`index.html` 中的 `hello@example.com` 是示例邮箱。正式使用前请替换为真实联系邮箱。

## 文件说明

- `index.html`：页面结构。
- `styles.css`：视觉和响应式布局。
- `data.js`：工具、分类和广告内容。
- `app.js`：搜索、筛选和渲染逻辑。
- `tests/app.test.js`：筛选函数测试。

## 运行测试

```bash
/Users/lujiaxing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/app.test.js
```
