import argparse
import html
import importlib.util
import os
import re
import sys
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).resolve().parent
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))

from kit import Diagram


def load(source):
    if not source.is_file() or source.suffix != ".py":
        raise ValueError(f"파이썬 소스 파일을 지정하세요: {source}")
    spec = importlib.util.spec_from_file_location("activity_diagrams", source)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    diagrams = getattr(module, "DIAGRAMS", None)
    langs = getattr(module, "LANGS", ("ko",))
    if not isinstance(diagrams, dict) or not diagrams:
        raise ValueError("소스에 비어 있지 않은 DIAGRAMS 딕셔너리가 필요합니다.")
    for name, draw in diagrams.items():
        if not isinstance(name, str) or not re.fullmatch(r"diagram(?:-[a-z0-9]+)*", name):
            raise ValueError(f"도식 이름은 diagram 또는 diagram-이름 형식이어야 합니다: {name!r}")
        if not callable(draw):
            raise ValueError(f"DIAGRAMS[{name!r}]는 lang을 받는 함수여야 합니다.")
    if not isinstance(langs, (tuple, list)) or not langs or any(lang not in ("ko", "en") for lang in langs):
        raise ValueError("LANGS는 ('ko',), ('en',), ('ko', 'en') 중 하나로 지정하세요.")
    if len(set(langs)) != len(langs):
        raise ValueError("LANGS에 같은 언어를 두 번 넣을 수 없습니다.")
    return diagrams, langs


def render(source, output):
    diagrams, langs = load(source)
    results = []
    for name, draw in diagrams.items():
        for lang in langs:
            target = output / f"{name}{'.en' if lang == 'en' else ''}.svg"
            try:
                diagram = draw(lang)
                if not isinstance(diagram, Diagram):
                    raise ValueError("함수는 kit.Diagram을 반환해야 합니다.")
                svg = diagram.svg()
                previous = target.read_text(encoding="utf-8") if target.exists() else None
            except Exception as error:
                raise ValueError(f"{name} ({lang}): {error}") from error
            results.append((target, svg, previous == svg))
    return results


def preview(results, page):
    items = "\n".join(
        f'<h2>{html.escape(target.name)}</h2>'
        f'<img src="{html.escape(quote(Path(os.path.relpath(target, page.parent)).as_posix()), quote=True)}" alt="">'
        for target, _, _ in results
    )
    page.parent.mkdir(parents=True, exist_ok=True)
    page.write_text(
        '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        '<title>활동 도식 미리보기</title><style>'
        "body{margin:0;background:#fff;font:14px/1.5 system-ui,sans-serif;color:#0b0f17}"
        "main{max-width:768px;margin:40px auto;padding:0 16px}"
        "h2{font:500 12px/1 ui-monospace,Menlo,Consolas,monospace;color:#8a94a0;margin:48px 0 10px}"
        "img{display:block;width:100%;border-radius:12px;outline:1px solid rgba(11,15,23,.1);outline-offset:-1px}"
        f"</style></head><body><main>\n{items}\n</main></body></html>\n",
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser(description="임시 파이썬 소스로 활동 게시물의 SVG 도식을 만듭니다.")
    parser.add_argument("source", type=Path, help="DIAGRAMS를 정의한 임시 .py 파일")
    parser.add_argument("output", type=Path, help="활동 폴더 또는 해당 폴더의 img/ 경로")
    action = parser.add_mutually_exclusive_group()
    action.add_argument("--check", action="store_true", help="SVG를 쓰지 않고 소스와 같은지 확인")
    action.add_argument("--preview", type=Path, metavar="HTML", help="SVG 생성 후 지정한 임시 HTML에 미리보기 저장")
    args = parser.parse_args()
    source = args.source.resolve()
    output = args.output.resolve()
    if output.name != "img":
        output /= "img"
    page = args.preview.resolve() if args.preview else None

    try:
        if args.output.exists() and not args.output.is_dir():
            raise ValueError(f"출력 위치는 폴더여야 합니다: {args.output}")
        if page and (page.suffix.lower() != ".html" or page == source):
            raise ValueError("미리보기는 소스와 다른 .html 파일에 저장하세요.")
        results = render(source, output)
        changed = sum(not same for _, _, same in results)
        for target, svg, same in results:
            if not args.check and not same:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(svg, encoding="utf-8", newline="\n")
            print(f"{'같음' if same else '없음' if args.check and not target.exists() else '다름' if args.check else '저장'}  {target}")
        if page:
            preview(results, page)
            print(f"\n미리보기: {page}")
    except Exception as error:
        parser.exit(1, f"오류: {source}\n{error}\n")

    if args.check and changed:
        parser.exit(1, f"\n소스와 다른 도식 {changed}개. --check 없이 같은 명령을 실행해 다시 생성하세요.\n")
    print(f"\n도식 {len(results)}개 {'확인 완료' if args.check else f'중 {changed}개 저장'}.")


if __name__ == "__main__":
    main()
