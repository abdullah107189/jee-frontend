## In sha allah we will build this project successfully.
# 🔐 Auth System — Deep Dive (No Code Edition)

A production-grade auth system for Next.js 16 + Express JWT.
Ei document ta **ken**, **kivabe**, **kothay** — sob concept bujhay.

---

## 🎯 Part 1: Big Picture — 3 ta Layer

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  LAYER 1: BROWSER                                            │
│  ─────────────────                                           │
│  • User er chokh                                             │
│  • httpOnly cookie rakhe                                    │
│  • JS token dekhte pare na (XSS safe)                        │
│  • Server ke request pathay                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS request
                          │ (cookie auto attach)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  LAYER 2: NEXT.JS (BFF — Backend-for-Frontend)               │
│  ─────────────────────────────────────────                   │
│  3 ta sub-layer ache:                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 2A. PROXY (middleware)                                 │  │
│  │     • Browser request er shob theke age chole          │  │
│  │     • Cookie check kore                                │  │
│  │     • Expired hole refresh kore                        │  │
│  │     • Browser ke notun cookie pathay                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 2B. RSC (Server Components)                            │  │
│  │     • HTML generate kore                               │  │
│  │     • User data fetch kore                             │  │
│  │     • Cookie shudhu READ kore                          │  │
│  │     • NEVER write kore                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 2C. SERVER ACTIONS                                     │  │
│  │     • Form submit handle kore                          │  │
│  │     • Login / logout kore                              │  │
│  │     • Cookie WRITE kore                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ server-to-server
                          │ (cookie forward)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  LAYER 3: EXPRESS BACKEND                                    │
│  ────────────────────────                                    │
│  • Database (Prisma + PostgreSQL)                            │
│  • Password check (bcrypt)                                   │
│  • JWT sign/verify                                           │
│  • Refresh token rotation                                    │
│  • Role-based access                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Analogy:**

```
Tumi (Browser) → Restaurant e giye khaoar chao
                  │
Next.js (Waiter) → Kitchen theke khabar ano
                    │
Express (Kitchen) → Khabar banay
```

**Waiter (Next.js)** — tumi ar kitchen er modhye। Tumi kitchen e jete paro na, waiter ke bolো। Waiter kitchen theke niye ashe।

---

## 🎯 Part 2: Ken BFF Pattern?

### **Direct Backend Call er Problem**

```
Browser → Express (direct)
   │
   ├─ CORS issue (different port)
   ├─ Cookie cross-origin issue
   ├─ Token JS e visible (XSS risk)
   ├─ Multiple API URL expose
   └─ SSR impossible (browser-only)
```

### **BFF Pattern er Benefit**

```
Browser → Next.js → Express
   │
   ├─ ✅ Same-origin (no CORS)
   ├─ ✅ httpOnly cookie (XSS safe)
   ├─ ✅ Server-side fetch (SSR possible)
   ├─ ✅ API URL hidden from browser
   └─ ✅ Single entry point
```

**Real-world:** Vercel, Netflix, Airbnb, Shopify — sob e ei pattern।

---

## 🎯 Part 3: Cookie — Ki, Ken, Kivabe

### **Cookie Ki?**

Chhoto text file jegulo **browser store kore** aar **prottek request e server ke pathay**।

```
Browser er pocket e ekta chhoto kagoj
Jekhane likha: "user=abdullah, token=eyJhbGc..."
Prottek request e ei kagoj server ke dekhay
```

### **Cookie Options — Ki Mane**

| Option | Mane | Ken Dorkar |
|--------|------|------------|
| **httpOnly** | JS e read korte parbe na | XSS attack prevent |
| **secure** | HTTPS only | Production e must |
| **sameSite** | Cross-site request e pathabe na | CSRF attack prevent |
| **path** | Kon route e pathabe | Scope define |
| **maxAge** | Koto shomoy thakbe | Expiry |

### **Cookie 2 Type — Access vs Refresh**

| | Access Token | Refresh Token |
|---|---|---|
| **Lifetime** | Chhoto (15m) | Lamba (7d) |
| **Purpose** | API call korar jonno | Notun access pete |
| **Frequency** | Prottek request | Prottek 15m |
| **DB stored** | ❌ Na | ✅ H্যাঁ |
| **Churi hole** | 15m e expire | Revoke korte hobe |

**Analogy:**

```
Access Token = Hotel er room key
  → 15 min valid
  → Prottek bar room khulte use
  → Churi hole 15 min por automatically expire

Refresh Token = Hotel er reception slip
  → 7 din valid
  → Notun room key pete use
  → Churi hole reception e jeye block korte hobe
```

---

