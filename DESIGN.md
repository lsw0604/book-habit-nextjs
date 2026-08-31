# DESIGN.md — book-habit

> **시각 디자인 정본.** 제품 정의는 `AGENTS.md`, 레이어 규칙은 `docs/architecture.md`가 담당한다.
> 이 문서의 모든 값은 `src/app/globals.css`에 CSS 변수로 구현되어 있다.
> 각 표의 **CSS 변수 / 클래스** 열이 코드와의 계약이다. 컴포넌트는 HEX가 아니라 그 클래스를 쓴다.

### 구현 현황 (2026-08-30)

- **토큰**: 컬러·elevation·radius 전부 `globals.css`에 구현 완료.
- **다크 테마**: 변수는 `.dark`에 정의됐지만 클래스를 붙이는 토글이 아직 없다 → 현재는 라이트만 렌더링된다. 그래도 신규 코드는 다크 대비를 항상 함께 검증한다.
- **구현된 컴포넌트** (`src/shared/ui/`): Button, Input, Textarea, Checkbox, Switch, Label, Field, Separator, Avatar, Skeleton, Tooltip, Calendar, ActivityCalendar.
- **미구현**: Card, Badge, Toast, Modal, Progress, 연간 Streak Heatmap, Feed Item 등 → ④의 **신규 컴포넌트 파생 규칙**을 따라 만든다.

---

## ① Visual Theme & Atmosphere

- **톤**: Notion·Linear·Todoist 같은 미니멀 생산성 도구. 장식을 배제하고 화이트/라이트 블루 서피스 위에 콘텐츠(책·기록·통계·서평)만 또렷하게 남긴다.
- **밀도**: 대시보드(오늘의 기록·스트릭)는 여유롭게 지표를 크게, 서평·피드처럼 나열되는 화면은 Linear 리스트 뷰처럼 컴팩트하게.
- **철학**: "조용한 동기부여" — 게이미피케이션 대신 진행 바·배지·스트릭으로 담백하게, 텍스트는 가독성 우선, 소셜 요소는 Notion 댓글 UI처럼 절제한다.

---

## ② Color Palette & Roles

**Base 원시값** — 컴포넌트에서 직접 쓰지 않는다. 아래 시맨틱 표의 출처일 뿐이다.

```
blue.50 #E3F2FD · blue.200 #90CAF9 · blue.500 #2196F3 · blue.900 #0D47A1
darkScale.bg #121418 · darkScale.surface #1E232B
gray100 #F5F5F5 · gray300 #E0E0E0 · gray500 #757575 · gray800 #333333
```

**시맨틱 토큰 ↔ 코드** — 이 표가 정본이다.

| 역할                  | CSS 변수               | Tailwind 클래스                         | Light     | Dark      |
| --------------------- | ---------------------- | --------------------------------------- | --------- | --------- |
| 배경(기본)            | `--background`         | `bg-background`                         | `#FFFFFF` | `#121418` |
| 배경(서피스/카드)     | `--card` · `--accent`  | `bg-card` · `hover:bg-accent`           | `#E3F2FD` | `#1E232B` |
| 배경(옅은 구획)       | `--muted`              | `bg-muted`                              | `#F5F5F5` | `#1E232B` |
| 텍스트(타이틀)        | `--title`              | `text-title`                            | `#0D47A1` | `#E3F2FD` |
| 텍스트(본문)          | `--foreground`         | `text-foreground`                       | `#333333` | `#E0E0E0` |
| 텍스트(보조)          | `--muted-foreground`   | `text-muted-foreground`                 | `#757575` | `#757575` |
| 텍스트(반전, 버튼 위) | `--primary-foreground` | `text-primary-foreground`               | `#FFFFFF` | `#121418` |
| 액션(기본)            | `--primary`            | `bg-primary` · `text-primary`           | `#2196F3` | `#90CAF9` |
| 액션(hover)           | `--primary-hover`      | `hover:bg-primary-hover`                | `#0D47A1` | `#2196F3` |
| 액션(보조)            | `--secondary`          | `bg-secondary`                          | `#90CAF9` | `#0D47A1` |
| 액션(비활성)          | `--disabled`           | `disabled:bg-disabled`                  | `#E0E0E0` | `#757575` |
| 보더(기본)            | `--border` · `--input` | `border-border` · `border-input`        | `#E0E0E0` | `#757575` |
| 보더/링(포커스)       | `--ring`               | `focus-visible:border-ring` `ring-ring` | `#90CAF9` | `#2196F3` |

