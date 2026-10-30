# Crtyss Portfolio 项目交接

更新日期：2026-10-30（Asia/Shanghai）。供后续开发者或 Codex 接手使用。

### 静态资源权限修复

2026-10-30 定位到 KFC 用户图片曾以 600 权限同步到线上，导致 Nginx 返回 403。已修正线上两处图片为 644，并核对公网文件与源文件 SHA-256 一致。构建后统一 dist 目录为 755、文件为 644；部署资源时使用 `rsync --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r`，包括手动部署流程。该规则仅针对公开构建资源，不能用于私有数据或凭据目录。

## 1. 当前状态

- 工作目录：`/Users/Admin/Documents/ChatGPT/web`。
- Git：`git@github.com:crtyss/crtyss-portfolio.git`，分支 `main`。
- 本次交接前的最新功能提交：`a3bf26e`，已推送并部署到 Ubuntu。
- 线上网站：<http://111.8.201.55:8089/>。
- 管理入口：<http://111.8.201.55:8089/admin>。
- 交接时复查：systemd 服务 active，首页和内容 API 均返回 200。
- 当前没有已承诺但未完成的功能任务；下方“限制与后续事项”不代表用户已授权继续修改。

## 2. 本地运行

推荐使用 Node.js 24，并用锁文件安装依赖：

```sh
npm ci
npm run dev:full
```

前端为 `http://127.0.0.1:5173/`，后台为 `http://127.0.0.1:3001/`。单独 `npm run dev` 不会启动内容 API。

新环境没有管理员凭据时，先执行 `npm run admin:setup`。已有环境不要重复执行，它会重置管理员密码。管理员密码、SSH 密钥及服务器 sudo 密码不写入本交接文档；三者用途不同。

## 3. 页面与内容

| 路径 | 功能 |
| --- | --- |
| `/` | 首页，顺序：首页 → 产品 → 关于我 → 能力 → 影像 → 联系 |
| `/works/:id` | 产品详情 |
| `/imaging` | 摄影画廊，分类筛选与图片弹窗 |
| `/admin` | 密码登录后管理产品和摄影作品 |

### 主题、路由和 3D

- 首次访问默认白天模式。`localStorage` 的 `crtyss-theme` 保留用户选择，之后优先采用已存主题。
- 主题初始化在 `index.html`；同步更新逻辑在 `src/theme.js`，基础变量在 `src/theme.css`。
- 首页在进入二级页后保留 DOM 和 3D 实例；二级页有独立滚动容器。返回时恢复位置，不重播首页动画，不从顶部滑回。
- 不要轻易将首页改为按路由卸载，也不要用平滑滚动恢复返回位置。
- 3D 使用 Three.js，按需加载；玻璃、硅胶、金、塑料、阳极氧化铝、木纹材质每 5 秒渐变切换。
- 桌面支持拖动旋转及惯性；移动端暂不提供模型拖动。页面不可见或首页被覆盖时暂停渲染。
- 手机采用较小网格、贴图及像素密度。相关文件：`GeometryHero`、`geometry-scene`、`rotation-motion`、`public/assets/materials/`。
- 产品点击振动在 `src/haptics.js`；依赖浏览器振动 API，iPhone 上不生效。不要将模拟器通过写成真实马达已验证。

### 软件滚动栏与 KFC 彩蛋

- 文件：`src/SoftwareStrip.jsx` / `.css`、`src/KfcResume.jsx` / `.css`。
- 共 15 项：Photoshop、DaVinci Resolve、Final Cut Pro、Rhino、3ds Max、KeyShot、Unity、Blender、Codex、KFC、DeepSeek、即时设计、Bambu Studio、OBS Studio、VMware ESXi。
- 所有图标使用 48×48、12px 圆角、6px 内边距的白色底框，内部图片 36×36。
- 可横向拖动；释放后从当前相位恢复自动循环。移动端纵向操作仍用于页面滚动。
- 只有 KFC 可点击，拖动结束不误触打开。减少动态效果偏好下关闭自动动画，允许手动滚动。
- KFC 统一使用用户提供的 `public/assets/software/kfc-user.png`，原图及现有水印保留，不再使用旧周年 App 图标。
- 点击后图标从原位置旋转飞向中央、放大回弹、扩散光环，约 1.4 秒后展示简历；简历内容保持相对克制。不要把“入场夸张”扩展成整个网站都使用强烈动画。
- 弹窗使用原生 dialog，支持 Escape、关闭后焦点恢复。简历为用户要求的幽默彩蛋，含非官方合作说明。

### 展板预览与详情页

