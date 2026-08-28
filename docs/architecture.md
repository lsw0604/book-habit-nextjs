# 프로젝트 아키텍처 규칙: 클린 FSD (Clean FSD)

이 프로젝트는 Feature-Sliced Design(FSD)을 기반으로 하되, Features/Entities 경계를
CQRS(쓰기/읽기 분리) 원칙으로 명확히 고정한 **클린 FSD**를 따른다.
코드를 생성·수정할 때 아래 규칙을 최우선으로 지킨다.

---

## 1. 절대 규칙 (Golden Rules)

1. **Features/Entities 배치는 아래 순서대로 판정한다** (위에서 걸리면 즉시 확정, 더 내려가지 않는다):
   1) `POST` `PUT` `PATCH` `DELETE` → `features`.
   2) `GET`이지만 필수 파라미터가 **자유 텍스트 검색어**(구조화되지 않은 입력)인 경우 → `features`.
      조회 함수·입력 UI를 전부 feature가 소유한다.
   3) 그 외 모든 `GET`(식별자 단건 조회, 구조화된 필터/정렬/페이지네이션 목록) → `entities`.
2. **상위 레이어 → 하위 레이어 단방향 참조만 허용.** 하위 레이어는 상위 레이어를
   import 할 수 없다.
3. **같은 레이어 내 다른 슬라이스 간 참조 금지.** 공유 로직이 필요하면
   `entities` 또는 `shared`로 하향 이관(demote)한다. 절대 옆 슬라이스를 직접 import하지 않는다.
   - **queryKey 교차 무효화**도 동일하게 적용한다: 한 feature의 뮤테이션이 다른 feature가
     소유한 조회 결과를 무효화해야 한다면, 그 **queryKey 팩토리**를 `entities`(또는 `shared`)로
     하향 이관해 양쪽이 그곳에서 import한다. feature가 다른 feature의 queryKey를 직접
     참조하지 않는다. (예: 태그 조회는 규칙 1-3)에 따라 `entities/tag`가 조회 함수와
     queryKey 팩토리를 소유하고, `features/my-book-tag-manage`가 태그 생성 후
     그곳을 통해 무효화한다.)
   - 검색류 feature가 공유하는 디바운스/URL 동기화 로직은 `shared/lib/use-debounced-query`로
     미리 승인한다 (신규 검색 feature마다 재구현하거나 서로 참조하지 않는다).
4. **폴더 구조를 임의로 새로 만들지 않는다.** 기존 레이어/세그먼트 규칙 안에서만 배치하고,
   애매하면 아래 판정 표(3장)를 따른다.

---

## 2. 레이어 구조 (위 → 아래 순, 참조는 항상 아래로만)

```
app/       Next.js 라우팅 전용 (얇게 유지, views 슬라이스를 렌더링만)
views/     화면 단위 조합 (완성형 페이지) — FSD의 "pages" 레이어
widgets/   여러 features/entities를 조립한 상위 블록 (헤더, 대시보드 카드 등)
features/  유저 인터랙션 · 상태 변경(쓰기) + 자유 텍스트 검색류 조회
entities/  비즈니스 도메인 데이터 · 식별자 기반/구조화 조회
shared/    도메인 비종속 공통 유틸/버튼/훅
```

각 슬라이스(도메인) 내부 세그먼트 (**모두 선택적** — 필요한 것만 만들고 빈 폴더를 미리 만들지 않는다):
- `ui/` — 컴포넌트
- `model/` — 타입, 스키마, 상태/훅 로직, queryKey 팩토리
- `api/` — 서버 통신, 쿼리/뮤테이션 훅
- `lib/` — 해당 도메인 전용 유틸

---

## 3. Features vs Entities 판정 표

| 구분 | `entities` | `features` |
|---|---|---|
| API 메소드 | `GET` (식별자/구조화 조회) | `POST` `PUT` `PATCH` `DELETE`, 또는 자유 텍스트 검색 `GET` |
| UI 형태 | 인터랙션 없는 카드/리스트/상세 뷰 | 폼, 입력창, 체크박스, 제출 버튼, 검색창 |
| TanStack Query | `useQuery` + queryKey 팩토리 정의 | `useMutation` (entities의 queryKey를 invalidate) |

**워크드 예제 (1장 판정 절차를 그대로 적용):**
```
GET  /books?query=            자유 텍스트 검색   → features/search-book/api/search-books.ts (+ui, +queryKey)
GET  /books/detail/{isbn}     식별자(isbn) 조회  → entities/book/api/get-book.ts, entities/book/ui/book-card.tsx
POST /my-book                 쓰기(대조군)       → features/my-book-create/api/create-my-book.ts
```
`features/search-book`이 검색 결과를 렌더링할 때는 `entities/book/ui/book-card.tsx`를 하향 참조해 재사용한다.

> 명세의 54개 오퍼레이션에 이 절차를 적용한 결과는 `docs/api-mapping.md`에 있다.
> 규칙이 원본이고 그 표는 파생물이므로, 어긋나면 규칙이 이긴다.

> 여러 entity를 조합하는 복합 조회(예: 대시보드)는 특정 entity에 억지로 넣지 말고
> `widgets` 또는 `views`에 둔다.

> **데이터 페칭 정책** — Server Actions 미사용(BE가 NestJS로 API 계약을 소유하므로 서버 계층이 이중이 된다), RSC 직접 조회는 `views/public-feed` 한정(링크 공유 시 OG 미리보기가 필요한 유일한 화면), 그 외는 TanStack Query.

> ⚠️ **FSD의 `pages` 레이어를 `src/pages/`로 만들지 않는다.** Next.js는 `src/pages`를 Pages Router 디렉토리로 인식해서(`src-folder.md`), 그 안의 모든 `.tsx`를 라우트로 취급한다. default export가 없으면 `next build`가 타입 체크에서 **실패한다**(실측 확인: `Property 'default' is missing ... required in type 'PagesPageConfig'`). 그래서 이 레이어는 `src/views/`로 쓴다.

---

## 4. 작업 지시 시 참고할 경로 지정 스타일

파일을 생성/수정할 때는 반드시 아래처럼 **레이어와 절대 경로를 명시**해서 작업한다.

```
예) 장바구니 담기 기능
1. 쓰기 → features/cart/ui/add-form.tsx
         features/cart/api/add-to-cart.ts   (mutation)
2. 조회 → entities/cart/ui/cart-list.tsx
         entities/cart/api/get-cart.ts      (조회)
3. 동일 레이어 슬라이스 간 참조 금지, 위 경로 밖으로 파일 생성 금지.
```

---

## 5. 이 문서 유지 원칙

- 이 파일은 200줄 이내로 유지한다. 규칙이 길어지면 AI가 준수율이 떨어진다.
- 새로운 아키텍처 마찰/예외가 발견되면 이 문서에 규칙을 추가하며 갱신한다
  (예: "규칙 7: 파일 업로드는 features/upload로 통일").
