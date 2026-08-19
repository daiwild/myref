# MyRef

基于 [jaywcjlove/reference](https://github.com/jaywcjlove/reference)（MIT）的自建开发速查站。

## 特性

- 数据源 `docs/`：Markdown 直接作为静态数据源，构建使用标准 unified（remark/rehype）管线，不依赖上游自研的 refs-cli。
- 快速查询：Pagefind 全文搜索（`Ctrl/Cmd + K`），支持中文。
- 收藏：浏览器 localStorage 收藏整篇文档，支持导出/导入 JSON。
- 纯静态输出：`dist/` 可直接部署到任意静态托管。

> 搜索依赖构建产物 `dist/pagefind/`，请通过 `npm run build` + `npm run preview`（或部署后的静态站点）使用；`npm run dev` 开发模式下搜索不可用属于预期行为。

## 命令

```bash
npm install
npm run icons    # 生成文档图标（Simple Icons + Lucide 内联 SVG）
npm run extract  # 生成 src/data/index.json（分类与文档元数据）
npm run dev      # 本地开发
npm run build    # icons -> extract -> astro build -> pagefind 索引
npm run preview  # 预览构建产物
```
