"""cohort-01/session-02/presentation-02 도식."""
from kit import *


BAR = "#AEB6BF"
DARK = "#4A525C"


def requests(lang):
    """개발자 도구 Network 탭처럼 그린 요청 목록과 요청 수."""
    t = {
        "ko": dict(
            label="브라우저가 HTML 하나를 받은 뒤 CSS, JavaScript, 이미지와 폰트, API 요청을 이어서 보내 네이버 메인 페이지 하나에 요청 263개가 기록된다",
            cols=("이름", "유형", "시간"), arrive="HTML 도착",
            rows=[("index.html", "HTML", "페이지 뼈대"), ("style.css", "CSS", "화면 꾸미기"), ("app.js", "JavaScript", "기능 실행"),
                  ("logo.png", "이미지", ""), ("font.woff2", "폰트", ""), ("/api/feed", "API", "화면에 표시할 데이터")],
            count=[Run("요청 ", fill=MUTED), Run("263", fam="mono", wt=600, fill=ACCENT), Run("개", fill=MUTED)],
            where="네이버 메인 페이지를 한 번 열었을 때"),
        "en": dict(
            label="After the browser receives one HTML file it keeps requesting CSS, JavaScript, images, fonts and API data: opening the Naver home page once logged 263 requests",
            cols=("Name", "Type", "Time"), arrive="HTML arrives",
            rows=[("index.html", "HTML", "page structure"), ("style.css", "CSS", "styling"), ("app.js", "JavaScript", "features"),
                  ("logo.png", "Image", ""), ("font.woff2", "Font", ""), ("/api/feed", "API", "data to display")],
            count=[Run("263", fam="mono", wt=600, fill=ACCENT), Run(" requests", fill=MUTED)],
            where="opening the Naver home page once"),
    }[lang]
    x0, x1 = 32, 768
    top, hh, rh = 32, 32, 34
    n = len(t["rows"])
    ey = top + hh + n * rh
    fy = ey + 30
    H = fy + 38 + 28
    d = Diagram(H, t["label"])
    nx, tx, lx0, lx1 = x0 + 16, 214, 482, 752
    d.rect(x0, top, x1 - x0, fy + 38 - top, fill=WHITE, stroke=STROKE)
    d.rect(x0, top, x1 - x0, hh, fill=REGION)
    d.line(x0, top + hh, x1, top + hh, stroke=STROKE)
    d.text(nx, d.mid(top + hh / 2, 12.5), t["cols"][0], size=12.5, wt=600, fill=MUTED)
    d.text(tx, d.mid(top + hh / 2, 12.5), t["cols"][1], size=12.5, wt=600, fill=MUTED)
    d.line(tx - 14, top, tx - 14, fy, stroke=HAIR)
    d.line(lx0 - 14, top, lx0 - 14, fy, stroke=HAIR)
    span = lx1 - lx0
    d.text(lx1 - 14, d.mid(top + hh / 2, 12.5), t["cols"][2], size=12.5, wt=600, fill=MUTED, anchor="end")
    d.arrow([(lx1 - 10, top + hh / 2), (lx1 + 2, top + hh / 2)], color=MUTED, sw=1.25, size=6)
    bars = [(0, 0.26), (0.30, 0.18), (0.32, 0.34), (0.35, 0.14), (0.37, 0.22), (0.46, 0.40)]
    html_end = lx0 + 0.26 * span
    for k, ((name, typ, role), (s0, w0)) in enumerate(zip(t["rows"], bars)):
        y = top + hh + k * rh
        if k:
            d.line(x0, y, x1, y, stroke=HAIR)
        cy = y + rh / 2
        d.text(nx, d.mid(cy, 13.5), name, size=13.5, fam="mono", fill=INK)
        runs = [Run(typ, wt=600, fill=INK)]
        if role:
            runs += [Run("  "), Run(role, fill=MUTED, size=12.5)]
        d.fits(runs, 13.5, lx0 - 14 - tx - 10)
        d.text(tx, d.mid(cy, 13.5), runs, size=13.5)
        d.rect(lx0 + s0 * span, cy - 6, w0 * span, 12, fill=DARK if k == 0 else BAR)
    # the rest of the 263 requests, faded
    d.line(x0, ey, x1, ey, stroke=HAIR)
    d.text(nx, ey + 20, "⋮", size=15, fill=FAINT)
    for k, (s0, w0) in enumerate([(0.52, 0.12), (0.58, 0.2), (0.66, 0.1)]):
        d.rect(lx0 + s0 * span, ey + 6 + k * 7, w0 * span, 4, fill=HAIR)
    d.line(html_end, top + hh + rh, html_end, fy, stroke=INK, sw=1, dash="3 3")
    d.text(html_end + 6, top + hh + rh - 8, t["arrive"], size=12, fill=BODY)
    d.rect(x0, fy, x1 - x0, 38, fill=REGION)
    d.line(x0, fy, x1, fy, stroke=STROKE)
    d.text(nx, d.mid(fy + 19, 15), t["count"], size=15)
    d.text(x1 - 16, d.mid(fy + 19, 13), t["where"], size=13, fill=MUTED, anchor="end")
    return d


