"""cohort-01/activities/session-02-presentation-01 도식."""
from kit import *


HOST = "#D9DEE4"


def house(d, x, y, w, roof, body, stroke=STROKE, sw=1, fill=WHITE):
    """지붕 있는 집 모양. IP를 집 주소, 포트를 방에 빗댄 설명에 쓴다."""
    inset = max(4, w * 0.08)
    p = (f"M{fmt(x + inset)} {fmt(y + roof + body)}V{fmt(y + roof)}H{fmt(x)}L{fmt(x + w / 2)} {fmt(y)}"
         f"L{fmt(x + w)} {fmt(y + roof)}H{fmt(x + w - inset)}V{fmt(y + roof + body)}Z")
    d.path(p, stroke=stroke, sw=sw, fill=fill, join="miter")


def cidr(lang):
    """/16과 /24를 32칸 비트 막대로 비교한다."""
    t = {
        "ko": dict(
            label="10.0.0.0/16은 32비트 중 앞 16비트가 네트워크 ID, 뒤 16비트가 호스트 ID이고, /16은 주소 65,536개, /24는 256개로 슬래시 뒤 숫자가 작을수록 범위가 크다",
            note="숫자 하나에 8비트",
            net="네트워크 ID {n}비트", host="호스트 ID {n}비트",
            count=[([Run("주소 ", fill=MUTED, wt=400), Run("65,536개", wt=700)], "범위가 크다"), ([Run("주소 ", fill=MUTED, wt=400), Run("256개", wt=700)], "범위가 작다")],
            foot="슬래시 뒤 숫자가 작을수록 호스트 ID 비트가 많아져 범위가 커진다"),
        "en": dict(
            label="In 10.0.0.0/16, the first 16 of 32 bits are the network ID and the last 16 the host ID. /16 holds 65,536 addresses and /24 holds 256: the smaller the number after the slash, the bigger the range",
            note="8 bits per number",
            net="Network ID, {n} bits", host="Host ID, {n} bits",
            count=[([Run("65,536", wt=700), Run(" addresses", size=14, fill=MUTED, wt=400)], "bigger range"), ([Run("256", wt=700), Run(" addresses", size=14, fill=MUTED, wt=400)], "smaller range")],
            foot="The smaller the number after the slash, the more host bits and the bigger the range"),
    }[lang]
    d = Diagram(292, t["label"])
    bx, cell, g, og = 200, 10, 2, 10
    octw = 8 * cell + 7 * g

    def cx_of(i):  # left x of bit i (0-based)
        o, k = divmod(i, 8)
        return bx + o * (octw + og) + k * (cell + g)

    total = 4 * octw + 3 * og
    rx = bx + total + 26
    rows = [(16, 64), (24, 168)]
    # octet values over the first bar
    for o, v in enumerate(["10", "0", "0", "0"]):
        ox = bx + o * (octw + og)
        d.text(ox + octw / 2, 52, v, size=15, wt=500, fill=BODY, anchor="middle", fam="mono")
        if o < 3:
            d.text(ox + octw + og / 2, 52, ".", size=15, fill=FAINT, anchor="middle", fam="mono")
    d.text(32, 52, t["note"], size=13, fill=MUTED)
    for k, (n, y) in enumerate(rows):
        h = 24
        d.text(32, d.mid(y + h / 2, 17), [Run("10.0.0.0", fill=INK), Run(f"/{n}", fill=ACCENT, wt=600)], size=17, fam="mono", wt=500)
        for i in range(32):
            d.rect(cx_of(i), y, cell, h, fill=ACCENT if i < n else HOST)
        # braces
        by = y + h + 8
        nx1 = cx_of(n - 1) + cell
        hx0 = cx_of(n)
        d.path(f"M{fmt(bx)} {fmt(by)}V{fmt(by + 6)}H{fmt(nx1)}V{fmt(by)}", stroke=ACCENT, sw=1.25)
        d.path(f"M{fmt(hx0)} {fmt(by)}V{fmt(by + 6)}H{fmt(bx + total)}V{fmt(by)}", stroke=FAINT, sw=1.25)
        d.text((bx + nx1) / 2, by + 26, t["net"].format(n=n), size=13.5, wt=600, fill=ACCENT, anchor="middle")
        d.text((hx0 + bx + total) / 2, by + 26, t["host"].format(n=32 - n), size=13.5, fill=MUTED, anchor="middle")
        runs, sub = t["count"][k]
        d.fits(runs, 16, W - 32 - rx)
        d.text(rx, d.mid(y + h / 2, 16) - 2, runs, size=16)
        d.text(rx, y + h + 22, sub, size=13, fill=MUTED)
    d.text(32, 274, t["foot"], size=13.5, fill=BODY)
    return d


