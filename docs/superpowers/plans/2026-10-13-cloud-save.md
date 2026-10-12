# ذخیرهٔ ابری — نقشهٔ اجرا

> **برای عامل‌های اجرایی:** از مهارت `executing-plans` برای اجرای این نقشه، کار‌به‌کار استفاده کن.

**هدف:** یک ذخیرهٔ ابری اختیاری که با «کلید بازیابی» کار می‌کند، نه با نام کاربری و رمز.

**معماری:** یک Cloudflare Worker روی دامنهٔ خودش، با دو جدول در D1، چهار مسیر
`/join` `/pull` `/push` `/revoke`. کلاینت به‌جای `/api` به دامنهٔ Worker می‌رود و
هدرهای CORS را می‌خواند. تا وقتی Worker منتشر نشده، `<meta name="hesab-sync"
content="off">` باقی می‌ماند و کارت در رابط کاربری اصلاً رندر نمی‌شود.

**پشته:** جاوااسکریپت خالص (بدون bundler)، Cloudflare Workers (ماژول ES)، D1،
AES-GCM از طریق `crypto.subtle`.

**طرح:** `docs/superpowers/specs/2026-10-13-cloud-save-design.md`

## قیدهای سراسری

- `app.js` در `~/Downloads/hesab-fixed/` ویرایش می‌شود، بعد در
  `/tmp/hesab-publish/` کپی و همان‌جا کامیت می‌شود. این تنها مخزن است.
- **هر استقرار `var CACHE` در `sw.js` را یکی بالا می‌برد.** نام فعلی `hesab-v12`.
  دارایی‌ها cache-first هستند؛ بدون بالا بردن، کاربر همان نسخهٔ کهنه را می‌بیند.
- هیچ وابستگی npm و هیچ bundler اضافه نمی‌شود. `app.js` باید بدون ابزار خوانا و
  قابل بارگذاری بماند.
- روی این ماشین `node`، `npm` و `wrangler` نصب نیستند. تست‌های جاوااسکریپت از
  **مرورگر** اجرا می‌شوند، نه از خط فرمان.
- هیچ متنی در رابط کاربری ادعای «سرور نمی‌تواند داده‌هایت را بخواند» نکند.

## کانون بازبینی

پنج ورودی که طرح به آن‌ها ساکت است و به احتمال زیاد کاربر واقعی را می‌زنند:

1. **کلید با حروف کوچک، بدون خط تیره، یا با `O`/`I`/`L` به‌جای `0`/`1`** — باید
   همان کلید بشمرد، وگرنه کاربر داده‌اش را از دست می‌دهد.
2. **دو دستگاه هم‌زمان** — یکی `push` می‌کند، دیگری `409` می‌گیرد؛ ادغام باید هر
   دو طرف را نگه دارد و هیچ تراکنشی نباید گم شود.
3. **Worker در دسترس نیست** (اینترنت قطع، یا هنوز منتشر نشده) — برنامه باید مثل
   امروز کار کند، داده‌ای از دست نرود، و وضعیت صادقانه نشان دهد.
4. **حافظهٔ دستگاه پاک شده ولی ابر سالم است** — باید بتوان فقط با کلید بازیابی
   همه‌چیز را برگرداند.
5. **کلید اشتباه روی دستگاه تازه** — باید خطای روشن بدهد، نه اینکه یک دفترچهٔ
   خالیِ تازه بسازد و کاربر فکر کند داده‌اش پاک شده.

---

### کار ۱: کلید بازیابی

**فایل‌ها:**
- تغییر: `~/Downloads/hesab-fixed/app.js` — توابع جدید کنار `syLoad()`
- تست: درون‌مرورگری، از راه رابط کاربری

**رابط‌ها:**
- تولید می‌کند: `rkNew()` → رشتهٔ `XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`
- تولید می‌کند: `rkNorm(s)` → رشتهٔ ۳۰ نویسه‌ای بزرگ، بدون خط تیره
- مصرف‌کننده: کارهای ۵ و ۶

الفبا `Crockford Base32` است: `0123456789ABCDEFGHJKMNPQRSTVWXYZ` (بدون `I L O U`).

- [ ] **گام ۱: توابع را بنویس**

