# Ready-to-send icon batches (copy one whole block into ChatGPT)

## Batch 15 — 已批准的菜系与活动兴趣（2026-11-15）

用户明确确认 11 类饮食与 6 类活动，咖啡和甜点独立保留。生成 17 个独立爪爪图标：中餐、日料、韩餐、泰餐、越南菜、印度菜、意大利菜、披萨、美式餐、墨西哥菜、地中海／中东菜；市集、演出／现场音乐、手作体验、游乐园、水上活动、温泉／SPA。参考实际 `cat-food`、`int-dessert`、`cat-fun` masters，爪爪融入食物、餐具或物件。逐图提示词：[icon-batch15-prompts.json](icon-batch15-prompts.json)。图集：[icon-interests-batch15.png](icon-interests-batch15.png)。归档 `/Users/ivan/workplace/icons/batch-15-cuisines-experiences`。原图 contact sheet 全部通过完整性与风格检查；保留旧 food/fun 数据，不推断新偏好。

## Batch 14 — 早晨／午后与清静环境区分（2026-11-15）

问题：早晨与午后都使用咖啡＋太阳，难以区分；偏爱人少的咖啡杯没有表达环境氛围。更换为早晨床头闹钟（八点、爪爪轴心）、午后茶壶茶点（爪爪壶身）和清静小花园单张座椅（爪爪椅背）。使用 Batch 13 实际图像作风格参考，保留粗棕描边、暖色、白边并经过现有清理流程。逐图提示词：[icon-batch14-prompts.json](icon-batch14-prompts.json)。归档 `/Users/ivan/workplace/icons/batch-14-scale-clarity`。仅替换这三个量表图标；后续用户已确认兴趣方案，见 Batch 15。

## Batch 13 — 全站爪爪图标（2026-11-15）

用户要求覆盖全站。130 个独立图标重新生成，保留 10 个已经具有爪爪元素且风格一致的图标，共 140 个注册图标。每次使用目标原图与已批准的咖啡／徒步图标作为真实图片参考，保持粗圆棕色描边、奶油色、暖色填充、白色贴纸边；爪爪融入物件本身（鞋面、杯子、项圈、云朵、印章、按钮轮廓），避免统一贴在角落。

完整逐图提示词与参考文件：[icon-batch13-prompts.json](icon-batch13-prompts.json)。原图归档：`/Users/ivan/workplace/icons/batch-13-paw-family/raw`。透明底 1024px masters / 512px UI 图标使用现有 `clean-icons-white.py` 处理。新增 `scale-recall-1..5`、`diet-kosher`；欢迎页沿用同一套狗狗贴纸，邮箱装饰替换为爪爪便笺。

检查记录：所有原始输出均通过 contact sheet 检查，图形完整、可辨识、爪爪可见。犹太洁食使用六芒星，清真使用新月，两者独立。保存／放弃使用爪形轮廓与勾／叉，保留操作含义。最终图集见 `icon-paw-family-batch13.png`。

## Batch 12 — six travel preferences and inline actions (2026-11-15)

**Style correction:** Batch 11 lakes/dessert were rejected for not matching. Text-only style descriptions are insufficient: always attach the approved `int-hiking`, `cat-coffee`, and `scale-walk-3` masters as the style reference sheet. These actual images were supplied to built-in imagegen for Batch 12. Compare contact sheets against approved originals before integration. Morning 4/5 now mean noon/afternoon, never sunset/night. Temperature/pace/spending use human-neutral objects; no dog faces. Rebuild borders with the existing cleanup pipeline to keep white-rim thickness and visual size aligned.

21 final icons, one independent image per call. Source archive: `/Users/ivan/workplace/icons/batch-12-six-scales/`; frontend masters/UI in `pawtrip/assets/icons/masters` and `pawtrip/assets/icons`; comparison sheet in `docs/icon-style-alignment-batch12.png`. Spending level 2 was refined against level 1 to remove an inconsistent paw mark and keep the exact wallet.

### int-dessert.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. A simple small strawberry shortcake slice, muted cream and dusty pink, tiny red strawberry, on a small cream plate. Keep it as restrained, chunky and simple as the coffee reference. Replaces an overly bright detailed dessert icon.
```

### int-lakes.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One small tranquil blue lake with two broad cream ripple lines, one small green pine at the bank, a simple low grassy shore. Muted blue and green. Same simple object-like silhouette as the hiking boot reference; no big yellow bushes, no sun, no extra landscape frame.
```

