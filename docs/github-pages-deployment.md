# GitHub Pages Deployment Record

记录日期：2026-07-05（Asia/Shanghai）

## 当前线上信息

- 线上地址：https://inwaylaw.github.io/
- GitHub 仓库：https://github.com/inwaylaw/inwaylaw.github.io
- 仓库可见性：Public
- 默认分支：`main`
- GitHub Pages 发布源：`main` / `/ (root)`
- 首次上线提交：`5101f5d`，`Publish personal website`

## 已完成事项

- 创建 GitHub 用户站点仓库 `inwaylaw/inwaylaw.github.io`。
- 将本地静态站点推送到 `origin/main`。
- 启用 GitHub Pages，从 `main` 分支根目录发布。
- 添加 `.nojekyll`，明确按纯静态站点发布。
- 添加 `.gitignore`，避免发布 `.agents/`、`.codex/` 和本地备份页。
- 添加 `assets/favicon.svg`，浏览器标签页使用向日葵 logo。

## 上线验证

- GitHub Pages 部署页显示 `Active / Deployed`。
- 根地址 `https://inwaylaw.github.io/` 返回 HTTP `200`。
- 页面标题验证为 `AI for Love | Personal Portfolio`。
- 线上 favicon 文件 `https://inwaylaw.github.io/assets/favicon.svg` 返回 HTTP `200`。

## 当前站点形态

- 无构建步骤，直接发布仓库根目录静态文件。
- 入口文件：`index.html`
- 样式文件：`styles.css`
- 交互文件：`script.js`
- 图片、视频和 favicon：`assets/`
- 视觉资产生成辅助脚本：`tools/generate-assets.ps1`

## 后续更新流程

1. 修改本地文件。
2. 本地检查主要页面、资源引用和移动端布局。
3. 提交变更：

   ```powershell
   git add -- <changed-files>
   git commit -m "Update personal website"
   ```

4. 推送上线：

   ```powershell
   git push origin main
   ```

5. 访问 `https://inwaylaw.github.io/` 确认线上页面更新。

## 注意事项

- 这是 GitHub 用户站点仓库，仓库名必须保持 `inwaylaw.github.io` 才会发布到根域名。
- 如果改用自定义域名，需要在 GitHub Pages 设置里配置 Custom domain，并补充 DNS 记录。
- 联系区二维码位于弹窗内，并使用 lazy loading；未打开弹窗前浏览器可能不会立即加载二维码图片，这是正常行为。
