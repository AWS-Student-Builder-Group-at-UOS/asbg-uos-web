---
date: 2027-03-09
status: done
title:
  ko: 터미널과 Git · 팀 실습 기록을 남기는 첫 작업 흐름
  en: Terminal and Git · A First Workflow for Team Workshop Notes
description:
  ko: "Round 0의 첫 발표에서는 황수진이 터미널에서 위치를 확인하고, 바뀐 내용을 골라 커밋하는 흐름을 보여주었습니다. 15분 시연에 이어 혼자 다시 따라 할 수 있는 실습, 자주 만난 오류, 팀 저장소에 기록을 남기는 기준을 정리했습니다."
  en: "Sujin Hwang opened Round 0 with a 15-minute demonstration of finding your way around a terminal and choosing changes for a commit. This record adds a repeatable local exercise, common failures, and a checklist for useful team workshop notes."
keywords: [Terminal, Git, Collaboration]
speakers: [hwang-sujin]
thumbnail: img/thumbnail.svg
---

## 15분 동안 무엇을 해 봤나요

Round 0의 첫 발표는 19시 10분부터 25분까지 황수진이 맡았습니다. 이번 학기에는 다음 팀원이 워크숍을 다시 따라갈 수 있도록 기록하는 일이 중요했습니다. 그런데 처음에는 터미널 명령에 반응이 없거나, 파일을 고쳤는데 커밋에는 다른 내용이 들어가는 순간이 생깁니다. 그래서 내가 어디에서 무엇을 바꾸고 있는지 확인하는 흐름부터 잡았습니다.

화면에는 작은 실습 폴더 하나만 열었습니다. 황수진은 README 한 줄을 쓰고 저장한 뒤, 변경을 확인하고, 커밋에 넣을 파일을 고르고, 기록에 이름을 붙이는 순서를 보여주었습니다. 마지막에는 로컬에 남긴 기록과 팀원이 볼 수 있는 원격 저장소가 서로 다른 단계라는 점을 짚었습니다. SSH 접속과 push는 연결 관계를 소개하는 정도로 마쳤고, 각자 GitHub 인증을 끝내는 작업은 후속 과제로 이어졌습니다.

아래는 15분 시연을 집에서 다시 해 볼 수 있도록 풀어 쓴 실습입니다. 새 로컬 폴더에서 진행하며, 단계마다 화면이 왜 달라졌는지 설명할 수 있는지를 완료 기준으로 삼았습니다.

## 발표에서 다룬 순서

| 시간 | 시연 | 확인한 것 |
|---|---|---|
| 19:10–19:13 | 현재 위치 확인, 폴더 이동, 파일 목록 보기 | 터미널도 항상 특정 폴더 안에서 작동한다는 점 |
| 19:13–19:17 | README 작성, 저장소 시작, 변경 확인 | 파일 저장과 Git 기록은 별개의 동작이라는 점 |
| 19:17–19:22 | 파일 선택, 커밋, add 뒤 다시 수정하기 | 이번 커밋에 들어갈 내용은 직접 골라야 한다는 점 |
| 19:22–19:25 | 로컬 기록과 원격 공유, 질문 정리 | 인증·권한·기록 문제를 구분해서 질문하는 방법 |

## 먼저 세 군데를 구분했습니다

