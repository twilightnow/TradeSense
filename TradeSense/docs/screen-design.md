# 界面设计说明

## 1. 全局布局
- 框架：`el-container` 组合侧边栏 + 顶部头部 + 主内容区
- 侧边栏宽度：220px，始终固定在左侧
- 顶部头部：展示当前系统名称，可扩展放置用户信息、面包屑
- 主内容区：随路由切换更新，仅渲染对应页面组件

### 视觉规范
- 背景色：`#f5f7fa`
- 主文字色：`#303133`
- 高亮主色：`#409eff`（Element Plus 默认主题色）
- 字体：'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system sans-serif

## 2. 导航菜单
- 组件：Element Plus `el-menu`
- 行为：
  - `router` 模式，点击自动跳转路由
  - 根据当前路由高亮对应菜单项
- 当前菜单项：
  1. 主页（`/`）
  2. 开单建议（`/trade-advice`）
  3. 量化策略（`/quant-strategy`）
  4. 策略百科（`/strategy-wiki`）
- 后续可在此处追加 AI 工具等条目

## 3. 子页面设计指引
每个子页面的详细信息拆分到独立文档，便于协作更新：
- [主页（Home）](pages/home.md)
- [开单建议（Trade Advice）](pages/trade-advice.md)
- [量化策略分析（Quant Strategy）](pages/quant-strategy.md)
- [策略百科（Strategy Wiki）](pages/strategy-wiki.md)
- [AI 工具实验室（规划中）](pages/ai-lab.md)

量化策略页面在控制区提供币种与策略选择、交易模式（现货/永续）、杠杆、周期、风险/仓位配置等输入项，按需触发按钮，并在结果区输出走势判断、策略推荐、关键价位、仓位建议及多指标卡片。

策略百科页面提供卡片式知识库，用于浏览常见策略的适用场景与风险提示。

以上页面说明包含目标、信息结构、交互流程与迭代建议。

## 4. 适配与响应式
- 侧边栏在桌面端保持固定；移动端可在后续迭代中切换为抽屉式菜单
- 主内容卡片使用 `grid` 与 `flex` 自适应不同屏幕宽度
- 按钮与文字大小遵循 Element Plus 默认响应式策略
