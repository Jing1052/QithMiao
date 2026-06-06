# QithMiao · 我们的对话

把聊天记录（ChatGPT 导出的 JSON）收成手写信一样的样子来读、来存、来导出长图。
纯前端单页应用，数据只存在浏览器本地（IndexedDB `QithMiaoMiaoLogs`），**不往服务器传**。

## 能干嘛
- 导入对话 JSON（拖拽 / 选择文件，支持大文件流式解析）
- 一堆手写体/楷体渲染、自定义头像与昵称、聊天背景、屏蔽词、词云
- 全局搜索、收藏、导出长图
- **增量更新**：多次导入会按对话 id 自动去重合并，`update_time` 新的覆盖旧的——
  所以每次把更新过的记录再导一次，它只补新内容、不重复（上传框里也写着这句）。

## PWA（像 App 一样装手机）
- `manifest.json` + `sw.js` + `icons/`：可"添加到主屏幕"离线打开。
- 图标矢量源：`tools/icon_src.html`（暗金气泡猫＋月牙，呼应「我们的家」家徽）。
  重渲：用 playwright 截 `#c` 到 `icons/icon-512|192.png`、`apple-touch-icon.png`。

## 部署（单开一个网址）
纯静态站，根目录有 `index.html` 即可。任意静态托管都行：
- **Zeabur**：连这个 repo，识别为静态站直接发布（和「我们的家」一个平台、各自一个 URL）。
- **GitHub Pages**：Settings → Pages → 选分支根目录。
注意 `fonts/` 约 62MB，首次加载稍慢，之后被 Service Worker 缓存。