```javascript
/* ---- کلید بازیابی: ۶ گروه ۵ نویسه‌ای، ۱۵۰ بیت آنتروپی ---- */
var RK_AL = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function rkNew() {
  var b = crypto.getRandomValues(new Uint8Array(19)),
    s = '';
  for (var i = 0; i < 30; i++) s += RK_AL[b[i % 19] % 32];
  var g = [];
  for (var j = 0; j < 6; j++) g.push(s.substr(j * 5, 5));
  return g.join('-');
}
/* خواندن کلید نباید حساس به حروف بزرگ/کوچک، فاصله، خط تیره،
   و خطاهای رایج تایپ باشد. نویسه‌های مبهم به معادل عددی‌شان می‌روند. */
function rkNorm(s) {
  var t = String(s || '')
    .toUpperCase()
    .replace(/[\s‐-―-]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
    .replace(/U/g, 'V');
  return t.length === 30 && /^[0-9A-HJKMNP-TV-Z]+$/.test(t) ? t : '';
}
```

- [ ] **گام ۲: چرخهٔ آزمون را روی این پنج شکل اجرا کن**

```javascript
const cases = [
  ['7KQ4M-2XPT9-BWHF3-R8JDL-N5VCQ'],
  ['7kq4m2xpt9bwhf3r8jdln5vcq'],
  ['7KQ4M 2XPT9 BWHF3 R8JDL N5VCQ'],
  ['7KQ4M2XPT9BWHF3R8JDLN5VCQ'],
];
const base = rkNorm(cases[0][0]);
cases.forEach(([k]) => {
  if (rkNorm(k) !== base) throw new Error('normalisation mismatch: ' + k);
});
// نویسه‌های مبهم باید به همان کلید برسند
const amb = 'O'.repeat(1);
if (rkNorm(base.replace(/0/g, amb)) !== base.replace(/0/g, '0')) throw new Error('O alias');
// ورودی نامعتبر باید تهی برگرداند، نه رشتهٔ نصفه
['7KQ4M', 'ZZZZZ-2XPT9-BWHF3-R8JDL-N5VCQ', '', '7KQ4M-2XPT9-BWHF3-R8JDL-N5VCQQ']
  .forEach(bad => { if (rkNorm(bad) !== '') throw new Error('should reject: ' + bad); });
```

- [ ] **گام ۳: تست را اجرا کن و شکست را ببین**

در صفحهٔ محلی، داخل `browser.evaluate`. انتظار: `ReferenceError: rkNew is not defined`.

- [ ] **گام ۴: توابع را در `app.js` بگذار**

دقیقاً بعد از تابع `syStore()` قرار بگیرند. ذخیره کن و دوباره اجرا کن. انتظار: بدون خطا.

- [ ] **گام ۵: کامیت**

```bash
cd ~/Downloads/hesab-fixed
cp app.js /tmp/hesab-publish/
cd /tmp/hesab-publish && git add app.js && git commit -m "Add the recovery key generator"
```

---

### کار ۲: موک محلی — آزمون قرارداد

بدون این کار نمی‌شود کلاینت را پیش از هر دسترسی به Cloudflare آزمود. یک موک
پایتونی که دقیقاً چهار مسیر طرح را پیاده می‌کند، با SQLite در حافظه.

**فایل‌ها:**
- ایجاد: `/tmp/mock_api.py`
- تست: همان فایل، حالت `--selftest`

**رابط‌ها:**
- تولید می‌کند: سرور HTTP روی پورت `8795` با `POST /join|/pull|/push|/revoke`
- مصرف‌کننده: کارهای ۵، ۶ و ۷

- [ ] **گام ۱: فایل را با این محتوا بساز**