def tiers(lang):
    """서버 한 대에 모으기와 3-Tier로 나누기를 같은 줄로 비교한다."""
    t = {
        "ko": dict(
            label="서버 한 대에 WEB, APP, DB가 CPU·메모리·디스크를 함께 쓰는 구성과, 세 역할을 Presentation, Application, Data 계층으로 나눠 각자 자원을 갖는 3-Tier 구성의 비교",
            one="서버 한 대", three="3-Tier", split="나누면",
            roles=[("WEB", "Nginx", "Presentation Tier"), ("APP", "Spring Boot", "Application Tier, WAS"), ("DB", "MySQL", "Data Tier")],
            shared="CPU, 메모리, 디스크를 함께 쓴다", own="CPU, 메모리, 디스크",
            cap1="APP이 바쁘면 WEB과 DB도 느려진다", cap2="계층마다 실행 환경과 자원을 따로 쓴다"),
        "en": dict(
            label="One server where WEB, APP and DB share CPU, memory and disk, compared with a 3-tier setup that splits the roles into presentation, application and data tiers, each with its own resources",
            one="One server", three="3-Tier", split="Split",
            roles=[("WEB", "Nginx", "Presentation tier"), ("APP", "Spring Boot", "Application tier, WAS"), ("DB", "MySQL", "Data tier")],
            shared="All three share CPU, memory, disk", own="CPU, memory, disk",
            cap1="A busy APP slows WEB and DB down too", cap2="Each tier has its own runtime and resources"),
    }[lang]
    d = Diagram(336, t["label"])
    lx0, lx1 = 32, 336
    rx0, rx1 = 432, 768
    d.text(lx0, 42, t["one"], size=16, wt=700)
    d.text(rx0, 42, t["three"], size=16, wt=700)
    # left: one server, three roles, one shared resource
    d.rect(lx0, 58, lx1 - lx0, 226, fill=WHITE, stroke=INK, sw=1.25)
    for k, (role, tech, _) in enumerate(t["roles"]):
        y = 74 + k * 52
        busy = k == 1
        d.rect(lx0 + 16, y, lx1 - lx0 - 32, 40, fill=WHITE, stroke=ACCENT if busy else STROKE, sw=1.5 if busy else 1)
        d.text(lx0 + 30, d.mid(y + 20, 15), [Run(role, wt=700, fill=ACCENT if busy else INK), Run("  "), Run(tech, size=13, fill=MUTED)], size=15)
    d.rect(lx0 + 16, 236, lx1 - lx0 - 32, 32, fill=REGION)
    d.text((lx0 + lx1) / 2, d.mid(252, 13), t["shared"], size=13, fill=BODY, anchor="middle")
    d.text(lx0, 312, t["cap1"], size=13.5, fill=MUTED)
    # arrow between
    d.arrow([(lx1 + 20, 171), (rx0 - 20, 171)], color=FAINT)
    d.text((lx1 + rx0) / 2, 160, t["split"], size=12.5, fill=MUTED, anchor="middle")
    # right: three servers, each with its own resources
    bh, gap = 56, 29
    for k, (role, tech, tier) in enumerate(t["roles"]):
        y = 58 + k * (bh + gap)
        d.rect(rx0, y, rx1 - rx0, bh, fill=WHITE, stroke=INK, sw=1.25)
        d.text(rx0 + 16, y + 24, [Run(role, wt=700), Run("  "), Run(tech, size=13, fill=MUTED)], size=15)
        d.text(rx0 + 16, y + 44, tier, size=12, fill=FAINT)
        cw = d.width(t["own"], 12.5) + 20
        d.rect(rx1 - 12 - cw, y + 14, cw, 28, fill=REGION)
        d.text(rx1 - 12 - cw + 10, d.mid(y + 28, 12.5), t["own"], size=12.5, fill=BODY)
        if k < 2:
            d.arrow([(rx0 + 40, y + bh), (rx0 + 40, y + bh + gap)])
    d.text(rx0, 312, t["cap2"], size=13.5, fill=MUTED)
    return d