**상태색 (Success / Warning / Danger)** — 스트릭·목표·폼 검증 전용.

| 역할    | CSS 변수        | Tailwind 클래스                       | Light     | Dark      |
| ------- | --------------- | ------------------------------------- | --------- | --------- |
| Success | `--success`     | `text-success` · `bg-success`         | `#2E7D32` | `#66BB6A` |
| Warning | `--warning`     | `text-warning` · `bg-warning`         | `#F9A825` | `#FFCA28` |
| Danger  | `--destructive` | `text-destructive` · `bg-destructive` | `#C62828` | `#EF5350` |

**차트**: `--chart-1`~`--chart-5`가 블루 계열 + 중립으로 정의돼 있다(`chart-1`이 가장 강조). 통계 화면은 이 순서대로 쓴다.

> 1. 다크에서 `--primary`는 **옅은** 블루라 그 위 텍스트는 반드시 `text-primary-foreground`(어두운 색)다.
> 2. active(눌림) 토큰은 없다. `primary-hover`를 그대로 쓰거나 `opacity 85%`를 얹는다.
> 3. `--muted` 다크값이 `blue.900`이 아닌 이유: muted는 스켈레톤·비활성처럼 **물러나는** 자리라 채도 높은 파랑이 역할을 뒤집는다. `blue.900`은 `--secondary`로 이미 노출돼 있다.

---

## ③ Typography Rules

`--font-sans` = `Geist Sans → Noto Sans KR → ui-sans-serif → system-ui`. Geist에 한글 글리프가 없고 폰트 폴백은 글리프 단위로 동작하므로 **영문·숫자는 Geist, 한글은 Noto**가 받는다 — 순서를 바꾸지 않는다. 숫자·통계는 `font-mono`(Geist Mono).

| 레벨  | 크기 (모바일 / `md`↑) | 굵기 | line-height | Tailwind 클래스                                                            | 용도              |
| ----- | --------------------- | ---- | ----------- | -------------------------------------------------------------------------- | ----------------- |
| H1    | 28px / 32px           | 700  | 1.25        | `text-[1.75rem] md:text-[2rem] leading-tight font-bold tracking-[-0.01em]` | 페이지 타이틀     |
| H2    | 20px / 24px           | 700  | 1.3         | `text-xl md:text-2xl leading-[1.3] font-bold tracking-[-0.01em]`           | 섹션 타이틀       |
| H3    | 20px                  | 600  | 1.35        | `text-xl leading-[1.35] font-semibold`                                     | 카드 제목         |
| Body  | 16px                  | 400  | 1.6         | `text-base leading-[1.6]`                                                  | 본문              |
| Small | 14px                  | 400  | 1.5         | `text-sm leading-normal`                                                   | 보조 설명, 캡션   |
| Micro | 12px                  | 500  | 1.4         | `text-xs leading-[1.4] font-medium`                                        | 배지, 타임스탬프  |
| Stat  | 24px / 28px           | 700  | 1.2         | `font-mono text-2xl md:text-[1.75rem] leading-[1.2] font-bold`             | 스트릭 일수, 통계 |

- letter-spacing은 기본 `0`, H1·H2만 `-0.01em`로 좁힌다.
- Body/Small/Micro는 반응형으로 줄이지 않는다. 서평 본문은 `md:text-sm`으로 축소 금지 — 가독성이 ①의 원칙이다.

---

## ④ Component Stylings

### Radius 스케일

`--radius: 0.5rem`(8px)에서 파생된다. `rounded-lg`가 버튼 8px, `rounded-xl`(11.2px)이 카드 12px에 대응한다.

