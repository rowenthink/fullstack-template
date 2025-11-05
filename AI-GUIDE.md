### **`AI-GUIDE.md` 完整模板**

```markdown
# AI 开发指南

> 本文档供 AI 助手参考，确保生成的代码符合项目规范

## 📚 技术栈

### 前端
- **运行时**: Bun
- **构建工具**: Vite 6
- **框架**: React 19 + TypeScript 5.7
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **状态管理**: TanStack Query (React Query)
- **路由**: TanStack Router
- **表单**: React Hook Form + Zod
- **HTTP**: native fetch

### 后端
- **框架**: ASP.NET Core 9
- **API 风格**: Minimal APIs
- **ORM**: Entity Framework Core 9
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **验证**: FluentValidation
- **认证**: ASP.NET Core Identity + JWT

### 工具链
- **包管理器**: Bun (前端) / NuGet (后端)
- **版本控制**: Git
- **代码格式化**: Prettier (前端) / dotnet format (后端)
- **类型共享**: NSwag (自动生成 TypeScript 类型)

---

## 📁 项目结构

```
fullstack-template/
├── frontend/                    # React 前端
│   ├── src/
│   │   ├── components/         # UI 组件
│   │   │   ├── ui/            # shadcn/ui 组件
│   │   │   └── features/      # 业务组件
│   │   ├── lib/
│   │   │   ├── api.ts         # API 客户端
│   │   │   └── utils.ts       # 工具函数
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── types/             # TypeScript 类型
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # ASP.NET Core 后端
│   ├── Controllers/            # (可选) 传统 Controller
│   ├── Endpoints/              # Minimal API 端点
│   │   ├── UserEndpoints.cs
│   │   └── AuthEndpoints.cs
│   ├── Models/                 # 数据模型
│   │   ├── User.cs
│   │   └── Post.cs
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── Migrations/
│   ├── DTOs/                   # 数据传输对象
│   │   ├── Requests/
│   │   └── Responses/
│   ├── Services/               # 业务逻辑层
│   │   ├── Interfaces/
│   │   └── Implementations/
│   ├── Middleware/             # 自定义中间件
│   ├── Program.cs
│   └── appsettings.json
│
├── docs/                        # 项目文档
├── scripts/                     # 自动化脚本
├── .gitignore
├── AI-GUIDE.md                  # 本文件
└── README.md
```

---

## 🎯 编码规范

### **通用原则**
1. **单一职责**: 每个文件/类只做一件事
2. **显式优于隐式**: 类型明确声明，避免 `any` 或 `object`
3. **错误处理**: 所有 async 函数必须处理异常
4. **命名规范**: 
   - 文件名: `kebab-case.ts` (前端), `PascalCase.cs` (后端)
   - 组件: `PascalCase`
   - 函数/变量: `camelCase`
   - 常量: `UPPER_SNAKE_CASE`

### **前端规范**

#### 1. React 组件
```tsx
// ✅ 正确：使用函数组件 + TypeScript
interface UserCardProps {
  user: User
  onEdit?: (id: number) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>Edit</button>
      )}
    </div>
  )
}

// ❌ 错误：使用类组件或缺少类型
export default function UserCard(props) {
  return <div>{props.user.name}</div>
}
```

#### 2. API 调用
```typescript
// ✅ 正确：使用 TanStack Query
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      return res.json() as Promise<User[]>
    }
  })
}

// ❌ 错误：直接在组件中 fetch
function MyComponent() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setData)
  }, [])
}
```

#### 3. 样式
```tsx
// ✅ 正确：使用 Tailwind + shadcn/ui
<Button variant="destructive" size="sm">
  Delete
</Button>

// ❌ 错误：内联样式或自定义 CSS 类
<button style={{ color: 'red' }}>Delete</button>
```

### **后端规范**

#### 1. Minimal API 端点
```csharp
// ✅ 正确：使用扩展方法组织端点
public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users")
            .WithOpenApi();

        group.MapGet("/", GetAllUsers);
        group.MapGet("/{id}", GetUserById);
        group.MapPost("/", CreateUser);
        group.MapPut("/{id}", UpdateUser);
        group.MapDelete("/{id}", DeleteUser);
    }

    private static async Task<IResult> GetAllUsers(AppDbContext db)
    {
        var users = await db.Users
            .Select(u => new UserDto(u.Id, u.Name, u.Email))
            .ToListAsync();
        return Results.Ok(users);
    }
}