def tier_sg(lang):
    """계층마다 보안 그룹을 두고 바로 앞 계층에서 오는 통신만 허용한다."""
    t = {
        "ko": dict(
            label="사용자, 외부 로드밸런서, WEB, APP, DB가 차례로 이어지고, 각 계층의 보안 그룹은 바로 앞 계층에서 오는 통신만 허용해 사용자가 DB에 직접 접근할 수 없다",
            user=("사용자", "브라우저"), sg="보안 그룹", allow="허용",
            tiers=[("외부 LB", "ALB", "사용자의 웹 접속"), ("WEB", "Nginx", "외부 LB에서 온 요청"),
                   ("APP", "Spring Boot", ["WEB이나 내부 LB에서", "온 요청"]), ("DB", "MySQL", "APP에서 온 DB 포트 통신")],
            blocked="사용자가 DB로 바로 가는 길은 막혀 있다"),
        "en": dict(
            label="User, external load balancer, WEB, APP and DB in a chain; each tier's security group only allows traffic from the tier right before it, so the user can't reach the DB directly",
            user=("User", "browser"), sg="security group", allow="allows",
            tiers=[("External LB", "ALB", "web traffic from users"), ("WEB", "Nginx", "requests from the external LB"),
                   ("APP", "Spring Boot", ["requests from WEB", "or an internal LB"]), ("DB", "MySQL", "DB-port traffic from APP")],
            blocked="No direct path from the user to the DB"),
    }[lang]
    d = Diagram(276, t["label"])
    uw, fw, gap = 70, 146, 19
    fy, fh = 92, 88
    cy = fy + fh / 2
    d.box(32, cy - 28, uw, 56, t["user"][0], t["user"][1], tsize=14, twt=600, ssize=12)
    prev = 32 + uw
    centers = []
    for k, (name, tech, rule) in enumerate(t["tiers"]):
        fx = 32 + uw + gap + k * (fw + gap)
        d.rect(fx, fy, fw, fh, fill="none", stroke=ACCENT, sw=1.25, dash="5 3")
        d.box(fx + 12, fy + 16, fw - 24, fh - 32, name, tech, tsize=14.5, twt=700, ssize=12.5, pad=10, gap=4)
        d.arrow([(prev, cy), (fx + 12, cy)])
        prev = fx + fw - 12
        d.text(fx, fy + fh + 24, t["allow"], size=12, wt=600, fill=ACCENT)
        d.para(fx, fy + fh + 44, rule, size=13, maxw=fw, lh=19, fill=BODY)
        centers.append(fx + fw / 2)
    # legend
    lx = 32
    d.rect(lx, 30, 16, 12, fill="none", stroke=ACCENT, sw=1.25, dash="5 3")
    d.text(lx + 24, 41, t["sg"], size=12.5, fill=ACCENT)
    # blocked shortcut, drawn above the chain
    ux = 32 + uw / 2
    by = 66
    d.path(f"M{fmt(ux)} {fmt(cy - 28)}V{fmt(by)}H{fmt(centers[-1])}V{fmt(fy - 10)}", stroke=FAINT, sw=1.5, dash="5 4")
    d.cross(centers[-1], fy - 6, r=5.5, color=INK, sw=2)
    d.text(centers[-1] - 14, by - 8, t["blocked"], size=12.5, fill=MUTED, anchor="end")
    return d


