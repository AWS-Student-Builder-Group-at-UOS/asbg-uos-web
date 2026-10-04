"""활동 게시물의 도식을 그리는 작은 SVG 도구.

모든 도식이 같은 폭, 같은 색, 같은 글자 크기를 써서 본문 안에서 한 벌로 읽히게 한다.
쓰는 법과 규칙은 prompt.md에 있다.
"""
import base64
import html
import io
import logging
import math
import urllib.request
from collections import defaultdict
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
FONT_CACHE = HERE / ".cache" / "fonts"

W = 800

INK = "#0B0F17"  # 이름, 중요한 글자
BODY = "#2B323B"  # 본문 글자
MUTED = "#5B6470"  # 설명, 기본 화살표
FAINT = "#8A94A0"  # 흐린 주석, 막힌 길
STROKE = "#C5CCD4"  # 상자 테두리
HAIR = "#E3E7EC"  # 구분선
REGION = "#F4F6F8"  # VPC, 서브넷 같은 영역의 바탕
ACCENT = "#1160D8"  # 도식마다 핵심 하나에만
ACCENT_SOFT = "#EDF3FC"  # 강조 상자의 바탕
WHITE = "#FFFFFF"

PRETENDARD_URL = (
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9"
    "/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"
)
GEIST_MONO = ROOT / "src" / "assets" / "fonts" / "GeistMono-Variable.ttf"

logging.getLogger("fontTools").setLevel(logging.ERROR)

_fonts = {}


def _variable_font(fam):
    if fam == "mono":
        return GEIST_MONO
    path = FONT_CACHE / "PretendardVariable.woff2"
    if not path.exists():
        FONT_CACHE.mkdir(parents=True, exist_ok=True)
        print("Pretendard v1.3.9 내려받는 중 ...")
        try:
            with urllib.request.urlopen(PRETENDARD_URL, timeout=60) as res:
                path.write_bytes(res.read())
        except OSError as err:
            raise SystemExit(f"Pretendard를 받지 못했습니다 ({err}).\n{PRETENDARD_URL}\n위 파일을 {path}에 직접 넣고 다시 실행하세요.")
    return path


def _static_font(fam, wt):
    """가변 글꼴을 굵기 하나로 고정한 사본. 처음 한 번 만들고 .cache에 둔다."""
    path = FONT_CACHE / f"{'pretendard' if fam == 'sans' else 'geist-mono'}-{wt}.ttf"
    if not path.exists():
        source = _variable_font(fam)
        FONT_CACHE.mkdir(parents=True, exist_ok=True)
        print(f"글꼴 준비: {path.name}")
        font = instancer.instantiateVariableFont(TTFont(source, recalcTimestamp=False), {"wght": wt}, updateFontNames=False)
        font.flavor = None
        font.recalcTimestamp = False
        font.save(path)
    return path


def _font(fam, wt):
    key = (fam, wt)
    if key not in _fonts:
        f = TTFont(_static_font(fam, wt))
        _fonts[key] = (f.getBestCmap(), f["hmtx"].metrics, f["head"].unitsPerEm)
    return _fonts[key]


def measure(s, size, wt=400, fam="sans"):
    """글자 폭(px). 상자 크기와 줄바꿈을 정할 때 쓴다."""
    cmap, hmtx, upm = _font(fam, wt)
    total = 0
    for ch in s:
        g = cmap.get(ord(ch))
        if g is None:
            raise ValueError(f"글꼴에 없는 글자: {ch!r} ({fam} {wt})")
        total += hmtx[g][0]
    return total * size / upm


def esc(s):
    return html.escape(s, quote=False)


def fmt(v):
    if isinstance(v, float):
        r = round(v, 2)
        return str(int(r)) if r == int(r) else str(r)
    return str(v)


class Run:
    """한 줄 안에서 스타일이 다른 조각. 비워 둔 값은 줄의 기본값을 따른다."""

    def __init__(self, s, size=None, wt=None, fill=None, fam=None):
        self.s, self.size, self.wt, self.fill, self.fam = s, size, wt, fill, fam