// Program.cs
app.MapUserEndpoints();
```

#### 2. DTO 和验证
```csharp
// ✅ 正确：使用 record 和验证
public record CreateUserRequest(string Name, string Email);

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}

// ❌ 错误：直接使用实体类作为 DTO
public class User // 不要直接暴露实体
{
    public int Id { get; set; }
    public string PasswordHash { get; set; } // 敏感字段会被返回！
}
```

#### 3. 服务层
```csharp
// ✅ 正确：使用依赖注入
public interface IUserService
{
    Task<Result<UserDto>> GetUserByIdAsync(int id);
    Task<Result<UserDto>> CreateUserAsync(CreateUserRequest request);
}

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly ILogger<UserService> _logger;

    public UserService(AppDbContext db, ILogger<UserService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<Result<UserDto>> GetUserByIdAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null)
            return Result.Failure<UserDto>("User not found");
        
        return Result.Success(new UserDto(user.Id, user.Name, user.Email));
    }
}
```

---

## 🔧 开发工作流

### **1. 创建新功能**
```bash
# 1. 创建功能分支
git checkout -b feature/user-profile

# 2. 后端：添加实体和端点
cd backend
dotnet ef migrations add AddUserProfile
dotnet ef database update

# 3. 生成 TypeScript 类型
bun run generate-types

# 4. 前端：创建组件
cd ../frontend
# 在 src/components/features/ 创建组件

# 5. 测试
bun run dev  # 启动前后端
```

### **2. AI 辅助开发提示词模板**

#### 创建 CRUD 功能
```
基于项目的 AI-GUIDE.md 规范，使用 ASP.NET Core Minimal APIs 和 EF Core，
创建一个 Post (文章) 功能的完整 CRUD：

1. 后端 (backend/)：
   - Models/Post.cs (包含 Title, Content, UserId 外键)
   - Endpoints/PostEndpoints.cs (5个端点：GET all, GET by id, POST, PUT, DELETE)
   - DTOs/Requests/CreatePostRequest.cs 和 UpdatePostRequest.cs
   - DTOs/Responses/PostDto.cs
   - 更新 AppDbContext.cs

2. 数据库迁移：
   - 生成迁移的命令

3. 前端 (frontend/)：
   - types/post.ts (TypeScript 接口)
   - lib/api/posts.ts (API 调用函数)
   - hooks/usePosts.ts (TanStack Query hooks)
   - components/features/post-list.tsx (展示列表)
   - components/features/post-form.tsx (创建/编辑表单)

要求：
- 使用项目约定的命名和结构
- 包含完整的类型定义
- 使用 shadcn/ui 组件
- 添加适当的错误处理
```

#### 添加认证
```
按照 AI-GUIDE.md 规范，为项目添加 JWT 认证：

后端：
- 添加 ASP.NET Core Identity
- 创建 AuthEndpoints (login, register, refresh-token)
- 添加 JWT 中间件配置

前端：
- 创建 auth context (使用 React Context)
- 添加 login/register 表单
- 实现 token 存储和自动刷新
- 添加路由守卫

所有代码遵循项目的编码规范。
```

### **3. 提交代码**
```bash
# 格式化代码
cd frontend && bun run format
cd ../backend && dotnet format

# 提交
git add .
git commit -m "feat: add user profile feature"
git push origin feature/user-profile
```

---

## 🚫 禁止事项

### 前端
- ❌ 不要使用 `any` 类型
- ❌ 不要直接修改 `components/ui/` (shadcn/ui 生成的文件)
- ❌ 不要安装未经批准的 npm 包
- ❌ 不要使用内联样式
- ❌ 不要在组件中直接写 fetch (使用 TanStack Query)

### 后端
- ❌ 不要直接返回实体类 (Entity)，必须使用 DTO
- ❌ 不要在 Controller/Endpoint 中写业务逻辑 (放到 Service)
- ❌ 不要硬编码连接字符串 (使用 appsettings.json)
- ❌ 不要忽略异常 (至少记录日志)
- ❌ 不要在循环中执行数据库查询 (N+1 问题)

---

## 📦 依赖管理

### 添加新依赖前必须确认
1. 是否有更轻量的替代方案？
2. 是否与现有技术栈兼容？
3. 是否有长期维护？

### 前端允许的额外依赖
- UI: `recharts`, `@tanstack/react-table`
- 工具: `date-fns`, `clsx`
- 图标: `lucide-react`

### 后端允许的额外依赖
- 验证: `FluentValidation`
- 映射: `AutoMapper` (谨慎使用)
- 认证: `Microsoft.AspNetCore.Authentication.JwtBearer`

---

## 🐛 常见问题

### CORS 错误
```csharp
// backend/Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### EF Core 迁移失败
```bash
# 删除所有迁移
rm -rf backend/Data/Migrations

# 重新创建
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### TypeScript 类型不匹配
```bash
# 重新生成类型
bun run generate-types
```

---

## 🎓 学习资源

- [ASP.NET Core 文档](https://learn.microsoft.com/aspnet/core)
- [React 文档](https://react.dev)
- [shadcn/ui 组件](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)

---

## 📝 提交信息规范

```
<type>(<scope>): <subject>