def scale(lang):
    """APP만 1대에서 3대로 늘리고, Scale Up과 Scale Out을 비교한다."""
    t = {
        "ko": dict(
            label="APP 계층만 1대에서 3대로 늘리고 WEB과 DB는 그대로 둔다. 서버 사양을 키우는 Scale Up과 서버 수를 늘리는 Scale Out의 차이",
            web=("WEB", "Nginx"), lb="로드밸런서", app="APP", tech="Spring Boot", db=("DB", "MySQL"),
            asg="Auto Scaling", same="1대 그대로", grow="1대에서 3대로",
            up=("Scale Up", "서버 사양을 키운다", "CPU, 메모리 증설"), out=("Scale Out", "서버 수를 늘린다", "로드밸런서로 분산")),
        "en": dict(
            label="Only the APP tier grows from one server to three while WEB and DB stay as they are; Scale Up makes a server bigger, Scale Out adds more servers",
            web=("WEB", "Nginx"), lb="Load balancer", app="APP", tech="Spring Boot", db=("DB", "MySQL"),
            asg="Auto Scaling", same="stays at one", grow="one grows to three",
            up=("Scale Up", "a bigger server", "more CPU and memory"), out=("Scale Out", "more servers", "spread by a load balancer")),
    }[lang]
    d = Diagram(300, t["label"])
    cy = 146
    d.box(32, cy - 32, 84, 64, *t["web"], tsize=15, twt=700, ssize=12.5, gap=3)
    d.text(74, cy + 62, t["same"], size=12.5, fill=MUTED, anchor="middle")
    lbx, lbw = 140, 120
    d.box(lbx, cy - 22, lbw, 44, t["lb"], tsize=13.5, twt=600, pad=10)
    d.arrow([(116, cy), (lbx, cy)])
    fx, fw = 290, 178
    d.rect(fx, 52, fw, 188, fill=REGION)
    d.text(fx + 12, 72, t["asg"], size=12.5, wt=600, fill=MUTED)
    ys = [cy - 50, cy, cy + 50]
    for k, y in enumerate(ys):
        new = k > 0
        d.rect(fx + 16, y - 18, fw - 32, 36, fill=WHITE, stroke=ACCENT if new else STROKE, sw=1.5 if new else 1)
        d.text(fx + 30, d.mid(y, 14), [Run(t["app"], wt=700, fill=ACCENT if new else INK), Run("  "), Run(t["tech"], size=12.5, fill=MUTED)], size=14)
        d.arrow([(lbx + lbw, cy), (lbx + lbw + 14, cy), (lbx + lbw + 14, y), (fx + 16, y)] if k != 1 else [(lbx + lbw, cy), (fx + 16, cy)])
    d.text(fx + fw / 2, cy + 62 + 52, t["grow"], size=13, wt=600, fill=ACCENT, anchor="middle")
    dbx = 498
    d.box(dbx, cy - 32, 84, 64, *t["db"], tsize=15, twt=700, ssize=12.5, gap=3)
    d.text(dbx + 42, cy + 62, t["same"], size=12.5, fill=MUTED, anchor="middle")
    for y in ys:
        d.arrow([(fx + fw - 16, y), (fx + fw - 2, y), (fx + fw - 2, cy), (dbx, cy)] if y != cy else [(fx + fw - 16, cy), (dbx, cy)])
    # scale up vs scale out
    sx = 624
    d.line(sx - 22, 52, sx - 22, 240, stroke=HAIR)
    for k, (key, y0) in enumerate((("up", 44), ("out", 166))):
        name, desc, note = t[key]
        d.text(sx, y0 + 14, name, size=14, wt=700)
        base = y0 + 66
        d.rect(sx, base - 22, 22, 22, fill=WHITE, stroke=STROKE)
        d.arrow([(sx + 28, base - 11), (sx + 50, base - 11)], color=FAINT, sw=1.25, size=6)
        if key == "up":
            d.rect(sx + 58, base - 40, 40, 40, fill=WHITE, stroke=ACCENT, sw=1.5)
        else:
            for j in range(3):
                d.rect(sx + 58 + j * 30, base - 22, 22, 22, fill=WHITE, stroke=ACCENT, sw=1.5)
        d.text(sx, base + 22, desc, size=13, fill=BODY)
        d.text(sx, base + 39, note, size=12, fill=FAINT)
    return d


