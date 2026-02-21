# FluentMind

FluentMind is a Next.js 14 web app for intermediate Chinese learners to improve American English through output-driven learning.

## 1) Project folder structure

```text
fluentmind/
├── app/
│   ├── (auth)/signin/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── writing/correct/route.ts
│   │   ├── conversation/start/route.ts
│   │   ├── conversation/message/route.ts
│   │   ├── errors/route.ts
│   │   ├── challenge/daily/route.ts
│   │   ├── challenge/submit/route.ts
│   │   └── dashboard/route.ts
│   ├── challenge/page.tsx
│   ├── conversation/page.tsx
│   ├── dashboard/page.tsx
│   ├── errors/page.tsx
│   ├── writing/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/layout/navigation.tsx
├── lib/
│   ├── ai/openai.ts
│   ├── services/
│   ├── validators/
│   ├── api-response.ts
│   ├── auth.ts
│   ├── current-user.ts
│   └── prisma.ts
├── prisma/schema.prisma
├── types/next-auth.d.ts
├── .env.example
└── package.json
```

## 2) Prisma schema

The Prisma schema supports:
- NextAuth models (`User`, `Account`, `Session`, `VerificationToken`)
- Role-based conversation sessions/messages
- Personal recurring error tracking with categories
- Daily writing prompts and challenge submissions with AI scores

See `prisma/schema.prisma` for full model definitions.

## 3) API routes

- `POST /api/writing/correct`
  - Validates text input with Zod.
  - Returns grammar fixes, explanations, natural rewrite, and advanced rewrite.
  - Falls back to local mock output when `OPENAI_API_KEY` is not set.

- `POST /api/conversation/start`
  - Creates a conversation session for current authenticated user.

- `POST /api/conversation/message`
  - Ownership checks session belongs to current user.
  - Stores user/assistant messages in DB.

- `GET /api/errors`
  - Returns current user's recurring mistakes.

- `POST /api/errors`
  - Upserts recurring mistake by `category + pattern`.

- `GET /api/challenge/daily`
  - Fetches today's prompt using date range query (`[startOfDay, nextDay)`).

- `POST /api/challenge/submit`
  - Validates input, checks prompt exists, AI-scores response, stores submission.

- `GET /api/dashboard`
  - Returns current user's submission count, average scores, and top recurring errors.

- `GET/POST /api/auth/[...nextauth]`
  - NextAuth entrypoint.

## 4) Frontend pages

- `/` Product overview
- `/writing` Writing correction submission and structured result view
- `/conversation` Role + difficulty simulation UI
- `/errors` Recurring error table
- `/challenge` Daily prompt + scoring view
- `/dashboard` Progress analytics
- `/signin` Auth placeholder page

All pages now handle API error states and no longer hardcode `userId` in client requests.

## 5) Setup guide

1. Install dependencies

```bash
npm install
```

2. Configure env

```bash
cp .env.example .env
```

3. Start PostgreSQL and create DB.

4. Generate Prisma client

```bash
npm run prisma:generate
```

5. Run migrations

```bash
npm run prisma:migrate -- --name init
```

6. (Optional) Seed one daily prompt in DB so `/challenge` has data.

7. Start app

```bash
npm run dev
```

8. Open http://localhost:3000

### Local test mode (no OpenAI key, no full auth setup)

For local-first testing, keep these env values:

```env
OPENAI_API_KEY=""
ENABLE_DEV_AUTH_BYPASS="true"
DEV_BYPASS_USER_ID="demo-user-id"
```

This enables:
- Mock AI responses in writing/conversation/challenge scoring
- Server-side dev auth bypass user for protected API routes

In production, set `ENABLE_DEV_AUTH_BYPASS="false"` and configure real NextAuth sign-in.
