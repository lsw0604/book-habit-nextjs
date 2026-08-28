# DESIGN.md — book-habit-nextjs

> 이 문서는 **디자인 시스템 정본**이다. 제품 정의·타깃 사용자·기술 스택은 `AGENTS.md`를 따른다.
> 컬러는 라이트/다크 모두 확정됐고, 타이포그래피·간격·elevation은 업계 표준(4/8px spacing, 4단계 elevation) 기준이다.

---

## ① Visual Theme & Atmosphere

- **분위기**: Notion, Linear, Todoist와 같은 미니멀 생산성 도구 톤. 장식적 요소를 배제하고, 화이트/라이트 블루 서피스 위에 콘텐츠(책, 기록, 통계, 서평)가 또렷하게 드러나도록 구성합니다.
- **밀도**: 화면 성격에 따라 밀도를 구분합니다. 대시보드(오늘의 기록·스트릭)는 여유로운(spacious) 레이아웃으로 핵심 지표를 크게, 서평/소셜 피드처럼 콘텐츠가 나열되는 화면은 Linear의 리스트 뷰처럼 컴팩트하게 구성합니다.
- **디자인 철학**: "조용한 동기부여" — 화려한 게이미피케이션 대신 진행 상황을 담백하게 시각화(진행 바, 배지, 스트릭 표시)하고, 서평·노트 같은 텍스트 콘텐츠는 가독성을 최우선으로 합니다. 소셜 요소(팔로우, 공유, 좋아요)도 Notion의 댓글 UI처럼 절제된 형태로 녹입니다.

---

## ② Color Palette & Roles

색상은 **base(원시값) → theme(라이트/다크 시맨틱 역할값)** 2단계 토큰 구조로 관리합니다. 컴포넌트는 항상 시맨틱 토큰(예: `action.primary`)을 참조하고, base HEX를 직접 하드코딩하지 않습니다.

### Base Tokens

| 토큰 | HEX | 비고 |
|---|---|---|
| `blue.50` | `#E3F2FD` | 가장 옅은 블루 |
| `blue.200` | `#90CAF9` | 옅은 블루 |
| `blue.500` | `#2196F3` | 브랜드 기본 블루 |
| `blue.900` | `#0D47A1` | 가장 진한 블루 |
| `darkScale.bg` | `#121418` | 다크모드 전용 배경 |
| `darkScale.surface` | `#1E232B` | 다크모드 전용 서피스 |
| `neutral.white` | `#FFFFFF` | |
| `neutral.black` | `#000000` | |
| `neutral.gray100` | `#F5F5F5` | |
| `neutral.gray300` | `#E0E0E0` | |
| `neutral.gray500` | `#757575` | |
| `neutral.gray800` | `#333333` | |

### Light Theme (시맨틱 토큰)

| 역할 | 토큰 | 참조 | HEX |
|---|---|---|---|
| 배경(기본) | `background.primary` | `neutral.white` | `#FFFFFF` |
| 배경(서피스/카드) | `background.surface` | `blue.50` | `#E3F2FD` |
| 배경(옅은 구획) | `background.subtle` | `neutral.gray100` | `#F5F5F5` |
| 텍스트(타이틀) | `text.title` | `blue.900` | `#0D47A1` |
| 텍스트(본문) | `text.primary` | `neutral.gray800` | `#333333` |
| 텍스트(보조) | `text.secondary` | `neutral.gray500` | `#757575` |
| 텍스트(반전, 버튼 위) | `text.inverse` | `neutral.white` | `#FFFFFF` |
| 액션(기본) | `action.primary` | `blue.500` | `#2196F3` |
| 액션(hover) | `action.primaryHover` | `blue.900` | `#0D47A1` |
| 액션(보조) | `action.secondary` | `blue.200` | `#90CAF9` |
| 액션(비활성) | `action.disabled` | `neutral.gray300` | `#E0E0E0` |
| 보더(기본) | `border.default` | `neutral.gray300` | `#E0E0E0` |
| 보더(포커스) | `border.focus` | `blue.200` | `#90CAF9` |

