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
npm run check    # 校验文档、分类与图标映射完整性
npm run icons    # 生成文档图标（Simple Icons + Lucide 内联 SVG）
npm run extract  # 生成 src/data/index.json（分类与文档元数据）
npm run dev      # 本地开发
npm run build    # icons -> extract -> astro build -> pagefind 索引
npm run preview  # 预览构建产物
```

## 部署

站点配置了 `base: '/myref/'`，构建产物 `dist/` 需部署到域名的 `/myref/` 子路径下；如果部署位置不同，请同步修改 `astro.config.mjs` 中的 `base`。

### Docker 部署

```bash
docker compose up -d --build   # 构建并启动
```

启动后访问 `http://localhost:8080/myref/`（端口映射可在 `docker-compose.yml` 中修改）。如需自定义端口：

```bash
docker build -t myref .
docker run -d -p 8080:80 myref
```

> 容器内站点文件位于 `/usr/share/nginx/html/myref/`，与 `base: '/myref/'` 对应；若修改部署路径，请同步调整 `astro.config.mjs` 与 `Dockerfile`。
