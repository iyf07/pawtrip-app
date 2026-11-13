"""Clean AI-generated sticker icons: keep the main shape (drops slivers from neighbouring grid cells), remove colored
fringe on the white border, crop and normalize to a square.

Workflow for every new batch (always unzip the ORIGINAL 1024px files, never reuse resized copies):
    unzip batch.zip -d /tmp/batch
    python3 pawtrip/scripts/clean-icons.py /tmp/batch/<folder with pngs> /tmp/out   # writes 256px
To write other sizes, call clean(src, dst, out_px=1024) from Python: masters 1024px -> assets/icons/masters,
UI assets 512px -> assets/icons.
"""
import sys, os, numpy as np
from collections import deque
from PIL import Image

def largest_component(mask):
    """mask: bool array (h, w) -> bool array of the biggest 8-connected component."""
    h, w = mask.shape
    lab = np.zeros((h, w), np.int32)
    best, best_n, cur = 0, 0, 0
    for y in range(h):
        for x in range(w):
            if mask[y, x] and lab[y, x] == 0:
                cur += 1
                q = deque([(y, x)]); lab[y, x] = cur; n = 0
                while q:
                    cy, cx = q.popleft(); n += 1
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and lab[ny, nx] == 0:
                                lab[ny, nx] = cur; q.append((ny, nx))
                if n > best_n: best, best_n = cur, n
    return lab == best, cur

def clean(src, dst, out_px=256, pad_frac=0.04):
    im = Image.open(src).convert('RGBA')
    a = np.array(im)[..., 3]
    # work on a 256px grid for the component search, then upscale the mask
    small = np.array(Image.fromarray((a > 20).astype(np.uint8) * 255).resize((256, 256), Image.BOX)) > 40
    main, ncomp = largest_component(small)
    keep = Image.fromarray(main.astype(np.uint8) * 255).resize(im.size, Image.NEAREST)
    # grow a little so antialiased edges next to the main body are kept, then intersect with the real alpha
    from PIL import ImageFilter
    keep = keep.filter(ImageFilter.MaxFilter(15))
    arr = np.array(im)
    k = np.array(keep) > 0
    arr[..., 3] = np.where(k, arr[..., 3], 0)
    # de-fringe: the border is white, so any semi-transparent pixel becomes white (kills the pink spill)
    semi = (arr[..., 3] > 0) & (arr[..., 3] < 255)
    arr[semi, 0:3] = 255
    out = Image.fromarray(arr)
    bbox = out.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    out = out.crop(bbox)
    w, h = out.size
    side = int(max(w, h) * (1 + pad_frac * 2))
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(out, ((side - w) // 2, (side - h) // 2))
    canvas = canvas.resize((out_px, out_px), Image.LANCZOS)
    canvas.save(dst, optimize=True)
    return ncomp

if __name__ == '__main__':
    srcdir, dstdir = sys.argv[1], sys.argv[2]
    os.makedirs(dstdir, exist_ok=True)
    for f in sorted(os.listdir(srcdir)):
        if f.endswith('.png'):
            print(f, 'components:', clean(os.path.join(srcdir, f), os.path.join(dstdir, f)))
