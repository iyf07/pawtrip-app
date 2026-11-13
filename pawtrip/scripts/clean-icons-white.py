"""Cut a sticker icon out of a flat WHITE background and rebuild its white sticker border.

The silhouette is found from the artwork itself (dark outline + saturated warm colors), never from the white
background, so soft grey shadows and colored fringes outside the artwork are dropped. Enclosed light areas
(highlights, white gear hole, cream face) stay. Then a clean white border of uniform width is added.
"""
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter

def silhouette(rgb):
    a = rgb.astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    dark = (r < 150) & (g < 120) & (b < 100)                       # brown outline
    warm = ((r - b) > 70) & (r > 150) & ~((b > g + 15))            # yellow / orange / brown fills (not pink fringe)
    wall = dark | warm
    free = Image.fromarray(np.where(wall, 0, 255).astype(np.uint8)).convert('RGB')   # (floodfill needs RGB)
    ImageDraw.floodfill(free, (0, 0), (128, 128, 128))             # exterior
    ext = np.array(free)[..., 0] == 128
    return ~ext                                                     # outline + everything enclosed

def largest_parts(mask, keep_frac=0.0015):
    """Keep connected parts bigger than keep_frac of the biggest one (drops specks, keeps bulb rays)."""
    from collections import deque
    small = np.array(Image.fromarray(mask.astype(np.uint8) * 255).resize((256, 256), Image.BOX)) > 40
    h, w = small.shape; lab = np.zeros((h, w), np.int32); sizes = {}; cur = 0
    for y in range(h):
        for x in range(w):
            if small[y, x] and lab[y, x] == 0:
                cur += 1; q = deque([(y, x)]); lab[y, x] = cur; n = 0
                while q:
                    cy, cx = q.popleft(); n += 1
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < h and 0 <= nx < w and small[ny, nx] and lab[ny, nx] == 0:
                                lab[ny, nx] = cur; q.append((ny, nx))
                sizes[cur] = n
    big = max(sizes.values())
    keep = np.isin(lab, [k for k, v in sizes.items() if v >= keep_frac * big])
    up = np.array(Image.fromarray(keep.astype(np.uint8) * 255).resize(mask.shape[::-1], Image.NEAREST)) > 0
    grown = np.array(Image.fromarray(up.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(21))) > 0
    return mask & grown

def process(src, dst, out_px=512, border_frac=0.035, pad_frac=0.03):
    rgb = np.array(Image.open(src).convert('RGB'))
    obj = largest_parts(silhouette(rgb))
    ys, xs = np.where(obj); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    size = max(x1 - x0, y1 - y0)
    bw = max(4, int(size * border_frac))                           # border width in px (same share on every icon)
    mask = Image.fromarray(obj.astype(np.uint8) * 255)
    # round dilation: blur then threshold, in the 0..255 domain for smooth edges
    grown = mask.filter(ImageFilter.GaussianBlur(bw * 0.9)).point(lambda v: 255 if v > 22 else 0)
    grown = grown.filter(ImageFilter.GaussianBlur(1.2))
    # artwork alpha (smooth edge) and white border
    art_a = mask.filter(ImageFilter.GaussianBlur(0.8))
    h, w = obj.shape
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = np.array(grown)
    art = np.array(art_a) / 255.0
    for c in range(3):
        out[..., c] = (rgb[..., c] * art + 255 * (1 - art)).astype(np.uint8)
    im = Image.fromarray(out)
    bbox = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    im = im.crop(bbox); cw, ch = im.size
    side = int(max(cw, ch) * (1 + pad_frac * 2))
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - cw) // 2, (side - ch) // 2))
    canvas.resize((out_px, out_px), Image.LANCZOS).save(dst, optimize=True)

if __name__ == '__main__':
    srcdir, dstdir, px = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 512
    os.makedirs(dstdir, exist_ok=True)
    for f in sorted(os.listdir(srcdir)):
        if f.lower().endswith('.png'):
            process(os.path.join(srcdir, f), os.path.join(dstdir, f), px); print(f)