type:
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式化
- refactor: 重构
- test: 测试
- chore: 构建/工具链

示例:
feat(auth): add JWT authentication
fix(api): resolve CORS issue
docs(readme): update installation steps
```

---

**最后更新**: 2025-11-05
**维护者**: [你的名字]
```

---

## **第二部分：脚手架项目构建**

### **🏗️ 脚手架目录结构**

```bash
fullstack-template/
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI/CD 配置
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui 组件 (自动生成)
│   │   │   └── features/
│   │   │       └── .gitkeep
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   └── .gitkeep
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── components.json            # shadcn/ui 配置
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── Endpoints/
│   │   ├── HealthEndpoints.cs     # 示例端点
│   │   └── .gitkeep
│   ├── Models/
│   │   └── .gitkeep
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── Migrations/
│   ├── DTOs/
│   │   ├── Requests/
│   │   └── Responses/
│   ├── Services/
│   │   ├── Interfaces/
│   │   └── Implementations/
│   ├── Middleware/
│   │   └── .gitkeep
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── backend.csproj
│   └── .editorconfig
│
├── scripts/
│   ├── setup.sh                   # 初始化脚本
│   ├── dev.sh                     # 开发启动脚本
│   └── generate-types.sh          # 类型生成脚本
│
├── docs/
│   ├── API.md                     # API 文档
│   └── DEPLOYMENT.md              # 部署文档
│
├── .gitignore
├── AI-GUIDE.md                    # AI 开发指南
├── README.md                      # 项目说明
└── package.json                   # 根目录脚本
```

---

### **📦 核心文件内容**

#### **1. `scripts/setup.sh`**

```bash
#!/bin/bash
set -e

echo "🚀 初始化 Fullstack Template..."

# 检查依赖
command -v bun >/dev/null 2>&1 || { echo "❌ Bun 未安装"; exit 1; }
command -v dotnet >/dev/null 2>&1 || { echo "❌ .NET SDK 未安装"; exit 1; }

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
bun install

# 初始化 shadcn/ui
echo "🎨 初始化 shadcn/ui..."
bunx shadcn@latest init -y

# 安装常用组件
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add input
bunx shadcn@latest add form
bunx shadcn@latest add toast

cd ..

# 恢复后端依赖
echo "📦 恢复后端依赖..."
cd backend
dotnet restore

# 安装 EF Core 工具
dotnet tool install --global dotnet-ef 2>/dev/null || echo "✓ dotnet-ef 已安装"

# 创建数据库
echo "🗄️  创建数据库..."
dotnet ef database update

cd ..

echo "✅ 初始化完成！"
echo ""
echo "启动开发服务器："
echo "  bun run dev"
```

#### **2. `scripts/dev.sh`**

```bash
#!/bin/bash

# 启动后端
cd backend
dotnet watch run &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端
cd ../frontend
bun run dev &
FRONTEND_PID=$!

# 捕获 Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 等待进程
wait
```

#### **3. 根目录 `package.json`**

```json
{
  "name": "fullstack-template",
  "version": "1.0.0",
  "scripts": {
    "setup": "bash scripts/setup.sh",
    "dev": "bash scripts/dev.sh",
    "dev:frontend": "cd frontend && bun run dev",
    "dev:backend": "cd backend && dotnet watch run",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && bun run build",
    "build:backend": "cd backend && dotnet publish -c Release",
    "format": "npm run format:frontend && npm run format:backend",
    "format:frontend": "cd frontend && bun run format",
    "format:backend": "cd backend && dotnet format"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

#### **4. `backend/Program.cs`**

```csharp
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 配置服务
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 中间件
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// 健康检查
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
    .WithTags("Health");

// 映射端点
app.MapHealthEndpoints();

app.Run();