class Diagram:
    """도식 한 장. 높이와 대체 텍스트로 만들고, 그린 뒤 svg()로 꺼낸다."""

    def __init__(self, h, label, w=W, bg=WHITE):
        self.w, self.h, self.label, self.bg = w, h, label, bg
        self.els = []
        self.used = defaultdict(set)

    # -- 기본 도형 ------------------------------------------------------------
    def rect(self, x, y, w, h, fill="none", stroke=None, sw=1, dash=None):
        a = f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(w)}" height="{fmt(h)}" fill="{fill}"'
        if stroke:
            a += f' stroke="{stroke}" stroke-width="{fmt(sw)}"'
            if dash:
                a += f' stroke-dasharray="{dash}"'
        self.els.append(a + "/>")

    def path(self, d, stroke=MUTED, sw=1.5, fill="none", dash=None, join=None):
        a = f'<path d="{d}" fill="{fill}"'
        if stroke:
            a += f' stroke="{stroke}" stroke-width="{fmt(sw)}"'
        if dash:
            a += f' stroke-dasharray="{dash}"'
        if join:
            a += f' stroke-linejoin="{join}"'
        self.els.append(a + "/>")

    def line(self, x1, y1, x2, y2, stroke=HAIR, sw=1, dash=None):
        self.path(f"M{fmt(x1)} {fmt(y1)}L{fmt(x2)} {fmt(y2)}", stroke=stroke, sw=sw, dash=dash)

    def text(self, x, y, runs, size=15, wt=400, fill=INK, anchor="start", fam="sans"):
        """y는 글자 바닥선. 상자 가운데에 놓을 땐 mid()로 구한다."""
        if isinstance(runs, str):
            runs = [Run(runs)]
        a = f'<text x="{fmt(x)}" y="{fmt(y)}" font-size="{fmt(size)}"'
        if wt != 400:
            a += f' font-weight="{wt}"'
        if fam == "mono":
            a += ' class="m"'
        a += f' fill="{fill}"'
        if anchor != "start":
            a += f' text-anchor="{anchor}"'
        a += ">"
        body = ""
        for r in runs:
            for ch in r.s:
                self.used[(r.fam or fam, r.wt or wt)].add(ch)
            if r.size is None and r.wt is None and r.fill is None and r.fam is None:
                body += esc(r.s)
                continue
            t = "<tspan"
            if r.size is not None:
                t += f' font-size="{fmt(r.size)}"'
            if r.wt is not None:
                t += f' font-weight="{r.wt}"'
            if r.fam == "mono" and fam != "mono":
                t += ' class="m"'
            if r.fam == "sans" and fam == "mono":
                t += ' class="s"'
            if r.fill is not None:
                t += f' fill="{r.fill}"'
            body += t + ">" + esc(r.s) + "</tspan>"
        self.els.append(a + body + "</text>")

    def width(self, runs, size=15, wt=400, fam="sans"):
        if isinstance(runs, str):
            runs = [Run(runs)]
        return sum(measure(r.s, r.size or size, r.wt or wt, r.fam or fam) for r in runs)

    def mid(self, cy, size):
        """cy에 글자가 눈으로 보기에 가운데 오도록 하는 바닥선."""
        return cy + size * 0.37

    def fits(self, runs, size, maxw, wt=400, fam="sans"):
        """글자가 maxw를 넘으면 멈춘다. 넘친 문구를 그대로 두고 지나가지 않게."""
        wd = self.width(runs, size, wt, fam)
        if wd > maxw:
            txt = runs if isinstance(runs, str) else "".join(r.s for r in runs)
            raise ValueError(f"글자가 넘칩니다: {txt!r} {wd:.1f} > {maxw:.1f}")
        return wd

    def wrap(self, s, size, maxw, wt=400, fam="sans"):
        """띄어쓰기 단위로 줄을 나눈다. 한국어도 어절을 쪼개지 않는다."""
        lines, cur = [], ""
        for word in s.split(" "):
            trial = (cur + " " + word).strip()
            if cur and self.width(trial, size, wt, fam) > maxw:
                lines.append(cur)
                cur = word
            else:
                cur = trial
        if cur:
            lines.append(cur)
        return lines

    def para(self, x, y, s, size=14, maxw=200, lh=None, wt=400, fill=MUTED, anchor="start", fam="sans"):
        """여러 줄 문단. s가 리스트면 그 줄바꿈을 그대로 쓴다. 마지막 줄의 바닥선을 돌려준다."""
        lh = lh or round(size * 1.5, 1)
        lines = s if isinstance(s, list) else self.wrap(s, size, maxw, wt, fam)
        for i, ln in enumerate(lines):
            if self.width(ln, size, wt, fam) > maxw + 0.5:
                raise ValueError(f"줄이 너무 깁니다: {ln!r}")
            self.text(x, y + i * lh, ln, size=size, wt=wt, fill=fill, anchor=anchor, fam=fam)
        return y + (len(lines) - 1) * lh

    # -- 자주 쓰는 조합 ---------------------------------------------------------
    def box(self, x, y, w, h, title=None, sub=None, *, stroke=STROKE, fill=WHITE, sw=1,
            tsize=16, twt=600, tcolor=INK, ssize=13.5, swt=400, scolor=MUTED, sfam="sans",
            pad=14, dash=None, gap=6):
        """상자와 가운데 정렬된 이름(title), 설명(sub, 여러 줄이면 리스트). 글자가 넘치면 멈춘다."""
        self.rect(x, y, w, h, fill=fill, stroke=stroke, sw=sw, dash=dash)
        lines = []
        if title is not None:
            lines.append((title, tsize, twt, tcolor, "sans"))
        if sub is not None:
            for s in (sub if isinstance(sub, list) else [sub]):
                lines.append((s, ssize, swt, scolor, sfam))
        if not lines:
            return
        heights = [ln[1] * 0.74 for ln in lines]
        gaps = [gap + ln[1] * 0.2 for ln in lines[1:]]
        cy = y + h / 2 - (sum(heights) + sum(gaps)) / 2
        for i, (s, size, wt, color, fam) in enumerate(lines):
            base = cy + heights[i]
            limit = w - 2 * (pad - 4)
            wd = self.width(s, size, wt, fam)
            if wd > limit:
                raise ValueError(f"글자가 상자를 넘칩니다: {s!r} {wd:.1f} > {limit:.1f}")
            self.text(x + w / 2, base, s, size=size, wt=wt, fill=color, anchor="middle", fam=fam)
            cy = base + (gaps[i] if i < len(gaps) else 0)

    def arrow(self, pts, color=MUTED, sw=1.5, head="end", dash=None, size=7.5):
        """꺾인 선 화살표. 촉은 선과 같은 색으로 채운다. head는 end, start, both."""
        pts = [tuple(p) for p in pts]

        def head_at(tip, prev):
            dx, dy = tip[0] - prev[0], tip[1] - prev[1]
            ln = math.hypot(dx, dy)
            ux, uy = dx / ln, dy / ln
            bx, by = tip[0] - ux * size, tip[1] - uy * size
            half = size * 0.5
            px, py = -uy * half, ux * half
            d = f"M{fmt(tip[0])} {fmt(tip[1])}L{fmt(bx + px)} {fmt(by + py)}L{fmt(bx - px)} {fmt(by - py)}Z"
            return d, (tip[0] - ux * (size - 1), tip[1] - uy * (size - 1))

        shaft = list(pts)
        heads = []
        if head in ("end", "both"):
            d, cut = head_at(pts[-1], pts[-2])
            heads.append(d)
            shaft[-1] = cut
        if head in ("start", "both"):
            d, cut = head_at(pts[0], pts[1])
            heads.append(d)
            shaft[0] = cut
        self.path("M" + "L".join(f"{fmt(px)} {fmt(py)}" for px, py in shaft), stroke=color, sw=sw, dash=dash, join="miter")
        for d in heads:
            self.path(d, stroke=None, fill=color)

    def numbered(self, x, y, n, name, size=16, anchor="start"):
        """흐린 번호와 굵은 이름. 순서가 있는 단계에만 쓴다."""
        self.text(x, y, [Run(str(n), fam="mono", wt=500, fill=FAINT), Run("  "), Run(name, wt=600, fill=INK)], size=size, anchor=anchor)

    def badge(self, x, y, n, size=20, fill=INK, color=WHITE):
        """정사각형 번호 배지. 화살표마다 순서를 붙일 때."""
        self.rect(x, y, size, size, fill=fill)
        self.text(x + size / 2, y + size / 2 + 4.6, str(n), size=13, wt=600, fill=color, anchor="middle", fam="mono")

    def chip(self, x, y, s, size=13.5, fam="mono", fill=REGION, color=INK, stroke=None, padx=10, h=28, wt=400, anchor="start"):
        """명령어 같은 짧은 글자를 담는 바탕. 그린 위치와 폭을 돌려준다."""
        w = self.width(s, size, wt, fam) + 2 * padx
        if anchor == "middle":
            x = x - w / 2
        self.rect(x, y, w, h, fill=fill, stroke=stroke)
        self.text(x + padx, self.mid(y + h / 2, size), s, size=size, fam=fam, fill=color, wt=wt)
        return x, w

    def cross(self, cx, cy, r=6, color=MUTED, sw=2):
        """막힌 곳 표시."""
        self.path(f"M{fmt(cx - r)} {fmt(cy - r)}L{fmt(cx + r)} {fmt(cy + r)}M{fmt(cx + r)} {fmt(cy - r)}L{fmt(cx - r)} {fmt(cy + r)}", stroke=color, sw=sw)

    def lock(self, x, y, closed=True, color=INK):
        """18x20 자물쇠. 열린 자물쇠는 고리를 들어 올린다."""
        self.rect(x, y + 9, 18, 11, fill=color)
        if closed:
            self.path(f"M{fmt(x + 4.5)} {fmt(y + 9)}V{fmt(y + 2.2)}H{fmt(x + 13.5)}V{fmt(y + 9)}", stroke=color, sw=2.4)
        else:
            self.path(f"M{fmt(x + 4.5)} {fmt(y + 9)}V{fmt(y + 0.2)}H{fmt(x + 13.5)}V{fmt(y + 3.6)}", stroke=color, sw=2.4)

    # -- 출력 ------------------------------------------------------------------
    def _font_css(self, embed):
        css = []
        if embed:
            for (fam, wt), chars in sorted(self.used.items()):
                opts = subset.Options()
                opts.flavor = "woff2"
                opts.hinting = False
                opts.desubroutinize = True
                opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk"]
                opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
                opts.notdef_outline = True
                font = TTFont(_static_font(fam, wt), recalcTimestamp=False)
                sub = subset.Subsetter(opts)
                sub.populate(text="".join(sorted(set(chars) | {" "})))
                sub.subset(font)
                buf = io.BytesIO()
                font.flavor = "woff2"
                font.save(buf)
                b64 = base64.b64encode(buf.getvalue()).decode()
                name = "d-sans" if fam == "sans" else "d-mono"
                css.append(f'@font-face{{font-family:"{name}";font-weight:{wt};src:url(data:font/woff2;base64,{b64}) format("woff2")}}')
        css.append('text{font-family:"d-sans",Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}')
        css.append('.m{font-family:"d-mono","Geist Mono",ui-monospace,Menlo,Consolas,monospace}')
        css.append('.s{font-family:"d-sans",Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}')
        return "\n".join(css)

    def svg(self, embed_fonts=True):
        """SVG 문자열. 쓴 글자만 담은 Pretendard·Geist Mono 서브셋을 안에 넣는다."""
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(self.w)} {fmt(self.h)}" '
                f'role="img" aria-label="{html.escape(self.label, quote=True)}">')
        out = [head, "<style>", self._font_css(embed_fonts), "</style>",
               f'<rect width="{fmt(self.w)}" height="{fmt(self.h)}" fill="{self.bg}"/>']
        out += self.els
        out.append("</svg>")
        return "\n".join(out) + "\n"