## 🎯 Part 4: Cookie Write Rules — Most Important

**Next.js 16 strict rule:**

| Where | Cookie Write | Why |
|-------|-------------|-----|
| **Proxy (middleware)** | ✅ YES | Browser request → browser response |
| **Route Handler** | ✅ YES | Browser request → browser response |
| **Server Action** | ✅ YES | Browser request → browser response |
| **RSC render** | ❌ NO | Server-to-server → browser e jay na |

### **Ken Ei Rule?**

**RSC er kaj** — HTML generate kora। RSC **server theke server** e call hoy — **browser involved na**।

```
Browser → Server (RSC render)
            │
            ├─ Server internally onno server ke call kore
            │
            └─ HTML browser ke pathay

Browser ei internal call dekhte pay na
So RSC er "Set-Cookie" o browser e jay na
```

**Analogy:**

```
Tumi (browser) → Waiter (RSC) ke bolo "biryani chai"
Waiter (RSC) → Kitchen (route handler) e giye bole "biryani"
Waiter (RSC) → tomake biryani dey

But bill (cookie) waiter nijer pocket e rakhe
Tumi bill dekhte pao na → next time problem
```

### **Error Message**

```
Error: Cookies can only be modified in a Server Action or Route Handler.
```

**Eta Next.js er **intentional** error — tomar code ke **correct location** e nite bole।

---

## 🎯 Part 5: Full Auth Flow — Story Format

### **Story 1: Login**

```
1. User /login page e jay
   → Server login form render kore

2. User email + password dey, submit kore
   → Form submit Server Action e jay (loginAction)

3. loginAction Express ke call kore
   → Express email+password check kore
   → Correct hole 2 ta JWT token banay
   → Cookie te set kore response pathay

4. loginAction Express er response theke cookie read kore
   → Next.js cookie store e copy kore
   → Server Action e cookie write LEGAL

5. Browser Next.js response pায়
   → Cookie browser e set hoy
   → Login page redirect kore dashboard e

6. Dashboard e user er name dekhay ✅
```

### **Story 2: Access Token Expire (15s)**

```
1. User 15s wait kore
   → Access token expire hoye gelo
   → But browser e cookie ACHE (value expired)

2. User /admin page e jay
   → Browser request pathay
   → Cookie auto attach

3. Proxy (middleware) request dhorе
   → Access token expire kina check kore (JWT decode)
   → Expired → refresh token ache?

4. Proxy Express ke refresh request pathay
   → Express refresh token verify kore
   → DB te match check
   → Notun 2 ta token generate kore (rotation)
   → DB update kore
   → Response pathay new cookies soho

5. Proxy browser response e notun cookie set kore
   → Browser e notun accessToken + refreshToken ✅

6. Proxy RSC ke fresh token pass kore (header e)
   → RSC ke jano notun token pai

7. RSC user fetch kore notun token diye
   → Express 200 dey user data soho
   → Page render hoy user dekhay ✅

8. User mone kore kichui hoy nai
   → Auto-refresh silent ✨
```

### **Story 3: Refresh Token Expire (7 days)**

```
1. User 7 din wait kore
   → Refresh token o expire hoye gelo

2. User /admin e jay
   → Proxy access expired detect kore
   → Refresh token diye refresh try kore

3. Express refresh reject kore (401)
   → Token expired / DB te nai

4. Proxy /login?redirect=/admin e redirect kore
   → User login page dekhе

5. User abar login kore
   → Fresh cycle start
```

---

## 🎯 Part 6: Proxy — Auto-Refresh Gate

### **Proxy er Kaj**

Proxy **browser request er shob theke age** chole। Mane:

```
Browser → Proxy → RSC → HTML → Browser
```

Proxy ekta **checkpoint** — ekhane sob request check hoy।

### **Proxy er Decision Tree**

```
Request asho
  │
  ├─ Route protected? (customer/seller/admin)
  │   │
  │   ├─ NO → pass (public route)
  │   │
  │   └─ YES →
  │       │
  │       ├─ Access token ACHE + VALID?
  │       │   └─ YES → pass ✅
  │       │
  │       ├─ Access token ACHE but EXPIRED?
  │       │   └─ Refresh token ACHE?
  │       │       ├─ YES → refresh try
  │       │       │   ├─ 200 → cookie update + pass ✅
  │       │       │   └─ 401 → /login redirect
  │       │       └─ NO → /login redirect
  │       │
  │       └─ Access token NAI?
  │           └─ /login redirect
  │
  └─ Continue to RSC
```

### **Proxy er Unique Power**

**Proxy browser request layer** e chole। Mane proxy jodi `Set-Cookie` pathay — **browser e jay** ✅

