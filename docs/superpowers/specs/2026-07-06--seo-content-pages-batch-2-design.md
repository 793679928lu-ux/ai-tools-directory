# AETHER 第二批原创 SEO 内容页设计

日期：2026-07-06

## 目标

继续按首批内容页模式扩展 AETHER 的长尾搜索入口，用更多中文用户常搜的 AI 工具场景获取自然流量，并把流量导回工具库、提交工具和商业合作入口。

成功标准：

- 新增 5 个静态内容页：
  - `/guides/ai-video-tools.html`
  - `/guides/ai-ppt-tools.html`
  - `/guides/ai-search-tools.html`
  - `/guides/ai-music-tools.html`
  - `/guides/free-ai-tools.html`
- 首页“AI 工具选型指南”区域增加 5 个入口。
- `sitemap.xml` 包含新增 5 个页面。
- 每个页面都有独立 title、description、canonical、Open Graph、Twitter Card 和 JSON-LD。
- 内容原创、面向中文用户场景选型，不编造价格、折扣或未验证承诺。
- 不新增框架、CMS、数据库、后台、第三方脚本或任何密钥。
- 自动测试覆盖新增页面，并保持现有测试通过。

## 方案选择

推荐继续使用手写静态 HTML 页面。当前站点仍处在早期获客阶段，内容数量还不需要 CMS；静态页部署简单、速度快、搜索引擎可直接读取。

暂缓：

- CMS：当前内容量不足以抵消复杂度。
- 自动生成大量文章：风险是质量低、重复度高、损害品牌信任。
- 统计和广告后台：先积累内容和访问入口，再接数据和交易闭环。

## 页面范围

新增页面聚焦 5 类高搜索意图：

1. AI 视频工具推荐：Runway、剪映、Pika 等，解决短视频、字幕、特效、商业视频选型。
2. AI PPT 工具推荐：Gamma、Canva AI、Notion AI 等，解决演示文稿、提案、课程报告选型。
3. AI 搜索工具推荐：Perplexity、Gemini、ChatGPT 等，解决资料检索、引用、研究选型。
4. AI 音乐工具推荐：Suno、Udio、ElevenLabs 等，解决歌曲、配音、声音设计选型。
5. 免费 AI 工具合集：面向预算敏感用户，明确提醒“免费额度可能变化”，不承诺永久免费。

每页结构继续保持：

- 顶部导航
- Hero 和更新时间
- 快速结论
- 推荐工具卡
- 选型标准
- 常见问题
- 返回工具库 / 提交工具 / 商业合作入口

## 文件边界

新增：

- `guides/ai-video-tools.html`
- `guides/ai-ppt-tools.html`
- `guides/ai-search-tools.html`
- `guides/ai-music-tools.html`
- `guides/free-ai-tools.html`

修改：

- `index.html`
- `sitemap.xml`
- `README.md`
- `tests/file-compat.test.js`

预计不需要修改 `app.js`，因为内容页是静态页面，首页指南入口也是静态链接。

## 测试

自动化测试覆盖：

- 8 个指南页文件存在。
- 每个指南页包含独立 SEO 信息和 JSON-LD。
- 首页包含 8 个指南入口。
- `sitemap.xml` 包含 8 个指南 URL。
- 所有 HTML 页面不引入远程脚本或远程样式。
- 现有工具筛选、收藏、SEO 和商业入口测试继续通过。

人工验证覆盖：

- 首页指南区在桌面和移动端可读。
- 5 个新增内容页线上返回 200。
- sitemap 线上包含 8 个指南页。

## 非目标

本阶段不做：

- CMS、文章后台、登录系统。
- 自动生成文章。
- 站内文章搜索。
- 访问统计脚本。
- 支付或广告客户后台。
- 任何真实密钥、cookie、token 或商户凭据。
