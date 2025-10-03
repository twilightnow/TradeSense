# TradeSense 维护指南

## 1. 项目概述
TradeSense 是一款基于 Vue 3 的单页应用，提供智能交易建议与扩展工具。当前版本包含：
- 主页：展示功能概览与导航入口
- 开单建议：模拟 AI 决策流程，输出建议、置信度与理由
- 量化策略分析：支持多币种与多策略（均线 / RSI / 动量 / 布林带）的实时评估
- 策略百科：策略知识库，列出主流策略的场景、优势与风险
- 统一布局：使用 Element Plus 提供的侧边栏 + 头部 + 内容区结构

## 2. 技术栈
- 框架：Vue 3 (`script setup`)
- 构建工具：Vite 6
- UI 组件：Element Plus（含 `@element-plus/icons-vue`）
- 路由：Vue Router 4
- 包管理：npm

## 3. 目录结构
```
TradeSense/
├── docs/                # 说明文档
│   └── pages/            # 各子页面的详细设计说明
├── public/              # 静态资源
├── src/
│   ├── assets/          # 静态资源（按需添加）
│   ├── components/      # 通用组件
│   ├── router/          # 路由配置
│   ├── services/        # 与外部数据交互的服务模块
│   ├── views/           # 页面组件（Home、Dashboard、QuantStrategy、StrategyWiki 等）
│   ├── App.vue          # 布局与导航
│   └── main.js          # 应用入口
├── index.html
├── package.json
└── vite.config.js
```

## 4. 开发流程
```
# 安装依赖（首次或依赖更新后）
npm install

# 启动本地开发（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

> 提示：如需减小构建体积，可使用 Element Plus 的按需引入或组件自动导入插件。

## 5. 部署建议
- 将 `dist/` 目录上传至任意静态站点托管（如 Vercel、Netlify、OSS）
- 部署前可在 `vite.config.js` 中设置 `base` 以匹配部署路径
- 如需服务端渲染或接口代理，可引入 Node/Koa 等后端服务，并在维护文档中补充

## 6. 常见维护任务
- 新增页面：在 `src/views/` 下创建组件，并在 `src/router/index.js` 中注册路由与侧边菜单
- UI 扩展：优先使用 Element Plus 组件，保持视觉一致
- 接入 API：将请求封装在独立的 service 模块，避免在视图中直接调用
- 量化策略：策略逻辑位于 `src/views/QuantStrategy.vue`（含自动推荐、布林带、仓位建议等），行情服务位于 `src/services/market.js`，缓存 TTL 默认为 5 分钟
- 配置管理：在根目录创建 `.env` 系列文件，并记录在文档中

## 7. 未来迭代记录
- AI 工具实验室：规划接入常见 AI 能力（问答、行情总结等）
- 国际化：后续可引入 `vue-i18n` 支持中英文切换