- `rounded-lg` 8px — 버튼 · 인풋 · 텍스트영역
- `rounded-xl` ≈12px — 카드 · 노트/서평 카드 / `rounded-2xl` ≈16px — 모달
- `rounded-[4px]` — 체크박스 · 책 표지 썸네일 / `rounded-full` — 배지 · 아바타 · 토글

### 구현된 컴포넌트

**Button** — `variant` × `size` 조합. 기본 padding `10px 20px`, Body 16px, `rounded-lg`. 모바일 터치 타깃 44×44px은 이 padding에서 충족된다.

| variant       | 기본                                         | hover               |
| ------------- | -------------------------------------------- | ------------------- |
| `default`     | `bg-primary text-primary-foreground`         | `bg-primary-hover`  |
| `outline`     | 투명 배경 + `border-primary text-primary`    | `bg-accent`         |
| `secondary`   | `bg-secondary text-secondary-foreground`     | `bg-primary-hover`  |
| `ghost`       | `text-primary`, 배경 없음                    | `bg-accent`         |
| `destructive` | `bg-destructive` — **삭제·파괴적 액션 전용** | `bg-destructive/85` |
| `link`        | `text-primary`, 밑줄 오프셋 4px              | `underline`         |

- size: `default`(px-5 py-2.5) · `sm`(px-4 py-2 text-sm) · `lg`(px-6 py-3) · `icon`(44×44) · `icon-sm`(36×36)
- Focus: `ring-2 ring-ring` + `ring-offset-2`
- Disabled: `bg-disabled text-muted-foreground cursor-not-allowed` (opacity로 죽이지 않는다)
- Active: `translate-y-px`

**Input / Textarea** — padding `10px 12px`, Body 16px, `rounded-lg`, `border-input`.

- Focus: `border-ring` + `ring-3 ring-ring/20` — 버튼의 2px 아웃라인과 **다르다**(규정이 서로 달라 일부러 다르게 뒀다)
- Error: `aria-invalid`로 `border-destructive` + `ring-3 ring-destructive/20`, 하단에 `FieldError`(Small, `text-destructive`)
- Disabled: `bg-disabled text-muted-foreground` / Textarea는 `field-sizing-content` + `min-h-16`