def flow(lang):
    """IP로 집을, 포트로 방을 찾고 TCP나 UDP로 주고받는다."""
    t = {
        "ko": dict(
            label="CIDR과 IP로 서버를 찾고, 포트로 그 서버 안의 프로그램을 찾고, TCP 또는 UDP로 데이터를 주고받는 네트워크 흐름",
            ips=["10.0.0.8", "10.0.1.25", "10.0.2.14", "10.0.3.7"], net="10.0.0.0/16",
            rooms=[(":22", "SSH"), (":80", "웹 서버")], send="보내는 쪽", recv="받는 쪽", ack="도착 확인",
            caps=[("IP로 서버를 찾고", "IP는 컴퓨터의 주소", "외울 땐 ZIP, 집"),
                  ("포트로 프로그램을 찾고", "포트는 컴퓨터 안의 방", "외울 땐 Part, 방"),
                  ("TCP나 UDP로 주고받는다", "TCP는 정확하게, UDP는 빠르게", "TCP의 C는 Control")]),
        "en": dict(
            label="Network flow: find the server with CIDR and IP, find the program inside it with a port, then exchange data over TCP or UDP",
            ips=["10.0.0.8", "10.0.1.25", "10.0.2.14", "10.0.3.7"], net="10.0.0.0/16",
            rooms=[(":22", "SSH"), (":80", "web server")], send="sender", recv="receiver", ack="delivery check",
            caps=[("Find the server by IP", "An IP is a computer's address", "Remember: ZIP, like jip (house)"),
                  ("Find the program by port", "A port is a room inside it", "Remember: part, a room of the house"),
                  ("Talk over TCP or UDP", "TCP is accurate, UDP is fast", "The C in TCP stands for Control")]),
    }[lang]
    left, gap = 32, 40
    pw = (W - 2 * left - 2 * gap) / 3
    top, ph = 32, 196
    capy = top + ph + 34
    d = Diagram(capy + 70, t["label"])
    xs = [left + i * (pw + gap) for i in range(3)]
    for i in range(2):
        ax = xs[i] + pw + 8
        d.arrow([(ax, top + ph / 2), (ax + gap - 16, top + ph / 2)], color=FAINT)
    # panel 1: a neighbourhood of houses
    x0 = xs[0]
    d.rect(x0, top, pw, ph, fill=REGION)
    d.text(x0 + 12, top + 22, t["net"], size=13, wt=500, fill=MUTED, fam="mono")
    hw = 58
    for k, ip in enumerate(t["ips"]):
        col, row = k % 2, k // 2
        hx = x0 + pw * (0.28 + 0.44 * col) - hw / 2
        hy = top + 42 + row * 76
        sel = k == 1
        house(d, hx, hy, hw, 16, 26, stroke=ACCENT if sel else STROKE, sw=1.5 if sel else 1)
        d.text(hx + hw / 2, hy + 60, ip, size=12.5, wt=600 if sel else 400, fill=ACCENT if sel else BODY, anchor="middle", fam="mono")
    # panel 2: one house, two rooms
    x1 = xs[1]
    hx, hy, hw2 = x1 + 22, top + 6, pw - 44
    house(d, hx, hy, hw2, 40, ph - 52, stroke=ACCENT, sw=1.5)
    d.text(hx + hw2 / 2, hy + 33, t["ips"][1], size=13, wt=600, fill=ACCENT, anchor="middle", fam="mono")
    rw, rh = hw2 - 56, 36
    rx = hx + 28
    for k, (port, name) in enumerate(t["rooms"]):
        ry = hy + 62 + k * 52
        sel = k == 1
        d.rect(rx, ry, rw, rh, fill=ACCENT_SOFT if sel else WHITE, stroke=ACCENT if sel else STROKE)
        d.text(rx + 12, d.mid(ry + rh / 2, 14), [Run(port, fam="mono", wt=600, fill=ACCENT if sel else INK), Run("  "), Run(name, fill=BODY)], size=14)
    d.arrow([(x1, hy + 62 + 52 + rh / 2), (rx, hy + 62 + 52 + rh / 2)], color=ACCENT)
    # panel 3: TCP and UDP
    x2 = xs[2]
    sx, ex = x2 + 26, x2 + pw - 26
    d.text(sx, top + 14, t["send"], size=13, fill=MUTED, anchor="middle")
    d.text(ex, top + 14, t["recv"], size=13, fill=MUTED, anchor="middle")
    d.line(sx, top + 26, sx, top + ph, stroke=STROKE, dash="3 3")
    d.line(ex, top + 26, ex, top + ph, stroke=STROKE, dash="3 3")
    ty, uy = top + 70, top + 160
    d.text((sx + ex) / 2, ty - 22, "TCP", size=14, wt=700, anchor="middle")
    d.arrow([(sx, ty), (ex, ty)])
    for k in range(3):
        px = (sx + ex) / 2 - 36 + k * 24
        d.rect(px - 10, ty - 10, 20, 20, fill=WHITE, stroke=INK)
        d.text(px, ty + 4.6, str(k + 1), size=12.5, wt=600, anchor="middle", fam="mono")
    d.arrow([(ex, ty + 26), (sx, ty + 26)], color=FAINT, sw=1.25, size=6.5)
    d.text((sx + ex) / 2, ty + 44, t["ack"], size=12.5, fill=MUTED, anchor="middle")
    d.text((sx + ex) / 2, uy - 22, "UDP", size=14, wt=700, anchor="middle")
    d.arrow([(sx, uy), (ex, uy)])
    for k in range(3):
        px = (sx + ex) / 2 - 36 + k * 24
        d.rect(px - 10, uy - 10, 20, 20, fill=WHITE, stroke=STROKE)
    # captions read as one sentence across the panels
    for i, (a, b, c) in enumerate(t["caps"]):
        d.fits(a, 15, pw, wt=600)
        d.text(xs[i], capy, a, size=15, wt=600)
        d.fits(b, 13.5, pw)
        d.text(xs[i], capy + 24, b, size=13.5, fill=BODY)
        d.fits(c, 13, pw)
        d.text(xs[i], capy + 45, c, size=13, fill=FAINT)
    return d


