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
3. 在 Vercel 的 `Settings > Environment Variables` 配置环境变量：
    - `PADDLE_WEBHOOK_SECRET`
    - `PADDLE_PRICE_LIFETIME`
    - `PUBLIC_PADDLE_ENV`
    - `PUBLIC_PADDLE_CLIENT_TOKEN`
    - `PUBLIC_PADDLE_PRICE_LIFETIME`
    - `LICENSE_KEY_SECRET`
    - `RESEND_API_KEY`
    - `RESEND_FROM_EMAIL`
4. 部署完成

## Vercel 环境变量

测试 Paddle Sandbox 时，直接把 Sandbox 的值填进 Vercel：

- `PADDLE_WEBHOOK_SECRET`
  填 Paddle Sandbox webhook endpoint 对应的 signing secret，通常形如 `pdl_ntfset_...`
- `PADDLE_PRICE_LIFETIME`
  填 Paddle Sandbox 里的 lifetime 价格 ID，通常形如 `pri_...`
- `PUBLIC_PADDLE_ENV`
  Preview 环境填 `sandbox`，将来正式环境填 `production`
- `PUBLIC_PADDLE_CLIENT_TOKEN`
  填 Paddle 对应环境的 client-side token。Sandbox 通常形如 `test_...`，正式环境通常形如 `live_...`
- `PUBLIC_PADDLE_PRICE_LIFETIME`
  填前端 checkout 要使用的 lifetime 价格 ID。通常和 `PADDLE_PRICE_LIFETIME` 保持一致
- `LICENSE_KEY_SECRET`
  填一个你自己生成的长随机字符串，比如 `openssl rand -base64 32`
- `RESEND_API_KEY`
  填 Resend 后台生成的 API Key，通常形如 `re_...`
- `RESEND_FROM_EMAIL`
  填你在 Resend 已验证域名下的发件地址，比如 `Edit Page <noreply@mail.yourdomain.com>`
- `RESEND_REPLY_TO`
  可选，填你想接收用户回复的邮箱

建议：

1. 如果你现在只是联调 Sandbox，先把这些变量加到 Vercel 的 `Preview` 环境
2. Preview 环境里把 `PUBLIC_PADDLE_ENV` 填成 `sandbox`
3. 把 Paddle Sandbox webhook URL 指向这次部署的域名：`https://你的域名/api/paddle-webhook`
4. 等 Sandbox 测通后，再把正式环境的值单独填进 `Production`，并把 `PUBLIC_PADDLE_ENV` 改成 `production`

## Paddle Webhook

项目提供 `POST /api/paddle-webhook`，用于接收 Paddle 的 `transaction.completed` webhook。

处理流程：

1. 校验 `Paddle-Signature`
2. 根据订单生成稳定的授权码
3. 通过 Resend 邮件 API 发送给用户

## 目录结构

```
src/
├── i18n/          # 翻译文件
├── layouts/       # 布局组件
└── pages/         # 页面
    ├── index.astro
    ├── terms.astro
    ├── refund.astro
    ├── privacy.astro
    └── zh/        # 中文页面
```
