# 问卷调查系统

基于 Vue3 + TypeScript + Supabase + Vercel 构建的现代化问卷调查应用。

## 功能特性

- ✅ 用户认证（注册/登录）
- ✅ 创建和管理问卷
- ✅ 多种题型支持（单选、多选、填空、下拉、评分）
- ✅ 公开/私密问卷
- ✅ 密码保护
- ✅ 实时统计分析
- ✅ 响应式设计

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **UI**: Tailwind CSS + 自定义组件
- **后端**: Supabase (PostgreSQL + Auth)
- **部署**: Vercel
- **路由**: Vue Router

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd survey-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在 SQL Editor 中执行 `supabase/schema.sql` 中的 SQL 脚本
3. 在 Project Settings > API 中获取:
   - Project URL
   - anon/public key

### 4. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入 Supabase 凭证：

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 配置环境变量:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. 点击 "Deploy"

## 项目结构

```
survey-app/
├── src/
│   ├── components/      # 可复用组件
│   │   └── ui/         # UI 组件
│   ├── composables/    # 组合式函数
│   ├── lib/           # 工具函数和配置
│   ├── router/        # 路由配置
│   ├── types/         # TypeScript 类型
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── supabase/
│   └── schema.sql     # 数据库架构
└── package.json
```

## 使用说明

### 创建问卷

1. 注册/登录账号
2. 点击"创建问卷"
3. 填写问卷标题和描述
4. 添加问题（支持多种题型）
5. 设置公开/私密
6. 点击"创建问卷"

### 填写问卷

1. 访问公开问卷列表
2. 选择问卷开始填写
3. 完成所有必填问题
4. 提交问卷

### 查看结果

1. 登录账号
2. 进入"我的问卷"
3. 点击"查看结果"
4. 查看统计分析

## 数据库架构

- `surveys` - 问卷表
- `questions` - 问题表
- `responses` - 响应表

## 贡献

欢迎提交 Issue 和 Pull Request！

## License

MIT
