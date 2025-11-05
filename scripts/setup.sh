#!/bin/bash
set -e

echo "🚀 初始化 Fullstack Template..."

# 检查依赖
command -v bun >/dev/null 2>&1 || { echo "❌ Bun 未安装. 访问 https://bun.sh"; exit 1; }
command -v dotnet >/dev/null 2>&1 || { echo "❌ .NET SDK 未安装. 访问 https://dotnet.microsoft.com/download"; exit 1; }

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
bun install

echo "🎨 安装 shadcn/ui 组件..."
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add card
bunx --bun shadcn@latest add input
bunx --bun shadcn@latest add form
bunx --bun shadcn@latest add toast

cd ..

# 恢复后端依赖
echo "📦 恢复后端依赖..."
cd backend
dotnet restore

# 安装 EF Core 工具
echo "🔧 安装 EF Core 工具..."
dotnet tool install --global dotnet-ef 2>/dev/null || echo "✓ dotnet-ef 已安装"

# 创建数据库
echo "🗄️  创建数据库..."
dotnet ef database update

cd ..

echo ""
echo "✅ 初始化完成！"
echo ""
echo "启动开发服务器："
echo "  bun run dev"
echo ""
echo "或分别启动："
echo "  前端: bun run dev:frontend"
echo "  后端: bun run dev:backend"