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
3. 在 Vercel 的 `Settings > General` 里把 `Node.js Version` 设为 `20.x`
4. 在 Vercel 的 `Settings > Environment Variables` 配置环境变量：
    - `PADDLE_API_KEY`
    - `PADDLE_WEBHOOK_SECRET`
    - `PADDLE_ENVIRONMENT`
    - `PADDLE_CLIENT_TOKEN`
    - `PADDLE_PRICE_LIFETIME`
    - `LICENSE_KEY_SECRET`
    - `RESEND_API_KEY`
    - `RESEND_FROM_EMAIL`
5. 部署完成

## Vercel 环境变量

测试 Paddle Sandbox 时，直接把 Sandbox 的值填进 Vercel：

- `PADDLE_WEBHOOK_SECRET`
  填 Paddle Sandbox webhook endpoint 对应的 signing secret，通常形如 `pdl_ntfset_...`
- `PADDLE_API_KEY`
  填 Paddle 后端 API key，供 webhook 通过 `customer_id` 查询 customer email。必须是服务端 key，通常形如 `pdl_sdbx_apikey_...`
- `PADDLE_ENVIRONMENT`
  Preview 环境填 `sandbox`，将来正式环境填 `production`
- `PADDLE_CLIENT_TOKEN`
  填 Paddle 对应环境的 client-side token。Sandbox 通常形如 `test_...`，正式环境通常形如 `live_...`
- `PADDLE_PRICE_LIFETIME`
  填 Paddle 里的 lifetime 价格 ID，前端 checkout 和 webhook 都会用这一个值
- `LICENSE_KEY_SECRET`
  填一个你自己生成的长随机字符串，比如 `openssl rand -base64 32`
- `RESEND_API_KEY`
  填 Resend 后台生成的 API Key，通常形如 `re_...`
- `RESEND_FROM_EMAIL`
  填你在 Resend 已验证域名下的发件地址，建议带显示名，比如 `Edit Page License <noreply@mail.yourdomain.com>`
- `RESEND_REPLY_TO`
  可选，填你想接收用户回复的邮箱

建议：

1. 如果你现在只是联调 Sandbox，先把这些变量加到 Vercel 的 `Preview` 环境
2. Preview 环境里把 `PADDLE_ENVIRONMENT` 填成 `sandbox`
3. 把 Paddle Sandbox webhook URL 指向这次部署的域名：`https://你的域名/api/paddle-webhook`
4. 等 Sandbox 测通后，再把正式环境的值单独填进 `Production`，并把 `PADDLE_ENVIRONMENT` 改成 `production`

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
