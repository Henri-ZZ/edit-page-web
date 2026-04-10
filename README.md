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
3. 部署完成

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