### scale-morning-4.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. A simple cream lunch plate with a tiny golden sun directly overhead; depicts starting a trip at noon (12–14), not sunset. Amber and cream.
```

### scale-morning-5.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. A simple cream tea cup with a golden afternoon sun behind it; depicts starting a trip after 14:00, daylight, not moon/night. Amber and cream.
```

### scale-temperature-1.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One rounded thermometer with very low BLUE fluid, a chunky blue snowflake and a small scarf wrapped around its base: extremely sensitive to cold. Temperature set: fixed thermometer subject/size/angle across levels.
```

### scale-temperature-2.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. The SAME rounded thermometer with low blue fluid and a small cream scarf: slightly sensitive to cold. Temperature set: fixed thermometer subject/size/angle across levels.
```

### scale-temperature-3.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. The SAME rounded thermometer with fluid at the midpoint, a small sun and snowflake balanced on either side: adapts to both cold and heat. Temperature set: fixed thermometer subject/size/angle across levels.
```

### scale-temperature-4.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. The SAME rounded thermometer with high warm orange fluid and one sweat drop: slightly sensitive to heat. Temperature set: fixed thermometer subject/size/angle across levels.
```

### scale-temperature-5.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. The SAME rounded thermometer with very high red fluid, a small orange sun and two sweat drops: extremely sensitive to heat. Temperature set: fixed thermometer subject/size/angle across levels.
```

### scale-pace-1.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky cream itinerary card with rounded corners and a gold top clip. Only ONE large green circular stop with lots of empty cream space: extremely relaxed itinerary. Pace set: identical card shape, size and angle, no writing or digits; use only the stop dots to communicate density.
```

### scale-pace-2.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky cream itinerary card with rounded corners and a gold top clip. TWO large green circular stops connected by one short brown path: leisurely itinerary. Pace set: identical card shape, size and angle, no writing or digits; use only the stop dots to communicate density.
```

### scale-pace-3.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky cream itinerary card with rounded corners and a gold top clip. THREE large green circular stops connected by a short brown path: balanced itinerary. Pace set: identical card shape, size and angle, no writing or digits; use only the stop dots to communicate density.
```

### scale-pace-4.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky cream itinerary card with rounded corners and a gold top clip. FOUR large green circular stops connected by a brown winding path: full itinerary. Pace set: identical card shape, size and angle, no writing or digits; use only the stop dots to communicate density.
```

### scale-pace-5.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky cream itinerary card with rounded corners and a gold top clip. FIVE large green circular stops connected by a brown winding path, one small golden lightning badge: packed itinerary. Pace set: identical card shape, size and angle, no writing or digits; use only the stop dots to communicate density.
```

### scale-spending-1.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky muted brown travel wallet with a cream inner lining, simple gold snap and ONE small gold coin beside it: very frugal travel. Spending set: same wallet subject, size, angle and position at all five levels; vary coin count and small badge only, no currency letters or text.
```

### scale-spending-2.png

Final refinement (reference image: the approved generated scale-spending-1):

```text
Edit this exact icon for level 2 of the same scale. Preserve wallet, its shape, angle, brown/cream colors, outline thickness, gold snap, white highlights, white sticker rim, and canvas placement exactly. Change only the single gold coin to TWO stacked gold coins in exactly the same position. No paw print or new mark on wallet, no text, no extra objects, no shadow. Flat pure white background. One complete square standalone icon.
```


```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky muted brown travel wallet with a cream inner lining, simple gold snap and TWO small stacked gold coins beside it: economical travel. Spending set: same wallet subject, size, angle and position at all five levels; vary coin count and small badge only, no currency letters or text.
```

### scale-spending-3.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky muted brown travel wallet with a cream inner lining, simple gold snap and THREE stacked gold coins beside it: comfortable travel. Spending set: same wallet subject, size, angle and position at all five levels; vary coin count and small badge only, no currency letters or text.
```

### scale-spending-4.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky muted brown travel wallet with a cream inner lining, simple gold snap and FOUR stacked gold coins beside it, small cream sparkle: premium travel. Spending set: same wallet subject, size, angle and position at all five levels; vary coin count and small badge only, no currency letters or text.
```

### scale-spending-5.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky muted brown travel wallet with a cream inner lining, simple gold snap and FIVE stacked gold coins beside it and one small golden crown: luxury travel. Spending set: same wallet subject, size, angle and position at all five levels; vary coin count and small badge only, no currency letters or text.
```

