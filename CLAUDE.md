@AGENTS.md

# Rekor Zeka (filtre-koc)

Turkish online exam-coaching platform (YKS / LGS / KPSS-AGS / DGS). Students buy a
coaching package, get matched with a coach, and use AI tools (exam-booklet analysis,
chat assistant, speed reading) while coaches and parents track progress.

Production: https://www.rekorzeka.com — deployed on Vercel.

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16.2.9, App Router, React 19.2 |
| Language | TypeScript (`strict: true`), path alias `@/*` → `./src/*` |
| Styling | Tailwind CSS v4 (PostCSS plugin, no `tailwind.config.js`) |
| Backend | Supabase (Postgres + Auth + Storage) via `@supabase/ssr` |
| AI | Google Gemini REST API (`src/lib/gemini.ts`) |
| Email | Brevo or Sender.net (`src/lib/email.ts`) |
| Icons | Ionicons 7 web components loaded from unpkg (`<ion-icon>`, typed in `src/types/ion-icon.d.ts`) + emoji |
| Meetings | Jitsi (`https://meet.jit.si/RekorZeka-<id>`) |

`resend` is in `package.json` but nothing imports it — email goes through Brevo/Sender.

## Commands

```bash
npm install
npm run dev      # next dev
npm run build    # next build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

There is **no test suite** and no CI workflow. `npm run build` + `npm run lint` are the
only automated checks; run both before pushing.

`node_modules/` is not committed, so `AGENTS.md`'s instruction to read
`node_modules/next/dist/docs/` only works after `npm install`. Do it when touching
framework-level APIs — this Next.js version differs from older training data.

## Next.js 16 specifics already in use

- **`src/proxy.ts`** is this version's middleware (default-exported `proxy` function +
  `config.matcher`). Do **not** add a `middleware.ts`. It refreshes the Supabase session
  on every request and pre-routes auth `?code=` / `?error_code=` params.
- `cookies()` from `next/headers` is **async** — always `await` it (see
  `src/lib/supabase/server.ts`).
- Dynamic route params are async: `{ params }: { params: Promise<{ id: string }> }`.
- Server Actions accept up to **25 MB** bodies (`next.config.ts`), needed for exam photo
  uploads. Individual Vercel request bodies still cap around 4.5 MB, which is why photo
  uploads are chunked (see AI analysis below).
- `export const maxDuration = 60` is set on the three long-running routes
  (`api/veli-raporu`, `ogrenci-paneli/ai-asistan`, `ogrenci-paneli/ai-analiz/yukle`).
  60 s is the Vercel Hobby ceiling — do not raise it.

## Architecture

### Supabase clients — the central convention

`src/lib/supabase/server.ts` exports two server-side clients, and **the difference
matters for security**:

- `createClient()` — cookie-bound, acts as the logged-in user. Use it to read
  `auth.getUser()` and to perform anything the user is themselves allowed to do.
- `createAdminClient()` — service-role key, **bypasses RLS entirely**. Most tables in
  this project have RLS disabled and are reached only through this client.

Because the admin client bypasses all row security, **every server action must
authorize by hand**:

1. `const { data: { user } } = await supabase.auth.getUser()` — from the *cookie* client.
2. Check the caller's role/ownership (`ADMIN_EMAILS`, an `approved` coach row, an active
   `purchases` link, `student_id === user.id`, …).
3. Only then touch data through `createAdminClient()`, and still scope the query
   (`.eq("student_id", user.id)`) as defence in depth.

Reference patterns: `getCoachForStudent()` in `src/app/koc-paneli/actions.ts` (coach ↔
student access via an active purchase) and the `ADMIN_EMAILS` guard repeated in every
export of `src/app/admin/actions.ts`. Never take an id from the client and trust it.

`src/lib/supabase/client.ts` exports `createClient()` for browser components.

### Roles and where they live

There is **no roles table**. Role is derived on every request:

| Role | Derivation |
| --- | --- |
| Admin | email in `ADMIN_EMAILS` (`src/lib/admins.ts`) |
| Coach | row in `coaches` with `user_id = user.id` and `status = 'approved'` |
| Student | active row in `purchases` (`status = 'active'`) |
| Parent (veli) | `veli_links.parent_email = user.email`, or signup metadata `grade === "Veli"` |

Student profile data (onboarding answers, `avatar_url`, `veli_takip_enabled`,
`onboarding_completed`) lives in **Supabase `user_metadata`**, not in a profiles table.

### Auth flow

```
/kayit, /giris, /koc-kayit, /koc-giris   forms → src/app/auth/actions.ts, koc-auth/actions.ts
        ↓ (email links / OAuth)
src/proxy.ts                             routes stray ?code= to /auth/callback, ?error_code= to /giris
        ↓
/auth/callback  (PKCE ?code=)            exchangeCodeForSession
/auth/confirm   (?token_hash&type=…)     verifyOtp — works from any browser/device;
                                         this is why mail templates use token_hash links
        ↓