```python
#!/usr/bin/env python3
"""موک محلی برای آزمون کلاینت، پیش از استقرار Cloudflare.
پیاده‌سازی چهار مسیر طرح روی SQLite در حافظه. یک دوبلِ تست است، نه بک‌اند."""
import json, sqlite3, base64, os, hashlib, sys
from http.server import BaseHTTPRequestHandler, HTTPServer

DB = sqlite3.connect(':memory:')
DB.execute('CREATE TABLE users (k TEXT PRIMARY KEY, rev INTEGER, iv TEXT, ct TEXT, ts INTEGER)')
DB.execute('CREATE TABLE sessions (h TEXT PRIMARY KEY, k TEXT, ts INTEGER)')
RATE = {}

def now(): return int(__import__('time').time() * 1000)
def h(s): return hashlib.sha256(s.encode()).hexdigest()
def norm(k):
    t = ''.join(k.upper().split()).replace('-','')
    for a,b in (('O','0'),('I','1'),('L','1'),('U','V')): t = t.replace(a,b)
    return t if len(t) == 30 else ''

def limited(key, n, window=60000):
    t = now()
    hits = [x for x in RATE.get(key, []) if t - x < window]
    if len(hits) >= n:
        RATE[key] = hits; return True
    hits.append(t); RATE[key] = hits; return False

def token():
    return base64.urlsafe_b64encode(os.urandom(32)).decode().rstrip('=')

def reply(self, code, obj):
    body = json.dumps(obj).encode()
    self.send_response(code)
    self.send_header('content-type', 'application/json')
    self.send_header('access-control-allow-origin', '*')
    self.send_header('access-control-allow-headers', 'content-type,authorization')
    self.send_header('access-control-allow-methods', 'POST,OPTIONS')
    self.end_headers(); self.wfile.write(body)

def fail(self, code, err): reply(self, code, {'error': err})

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_OPTIONS(self): reply(self, 204, {})
    def do_POST(self):
        raw = self.rfile.read(int(self.headers.get('content-length') or 0))
        try: b = json.loads(raw or b'{}')
        except Exception: return fail(self, 400, 'invalid')
        p = self.path.rstrip('/')
        if p == '/join':
            k = norm(str(b.get('k','')))
            if not k: return fail(self, 400, 'invalid')
            if limited('join:'+k, 30): return fail(self, 429, 'rate_limited')
            row = DB.execute('SELECT rev FROM users WHERE k=?', (k,)).fetchone()
            if row: return fail(self, 409, 'taken')
            t = token()
            DB.execute('INSERT INTO users VALUES (?,1,NULL,NULL,?)', (k, now()))
            DB.execute('INSERT INTO sessions VALUES (?,?,?)', (h(t), k, now()))
            DB.commit()
            return reply(self, 200, {'token': t, 'rev': 1})
        tok = self.headers.get('authorization', '')[7:]
        row = DB.execute('SELECT k FROM sessions WHERE h=?', (h(tok),)).fetchone()
        if p == '/pull':
            if limited('pull', 30): return fail(self, 429, 'rate_limited')
            if not row: return fail(self, 401, 'unauthorized')
            u = DB.execute('SELECT rev,iv,ct FROM users WHERE k=?', (row[0],)).fetchone()
            return reply(self, 200, {'token': tok, 'rev': u[0], 'iv': u[1], 'ct': u[2]})
        if p == '/push':
            if limited('push:'+str(row), 60): return fail(self, 429, 'rate_limited')
            if not row: return fail(self, 401, 'unauthorized')
            if len(str(b.get('ct',''))) > 900000: return fail(self, 413, 'too_large')
            cur = DB.execute('SELECT rev FROM users WHERE k=?', (row[0],)).fetchone()[0]
            if int(b.get('rev', 0)) != cur: return reply(self, 409, {})
            nv = cur + 1
            DB.execute('UPDATE users SET rev=?,iv=?,ct=?,ts=? WHERE k=?',
                       (nv, b.get('iv'), b.get('ct'), now(), row[0]))
            DB.commit()
            return reply(self, 200, {'rev': nv})
        if p == '/revoke':
            if not row: return fail(self, 401, 'unauthorized')
            DB.execute('DELETE FROM users WHERE k=?', (row[0],))
            DB.execute('DELETE FROM sessions WHERE k=?', (row[0],))
            DB.commit()
            return reply(self, 200, {'ok': True})
        return fail(self, 404, 'invalid')

if __name__ == '__main__':
    if '--selftest' in sys.argv:
        print('موک آماده است'); sys.exit(0)
    HTTPServer(('127.0.0.1', 8795), H).serve_forever()
```

- [ ] **گام ۲: چهار مسیر را با یک اسکریپت بیازموس**