def lb(lang):
    """같은 요청에서 ALB는 내용을, NLB는 IP와 포트만 읽는다."""
    t = {
        "ko": dict(
            label="ALB는 요청의 메서드, 경로, 헤더를 열어 보고 알맞은 서버로 보내고, NLB는 내용을 보지 않고 IP와 포트만 보고 빠르게 넘긴다",
            req="요청", addr="목적지 IP와 포트", skip="내용은 보지 않는다",
            alb=("ALB", "L7 애플리케이션 계층"), nlb=("NLB", "L4 전송 계층"),
            alb_cap=["요청 내용을 보고", "알맞은 서버로 보낸다"], nlb_cap=["IP와 포트만 보고", "빠르게 넘긴다"],
            api="API 서버", web="웹 서버", servers=["서버 A", "서버 B", "서버 C"],
            alb_use="주로 웹, REST API 서비스", nlb_use="주로 게임 서버처럼 대량 트래픽"),
        "en": dict(
            label="An ALB opens the request's method, path and headers and sends it to the right server; an NLB ignores the content and forwards it fast by IP and port",
            req="Request", addr="Destination IP and port", skip="content not read",
            alb=("ALB", "L7 application layer"), nlb=("NLB", "L4 transport layer"),
            alb_cap=["reads the request", "and picks a server"], nlb_cap=["reads only IP and port", "and forwards fast"],
            api="API server", web="Web server", servers=["Server A", "Server B", "Server C"],
            alb_use="Mostly web and REST APIs", nlb_use="High traffic, like game servers"),
    }[lang]
    d = Diagram(380, t["label"])
    cw, ch_head, ch_body = 200, 34, 66

    def card(x, y, mode):
        d.text(x, y - 10, t["req"], size=12.5, wt=500, fill=FAINT)
        hy, by = y, y + ch_head
        head_on, body_on = mode == "nlb", mode == "alb"
        d.rect(x, hy, cw, ch_head, fill=ACCENT_SOFT if head_on else WHITE, stroke=STROKE)
        d.rect(x, by, cw, ch_body, fill=ACCENT_SOFT if body_on else WHITE, stroke=STROKE)
        if head_on:
            d.rect(x, hy, cw, ch_head, fill="none", stroke=ACCENT, sw=1.5)
        if body_on:
            d.rect(x, by, cw, ch_body, fill="none", stroke=ACCENT, sw=1.5)
        d.text(x + 12, d.mid(hy + ch_head / 2, 13.5), t["addr"], size=13.5, fill=INK if head_on else FAINT, wt=600 if head_on else 400)
        c1 = INK if body_on else FAINT
        d.text(x + 12, by + 26, [Run("GET ", fill=c1), Run("/api/posts", fill=ACCENT if body_on else FAINT, wt=600 if body_on else 400)], size=13.5, fam="mono")
        d.text(x + 12, by + 50, "Host: …", size=13.5, fill=c1, fam="mono")
        if not body_on:
            d.text(x + cw - 12, by + 50, t["skip"], size=12.5, fill=MUTED, anchor="end")

    lbx, lbw, lbh = 288, 136, 58
    tx, tw = 576, 150
    # ALB row
    y0 = 40
    card(32, y0, "alb")
    rc = y0 + (ch_head + ch_body) / 2
    d.arrow([(32 + cw, rc), (lbx, rc)])
    d.box(lbx, rc - lbh / 2, lbw, lbh, t["alb"][0], t["alb"][1], tsize=17, twt=700, ssize=12, stroke=INK, gap=3)
    for k, ln in enumerate(t["alb_cap"]):
        d.text(lbx + lbw / 2, rc + lbh / 2 + 20 + k * 18, ln, size=12.5, fill=MUTED, anchor="middle")
    t1, t2 = rc - 26, rc + 26
    d.box(tx, t1 - 18, tw, 36, t["api"], tsize=14, twt=600, stroke=ACCENT, tcolor=ACCENT)
    d.box(tx, t2 - 18, tw, 36, t["web"], tsize=14, twt=500)
    jx = lbx + lbw + 40
    d.arrow([(lbx + lbw, rc - 8), (jx, rc - 8), (jx, t1), (tx, t1)], color=ACCENT)
    d.arrow([(lbx + lbw, rc + 8), (jx, rc + 8), (jx, t2), (tx, t2)])
    d.text(jx + 14, t1 - 7, "/api/*", size=12.5, fill=ACCENT, fam="mono", wt=500)
    d.text(jx + 14, t2 - 7, "/*", size=12.5, fill=MUTED, fam="mono")
    d.para(tx, t2 + 18 + 26, t["alb_use"], size=12.5, maxw=W - 32 - tx, lh=18, fill=FAINT)
    d.line(32, 196, 768, 196, stroke=HAIR)
    # NLB row
    y1 = 242
    card(32, y1, "nlb")
    rc = y1 + (ch_head + ch_body) / 2
    d.arrow([(32 + cw, rc), (lbx, rc)])
    d.box(lbx, rc - lbh / 2, lbw, lbh, t["nlb"][0], t["nlb"][1], tsize=17, twt=700, ssize=12, stroke=INK, gap=3)
    for k, ln in enumerate(t["nlb_cap"]):
        d.text(lbx + lbw / 2, rc + lbh / 2 + 20 + k * 18, ln, size=12.5, fill=MUTED, anchor="middle")
    for k, name in enumerate(t["servers"]):
        sy = rc + (k - 1) * 40
        d.box(tx, sy - 15, tw, 30, name, tsize=13.5, twt=500)
        d.arrow([(lbx + lbw, rc), (jx, rc), (jx, sy), (tx, sy)] if k != 1 else [(lbx + lbw, rc), (tx, rc)])
    end = d.para(tx, rc + 40 + 15 + 26, t["nlb_use"], size=12.5, maxw=W - 32 - tx, lh=18, fill=FAINT)
    d.h = max(d.h, end + 22)
    return d


