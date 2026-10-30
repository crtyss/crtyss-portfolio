# Crtyss Portfolio

产品设计作品集，包含 Three.js 动态材质模型、摄影画廊，以及产品和摄影作品管理后台。

接手开发与运维请先阅读 [项目交接文档](./HANDOFF.md)，包含当前上线状态、近期修改、部署路径和验证记录。

## 本地启动

使用 Node.js 22.12+ 或 Node.js 24。

```sh
npm ci
npm run admin:setup  # 仅首次设置或重置管理员密码时执行
npm run dev:full
```

- 网站：http://127.0.0.1:5173/
- 画廊：http://127.0.0.1:5173/imaging
- 管理入口：http://127.0.0.1:5173/admin

设置命令会显示随机生成的管理员密码，请单独保存。后台已配置时，不要重复运行设置命令。

## 构建与部署

```sh
npm run build
npm run server
```

构建输出为 `dist/`，后台默认监听 `127.0.0.1:3001`。完整功能需要同时部署页面与 Node.js 后台。`deployment/` 是当前 Ubuntu 服务器的部署配置，包含固定的服务器路径；在其他服务器使用前需调整。

操作、备份和部署详情见 [管理后台使用说明](./管理后台使用说明.md)。

## 数据管理

- 初始产品数据：`src/projects.js`。
- 初始摄影数据：`src/photography.json`。
- 静态图片及材质：`public/assets/`。
- 实际管理内容、上传图片和密码哈希：`server/data/`，或 `DATA_DIR` 指定的独立目录。

后台首次运行会初始化作品数据。此后的管理修改保存在数据目录中，不会修改初始数据文件。**Git 不包含后台数据和管理员凭据，需要另外备份数据目录。**

## Git 维护

已完成的功能通过独立提交保存；开始新功能时建议创建 `codex/功能名` 分支。提交前检查 `git diff --check` 并运行 `npm run build`，提交后同步远程仓库。

2026-10-29 的整理保存了此前累积改动的完整状态，并按素材、应用功能、部署文档分类。它没有重建此前未提交的中间版本。

请勿提交密码、`.env`、`server/data/`、`node_modules/` 或 `dist/`。

## 回归检查与生产路由

运行 `npm test` 会先构建，然后用独立的临时数据测试接口、备份、权限、404、分享元信息、接口失败重试、页面切换、主题及移动端材质。测试不连接真实作品数据库。首次在 Linux 环境运行前执行 `npx playwright install --with-deps chromium`；macOS 默认使用已安装的 Chrome，也可设置 `CHROME_BIN` 指定浏览器。

GitHub Actions 会在推送和 PR 时执行同样的检查。

页面 HTML 现在由 Node 服务按最新作品数据生成标题、描述、分享图片和 HTTP 状态码；Nginx 直接提供 `/assets/`，其他请求代理到后台。上线必须同步更新 `server/`、`shared/`、`src/projects.js`、`src/photography.json`、`dist/`、依赖及 Nginx 配置，不能仅替换 dist/index.html。启动后台前需要先完成构建。

数据每次修改前自动保存快照到 `DATA_DIR/snapshots/`，保留最近 30 份。这些快照用于恢复误修改，不代替异机备份；服务器磁盘故障仍需独立备份保护。

移动端材质由 `npm exec -- node scripts/prepare-mobile-materials.mjs` 从原始贴图生成；生成文件已入库。手机使用较小的贴图、网格与像素密度，桌面保留原始资源。直接打开二级页不会初始化首页 3D，已打开的首页会保留实例并在被覆盖时暂停动画。

HTTPS 尚需可用的公网 TLS 入口及证书与自动续期配置。当前 HTTP 访问不能保护登录传输；确认网络条件前，不要将部署状态记录为已启用 HTTPS。
