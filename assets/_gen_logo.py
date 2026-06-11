import math

CREAM = "#EDE5D8"
BURGUNDY = "#5E1619"

def build(cx=100, cy=100, R=64, n=20, splay_deg=32, half=7.5,
          wire="#EDE5D8", with_disc=False, disc="#5E1619"):
    parts = []
    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" '
                 f'role="img" aria-label="F* Smashing">')
    if with_disc:
        parts.append(f'<circle cx="{cx}" cy="{cy}" r="99" fill="{disc}"/>')
    g = []
    # main wire ring
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" '
             f'stroke="{wire}" stroke-width="2.4"/>')
    splay = math.radians(splay_deg)
    # barbs (X marks centred on the ring)
    for i in range(n):
        th = 2*math.pi*i/n
        px = cx + R*math.cos(th)
        py = cy + R*math.sin(th)
        for s in (1, -1):
            d = th + s*splay
            x1 = px - half*math.cos(d); y1 = py - half*math.sin(d)
            x2 = px + half*math.cos(d); y2 = py + half*math.sin(d)
            g.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" '
                     f'stroke="{wire}" stroke-width="2.1" stroke-linecap="round"/>')
    # twist ticks between barbs (tangential dashes -> twisted strand look)
    for i in range(n):
        th = 2*math.pi*(i+0.5)/n
        px = cx + R*math.cos(th)
        py = cy + R*math.sin(th)
        t = th + math.pi/2
        L = 4.2
        x1 = px - L*math.cos(t); y1 = py - L*math.sin(t)
        x2 = px + L*math.cos(t); y2 = py + L*math.sin(t)
        g.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" '
                 f'stroke="{wire}" stroke-width="1.7" stroke-linecap="round" opacity="0.85"/>')
    parts.append("".join(g))
    # FS monogram (classic serif; alphabetic baseline for cross-renderer safety)
    parts.append(f'<text x="100" y="123" text-anchor="middle" '
                 f'font-family="Georgia, \'Times New Roman\', serif" font-size="64" '
                 f'font-weight="500" letter-spacing="1" fill="{wire}">FS</text>')
    parts.append('</svg>')
    return "".join(parts)

base = r"C:\Users\Nikos\Desktop\Claude Projects\f-smashing\assets"

with open(base + r"\logo-mark.svg", "w", encoding="utf-8") as f:
    f.write(build(with_disc=False, wire=CREAM))

with open(base + r"\logo-emblem.svg", "w", encoding="utf-8") as f:
    f.write(build(with_disc=True, wire=CREAM, disc=BURGUNDY))

with open(base + r"\logo-burgundy.svg", "w", encoding="utf-8") as f:
    f.write(build(with_disc=False, wire=BURGUNDY))

print("logos written")