작업 폴더는 편집기로 고치는 파일이 있는 곳입니다. 스테이징 영역은 다음 커밋에 넣기로 고른 내용이고, 커밋은 그 선택을 기록한 결과입니다. 선택한 시점의 내용을 담기 때문에 `git add` 뒤에 같은 파일을 더 고치면 그 수정분은 다시 선택해야 합니다. 이 동작은 [Git의 add 문서](https://git-scm.com/docs/git-add)에 설명되어 있습니다.

![작업 폴더에서 변경을 선택하고 커밋한 뒤 원격 저장소로 공유하는 흐름](img/diagram.svg)

그림의 마지막 원격 저장소는 앞의 세 단계와 별도로 표시했습니다. 노트북 안에 커밋이 생겨도 팀원의 화면이 곧바로 바뀌지는 않습니다. 워크숍 중간에는 로컬에서 기록을 쌓고, 공유할 내용과 대상을 확인한 뒤 원격으로 보내면 됩니다.

## 실습 1 · 지금 어느 폴더에 있나요

Git이 설치된 macOS·Linux 터미널 또는 Windows의 Git Bash에서 진행합니다. 먼저 새 실습 폴더를 둘 상위 폴더로 이동해 아래를 한 줄씩 실행합니다. `asbg-round0-git-practice`가 이미 있다면 기존 폴더를 덮어쓰지 말고 다른 이름으로 새 폴더를 만듭니다. 중간에 오류가 나면 그 줄에서 멈추고 위치와 폴더 이름을 확인합니다.

```sh
pwd
ls
mkdir asbg-round0-git-practice
cd asbg-round0-git-practice
pwd
git --version
git init -b main
```

두 번째 `pwd`의 마지막 부분이 방금 만든 폴더 이름인지 확인했습니다. `ls`가 아무것도 표시하지 않는 것은 빈 폴더라면 정상입니다. `git init -b main`은 현재 폴더에 저장소를 만들고 첫 브랜치 이름을 명시합니다. 아직 커밋이 하나 생긴 것은 아닙니다. 옵션과 초기 상태는 [Git의 init 문서](https://git-scm.com/docs/git-init)에서 확인할 수 있습니다.

위치를 헷갈린 채 명령을 이어 붙이면 어떤 저장소를 수정했는지부터 다시 찾아야 합니다. 명령을 치기 전에 폴더 이름을 읽고, 에디터와 터미널이 같은 폴더를 보고 있는지도 확인했습니다.

## 실습 2 · 다음 사람이 읽을 파일 만들기

새 실습 저장소 안에서 아래 파일을 만들었습니다. 이번에는 복사해서 그대로 시작할 수 있도록 짧게 적었고, 이후 각자 표현으로 내용을 보완했습니다.

```sh
mkdir notes
cat > README.md <<'EOF'
# Round 0 Git Practice

Goal: leave workshop notes another teammate can follow.

Start with notes/round-0.md.
EOF
cat > notes/round-0.md <<'EOF'
# Round 0 Notes

## Goal
Explain the difference between saving a file and making a commit.

## What I checked
- I can find the repository folder in my terminal.

## Next question
- How do I choose what goes into the next commit?
EOF
cat > .gitignore <<'EOF'
.DS_Store
.env
.env.*
EOF
git status --short
```

새 파일은 보통 `??` 표시로 나타납니다. 아직 Git이 추적하지 않는 파일이라는 뜻입니다. `notes/`처럼 폴더로 묶여 보일 수 있으므로, 목록이 예시와 한 글자씩 같아야 한다고 생각할 필요는 없습니다. 짧은 상태 표시의 의미는 [Git의 status 문서](https://git-scm.com/docs/git-status)를 함께 읽었습니다.

기록은 무엇을 시도했고, 어떤 결과로 확인했고, 무엇이 남았는지에 답하도록 썼습니다. 명령만 적으면 실행 위치가 빠지고, 성공 화면만 붙이면 확인 기준이 빠집니다. 파일 이름과 작업 위치를 스크린샷보다 먼저 쓰기로 했습니다.

`.gitignore`에는 이번 연습에서 공유하지 않을 파일 패턴을 넣었습니다. 다만 이미 추적하던 파일에 나중에 패턴을 추가해도 기존 기록이 지워지는 것은 아닙니다. 실습 기록에 계정 정보나 자격 증명을 넣지 않는 확인 과정은 따로 필요합니다. 이 범위는 [Git의 gitignore 문서](https://git-scm.com/docs/gitignore)에 명시되어 있습니다.

## 실습 3 · 고른 내용을 첫 기록으로 남기기

파일 세 개만 명시해서 선택했습니다. 실습 폴더 바깥의 자료나 아직 정리하지 않은 메모까지 함께 넣지 않도록, 처음에는 파일 이름을 직접 읽으며 입력했습니다.

```sh
git add README.md notes/round-0.md .gitignore
git diff --staged
git status --short
git commit -m "docs: add round 0 practice notes"
git log -1 --oneline
git status --short
```

`git diff --staged`에서 제목과 본문, 제외 패턴이 의도대로 들어갔는지 읽고 커밋했습니다. 커밋은 그 시점의 스테이징 내용을 기록합니다. 첫 기록을 남긴 뒤 다른 변경이 없다면 마지막 상태 명령은 아무 파일도 표시하지 않습니다. 커밋의 대상과 메시지 옵션은 [Git의 commit 문서](https://git-scm.com/docs/git-commit)에 정리되어 있습니다.

커밋 메시지의 `docs:`는 기록 변경을 알아보기 위해 정한 표현입니다. Git이 요구하는 문구는 아닙니다. `수정`, `완료`보다 대상을 구체적으로 적고, 기록 양식을 만든 일과 확인 결과를 나누니 되짚기 쉬웠습니다.

## 실습 4 · add한 다음에 또 고치면 어떻게 되나요

첫 커밋까지 끝난 상태에서 다음을 실행합니다. 이미 기록된 메모 파일에 한 줄을 넣고 선택한 다음, 다시 한 줄을 추가합니다.

```sh
printf '\n- I checked the staged changes before committing.\n' >> notes/round-0.md
git add notes/round-0.md
printf '\n- I added another observation after staging.\n' >> notes/round-0.md
git status --short
git diff
git diff --staged
```

이제 `notes/round-0.md` 앞에 `MM`이 보입니다. 이번 예시에서는 선택해 둔 수정과 그 뒤에 생긴 수정이 함께 있다는 뜻입니다. `git diff`에는 나중에 추가한 줄이, `git diff --staged`에는 먼저 선택한 줄이 나타납니다. 두 비교 대상의 차이는 [Git의 diff 문서](https://git-scm.com/docs/git-diff)에서 확인할 수 있습니다.

에디터의 마지막 모습과 다음 커밋에 들어갈 내용은 같지 않을 수 있습니다. 나중에 쓴 줄도 포함하려면 다시 add한 뒤 확인하고, 다음 작업의 메모라면 그대로 둡니다. 무엇을 남길지 먼저 결정하는 연습입니다.

```sh
git add notes/round-0.md
git diff --staged
git commit -m "docs: record staging observations"
git log -2 --oneline
```

## 막혔던 지점은 이렇게 나눠 봤습니다

### 저장소가 아니라는 메시지가 나왔습니다

`not a git repository`가 나오면 먼저 `pwd`와 `ls -a`로 위치를 봅니다. 새 터미널 탭을 열고 이전 탭과 같은 폴더에 있을 것이라고 생각한 경우가 있었습니다. 이 실습에서는 `asbg-round0-git-practice`로 다시 이동한 뒤 `git status`를 실행하면 됩니다. 오류가 보인 모든 폴더에서 `git init`을 반복하면 오히려 저장소가 어디인지 헷갈립니다. 만들었던 폴더를 찾는 것이 첫 번째 조치였습니다.

### 커밋 작성자 정보를 정하라는 메시지가 나왔습니다

이름과 이메일은 커밋에 남길 작성자 정보이며 로그인 비밀번호와는 다릅니다. `git config --get user.name`과 `git config --get user.email`로 확인하고, 비어 있다면 본인의 정보를 실습 저장소의 로컬 설정에 넣습니다. 다른 사람의 값을 복사하지 않습니다. 개인 주소를 공개하기 부담스럽다면 GitHub가 제공하는 커밋용 비공개 이메일을 사용할 수 있습니다. 설정은 [GitHub의 커밋 이메일 안내](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)를 참고합니다.

### 이번 커밋에 넣지 않을 메모를 선택했습니다

첫 커밋이 이미 있는 상태에서만 아래 연습을 진행합니다. 기존 메모 파일에 내용을 덧붙여 add한 뒤 선택을 취소해 봅니다. `--staged`는 스테이징 영역만 되돌리므로 작업 폴더에서 작성한 내용은 남습니다. [Git의 restore 문서](https://git-scm.com/docs/git-restore)에서 옵션이 가리키는 대상을 확인했습니다.

```sh
printf '\n- Draft question for the next workshop.\n' >> notes/round-0.md
git add notes/round-0.md
git restore --staged notes/round-0.md
git status --short
git diff
```

이 상태는 실패가 아닙니다. 메모는 파일에 남고 이번 커밋의 선택 목록에서만 빠집니다. 위 실습 뒤 상태가 깨끗하지 않은 것은 의도한 결과이며, 남겨 둔 초안은 다음 기록을 만들 때 다시 검토하면 됩니다.

### 커밋했는데 팀원이 볼 수 없다고 했습니다

로컬 기록과 원격 공유를 구분해 확인했습니다. `git log -2 --oneline`은 내 기록, `git remote -v`는 연결 대상, `git branch --show-current`는 현재 브랜치를 확인하는 데 썼습니다. 이번 로컬 연습 저장소에는 원격을 연결하지 않았으므로 `git remote -v`가 비어 있는 것이 정상입니다. 팀 저장소 과제에서는 합의한 저장소 주소와 브랜치인지 먼저 확인한 뒤 공유합니다. push는 로컬 기록을 원격 참조에 반영하는 단계이며, 구체적인 동작은 [Git의 push 문서](https://git-scm.com/docs/git-push)에 설명되어 있습니다.

인증 실패라면 로그인 방식과 저장소 접근 권한을 확인하고, 원격에 다른 기록이 먼저 생겨 거부된 경우라면 팀원과 변경을 먼저 비교합니다. 모든 push 오류를 같은 문제로 보고 강제로 보내지 않는 것이 이번 시간의 약속이었습니다. 질문할 때는 자격 증명이나 토큰을 붙이지 않고, 실행한 명령과 비밀정보를 가린 오류 문구를 함께 남기기로 했습니다.

## 발표 뒤에 나온 질문

**Q. 파일을 저장했는데 왜 add와 commit까지 해야 하나요?**

A. 편집기의 저장은 현재 파일을 바꿉니다. 우리는 그중 어떤 변경을 하나의 설명으로 묶을지 고르고, 나중에 다시 볼 수 있도록 기록하려고 Git을 씁니다. 실습 4에서 선택한 줄과 아직 선택하지 않은 줄을 비교해 보면 역할이 분명해집니다.

**Q. 모든 변경을 한 커밋에 넣으면 안 되나요?**

A. 함께 설명할 수 있는 수정이라면 괜찮습니다. 다만 폴더 구조를 만든 일과 워크숍 중 발견한 오류를 고친 일처럼 이유가 다르면 나누는 편이 읽기 좋았습니다. 파일 개수로 나누기보다 팀원에게 어떤 문장으로 설명할 수 있는지 생각해 봅니다.

**Q. 터미널이 어렵다면 GUI로 해도 되나요?**

A. 가능합니다. 도구를 바꿔도 변경을 보고, 이번에 남길 것을 고르고, 기록을 공유하는 판단은 같습니다. 처음에는 터미널에서 상태를 확인해 보고, 자신에게 편한 화면과 같은 결과를 보여주는지 비교해 보면 좋겠습니다.

**Q. SSH를 배웠는데 오늘 바로 서버에 접속하지는 않나요?**

A. 이번 블록에서는 원격 시스템에 연결하는 도구라는 위치만 설명했습니다. 개인별 인증 설정과 원격 접속은 별도 확인이 필요해 15분 안에 모두 진행하지 않았습니다. 오늘은 내 컴퓨터 안의 기록을 설명할 수 있는 상태까지 마무리하고, 팀 저장소 인증은 과제로 이어갑니다.

## 남긴 결과와 다음 작업

완료 기준은 목적을 적은 README, 확인 결과와 질문을 적은 메모, 구분되는 기록 두 개였습니다. `git diff`와 `git diff --staged` 중 무엇을 보고 있는지 설명하며, 옆 사람의 상태 화면도 함께 읽어 봤습니다.

다음 과제에서는 같은 양식을 팀 저장소에 옮깁니다. Round 1 전에 구성원마다 기록을 남기고 서로 찾아 읽습니다. 시작 위치나 성공 기준이 빠졌다면 한 문장씩 보완하고, 인증 문제는 내용 작성과 따로 적어 멘토와 확인합니다.

복습할 때는 [실습 체크리스트 PDF](files/workshop-checklist.pdf)에서 시작 위치, 변경 선택, 기록, 오류 진단 항목을 확인합니다. 다음 발표에서는 AWS 계정 설정과 비용 확인을 이어갑니다.