def nesting(lang):
    """AWS 안에 VPC, VPC 안에 서브넷, 서브넷 안에 EC2."""
    t = {
        "ko": dict(
            label="AWS 안에 VPC, VPC 안에 퍼블릭 서브넷과 프라이빗 서브넷, 서브넷 안에 EC2가 들어 있고, 인터넷은 IGW를 거쳐 퍼블릭 서브넷과만 직접 통신한다",
            internet="인터넷", both="양방향", aws="AWS 클라우드", vpc=("VPC", "내가 소유한 가상 네트워크"),
            igw=("IGW", "인터넷 게이트웨이"),
            pub=("퍼블릭 서브넷", ["인터넷과 직접", "통신할 수 있다"]), pri=("프라이빗 서브넷", ["인터넷에서 직접", "들어올 수 없다"]),
            blocked="직접 접근 불가"),
        "en": dict(
            label="AWS contains a VPC, the VPC contains a public and a private subnet, and each subnet holds an EC2 instance; the internet talks directly only to the public subnet, through the IGW",
            internet="Internet", both="both ways", aws="AWS Cloud", vpc=("VPC", "a virtual network you own"),
            igw=("IGW", "internet gateway"),
            pub=("Public subnet", ["talks to the", "internet directly"]), pri=("Private subnet", ["can't be reached from", "the internet directly"]),
            blocked="no direct access"),
    }[lang]
    H = 404
    d = Diagram(H, t["label"])
    aws = (32, 96, 736, H - 96 - 26)
    vpc = (52, 140, 696, aws[3] - 64)
    d.rect(*aws, fill=REGION)
    d.text(48, 120, t["aws"], size=13, wt=600, fill=MUTED)
    d.rect(*vpc, fill=WHITE, stroke=STROKE)
    d.text(72, 186, [Run(t["vpc"][0], wt=700, fill=INK), Run("  "), Run(t["vpc"][1], size=13, fill=MUTED)], size=14)
    sy, sh = 222, 112
    subs = [(72, t["pub"]), (408, t["pri"])]
    ec2 = []
    for sx, (name, desc) in subs:
        d.rect(sx, sy, 320, sh, fill=REGION)
        d.text(sx + 18, sy + 30, name, size=14, wt=700)
        d.para(sx + 18, sy + 54, desc, size=13, maxw=150, lh=19)
        ex = sx + 320 - 18 - 100
        d.box(ex, sy + (sh - 44) / 2, 100, 44, "EC2", tsize=15, twt=600)
        ec2.append(ex + 50)
    cx = ec2[0]
    d.box(cx - 60, 24, 120, 36, t["internet"], tsize=14, twt=600)
    d.box(cx - 76, 116, 152, 48, t["igw"][0], t["igw"][1], tsize=15, twt=700, ssize=12, stroke=ACCENT, gap=3)
    d.arrow([(cx, 60), (cx, 116)], color=ACCENT, head="both")
    d.arrow([(cx, 164), (cx, sy + (sh - 44) / 2)], color=ACCENT, head="both")
    d.text(cx + 12, 92, t["both"], size=12.5, fill=ACCENT)
    px = ec2[1]
    d.path(f"M{fmt(cx + 60)} 42H{fmt(px)}V{fmt(sy - 12)}", stroke=FAINT, sw=1.5, dash="5 4")
    d.cross(px, sy - 12, r=6, color=INK, sw=2)
    d.text(px + 14, sy - 8, t["blocked"], size=12.5, fill=MUTED)
    return d


