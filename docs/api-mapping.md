# BE 엔드포인트 → FSD 슬라이스 매핑

`architecture.md`의 판정 절차를 명세(`http://localhost:3000/api-json`)의
**54개 오퍼레이션**에 기계적으로 적용한 결과다. 규칙이 원본이고 이 표는 파생물이므로,
둘이 어긋나면 규칙이 이긴다.

**판정 규칙** (위에서 걸리면 확정)
1. `POST` `PUT` `PATCH` `DELETE` → `features`
2. `GET`인데 **필수** 파라미터가 자유 텍스트 검색어 → `features`
3. 그 외 모든 `GET` → `entities`

결과: features 30 / entities 23 (+ 카카오 OAuth 2개는 판정 대상이 아님 — 아래 예외 참조).

---

## Auth

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| POST | `/api/auth/signup` | 1 | `features/auth-signup` |
| POST | `/api/auth/login` | 1 | `features/auth-login` |
| GET | `/api/auth/kakao` | — | `features/login`(아래 예외 참조) |
| GET | `/api/auth/kakao/callback` | — | FE에서 호출하지 않음(아래 예외 참조) |
| POST | `/api/auth/logout` | 1 | `features/auth-logout` |
| POST | `/api/auth/refresh` | 1 | **`shared/api`** (아래 예외 참조) |
| GET | `/api/auth/me` | 3 | `entities/user` |

## User

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/user` | 3 | `entities/user` |
| GET | `/api/user/{id}` | 3 | `entities/user` |
| POST | `/api/user` | 1 | `features/user-create` — ⚠️ 아래 미결 참조 |
| PATCH | `/api/user/{id}` | 1 | `features/user-profile-update` |
| DELETE | `/api/user/{id}` | 1 | `features/user-delete` |

## Book

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/books?query=` | **2** | `features/search-book` — `query` 필수, 자유 텍스트 |
| GET | `/api/books/detail/{isbn}` | 3 | `entities/book` |

## MyBook

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/my-book` | 3 | `entities/my-book` — status·minRating·hasReview 필터 |
| GET | `/api/my-book/{id}` | 3 | `entities/my-book` |
| POST | `/api/my-book` | 1 | `features/my-book-create` |
| PATCH | `/api/my-book/{id}` | 1 | `features/my-book-update` — 상태 전환·평점·진행 페이지 |
| DELETE | `/api/my-book/{id}` | 1 | `features/my-book-delete` |

## ReadingLog

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/reading-log` | 3 | `entities/reading-log` |
| GET | `/api/reading-log/{id}` | 3 | `entities/reading-log` |
| POST | `/api/reading-log` | 1 | `features/reading-log-create` |
| PATCH | `/api/reading-log/{id}` | 1 | `features/reading-log-update` |
| DELETE | `/api/reading-log/{id}` | 1 | `features/reading-log-delete` |

## MyBookReview

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/my-book-review` | 3 | `entities/my-book-review` |
| GET | `/api/my-book-review/liked` | 3 | `entities/my-book-review` |
| GET | `/api/my-book-review/commented` | 3 | `entities/my-book-review` |
| GET | `/api/my-book-review/{id}` | 3 | `entities/my-book-review` |
| POST | `/api/my-book-review` | 1 | `features/review-create` |
| PATCH | `/api/my-book-review/{id}` | 1 | `features/review-update` |
| DELETE | `/api/my-book-review/{id}` | 1 | `features/review-delete` |

## ReviewLike

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| POST | `/api/review-like` | 1 | `features/review-like-toggle` |
| DELETE | `/api/review-like?myBookReviewId=` | 1 | `features/review-like-toggle` |

## ReviewComment

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/review-comment?myBookReviewId=` | 3 | `entities/review-comment` — 식별자 필터라 규칙 2 아님 |
| GET | `/api/review-comment/{id}` | 3 | `entities/review-comment` |
| POST | `/api/review-comment` | 1 | `features/review-comment-create` |
| PATCH | `/api/review-comment/{id}` | 1 | `features/review-comment-update` |
| DELETE | `/api/review-comment/{id}` | 1 | `features/review-comment-delete` |

## PublicReview

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/public-review` | 3 | `entities/public-review` — 비로그인 조회 가능 |
| GET | `/api/public-review/{id}` | 3 | `entities/public-review` |

## Tag / MyBookTag

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/tag?query=` | 3 | `entities/tag` — `query`가 **선택**이라 규칙 2 아님 |
| GET | `/api/my-book-tag?myBookId=` | 3 | `entities/my-book-tag` |
| POST | `/api/my-book-tag` | 1 | `features/my-book-tag-manage` |
| DELETE | `/api/my-book-tag/{id}` | 1 | `features/my-book-tag-manage` |

