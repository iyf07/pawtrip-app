# PawTrip 动画参数表

每次改动画参数，先改这里的代码位置，再同步更新本文件。所有时长单位毫秒（ms）。

| # | 动画 | 效果 | 参数 | 代码位置 |
|---|------|------|------|----------|
| 1 | 列表依次入场 | 每项从下方淡入并上移到位 | 单项 350 ms，缓出（cubic out）；每项延迟 100 ms；上移 18 px；不设上限（第 N 项等 N×100 ms） | `pawtrip/src/components/ui/Reveal.tsx`（`REVEAL_STEP`、`REVEAL_MS`、位移 18） |
| 2 | 标签变宽 | 选中标签变宽并放大，其他变窄并缩小 | 时长 500 ms，缓出；宽度权重 选中 1.7 / 其他 1；缩放 选中 1.06 / 其他 0.92 | `pawtrip/src/components/useTabGrow.ts`（`TAB_GROW`、`TAB_SCALE_ON`、`TAB_SCALE_OFF`、`MS`）；用于 `BottomTabBar`、`ProfileTabs`、`Segmented` |
| 3 | 好友/家庭标签跨页动画 | 两页是不同网址，标签栏会重建；记住上次状态后再播放过渡 | 同上；`group="people"` | `useTabGrow(on, memoryKey)`、`PeopleTabs.tsx` |
| 4 | 左滑删除 | 行跟手并带阻尼，红色删除按钮逐渐放大露出 | 阻尼 0.6（行走手指距离的 60%）；拉过行宽 40% 松手则停在删除按钮上（停靠位置 −96 px）；没到则弹回；回弹/停靠 300 ms；停靠后点按钮弹确认，向右滑超过 24 px 或点行则收回 | `pawtrip/src/components/ui/SwipeRow.tsx`（`DAMPING`、`TRIGGER`、`BACK_MS`、`OPEN_X`）；用于行程、狗狗（仅自己的）、已接受的好友 |
| 5 | 回到顶部按钮 | 滚过一屏后从右下角淡入并上浮 12 px，点击平滑回顶 | 显示淡入 250 ms；上浮 12 px；回顶 500 ms；曲线目前是 慢-快-慢（三次方 ease-in-out）。你写的是"先减速后加速"，如要字面曲线改 `ease()` | `pawtrip/src/components/ui/ScrollTopButton.tsx`；挂在 `ui/Screen.tsx` |
| 6 | 按压回弹（按钮） | 按下缩到 0.94 并减弱阴影，松手弹簧回到 1，略过冲 | 按下 90 ms 缩到 0.94；弹簧 刚度 260、阻尼 12、质量 1；按下时阴影改为 `0 1px 3px -1px` | `pawtrip/src/components/ui/PressScale.tsx`；已用于 Button、Chip、Segmented、AddAction、Card（有 onPress）、底部标签、页面标签。未接：左侧导航栏图标、列表行、一些圆形图标按钮 |
| 7 | 保存通知（Toast） | 从下方上滑并淡入，停留后淡出 | 上滑 28 px、260 ms 缓出；停留 1200 ms；淡出 260 ms；手机在底部标签栏上方 92 px，宽屏在底部 28 px；不拦截点击 | `pawtrip/src/components/ui/Toast.tsx` |
| 8 | 弹窗 | 遮罩淡入，卡片放大弹入，关闭时淡出并略缩小 | 遮罩 黑色，最大不透明度 0.45，淡入 280 ms；居中弹窗（平板/电脑）从 0.8 倍弹簧放大到 1，刚度 260、阻尼 20、质量 1；关闭 200 ms 淡出并缩到 0.95；手机底部弹窗保持原来的上滑（0.8 倍放大不适合底部面板） | `pawtrip/src/components/ui/Sheet.tsx`。头像下拉菜单（NavBar）仍是原生淡入 |
| 9 | 输入框出错 | 左右抖动，边框变红，下方提示淡入 | 左右抖 3 次，幅度 14 px 逐渐衰减（14, −11.5, 9, −6.5, 4, −2, 0），每段 60 ms，共 420 ms；提示淡入 240 ms | `pawtrip/src/components/ui/Field.tsx`（只作用于统一的 Field，裸 TextInput 不含） |
| 10 | 设置页逐项入场 | 标题和每一项设置依次入场 | 同 #1（用 Reveal，间隔 100 ms） | `pawtrip/src/app/settings.tsx` |
| 11 | 保存/撤销按钮 | 点击后描边画出，再扩散一圈淡出的光晕，颜色随对勾/叉 | 描边 350 ms 画满一圈（从顶部顺时针）；光晕 300 ms，放大到 1.9 倍并淡出；光晕放完后才执行保存/撤销（共约 650 ms）；保存 = 绿色（th.ok），撤销 = 红色（th.danger） | `pawtrip/src/components/ui/RingButton.tsx`（`RING_DRAW_MS`、`RING_HALO_MS`）；用于个人主页、狗狗页、家庭名字的保存/撤销 |
| 12 | 点击小狗 | 全站任意位置点击/触摸，在点击处冒出一个小狗图标并淡出 | 600 ms，缓出；缩放 0.5→1.25；上飘 10 px；随机倾斜 ±25°；图标 44 px（`nav-dogs` 小狗图标，要换图标改 `PawTap.tsx` 里的 `Icon name`）；同时最多 6 个；不拦截点击 | `pawtrip/src/components/PawTap.tsx`（挂在 `app/_layout.tsx` 最外层；网页用 window pointerdown，手机用触摸捕获） |
| 13 | 顶部导航栏图标 | 当前页的图标变宽并放大，其他变窄并缩小，和标签一样 | 0.5 s；宽度 选中 60 px / 其他 32 px；缩放同 #2；每个页面各自画导航栏，所以用 `useTabGrow` 的记忆（key `nav:<icon>`）让切换页面时也能看到过渡 | `pawtrip/src/components/NavBar.tsx`（`NavButton`）。电脑左侧竖向导航栏（`DesktopShell`）暂未加 |
| 14 | 圈子 → 下一层页面 | 从圈子点进狗狗/家庭/好友页，新页面从右侧滑入并淡入；返回圈子则从左侧滑入 | 320 ms 缓出；位移 40 px；透明度 0.2→1；只看"从哪来"，所以浏览器返回键也有效 | `pawtrip/src/lib/page-entrance.ts`（`CHILD` 列出圈子下一层的路径），由 `ui/Screen.tsx` 使用 |
| 15 | 圈子狗狗手风琴 | 每只狗一条竖条，名字竖着显示；点窄条横向展开变宽，其余同步变窄，展开后名字、体重、标签在宽度变完后淡入；点已展开的进入狗狗页 | 500 ms 缓出；展开宽度权重 5 / 其他 1；展开内容在 60%→100% 进度淡入，竖排名字在 0→35% 淡出 | `pawtrip/src/features/circle/DogAccordion.tsx`（`OPEN`、`MS`） |

