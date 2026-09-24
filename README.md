# Edit Page Website

Astro 官网，支持中英文。

## 开发

```bash
npm install
npm run dev
```

## 部署到 Vercel

1. 把代码推到 GitHub
2. 在 Vercel 导入项目
3. Node.js 版本：`package.json` 的 `engines.node` 已固定为 `24.x`，它会覆盖 Vercel 的
   `Settings > General > Node.js Version` 设置，无需手动改后台。
   Vercel 已计划在 2026-10-01 停用 Node 20，升级后请确认部署使用的是 24。
4. 在 Vercel 的 `Settings > Environment Variables` 配置前端结账所需的环境变量：
    - `PADDLE_ENVIRONMENT`
    - `PADDLE_CLIENT_TOKEN`
    - `PADDLE_PRICE_LIFETIME`
5. 部署完成

## Vercel 环境变量

这些变量由首页的 Paddle 结账按钮在浏览器端使用：

- `PADDLE_ENVIRONMENT`
  Preview 环境填 `sandbox`，正式环境填 `production`
- `PADDLE_CLIENT_TOKEN`
  填 Paddle 对应环境的 client-side token。Sandbox 通常形如 `test_...`，正式环境通常形如 `live_...`
- `PADDLE_PRICE_LIFETIME`
  填 Paddle 里的 lifetime 价格 ID

## 目录结构

```
src/
├── i18n/          # 翻译文件
├── layouts/       # 布局组件
├── lib/           # 共享工具
├── components/    # 页面组件
└── pages/         # 页面
    ├── index.astro
    ├── terms.astro
    ├── refund.astro
    ├── privacy.astro
    └── zh/        # 中文页面
```