- 仅项目详情页标题下显示小号文字链接，新标签页直接打开高清 JPEG，允许浏览器放大。
- 映射文件：`src/project-boards.js`；图片：`public/assets/portfolio/boards/`。
- 共 7 个项目、10 张展板：家具 2 张、净化器 1 张、显微镜 1 张、跳绳 1 张、牙刷 1 张、青原印象 3 张、咖啡机 1 张。
- 原始文件夹：`/Users/Admin/Documents/作品集/`。展板输出最长边不超过 5000px，JPEG quality 88；只在打开链接时加载，不在主页加载。
- “藕展板2.jpg”（洪湖莲藕）没有对应项目，未接入。鼠标、呼吸器、药盒没有提供对应展板，不显示预览链接。
- 净化器正文中的完整展板 `/assets/portfolio/galleries/air-01.jpg` 已从本地实际内容、初始数据和线上实际内容中移除，保留其余 4 张正文图片及展板文字链接。原图片文件未物理删除。
- 所有项目的通用“这个项目关注什么”、三个标签及“查看方案与视觉细节”链接已删除。概览后直接进入图片区域。

## 4. 文件职责

| 文件 / 目录 | 用途 |
| --- | --- |
| `src/App.jsx`、`src/styles.css` | 首页、项目详情、路由、页面交互 |
| `src/PhotoGallery.jsx` / `.css` | 摄影画廊与图片弹窗 |
| `src/Admin.jsx` | 后台界面，按需加载 |
| `src/content-api.js` | 内容请求、超时及格式校验 |
| `src/projects.js`、`src/photography.json` | 首次运行时的初始内容 |
| `server/index.mjs` | 内容 API、管理员会话、上传、HTML 元信息与路由状态 |
| `shared/page-meta.js` | 浏览器与服务器共用元信息逻辑 |
| `public/assets/` | 静态作品、软件图标、材质与品牌文件 |
| `design/logo/` | 从首页 3D 提取的二维 Logo 源文件与预览 |
| `tests/`、`playwright.config.js` | 独立数据的接口和浏览器回归测试 |
| `deployment/` | 当前服务器的 Nginx、systemd、激活脚本 |

二维 Logo 的可发布副本在 `public/assets/brand/`，没有替换站点头像。

## 5. 数据与权限

实际内容不以 `src/projects.js` 为准：已有数据库后，修改初始数据不会自动更新线上内容。

- 本地默认数据：`server/data/`。
- 生产数据：`/home/crtyss/portfolio/data/`，由 `DATA_DIR` 指定。
- `content.json`：实际产品及摄影内容；`uploads/`：后台上传素材；`credentials.json`：密码哈希及签名密钥；`snapshots/`：修改前内容快照。
- 数据目录被 Git 忽略。不要把本地整个数据目录覆盖到线上，也不要提交凭据。
- 每次后台修改前自动快照，正常保存逻辑保留最近 30 份；快照不是异机灾备。
- 登录为 scrypt 密码校验、HTTP-only cookie、内存会话，重启后台会使既有登录失效。写入接口鉴权并检查请求来源。
- 上传通过 Sharp 解码、去元信息、缩放并生成缩略图；单文件最大 25MB。
- 删除/修改用户内容应通过后台或有针对性的备份与迁移完成，不能只在前端硬编码隐藏。

展板链接目前按项目 ID 静态映射，不在后台编辑表单中；新项目需要另行配置展板。

## 6. Ubuntu 运维与部署

| 项目 | 当前配置 |
| --- | --- |
| SSH | `ssh -p 8088 crtyss@111.8.201.55`；本机别名 `portfolio-ubuntu` |
| 公网网页 | `http://111.8.201.55:8089/` → Ubuntu Nginx 80 |
| 服务 | `crtyss-portfolio.service` |
| 活跃目录 | `/home/crtyss/portfolio/releases/20261029-technical` |
| Node | `/home/crtyss/portfolio/runtime/node/bin/node` |
| 后台监听 | `127.0.0.1:3001` |
| Nginx 静态目录 | `/var/www/lin-studio` |
| 部署配置目录 | `/home/crtyss/portfolio/deployment` |
| 最近完整更新前备份 | `/home/crtyss/backups/site-update-20261030-002901` |

备份路径时间为服务器生成，不据此推断用户本地时间。该备份含 `dist/`、`site/`、`data/`。

### 当前页面更新方式

本次更新未改后台代码和服务配置，无需重启服务或输入 sudo 密码：