## 列表入场已覆盖的页面
行程列表、狗狗列表、想法卡片、好友列表和好友申请、家庭的成员和狗狗、行程成员页的成员和狗狗、个人/好友/狗狗的偏好（`ScaleInput` 的 `index`）、兴趣（`InterestPicker`、`DogInterests`）、忌口标签、狗狗表单的偏好卡片、计划时间轴块、设置页。

未加：通知弹窗里的几行、日历。

## 约定
- 新增列表行或卡片：用 `<Reveal index={i}>` 包起来。
- 新增标签组件：用 `useTabGrow`。
- 新增按钮：用 `PressScale`（或 Button/Chip）。
- 新增输入框：用 `Field`。
- 所有动画在 Browser 面板（后台页面）里可能被暂停，调参数请在真机或前台页面看。
- 按下按钮后把光标/手指移出按钮再松手 = 取消点击（`PressScale` 的 `pressRetentionOffset` 设为 0，默认容忍 20 px）。还没接 `PressScale` 的原生 `Pressable` 仍是默认 20 px 容忍。
- 按住超过 200 ms 再松手 = 不算点击（`PressScale` 的 `LONG_PRESS_MS`，暂定 200，可调）。
- 编辑资料时出现的输入框（昵称、ID、狗狗名字、体重、自定义忌口）用 `Reveal` 滑入，和列表入场同参数（350 ms，上移 18 px），第二行晚 100 ms（`ui/InlineFieldRow.tsx` 的 `index`）。
- 保存/撤销按钮：点击后立刻调用后端，不等动画；等动画和后端都完成后才关闭编辑状态（`RingButton` 把 `animationDone` 传给调用方）。