// 使 Program 可测试
public partial class Program { }
```

#### **5. `backend/Data/AppDbContext.cs`**

```csharp
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // 添加你的 DbSet
    // public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // 配置实体
    }
}
```

#### **6. `backend/Endpoints/HealthEndpoints.cs`**

```csharp
public static class HealthEndpoints
{
    public static void MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/health")
            .WithTags("Health")
            .WithOpenApi();

        group.MapGet("/", () => Results.Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            version = "1.0.0"
        }));
    }
}
```

#### **7. `frontend/src/lib/api.ts`**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new ApiError(response.status, error || response.statusText)
  }
  return response.json()
}

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`)
    return handleResponse<T>(response)
  },

  post: async <T>(path: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse<T>(response)
  },

  put: async <T>(path: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse<T>(response)
  },

  delete: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE'
    })
    return handleResponse<T>(response)
  }
}
```

#### **8. `frontend/src/App.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import { api } from './lib/api'

interface HealthStatus {
  status: string
  timestamp: string
  version: string
}

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get<HealthStatus>('/api/health')
  })

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Fullstack Template</h1>
      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-2">Backend Status</h2>
        <pre className="bg-muted p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default App
```

#### **9. `.gitignore`**

```gitignore
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env.local

# Backend
backend/bin/
backend/obj/
backend/*.db
backend/*.db-shm
backend/*.db-wal

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

#### **10. `README.md`**

```markdown
# Fullstack Template

ASP.NET Core 9 + React 19 + TypeScript 全栈开发模板

## 技术栈

**前端**
- Bun + Vite 6
- React 19 + TypeScript
- shadcn/ui + Tailwind CSS
- TanStack Query

**后端**
- ASP.NET Core 9 Minimal APIs
- Entity Framework Core 9
- SQLite (开发) / PostgreSQL (生产)

## 快速开始

### 前置要求
- [Bun](https://bun.sh) >= 1.0
- [.NET SDK](https://dotnet.microsoft.com/download) >= 9.0

### 初始化
```bash
# 克隆模板
git clone https://github.com/your-username/fullstack-template.git my-project
cd my-project

# 运行初始化脚本
bun run setup
```

### 开发
```bash
# 同时启动前后端
bun run dev

# 前端: http://localhost:5173
# 后端: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### 构建
```bash
bun run build
```

## 项目结构

详见 [AI-GUIDE.md](./AI-GUIDE.md)

## 开发指南

在使用 AI 辅助开发时，请先阅读 [AI-GUIDE.md](./AI-GUIDE.md)，确保生成的代码符合项目规范。

## License

MIT
```

---

## **🚀 发布到 GitHub**

```bash
# 1. 创建 GitHub 仓库
# 在 GitHub 上创建新仓库: fullstack-template

# 2. 本地初始化
cd fullstack-template
git init
git add .
git commit -m "feat: initial commit - fullstack template"

# 3. 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/fullstack-template.git
git branch -M main
git push -u origin main

# 4. 添加 README badge
# 在 README.md 顶部添加:
# [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

---

## **📋 使用脚手架创建新项目**

```bash
# 方式1: 使用 GitHub Template
# 在 GitHub 仓库页面点击 "Use this template"

# 方式2: 手动克隆
git clone https://github.com/YOUR_USERNAME/fullstack-template.git my-new-project
cd my-new-project

# 删除 git 历史
rm -rf .git
git init

# 初始化
bun run setup

# 开始开发
bun run dev
```

---

## **🤖 AI 辅助开发流程**

### **Step 1: 告诉 AI 项目上下文**
```
我有一个使用 fullstack-template 脚手架创建的项目，
请先阅读项目根目录的 AI-GUIDE.md 文件，了解项目规范。

我需要添加一个用户管理功能...
```

### **Step 2: AI 生成代码**
AI 会基于 `AI-GUIDE.md` 的规范生成代码

### **Step 3: 复制粘贴运行**
直接复制 AI 生成的代码到对应位置

### **Step 4: 测试验证**
```bash
bun run dev
```

---

## **📊 完整检查清单**

- [ ] 创建 GitHub 仓库
- [ ] 添加 AI-GUIDE.md
- [ ] 配置 .gitignore
- [ ] 添加初始化脚本
- [ ] 配置前端基础结构
- [ ] 配置后端基础结构
- [ ] 添加健康检查端点
- [ ] 测试开发流程
- [ ] 编写 README
- [ ] 推送到 GitHub
- [ ] 设置为 Template Repository