def nginx(lang):
    """브라우저 요청을 80번 포트의 Nginx가 받아 디스크의 파일로 응답한다."""
    t = {
        "ko": dict(
            label="브라우저가 EC2의 80번 포트로 HTTP 요청을 보내면, 80번 포트에서 실행 중인 Nginx가 /usr/share/nginx/html의 정적 파일을 읽어 브라우저에 응답한다",
            browser="사용자 브라우저", ec2=("EC2 인스턴스", "인터넷에 연결된 컴퓨터 한 대"),
            proc="실행 중인 프로그램", disk="디스크에 저장된 파일",
            nginx=("Nginx", ["웹 서버 프로그램", "80번 포트에서 대기"]),
            s1="HTTP 요청", s2="읽기", s3="파일로 응답"),
        "en": dict(
            label="When the browser sends an HTTP request to port 80 on the EC2 instance, Nginx, running on port 80, reads the static files in /usr/share/nginx/html and sends them back",
            browser="User's browser", ec2=("EC2 instance", "one computer connected to the internet"),
            proc="running program", disk="files on disk",
            nginx=("Nginx", ["web server program", "waiting on port 80"]),
            s1="request", s2="read", s3="response"),
    }[lang]
    d = Diagram(300, t["label"])
    # browser window
    bx, by, bw, bh = 32, 92, 152, 118
    d.rect(bx, by, bw, bh, fill=WHITE, stroke=INK, sw=1.25)
    d.rect(bx, by, bw, 22, fill=REGION, stroke=INK, sw=1.25)
    for k in range(3):
        d.rect(bx + 10 + k * 10, by + 8, 6, 6, fill=FAINT)
    d.rect(bx + 12, by + 34, bw - 24, 24, fill=WHITE, stroke=STROKE)
    d.text(bx + 20, d.mid(by + 46, 11.5), "http://PUBLIC_IP", size=11.5, fill=BODY, fam="mono")
    d.text(bx + bw / 2, by + bh + 26, t["browser"], size=14, wt=600, anchor="middle")
    # ec2
    ex0, ex1, ey0, ey1 = 304, 768, 40, 264
    d.rect(ex0, ey0, ex1 - ex0, ey1 - ey0, fill=WHITE, stroke=INK, sw=1.25)
    d.text(ex0 + 20, ey0 + 28, [Run(t["ec2"][0], wt=700), Run("  "), Run(t["ec2"][1], size=13, fill=MUTED)], size=15)
    px0, pw = 362, 162
    fx0, fw = 580, 176
    top = 104
    d.text(px0, top - 10, t["proc"], size=12.5, fill=FAINT)
    d.text(fx0, top - 10, t["disk"], size=12.5, fill=FAINT)
    d.box(px0, top, pw, 100, t["nginx"][0], t["nginx"][1], tsize=18, twt=700, tcolor=ACCENT, ssize=12.5, stroke=ACCENT, sw=1.5, gap=5)
    d.rect(fx0, top, fw, 140, fill=REGION)
    d.text(fx0 + 14, top + 26, "/usr/share/nginx/html", size=12.5, wt=500, fill=BODY, fam="mono")
    for k, f in enumerate(["index.html", "style.css", "app.js"]):
        y = top + 50 + k * 28
        d.rect(fx0 + 14, y, fw - 28, 22, fill=WHITE, stroke=STROKE)
        d.text(fx0 + 24, d.mid(y + 11, 12.5), f, size=12.5, fill=INK, fam="mono")
    # port 80 door on the instance edge
    ry, sy3 = 132, 188
    d.rect(ex0 - 18, ry - 15, 36, 30, fill=ACCENT)
    d.text(ex0, d.mid(ry, 14), "80", size=14, wt=600, fill=WHITE, anchor="middle", fam="mono")
    d.arrow([(bx + bw, ry), (ex0 - 18, ry)])
    d.arrow([(ex0 + 18, ry), (px0, ry)])
    d.arrow([(px0 + pw, 150), (fx0, 150)])
    d.arrow([(px0, sy3), (bx + bw, sy3)], color=ACCENT)

    def step(x, y, n, s, color=INK):
        d.badge(x, y - 14, n, size=18)
        d.text(x + 24, y, s, size=13, fill=color, wt=500)

    step(bx + bw + 8, ry - 12, 1, t["s1"])
    step(px0 + pw + 8, 138, 2, t["s2"])
    step(bx + bw + 8, sy3 + 26, 3, t["s3"], color=ACCENT)
    return d


