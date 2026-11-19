# UI audit against "layout speaks, words do not" (2026-11-18)

Method: every `t('…')` key rendered in `pawtrip/src` whose Chinese text is a sentence, read against the principle in `AGENTS.md`.
Status column: TODO = not changed yet. Nothing here has been changed; waiting for the user's go-ahead.

## A. Violations — remove or replace
| # | Where | Text now | Fix |
|---|---|---|---|
| 1 | Sign-in page (`sign-in.tsx`) | `signin.tagline` 和好友一起，规划带狗出行 (slogan) | delete |
| 2 | Sign-in, "code sent" state | `auth.sentBody` (two instruction sentences), `auth.sentIdBody` | one short state line "已发送至 {email}" (or the mail icon + address) above the code field; no instructions |
| 3 | Trip ideas empty state (`ideas.tsx`) | `ideas.empty.body` 大家想去的地方都会收在这里 | delete, keep icon + title |
| 4 | Join trip, no dogs (`join.tsx`) | `jn.noDogs` 你还没有狗狗档案，加入后可以在成员页添加 | replace with an "add dog" button (+ icon) |
| 5 | Add friends to a trip (`AddBuddiesSheet`) | `bd.none` 没有可添加的好友。先在「我的好友」里添加。 | empty icon + one "add friend" button |
| 6 | Feedback box (`FeedbackButton`) | `fdbk.context` always-visible privacy note | info icon + tooltip (keep it reachable by screen readers) |
| 7 | Feedback after an item (`ItemDetailSheet`) | `fb.why` 你的反馈会匿名帮助… | info icon + tooltip or delete |
| 8 | Add idea sheet (`AddItemSheet`) | `add.leaderConfirms` 想法会交给组长决定是否加入计划 | info icon + tooltip |
| 9 | Item detail (`ItemDetailSheet`) | `item.leaderDecides` 由组长 X 决定是否加入计划 | role/crown icon with the leader's avatar + tooltip |
| 10 | Trip invite sheet, family code sheet | `group.expiresIn` "还剩 N 分钟过期（邀请码有效期 1 小时）", `family.codeExpires` | clock icon + "N 分钟" only; drop the parenthesis |
| 11 | Item "not ready" box | `item.notReady` 还差这些就会自动进入计划： | drop the lead-in sentence; show the missing items as a checklist with icons (state stays) |
| 12 | Wizard done steps (`nt.done.title/body`, `ob.done.*`, `dw.done.*`) | slogans such as 准备好了，出发！ | icon + primary button only |

## B. Dead copy to clean out (not rendered, but easy for someone to switch on)
- All wizard `*.hint` keys (`nt.*.hint`, `ob.*.hint`, `dw.*.hint`, `jn.*.hint`) and the `hint` field of `Wizard.tsx` steps.
- `WeatherBanner.tsx` (unused) with `dd.hot`, `dd.cold`.

## C. Low priority — long placeholders
`new.destPh` (搜索城市或邮编，比如 Ashburn 或 20147), `new.namePh` (比如：蓝岭周末), `add.addrPh`, `add.notesPh`: shorten to a few words; the visible label carries the meaning.

## D. Compliant — keep as is
- Consequence statements: delete/leave/archive trip, remove dog, remove friend, remove from family, disband/leave family, calendar move (`cal.moveBody*`), sign out.
- State and errors: validation errors, `*.err*`, `bd.pending`, `friend.relProposedMe`, `friend.since`, `item.aloneWarn`, `item.overlap`, `item.lastEdited`, toasts, counts.
- The weather "(预测：近 5 年同期平均…)" note stays: the user asked for it explicitly.
- Wizard step questions are titles, not help text.

## E. Needs building first
A small `InfoTip` component (info icon button + tooltip/popover on hover, focus and tap, with an accessible name) for A6–A9.