1. 本地构建、检查并提交代码。
2. 在服务器备份现有发布目录的 `dist/`、Nginx 静态目录和数据目录。
3. 先上传构建资源到活跃目录的 `dist/`，同时同步 `dist/assets/` 到 `/var/www/lin-studio/assets/`。
4. 保留旧的带哈希文件，避免仍打开旧页面的访客请求失败；上传资源时不使用 `--delete`。
5. 将新 HTML 上传为临时文件，待资源齐全后通过 `mv` 原子替换活跃目录的 `dist/index.html` 和 `/var/www/lin-studio/index.html`。
6. 如涉及内容变化，先备份，定向修改实际数据；本次只移除了净化器 gallery 中的 `air-01.jpg`，没有覆盖其他作品。
7. 从公网验证主题、资源、详情、画廊、后台及未知路径 404。

Node 按请求读取 `dist/index.html`，因此本次页面更新不需要重启。Nginx 直接提供 `/assets/`，其余请求代理到 Node；两处发布资源必须保持匹配。只更新 `/var/www/lin-studio/index.html` 不足以更新实际页面。

### 后台或配置有变化时

需要一并同步后台、共享模块、初始内容、依赖和构建文件，并按锁文件安装服务器依赖。更换发布目录前先修改部署配置中的固定路径。

`deployment/activate.sh` 会安装配置、重启服务、验证并在失败时回滚。该脚本固定指向 `20261029-technical`，不能未经检查直接用于另一发布目录。sudo 需要用户的服务器账户密码，本机 SSH 免密不代表 sudo 免密。

需要用户执行系统级激活时，使用：

```sh
ssh -t -p 8088 crtyss@111.8.201.55 'sudo bash /home/crtyss/portfolio/deployment/activate.sh'
```

### 恢复

页面回滚：从选定备份恢复匹配的 `dist/` 与静态文件，再验证公网。服务配置变化按激活脚本的回滚逻辑处理。

内容回滚需另行决定恢复范围，避免用旧备份覆盖上线后新增的用户作品。不要为了回滚样式而自动恢复整个 `data/`；不要误重置管理员凭据。

## 7. 验证记录与复现

最近上线前运行以下回归，12 项通过，覆盖桌面 1440px 与手机 390px：

```sh
npm run build
npx playwright test -g 'presentation board|KFC|software icons loop|persistent home|first visit defaults'
```

公网另外验证：默认白天、15 个等大图标、KFC 新图和开关弹窗、净化器正文 4 张图、展板资源可访问、冗余区块移除、后台入口 200、未知项目 404。

全套验证命令为 `npm test`，包含独立临时数据的接口测试及 Playwright；最近一次上线只运行了上述相关回归，不要记录为本次执行过全部测试。

- 浏览器测试端口 3111；接口隔离测试端口 3112。
- macOS 默认使用已安装的 Google Chrome；可用 `CHROME_BIN` 指定。
- Linux 先执行 `npx playwright install --with-deps chromium`。
- GitHub Actions 在 push / PR 时配置了检查；交接时未读取最新远程 CI 结果，不将其写为已通过。
- 手机检查为浏览器模拟尺寸与触摸环境，未做真实 iPhone/Android 全量实机验收。

## 8. 已知限制与后续事项

- 线上仍为 HTTP，未启用 HTTPS。用户没有域名，公网 443 转发不能确认；证书、TLS 入口及自动续期都尚未配置。管理员登录传输的保护仍待解决。
- 部分依赖在 `package.json` 使用 `latest`，重装应执行 `npm ci`；升级依赖单独验证。
- 构建有 Three.js 大 chunk 提示及 lucide-react 的 `use client` 提示；目前构建成功，这些提示没有全部消除。
- 联系邮箱、公开简历、教育状态和奖项明细用户曾明确暂不补充，不自行编造。
- 后台内容与图片必须单独备份；本机和同服务器快照不能覆盖服务器磁盘损坏风险。
- 公网静态资源有缓存。替换图片建议使用新文件名，先上传资源再切换 HTML。

## 9. 近期提交索引

| 提交 | 修改 |
| --- | --- |
| `7b08fa5` | 首次访问默认白天模式 |
| `f9729b3` | 7 个项目的 10 张展板文字预览链接 |
| `fa493e8` | 移除净化器正文完整展板 |
| `42bfbdb` | KFC 图标夸张入场 |
| `d2deb23` | 统一改用用户提供的 KFC 图片 |
| `a0b278f` | 软件栏等大圆角矩形图标 |
| `a3bf26e` | 删除所有项目通用设计关注区块 |

相关操作说明另见 [README](./README.md) 与 [管理后台使用说明](./管理后台使用说明.md)。
