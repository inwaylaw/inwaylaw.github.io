# AI for Love Portfolio

一个无依赖的静态个人作品集网站基础版。当前主题为 AI for Love：在梵高作品的麦田金、浅青天空、柏树绿和柔和笔触中提取配色，并加入克制的动态笔触背景，收束成温暖、亲切、可信的 PC/手机响应式版本。

## 预览

直接在浏览器打开 `index.html` 即可预览。

也可以用任意静态服务器：

```powershell
python -m http.server 5173
```

然后访问 `http://localhost:5173/`。

## 后续可替换内容

- `index.html`：姓名、邮箱、简历经历、作品案例、公开链接
- `styles.css`：颜色、字体、间距、断点
- `script.js`：首屏背景、滚动出现、移动端菜单
- `assets/`：首屏、作品、肖像视觉图
- `tools/generate-assets.ps1`：重新生成当前本地 PNG 视觉资产
- `PRODUCT.md`：记录当前品牌 register、用户、审美边界和设计原则

当前没有在目录中发现简历文件，因此文案先按“AI startup 创业者”身份和已知产品方向搭建。后续可以把真实简历内容补进页面。
