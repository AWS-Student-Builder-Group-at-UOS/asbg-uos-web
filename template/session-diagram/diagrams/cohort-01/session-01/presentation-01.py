"""cohort-01/session-01/presentation-01 도식."""
from kit import *


def diagram(lang):
    """한 학기 동안 서비스 하나를 키워 가는 세 단계와 마지막 종합 점검."""
    t = {
        "ko": dict(
            label="한 학기 동안 서비스 하나를 키워 가는 흐름: 서버 구성, 서버리스 분리, 배포 자동화, 종합 점검",
            stages=[("서버 구성", "VPC, EC2, ALB, RDS", "3-Tier 구조"),
                    ("서버리스 분리", "Lambda, DynamoDB, SQS", "이벤트 기반"),
                    ("배포 자동화", "ECR, ECS, CodePipeline", "컨테이너와 CI/CD")],
            review=("종합 점검", "학기 마지막에 SAA 문제로 전체를 되짚는다")),
        "en": dict(
            label="One service grown over the semester: set up the server, split into serverless, automate deployment, final review",
            stages=[("Set up the server", "VPC, EC2, ALB, RDS", "3-tier setup"),
                    ("Go serverless", "Lambda, DynamoDB, SQS", "event-driven"),
                    ("Automate deploys", "ECR, ECS, CodePipeline", "containers and CI/CD")],
            review=("Final review", "Revisit the whole service with SAA questions at the end")),
    }[lang]
    x0, x1, top, h = 32, 768, 32, 116
    sw = (x1 - x0) / 3
    yb = top + h + 26
    d = Diagram(yb + 92, t["label"])
    for i, (name, svc, kind) in enumerate(t["stages"]):
        sx = x0 + i * sw
        d.rect(sx, top, sw, h, fill=WHITE, stroke=STROKE)
        runs = [Run(str(i + 1), fam="mono", wt=500, fill=FAINT), Run("  "), Run(name, wt=600)]
        d.fits(runs, 16, sw - 40)
        d.numbered(sx + 20, top + 38, i + 1, name)
        d.fits(svc, 14.5, sw - 40)
        d.text(sx + 20, top + 70, svc, size=14.5, fill=BODY)
        d.text(sx + 20, top + 94, kind, size=13.5, fill=MUTED)
    for i in (1, 2):
        bx, by = x0 + i * sw, top + h / 2
        d.rect(bx - 12, by - 12, 24, 24, fill=WHITE, stroke=STROKE)
        d.path(f"M{fmt(bx - 5)} {fmt(by)}H{fmt(bx + 5)}M{fmt(bx)} {fmt(by - 5)}V{fmt(by + 5)}", stroke=ACCENT, sw=2)
    d.path(f"M{x0} {yb - 8}V{yb}H{x1}V{yb - 8}M400 {yb}V{yb + 8}", stroke=FAINT, sw=1.25)
    d.numbered(400, yb + 40, 4, t["review"][0], anchor="middle")
    d.text(400, yb + 65, t["review"][1], size=13.5, fill=MUTED, anchor="middle")
    return d


DIAGRAMS = {
    "diagram": diagram,
}
LANGS = ("ko", "en")
