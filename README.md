# AI Talent Evaluation Platform

AI 人才评测笔试平台 — 基于 React + TypeScript + Vite 构建的可交互 Demo。

## 产品概述

面向校招/社招场景的在线笔试系统，支持 4 种 AI 评测题型：

- **题型 A — 需求到交付**：给定需求描述和 starter code，候选人使用 AI 辅助完成编码（20min, 权重 30%）
- **题型 B — AI 代码找茬**：找出 AI 生成代码中的 Bug 并修复（15min, 权重 30%）
- **题型 C — 方案评审**：评审技术架构方案，回答可靠性/扩展性/安全性问题（5min, 权重 15%）
- **题型 D — 快速学习**：在限定时间内学习新技术并完成集成（5min, 权重 25%）

## 评分体系

- **L1 自动判分**（50%）：测试通过率 + 代码质量分析
- **L2 AI 行为分析**（50%）：Prompt 策略、Debug 独立性、任务拆解能力、AI 依赖度

## 页面结构

| 页面 | 路由 | 说明 |
|------|------|------|
| HR 管理台 | `/` | 批次概览、分数分布、评测入口 |
| 候选人入场 | `/exam/:id` | 身份验证 → 规则确认 → 就绪 |
| 沙箱作答 | `/exam/:id/sandbox` | 代码编辑器 + AI 对话 + 终端 |
| 交卷确认 | `/exam/:id/submission` | 作答确认 → AI 评分动画 |
| 结果详情 | `/hr/results/:id` | L1/L2 评分、行为数据、异常标记 |

## 技术栈

- React 19 + TypeScript
- Vite 8
- Monaco Editor（代码编辑）
- Lucide React（图标）
- HashRouter（兼容 GitHub Pages）

## 本地运行

```bash
npm install
npm run dev
```

## 在线 Demo

部署于 GitHub Pages：[在线体验](https://github.com/ai-talent-eval-demo)
