<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 프로젝트 개요

Book Habit — **독서 기록·스트릭 관리 + 목표/통계 + 서평·노트 + 소셜/공유**를 아우르는 독서 습관 웹 앱.
타깃은 가벼운 독서 입문자부터 다독가까지 범용 사용자층.

스택: Next.js 16 (App Router) / React 19 / Tailwind CSS 4 / TypeScript. 패키지 매니저는 npm.
BE는 이 저장소에 없다 — 별도 NestJS 서버이며 API 명세는 `http://localhost:3000/api-json`(Swagger)에서 확인한다.

@docs/architecture.md
@DESIGN.md
