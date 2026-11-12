// Copy that did not exist in the prototype (real sign-in, errors, sharing). Keep prototype copy in zh.ts / en.ts.

export const zhExtra = {
  // overrides of prototype copy that no longer matches the interaction
  'item.notReady': '加入计划前还差：',
  'dog.scaleHint': '点一下选择，再点一下取消，都是可选的',
  'new.tzHint': '· 根据目的地自动判断',

  'plan.showAll': '全部',
  'plan.showConfirmed': '只看已确定',

  'common.saveFailed': '保存失败，请检查网络后再试。',
  'common.loadFailed': '加载失败',
  'common.retry': '重试',

  'auth.emailLabel': '邮箱',
  'auth.sendCode': '发送登录邮件',
  'auth.errEmail': '请输入有效的邮箱地址。',
  'auth.errSend': '发送失败，请稍后再试。',
  'auth.errRate': '发送太频繁了，请一分钟后再试。',
  'auth.sentTitle': '请查收邮件',
  'auth.sentBody': '我们给 {email} 发了一封登录邮件。点击邮件里的链接即可登录，或在下面输入邮件里的验证码。',
  'auth.codeLabel': '验证码',
  'auth.verify': '登录',
  'auth.errCode': '验证码不对或已过期，请重试。',
  'auth.resend': '重新发送',
  'auth.resendIn': '{n} 秒后可重发',
  'auth.changeEmail': '换个邮箱',

  'group.copy': '复制邀请码',
  'group.copied': '已复制',
  'group.shareText': '来和我一起规划带狗旅行「{name}」🐾\n打开链接加入：{link}\n或在 PawTrip 里输入邀请码：{code}',
  'group.removeDog': '把这只狗移出行程',

  'delete.title': '删除这个行程？',
  'delete.body': '「{name}」和里面所有的想法、评论都会被永久删除，所有人都会看不到。',

  'dog.removeTitle': '删除这只狗狗？',
  'dog.removeBody': '{name}的档案会被删除，并从所有行程里移除。',
} as const;

export const enExtra: Record<keyof typeof zhExtra, string> = {
  'item.notReady': 'Before it can go in the plan:',
  'dog.scaleHint': 'Tap to choose, tap again to clear. All optional.',
  'new.tzHint': '· set from the destination',

  'plan.showAll': 'All',
  'plan.showConfirmed': 'Confirmed only',

  'common.saveFailed': "Couldn't save. Check your connection and try again.",
  'common.loadFailed': "Couldn't load this",
  'common.retry': 'Try again',

  'auth.emailLabel': 'Email',
  'auth.sendCode': 'Email me a sign-in link',
  'auth.errEmail': 'Enter a valid email address.',
  'auth.errSend': "Couldn't send the email. Try again in a bit.",
  'auth.errRate': 'Too many requests. Try again in a minute.',
  'auth.sentTitle': 'Check your email',
  'auth.sentBody': 'We sent a sign-in email to {email}. Tap the link in it, or enter the code from the email below.',
  'auth.codeLabel': 'Code',
  'auth.verify': 'Sign in',
  'auth.errCode': 'That code is wrong or expired. Try again.',
  'auth.resend': 'Resend',
  'auth.resendIn': 'Resend in {n}s',
  'auth.changeEmail': 'Use another email',

  'group.copy': 'Copy code',
  'group.copied': 'Copied',
  'group.shareText': 'Plan a dog-friendly trip with me: "{name}" 🐾\nJoin with this link: {link}\nOr enter the invite code in PawTrip: {code}',
  'group.removeDog': 'Remove this dog from the trip',

  'delete.title': 'Delete this trip?',
  'delete.body': '"{name}" and all its ideas and comments will be permanently deleted for everyone.',

  'dog.removeTitle': 'Delete this dog?',
  'dog.removeBody': "{name}'s profile will be deleted and removed from every trip.",
};