### Dark Theme (시맨틱 토큰)

| 역할 | 토큰 | 참조 | HEX |
|---|---|---|---|
| 배경(기본) | `background.primary` | `darkScale.bg` | `#121418` |
| 배경(서피스/카드) | `background.surface` | `darkScale.surface` | `#1E232B` |
| 배경(옅은 구획) | `background.subtle` | `blue.900` | `#0D47A1` |
| 텍스트(타이틀) | `text.title` | `blue.50` | `#E3F2FD` |
| 텍스트(본문) | `text.primary` | `neutral.gray300` | `#E0E0E0` |
| 텍스트(보조) | `text.secondary` | `neutral.gray500` | `#757575` |
| 텍스트(반전, 버튼 위) | `text.inverse` | `darkScale.bg` | `#121418` |
| 액션(기본) | `action.primary` | `blue.200` | `#90CAF9` |
| 액션(hover) | `action.primaryHover` | `blue.500` | `#2196F3` |
| 액션(보조) | `action.secondary` | `blue.900` | `#0D47A1` |
| 액션(비활성) | `action.disabled` | `neutral.gray500` | `#757575` |
| 보더(기본) | `border.default` | `neutral.gray500` | `#757575` |
| 보더(포커스) | `border.focus` | `blue.500` | `#2196F3` |

> 다크모드에서는 `action.primary`가 옅은 블루(`#90CAF9`)이므로 버튼 텍스트는 반드시 `text.inverse`(`#121418`, 어두운 색)를 사용합니다. 라이트모드는 반대로 `action.primary`가 진한 블루라 `text.inverse`가 흰색입니다. **별도의 active(눌림) 토큰은 정의되어 있지 않으므로**, active 상태는 `action.primaryHover`와 동일한 값을 사용하거나 해당 값에 `opacity 85%`를 적용해 표현합니다.

### Semantic (상태 표시 — 스트릭/목표)

| 색상 | HEX (Light) | HEX (Dark) | 용도 |
|---|---|---|---|
| Success | `#2E7D32` | `#66BB6A` | 목표 달성, 연속 기록(스트릭) 유지 |
| Warning | `#F9A825` | `#FFCA28` | 목표 미달 임박, 스트릭 위험 |
| Danger | `#C62828` | `#EF5350` | 기록 끊김, 삭제/파괴적 액션 |

> Success/Warning/Danger는 확정된 base/theme 토큰 세트에는 포함되어 있지 않아, `action.primary`가 라이트→다크에서 `blue.500`(진함) → `blue.200`(옅음)으로 두 단계 밝아지는 패턴과 동일한 논리로 다크 값을 도출했습니다(Material 800 계열 → 400 계열). `#121418` 배경 기준 대비비는 Success ≈ 7:1, Warning ≈ 12:1, Danger ≈ 6:1로 모두 AA 기준을 충분히 만족합니다.

---

## ③ Typography Rules

- **폰트 패밀리**: 본문/제목은 `Geist Sans` + `Noto Sans KR` 조합, 숫자·통계 강조는 `Geist Mono`(예: 연속 기록 일수)를 사용합니다.
- **Fallback**: `Geist Sans, Noto Sans KR, ui-sans-serif, system-ui, sans-serif`

> **왜 두 개인가**: Geist에는 한글 글리프가 없습니다(지원 subset이 latin·cyrillic·vietnamese 계열뿐). 폰트 폴백은 글리프 단위로 동작하므로, 이 순서를 두면 **영문·숫자는 Geist가, 한글은 Noto Sans KR이** 담당합니다. Geist만 지정하면 한글이 시스템 기본 폰트로 떨어져 화면마다 다르게 보입니다.