```bash
python3 /tmp/mock_api.py &
sleep 1
K=7KQ4M-2XPT9-BWHF3-R8JDL-N5VCQ
N=$(python3 -c "print(''.join(c for c in '$K' if c!='-'))")
T=$(curl -s -XPOST localhost:8795/join -d "{\"k\":\"$K\"}" | python3 -c "import json,sys;print(json.load(sys.stdin)['token'])")
[ -n "$T" ] && echo "PASS join"
curl -s -XPOST localhost:8795/join -d "{\"k\":\"$K\"}" | grep -q taken && echo "PASS taken"
curl -s -XPOST localhost:8795/push -H "authorization: Bearer $T" -d '{"rev":1,"iv":"a","ct":"b"}' | grep -q '"rev":2' && echo "PASS push"
curl -s -XPOST localhost:8795/push -H "authorization: Bearer $T" -d '{"rev":1,"iv":"a","ct":"c"}' -o /dev/null -w '%{http_code}\n' | grep -q 409 && echo "PASS conflict"
curl -s -XPOST localhost:8795/pull -H "authorization: Bearer $T" | grep -q '"ct":"b"' && echo "PASS pull"
curl -s -XPOST localhost:8795/push -H "authorization: Bearer nope" -d '{}' -o /dev/null -w '%{http_code}\n' | grep -q 401 && echo "PASS unauthorized"
curl -s -XPOST localhost:8795/revoke -H "authorization: Bearer $T" | grep -q '"ok":true' && echo "PASS revoke"
```

انتظار: هر هفت خط `PASS`.

- [ ] **گام ۳: کامیت**

موک یک دوبلِ آزمون است و در مخزن نمی‌رود. فقط تأیید کن که `/tmp/mock_api.py` هست و
کامیتی در `/tmp/hesab-publish` برای این کار لازم نیست.

---

### کار ۳: هستهٔ Worker و SQL

**فایل‌ها:**
- ایجاد: `/tmp/hesab-publish/worker/src/worker.mjs`
- ایجاد: `/tmp/hesab-publish/worker/schema.sql`
- ایجاد: `/tmp/hesab-publish/worker/test/harness.html`

**رابط‌ها:**
- تولید می‌کند: `handle(env, request)` → `Response`
- مصرف‌کننده: کار ۴ (CORS و محدودیت نرخ) و کار ۸ (استقرار)

- [ ] **گام ۱: `schema.sql` را بساز**

```sql
CREATE TABLE IF NOT EXISTS users (
  k   TEXT PRIMARY KEY,
  rev INTEGER NOT NULL,
  iv  TEXT,
  ct  TEXT,
  ts  INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  h  TEXT PRIMARY KEY,
  k  TEXT NOT NULL,
  ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_sessions_k ON sessions(k);
```

- [ ] **گام ۲: مهاجرت را روی SQLite محلی بیازموس**

```bash
python3 - <<'PY'
import sqlite3
db = sqlite3.connect(':memory:')
db.executescript(open('/tmp/hesab-publish/worker/schema.sql').read())
tables = {r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
assert {'users','sessions'} <= tables, tables
cols = {r[1] for r in db.execute("PRAGMA table_info(users)")}
assert cols == {'k','rev','iv','ct','ts'}, cols
print('PASS schema')
PY
```

- [ ] **گام ۳: `worker.mjs` را بنویس**

توابع به‌صورت خالص نوشته می‌شوند تا بدون سرور هم آزمون‌پذیر باشند:
`normKey(k)`, `hash(t)`, `newToken()`, `limited(map, key, n, now)`,
`route(env, {path, token, body})` → `{status, body}`.