| 컴포넌트    | 규격                                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FormInput` | Label + Input + FieldError 조합. `id` 필수(라벨 연결 + `aria-describedby`). 아이콘 16px, 좌/우 배치. `onIconClick`을 주면 버튼으로 렌더링되고 `iconLabel`이 강제된다            |
| `Checkbox`  | 16×16px, `rounded-[4px]`, `border-input`. 체크 시 `bg-primary` + 14px 체크 아이콘. 터치 여유는 `after:-inset-x-3 after:-inset-y-2`                                              |
| `Switch`    | 트랙 32×18.4px (`sm` 24×14px), `rounded-full`. off `bg-input` / on `bg-primary`. knob은 `bg-background` 원(16px, `sm` 12px)                                                     |
| `Avatar`    | `sm` 24 · `default` 32 · `lg` 40px, `rounded-full`. 이미지 없으면 `bg-muted` 위 이니셜(Small, `text-muted-foreground`). `AvatarGroup`은 `-space-x-2` + `ring-2 ring-background` |
| `Label`     | Small 14px `font-medium leading-none`                                                                                                                                           |
| `Separator` | `bg-border`, 1px                                                                                                                                                                |
| `Skeleton`  | `bg-muted animate-pulse` (주기 1.5s)                                                                                                                                            |
| `Tooltip`   | `z-50`(= z-tooltip), 반전 배경 `bg-foreground` + 화살표                                                                                                                         |

**ActivityCalendar** — 월 단위 활동 캘린더. 카드 껍데기는 `bg-card` + `rounded-xl` + `shadow-elevation-1` + `p-4 md:p-6`, 헤더 제목은 H2, 월 이동은 `size="icon"` 버튼 + 20px Chevron, 그리드는 `grid-cols-7 gap-1`에 요일 헤더 Micro + `text-muted-foreground`.

- **지면**: 라이트에서 `bg-background`(흰색), 다크에서 `bg-card`. `bg-card`(`#E3F2FD`)는 흰 바탕 위 primary 약 14%와 같은 색이라 잔디 램프(1단계 = 25%) 안쪽에 들어와, 빈 날이 '조금 기록한 날'처럼 보인다. 다크는 지면이 램프의 최저점이라 그 혼동이 없고 ⑥의 계층 규칙도 서피스를 요구하므로 `bg-card`를 유지한다. 카드 경계는 `border-border` + `shadow-elevation-1`이 맡는다. **차트·히트맵을 담는 서피스는 모두 이 규칙을 따른다** — 인코딩에 쓰는 색과 지면 색이 같은 계열이면 지면이 값처럼 읽힌다.
- 날짜 숫자는 셀 좌측 상단(`top-1 left-1`, Micro 스케일)에 고정한다. 셀 콘텐츠가 달라도 날짜 위치가 같아야 한 달을 훑을 수 있다.
- 날짜 셀의 겉 `<button>`은 포커스 링만 갖는다. **배경·비율·날짜 숫자는 `DayComponent`가 소유한다** — 잔디처럼 셀을 가득 칠하거나 책 표지로 채우려면 겉껍데기가 시각적 결정을 하면 안 된다.
- **잔디(활동량 음영)**: `bg-muted` → `bg-primary/25` → `/50` → `/75` → `bg-primary` 5단계. `/75`부터 텍스트는 `text-primary-foreground`. Success를 쓰지 않는 이유는 ⑦(상태색은 상태 표시 전용)이다. 색만으로 정보를 주지 않도록 기록 개수를 `aria-label`에 싣는다.
- **점(`ActivityDotDay`)**: 같은 개수를 `bg-primary` 점 개수로 인코딩한다(`size-1.5`, `gap-1`, 최대 3개). 셀을 칠하지 않아 지면 충돌이 없고 날짜 숫자에 반전이 필요 없다. 선택 표시는 채우기가 아니라 `ring-2 ring-ring` — `bg-primary`로 채우면 같은 색인 점이 사라진다. **"어느 주가 빽빽했나"를 스캔하려면 잔디, "이 날 몇 건인가"를 세려면 점**을 쓴다.
- **주말**: `text-muted-foreground`로 물러난다. 일요일 빨강 같은 한국 달력 관행은 상태색을 장식에 쓰는 것이라, 채택하려면 카카오 버튼처럼 별도 예외 조항이 필요하다.

**예외 — 카카오 로그인 버튼**: ⑦의 "버튼은 블루 계열만" 규칙에서 유일하게 면제된다. 카카오 개발자 가이드가 배경 `#FEE500` · 텍스트 `rgba(0,0,0,.85)`를 요구하는 **서드파티 브랜드 규정**이기 때문이다. 이 예외를 다른 소셜 버튼으로 확장할 때도 같은 근거(공식 브랜드 가이드)가 있어야 한다.

### 신규 컴포넌트 파생 규칙

아직 없는 컴포넌트(Card, Badge, Toast, Modal, Progress, Heatmap, Feed Item 등)를 만들 때는 새 값을 발명하지 말고 아래에서 조합한다.

1. **배경** — 얹히는 서피스 `bg-card`, 물러나는 구획 `bg-muted`, 오버레이 본체 `bg-background`
2. **테두리·반경** — `border border-border` + 위 Radius 스케일
3. **그림자** — `shadow-elevation-{1..4}` 중 **하나만**: 카드 1 / 드롭다운·hover 2 / 팝오버·툴팁 3 / 모달 4
4. **텍스트** — 제목 `text-title`, 본문 `text-foreground`, 메타 `text-muted-foreground`
5. **강조** — 상태 표시만 Success/Warning/Danger, 나머지는 전부 `primary` 계열
6. **패딩·z-index** — ⑤ 표의 값만. 카드 내부는 `p-4 md:p-6`
7. 라이트/다크 두 테마 대비를 확인한 뒤 커밋한다

---

## ⑤ Layout Principles

**Base unit 4px.** 모든 spacing은 4의 배수.