| 레벨 | 크기 | 굵기 | line-height | 용도 |
|---|---|---|---|---|
| H1 | 32px / 2rem | 700 | 1.25 | 페이지 타이틀 |
| H2 | 24px / 1.5rem | 700 | 1.3 | 섹션 타이틀 |
| H3 | 20px / 1.25rem | 600 | 1.35 | 카드 제목 |
| Body | 16px / 1rem | 400 | 1.6 | 본문 텍스트 |
| Small | 14px / 0.875rem | 400 | 1.5 | 보조 설명, 캡션 |
| Micro | 12px / 0.75rem | 500 | 1.4 | 배지, 타임스탬프 |
| Stat (숫자 강조) | 28px / 1.75rem | 700 (Geist Mono) | 1.2 | 연속 기록 일수, 통계 수치 |

- **letter-spacing**: 기본 `0`, H1/H2 등 큰 타이틀은 `-0.01em`로 살짝 좁혀 밀도감 부여.
- 제목(H1~H3)은 `text.title` 토큰, 본문은 `text.primary`, 캡션/보조 설명은 `text.secondary` 토큰을 사용합니다.

---

## ④ Component Stylings

색상은 모두 시맨틱 토큰 기준으로 표기합니다 (라이트/다크 값은 ②번 표 참조).

### Button (Primary)
- 기본: 배경 `action.primary`, 텍스트 `text.inverse`, `border-radius: 8px`, padding `10px 20px`
- Hover: 배경 `action.primaryHover`
- Active: `action.primaryHover`에 `opacity 85%` (별도 active 토큰 없음)
- Disabled: 배경 `action.disabled`, 텍스트 `text.secondary`, cursor not-allowed
- Focus: `2px solid border.focus` 아웃라인, offset 2px

### Button (Secondary / Outline)
- 기본: 배경 투명, 텍스트 `action.primary`, 테두리 `1px solid action.primary`
- Hover: 배경 `background.surface`

### Card
- 배경: `background.surface`
- `border-radius: 12px`, `border: 1px solid border.default`
- 내부 padding: `16px`(모바일) / `24px`(데스크톱)

### Input
- 기본: `border: 1px solid border.default`, `border-radius: 8px`, padding `10px 12px`
- Focus: `border-color: border.focus`, `box-shadow: 0 0 0 3px` (border.focus 색상, opacity 20%)
- Error: `border-color: #C62828`(Danger), 하단에 동일 색 텍스트로 에러 메시지

### Badge (스트릭/뱃지 표시)
- 배경 `action.secondary`, 텍스트 `text.title`, `border-radius: 999px`(pill), padding `4px 10px`, 폰트 Micro 스케일

### Navigation (하단 탭 / 사이드바)
- 비활성 아이콘·텍스트: `text.secondary`
- 활성 아이콘·텍스트: `action.primary`, 상단에 2px 인디케이터 바(모바일 하단 탭 기준)

### Note / Review Card (서평·노트)
- 배경: `background.primary`, `border: 1px solid border.default`, `border-radius: 12px`
- 본문 텍스트는 Body 스케일(16px/1.6)로 가독성 우선, 인용구는 좌측 `4px solid action.secondary` 보더 + 이탤릭
- 헤더에 책 표지 썸네일(48×64px, `border-radius: 4px`) + 책 제목/저자 메타(Small 스케일, `text.secondary`)

### Social Feed Item (소셜/공유)
- 기본: Card와 동일한 배경·보더, 상단에 사용자 아바타(32px, `border-radius: 999px`) + 닉네임 + 타임스탬프(Micro, `text.secondary`)
- 액션 바(좋아요/댓글/공유): 아이콘 + 카운트, 비활성 `text.secondary` → 활성(좋아요 눌림) `action.primary`
- hover 시 배경만 `background.surface`로 살짝 강조(그림자 추가 금지, elevation 1단계 유지)

---

## ⑤ Layout Principles