src/app/auth/post-auth-redirect.ts       single source of truth for role-based landing
```

`postAuthRedirect` order: admin → coach (`approved` → `/koc-paneli`; `pending` → sign out
+ error; rejected → falls through, account is *not* locked) → `flow=koc` →
parent → onboarding → active purchase → `/koclar`. `signIn()` in `auth/actions.ts`
duplicates a simplified version of this; keep the two consistent when changing rules.
Password recovery short-circuits to `/sifre-sifirla` before any role routing.

### Route map (`src/app`)

Turkish URLs throughout. Marketing pages are public; panels self-guard in their
`layout.tsx` or `page.tsx`.

- **Public/marketing**: `/`, `/paketler`, `/nasil-calisir`, `/hakkimizda`, `/blog`
  (posts are hardcoded in `blog/posts.ts`), `/hizli-okuma` (landing), `/iletisim`,
  `/destek`, `/on-gorusme` (free intro-call request), legal pages (`/kvkk`,
  `/gizlilik`, `/mesafeli-satis-sozlesmesi`).
- **Auth**: `/giris`, `/kayit`, `/koc-giris`, `/koc-kayit`, `/koc-kayit/tamamla`,
  `/sifre-unuttum`, `/sifre-sifirla`, `/auth/*`.
- **Student funnel**: `/onboarding` → `/eslestirme` (matching) → `/satin-al` →
  `/randevularim`. The coach showcase is retired: `/koclar` now just
  `redirect("/on-gorusme")` (several older redirects still point at `/koclar` and land
  there), while individual `/koclar/[id]` profiles stay reachable for sharing.
- **Student panel** `/ogrenci-paneli/*` — layout redirects to `/giris` without a session
  and to `/paketler` without an active purchase. Sub-pages: `ai-asistan`, `ai-analiz`
  (+`/yukle`), `hizli-okuma`, `deneme`, `program`, `odevler`, `hedefler`, `mesajlar`.
  `/ogrenci/anasayfa` is the post-login home for paying students.
- **Coach panel** `/koc-paneli`, `/koc-paneli/ogrencilerim/[studentId]`.
- **Parent panel** `/veli-paneli` — read-only.
- **Admin** `/admin` (purchases, coach approvals), `/admin/talepler` (applications,
  document verification).
- **API**: `/api/veli-raporu` — the only route handler; weekly parent report cron.
- **SEO/PWA**: `sitemap.ts`, `robots.ts`, `manifest.ts`, `public/sw.js` (static assets
  cache-first, pages always network), `components/pwa/PwaSetup.tsx`.

### Database tables (no migrations directory)

Schema is managed by hand in the Supabase SQL editor. `supabase/seed.sql` is demo coach
data; `SQL-hizli-okuma.sql` is the one-off DDL for the reading tables and shows the house
pattern: `grant all … to anon, authenticated, service_role` + `disable row level
security`, access mediated by the service-role client in server code.

`coaches`, `purchases`, `appointments`, `exam_scans`, `homework`, `veli_links`,
`messages`, `deneme_results`, `study_schedule`, `goals`, `coach_reviews`, `ai_chats`,
`ai_messages`, `reading_sessions`, `reading_exercises`, `intro_requests`, `coach_notes`,
plus Storage buckets `avatars` (public) and `belgeler` (private ÖSYM result documents).

**When a change needs new columns or tables, ship a runnable `.sql` file at the repo root
in the style of `SQL-hizli-okuma.sql` and say in the PR that it must be run in the
Supabase SQL editor before the deploy** — nothing applies it automatically.

`purchases` is the hub row: it links student ↔ coach (`coach_id`), gates panel access
(`status = 'active'`), and its `plan`/`category` drive feature limits.

### Feature notes

**Matching** (`/eslestirme`): `calcScore()` ranks approved coaches against the student's
onboarding `user_metadata` (target university, exam type, capacity, rating, anxiety →
PDR bonus), capped at 99. After matching, `startCoaching()` writes `coach_id` onto the
active purchase — that link, not a browsable list, is how a student gets a coach.

**AI exam analysis** (`/ogrenci-paneli/ai-analiz`): three-step server actions —
`startExamScan` creates the `exam_scans` row, `analyzeScanBatch` sends photo batches to
Gemini (the client uploads in small groups and retries; batching exists because of the
Vercel body/duration limits and is deliberately conservative), `finalizeExamScan` turns
the accumulated `questions[]` into a paragraph plus a weekly program. Gemini is asked for
strict JSON and the response is salvaged with `extractJson()` before `JSON.parse`. Coaches
can push the suggested program into `study_schedule` with `applyAiProgram`.

**AI assistant** (`/ogrenci-paneli/ai-asistan`): daily quota by plan
(`ai-asistan/constants.ts`, `planAiLimit`). The Gemini call happens *before* any DB
write, with two attempts — if it fails, nothing is stored and the quota is not consumed.
Keep that ordering.

**Gemini** (`src/lib/gemini.ts`): tries `MODEL_CHAIN` in order, falling through on
404/429/500/503, under a 35 s self-imposed deadline (below the 60 s platform ceiling, so
a real error is returned rather than a generic platform timeout). Override the primary
model with `GEMINI_MODEL`.

**Speed reading**: passages in `hizli-okuma/passages.ts`, badges in `badges.ts`, entitlement
window in `src/lib/hizli-okuma-access.ts` (1 Aylık none / 3 Aylık 30 d / 6 Aylık 60 d /
Sınava Kadar unlimited; unknown plans default to *allowed* on purpose — never lock a
paying user out).

**Appointments**: student books (`bookAppointment`, max 3 free intro calls), coach
confirms in `/koc-paneli`; confirmation generates the Jitsi link and emails both parties.

**Parent tracking**: student opts in via `/profil` (`veli_takip_enabled` in metadata) and
adds up to 2 parent emails into `veli_links`. `vercel.json` runs `/api/veli-raporu` every
Monday 06:00 UTC; it is protected by `Authorization: Bearer $CRON_SECRET` (or `?secret=`)
and supports `?dry=1` for a no-send dry run.

**Sales are off**: `SALES_ACTIVE = false` in `src/lib/launch.ts` until PayTR is
integrated — every buy button routes to `/on-gorusme` and `/satin-al` redirects. Flip the
single flag to enable checkout. `savePurchase()` currently writes an `active` purchase
with no payment step.

## Conventions

- **Everything user-facing is Turkish** — UI copy, emails, error strings, and code
  comments. Match that; do not introduce English UI text or i18n scaffolding.
- **Server Components by default.** Add `"use client"` only for interactivity; the
  pattern is a server `page.tsx` that fetches and passes props to a colocated
  `*-client.tsx` / `*-form.tsx` / `*-modal.tsx`.
- **Colocation over shared folders.** Feature code lives next to its route; only
  genuinely cross-cutting UI is in `src/components/` (`layout/`, `auth/`, `pwa/`).
- A `"use server"` file may only export async functions. Constants used by an action go
  in a sibling file — that is why `ai-asistan/constants.ts`, `lib/koc-form.ts`, and
  `paketler/data.ts` exist. `src/app/*/actions.ts` (and `*-actions.ts` for narrower
  slices) is the naming convention.
- **Server actions return errors, they don't throw**: `{ error: string }` /
  `{ ok: true, … }`, or `redirect("/path?error=…")` for form posts. Failures in
  secondary concerns (email, avatar mirroring) are logged and swallowed so the main flow
  survives.
- After mutating, call `revalidatePath()` for **every** view that shows the data — coach
  and student pages both, e.g. `/koc-paneli/ogrencilerim/[id]` *and*
  `/ogrenci-paneli/program`.
- Tailwind utilities inline; brand colors are hardcoded hex in class names —
  navy `#123A57`, teal `#0E8FA3`, orange `#E2600F`, tint `#eef9f9`. `globals.css` remaps
  Tailwind's `blue-*` scale to the navy ramp, so `bg-blue-600` is brand navy.
