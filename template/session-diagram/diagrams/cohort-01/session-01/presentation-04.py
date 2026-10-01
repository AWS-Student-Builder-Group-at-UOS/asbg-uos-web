"""cohort-01/session-01/presentation-04 도식."""
from kit import *


def loop(lang):
    """디지털트윈 폐루프와 루프를 이루는 네 레이어."""
    t = {
        "ko": dict(
            label="디지털트윈 루프와 루프를 이루는 네 레이어",
            nodes=[("현실", "건물과 센서"), ("가상", "3D 복제"), ("AI", "분석과 예측"), ("제어", "설비 명령")],
            back="다시 데이터", center=("폐루프", ["결과가 다시", "입력으로 들어온다"]),
            layers_title="루프를 이루는 레이어",
            layers=[("프론트엔드", "보여 준다"), ("백엔드", "모은다"), ("인프라", "돌린다"), ("AI", "예측한다")],
            foot="하나라도 멈추면 루프 전체가 멈춘다"),
        "en": dict(
            label="The digital twin loop and the four layers that make it up",
            nodes=[("Real", "Building and sensors"), ("Virtual", "3D replica"), ("AI", "Analyze and predict"), ("Control", "Equipment commands")],
            back="data again", center=("Closed loop", ["results feed", "back in as input"]),
            layers_title="Layers that make up the loop",
            layers=[("Front-end", "shows"), ("Back-end", "collects"), ("Infrastructure", "runs"), ("AI", "predicts")],
            foot="If one stops, the whole loop stops"),
    }[lang]
    d = Diagram(300, t["label"])
    bw, bh = 176, 62
    L, R = 32, 32 + 400 - bw
    T, B = 40, 200
    pos = [(L, T), (R, T), (R, B), (L, B)]
    for (x, y), (cat, name) in zip(pos, t["nodes"]):
        d.box(x, y, bw, bh, cat, name, tsize=12.5, twt=500, tcolor=FAINT, ssize=15, scolor=INK, gap=4, swt=600)
    d.arrow([(L + bw, T + bh / 2), (R, T + bh / 2)])
    d.arrow([(R + bw / 2, T + bh), (R + bw / 2, B)])
    d.arrow([(R, B + bh / 2), (L + bw, B + bh / 2)])
    d.arrow([(L + bw / 2, B), (L + bw / 2, T + bh)], color=ACCENT)
    d.text(L + bw / 2 - 10, (T + bh + B) / 2 + 5, t["back"], size=13.5, fill=ACCENT, anchor="end")
    mx = L + 200
    d.text(mx, (T + bh + B) / 2 - 8, t["center"][0], size=14, wt=600, fill=INK, anchor="middle")
    for k, ln in enumerate(t["center"][1]):
        d.text(mx, (T + bh + B) / 2 + 14 + k * 19, ln, size=13, fill=MUTED, anchor="middle")
    # layers
    lx, rx = 480, 768
    d.text(lx, 52, t["layers_title"], size=13.5, fill=MUTED)
    ry = 66
    for k, (name, verb) in enumerate(t["layers"]):
        y = ry + k * 44
        d.line(lx, y, rx, y, stroke=HAIR)
        d.text(lx, y + 28, name, size=15, wt=600)
        d.text(rx, y + 28, verb, size=14, fill=MUTED, anchor="end")
    d.line(lx, ry + 4 * 44, rx, ry + 4 * 44, stroke=HAIR)
    d.text(lx, ry + 4 * 44 + 30, t["foot"], size=13.5, fill=BODY)
    return d


def scope(lang):
    """맡기는 범위와 검증할 수 있는 범위, 그리고 그 사이 간격."""
    t = {
        "ko": dict(
            label="맡기는 단위가 커질수록 검증 대상도 커진다. 맡기는 범위와 검증할 수 있는 범위의 간격이 다음에 배울 것",
            give="맡기는 범위", verify="검증할 수 있는 범위", limit="맡길 수 있는 상한", gap="이 간격이 다음에 배울 것",
            ticks=["한 줄", "함수, 파일", "기능", "레이어를 감싼 시스템"], axis="맡기는 단위", axis2="커질수록 검증할 것도 커진다"),
        "en": dict(
            label="The bigger the unit handed off, the bigger what must be verified. The gap between the range handed off and the range you can verify is what to learn next",
            give="Range handed off", verify="Range I can verify", limit="Upper limit of handing off", gap="That gap is what to learn next",
            ticks=["One line", "Function, file", "Feature", "System across layers"], axis="Unit handed off", axis2="bigger unit, more to verify"),
    }[lang]
    d = Diagram(262, t["label"])
    bx0, bx1 = 228, 768
    span = bx1 - bx0
    fx = [0.2, 0.43, 0.66, 1.0]
    xv = bx0 + 0.56 * span
    r1, r2, bh = 64, 118, 28
    d.text(32, d.mid(r1 + bh / 2, 15), t["give"], size=15, wt=600)
    d.text(32, d.mid(r2 + bh / 2, 15), t["verify"], size=15, wt=600)
    d.fits(t["verify"], 15, bx0 - 44, wt=600)
    d.rect(bx0, r1, span, bh, fill="#4A525C")
    d.rect(bx0, r2, xv - bx0, bh, fill="#AEB6BF")
    d.rect(xv, r2, bx1 - xv, bh, fill=ACCENT_SOFT, stroke=ACCENT, sw=1.25, dash="5 4")
    d.line(xv, r1 - 18, xv, r2 + bh + 8, stroke=INK, sw=1.25, dash="3 3")
    d.text(xv, r1 - 24, t["limit"], size=13.5, fill=BODY, anchor="middle")
    d.text((xv + bx1) / 2, r2 + bh + 26, t["gap"], size=13.5, wt=600, fill=ACCENT, anchor="middle")
    ay = 200
    d.arrow([(bx0, ay), (bx1 + 2, ay)], color=FAINT, sw=1.25, size=7)
    for f, lab in zip(fx, t["ticks"]):
        x = bx0 + f * span
        if f < 1:
            d.line(x, ay - 5, x, ay + 5, stroke=FAINT, sw=1.25)
        d.text(x if f < 1 else bx1, ay + 26, lab, size=13.5, fill=MUTED, anchor="middle" if f < 1 else "end")
    d.text(32, ay + 5, t["axis"], size=13.5, wt=600, fill=MUTED)
    d.text(32, ay + 26, t["axis2"], size=13, fill=FAINT)
    return d