| 토큰        | 값   | Tailwind      | 용도                                     |
| ----------- | ---- | ------------- | ---------------------------------------- |
| `space-xs`  | 4px  | `gap-1` `p-1` | 아이콘–텍스트 간격                       |
| `space-sm`  | 8px  | `gap-2` `p-2` | 인풋 내부 여백, 배지 padding             |
| `space-md`  | 16px | `gap-4` `p-4` | 카드 내부 padding(모바일), 컴포넌트 간격 |
| `space-lg`  | 24px | `gap-6` `p-6` | 섹션 padding(데스크톱), 카드 간 간격     |
| `space-xl`  | 40px | `gap-10`      | 섹션과 섹션 사이                         |
| `space-2xl` | 64px | `gap-16`      | 페이지 상단 여백, 큰 구획 분리           |

- **컨테이너**: 최대 `1200px` 센터 정렬, 좌우 padding `16~24px`. 인증 화면처럼 좁은 폼은 `max-w-sm`.
- **그리드**: 12-column, gutter `24px`(데스크톱) / `16px`(모바일).
- **앱 셸**: `(main)`은 `h-dvh` 안에서 헤더·main·바텀네비가 높이를 나눠 갖도록 설계됐다(현재 `main`만 구현). main이 확정된 높이를 가지므로 내부 스크롤 화면은 `h-full`/`flex-1`만으로 동작한다 — 별도 높이 계산을 넣지 않는다.
- **Safe area**: 바텀 탭바·상단 고정 토스트는 `env(safe-area-inset-*)`를 padding에 반영한다.

z-index는 아래 6단계만 쓴다. 코드에서는 Tailwind `z-0`~`z-50`이 그대로 대응한다.

| Z-index      | 값  | 용도                 |
| ------------ | --- | -------------------- |
| `z-base`     | 0   | 기본 콘텐츠          |
| `z-sticky`   | 10  | 바텀 탭바, 고정 헤더 |
| `z-dropdown` | 20  | 드롭다운, 팝오버     |
| `z-toast`    | 30  | 토스트/스낵바        |
| `z-modal`    | 40  | 모달 오버레이·본체   |
| `z-tooltip`  | 50  | 툴팁 (항상 최상단)   |

### Motion

- **기본 트랜지션** `150ms ease` — hover, focus, active
- **진입/퇴장** `200ms ease-out` — 모달, 토스트, 드롭다운 (opacity + scale 0.96→1)
- **skeleton 펄스** `1.5s ease-in-out infinite`
- `prefers-reduced-motion: reduce`에서는 트랜지션 없이 즉시 전환

---

## ⑥ Depth & Elevation

그림자는 **항상 하나만** 적용한다. 중첩 금지.

| 레벨 | 클래스               | 용도                   | Light                          | Dark                          |
| ---- | -------------------- | ---------------------- | ------------------------------ | ----------------------------- |
| 0    | (없음)               | 페이지 배경, flat 요소 | none                           | none                          |
| 1    | `shadow-elevation-1` | 카드, 리스트 아이템    | `0 1px 2px rgba(0,0,0,0.06)`   | `0 1px 2px rgba(0,0,0,0.4)`   |
| 2    | `shadow-elevation-2` | 호버된 카드, 드롭다운  | `0 4px 8px rgba(0,0,0,0.10)`   | `0 4px 8px rgba(0,0,0,0.5)`   |
| 3    | `shadow-elevation-3` | 팝오버, 툴팁           | `0 8px 16px rgba(0,0,0,0.14)`  | `0 8px 16px rgba(0,0,0,0.55)` |
| 4    | `shadow-elevation-4` | 모달, 다이얼로그       | `0 16px 32px rgba(0,0,0,0.18)` | `0 16px 32px rgba(0,0,0,0.6)` |

다크모드에서는 그림자만으로 계층이 드러나지 않는다. `bg-background`(`#121418`) 위에 `bg-card`(`#1E232B`)를 얹어 **서피스 자체를 한 단계 밝혀** 계층을 만들고, 그림자는 보조로만 쓴다.

---

## ⑦ Do's and Don'ts

**Do**