def build_order(lang):
    """만들 땐 바깥에서 안으로, 지울 땐 안에서 바깥으로."""
    t = {
        "ko": dict(
            label="EC2를 만드는 순서는 VPC, 인터넷 게이트웨이, 서브넷, 보안 그룹, EC2로 바깥에서 안으로 들어가고, 지우는 순서는 그 역순이다. 서울 리전 기본 VPC가 앞의 세 단계를 이미 갖추고 있어 실습은 보안 그룹부터 직접 만들었다",
            layers=["VPC", "인터넷 게이트웨이", "서브넷", "보안 그룹", "EC2"],
            make=("만들 때", "바깥에서 안으로"), drop=("지울 때", "안에서 바깥으로", ["안에 리소스가 남아 있으면", "바깥은 지워지지 않는다"]),
            had="서울 리전 기본 VPC에 이미 있다", made="이번 실습에서 직접 만든 것"),
        "en": dict(
            label="Build an EC2 instance from the outside in: VPC, internet gateway, subnet, security group, EC2; delete in reverse. The Seoul region's default VPC already has the first three, so the lab started from the security group",
            layers=["VPC", "Internet gateway", "Subnet", "Security group", "EC2"],
            make=("Build", "outside in"), drop=("Delete", "inside out", ["An outer resource", "won't delete while", "inner ones remain"]),
            had="already in the Seoul default VPC", made="built in this lab"),
    }[lang]
    d = Diagram(396, t["label"])
    L = t["layers"]
    vx0, vx1, vy0, vy1 = 220, 580, 52, 318
    d.rect(vx0, vy0, vx1 - vx0, vy1 - vy0, fill=REGION, stroke=STROKE)
    d.badge(vx0 + 14, vy0 + 14, 1)
    d.text(vx0 + 42, vy0 + 28, L[0], size=14.5, wt=700)
    gw = d.width(L[1], 14, 600) + 58
    gx = vx1 - 16 - gw
    d.rect(gx, vy0 - 18, gw, 36, fill=REGION, stroke=STROKE)
    d.badge(gx + 10, vy0 - 9, 2)
    d.text(gx + 38, d.mid(vy0, 14), L[1], size=14, wt=600)
    sx0, sx1, sy0, sy1 = vx0 + 22, vx1 - 22, vy0 + 50, vy1 - 18
    d.rect(sx0, sy0, sx1 - sx0, sy1 - sy0, fill="#E8ECF0")
    d.badge(sx0 + 14, sy0 + 14, 3)
    d.text(sx0 + 42, sy0 + 28, L[2], size=14.5, wt=700)
    gx0, gx1, gy0, gy1 = sx0 + 22, sx1 - 22, sy0 + 48, sy1 - 18
    d.rect(gx0, gy0, gx1 - gx0, gy1 - gy0, fill=WHITE, stroke=ACCENT, sw=1.5)
    d.badge(gx0 + 14, gy0 + 14, 4, fill=ACCENT)
    d.text(gx0 + 42, gy0 + 28, L[3], size=14.5, wt=700, fill=ACCENT)
    cx = (gx0 + gx1) / 2
    ew, eh = 150, 50
    ey = gy0 + 52
    d.rect(cx - ew / 2, ey, ew, eh, fill=ACCENT_SOFT, stroke=ACCENT, sw=1.5)
    d.badge(cx - 30, ey + 16, 5, fill=ACCENT)
    d.text(cx - 4, d.mid(ey + eh / 2, 15), L[4], size=15, wt=700, fill=ACCENT)
    # build: down the left, delete: up the right
    ay0, ay1 = vy0 + 6, ey + eh
    d.arrow([(176, ay0), (176, ay1)], color=INK, sw=1.5)
    d.text(160, ay0 + 14, t["make"][0], size=14.5, wt=700, anchor="end")
    d.text(160, ay0 + 34, t["make"][1], size=13, fill=MUTED, anchor="end")
    d.arrow([(624, ay1), (624, ay0)], color=INK, sw=1.5)
    d.text(640, ay0 + 14, t["drop"][0], size=14.5, wt=700)
    d.text(640, ay0 + 34, t["drop"][1], size=13, fill=MUTED)
    d.para(640, ay1 - 9 - 17 * (len(t["drop"][2]) - 1), t["drop"][2], size=12, maxw=128, lh=17, fill=FAINT)
    # legend
    ly = 352
    d.rect(vx0, ly - 11, 16, 14, fill=REGION, stroke=STROKE)
    d.text(vx0 + 24, ly, [Run("1~3  ", wt=600, fill=MUTED), Run(t["had"], fill=BODY)], size=13)
    lx2 = vx0 + 24 + d.width([Run("1~3  ", wt=600), Run(t["had"])], 13) + 32
    d.rect(lx2, ly - 11, 16, 14, fill=WHITE, stroke=ACCENT, sw=1.5)
    d.text(lx2 + 24, ly, [Run("4, 5  ", wt=600, fill=ACCENT), Run(t["made"], fill=BODY)], size=13)
    return d