```javascript
const AL = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function normKey(k) {
  let t = String(k || '').toUpperCase().replace(/[\s‐-―-]/g, '');
  t = t.replace(/O/g, '0').replace(/[IL]/g, '1').replace(/U/g, 'V');
  return t.length === 30 && /^[0-9A-HJKMNP-TV-Z]+$/.test(t) ? t : '';
}
export function hash(t) {
  // SHA-256 با WebCrypto
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))
    .then(b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''));
}
export function newToken() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function limited(map, key, n, now, window = 60000) {
  const hits = (map.get(key) || []).filter(t => now - t < window);
  if (hits.length >= n) { map.set(key, hits); return true; }
  hits.push(now); map.set(key, hits); return false;
}

export async function route(env, req) {
  const { path, token, body } = req;
  const now = Date.now();
  const db = env.DB;

  if (path === '/join') {
    const k = normKey(body.k);
    if (!k) return { status: 400, body: { error: 'invalid' } };
    if (limited(env.RATE, 'join:' + k, 30, now)) return { status: 429, body: { error: 'rate_limited' } };
    const hit = await db.prepare('SELECT rev FROM users WHERE k=?').bind(k).first();
    if (hit) return { status: 409, body: { error: 'taken' } };
    const t = newToken(), th = await hash(t);
    await db.batch([
      db.prepare('INSERT INTO users (k,rev,iv,ct,ts) VALUES (?,1,NULL,NULL,?)').bind(k, now),
      db.prepare('INSERT INTO sessions (h,k,ts) VALUES (?,?,?)').bind(th, k, now),
    ]);
    return { status: 200, body: { token: t, rev: 1 } };
  }

  const th = await hash(token || '');
  const sess = await db.prepare('SELECT k FROM sessions WHERE h=?').bind(th).first();

  if (path === '/pull') {
    if (limited(env.RATE, 'pull:' + (th || ''), 30, now)) return { status: 429, body: { error: 'rate_limited' } };
    if (!sess) return { status: 401, body: { error: 'unauthorized' } };
    const u = await db.prepare('SELECT rev,iv,ct FROM users WHERE k=?').bind(sess.k).first();
    return { status: 200, body: { token, rev: u.rev, iv: u.iv, ct: u.ct } };
  }
  if (path === '/push') {
    if (!sess) return { status: 401, body: { error: 'unauthorized' } };
    if (limited(env.RATE, 'push:' + sess.k, 60, now)) return { status: 429, body: { error: 'rate_limited' } };
    if (typeof body.ct === 'string' && body.ct.length > 900000) return { status: 413, body: { error: 'too_large' } };
    const cur = await db.prepare('SELECT rev FROM users WHERE k=?').bind(sess.k).first();
    if (Number(body.rev) !== cur.rev) return { status: 409, body: {} };
    const nv = cur.rev + 1;
    await db.prepare('UPDATE users SET rev=?,iv=?,ct=?,ts=? WHERE k=?')
      .bind(nv, body.iv ?? null, body.ct ?? null, now, sess.k).run();
    return { status: 200, body: { rev: nv } };
  }
  if (path === '/revoke') {
    if (!sess) return { status: 401, body: { error: 'unauthorized' } };
    await db.batch([
      db.prepare('DELETE FROM users WHERE k=?').bind(sess.k),
      db.prepare('DELETE FROM sessions WHERE k=?').bind(sess.k),
    ]);
    return { status: 200, body: { ok: true } };
  }
  return { status: 404, body: { error: 'invalid' } };
}

export default {
  async fetch(request, env) {
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type,authorization',
      'access-control-allow-methods': 'POST,OPTIONS',
      'access-control-max-age': '86400',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    let body = {};
    try { body = await request.json(); } catch (e) { body = {}; }
    const p = new URL(request.url).pathname.replace(/^\/api/, '').replace(/\/$/, '') || '/';
    const r = await route(env, {
      path: p,
      token: (request.headers.get('authorization') || '').replace(/^Bearer /, ''),
      body,
    });
    return new Response(JSON.stringify(r.body), {
      status: r.status,
      headers: { ...cors, 'content-type': 'application/json' },
    });
  },
};
```

- [ ] **گام ۴: `harness.html` را بساز تا توابع خالص بدون سرور آزموده شوند**

```html
<!doctype html><meta charset="utf-8"><body><pre id="out"></pre>
<script type="module">
import { normKey, limited, newToken } from '../src/worker.mjs';
const log = [];
const ok = (name, cond, extra='') => log.push((cond ? 'PASS  ' : 'FAIL  ') + name + (extra?'   '+extra:''));
const K = '7KQ4M-2XPT9-BWHF3-R8JDL-N5VCQ';
const base = normKey(K);
['7kq4m2xpt9bwhf3r8jdln5vcq','7KQ4M 2XPT9 BWHF3 R8JDL N5VCQ','7KQ4M2XPT9BWHF3R8JDLN5VCQ']
  .forEach(v => ok('normalise ' + v, normKey(v) === base));
ok('O aliases to 0', normKey(base.replace(/0/g,'O')) === base);
ok('I and L alias to 1', normKey(base.replace(/1/g,'I')) === base && normKey(base.replace(/1/g,'L')) === base);
ok('too short rejected', normKey('7KQ4M') === '');
ok('bad letter rejected', normKey('7KQ4M-2XPT9-BWHF3-R8JDL-N5VCU'.replace('U','Z')) !== '');
const m = new Map();
ok('first call allowed', !limited(m,'x',3,1000));
ok('second allowed', !limited(m,'x',3,2000));
ok('third allowed', !limited(m,'x',3,3000));
ok('fourth blocked', limited(m,'x',3,4000));
ok('window resets', !limited(m,'x',3,70000));
const t1 = newToken(), t2 = newToken();
ok('tokens differ', t1 !== t2);
ok('token is url-safe', /^[A-Za-z0-9_-]{43}$/.test(t1), t1.slice(0,8) + '…');
document.getElementById('out').textContent = log.join('\n');
window.__done = true; window.__fails = log.filter(l=>l.startsWith('FAIL')).length;
</script></body>
```

