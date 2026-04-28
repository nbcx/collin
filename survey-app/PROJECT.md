# 问卷调查系统 - 项目概览

## 项目信息

- **项目名称**: 问卷调查系统
- **技术栈**: Vue3 + TypeScript + Supabase + Vercel
- **开发状态**: ✅ 完成
- **部署方式**: 完全免费（Supabase 免费版 + Vercel 免费版）

## 核心功能

### 1. 用户系统
- 用户注册
- 用户登录
- 身份验证（Supabase Auth）
- 会话管理

### 2. 问卷管理
- 创建问卷
- 编辑问卷
- 删除问卷
- 我的问卷列表

### 3. 问题类型
- **单选题**: 从多个选项中选择一个
- **多选题**: 从多个选项中选择多个
- **填空题**: 文本输入
- **下拉题**: 下拉菜单选择
- **评分题**: 1-5 分评分

### 4. 问卷设置
- 公开/私密模式
- 密码保护
- 问卷标题和描述
- 必填/选填设置

### 5. 问卷填写
- 公开问卷列表
- 密码验证
- 问题展示
- 答案提交

### 6. 数据统计
- 回收数量统计
- 选择题投票统计（百分比）
- 评分题平均分
- 填空题答案列表
- 可视化图表展示

## 文件结构

```
survey-app/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Button.vue       # 按钮组件
│   │       ├── Input.vue        # 输入框组件
│   │       ├── Card.vue         # 卡片组件
│   │       └── Label.vue        # 标签组件
│   ├── composables/
│   │   └── useAuth.ts          # 认证逻辑
│   ├── lib/
│   │   ├── supabase.ts         # Supabase 客户端
│   │   └── utils.ts            # 工具函数
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── types/
│   │   └── index.ts            # TypeScript 类型
│   ├── views/
│   │   ├── Home.vue            # 首页
│   │   ├── Login.vue           # 登录页
│   │   ├── Register.vue        # 注册页
│   │   ├── CreateSurvey.vue    # 创建问卷
│   │   ├── TakeSurvey.vue      # 填写问卷
│   │   ├── MySurveys.vue       # 我的问卷
│   │   └── SurveyResults.vue   # 问卷结果
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── style.css               # 全局样式
├── supabase/
│   └── schema.sql              # 数据库架构
├── .env.example                # 环境变量示例
├── vercel.json                 # Vercel 配置
├── vite.config.ts              # Vite 配置
├── package.json
├── README.md
└── SETUP.md                    # 设置指南
```

## 数据库设计

### surveys 表
```sql
- id: UUID (主键)
- title: TEXT (标题)
- description: TEXT (描述)
- creator_id: UUID (创建者)
- is_public: BOOLEAN (是否公开)
- password: TEXT (访问密码)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### questions 表
```sql
- id: UUID (主键)
- survey_id: UUID (外键)
- type: TEXT (题型)
- title: TEXT (问题标题)
- options: TEXT[] (选项数组)
- required: BOOLEAN (是否必填)
- order: INTEGER (排序)
- created_at: TIMESTAMP
```

### responses 表
```sql
- id: UUID (主键)
- survey_id: UUID (外键)
- answers: JSONB (答案数据)
- submitted_at: TIMESTAMP
```

## 路由配置

- `/` - 首页（公开问卷列表）
- `/login` - 登录页
- `/register` - 注册页
- `/create` - 创建问卷（需要登录）
- `/survey/:id` - 填写问卷
- `/survey/:id/results` - 问卷结果（需要登录）
- `/my-surveys` - 我的问卷（需要登录）

## 安全特性

- Row Level Security (RLS) 启用
- 用户只能访问自己的问卷
- 公开问卷可被所有人查看
- 密码保护的问卷需要验证
- API 密钥通过环境变量管理

## 性能优化

- Vue3 Composition API
- 路由懒加载
- 组件按需导入
- Tailwind CSS 按需生成
- Vite 快速构建

## 响应式设计

- 移动端友好
- 平板适配
- 桌面端优化
- 使用 Tailwind 响应式类

## 未来扩展

- [ ] 问卷模板
- [ ] 问卷导出（PDF/Excel）
- [ ] 更多图表类型
- [ ] 问卷逻辑跳转
- [ ] 邮件通知
- [ ] 多语言支持
- [ ] 主题切换
- [ ] 数据导出

## 成本估算

### Supabase 免费版
- 500MB 数据库存储
- 1GB 文件存储
- 50万次 Edge Function 调用/月
- 2GB 带宽/月

### Vercel 免费版
- 无限部署
- 100GB 带宽/月
- 6000小时执行时间/月

**预计可支持**: 日活 100-500 用户

## 技术亮点

1. **完全免费**: 使用 Supabase + Vercel 免费套餐
2. **类型安全**: 全栈 TypeScript
3. **现代化**: Vue3 + Vite + Composition API
4. **安全性**: Supabase RLS + JWT 认证
5. **响应式**: Tailwind CSS + 移动优先
6. **可扩展**: 模块化设计，易于扩展

## 开发时间

- 总开发时间: 约 2-3 小时
- 代码行数: ~1500 行
- 组件数量: 11 个
- 页面数量: 7 个

## 贡献者

- 开发: Collin & Claude Code
- 技术栈: Vue3, TypeScript, Supabase, Vercel

---

**开始使用**: 查看 SETUP.md
**问题反馈**: 提交 Issue
**功能建议**: 提交 Pull Request
