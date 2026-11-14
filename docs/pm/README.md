# PM 工作区（Paw 系列产品管理）

这里是整个 Paw 系列的产品管理文档，由 **PM agent**（`.claude/agents/pm.md`）维护。

| 文件 | 内容 |
|---|---|
| [01-vision-strategy.md](01-vision-strategy.md) | 愿景、产品组合、战略押注、产品原则、不做什么 |
| [02-customers.md](02-customers.md) | 客户细分、要完成的任务（JTBD）、调研证据、Kano、画像、待验证的问题 |
| [03-market-competitors.md](03-market-competitors.md) | 市场规模、竞品对比、我们的空白与定位、变现模式 |
| [04-process.md](04-process.md) | **产品开发流程**：6 个阶段与关口、需求一页纸、排序方法、节奏、完成的定义 |
| [05-roadmap.md](05-roadmap.md) | **路线图**：Now/Next/Later、P0–P7 分阶段、退出标准、依赖、需要你决定的事 |
| [06-backlog.md](06-backlog.md) | **需求池**：84 项，RICE + Kano + MoSCoW |
| [07-launch-checklist.md](07-launch-checklist.md) | 网页与 iOS 的上线清单（含苹果审核要求） |
| [08-metrics-and-research.md](08-metrics-and-research.md) | 北极星指标、漏斗、埋点、访谈提纲、假设清单 |
| [09-risks-decisions.md](09-risks-decisions.md) | 风险登记、决策日志、待决问题 |
| [10-cross-project.md](10-cross-project.md) | 与 Paw Track（老婆的项目）的协同约定与待确认的问题 |

## 怎么用 PM agent

在对话里直接说，例如：
- “**PM：本周复盘**”→ 读反馈、指标、路线图，给出周报和下周的 1–3 件事。
- “**PM：评估这个新想法：……**”→ 按问题、证据、RICE 评估，并给出放进哪个阶段。
- “**PM：更新路线图**”→ 根据最新进展调整 Now/Next/Later 和需求池。
- “**PM：写一页纸需求：……**”→ 按 `04-process.md` 的模板写 PRD。
- “**PM：竞品更新**”→ 上网查竞品最新动作并更新 `03`。
- “**PM：准备上线**”→ 对照 `07-launch-checklist.md` 逐项检查还缺什么。

## 原则

1. **客户先于功能**：每个需求都要有“谁、什么场景、什么证据”。
2. **证据与假设分开标注**：不编造数据；估算要写明是估算。
3. **一个主攻产品**：同一时间只主攻一个，按阶段与退出标准推进。
4. **文档要跟着现实更新**：改了就记，决策写进决策日志。