### ui-save.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky dark-green check mark inside a soft pale-green round badge, gold rim detail. Save/confirm control, unmistakable check mark, clean simple readable 24px.
```

### ui-discard.png

```text
Create ONE standalone PawTrip UI sticker icon as part of the exact EXISTING family shown in the attached reference images. Treat those images as the style reference sheet: match their thick rounded dark cocoa outline, creamy whites, gently shaded flat fills, muted warm palette, little white highlight, clean white die-cut rim, softly chubby silhouette and visual density exactly. No new art direction. Same outline weight and rim-to-object ratio as the references. Center complete subject in square 1024x1024 canvas, 80% fill, equal whitespace, nothing cropped. Pure flat WHITE background for the existing cleanup pipeline. No text, numerals, labels, realistic texture, shadows, glow, extra decorative blobs, specks or grids. No dog or human faces. One chunky dark-brown diagonal X inside a soft cream round badge, muted dusty-rose rim detail. Discard/cancel control, unmistakable X, clean simple readable 24px.
```


## Batch 11 — lakes and desserts (2026-11-15)

Generated with the built-in imagegen tool, one image per call. Transparent originals were composited onto white for the existing clean-icons-white pipeline; inspected and cleaned to rebuild crisp sticker borders. Sources archived at `/Users/ivan/workplace/icons/batch-11-interests/`; masters and UI assets at `pawtrip/assets/icons/{masters/,}int-{lakes,dessert}.png`.

### int-lakes.png

```text
Use case: stylized-concept. Asset type: PawTrip UI sticker icon, one complete icon only in one square 1024x1024 PNG. Cute chubby rounded die-cut sticker. Thick even dark brown #4A3628 outline, rounded corners/caps, flat fills at most 2 tones, tiny upper-left glossy white stripe and dot, thick crisp white sticker border. Warm gold #FFC72C, cream #FFF4D6, white with subject accent. No drop shadow, glow, texture, realistic shading, text or letters. Centered, fills 80%, equal margins, no crop, no grid. Genuine transparent background. A calm sky-blue #3D7590 oval lake with two chunky ripple lines and a small green reed clump on one bank. Readable at 24px. No mountains, no boat, no beach palm.
```

### int-dessert.png

```text
Use case: stylized-concept. Asset type: PawTrip UI sticker icon, one complete icon only in one square 1024x1024 PNG. Cute chubby rounded die-cut sticker. Thick even dark brown #4A3628 outline, rounded corners/caps, flat fills at most 2 tones, tiny upper-left glossy white stripe and dot, thick crisp white sticker border. Warm gold #FFC72C, cream #FFF4D6, white with subject accent. No drop shadow, glow, texture, realistic shading, text or letters. Centered, fills 80%, equal margins, no crop, no grid. Genuine transparent background. One chubby slice of strawberry shortcake on a tiny cream plate, pale pink cream layers, red strawberry on top. Readable at 24px. No cup, coffee, lettering.
```


Each block is **self-contained**: it carries the style, the one-icon-per-file rule and the file names, so you just paste it and send.
Use a new chat for the first batch and **attach the approved icons** (`pawtrip/assets/icons/masters/*.png`, all 8 `logo`/`nav`/`tab` icons + the
7 `cat-*` ones) so the style stays identical; stay in the **same chat** for the next batches. Put the finished ZIP in `/Users/ivan/workplace/icons/`.


## Batch 3 — controls (camera and pencil first)

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "ui-camera.png" — a cute chubby camera with a big round lens, a small flash and a tiny paw print on the front (the photo button on avatars and dog photos; must read at 24 px) — accent gold #FFC72C — must NOT be a phone, a cup
2) file "ui-pencil.png" — a cute chubby pencil, slightly tilted, yellow body, pink eraser, small brown tip (the "edit" button next to the username) — accent gold — must NOT be a pen with a cap, a brush
3) file "ui-trash.png" — a rounded trash bin with a lid and two small vertical grooves (delete) — accent red #B42318
4) file "ui-archive.png" — an open-top storage box with a small downward arrow above it (archive) — accent gray-brown #8F806F
5) file "ui-copy.png" — two overlapping rounded squares, the front one filled (copy) — accent gray-blue #3D7590
6) file "ui-share.png" — a rounded square box with a bold arrow leaving it to the upper right (share) — accent blue #3D7590
7) file "ui-invite.png" — a friendly person bust (round head and shoulders, gender-neutral) with a small round plus badge (invite a friend) — accent gold
8) file "ui-key.png" — a chubby key whose head is shaped like a paw print (join with a code) — accent gold
9) file "ui-zoom.png" — a chubby magnifying glass with a round lens and a short handle (zoom) — accent gray-blue #3D7590
```


## Batch 4 — interests, plus the two redos

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "cat-food.png" — a round plate seen from above with a fork on the left and a knife on the right (food) — accent orange #D9702E — must NOT be a cup, a bowl
2) file "cat-sights.png" — a compact camera with a round lens, a small flash and a viewfinder bump (sights) — accent purple #7B5EA7 — must NOT be a cup, a phone
3) file "int-beaches.png" — a small palm tree on a sand island with a wave (beaches) — accent sky blue #3D7590
4) file "int-camping.png" — a camping tent with an open door and a small flag (camping) — accent green #3E8E57
5) file "int-wildlife.png" — a friendly deer head with two antlers (wildlife) — accent brown #8B5A3C — must NOT be a dog, a horse
6) file "int-museums.png" — a classic building with three columns and a triangular roof (museums) — accent beige #D9B779
7) file "int-viewpoints.png" — a pair of binoculars (viewpoints) — accent purple #7B5EA7
8) file "int-breweries.png" — a beer mug with a foamy top and a handle (breweries) — accent amber #E0A100 — must NOT be a wine glass
9) file "int-hiking.png" — a chubby hiking boot with laces and a small sole (hiking) — accent green #3E8E57
```


## Batch 5 — weather

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "wx-sun.png" — a round sun with short rounded rays (sunny) — accent gold #FFC72C
2) file "wx-partly.png" — a sun partly behind a puffy cloud (partly cloudy) — accent gold and white
3) file "wx-cloud.png" — one puffy cloud (cloudy) — accent white and light gray-blue
4) file "wx-rain.png" — a puffy cloud with three rain drops (rain) — accent sky blue #3D7590
5) file "wx-storm.png" — a puffy dark cloud with a lightning bolt (thunderstorm) — accent gray-blue and gold
6) file "wx-snow.png" — a puffy cloud with three snowflakes (snow) — accent light blue and white
7) file "wx-fog.png" — a puffy cloud with three horizontal rounded lines below it (fog) — accent light gray-blue
8) file "wx-sunrise.png" — a half sun on a horizon line with a small up arrow (sunrise) — accent gold and orange
9) file "wx-sunset.png" — a half sun on a horizon line with a small down arrow (sunset) — accent orange and purple
```


## Batch 6 — map pins and dog arrangements

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "pin-stop.png" — an empty round map pin (teardrop pin with a big empty circle in the middle, we add the number ourselves) — accent gold #FFC72C
2) file "pin-stay.png" — a map pin with a small house inside (stay) — accent blue #3D7590
3) file "pin-idea.png" — a map pin with a small light bulb inside (idea) — accent amber #E0A100
4) file "dog-with.png" — a happy dog face with a tiny paw print beside it (the dog goes along) — accent gold
5) file "dog-sitter.png" — a dog face next to a small friendly person bust (the dog is with a sitter) — accent blue
6) file "dog-alone.png" — a small house with a dog face in the window (the dog stays home alone) — accent brown
7) file "dog-tbd.png" — a dog face with a question mark bubble (undecided) — accent gray-brown
8) file "ui-warning.png" — a rounded triangle with an exclamation mark (warning) — accent orange #D9702E
9) file "ui-dog-warning.png" — a dog face with a small warning triangle (dog warning) — accent orange #D9702E
```


## Batch 7 — moods, dog traits and small UI

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "mood-yay.png" — a happy dog face with a big smile (mood: great) — accent gold
2) file "mood-ok.png" — a calm dog face with a small neutral mouth (mood: ok) — accent gold
3) file "mood-meh.png" — a worried dog face with droopy ears (mood: not great) — accent gold
4) file "trait-runner.png" — a running dog with small motion lines (lets go and runs away) — accent amber
5) file "trait-recall.png" — a dog with a small heart above it (comes back when called) — accent pink #C2477F
6) file "ui-crown.png" — a chubby crown with three round tips (trip leader) — accent gold #FFC72C
7) file "ui-chat.png" — a rounded speech bubble with three small dots (feedback and comments) — accent gold
8) file "ui-clock.png" — a round clock face with two hands (time) — accent brown #8B5A3C
9) file "ui-note.png" — a small notepad with a folded corner and two lines (notes) — accent yellow #FBF0CF and gold
```


## Batch 8 — dietary needs

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "diet-vegetarian.png" — a single green leaf (vegetarian) — accent green #3E8E57
2) file "diet-vegan.png" — a small sprout growing inside a heart (vegan) — accent green #3E8E57
3) file "diet-glutenfree.png" — a wheat ear crossed by a bold diagonal slash (gluten-free) — accent amber #E0A100
4) file "diet-dairyfree.png" — a milk bottle crossed by a bold diagonal slash (dairy-free) — accent light blue #3D7590
5) file "diet-nutallergy.png" — a peanut crossed by a bold diagonal slash (nut allergy) — accent brown #8B5A3C
6) file "diet-halal.png" — a crescent moon with a small star (halal) — accent green #3E8E57
7) file "diet-kosher.png" — a simple six-pointed star outline made of chunky lines (kosher) — accent blue #3D7590
```


## Batch 9 — empty-state illustrations (larger, more detail allowed)

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (a little more detail is allowed for these larger illustrations, but keep the same outline thickness, white sticker border and chubby sticker style).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "empty-trips.png" — a happy dog standing next to a suitcase (no trips yet) — accent gold and brown
2) file "empty-map.png" — a dog looking at an open map with a small pin (no places yet) — accent green and gold
3) file "empty-day.png" — a dog sleeping curled up next to a small calendar page (empty day) — accent blue and gold
4) file "empty-offline.png" — a confused dog with a small broken signal antenna (could not load) — accent gray-blue and gold
```

## Batch 8b — redo kosher (the first one came out cut in half)

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

Icons (create exactly these files):
1) file "diet-kosher.png" — a simple six-pointed star (two overlapping triangles) made of chunky lines, with a small cream hexagon in the middle (kosher) — accent blue #3D7590 — the WHOLE star must be fully inside the image, centered, nothing cut off on any side
```

## Batch 10 — scale icons (45 icons). SEND ONE PROMPT PER QUESTION (9 prompts x 5 icons)

The first attempt (all 45 in one request) came back as broken tiles: every file was a small piece cut out of a larger sheet. So send the 9 prompts below one at a time,
each in the same chat, and wait for the ZIP of 5 before sending the next. Put the ZIPs in `/Users/ivan/workplace/icons/` (or the Desktop) and tell me.
If a file again shows only a piece of an icon, answer: "Each file must be ONE complete icon on its own 1024x1024 canvas; do not crop from a sheet. Regenerate."

### Batch 10a — walking: how far can you walk?

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
1) file "scale-walk-1.png" — a small round stool with a soft cushion (sitting, no walking) — level 1 of 5 — accent green #3E8E57
2) file "scale-walk-2.png" — a casual flat shoe — level 2 of 5 — accent green #3E8E57
3) file "scale-walk-3.png" — a sporty sneaker — level 3 of 5 — accent green #3E8E57
4) file "scale-walk-4.png" — a chunky hiking boot with laces — level 4 of 5 — accent green #3E8E57
5) file "scale-walk-5.png" — a big hiking boot standing on a mountain peak with a tiny flag — level 5 of 5 — accent green #3E8E57
```

### Batch 10b — quiet or lively?

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
6) file "scale-noise-1.png" — a small quiet pine forest of three chunky trees — level 1 of 5 — accent purple #7B5EA7
7) file "scale-noise-2.png" — a steaming tea cup — level 2 of 5 — accent purple #7B5EA7
8) file "scale-noise-3.png" — a small cafe table with two drinks — level 3 of 5 — accent purple #7B5EA7
9) file "scale-noise-4.png" — a bunch of party balloons with confetti — level 4 of 5 — accent purple #7B5EA7
10) file "scale-noise-5.png" — a megaphone with music notes — level 5 of 5 — accent purple #7B5EA7
```

### Batch 10c — early bird or night owl?

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
11) file "scale-morning-1.png" — a big sun just rising over a horizon line (sunrise, clearly bigger and simpler than a weather icon) — level 1 of 5 — accent amber #E0A100
12) file "scale-morning-2.png" — a morning coffee cup with a small sun behind it — level 2 of 5 — accent amber #E0A100
13) file "scale-morning-3.png" — a bright sun high in the middle of a blue sky — level 3 of 5 — accent amber #E0A100
14) file "scale-morning-4.png" — an orange evening sky with the sun setting behind a hill and a small cloud — level 4 of 5 — accent amber #E0A100
15) file "scale-morning-5.png" — a crescent moon with three stars — level 5 of 5 — accent amber #E0A100
```

### Batch 10d — dog energy

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
16) file "scale-energy-1.png" — an empty red battery with a sleeping dog face on it, closed eyes — level 1 of 5 — accent gold #FFC72C
17) file "scale-energy-2.png" — a low battery (one bar) with a dog face yawning — level 2 of 5 — accent gold #FFC72C
18) file "scale-energy-3.png" — a half-full battery (two bars) with a calm dog face — level 3 of 5 — accent gold #FFC72C
19) file "scale-energy-4.png" — a nearly full battery (four bars) with a happy dog face and perked ears — level 4 of 5 — accent gold #FFC72C
20) file "scale-energy-5.png" — a full battery with a lightning bolt and an excited dog face, bouncing — level 5 of 5 — accent gold #FFC72C
```

### Batch 10e — dog: afraid of cold or heat

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
21) file "scale-temp-1.png" — a dog frozen like an ice pop with icicles on its head, shivering — level 1 of 5 — accent sky blue #3D7590
22) file "scale-temp-2.png" — a dog wearing a scarf, slightly shivering — level 2 of 5 — accent sky blue #3D7590
23) file "scale-temp-3.png" — a comfy dog sitting next to a small thermometer in the middle — level 3 of 5 — accent sky blue #3D7590
24) file "scale-temp-4.png" — a panting dog with a sweat drop — level 4 of 5 — accent sky blue #3D7590
25) file "scale-temp-5.png" — a dog melting into a puddle under a big hot sun — level 5 of 5 — accent sky blue #3D7590
```

### Batch 10f — dog with other dogs

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
26) file "scale-withdogs-1.png" — a dog hiding behind a bush, trembling — level 1 of 5 — accent orange #D9702E
27) file "scale-withdogs-2.png" — a shy dog peeking out from the side while a small dog stands far away — level 2 of 5 — accent orange #D9702E
28) file "scale-withdogs-3.png" — a dog with a thinking bubble (dots) above its head — level 3 of 5 — accent orange #D9702E
29) file "scale-withdogs-4.png" — two dogs sniffing each other happily with a small heart — level 4 of 5 — accent orange #D9702E
30) file "scale-withdogs-5.png" — three dogs together at a party with confetti — level 5 of 5 — accent orange #D9702E
```

### Batch 10g — dog with people

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
31) file "scale-withpeople-1.png" — a dog hiding behind a person's legs (only legs of a person) — level 1 of 5 — accent pink #E07A9A
32) file "scale-withpeople-2.png" — a dog peeking from behind a person's leg, shy — level 2 of 5 — accent pink #E07A9A
33) file "scale-withpeople-3.png" — a dog politely nodding next to a small waving hand — level 3 of 5 — accent pink #E07A9A
34) file "scale-withpeople-4.png" — a dog looking up with a hand petting its head — level 4 of 5 — accent pink #E07A9A
35) file "scale-withpeople-5.png" — a dog jumping up to hug a person with hearts (person shown only as arms) — level 5 of 5 — accent pink #E07A9A
```

### Batch 10h — dog alone in the hotel

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
36) file "scale-alone-1.png" — a dog howling at a closed door with music notes — level 1 of 5 — accent gray-blue #3D7590
37) file "scale-alone-2.png" — a dog sitting by a door with a small tear — level 2 of 5 — accent gray-blue #3D7590
38) file "scale-alone-3.png" — a dog lying beside a bed with a small clock — level 3 of 5 — accent gray-blue #3D7590
39) file "scale-alone-4.png" — a dog sleeping quietly on a hotel bed with zzz — level 4 of 5 — accent gray-blue #3D7590
40) file "scale-alone-5.png" — a dog with a golden halo sitting calmly like an angel — level 5 of 5 — accent gray-blue #3D7590
```

### Batch 10i — dog in the car

```
You are designing icons for a dog-friendly group trip planner app called PawTrip. Every icon must match the app's EXISTING icon
style exactly (use the approved icons I attach as the reference; the style in words:)
STYLE: cute die-cut sticker icon. One chubby, rounded, friendly object, centered. A thick, even, dark-brown (#4A3628) outline with
rounded corners and rounded line caps (the same line thickness on every icon). Flat color fills with at most 2 tones plus a small
glossy white highlight (a short curved stripe and a tiny dot) on the upper-left of the main shape. A thick, clean, crisp white
sticker border around the whole silhouette (the same thickness on every icon). Warm palette: gold #FFC72C and amber, dark brown
#4A3628, cream #FFF4D6, white; plus the accent color given per icon. Slightly chubby proportions, light from the top-left. NO drop
shadow, NO glow, NO gradients other than the subtle tone shift, NO textures, NO realistic shading, NO text or letters, NO thin
hairline details (chunky shapes only, readable at 24 px).
FILES (very important): create EACH icon below as its OWN SEPARATE image file, never a sheet or a grid. One icon per image. Each
image is square 1024x1024 with a perfectly flat pure white (#FFFFFF) background (no checkerboard, no noise, no shadow, no gradient
on the background), the icon centered and filling about 80% of the image with equal empty margin on every side, nothing cut off, no
stray specks. Use exactly the file names given. Deliver ALL files together as ONE downloadable ZIP containing only those PNGs.
CONSISTENCY: match the existing icons' outline thickness, white border thickness, highlight style, level of detail and visual size
exactly, so all icons look like one family. People and avatars are gender-neutral. Do not ask me questions; just generate.

GROUPS: the 5 icons of one question are ONE SET (same subject, same size, same angle, only the state changes from level 1 to level 5), and
the dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Person sets show no people
faces. Keep each set instantly readable at 28 px and easy to tell apart from its neighbours in the set.

SET RULE: the 5 icons are ONE SET: same subject, same size, same angle; only the state changes from level 1 to level 5. The dog sets use the SAME friendly dog face and fur colors in every icon (cream face, golden-orange ears and patch). Each icon is ONE complete picture that fits fully inside its own square image: nothing cropped, no part of another icon, no sheet, no grid.

Icons (create exactly these 5 files):
41) file "scale-car-1.png" — a green-faced carsick dog with swirly eyes — level 1 of 5 — accent green #3E8E57
42) file "scale-car-2.png" — a dog on a car seat with a seat belt, gritting its teeth — level 2 of 5 — accent green #3E8E57
43) file "scale-car-3.png" — a dog sitting calmly in a car — level 3 of 5 — accent green #3E8E57
44) file "scale-car-4.png" — a happy dog looking out of a car window — level 4 of 5 — accent green #3E8E57
45) file "scale-car-5.png" — a dog wearing sunglasses in the front passenger seat — level 5 of 5 — accent green #3E8E57
```

## Batch 16 — dog interests (2026-11-16)
Built-in image_gen generated two separate transparent PNGs using approved scale-recall-1 and trait-runner as style references (not a sheet). dog-int-swimming: cream/gold dog paddling in blue waves, no boat. dog-int-fetch: same dog chasing a visible golden tennis ball. Both include paw-shaped collar charms, thick cocoa outlines, white sticker rims, glossy upper-left highlights; no text/shadows. UI files 512px, masters 1024px, archived in /Users/ivan/workplace/icons/batch-16-dog-interests. Remaining eleven dog activity icons reuse distinct approved paw-family assets.
Prompt: Create one new PawTrip icon, one complete square picture; supplied images are STYLE REFERENCES only. Match chubby cream dog, golden orange ears/head patch, cocoa #4A3628 thick uniform rounded outline, cream #FFF4D6, gold #FFC72C, tiny glossy white highlight, thick crisp white sticker rim. Flat colors, no realistic shading, shadow or text. Integrated golden paw collar charm. Centered 80% silhouette, equal margin, transparent PNG. Subject A: happy dog swimming with front paws paddling in small blue waves, head/upper body above water, no boat/life ring. Subject B: happy dog chasing a prominent round golden tennis ball beside raised front paws, playful running pose, no leash.