def sg_rules(lang):
    """허용한 출발지와 포트만 EC2에 닿는다. 오른쪽은 규칙 표."""
    t = {
        "ko": dict(
            label="개발자 컴퓨터 7.7.7.7에서 오는 SSH 22번 포트와 누구나(0.0.0.0/0)에서 오는 HTTP 80번 포트만 인터넷 게이트웨이와 보안 그룹을 지나 EC2에 닿고, 허용 규칙이 없는 다른 IP의 SSH 같은 인바운드는 보안 그룹에서 막힌다",
            senders=[("개발자", "7.7.7.7"), ("누구나", "일반 사용자"), ("누구나", "다른 IP")],
            ports=["SSH 22", "HTTP 80", "SSH 22"], igw="IGW", vpc="VPC", sg="보안 그룹", blocked="규칙에 없어 차단",
            inbound="인바운드 규칙", outbound="아웃바운드 규칙", heads=("유형", "포트", "소스"), out_heads=("유형", "포트", "대상"),
            rules=[("SSH", "TCP 22", "7.7.7.7/32", "이 IP 하나만"), ("HTTP", "TCP 80", "0.0.0.0/0", "모든 IP")],
            out=("모든 트래픽", "전체", "0.0.0.0/0", ""),
            note="실습에서는 SSH 소스로 '내 IP'를 고른다"),
        "en": dict(
            label="Only SSH on port 22 from the developer's computer at 7.7.7.7 and HTTP on port 80 from anyone (0.0.0.0/0) pass the internet gateway and the security group to reach EC2; inbound traffic with no allow rule, like SSH from another IP, stops at the security group",
            senders=[("Developer", "7.7.7.7"), ("Anyone", "regular users"), ("Anyone", "another IP")],
            ports=["SSH 22", "HTTP 80", "SSH 22"], igw="IGW", vpc="VPC", sg="Security group", blocked="no rule, blocked",
            inbound="Inbound rules", outbound="Outbound rules", heads=("Type", "Port", "Source"), out_heads=("Type", "Port", "Destination"),
            rules=[("SSH", "TCP 22", "7.7.7.7/32", "this one IP"), ("HTTP", "TCP 80", "0.0.0.0/0", "every IP")],
            out=("All traffic", "All", "0.0.0.0/0", ""),
            note="In the lab, pick My IP as the SSH source"),
    }[lang]
    d = Diagram(330, t["label"])
    rows = [110, 174, 250]
    sw_, sh = 112, 44
    gx = 194
    vx1 = 444
    d.rect(gx, 56, vx1 - gx, 240, fill=REGION)
    d.text(gx + 18, 286, t["vpc"], size=12.5, wt=600, fill=MUTED)
    sgx0, sgy0, sgx1, sgy1 = 304, 76, 432, 280
    d.rect(sgx0, sgy0, sgx1 - sgx0, sgy1 - sgy0, fill=WHITE, stroke=ACCENT, sw=1.5)
    d.text(sgx0, 69, t["sg"], size=12.5, wt=600, fill=ACCENT)
    ex0, ey0, ey1 = 336, rows[0] - 20, rows[1] + 20
    d.box(ex0, ey0, 82, ey1 - ey0, "EC2", tsize=16, twt=700)
    for k, ((name, sub), port) in enumerate(zip(t["senders"], t["ports"])):
        y = rows[k]
        blocked = k == 2
        fam = "mono" if any(ch.isdigit() for ch in sub) else "sans"
        d.box(32, y - sh / 2, sw_, sh, name, sub, tsize=13.5, twt=600, ssize=12, sfam=fam, gap=3,
              tcolor=FAINT if blocked else INK, scolor=FAINT if blocked else MUTED, stroke=HAIR if blocked else STROKE)
        if blocked:
            d.path(f"M{32 + sw_} {y}H{sgx0 - 8}", stroke=FAINT, sw=1.5, dash="5 4")
            d.cross(sgx0, y, r=6, color=INK, sw=2)
            d.text(sgx0 + 14, y + 4.5, t["blocked"], size=12.5, fill=MUTED)
        else:
            d.arrow([(32 + sw_, y), (ex0, y)])
        d.text(gx + 18, y - 8, port, size=12, fill=FAINT if blocked else BODY, fam="mono", wt=500)
    d.rect(gx - 9, 64, 18, 224, fill=WHITE, stroke=INK, sw=1.25)
    d.text(gx, 48, t["igw"], size=12.5, wt=600, fill=MUTED, anchor="middle")
    # rules table
    tx0, tx1 = 480, 768
    c1, c2, c3 = tx0, tx0 + 96, tx0 + 170

    def table(y, title, rows_, heads):
        d.text(tx0, y, title, size=14, wt=700)
        hy = y + 12
        d.rect(tx0, hy, tx1 - tx0, 26, fill=REGION)
        for c, h in zip((c1, c2, c3), heads):
            d.text(c + 10, d.mid(hy + 13, 12), h, size=12, wt=600, fill=MUTED)
        ry = hy + 26
        for typ, port, src, note in rows_:
            rh = 44 if note else 34
            d.line(tx0, ry + rh, tx1, ry + rh, stroke=HAIR)
            base = ry + (19 if note else d.mid(rh / 2, 13.5) - 0)
            d.text(c1 + 10, base, typ, size=13.5, fill=INK)
            hangul = any("가" <= ch <= "힣" for ch in port)
            d.text(c2 + 10, base, port, size=13 if not hangul else 13.5, fill=INK, fam="sans" if hangul else "mono")
            d.text(c3 + 10, base, src, size=13, wt=600, fill=INK, fam="mono")
            if note:
                d.text(c3 + 10, base + 17, note, size=12, fill=MUTED)
            ry += rh
        return ry

    end = table(44, t["inbound"], t["rules"], t["heads"])
    end = table(end + 32, t["outbound"], [t["out"]], t["out_heads"])
    d.text(tx0, end + 26, t["note"], size=12.5, fill=MUTED)
    return d