**Ei karone** auto-refresh proxy tে kora hoy।

---

## 🎯 Part 7: RSC — Read-Only Auth

### **RSC er Kaj**

- HTML generate kora
- User data fetch kora
- **Cookie shudhu READ kora**

### **Ken Read-Only?**

RSC **server-to-server** call kore। `Set-Cookie` browser e jay na। So cookie **write kora mane** — kaj korbe na।

### **RSC er Source Priority**

```
1st: Proxy theke inject kora token (x-access-token header)
     ↑ Ei ta FRESHEST — proxy just refresh koreche

2nd: Browser cookie theke token
     ↑ Purono hote pare — proxy refresh kore nai

3rd: Kono token nai → return null
```

**Ken 1st priority?** Karon proxy **just refresh koreche** — browser cookie update hoyeche but RSC er same request e **notun value pawa jay na**। Tai proxy **header e inject** kore।

---

## 🎯 Part 8: Refresh Token Rotation

### **Ki Ei Ta?**

Prottek refresh e **notun refresh token** generate hoy। Purono **invalid** hoye jay।

```
Refresh request 1:
  Browser → refresh_token_A
  Express → notun refresh_token_B generate + DB update
  → Browser e refresh_token_B set

Refresh request 2:
  Browser → refresh_token_B (notun)
  Express → DB te B ache → OK → notun refresh_token_C
  → Browser e C set
```

### **Ken Rotation?**

**Security** — jodi refresh token **churi** hoy:

**Without rotation:**
```
Attacker → refresh_token_A use → notun access token
Attacker → abar refresh_token_A use → abar notun access
Attacker → ei vabe indefinitely access pai ❌
```

**With rotation:**
```
Attacker → refresh_token_A use → notun refresh_token_B
User → refresh_token_A use → DB te B ache, A nai → reject
User re-login → sob token invalid

Attacker er refresh_token_B → user re-login korle invalid ❌
```

**Analogy:**

```
Hotel room key jodi churi hoy:
  Without rotation: Key kaj korte thake indefinitely
  With rotation: Reception e giye notun key nile purono key invalid hoye jay

Attacker er purono key → kaj korbe na
```

### **Ei Rotation er Danger**

Jodi **cookie update na hoy** browser e:

```
1st refresh: Express notun token_B banay, DB update
Browser e A ache (purono, karon RSC e set hocche na)

2nd refresh: Browser A pathay
Express DB te B ache, A nai → 401 ❌
User logout
```

**Ei ta classic bug** — refresh **RSC → route handler** e korle hoy। **Fix:** **Proxy** e refresh koro — browser cookie update hoy।

---

## 🎯 Part 9: File Structure — Ken Ei Organized?

### **`lib/auth/` — Auth Core**

```
lib/auth/
├── session.ts    ← auth(), requireAuth(), requireRole()  [SERVER-ONLY]
├── role.ts       ← roleDashboard()                        [PURE, client-safe]
├── cookie.ts     ← forwardSetCookies(), clearAuthCookies() [SERVER-ONLY]
├── schema.ts     ← Zod schemas                            [SHARED]
└── actions.ts    ← Server Actions                         ["use server"]
```

**Ken alada alada file?**

| File | Reason |
|------|--------|
| `session.ts` | Server-only (cookies use) |
| `role.ts` | Client + server both need (pure) |
| `cookie.ts` | Server-only (cookies write) |
| `schema.ts` | Client form + server validation both |
| `actions.ts` | Server Action directive |

**Rule:** Jei file e `cookies()`, `headers()`, DB — seta **server-only**। Jei file **pure function** — seta **shared**।

### **`proxy.ts` — Auto-Refresh**

**Root e ekta file** — middleware/proxy।

### **`app/api/auth/refresh/route.ts` — Fallback**

**Route Handler** — jodi proxy theke fail hoy, eta fallback।

---

## 🎯 Part 10: Decision Tree — Kothay Ki Likhbo

```
Tumi kichu likhte chao — kothay likhbe?

1. Cookie write korte chao?
   ├─ Server Action e → ✅ OK
   ├─ Route Handler e → ✅ OK
   ├─ Proxy e → ✅ OK
   └─ RSC render e → ❌ FORBIDDEN

2. User data fetch korte chao?
   ├─ RSC e → ✅ OK (auth() call)
   └─ Client e → ⚠️ Server Action theke call

3. Form submit handle?
   └─ Server Action

4. Real-time update?
   └─ Client + API call

5. Complex API (multiple)
   └─ Route Handler
```

**Rule of thumb:**

