# Edit Page Website

Astro 官网，支持中英文。

## 开发

```bash
pnpm install
pnpm dev
```

## 部署到 Vercel

1. 把代码推到 GitHub
2. 在 Vercel 导入项目
3. Node.js 版本：`package.json` 的 `engines.node` 已固定为 `24.x`，它会覆盖 Vercel 的
   `Settings > General > Node.js Version` 设置，无需手动改后台。
   Vercel 已计划在 2026-10-01 停用 Node 20，升级后请确认部署使用的是 24。
4. 在 Vercel 的 `Settings > Environment Variables` 配置环境变量：
    - `PADDLE_ENVIRONMENT`
    - `PADDLE_CLIENT_TOKEN`
    - `PADDLE_PRICE_LIFETIME`
    - `DATABASE_URL`
    - `CRON_SECRET`
5. 首次部署会为没有 Prisma 历史的旧数据库自动登记 baseline；随后
   `vercel-build` 会执行 `prisma migrate deploy` 并构建网站
6. 部署完成

## Vercel 环境变量

这些变量由首页的 Paddle 结账按钮在浏览器端使用：

- `PADDLE_ENVIRONMENT`
  Preview 环境填 `sandbox`，正式环境填 `production`
- `PADDLE_CLIENT_TOKEN`
  填 Paddle 对应环境的 client-side token。Sandbox 通常形如 `test_...`，正式环境通常形如 `live_...`
- `PADDLE_PRICE_LIFETIME`
  填 Paddle 里的 lifetime 价格 ID

遥测 API 使用：

- `DATABASE_URL`
  Neon Postgres 连接地址，仅在服务端使用
- `CRON_SECRET`
  用于保护每日数据保留清理任务的长随机字符串

## 遥测 API

接口为 `POST /api/telemetry/v1/batch`，协议及隐私边界见
[`docs/EDIT_PAGE_TELEMETRY_SPEC.md`](docs/EDIT_PAGE_TELEMETRY_SPEC.md)。

数据库初始化：

```bash
pnpm db:generate
pnpm db:migrate
```

旧 Neon 数据无需保留时，可在确认数据库地址无误后执行以下破坏性命令，重建当前 schema：

```bash
pnpm db:reset
```

接口采用与 Licentra 相同的普通 CORS 调用方式：只为
`chrome-extension://`、`moz-extension://`、`safari-web-extension://` 和
`extension://` Origin 返回跨域响应头，不使用 Cookie。插件调用此接口无需在 manifest
里声明 `editpage.henriz.dev` 的 `host_permissions`。普通网页 Origin 会被拒绝。

每日 Vercel Cron 会删除超过 30 天的幂等请求记录，以及超过 13 个月的汇总使用数据和非活跃安装记录。

## 检查

```bash
pnpm exec tsc --noEmit
pnpm test
pnpm build
```

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
