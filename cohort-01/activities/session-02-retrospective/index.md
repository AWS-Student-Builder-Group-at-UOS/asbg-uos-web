---
type: retrospective
status: done
session: 2
date: 2026-10-04
title:
  ko: 3-Tier를 배우고, 설계의 이유를 묻다
  en: Learning 3-Tier Architecture, Asking Why
description:
  ko: "네트워크 기초에서 EC2 배포까지 이어진 두 번째 세션을 돌아봅니다. 서버 한 대에서 확인한 동작을 바탕으로, 수강신청 포털의 설계와 검증에 어떤 질문을 가져갈지 정리했습니다."
  en: "Looking back at our second session, from network basics to deploying on EC2, and the questions we are carrying into the design and validation of a course registration portal."
keywords: [ARCHITECTURE, VALIDATION, LEARNING]
author:
  group: core
thumbnail: img/thumbnail.svg
---

9월 29일, ASBG UOS 1기의 두 번째 세션은 네트워크 기초에서 서버 배포까지 이어졌습니다. VPC와 서브넷이 무엇인지 설명하는 발표에, EC2 한 대로 웹페이지를 제공하는 실습을 연결했습니다. 운영진의 입장에서 이번 구성을 돌아보면, 배운 개념을 실제 요청이 지나가는 길 위에 놓고 볼 수 있다는 점이 중요했습니다. 서비스의 이름을 아는 데서 출발해, 그 자리에 왜 필요한지 묻는 시간으로 이어 가고 싶었습니다.

## 요청의 길을 따라 이론과 실습 잇기

[네트워크 기초 발표](/ko/activities/cohort-01/session-02-presentation-01)는 IP와 포트, TCP와 UDP, CIDR을 짚은 뒤 VPC 안의 서브넷과 EC2로 시야를 넓혔습니다. 퍼블릭과 프라이빗을 구분하고, 사용자 요청과 서버의 외부 통신이 서로 어떤 경로를 지나는지 살펴봤습니다. 이 순서는 이후 보안 그룹을 설정할 때에도 유효합니다. 포트 번호를 입력하기 전에, 누가 어떤 프로그램에 접근해야 하는지부터 설명할 수 있어야 하기 때문입니다.

이어진 [3-Tier 발표와 EC2 실습](/ko/activities/cohort-01/session-02-presentation-02)에서는 기본 VPC에 EC2를 만들고 Nginx로 웹페이지를 제공하는 과정을 다뤘습니다. HTTP 허용 규칙을 지웠다가 복구하며 접속의 변화를 확인하는 단계도 실습에 담았습니다. 같은 서버와 파일을 두고 네트워크 설정 하나가 응답에 어떤 영향을 주는지 살펴보는 구성입니다. 마지막에 인스턴스와 남은 리소스를 정리하도록 한 것까지 포함해, 배포를 시작부터 종료까지 다루려 했습니다.

## 나누는 이유와 나눌 때의 부담

이번 실습의 범위는 WEB 계층 하나였습니다. 따라서 이를 완성된 3-Tier 구축과 구분해서 돌아볼 필요가 있습니다. 발표에서 다룬 계층 분리의 이유는 접근 제어, 계층별 확장, 자원과 변경의 영향 분리였고, 그만큼 비용과 운영 작업도 늘어납니다. **세 계층으로 나누는 구조를 외우는 것과, 지금 서비스에 그 구조가 필요한 이유를 설명하는 것은 다른 일입니다.** 다음 학습에서는 그림 속 구성 요소의 수보다 해결하려는 문제와 선택의 근거를 더 자세히 살펴보려 합니다.

## 설계의 설명을 검증의 질문으로

[Session 02 과제](https://github.com/AWS-Student-Builder-Group-at-UOS/cohort-01-assignments/blob/main/session-02/README.md)는 이 질문을 수강신청 포털에 적용합니다. 과제에 주어진 문제는 로그인 끊김, 장애 서버로 계속 전달되는 요청, 접속량 변화에 대응하지 못하는 서버 구성입니다. VPC, EC2, Auto Scaling, ALB, RDS를 포함하되, 각각을 배치한 이유와 남아 있는 한계를 설명해야 합니다. 세션에서 살펴본 요청의 경로에 서버 교체와 장애, 부하 변화라는 조건을 더해 보는 과정입니다.

회차 안내에서 필수로 정한 범위는 아키텍처 다이어그램, 설계 설명, 검증 계획이며 실제 구현은 선택입니다. 그래서 앞으로 결과물을 읽을 때에는 설계가 의도한 동작과 실제로 확인한 범위를 구분하려 합니다. [작성 양식](https://github.com/AWS-Student-Builder-Group-at-UOS/cohort-01-assignments/blob/main/TEMPLATE.md)에서도 선택 이유와 검증 근거, 확인하지 못한 범위를 함께 기록하도록 하고 있습니다. 운영진이 이어서 묻고 싶은 질문도 이 연결에 있습니다.

| 설계에서 설명할 것 | 검증으로 이어질 질문 |
| --- | --- |
| APP이 바뀌어도 로그인 상태를 유지하는 방법 | 요청이 다른 APP으로 가거나 서버가 교체된 뒤에도 상태가 유지되는가? |
| 장애 서버를 감지하고 제외·복구하는 과정 | 어느 시점에 요청 전달이 멈추고, 어떤 조건에서 정상 서비스로 돌아오는가? |
| 부하에 따라 서버 수를 조절하는 기준 | 신청 시작 전의 대비와 이후 확장·축소가 의도한 시점에 이루어지는가? |

## 다음 기록에는 판단의 과정을 남기기

[과제 저장소](https://github.com/AWS-Student-Builder-Group-at-UOS/cohort-01-assignments)에서는 10월 13일 오후 9시(KST)까지 자율 참여 과제가 진행됩니다. 제출 이후에는 각자의 설계가 같은 문제에 어떻게 답했는지, PR에서 어떤 질문을 주고받으며 설명을 보완했는지 돌아보려 합니다. 구현한 범위와 아직 확인하지 못한 조건도 함께 남길 생각입니다. 이번 세션이 요청의 길을 따라가는 출발점이었다면, 다음 기록에는 그 길을 왜 그렇게 설계했는지 판단한 과정까지 담고 싶습니다.