def paths(lang):
    """VPC를 오가는 세 갈래 길. IGW와 App 서버는 세 길이 함께 지난다."""
    t = {
        "ko": dict(
            label="VPC를 오가는 세 갈래 길: 사용자 요청은 IGW, ALB를 거쳐 App 서버로 들어오고, App 서버는 NAT Gateway와 IGW를 거쳐 인터넷으로 나가고, 관리자는 IGW와 Bastion Host를 거쳐 SSH로 App 서버에 접속한다",
            heads=["인터넷", "IGW", "퍼블릭 서브넷", "프라이빗 서브넷"], vpc="VPC",
            rows=[("인바운드", "사용자 요청", "사용자", "ALB"),
                  ("아웃바운드", "서버가 밖으로", "외부 인터넷", "NAT Gateway"),
                  ("관리 접속", "SSH", "관리자", "Bastion Host")],
            app="App 서버", ssh="SSH"),
        "en": dict(
            label="Three paths in and out of a VPC: user requests come in through the IGW and the ALB to the app server, the app server goes out through the NAT gateway and the IGW, and an admin reaches it over SSH through the IGW and a bastion host",
            heads=["Internet", "IGW", "Public subnet", "Private subnet"], vpc="VPC",
            rows=[("Inbound", "user requests", "User", "ALB"),
                  ("Outbound", "server reaches out", "Internet", "NAT Gateway"),
                  ("Admin access", "SSH", "Admin", "Bastion Host")],
            app="App server", ssh="SSH"),
    }[lang]
    rows_y = [150, 214, 278]
    bh = 40
    H = rows_y[-1] + bh / 2 + 52
    d = Diagram(H, t["label"])
    ic, iw = 206, 108
    gx, gw = 280, 20
    vx = gx + gw / 2
    pubx, pubw = 318, 196
    prix, priw = 530, 222
    top = 64
    d.rect(vx, top, 768 - vx, H - top - 24, fill=REGION)
    d.text(vx + 22, top + 22, t["vpc"], size=13, wt=600, fill=MUTED)
    d.rect(pubx, top + 36, pubw, H - top - 76, fill=WHITE, stroke=STROKE)
    d.rect(prix, top + 36, priw, H - top - 76, fill=WHITE, stroke=STROKE)
    d.text(ic, 44, t["heads"][0], size=13.5, wt=600, fill=MUTED, anchor="middle")
    d.text(vx, 44, t["heads"][1], size=13.5, wt=600, fill=MUTED, anchor="middle")
    d.text(pubx + 16, top + 60, t["heads"][2], size=13.5, wt=600, fill=INK)
    d.text(prix + 16, top + 60, t["heads"][3], size=13.5, wt=600, fill=INK)
    pc, pw = pubx + pubw / 2, 152
    ax0, aw = prix + 36, 150
    app_top, app_bot = rows_y[0] - bh / 2, rows_y[-1] + bh / 2
    for k, (name, sub, outer, mid) in enumerate(t["rows"]):
        y = rows_y[k]
        d.text(32, y - 2, name, size=14, wt=700)
        d.text(32, y + 17, sub, size=12.5, fill=MUTED)
        d.box(ic - iw / 2, y - bh / 2, iw, bh, outer, tsize=14, twt=500)
        d.box(pc - pw / 2, y - bh / 2, pw, bh, mid, tsize=14, twt=600)
        if k == 1:
            d.arrow([(ax0, y), (pc + pw / 2, y)])
            d.arrow([(pc - pw / 2, y), (ic + iw / 2, y)])
        else:
            d.arrow([(ic + iw / 2, y), (pc - pw / 2, y)])
            d.arrow([(pc + pw / 2, y), (ax0, y)])
    d.text((pc + pw / 2 + ax0) / 2, rows_y[2] - 8, t["ssh"], size=12, fill=MUTED, anchor="middle", fam="mono")
    d.box(ax0, app_top, aw, app_bot - app_top, t["app"], tsize=15, twt=700)
    d.rect(gx, rows_y[0] - 40, gw, rows_y[-1] - rows_y[0] + 80, fill=WHITE, stroke=INK, sw=1.25)
    return d