## Quote

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/quote?readingLogId=` | 3 | `entities/quote` |
| GET | `/api/quote/{id}` | 3 | `entities/quote` |
| POST | `/api/quote` | 1 | `features/quote-create` |
| PATCH | `/api/quote/{id}` | 1 | `features/quote-update` |
| DELETE | `/api/quote/{id}` | 1 | `features/quote-delete` |

## ReadingGoal

| 메소드 | 경로 | 규칙 | 위치 |
|---|---|---|---|
| GET | `/api/reading-goal?year=&month=` | 3 | `entities/reading-goal` |
| GET | `/api/reading-goal/{id}` | 3 | `entities/reading-goal` |
| POST | `/api/reading-goal` | 1 | `features/reading-goal-create` |
| PATCH | `/api/reading-goal/{id}` | 1 | `features/reading-goal-update` |
| DELETE | `/api/reading-goal/{id}` | 1 | `features/reading-goal-delete` |

## Health

`GET /api/health` — 모니터링용이라 FE에서 호출하지 않는다.

---

## 예외와 판단이 필요한 지점

**`GET /api/auth/kakao`·`GET /api/auth/kakao/callback`는 API 클라이언트로 호출하지 않는다.**
백엔드가 인가 URL 빌드·state 쿠키 발급·code 교환·세션 쿠키 발급을 전부 소유하고
브라우저 302 리다이렉트로 왕복한다. FE는 `/api/auth/kakao`로 향하는 `<a>` 링크
하나만 `features/login/ui/kakao-login-button.tsx`에 둔다 — `axios`/TanStack Query를
거치지 않는 순수 네비게이션이라 `api/`·`model/` 세그먼트가 필요 없고, 판정 규칙(1~3)도
애초에 적용 대상이 아니다. 콜백 경로는 카카오→백엔드 간에만 오가고 FE 코드가 직접
참조하지 않는다.

**`POST /api/auth/refresh`는 `shared/api`에 있다.** 규칙 1대로면 feature지만, 401을 받은
인터셉터가 스스로 호출해야 하고 `shared`는 `features`를 import할 수 없다. 인프라 계층의
자기 완결적 동작으로 본다. 이 예외는 여기 하나뿐이다.

**`entities/auth`를 만들지 않는다.** `GET /auth/me`가 반환하는 것은
`AuthUserResponseDto = { user: UserResponseDto }`로 결국 유저 도메인 데이터고,
`GET /user`·`GET /user/{id}`와 같은 타입을 공유한다. `entities/auth`와 `entities/user`가
따로 생기면 `UserResponseDto`가 어디 사는지 애매해진다. "auth"는 데이터가 아니라
행위이므로 features 쪽 이름으로만 쓴다.

**`/api/tag`는 검색이 아니라 목록이다.** `query` 없이 호출하면 전체 태그를 반환하는 것을
실제 응답으로 확인했다. 자유 텍스트 자동완성 UI는 그것을 쓰는 feature가 소유하고
(`features/my-book-tag-manage` 등), 조회 함수와 queryKey는 `entities/tag`에 둔다.
queryKey가 entities에 있어야 태그 생성 후 교차 무효화가 규칙 3을 어기지 않는다.

**슬라이스 분할 기준은 HTTP 메소드가 아니라 사용자 시나리오다.** 하나의 UI가 생성과
삭제를 겸하면 한 슬라이스로 묶는다(`review-like-toggle`, `my-book-tag-manage`).
화면이나 동작이 나뉘면 슬라이스도 나눈다(`my-book-create` / `-update` / `-delete`).

**⚠️ 미결: `POST /api/user`와 `POST /api/auth/signup`의 관계.** 둘 다 유저를 만드는
것으로 보이는데 용도 차이가 명세에 드러나지 않는다. BE에서 확인한 뒤
`features/user-create`가 실제로 필요한지 정한다. FE에서 쓰지 않는다면 표에서 뺀다.

---

## 갱신 방법

BE 명세가 바뀌면 규칙을 다시 적용해 이 표를 갱신한다. 판정은 세 가지만 보면 된다 —
메소드, 그리고 `GET`이면 **필수** 파라미터가 자유 텍스트인지 식별자·구조화 필터인지.
`/api/books`(필수 `query`)와 `/api/tag`(선택 `query`)가 그 경계를 보여주는 대조군이다.
