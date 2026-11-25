#!/usr/bin/env python3
"""Regenerate typographic story covers at 16:10 with a top-safe text area."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageColor

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'worker' / 'images'
W, H = 960, 600
# Leave the lower 38% mostly clear so lead-card headlines can sit on clean dark.
SAFE = int(H * 0.50)
PAD = 56

BARLOW = '/usr/share/fonts/truetype/sand-box/google/Barlow Condensed/BarlowCondensed-Bold.ttf'
INTER = '/usr/share/fonts/truetype/sand-box/google/Inter/Inter-VariableFont_opsz,wght.ttf'
# Inter variable may fail to set weight; keep a bold static fallback
INTER_BOLD_CANDIDATES = [
    '/usr/share/fonts/truetype/sand-box/google/Inter/Inter-VariableFont_opsz,wght.ttf',
]
for p in Path('/usr/share/fonts/truetype/sand-box/google/Inter').glob('*.ttf'):
    if 'Italic' in p.name:
        continue
    INTER_BOLD_CANDIDATES.append(str(p))

CREAM = (247, 244, 237)
ORANGE = (255, 90, 31)  # #ff5a1f


def font(path, size):
    return ImageFont.truetype(path, size)


def inter(size):
    try:
        f = ImageFont.truetype(INTER, size)
        return f
    except Exception:
        return font(BARLOW, size)


def fit(draw, text, path, max_w, max_size, min_size=40):
    size = max_size
    while size >= min_size:
        f = font(path, size)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 2
    return font(path, min_size)


def measure(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def canvas(bg):
    if isinstance(bg, str):
        bg = ImageColor.getrgb(bg)
    im = Image.new('RGB', (W, H), bg)
    return im, ImageDraw.Draw(im)


def arrow(draw, x, y, length=34, color=ORANGE, width=4):
    draw.line((x, y, x + length, y), fill=color, width=width)
    head = 10
    draw.line((x + length - head, y - head + 1, x + length, y), fill=color, width=width)
    draw.line((x + length - head, y + head - 1, x + length, y), fill=color, width=width)


def rule(draw, y, color, x0=PAD, x1=W - PAD, width=3):
    draw.line((x0, y, x1, y), fill=color, width=width)


def save(im, name):
    path = OUT / name
    im.save(path, 'WEBP', quality=90, method=6)
    print('wrote', path.name, im.size, path.stat().st_size)


def number_cover(name, *, bg, accent, kicker, number, sub=None, meta=None, icon=None):
    im, d = canvas(bg)
    accent = ImageColor.getrgb(accent) if isinstance(accent, str) else accent
    bg = ImageColor.getrgb(bg) if isinstance(bg, str) else bg
    cream = CREAM
    dim = tuple(int(c * 0.75 + 180 * 0.25) for c in accent)  # muted accent for meta
    # prefer a light gray-cream for meta
    meta_color = (186, 179, 173)

    kicker_f = font(BARLOW, 32)
    d.text((PAD, 40), kicker, font=kicker_f, fill=accent)

    max_num_w = W - PAD * 2
    if icon:
        max_num_w = int(W * 0.58) - PAD
    num_f = fit(d, number, BARLOW, max_num_w, 148, 68)
    # Position the number so its visual top sits under the kicker
    num_box = d.textbbox((PAD, 0), number, font=num_f)
    num_h = num_box[3] - num_box[1]
    num_y = 96 - num_box[1]  # align ink top near 96
    # Keep number inside the safe area
    d.text((PAD, num_y), number, font=num_f, fill=cream)
    num_ink = d.textbbox((PAD, num_y), number, font=num_f)
    num_bottom = num_ink[3]

    if icon:
        icon(d, im)

    rule_y = num_bottom + 18
    if rule_y > SAFE - 86:
        rule_y = SAFE - 86
    if rule_y < num_bottom + 12:
        # Prefer a slightly smaller number over a rule through the figure
        rule_y = num_bottom + 14
    rule(d, rule_y, accent)

    y = rule_y + 18
    if sub:
        if '→' in sub or ' -> ' in sub:
            # draw left, arrow, right instead of the arrow glyph
            left, right = (sub.split('→') if '→' in sub else sub.split('->'))
            left, right = left.strip(), right.strip()
            sub_f = font(BARLOW, 32)
            d.text((PAD, y), left, font=sub_f, fill=accent)
            lw = d.textlength(left, font=sub_f)
            arrow(d, PAD + lw + 12, y + 16, length=32, color=accent)
            d.text((PAD + lw + 12 + 32 + 12, y), right, font=sub_f, fill=accent)
            y += 40
        else:
            sub_f = fit(d, sub, BARLOW, W - PAD * 2, 34, 24)
            d.text((PAD, y), sub, font=sub_f, fill=accent)
            y += 40
    if meta:
        meta_f = font(BARLOW, 24)
        d.text((PAD, y), meta, font=meta_f, fill=meta_color)

    assert y < SAFE + 8 or not (sub or meta), f'{name} text may spill into overlay zone (y={y})'
    save(im, name)


def pair_cover(name, *, bg, accent, kicker, left_label, left_num, right_label, right_num, sub):
    im, d = canvas(bg)
    accent = ImageColor.getrgb(accent) if isinstance(accent, str) else accent
    d.text((PAD, 40), kicker, font=font(BARLOW, 32), fill=accent)
    col_w = (W - PAD * 2 - 40) // 2
    label_f = font(BARLOW, 26)
    num_f_l = fit(d, left_num, BARLOW, col_w, 120, 64)
    num_f_r = fit(d, right_num, BARLOW, col_w, 120, 64)
    d.text((PAD, 110), left_label, font=label_f, fill=CREAM)
    d.text((PAD + col_w + 40, 110), right_label, font=label_f, fill=CREAM)
    d.text((PAD, 146), left_num, font=num_f_l, fill=CREAM)
    d.text((PAD + col_w + 40, 146), right_num, font=num_f_r, fill=CREAM)
    bottom = max(d.textbbox((PAD, 146), left_num, font=num_f_l)[3],
                 d.textbbox((PAD + col_w + 40, 146), right_num, font=num_f_r)[3])
    rule_y = bottom + 16
    rule(d, rule_y, accent)
    d.text((PAD, rule_y + 16), sub, font=font(BARLOW, 30), fill=accent)
    save(im, name)


def draw_gold_bars(d, im):
    gold = (232, 196, 86)
    dark = (196, 160, 56)
    def bar(cx, cy, w=96, h=34):
        inset = 16
        d.polygon([
            (cx - w//2 + inset, cy - h//2),
            (cx + w//2 - inset, cy - h//2),
            (cx + w//2, cy + h//2),
            (cx - w//2, cy + h//2),
        ], fill=gold)
        d.line((cx - w//2, cy + h//2, cx + w//2, cy + h//2), fill=dark, width=2)
    bar(800, 142)
    bar(745, 188)
    bar(855, 188)


def draw_btc_badge(d, im):
    accent = (255, 133, 74)
    cx, cy, r = 780, 200, 78
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=accent, width=5)
    # inner rounded rect (battery / device mark)
    d.rounded_rectangle((cx - 18, cy - 36, cx + 18, cy + 36), radius=6, outline=accent, width=5)


def draw_slashes(d, im):
    color = (232, 176, 152)
    # three thick slashes
    for i, x in enumerate((690, 740, 790)):
        d.line((x, 260, x + 70, 130), fill=color, width=16)


def draw_bars(d, im):
    color = (186, 170, 232)
    x, y = 700, 140
    heights = [130, 90, 55]
    for i, h in enumerate(heights):
        bx = x + i * 48
        d.rectangle((bx, y + (130 - h), bx + 32, y + 130), fill=color)


def draw_checklist(d, im):
    color = (168, 214, 196)
    x, y = 680, 120
    d.rounded_rectangle((x, y, x + 200, y + 180), radius=12, outline=color, width=4)
    for i in range(3):
        yy = y + 28 + i * 48
        # check
        d.line((x + 24, yy + 8, x + 34, yy + 20), fill=color, width=3)
        d.line((x + 34, yy + 20, x + 54, yy), fill=color, width=3)
        d.line((x + 70, yy + 10, x + 176, yy + 10), fill=color, width=3)


def draw_boxes(d, im):
    color = (126, 210, 196)
    x, y = 700, 130
    def box(bx, by):
        d.rounded_rectangle((bx, by, bx + 70, by + 70), radius=8, outline=color, width=3)
        d.line((bx + 12, by + 22, bx + 58, by + 22), fill=color, width=3)
    box(x + 20, y)
    box(x + 100, y)
    box(x, y + 86)
    box(x + 80, y + 86)
    box(x + 160, y + 86)


def draw_building(d, im):
    color = (174, 196, 230)
    x, y = 680, 120
    # pediment
    d.line((x + 20, y + 70, x + 110, y), fill=color, width=4)
    d.line((x + 110, y, x + 200, y + 70), fill=color, width=4)
    d.line((x + 20, y + 70, x + 200, y + 70), fill=color, width=4)
    # columns
    for i in range(4):
        cx = x + 48 + i * 36
        d.line((cx, y + 70, cx, y + 170), fill=color, width=5)
    d.line((x + 24, y + 174, x + 196, y + 174), fill=color, width=4)


def draw_zk(d, im):
    color = (186, 170, 232)
    x, y = 680, 120
    boxes = [(x, y), (x, y + 60), (x, y + 120)]
    for bx, by in boxes:
        d.rounded_rectangle((bx, by, bx + 44, by + 36), radius=4, outline=color, width=3)
    # target circle
    cx, cy, r = x + 170, y + 78, 32
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=color, width=3)
    # check
    d.line((cx - 10, cy, cx - 2, cy + 10), fill=color, width=3)
    d.line((cx - 2, cy + 10, cx + 14, cy - 10), fill=color, width=3)
    # connectors
    d.line((x + 44, y + 18, cx - r + 2, cy - 8), fill=color, width=2)
    d.line((x + 44, y + 78, cx - r, cy), fill=color, width=2)
    d.line((x + 44, y + 138, cx - r + 2, cy + 8), fill=color, width=2)


def flows_cover():
    bg = (20, 36, 49)
    accent = (255, 133, 74)
    im, d = canvas(bg)
    d.text((PAD, 40), 'ETHEREUM  /  24H', font=font(BARLOW, 34), fill=CREAM)
    rows = [('NKP', 1.0), ('TAC', 0.32), ('REKT', 0.14)]
    label_f = font(BARLOW, 28)
    bar_x = PAD + 110
    bar_max = W - PAD - bar_x
    y = 108
    for name, frac in rows:
        d.text((PAD, y), name, font=label_f, fill=CREAM)
        bh = 22
        d.rectangle((bar_x, y + 6, bar_x + int(bar_max * frac), y + 6 + bh), fill=accent)
        y += 54
    d.text((PAD, 272), 'Data provided by Nansen  ·  24 NOV 2026', font=font(BARLOW, 20), fill=(150, 170, 186))
    save(im, 'eth-flows-nov24.webp')


def pad_illustration(name):
    src = Image.open(OUT / name).convert('RGB')
    w, h = src.size
    th = round(w * 10 / 16)
    if th == h:
        print('skip pad (already 16:10)', name)
        return
    bg = src.getpixel((2, 2))
    canvas_im = Image.new('RGB', (w, th), bg)
    canvas_im.paste(src, (0, (th - h) // 2))
    # If original was taller than 16:10, scale it down into 16:10 instead
    if h > th:
        tw = round(h * 16 / 10)
        canvas_im = Image.new('RGB', (tw, h), bg)
        canvas_im.paste(src, ((tw - w) // 2, 0))
        canvas_im = canvas_im.resize((960, 600), Image.Resampling.LANCZOS)
    elif w != 960 or th != 600:
        canvas_im = canvas_im.resize((960, 600), Image.Resampling.LANCZOS)
    save(canvas_im, name)


def main():
    orange = '#ff5a1f'
    number_cover('btc-pce-25.webp', bg='#1d1410', accent=orange,
                 kicker='BITCOIN', number='$57,209',
                 sub='LOW $57,209 → $59,849', meta='25 NOV 2026')
    number_cover('btc-drop-24.webp', bg='#1d1410', accent=orange,
                 kicker='BITCOIN', number='$59,900',
                 sub='$64,500 → $59,900', meta='24 NOV 2026')
    number_cover('bullpen-24.webp', bg='#191512', accent=orange,
                 kicker='SOLANA WALLETS', number='$2.57M',
                 sub='UNAUTHORIZED TRANSFERS', meta='24 NOV 2026')
    number_cover('btc-etf-outflows-24.webp', bg='#141412', accent=orange,
                 kicker='BITCOIN ETFS', number='$4.71B',
                 sub='NOVEMBER NET OUTFLOWS', meta='MONDAY  -$569.7M')
    number_cover('eth-1700-24.webp', bg='#14171f', accent=orange,
                 kicker='ETHEREUM', number='$1,700',
                 sub='NEAR $1,700 ON TUESDAY', meta='ETH ETFs  -$84.9M')
    number_cover('doj-binance-24.webp', bg='#15161c', accent=orange,
                 kicker='USDC / FORFEITURE', number='$1.1B+',
                 sub='BINANCE HACK  ·  29 OCT', meta='U.S. DISTRICT COURT, D.C.')
    number_cover('btc-rebound-23.webp', bg='#241b17', accent=orange,
                 kicker='BITCOIN', number='$63,380',
                 sub='$55,500 → $63,380')
    number_cover('nvda-return-23.webp', bg='#15271f', accent='#9dcf7a',
                 kicker='NVIDIA', number='+32.2%',
                 sub='NVDA  /  NASDAQ')
    number_cover('zscaler-deal-23.webp', bg='#15233c', accent='#7da2d4',
                 kicker='CROWDSTRIKE  ×  ZSCALER', number='$43.9B',
                 sub='CRWD  /  ZS')
    number_cover('gold-session.webp', bg='#342a12', accent='#e8c456',
                 kicker='Au', number='$3,503.49',
                 meta='ZAKI NEWS', icon=draw_gold_bars)
    number_cover('btc-session.webp', bg='#1f252e', accent='#ff854a',
                 kicker='BTC / USD', number='$59,011',
                 meta='ZAKI NEWS', icon=draw_btc_badge)
    number_cover('anthropic-debut.webp', bg='#483731', accent='#e8b098',
                 kicker='ANTHROPIC', number='$88.91',
                 meta='ZAKI NEWS', icon=draw_slashes)
    number_cover('nasdaq-session.webp', bg='#221b39', accent='#baaae8',
                 kicker='NASDAQ', number='-5.28%',
                 meta='ZAKI NEWS', icon=draw_bars)
    number_cover('uk-retail.webp', bg='#123436', accent='#7ed2c4',
                 kicker='UK RETAIL', number='+0.7%',
                 meta='ZAKI NEWS', icon=draw_boxes)
    number_cover('mica-provider-register.webp', bg='#12372f', accent='#a8d6c4',
                 kicker='EU / ESMA', number='MiCA',
                 meta='ZAKI NEWS', icon=draw_checklist)
    number_cover('zk-batch-proof.webp', bg='#241e42', accent='#baaae8',
                 kicker='ETHEREUM', number='ZK-rollup',
                 meta='ZAKI NEWS', icon=draw_zk)
    number_cover('ecb-october-account.webp', bg='#182a46', accent='#aec4e6',
                 kicker='ECB', number='26 NOV',
                 meta='ZAKI NEWS', icon=draw_building)

    pair_cover('sol-xrp-etf-24.webp', bg='#13110f', accent=orange,
               kicker='SPOT ETFs  ·  MONDAY',
               left_label='SOLANA', left_num='-$3.8M',
               right_label='XRP', right_num='-$2.5M',
               sub='NET OUTFLOWS  ·  24 NOV 2026')
    flows_cover()

    for name in ('learn-btc.webp', 'learn-eth.webp', 'learn-sol.webp',
                 'learn-layers.webp', 'learn-blocks.webp'):
        pad_illustration(name)

    print('done')


if __name__ == '__main__':
    main()