def deploy(lang):
    """[내 PC] 창, [EC2] 창, 브라우저에서 일어나는 일을 순서대로."""
    t = {
        "ko": dict(
            label="index.html이 내 PC에서 scp로 EC2의 /home/ec2-user로 옮겨지고, sudo mv로 Nginx 웹 폴더에 놓인 뒤, Nginx가 80번 포트로 브라우저에 전달하기까지. 그 전에 내 PC 창에서 키 권한을 좁히고 SSH로 접속한 뒤, EC2 창에서 Nginx를 설치하고 실행한다",
            lanes=[("내 PC 창", "PowerShell, 터미널"), ("EC2 창", "SSH로 접속한 창"), ("브라우저", "누구나")],
            phases=[("준비", "접속하고 Nginx 켜기"), ("배포", "파일 옮기고 열기")],
            notes={"key": "키 권한 좁히기", "ssh": "접속", "install": "설치", "start": "실행",
                   "scp": "새 터미널에서 홈 폴더로", "serve": "80번 포트로 전달"}),
        "en": dict(
            label="How index.html reaches the browser: scp copies it from your PC to /home/ec2-user on EC2, sudo mv puts it in the Nginx web folder, and Nginx serves it on port 80. Before that, the PC window locks down the key and connects over SSH, and the EC2 window installs and starts Nginx",
            lanes=[("Your PC window", "PowerShell or Terminal"), ("EC2 window", "the SSH session"), ("Browser", "anyone")],
            phases=[("Prepare", "connect, start Nginx"), ("Deploy", "move the file, open it")],
            notes={"key": "lock down the key", "ssh": "connect", "install": "install", "start": "start",
                   "scp": "new terminal, to the home folder", "serve": "served on port 80"}),
    }[lang]
    xs = [236, 488, 704]
    top = 32
    rows = [112, 152, 192, 232, 300, 340, 380]
    H = rows[-1] + 40
    d = Diagram(H, t["label"])
    for x, (name, sub) in zip(xs, t["lanes"]):
        w = max(d.width(name, 14, 700), d.width(sub, 12)) + 28
        d.rect(x - w / 2, top, w, 46, fill=WHITE, stroke=INK, sw=1.25)
        d.text(x, top + 20, name, size=14, wt=700, anchor="middle")
        d.text(x, top + 37, sub, size=12, fill=MUTED, anchor="middle")
        d.line(x, top + 46, x, H - 16, stroke=STROKE, dash="3 3")
    sep = (rows[3] + rows[4]) / 2
    d.line(32, sep, 768, sep, stroke=HAIR)
    for (name, sub), y in zip(t["phases"], (rows[0], rows[4])):
        d.text(32, y - 2, name, size=14, wt=700)
        d.para(32, y + 17, sub, size=12, maxw=120, lh=16, fill=MUTED)
    n = t["notes"]

    def chip(x, y, s, note=None, accent=False):
        cx, cw = d.chip(x, y - 13, s, size=12.5, h=26, anchor="middle", fill=ACCENT_SOFT if accent else REGION,
                        stroke=ACCENT if accent else None, color=INK)
        if note:
            d.text(cx + cw + 10, d.mid(y, 12.5), note, size=12.5, fill=MUTED)

    def msg(x0, x1, y, s, note=None, accent=False):
        c = ACCENT if accent else MUTED
        d.arrow([(x0, y), (x1, y)], color=c)
        d.text((x0 + x1) / 2, y - 8, s, size=12.5, fill=INK, anchor="middle", fam="mono")
        if note:
            d.text((x0 + x1) / 2, y + 18, note, size=12, fill=MUTED, anchor="middle")

    chip(xs[0], rows[0], "chmod 400", n["key"])
    msg(xs[0], xs[1], rows[1], "ssh ec2-user@PUBLIC_IP", n["ssh"])
    chip(xs[1], rows[2], "sudo dnf install -y nginx", n["install"])
    chip(xs[1], rows[3], "sudo systemctl start nginx", n["start"])
    msg(xs[0], xs[1], rows[4], "scp index.html", n["scp"], accent=True)
    chip(xs[1], rows[5], "sudo mv index.html /usr/share/nginx/html/", accent=True)
    msg(xs[1], xs[2], rows[6], "http://PUBLIC_IP", n["serve"], accent=True)
    return d


DIAGRAMS = {
    "diagram-requests": requests,
    "diagram-tiers": tiers,
    "diagram-tier-sg": tier_sg,
    "diagram-scale": scale,
    "diagram-nginx": nginx,
    "diagram-build-order": build_order,
    "diagram-sg-rules": sg_rules,
    "diagram-deploy": deploy,
}
LANGS = ("ko", "en")