- 색상은 항상 시맨틱 클래스(`bg-primary`, `text-title`)로 참조한다. HEX는 `globals.css`에만 존재한다.
- Success/Warning/Danger는 아이콘이나 텍스트 라벨과 **함께** 쓴다 (색맹 접근성).
- 스트릭·목표 같은 핵심 지표는 `font-mono` + Stat 스케일로 통일한다.
- 새 CSS 변수를 `:root`에 추가하면 `.dark`에도 **같은 커밋에서** 추가한다.
- 아이콘은 Lucide만, stroke-width 2px, 16px(인라인) / 20px(버튼·인풋) / 24px(내비게이션). 색은 `text-muted-foreground` · `text-primary` · 상태색 중에서만.

**Don't**

- 그라데이션 배경 금지. 팔레트는 단색 톤으로만 구성한다.
- 그림자 2개 이상 겹치기 금지 (⑥ 표에서 하나만).
- `bg-primary` 위에 `text-primary-foreground`가 아닌 텍스트 색 금지 (다크에서 대비가 무너진다).
- Success/Warning/Danger를 Primary 버튼·내비게이션 활성·배경 장식에 쓰지 않는다. "저장" 버튼은 초록색이 아니라 `bg-primary`이고, 완료 확인 **배지**만 Success다.
- 배지에 새 색 추가 금지 — `bg-secondary` 또는 상태색 셋 중에서만 고른다.
- disabled를 `opacity-50`으로 처리하지 않는다 — `bg-disabled text-muted-foreground`가 규정이다.
- `shadcn add <component>`로 재설치하면 Button/Input/Textarea의 커스터마이징이 **덮어써진다.** 재설치 후에는 각 파일 상단 주석의 항목을 다시 적용한다.

---

## ⑧ Responsive Behavior

Tailwind 기본 브레이크포인트를 그대로 쓴다 — `sm` 640(큰 모바일) · `md` 768(태블릿) · `lg` 1024(데스크톱) · `xl` 1280px(와이드).

- **터치 타깃 최소 44×44px** — 아이콘 버튼은 `size="icon"`(`size-11`)을 쓴다.
- **축소 전략**
  - `< md`: 사이드바 대신 바텀 탭 내비게이션, 카드 1열 스택
  - `md ~ lg`: 카드 2열 그리드, 사이드바는 아이콘만(collapsed)
  - `>= lg`: 사이드바 전체 노출(라벨 포함), 카드 3열, 컨테이너 1200px 센터 정렬
- **타이포그래피**: H1·H2·Stat만 `md` 미만에서 한 단계 축소(③ 표의 클래스에 이미 반영). Body/Small/Micro는 고정.

---

## ⑨ Agent Prompt Guide

### 빠른 참조

```
bg-background · bg-card · bg-muted          text-title · text-foreground · text-muted-foreground
bg-primary → hover:bg-primary-hover         disabled:bg-disabled  (opacity 금지)
border-border · focus:border-ring+ring-3    text-success/warning/destructive (상태 전용)
shadow-elevation-1~4 (하나만)               rounded-lg 버튼 / -xl 카드 / -full 배지
간격 1·2·4·6·10·16 (4·8·16·24·40·64px)      font-sans 본문 / font-mono 통계
```

### 예시 프롬프트

1. "DESIGN.md 기준으로 오늘의 목표와 연속 기록을 보여주는 대시보드 카드를 만들어줘. ④의 신규 컴포넌트 파생 규칙을 따르고, 스트릭 숫자는 Stat 스케일로."
2. "DESIGN.md의 Input·Button 규정 그대로 독서 기록 입력 폼을 만들어줘. `FormInput`을 쓰고 에러 상태까지 포함해줘."
3. "DESIGN.md ⑥의 elevation 4단계와 ⑤의 z-modal을 써서 삭제 확인 다이얼로그를 만들어줘. 파괴적 액션이니 버튼은 `destructive` variant로."

### 유지 원칙

- 이 문서와 `globals.css`는 한 커밋에서 함께 바뀐다. 문서만 고치거나 코드만 고치지 않는다.
- 컴포넌트를 새로 만들면서 ④에 없는 규격을 정했다면, 그 규격을 여기 추가한 뒤 커밋한다.
- `AGENTS.md`(행동·코딩 규칙)와 역할이 다르다. 이 문서는 오직 시각적 외형만 담당한다.
