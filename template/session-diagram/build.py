"""세션 도식을 그려 발표 폴더의 img/에 쓴다.

    python template/session-diagram/build.py                 그림이 바뀐 도식만 다시 쓴다
    python template/session-diagram/build.py session-02      경로에 이 글자가 들어간 도식만
    python template/session-diagram/build.py --check         쓰지 않고, 코드와 다른 SVG가 있으면 실패
    python template/session-diagram/build.py --preview       .cache/preview.html 미리보기를 만든다

diagrams/cohort-01/session-02/presentation-01.py의 도식은
cohort-01/session-02/presentation-01/img/에 쓰인다. 영어는 같은 이름에 .en.svg.
"""
import argparse
import html
import importlib.util
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SOURCES = HERE / "diagrams"
sys.path.insert(0, str(HERE))


def load(path):
    rel = path.relative_to(SOURCES).with_suffix("")
    spec = importlib.util.spec_from_file_location("diagram_" + "_".join(rel.parts).replace("-", "_"), path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return rel, module


def jobs(filters):
    for path in sorted(SOURCES.rglob("*.py")):
        rel, module = load(path)
        for name, draw in module.DIAGRAMS.items():
            for lang in getattr(module, "LANGS", ("ko",)):
                out = ROOT / rel / "img" / f"{name}{'.en' if lang == 'en' else ''}.svg"
                key = out.relative_to(ROOT).as_posix()
                if not filters or any(f in key for f in filters):
                    yield key, out, draw, lang


def drawing(svg):
    """글꼴을 뺀 그림 부분. 글꼴은 글자에서 나오므로 그림이 같으면 같은 도식이다."""
    return [line for line in svg.splitlines() if not line.startswith("@font-face")]


def preview(keys):
    page = HERE / ".cache" / "preview.html"
    page.parent.mkdir(parents=True, exist_ok=True)
    items = "\n".join(
        f'<h2>{html.escape(k)}</h2><img src="{html.escape(Path(os.path.relpath(ROOT / k, page.parent)).as_posix())}" alt="">'
        for k in keys
    )
    page.write_text(
        '<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>세션 도식 미리보기</title><style>'
        "body{margin:0;background:#fff;font:14px/1.5 system-ui,sans-serif;color:#0b0f17}"
        "main{max-width:768px;margin:40px auto;padding:0 16px}"
        "h2{font:500 12px/1 ui-monospace,Menlo,Consolas,monospace;color:#8a94a0;margin:48px 0 10px}"
        "img{display:block;width:100%;border-radius:12px;outline:1px solid rgba(11,15,23,.1);outline-offset:-1px}"
        f"</style></head><body><main>\n{items}\n</main></body></html>\n",
        encoding="utf-8",
    )
    return page


def main():
    parser = argparse.ArgumentParser(description="세션 도식을 그린다.")
    parser.add_argument("filters", nargs="*", help="경로에 이 글자가 들어간 도식만 (예: session-02/presentation-01)")
    parser.add_argument("--check", action="store_true", help="파일을 쓰지 않고, 코드와 다른 SVG가 있으면 실패한다")
    parser.add_argument("--force", action="store_true", help="그림이 같아도 다시 쓴다")
    parser.add_argument("--preview", action="store_true", help="본문 폭으로 모아 보는 .cache/preview.html을 만든다")
    args = parser.parse_args()

    keys, differ = [], []
    for key, out, draw, lang in jobs(args.filters):
        try:
            d = draw(lang)
        except ValueError as err:
            sys.exit(f"멈춤  {key}\n      {err}")
        old = out.read_text(encoding="utf-8") if out.exists() else None
        same = old is not None and drawing(old) == drawing(d.svg(embed_fonts=False))
        if not same:
            differ.append(key)
        if not args.check and (not same or args.force):
            out.parent.mkdir(parents=True, exist_ok=True)
            with open(out, "w", encoding="utf-8", newline="\n") as fh:
                fh.write(d.svg())
        print(f"{'같음' if same else '새 파일' if old is None else '바뀜'}  {key}")
        keys.append(key)

    if not keys:
        sys.exit("그릴 도식이 없습니다. 경로를 확인하세요.")
    if args.preview:
        print(f"\n미리보기: {preview(keys)}")
    if args.check:
        if differ:
            sys.exit(f"\n코드와 다른 도식 {len(differ)}개. build.py를 실행해 다시 쓰세요.")
        print(f"\n도식 {len(keys)}개 모두 코드와 같습니다.")
    else:
        print(f"\n도식 {len(keys)}개 중 {len(differ) if not args.force else len(keys)}개를 썼습니다.")


if __name__ == "__main__":
    main()