def security(lang):
    """NACL은 서브넷 경계에서, 보안 그룹은 인스턴스 앞에서 검사한다."""
    t = {
        "ko": dict(
            label="NACL은 서브넷 입구에서 들어오는 요청과 나가는 응답을 각각 규칙으로 검사하고, 보안 그룹은 인스턴스 앞에서 허용한 요청의 응답을 자동으로 통과시킨다",
            internet="인터넷", req="요청", res="응답",
            nacl=("NACL", "서브넷 단위, Stateless", "허용과 거부 규칙"),
            sg=("보안 그룹", "인스턴스 단위, Stateful", "허용 규칙만"),
            subnet="서브넷", ec2=("EC2", "인스턴스"),
            nacl_in="인바운드 규칙 검사", nacl_out="아웃바운드 규칙 따로 검사",
            sg_in="인바운드 규칙 검사", sg_out="응답은 자동 허용"),
        "en": dict(
            label="A NACL checks incoming requests and outgoing responses against separate rules at the subnet edge; a security group in front of the instance lets responses to allowed requests through automatically",
            internet="Internet", req="request", res="response",
            nacl=("NACL", "per subnet, stateless", "allow and deny rules"),
            sg=("Security group", "per instance, stateful", "allow rules only"),
            subnet="Subnet", ec2=("EC2", "instance"),
            nacl_in="checked by inbound rules", nacl_out="checked again by outbound rules",
            sg_in="checked by inbound rules", sg_out="replies pass automatically"),
    }[lang]
    d = Diagram(316, t["label"])
    sub = (212, 96, 556, 194)
    sg = (480, 116, 272, 154)
    d.rect(*sub, fill=REGION)
    d.text(sub[0] + 24, sub[1] + 20, t["subnet"], size=12.5, wt=600, fill=FAINT)
    d.rect(*sg, fill=WHITE, stroke=STROKE)
    ry, sy_ = 168, 232
    d.box(32, 150, 104, 100, t["internet"], tsize=15, twt=600)
    ex = 664
    d.box(ex, 158, 80, 84, t["ec2"][0], t["ec2"][1], tsize=16, twt=700, ssize=12.5)
    d.arrow([(136, ry), (ex, ry)])
    d.arrow([(ex, sy_), (136, sy_)])
    d.text(146, ry - 8, t["req"], size=12.5, fill=MUTED)
    d.text(146, sy_ + 18, t["res"], size=12.5, fill=MUTED)
    gates = [(sub[0], sub[1] + 8, sub[3] - 16, t["nacl"], t["nacl_in"], t["nacl_out"], INK),
             (sg[0], sg[1] + 8, sg[3] - 16, t["sg"], t["sg_in"], t["sg_out"], ACCENT)]
    for gx, gy, gh, head, tin, tout, outc in gates:
        d.rect(gx - 9, gy, 18, gh, fill=WHITE, stroke=INK, sw=1.25)
        d.text(gx, 38, head[0], size=14.5, wt=700, anchor="middle")
        d.text(gx, 58, head[1], size=12.5, fill=MUTED, anchor="middle")
        d.text(gx, 76, head[2], size=12.5, fill=FAINT, anchor="middle")
        limit = (sg[0] - 9 if gx == sub[0] else ex) - (gx + 20) - 8
        d.fits(tin, 12.5, limit)
        d.fits(tout, 12.5, limit, wt=600)
        d.text(gx + 20, ry - 8, tin, size=12.5, fill=BODY)
        d.text(gx + 20, sy_ + 18, tout, size=12.5, fill=outc, wt=600 if outc == ACCENT else 400)
    return d