```
Browser request → response cycle:
  ├─ Request er shurute (proxy) → cookie check + refresh
  ├─ Render er shomoy (RSC) → cookie READ
  ├─ Mutation (Action/Handler) → cookie WRITE
  └─ Render er pore (client) → API call
```

---

## 🎯 Part 11: Problem vs Solution Table

| Problem | Root Cause | Solution |
|---------|------------|----------|
| Cookie set hoye na login e | `forwardSetCookies` call hoy nai | Server Action e call koro |
| Refresh kaj kore but logout | RSC e refresh → browser cookie update hoy na | Proxy e refresh koro |
| Refresh token rotation mismatch | Browser cookie update hoy nai | Proxy response e cookie set koro |
| `server-only` import client e | Mixed file | Pure helper alada file e rakho |
| `useSearchParams` build fail | Suspense nai | `<Suspense>` wrap koro |
| Cookie cross-origin problem | Direct Express call | BFF pattern |
| Access token expire → logout | Proxy `!accessToken` shudhu check | Expired check add koro |
| DB te token mismatch | Rotation + RSC write fail | Proxy write |

---

## 🎯 Part 12: Timeline — Ki Ki Koro Kobe

### **Initial Setup**
```
1. Express backend → auth endpoints (login, register, refresh, logout)
2. Prisma schema → User model e refreshToken field
3. JWT utils → generate/verify functions
4. Cookie utils → options
5. CORS setup → credentials: true + specific origin
```

### **Next.js Setup**
```
1. lib/auth/session.ts → auth() helper
2. lib/auth/role.ts → roleDashboard()
3. lib/auth/cookie.ts → forwardSetCookies()
4. lib/auth/actions.ts → Server Actions
5. proxy.ts → auto-refresh
6. Route groups → (public), (auth), (dashboard)
```

### **Test Sequence**
```
1. Login → cookie set ✅
2. /me → user data ✅
3. Access expire (15s) → refresh → user ✅
4. Refresh expire (120s) → login ✅
5. Protected route without login → redirect ✅
6. Wrong role → correct dashboard ✅
```

---

## 🎯 Part 13: Debug Checklist — Problem Hole

### **Step 1: Browser Check**
```
F12 → Application → Cookies → localhost:3000
  → accessToken ache?
  → refreshToken ache?
  → Max-Age ki?
  → Value ki? (JWT 3 parts ache?)
```

### **Step 2: Network Check**
```
F12 → Network → prottek request
  → Request Headers e Cookie ache?
  → Response Headers e Set-Cookie ache?
  → Status code ki?
```

### **Step 3: Terminal Check**
```
Frontend:
  → POST /api/auth/refresh → 200 naki 401?
  → GET /admin → 200 naki 307?
  → PUBLIC LAYOUT USER → user naki null?

Backend:
  → /auth/login → 200
  → /auth/me → 200 naki 401?
  → /auth/refresh-token → call hocche? 200 naki 401?
```

### **Step 4: Proxy Log**
```
proxy.ts e temporary log:
  → pathname
  → hasAccess
  → hasRefresh
  → isExpired
  → refresh called?
```

### **Step 5: Isolate Problem**
```
Fresh login korle kaj kore?
  ├─ YES → refresh flow e problem
  └─ NO → login flow e problem

Refresh kaj kore first time?
  ├─ YES but second time fail → rotation + cookie update issue
  └─ NO → proxy refresh call fail
```

---

## 🎯 Part 14: Security — Ken Ei Design

### **1. httpOnly Cookie**
- JS token read korte pare na
- XSS attack e token steal kora jay na

### **2. sameSite: "lax"**
- Cross-site request e cookie pathay na (mostly)
- CSRF attack prevent

### **3. Secure**
- Production e HTTPS only
- Man-in-the-middle prevent

### **4. Short Access Token**
- 15 min → churi hole 15 min e invalid
- Damage limitation

### **5. Rotation**
- Refresh token ekbar use holei invalid
- Churi hole detect kora easy

### **6. BFF Pattern**
- API URL browser e visible na
- Token JS e nai
- Server-side only

### **7. Role-Based Access**
- Prisma query e role check
- Middleware e authorize
- UI te conditional render

---

## 🎯 Part 15: Future Improvements

### **Short-term**
1. Access token 15m koro (production)
2. Debug logs remove koro
3. Duplicate `services/auth.service.ts` delete koro
4. Error boundary add koro

### **Medium-term**
1. Session expiry warning (5 min age)
2. Remember me option
3. Multi-device session management
4. Refresh token revoke UI

### **Long-term**
1. OAuth (Google, Facebook)
2. 2FA (TOTP)
3. Device fingerprinting
4. Audit logs

