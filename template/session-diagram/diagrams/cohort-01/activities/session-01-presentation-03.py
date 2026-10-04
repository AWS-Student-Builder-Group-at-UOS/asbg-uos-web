"""cohort-01/activities/session-01-presentation-03 도식."""
from kit import *


def ha(lang):
    """서버 한 대에서 공유 세션 저장소까지, 질문 하나마다 구성 요소가 하나씩 늘어난다."""
    t = {
        "ko": dict(
            label="서버 한 대에서 시작해 두 대, 로드밸런서, 공유 세션 저장소까지 구조가 커지는 과정",
            user="사용자", vpc="VPC", a="서버 A", b="서버 B", lb="로드밸런서", cache="캐시 서버",
            panels=[("서버 한 대", "멈추면 서비스도 같이 멈춘다"),
                    ("한 대 더", "요청을 어느 서버로 보낼까?"),
                    ("로드밸런서", "서버가 바뀌어도 로그인은 유지될까?"),
                    ("공유 세션 저장소", "두 서버가 세션을 한곳에 두고 같이 쓴다")]),
        "en": dict(
            label="Growing from one server to two, then a load balancer, then a shared session store",
            user="User", vpc="VPC", a="Server A", b="Server B", lb="Load balancer", cache="Cache server",
            panels=[("One server", "If it stops, the service stops with it"),
                    ("One more", "Which server gets each request?"),
                    ("Load balancer", "Does the login survive a server switch?"),
                    ("Shared sessions", "Both servers keep sessions in one place")]),
    }[lang]
    left, gap = 32, 20
    pw = (W - 2 * left - 3 * gap) / 4
    top = 28
    uy = top + 60
    vy, vh = top + 82, 208
    lby, sy, cy_ = vy + 32, vy + 94, vy + 162
    bw, bh, wide = 72, 36, 118
    cap_y = vy + vh + 30
    d = Diagram(cap_y + 52, t["label"])
    for i in range(4):
        x0 = left + i * (pw + gap)
        cx = x0 + pw / 2
        if i:
            d.line(x0 - gap / 2, top, x0 - gap / 2, cap_y + 24, stroke=HAIR)
        d.numbered(x0, top + 14, i + 1, t["panels"][i][0], size=15)
        d.text(cx, uy, t["user"], size=14, fill=MUTED, anchor="middle")
        d.rect(x0, vy, pw, vh, fill=REGION)
        d.text(x0 + 10, vy + 20, t["vpc"], size=12, wt=500, fill=FAINT)
        ax, bx = cx - 41, cx + 41
        if i == 0:
            d.box(cx - bw / 2, sy, bw, bh, t["a"], tsize=14, twt=500, pad=11)
            d.arrow([(cx, uy + 9), (cx, sy)])
        else:
            d.box(ax - bw / 2, sy, bw, bh, t["a"], tsize=14, twt=500, pad=11)
            nb = i == 1
            d.box(bx - bw / 2, sy, bw, bh, t["b"], tsize=14, twt=500, pad=11, stroke=ACCENT if nb else STROKE, tcolor=ACCENT if nb else INK)
        if i == 1:
            jy = sy - 30
            d.arrow([(cx, uy + 9), (cx, jy), (ax, jy), (ax, sy)], dash="4 4", color=FAINT)
            d.arrow([(cx, jy), (bx, jy), (bx, sy)], dash="4 4", color=FAINT)
            d.rect(cx - 9, jy - 34, 18, 22, fill=REGION)
            d.text(cx, jy - 17, "?", size=17, wt=700, fill=ACCENT, anchor="middle")
        if i >= 2:
            nl = i == 2
            d.box(cx - wide / 2, lby, wide, 32, t["lb"], tsize=14, twt=500, stroke=ACCENT if nl else STROKE, tcolor=ACCENT if nl else INK)
            d.arrow([(cx, uy + 9), (cx, lby)])
            d.arrow([(ax, lby + 32), (ax, sy)])
            d.arrow([(bx, lby + 32), (bx, sy)])
        if i == 3:
            d.box(cx - wide / 2, cy_, wide, 32, t["cache"], tsize=14, twt=500, stroke=ACCENT, tcolor=ACCENT)
            d.arrow([(ax, sy + bh), (ax, cy_)])
            d.arrow([(bx, sy + bh), (bx, cy_)])
        d.para(x0, cap_y, t["panels"][i][1], size=14, maxw=pw, lh=21)
    return d


def roadmap(lang):
    """클라우드 엔지니어가 알아야 할 다섯 단계와 단계별 도구."""
    t = {
        "ko": dict(
            label="클라우드 엔지니어가 알아야 할 다섯 단계: 기본기, 구축, 운영, 자동화, 컨테이너",
            steps=[("기본기", "서버와 네트워크가 어떻게 동작하는지", ["Linux", "TCP/IP", "DNS", "HTTP"]),
                   ("구축", "CSP 하나로 서비스 환경 만들기", ["AWS"]),
                   ("운영", "지표와 로그로 문제 범위 좁히기", ["CloudWatch", "Prometheus"]),
                   ("자동화", "반복 작업을 재현 가능하게", ["Git", "스크립트", "Terraform"]),
                   ("컨테이너", "실행 환경과 배포 환경 이해하기", ["Docker", "Kubernetes"])]),
        "en": dict(
            label="The five stages a cloud engineer needs: fundamentals, build, operate, automate, containers",
            steps=[("Fundamentals", "How servers and networks work", ["Linux", "TCP/IP", "DNS", "HTTP"]),
                   ("Build", "Build a service on one CSP", ["AWS"]),
                   ("Operate", "Narrow problems down with metrics and logs", ["CloudWatch", "Prometheus"]),
                   ("Automate", "Make repeated work reproducible", ["Git", "scripts", "Terraform"]),
                   ("Containers", "Understand runtime and deployment environments", ["Docker", "Kubernetes"])]),
    }[lang]
    x0, x1 = 32, 768
    cw = (x1 - x0) / 5
    ly = 40
    nmax = max(len(st[2]) for st in t["steps"])
    probe = Diagram(10, "")
    ends = [ly + 66 + (len(probe.wrap(st[1], 13.5, cw - 16)) - 1) * 20 for st in t["steps"]]
    d = Diagram(max(ends) + 36 + (nmax - 1) * 21 + 30, t["label"])
    d.line(x0, ly, x1, ly, stroke=STROKE, sw=1.25)
    ends = [ly + 66 + (len(d.wrap(st[1], 13.5, cw - 16)) - 1) * 20 for st in t["steps"]]
    ty = max(ends) + 36
    for i, (name, desc, tools) in enumerate(t["steps"]):
        cx = x0 + i * cw
        d.rect(cx, ly - 5, 10, 10, fill=INK)
        d.numbered(cx, ly + 38, i + 1, name)
        d.fits([Run(str(i + 1)), Run("  "), Run(name, wt=600)], 16, cw - 12)
        d.para(cx, ly + 66, desc, size=13.5, maxw=cw - 16, lh=20)
        for j, tool in enumerate(tools):
            fam = "sans" if any("가" <= ch <= "힣" for ch in tool) or tool == "scripts" else "mono"
            d.text(cx, ty + j * 21, tool, size=13.5, fill=BODY, fam=fam)
    return d


DIAGRAMS = {
    "diagram-ha": ha,
    "diagram-roadmap": roadmap,
}
LANGS = ("ko", "en")