def vpc_map(lang):
    """퍼블릭 서브넷과 프라이빗 서브넷의 리소스를 한 장에 모은다."""
    t = {
        "ko": dict(
            label="VPC 한 장 요약: IGW 아래 퍼블릭 서브넷에는 ALB, NAT Gateway, Bastion Host가, 프라이빗 서브넷에는 App 서버, Internal ALB, RDS, ElastiCache, EFS, Interface Endpoint가 있고, Interface Endpoint는 VPC 밖의 S3로 이어진다",
            internet="인터넷", vpc="VPC", pub="퍼블릭 서브넷", pri="프라이빗 서브넷", route="라우팅",
            nat=("NAT Gateway", "프라이빗에서 밖으로"), alb=("ALB", "분산과 헬스 체크"), bastion=("Bastion Host", "SSH 중간 서버"),
            ialb=("Internal ALB/NLB", "VPC 안에서만"), app=("App 서버", "EC2, ECS, Lambda"), ep=("Interface Endpoint", "AWS 서비스로 가는 통로"),
            inner=("내부 서비스", "또 다른 서버"), rds=("RDS", "관계형 DB"), cache=("ElastiCache", "Redis, 인메모리"), efs=("EFS", "공유 파일"),
            s3=("S3", "VPC 밖")),
        "en": dict(
            label="The VPC on one page: under the IGW, the public subnet holds the ALB, NAT gateway and bastion host; the private subnet holds the app server, internal ALB, RDS, ElastiCache, EFS and an interface endpoint that leads to S3 outside the VPC",
            internet="Internet", vpc="VPC", pub="Public subnet", pri="Private subnet", route="route",
            nat=("NAT Gateway", "private → internet"), alb=("ALB", "balancing, health checks"), bastion=("Bastion Host", "SSH jump server"),
            ialb=("Internal ALB/NLB", "inside the VPC only"), app=("App server", "EC2, ECS, Lambda"), ep=("Interface Endpoint", "path to AWS services"),
            inner=("Internal service", "another server"), rds=("RDS", "relational DB"), cache=("ElastiCache", "Redis, in-memory"), efs=("EFS", "shared files"),
            s3=("S3", "outside the VPC")),
    }[lang]
    d = Diagram(520, t["label"])
    vx0, vx1 = 32, 640
    gap = 28
    cw = (vx1 - vx0 - 44 - 2 * gap) / 3
    cols = [vx0 + 22 + k * (cw + gap) for k in range(3)]
    cc = [c + cw / 2 for c in cols]
    vtop, vbot = 104, 496
    d.rect(vx0, vtop, vx1 - vx0, vbot - vtop, fill=REGION)
    d.text(vx0 + 16, vtop + 22, t["vpc"], size=13, wt=600, fill=MUTED)
    pub = (vx0 + 14, 140, vx1 - vx0 - 28, 108)
    pri = (vx0 + 14, 264, vx1 - vx0 - 28, 218)
    d.rect(*pub, fill=WHITE, stroke=STROKE)
    d.rect(*pri, fill=WHITE, stroke=STROKE)
    d.text(pub[0] + 14, pub[1] + 22, t["pub"], size=13.5, wt=600)
    d.text(pub[0] + pub[2] - 14, pub[1] + 22, [Run(t["route"] + "  ", fill=MUTED), Run("0.0.0.0/0 → IGW", fam="mono", fill=BODY, wt=500)], size=12.5, anchor="end")
    d.text(pri[0] + 14, pri[1] + 22, t["pri"], size=13.5, wt=600)
    bh = 54
    r0, ra, rb = 178, 300, 400
    kw = dict(tsize=14, twt=600, ssize=12.5, gap=4)
    d.box(cols[0], r0, cw, bh, *t["nat"], **kw)
    d.box(cols[1], r0, cw, bh, *t["alb"], **kw)
    d.box(cols[2], r0, cw, bh, *t["bastion"], **kw)
    d.box(cols[0], ra, cw, bh, *t["ialb"], **kw)
    d.box(cols[1], ra, cw, bh, *t["app"], stroke=INK, **kw)
    d.box(cols[2], ra, cw, bh, *t["ep"], **kw)
    d.box(cols[0], rb, cw, bh, *t["inner"], **kw)
    sx0, sx1 = cols[1], cols[2] + cw
    sg = 12
    sw_ = (sx1 - sx0 - 2 * sg) / 3
    stores = [t["rds"], t["cache"], t["efs"]]
    scx = []
    for k, st in enumerate(stores):
        x = sx0 + k * (sw_ + sg)
        d.box(x, rb, sw_, bh, *st, pad=10, **kw)
        scx.append(x + sw_ / 2)
    s3x = 656
    d.box(s3x, ra, 112, bh, *t["s3"], **kw)
    # internet and IGW on the main request path
    d.box(cc[1] - 60, 24, 120, 36, t["internet"], tsize=14, twt=600)
    d.box(cc[1] - 46, vtop - 20, 92, 40, "IGW", tsize=14, twt=700, stroke=INK)
    d.arrow([(cc[1], 60), (cc[1], vtop - 20)], color=ACCENT)
    d.arrow([(cc[1], vtop + 20), (cc[1], r0)], color=ACCENT)
    d.arrow([(cc[1], r0 + bh), (cc[1], ra)], color=ACCENT)
    # outbound through NAT
    d.arrow([(cc[1] - 40, ra), (cc[1] - 40, 256), (cc[0], 256), (cc[0], r0 + bh)], dash="4 4")
    # app to its neighbours
    d.arrow([(cols[1], ra + bh / 2), (cols[0] + cw, ra + bh / 2)])
    d.arrow([(cc[0], ra + bh), (cc[0], rb)])
    d.arrow([(cols[1] + cw, ra + bh / 2), (cols[2], ra + bh / 2)])
    d.arrow([(cols[2] + cw, ra + bh / 2), (s3x, ra + bh / 2)])
    by = ra + bh + 23
    d.path(f"M{fmt(cc[1])} {fmt(ra + bh)}V{fmt(by)}M{fmt(scx[0])} {fmt(by)}H{fmt(scx[2])}", stroke=MUTED, sw=1.5)
    for x in scx:
        d.arrow([(x, by), (x, rb)])
    return d


DIAGRAMS = {
    "diagram-cidr": cidr,
    "diagram-flow": flow,
    "diagram-lb": lb,
    "diagram-nesting": nesting,
    "diagram-paths": paths,
    "diagram-security": security,
    "diagram-vpc-map": vpc_map,
}
LANGS = ("ko", "en")