- Emails are inline-styled HTML string templates built in the module that sends them
  (`lib/email.ts`, `koc-auth/actions.ts`, `api/veli-raporu/route.ts`). No template engine.
- Commit messages: `feat:` / `fix:` / `test:` prefix, Turkish, written without diacritics
  (e.g. `feat: koc paneli ogrenci notu eklendi`).

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL         # required
NEXT_PUBLIC_SUPABASE_ANON_KEY    # required
SUPABASE_SERVICE_ROLE_KEY        # required — server only, never expose
NEXT_PUBLIC_SITE_URL             # auth email redirect base (falls back to www.rekorzeka.com)
GEMINI_API_KEY                   # AI features
GEMINI_MODEL                     # optional primary model override
EMAIL_PROVIDER                   # "brevo" (default) | "sender"
EMAIL_SENDER                     # from-address; unset ⇒ emails silently skipped
BREVO_API_KEY / SENDER_API_KEY   # per provider
CRON_SECRET                      # guards /api/veli-raporu
```

`.env*` is gitignored. Missing email/AI keys degrade gracefully rather than crashing —
preserve that behaviour.

## Gotchas

- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `createAdminClient()` to client components.
- RLS is off on most tables — an unauthorized admin-client query is a real data leak, not
  a lint issue. Re-read the authorization section before writing a new server action.
- `src/app/layout.tsx` queries Supabase on every request (coach status, purchase count,
  unseen appointments) to render the navbar. Adding queries there costs every page.
- The 60 s / 4.5 MB Vercel limits shape the AI upload code; don't "simplify" the batching
  and retry logic away.
- Ionicons load from unpkg at runtime — offline or CSP-restricted environments show no
  icons.