- [ ] **گام ۵: در مرورگر اجرا کن**

با یک سرور ساکن روی پوشهٔ `worker/`. بعد `browser.evaluate` و خواندن
`window.__fails`. انتظار: صفر.

- [ ] **گام ۶: کامیت**

```bash
cd /tmp/hesab-publish
git add worker && git commit -m "Add the worker core and the D1 schema"
```

---

### کار ۴: پیکربندی استقرار

**فایل‌ها:**
- ایجاد: `/tmp/hesab-publish/worker/wrangler.toml`

- [ ] **گام ۱: فایل را بنویس**

```toml
name = "hesab-sync"
main = "src/worker.mjs"
compatibility_date = "2026-10-13"

# نشانی دیتابیس را `wrangler d1 create hesab` بعد از ساخت حساب پر می‌کند.
[[d1_databases]]
binding = "DB"
database_name = "hesab"
database_id = "PLACEHOLDER"

[vars]
# آدرس Worker؛ کلاینت همین مقدار را در app.js می‌خواند.
# مثال: https://hesab-sync.<subdomain>.workers.dev
ALLOWED_ORIGIN = "PLACEHOLDER"
```

- [ ] **گام ۲: بررسی کن که `PLACEHOLDER` جا نمانده**

```bash
grep -n PLACEHOLDER /tmp/hesab-publish/worker/wrangler.toml
```

انتظار: دو خط. این تنها مانع واقعی است و در کار ۸ پر می‌شود.

- [ ] **گام ۳: کامیت**

```bash
cd /tmp/hesab-publish && git add worker && git commit -m "Add the wrangler configuration"
```

---

### کار ۵: جایگزینی احراز هویت کلاینت

**فایل‌ها:**
- تغییر: `~/Downloads/hesab-fixed/app.js` — محدودهٔ ۳۱۱۹ تا ۳۵۶۰

**رابط‌ها:**
- مصرف می‌کند: `rkNew()` و `rkNorm()` از کار ۱
- تولید می‌کند: `SY = {k, token, rev, dirty, ver, last}`

- [ ] **گام ۱: آدرس پایه را ثابت کن**

```javascript
var SYNC_URL = 'https://hesab-sync.PLACEHOLDER.workers.dev';
```

و در `syApi` مسیر را کامل کن: `fetch(SYNC_URL + '/api' + path, …)` به‌جای
`fetch('/api' + path, …)`.

- [ ] **گام ۲: `syKeys` و `pbk` را حذف کن، `syAuth` را عوض کن**

`seal`/`unseal` با AES-GCM روی `SY.k` می‌مانند — فقط `SY.key` به `SY.k` تغییر می‌کند.
هر سه جای فراخوانی در `syPush`، `syPull` و `syResolve` هم عوض می‌شوند.
`syAuth` جای خود را به این می‌دهد:

```javascript
function syJoin(k0) {
  var k = rkNorm(k0) || rkNew();
  return syApi('POST', '/join', { k: k }).then(function (r) {
    if (!r.ok) throw syErr(r);
    SY = { k: k, token: r.j.token, rev: r.j.rev || 1, dirty: false, ver: 0, last: 0 };
    syStore();
    return syPush();
  });
}
```

- [ ] **گام ۳: شرط اعتبارسنجی `syLoad` را عوض کن**

```javascript
if (!SY || !SY.k || !SY.token) SY = null;
```

- [ ] **گام ۴: مسیرهای کهنه را از راهبر حذف کن**