def attitude(lang):
    """사람과 AI가 나눠 맡는 루프, 그리고 열어 둘 곳과 잠글 곳."""
    t = {
        "ko": dict(
            label="시작은 AI로, 끝은 내가: 사람이 스펙과 테스트를 쓰고, AI가 구현하고, 자동 테스트가 피드백을 돌리고, 사람이 검증하고 책임진다",
            human="사람", ai="AI",
            b1="스펙과 테스트 작성", b2="구현", b3=("자동 테스트", "실패하면 피드백"), b4="검증과 책임",
            nxt="다음 스펙", loop="자는 동안에도 반복",
            open=("열어 둔다", "AI가 반복해도 되는 곳", "반복, 초안, 테스트, 문서"),
            lock=("잠근다", "사람이 직접 승인하는 곳", "사용자 데이터, 결제, 배포, 보안, 큰 구조 변경")),
        "en": dict(
            label="Start with AI, finish it myself: a person writes the spec and tests, AI implements, automated tests feed back failures, and a person verifies and owns the result",
            human="Human", ai="AI",
            b1="Write spec and tests", b2="Implement", b3=("Automated tests", "feed back failures"), b4="Verify and own it",
            nxt="next spec", loop="repeats while I sleep",
            open=("Leave open", "where AI may iterate", "iteration, drafts, tests, docs"),
            lock=("Lock", "where a person approves", "user data, payments, deployment, security, big structural changes")),
    }[lang]
    lx0, lx1 = 32, 768
    h1y, h1h = 32, 88
    a1y, a1h = h1y + h1h + 6, 116
    d = Diagram(a1y + a1h + 128, t["label"])
    d.rect(lx0, h1y, lx1 - lx0, h1h, fill=REGION)
    d.rect(lx0, a1y, lx1 - lx0, a1h, fill=REGION)
    d.text(lx0 + 18, d.mid(h1y + h1h / 2, 15), t["human"], size=15, wt=700)
    bh = 44
    b1 = (126, h1y + (h1h - bh) / 2, 186)
    b4 = (lx1 - 16 - 186, h1y + (h1h - bh) / 2, 186)
    b2 = (300, a1y + 22, 112)
    b3 = (466, a1y + 16, 160)
    d.text(lx0 + 18, d.mid(b2[1] + bh / 2, 15), t["ai"], size=15, wt=700)
    d.box(b1[0], b1[1], b1[2], bh, t["b1"], tsize=15, twt=600)
    d.box(b4[0], b4[1], b4[2], bh, t["b4"], tsize=15, twt=600)
    d.box(b2[0], b2[1], b2[2], bh, t["b2"], tsize=15, twt=600)
    d.box(b3[0], b3[1], b3[2], 56, t["b3"][0], t["b3"][1], tsize=15, twt=600, ssize=13)
    c1 = b1[0] + b1[2] / 2
    d.arrow([(c1, b1[1] + bh), (c1, b2[1] + bh / 2), (b2[0], b2[1] + bh / 2)])
    yA, yB = b2[1] + 14, b2[1] + bh - 14
    d.arrow([(b2[0] + b2[2], yA), (b3[0], yA)])
    d.arrow([(b3[0], yB), (b2[0] + b2[2], yB)], color=ACCENT)
    d.text((b2[0] + b2[2] + b3[0]) / 2, b3[1] + 56 + 24, t["loop"], size=13, fill=ACCENT, anchor="middle")
    c4 = b4[0] + b4[2] / 2
    d.arrow([(b3[0] + b3[2], b3[1] + 28), (c4, b3[1] + 28), (c4, b4[1] + bh)])
    d.arrow([(b4[0], b4[1] + bh / 2), (b1[0] + b1[2], b1[1] + bh / 2)])
    d.text((b1[0] + b1[2] + b4[0]) / 2, b1[1] + bh / 2 - 8, t["nxt"], size=13, fill=MUTED, anchor="middle")
    # open / lock
    sy = a1y + a1h + 30
    colw = (lx1 - lx0 - 32) / 2
    for k, (key, closed) in enumerate((("open", False), ("lock", True))):
        x = lx0 + k * (colw + 32)
        title, sub, items = t[key]
        d.lock(x, sy - 4, closed=closed, color=INK)
        d.text(x + 30, sy + 13, [Run(title, wt=700), Run("  "), Run(sub, size=13.5, fill=MUTED)], size=15)
        d.para(x, sy + 44, items, size=14, maxw=colw, lh=21, fill=BODY)
    return d


DIAGRAMS = {
    "diagram-loop": loop,
    "diagram-scope": scope,
    "diagram-attitude": attitude,
}
LANGS = ("ko", "en")
