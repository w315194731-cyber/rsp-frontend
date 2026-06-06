# RSP Frontend

Batch background removal tool — React + Vite frontend, deployed on Cloudflare Pages.

## 开发

```bash
npm install
npm run dev      # 本地开发
npm run build   # 构建生产版本
```

## 部署

部署由 CI/CD 或 `wrangler pages deploy` 完成，无需手动操作。

## 环境变量

- `VITE_API_URL` — 后端 API 地址（默认指向 Cloudflare Workers）