# 快速设置指南

## 步骤 1: 设置 Supabase

1. 访问 https://supabase.com 并注册账号
2. 点击 "New Project" 创建新项目
3. 等待项目创建完成（约 2 分钟）

## 步骤 2: 执行数据库脚本

1. 在 Supabase 项目中，点击左侧菜单的 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase/schema.sql` 的内容
4. 粘贴到编辑器中
5. 点击 "Run" 执行脚本

## 步骤 3: 获取 API 凭证

1. 点击左侧菜单的 "Settings" > "API"
2. 复制以下信息：
   - Project URL
   - anon/public key

## 步骤 4: 配置本地环境

1. 复制 `.env.example` 为 `.env`:
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入步骤 3 获取的信息：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 步骤 5: 启动应用

1. 安装依赖（如果还没安装）:
```bash
npm install
```

2. 启动开发服务器:
```bash
npm run dev
```

3. 访问 http://localhost:5173

## 步骤 6: 部署到 Vercel

1. 将代码推送到 GitHub
2. 访问 https://vercel.com 并登录
3. 点击 "Add New Project"
4. 导入你的 GitHub 仓库
5. 在 "Environment Variables" 中添加:
   - `VITE_SUPABASE_URL`: 你的 Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: 你的 Supabase anon key
6. 点击 "Deploy"

## 测试应用

1. 注册一个新账号
2. 创建一个测试问卷
3. 添加几个不同类型的问题
4. 保存并获取分享链接
5. 用另一个浏览器或无痕模式填写问卷
6. 查看统计结果

## 常见问题

### Q: 数据库连接失败？
A: 检查 `.env` 文件中的 URL 和 key 是否正确

### Q: 无法创建问卷？
A: 确保已执行 `supabase/schema.sql` 脚本

### Q: 部署后无法访问？
A: 检查 Vercel 环境变量是否正确配置

## 功能清单

- ✅ 用户注册/登录
- ✅ 创建问卷
- ✅ 多种题型（单选、多选、填空、下拉、评分）
- ✅ 公开/私密问卷
- ✅ 密码保护
- ✅ 问卷填写
- ✅ 结果统计分析
- ✅ 响应式设计

## 下一步

- 添加问卷导出功能
- 支持问卷模板
- 添加更多图表类型
- 支持问卷逻辑跳转
- 添加邮件通知功能
