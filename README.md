# Fullstack Template

🚀 ASP.NET Core 9 + React 19 + TypeScript 全栈开发模板

## ✨ 特性

- ⚡ **Bun** - 超快的 JavaScript 运行时
- ⚛️ **React 19** - 最新的 React 版本
- 🎨 **shadcn/ui** - 精美的 UI 组件
- 🔥 **ASP.NET Core 9** - 高性能后端框架
- 📦 **Minimal APIs** - 简洁的 API 设计
- 🗄️ **EF Core 9** - 强大的 ORM
- 🎯 **TypeScript** - 类型安全
- 🎨 **Tailwind CSS** - 实用优先的 CSS

## 📋 前置要求

- [Bun](https://bun.sh) >= 1.0
- [.NET SDK](https://dotnet.microsoft.com/download) >= 9.0

## 🚀 快速开始

### 1. 克隆模板

```bash
git clone https://github.com/YOUR_USERNAME/fullstack-template.git my-project
cd my-project
```

### 2. 初始化项目

```bash
bun run setup
```

这将会：
- 安装前端依赖
- 安装 shadcn/ui 组件
- 恢复后端依赖
- 创建数据库

### 3. 启动开发服务器

```bash
bun run dev
```

访问：
- 前端: http://localhost:5173
- 后端: http://localhost:5000
- Swagger: http://localhost:5000/swagger

## 📁 项目结构

```
fullstack-template/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── types/
│   └── package.json
│
├── backend/           # ASP.NET Core 后端
│   ├── Endpoints/
│   ├── Models/
│   ├── Data/
│   └── Program.cs
│
├── scripts/           # 自动化脚本
└── AI-GUIDE.md       # AI 开发指南
```

## 🤖 AI 辅助开发

本项目包含 `AI-GUIDE.md`，用于指导 AI 助手生成符合项目规范的代码。

在使用 AI 开发时，请告诉它：
```
请先阅读项目的 AI-GUIDE.md，然后帮我...
```

## 📚 可用命令

```bash
bun run setup          # 初始化项目
bun run dev            # 启动前后端
bun run dev:frontend   # 仅启动前端
bun run dev:backend    # 仅启动后端
bun run build          # 构建生产版本
bun run format         # 格式化代码
```

## 🛠️ 技术栈

### 前端
- React 19
- TypeScript 5.7
- Vite 6
- TanStack Query
- shadcn/ui
- Tailwind CSS

### 后端
- ASP.NET Core 9
- Entity Framework Core 9
- SQLite (开发)
- Minimal APIs

## 📖 文档

- [AI 开发指南](./AI-GUIDE.md) - AI 辅助开发规范
- [API 文档](./docs/API.md) - API 接口文档

## 📄 License

MIT

---

**Happy Coding! 🎉**