---

## 🎯 Part 16: Analogy — Real Life

### **Auth System = Bank**

```
Bank = Express (safe, controlled)
Receptionist = Next.js (proxy + RSC)
Tumi = Browser (customer)

Process:
  1. Tumi bank e jao → Receptionist dekhe
  2. ID card dao → Receptionist verify kore
  3. Bank e jete dey
  4. Bank kaj kore
  5. Bank theke taka ano
```

### **Cookie = Token**

```
ID card = Access token (short-lived)
Reception slip = Refresh token (long-lived)

ID card 15 min valid
Reception slip 7 din valid

ID card expire → slip diye notun card ano
Slip expire → abar check-in (login)
```

### **Rotation = Card Change**

```
Prottek entry te notun ID card
Purono card invalid

Attacker er purono card → kaj korbe na
User er notun card → kaj korbe
```

### **BFF = Receptionist**

```
Tumi direct bank e jete paro na
Receptionist ke bolo
Receptionist bank theke kaj kore

Receptionist = Next.js
Bank = Express
```

---

## 🎯 Part 17: Ei System er Core Principles

### **Principle 1: Separation of Concerns**

```
Proxy → routing + cookie refresh
RSC → render + read
Action → mutation + write
Express → business logic
```

### **Principle 2: Layer Responsibility**

```
Prottek layer er ekta kaj
Oi kaj er baire jao na
```

### **Principle 3: Browser Request Layer Wins**

```
Cookie write korte hobe browser request layer e
RSC render cookie write korte parbe na
```

### **Principle 4: Trust Boundaries**

```
Browser → untrusted
Next.js → semi-trusted (BFF)
Express → trusted (backend)
Database → trusted
```

### **Principle 5: Fail Securely**

```
Kono layer fail hole → user logout
Kono silent fallback na
Clear error message
```

### **Principle 6: Idempotent Operations**

```
Refresh multiple bar call korleo same result
Race condition avoid
```

---

## 🎯 Part 18: Golden Rules — Remember These

### **Rule 1: Cookie Write Rules**
```
✅ Proxy / Route Handler / Server Action
❌ RSC render
```

### **Rule 2: RSC Read-Only**
```
RSC e cookies().set() call korba na
Shudhu cookies().get() koro
```

### **Rule 3: BFF Always**
```
Browser → Express direct na
Browser → Next.js → Express
```

### **Rule 4: Silent Refresh**
```
User ke refresh dekhaba na
Proxy nijেই handle korbe
Background e kaj korbe
```

### **Rule 5: Fail Clean**
```
Refresh fail → login page
Partial state na
```

### **Rule 6: One Source of Truth**
```
Token expiry = JWT exp claim
Cookie maxAge = JWT exp
Duitai same rakho
```

### **Rule 7: Test Edge Cases**
```
✅ Access valid
✅ Access expired, refresh valid
✅ Access + refresh expired
✅ No token at all
✅ Malformed token
```

### **Rule 8: No Duplicate Stacks**
```
lib/auth/session.ts = ONE auth stack
services/auth.service.ts = DELETE
```

---

## 🎯 Part 19: Emergency Recovery

### **Sob Bhang Gelo?**

```
1. Browser cookie clear koro
   F12 → Application → Cookies → sob delete

2. Backend restart koro
   Ctrl+C → bun dev

3. Frontend restart koro
   Ctrl+C → bun dev

4. Fresh login koro
   /login → email + password

5. Prottek step check koro
   - Cookie set?
   - /me 200?
   - Dashboard render?
```

### **Still Problem?**

```
1. Frontend terminal log save koro
2. Backend terminal log save koro
3. Browser cookies screenshot
4. Network tab screenshot
5. Ei document follow koro step by step
```

---

## 🎯 Part 20: Summary — Ek Line e

**Auth system = Browser (cookie holder) + Next.js BFF (cookie manager + UI) + Express (data source) + JWT (token) + Rotation (security)।**

**Mantra:**

```
Cookie write korte hobe browser request layer e।
RSC render e kichu write koro na।
Proxy auto-refresh kore।
RSC shudhu read kore।
Express data dey।
Browser user dekhay।
```

---

## 📝 Notes

- **Date:** 2026-09-20
- **Next.js:** 16.3.0
- **Express:** JWT + Prisma + PostgreSQL
- **Testing:** Access 15s, Refresh 120s
- **Production:** Access 15m, Refresh 7d

---

**Ei README ta tomar auth system er "Bible" — kono problem hole ei document follow koro.**

**Future e jodi kono layer bhangte chao, age ei document ta poro — karon tumi ei design keno korecho seta mone rakha important।**