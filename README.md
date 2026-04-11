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
3. 配置环境变量：
   - `PADDLE_WEBHOOK_SECRET`
   - `PADDLE_PRICE_LIFETIME`
   - `LICENSE_KEY_SECRET`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
4. 部署完成

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
