#!/bin/bash

echo "🚀 启动开发服务器..."
echo ""

# 启动后端
echo "📡 启动后端 (http://localhost:5000)..."
cd backend
dotnet watch run &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端 (http://localhost:5173)..."
cd ../frontend
bun run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 开发服务器已启动！"
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:5000"
echo "  Swagger: http://localhost:5000/swagger"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获 Ctrl+C
trap "echo ''; echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 等待进程
wait