- **Base unit**: 4px. 모든 spacing은 4의 배수로 사용합니다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `space-xs` | 4px | 아이콘-텍스트 간격 |
| `space-sm` | 8px | 인풋 내부 여백, 배지 padding |
| `space-md` | 16px | 카드 내부 padding(모바일), 컴포넌트 간 기본 간격 |
| `space-lg` | 24px | 섹션 내부 padding(데스크톱), 카드 간 간격 |
| `space-xl` | 40px | 섹션과 섹션 사이 간격 |
| `space-2xl` | 64px | 페이지 상단 여백, 큰 구획 분리 |

- **컨테이너 최대 너비**: `1200px` (센터 정렬, 좌우 padding `16px`~`24px`)
- **그리드**: 12-column, gutter `24px` (데스크톱) / `16px` (모바일)

---

## ⑥ Depth & Elevation

4단계 elevation을 사용하며, 그림자는 항상 1개만 적용합니다(중첩 금지).

| 레벨 | 용도 | box-shadow (라이트) | box-shadow (다크) |
|---|---|---|---|
| 0 | 페이지 배경, flat 요소 | none | none |
| 1 | 카드, 리스트 아이템 | `0 1px 2px rgba(0,0,0,0.06)` | `0 1px 2px rgba(0,0,0,0.4)` |
| 2 | 호버된 카드, 드롭다운 | `0 4px 8px rgba(0,0,0,0.10)` | `0 4px 8px rgba(0,0,0,0.5)` |
| 3 | 팝오버, 툴팁 | `0 8px 16px rgba(0,0,0,0.14)` | `0 8px 16px rgba(0,0,0,0.55)` |
| 4 | 모달, 다이얼로그 | `0 16px 32px rgba(0,0,0,0.18)` | `0 16px 32px rgba(0,0,0,0.6)` |

다크모드에서는 그림자만으로 계층이 잘 드러나지 않으므로, `background.primary`(`#121418`) 위에 `background.surface`(`#1E232B`)를 얹어 서피스 자체를 한 단계 밝혀 계층을 표현하고, 위 표의 그림자는 보조적으로만 사용합니다.

---

## ⑦ Do's and Don'ts

**Do**
- 색상은 항상 시맨틱 토큰(`action.primary`, `text.title` 등)으로 참조하고, 컴포넌트 코드에 base HEX를 직접 하드코딩하지 않는다.
- 시맨틱 컬러(Success/Warning/Danger)는 반드시 아이콘 또는 텍스트 라벨과 함께 사용한다 (색맹 사용자 접근성).
- 스트릭/목표 달성 등 핵심 지표는 Geist Mono + Stat 스케일로 통일해서 시각적으로 바로 구분되게 한다.
- Success/Warning/Danger는 **상태 표시 용도(배지, 스트릭 카드, 폼 검증, 삭제 확인)로만** 사용하고, 그 외 모든 UI(버튼, 내비게이션, 일러스트, 장식 요소)는 블루 계열(`action.*`, `text.*`)로만 구성해 브랜드 톤의 일관성을 지킨다.

**Don't**
- 그라데이션 배경을 사용하지 않는다 — 팔레트는 단색 톤으로만 구성한다.
- 그림자를 두 개 이상 겹쳐 쓰지 않는다 (elevation 표 기준 1단계만 적용).
- `action.primary` 배경 위에 `text.inverse`가 아닌 다른 텍스트 색을 올리지 않는다 (다크모드에서 `action.primary`는 옅은 블루라 흰 텍스트를 쓰면 대비가 무너진다).
- 배지 요소에 임의의 새 색상을 추가하지 않는다 — `action.secondary` 또는 Success/Warning/Danger 중에서만 선택한다.
- Success/Warning/Danger를 Primary 버튼, 내비게이션 활성 상태, 배경 장식 등 상태 표시가 아닌 곳에 사용하지 않는다 (예: "저장" 버튼을 초록색으로 만들지 않기 — 저장은 `action.primary`, 완료 확인 배지만 Success 사용).

