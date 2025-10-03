# TradeSense

TradeSense 是一个基于 Vue 3 + Vite 构建的智能交易助手前端项目，当前聚焦于开单建议场景，并预留 AI 工具等拓展模块。

## 功能概览
- **主页**：模块概览、状态说明、快捷入口
- **开单建议**：模拟 AI 输出多空建议、置信度与理由
- **量化策略**：按需抓取 BTC / ETH / SOL 行情，可配置现货/永续、杠杆、交易周期，支持双均线、RSI、动量、布林带等策略
- **策略百科**：总结热门策略的适用场景与风险提示
- **统一布局**：Element Plus 提供的侧边栏导航与内容区域

## 运行方式
```
npm install
npm run dev
```

更多开发、部署与界面说明请查看 `docs/` 目录：
- `docs/requirements.md`：需求与范围
- `docs/screen-design.md`：界面与交互设计
- `docs/maintenance.md`：维护、部署、迭代建议
