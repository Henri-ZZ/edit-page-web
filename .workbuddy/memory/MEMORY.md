# Edit Page 官网（editpage.henriz.dev）项目备忘

## 术语规范（全站统一，勿混用）

- 扩展里的设置页面一律称 **Dashboard / 控制面板**，禁止用「设置页 / Settings」（页面级入口）。
- License 术语：英文统一 `License key`（小写 k），中文统一 `激活码`。禁止「License Key」大写、禁止中英混用。
- 套餐名称保持：`Perpetual License / 永久授权`。

## 工程要点

- Astro SSR（output: server + @astrojs/vercel/serverless），i18n 路由 en 默认无前缀 / zh 走 /zh/ 前缀。
- 本机托管 npm 损坏（walk-up-path 缺失），构建需用系统 npm：`/opt/homebrew/bin/npm run build`。
- 语言偏好：localStorage 键 `edit-page-lang`；首次访问跟随 navigator.language（zh*→zh），无记录时自动重定向，兜底 en；切换经导航下拉 select（id=locale-switcher）。
- 定价：Premium 永久版 ¥59 / $9.99，Paddle 结账（data-plan="lifetime"），license 3 台封顶。
- 页面文案集中：HomePage.astro 内联 zh/en 两套 c 对象；政策页走 src/i18n/en.ts + zh.ts；购买邮件文案在 src/lib/resend.ts。