---

## ⑧ Responsive Behavior

- **브레이크포인트** (Tailwind 기본값 사용)

| 이름 | 최소 너비 | 대상 |
|---|---|---|
| `sm` | 640px | 큰 모바일 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 데스크톱 |
| `xl` | 1280px | 와이드 데스크톱 |

- **터치 타깃 최소 크기**: 44×44px (모바일 버튼/아이콘 버튼)
- **레이아웃 축소 전략**:
  - `< md`: 사이드바 대신 하단 탭 내비게이션, 카드 1열 스택
  - `md ~ lg`: 카드 2열 그리드, 사이드바는 아이콘만 표시(collapsed)
  - `>= lg`: 사이드바 전체 노출(라벨 포함), 카드 3열 그리드, 컨테이너 최대 1200px로 센터 정렬

---

## ⑨ Agent Prompt Guide

### 빠른 참조

```
[Base]
blue.50 #E3F2FD / blue.200 #90CAF9 / blue.500 #2196F3 / blue.900 #0D47A1
darkScale.bg #121418 / darkScale.surface #1E232B
gray100 #F5F5F5 / gray300 #E0E0E0 / gray500 #757575 / gray800 #333333

[Light]
background.primary #FFFFFF / background.surface #E3F2FD / background.subtle #F5F5F5
text.title #0D47A1 / text.primary #333333 / text.secondary #757575 / text.inverse #FFFFFF
action.primary #2196F3 (hover #0D47A1) / action.secondary #90CAF9 / action.disabled #E0E0E0
border.default #E0E0E0 / border.focus #90CAF9

[Dark]
background.primary #121418 / background.surface #1E232B / background.subtle #0D47A1
text.title #E3F2FD / text.primary #E0E0E0 / text.secondary #757575 / text.inverse #121418
action.primary #90CAF9 (hover #2196F3) / action.secondary #0D47A1 / action.disabled #757575
border.default #757575 / border.focus #2196F3

Success #2E7D32 / Warning #F9A825 / Danger #C62828 (다크 변형 TBD)
폰트: Geist Sans + Noto Sans KR(본문) / Geist Mono(숫자·통계)
Radius: 버튼 8px / 카드 12px / 배지 999px(pill)
Spacing base: 4px
```

### 예시 프롬프트

1. "DESIGN.md를 참고해서 오늘의 독서 목표와 연속 기록(스트릭)을 보여주는 대시보드 카드를 만들어줘. 색상은 시맨틱 토큰으로, Stat 텍스트는 Geist Mono로."
2. "DESIGN.md 기준으로 독서 기록 입력 폼을 만들어줘. Input 컴포넌트 스타일과 Primary 버튼을 그대로 적용하고, 에러 상태도 포함해줘."
3. "DESIGN.md의 Badge 스타일로 '7일 연속 달성' 뱃지 컴포넌트를 만들어줘. 라이트/다크 테마 토글에 따라 색이 자동으로 바뀌게 CSS 변수로 구현해줘."
4. "DESIGN.md의 Note/Review Card 스타일로 서평 작성·조회 화면을 만들어줘. 책 표지 썸네일과 인용구 스타일을 포함해줘."
5. "DESIGN.md의 Social Feed Item 스타일로 팔로우한 사용자들의 독서 활동 피드를 만들어줘. 좋아요/댓글 액션바 상태(비활성/활성)를 반영해줘."

---

## 사용 안내

- 이 파일은 프로젝트 루트에 두고, Claude Code 등 AI 코딩 에이전트에게 "DESIGN.md를 참고해서 ○○ 컴포넌트를 만들어줘"라고 요청하면 됩니다.
- 디자인이 바뀌면 이 문서도 함께 업데이트해야 일관성이 유지됩니다.
- `AGENTS.md`(행동/코딩 규칙)와는 역할이 다르며, 이 문서는 오직 시각적 외형만 담당합니다.