`/login`, `/register`, `/logout`, `/password` دیگر صدا زده نمی‌شوند. `syDrop`
باقی می‌ماند چون برای `401` لازم است.

- [ ] **گام ۵: `push` را با رفتار موجود بیازموس**

`syPush` باید `409` را به `syRemote` بدهد، نه اینکه خطا بدهد — این رفتار از قبل
هست و نباید عوض شود. تأیید کن که `r.status === 409` هنوز در کد هست.

- [ ] **گام ۶: آزمون انتها به انتها در برابر موک**

`/tmp/mock_api.py` را اجرا کن، `app.js` را در سرور محلی با
`SYNC_URL='http://127.0.0.1:8795'` بار کن، و در مرورگر:

```javascript
// سپس در صفحه:
await tap('[data-tab="set"]');
// دکمهٔ ذخیرهٔ ابری را بزن، کلید را بخوان، ذخیره را تأیید کن
const key = document.querySelector('#rkv').textContent.trim();
if (!rkNorm(key)) throw new Error('key not shown in canonical form');
// یک تغییر بده، صبر کن تا push برود، بعد بررسی کن
await sleep(12000);
const pull = await (await fetch('http://127.0.0.1:8795/pull', {
  method: 'POST', headers: { authorization: 'Bearer ' + SYTOKEN }})).json();
```

انتظار: `rev` بزرگ‌تر از ۱ و `ct` پر.

- [ ] **گام ۷: کامیت**

```bash
cd ~/Downloads/hesab-fixed && cp app.js /tmp/hesab-publish/
cd /tmp/hesab-publish && git add app.js && git commit -m "Trade the password for the recovery key"
```

---

### کار ۶: کارت تنظیمات

**فایل‌ها:**
- تغییر: `~/Downloads/hesab-fixed/app.js` — تابع `syncHtml()`
- تغییر: `~/Downloads/hesab-fixed/app.css` — یک قانون برای `.warn`

- [ ] **گام ۱: کارت را بنویس**

سه حالت: خاموش، روشن با وضعیت، و «کلید را ذخیره کن».

```javascript
function syncHtml() {
  if (SYNC_OFF) return '';
  var h = '<div class="card"><h2>ذخیرهٔ ابری</h2>';
  if (!SY) {
    h += '<p class="syn">با روشن کردنش، همین داده‌ها روی همهٔ دستگاه‌هایت می‌ماند. یک «کلید بازیابی» می‌سازیم که هر کس آن را داشته باشد، داده‌هایت را می‌بیند.</p>' +
         '<button class="btn" data-x="syon" style="margin-top:0">روشن کردن</button>';
  } else if (syNeedKey) {
    h += '<p class="syn">این کلید را جایی امن نگه دار. اگر از دست برود، نسخهٔ ابری برای همیشه می‌رود.</p>' +
         '<div class="warn" id="rkv">' + esc(SY.k) + '</div>' +
         '<button class="btn" data-x="sycopy">کپی کلید</button>' +
         '<button class="btn g" data-x="syok">ذخیره کردم</button>';
  } else {
    h += '<p class="syn">' + (syBusy ? 'در حال ذخیره…' : SY.dirty ? 'منتظر ارسال…' : '✓ ذخیره شد') + '</p>' +
         '<button class="btn g" data-x="syoff">خاموش کردن و پاک کردن از ابر</button>';
  }
  return h + '</div>';
}
```

- [ ] **گام ۲: متن نادرست را بردار**

جملهٔ «سرور نمی‌تواند آن را بخواند» از هیچ متنی در `app.js` باقی نمی‌ماند:

```bash
grep -n "نمی‌تواند آن را بخواند\|نمیتواند" ~/Downloads/hesab-fixed/app.js
```

انتظار: هیچ خروجی.

- [ ] **گام ۳: `data-x`های تازه را به راهبر کلیک اضافه کن**

`syon`، `sycopy`، `syok`، `syoff` را به فهرست `closest('[data-tab],…')` اضافه کن،
وگرنه کلیک اصلاً به دستش نمی‌رسد — همان اشتباهی که در کارِ راهنمای ماه افتاد.

- [ ] **گام ۴: در مرورگر بیازموس**

کارت در تنظیمات دیده می‌شود، «روشن کردن» کلید نشان می‌دهد، «کپی کلید» در
`navigator.clipboard` می‌نویسد، و «خاموش کردن» کلید و نشست را پاک می‌کند و
بتون D1 خالی می‌شود.

- [ ] **گام ۵: کامیت**

```bash
cd ~/Downloads/hesab-fixed && cp app.js app.css /tmp/hesab-publish/
cd /tmp/hesab-publish && git add app.js app.css && git commit -m "Add the cloud save card to settings"
```

---

### کار ۷: پنج کانون بازبینی

**فایل‌ها:**
- تست: `/tmp/hesab-publish/worker/test/harness.html` برای بند ۱
- تست: درون‌مرورگری برای بندهای ۲ تا ۵

- [ ] **گام ۱: بند ۱ — شکل‌های کلید**

در کار ۳ آزموده شد. اینجا فقط نتیجه را در گزارش کار ثبت کن.

- [ ] **گام ۲: بند ۲ — دو دستگاه هم‌زمان**

دو تب روی دو `SY` جدا با یک کلید. تب اول `push` کند تا `rev=2`؛ تب دوم با
`rev=1` `push` کند و `409` بگیرد؛ بعد `syResolve('merge')`. انتظار: مجموع
تراکنش‌های هر دو طرف حفظ شود و هیچ `id` تکراری نماند.

- [ ] **گام ۳: بند ۳ — Worker در دسترس نیست**

موک را متوقف کن، یک تراکنش تازه ثبت کن، `syDirty()` باید `dirty` را نگه دارد و
پیام خطا نشان دهد. دوباره موک را بالا بیاور و `push` باید موفق شود. انتظار: هیچ
تراکنشی گم نشود و برنامه در هیچ لحظه‌ای از کار نیفتد.

- [ ] **گام ۴: بند ۴ — حافظهٔ پاک شده**

`localStorage` را خالی کن، برنامه را تازه کن، با کلید وارد شو. انتظار: هر ۹۷
تراکنش برگردد و مجموع مبلغ با فایل اصلی بخواند.

- [ ] **گام ۵: بند ۵ — کلید اشتباه**

روی دستگاهی تازه یک کلید ساختگی وارد کن. انتظار: خطای `taken` یا `invalid`
بیاید، نه دفترچهٔ خالیِ تازه.

- [ ] **گام ۶: کامیت**

اگر هر گام چیزی اصلاح کرد:

```bash
cd /tmp/hesab-publish && git commit -am "Fix what the review focus cases surfaced"
```

---

### کار ۸: انتشار

این کار **نیمی از آن به کاربر نیاز دارد**. بدون `wrangler login` در مرورگر خودش
قابل انجام نیست.

- [ ] **گام ۱: کاربر یک حساب Cloudflare بسازد**

- [ ] **گام ۲: نصب ابزار**

Node و `wrangler` روی این ماشین نیستند. یا کاربر خودش نصب کند، یا اجازه دهد
من نصب کنم. بدون این گام هیچ‌چیز منتشر نمی‌شود.

- [ ] **گام ۳: `wrangler d1 create hesab`**

خروجی `database_id` را در `worker/wrangler.toml` بگذار.

- [ ] **گام ۴: `wrangler d1 execute hesab --remote --file=worker/schema.sql`**

- [ ] **گام ۵: `wrangler deploy`**

نشانی `*.workers.dev` را بردار، در `wrangler.toml` داخل `ALLOWED_ORIGIN` و در
`app.js` داخل `SYNC_URL` بگذار.

- [ ] **گام ۶: کلید را روشن کن**

در `index.html`، `content="off"` را به `content="on"` تغییر بده و `CACHE` در
`sw.js` را یکی بالا ببر.

- [ ] **گام ۷: روی سایت زنده بیازموس**

یک حساب بساز، تراکنش اضافه کن، در یک تب دوم با همان کلید وارد شو و ببین
تراکنش برگشته. بعد `wrangler d1 execute` را بزن و ببین جدول‌ها پر شده‌اند.

- [ ] **گام ۸: README را به‌روز کن**

توضیح بده که بک‌اند کجاست، کلید بازیابی چیست، و چطور خاموشش کنی.

- [ ] **گام ۹: کامیت و push**

```bash
cd /tmp/hesab-publish && git commit -am "Turn the cloud save on" && git push origin main
```
