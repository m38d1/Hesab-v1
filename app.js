
      (function () {
        var CATS = {
          out: ['خوراک', 'حمل‌ونقل', 'مسکن', 'قبوض', 'سلامت', 'تفریح', 'خرید', 'سایر'],
          in: ['حقوق', 'درآمد جانبی', 'هدیه', 'سایر'],
        };
        var STY = {
          خوراک: ['🍽', '#ff9500'],
          حمل‌ونقل: ['🚌', '#007aff'],
          مسکن: ['🏠', '#af52de'],
          قبوض: ['💡', '#ffcc00'],
          سلامت: ['❤️', '#ff2d55'],
          تفریح: ['🎬', '#5e5ce6'],
          خرید: ['🛍', '#30b0c7'],
          سایر: ['•', '#8e8e93'],
          حقوق: ['💼', '#34c759'],
          'درآمد جانبی': ['✨', '#00c7be'],
          هدیه: ['🎁', '#ff6482'],
        };
        var ACCS = ['نقد', 'حساب بانکی', 'کارت اعتباری'],
          AIC = ['💵', '🏦', '💳'];
        var MN = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
        var TABS = [
          ['home', 'خانه', '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'],
          ['tx', 'تراکنش‌ها', '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'],
          ['bud', 'مدیریت مالی', '<circle cx="12" cy="12" r="9"/><path d="M12 3v9l6.4 6.4"/>'],
          [
            'set',
            'تنظیمات',
            '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
          ],
        ];
        var KEY = 'hesab-ios-v1',
          S = { tx: [], bud: {}, theme: 'auto' },
          tab = 'home',
          q = '',
          flt = 'all',
          aflt = -1,
          BASE0,
          pickISO,
          cal = { y: 0, m: 0 },
          cur,
          editId = null,
          sType = 'out';
        var $ = function (i) {
          return document.getElementById(i);
        };
        var fr0 = function (n) {
          return Number(n).toLocaleString('fa-IR');
        };
        var HIDEK = 'hesab-hide-v1',
          HIDE = false;
        try {
          HIDE = localStorage.getItem(HIDEK) === '1';
        } catch (e) {}
        var fi = function (n) {
          /* در تومان هم عدد باید صحیح بماند. بدون این گرد کردن، موجودیِ
             کسری (مثلاً از جمع و تفریق) اعشار نشان می‌داد و در کارت بانکی
             جایی ندارد. */
          return fr0(S.unit === 'R' ? Math.round(n * 10) : Math.round(n));
        };
        /* ارقام فارسی برای فیلدی که اصلاً پول نیست (شمارهٔ کارت). */
        var fi0 = function (s) {
          return String(s || '').replace(/[0-9]/g, function (d) {
            return '۰۱۲۳۴۵۶۷۸۹'[d];
          });
        };
        /* یک، دو، سه … برای نوشتن مبلغ روی کارت. ارقام فارسی با اعداد
           لاتین نوشته می‌شوند چون خواناتر است و با بقیهٔ رابط هم‌خوان. */
        var WD = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
          WT = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'],
          WY = ['بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
          WH = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
          WM = ['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون', ' تریلیون'],
          wtri = function (v) {
            var out = [];
            if (v >= 100) out.push(WH[Math.floor(v / 100)]);
            var r = v % 100;
            if (r) out.push(r < 10 ? WD[r] : r < 20 ? WT[r - 10] : r % 10 ? WY[Math.floor(r / 10) - 2] + ' و ' + WD[r % 10] : WY[Math.floor(r / 10) - 2]);
            return out.join(' و ');
          };
        var words = function (v) {
          v = Math.floor(Math.abs(Number(v) || 0));
          if (!v) return 'صفر';
          var g = [],
            i = 0,
            c;
          while (v > 0 && i < WM.length) {
            /* گروه صفر باید حذف شود. «صفر هزار» غلط است و رشتهٔ « هزار»
               هم چون خالی نیست از صافیِ filter رد می‌شد. */
            c = v % 1000;
            if (c) g.push([c, i]);
            v = Math.floor(v / 1000);
            i++;
          }
          /* در فارسی فقط «هزار» بدون «یک» می‌آید: ۱۰۰۰ می‌شود «هزار»،
             ولی ۱۰۰۰۰۰۰ «یک میلیون» است و ۱۰۰۰۰۰۰۰۰ «یک میلیارد».
             این هم فقط وقتی که هزار تنها گروه باشد؛ ۱۰۰۱ «یک هزار و یک» است. */
          if (g.length === 1 && g[0][0] === 1 && g[0][1] === 1) return 'هزار';
          return g
            .reverse()
            .map(function (x) {
              return wtri(x[0]) + WM[x[1]];
            })
            .join(' و ');
        };
        var fa = function (n) {
          return HIDE ? '•••' : fi(n);
        };
        var P = function (s) {
          var n = parseInt(digits(s), 10) || 0;
          return S.unit === 'R' ? n / 10 : n;
        };
        var esc = function (s) {
          return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
          });
        };
        function load() {
          var raw = null;
          try {
            raw = localStorage.getItem(KEY);
            lsGone = raw == null;
            var s = JSON.parse(raw);
            if (s && s.tx) S = s;
          } catch (e) {
            lsGone = true;
          }
          try {
            norm();
          } catch (e) {
            /* An unreadable payload must not brick the app on boot: keep the raw text aside and start clean. */
            try {
              if (raw) localStorage.setItem(KEY + '-broken-' + Date.now(), raw);
            } catch (e2) {}
            S = { tx: [], bud: {}, theme: S.theme };
            norm();
            loadBroken = true;
          }
          /* Ids must be unique before anything can delete by id, and any duplicates left by
             an older build are repaired here rather than silently collapsing rows later. */
          seedIds();
          if (dedupeIds()) save();
        }
        var loadBroken = false,
          lsGone = false;
        function arr(v) {
          return Array.isArray(v) ? v : [];
        }
        function norm() {
          /* Every field is repaired here: a backup (or an older build) with a missing or
             half-written field must never be able to crash a render. */
          S.tx = arr(S.tx).filter(function (t) {
            return t && typeof t.amount === 'number' && isFinite(t.amount) && /^\d{4}-\d\d-\d\d$/.test(t.date);
          });
          S.goals = arr(S.goals);
          S.ob = arr(S.ob).map(Number);
          S.accs = arr(S.accs).filter(function (n) {
            return typeof n === 'string' && n.trim();
          });
          if (!S.accs.length) S.accs = ['نقد', 'حساب بانکی', 'کارت اعتباری'];
          ACCS = S.accs;
          S.rec = arr(S.rec);
          S.loans = arr(S.loans);
          S.off = arr(S.off).filter(function (i) {
            return Number.isInteger(i) && i >= 0 && i < S.accs.length;
          });
          S.ppl = arr(S.ppl);
          S.assets = arr(S.assets);
          S.debts = arr(S.debts);
          S.aem = arr(S.aem);
          /* شمارهٔ کارت و رنگ کارت روی پشت کارت دیده می‌شوند. هر دو اختیاری‌اند
             و باید همیشه هم‌طول با فهرست حساب‌ها بمانند. */
          S.acno = arr(S.acno).map(function (x) {
            return String(digits(typeof x === 'string' ? x : '')).slice(0, 19);
          });
          S.acol = arr(S.acol).map(function (x) {
            x = parseInt(x, 10);
            return x >= 0 && x < 5 ? x : 0;
          });
          while (S.aem.length < S.accs.length) S.aem.push('');
          while (S.acno.length < S.accs.length) S.acno.push('');
          while (S.acol.length < S.accs.length) S.acol.push(0);
          S.bud = S.bud && typeof S.bud === 'object' && !Array.isArray(S.bud) ? S.bud : {};
          while (S.ob.length < S.accs.length) S.ob.push(0);
          S.unit = S.unit === 'R' ? 'R' : 'T';
          S.cats =
            S.cats && typeof S.cats === 'object' && !Array.isArray(S.cats) ? S.cats : { out: [], in: [] };
          if (!BASE0) {
            BASE0 = { out: CATS.out.slice(), in: CATS.in.slice() };
            BASE0.out.splice(BASE0.out.length - 1, 0, 'اقساط');
            STY['اقساط'] = ['🏦', '#ff6b35'];
            STY = new Proxy(STY, {
              get: function (o, k) {
                return o[k] || ['•', '#8e8e93'];
              },
            });
          }
          if (!S.cl || typeof S.cl !== 'object' || Array.isArray(S.cl)) S.cl = {};
          ['out', 'in'].forEach(function (k) {
            /* A backup may carry only one side of the list; rebuild just the missing half. */
            if (!Array.isArray(S.cl[k]))
              S.cl[k] = BASE0[k]
                .map(function (n) {
                  var s = STY[n] || ['•', '#8e8e93'];
                  return { n: n, e: s[0], c: s[1] };
                })
                .concat(
                  ((S.cats && S.cats[k]) || []).map(function (c) {
                    return { n: c.n, e: c.e, c: '#8e8e93' };
                  }),
                );
          });
          ['out', 'in'].forEach(function (k) {
            CATS[k] = S.cl[k].map(function (c) {
              STY[c.n] = [c.e, c.c];
              return c.n;
            });
          });
        }
        function save() {
          try {
            localStorage.setItem(KEY, JSON.stringify(S));
          } catch (e) {}
          mirror();
        }
        /* Date.now() has millisecond resolution, so two entries written in the same tick get
           the same id — and deleting one then deletes every row sharing it. This generator
           never repeats a value and is seeded from the data, so a restart cannot collide
           with records written by an earlier session. */
        var lastId = 0;
        function nid() {
          var t = Date.now();
          lastId = t > lastId ? t : lastId + 1;
          return lastId;
        }
        function seedIds() {
          var max = 0;
          ['tx', 'loans', 'goals', 'assets', 'debts', 'rec'].forEach(function (k) {
            arr(S[k]).forEach(function (x) {
              if (x && typeof x.id === 'number' && x.id > max) max = x.id;
            });
          });
          if (max > lastId) lastId = max;
        }
        /* Older data (and rapid taps before this fix) can already contain duplicate ids.
           Repair once per load, keeping the first record of each id untouched. */
        function dedupeIds() {
          var fixed = false;
          ['tx', 'loans', 'goals', 'assets', 'debts', 'rec'].forEach(function (k) {
            var seen = {};
            arr(S[k]).forEach(function (x) {
              if (!x) return;
              if (typeof x.id !== 'number' || seen[x.id]) {
                x.id = nid();
                fixed = true;
              }
              seen[x.id] = 1;
            });
          });
          return fixed;
        }
        /* ---------- Storage durability ----------
           localStorage holds the only copy of the ledger, and it is the first thing that
           goes when site data is cleared. An IndexedDB mirror is a separate store, so if
           localStorage ever comes back empty the data can be put back. */
        var MIR = 'hesab-mirror-v1',
          mirT = null,
          mirrorAt = 0;
        function mirDb() {
          return new Promise(function (res) {
            var rq;
            try {
              rq = indexedDB.open(MIR, 1);
            } catch (e) {
              return res(null);
            }
            rq.onupgradeneeded = function () {
              rq.result.createObjectStore('kv');
            };
            rq.onsuccess = function () {
              res(rq.result);
            };
            rq.onerror = function () {
              res(null);
            };
          });
        }
        function mirror() {
          if (mirT) return;
          mirT = setTimeout(function () {
            mirT = null;
            var raw;
            try {
              raw = JSON.stringify(S);
            } catch (e) {
              return;
            }
            mirDb().then(function (db) {
              if (!db) return;
              try {
                db.transaction('kv', 'readwrite').objectStore('kv').put({ t: Date.now(), raw: raw }, 'state');
              } catch (e) {}
            });
            mirrorAt = Date.now();
          }, 700);
        }
        function mirrorGet() {
          return mirDb().then(function (db) {
            if (!db) return null;
            return new Promise(function (res) {
              try {
                var rq = db.transaction('kv', 'readonly').objectStore('kv').get('state');
                rq.onsuccess = function () {
                  res(rq.result || null);
                };
                rq.onerror = function () {
                  res(null);
                };
              } catch (e) {
                res(null);
              }
            });
          });
        }
        /* Boot: localStorage wiped entirely but the mirror still has data means the main
           store was cleared. Only trigger on a genuinely missing key: a legitimately empty
           ledger must never be "rescued" over by a stale mirror. */
        function mirrorRescue() {
          if (!lsGone) return Promise.resolve(false);
          return mirrorGet().then(function (m) {
            if (!m || !m.raw) return false;
            try {
              var j = JSON.parse(m.raw);
              if (!j || !Array.isArray(j.tx)) return false;
              S = j;
              norm();
              seedIds();
              dedupeIds();
              save();
              render();
              toast('داده‌ها از حافظه‌ی پشتیبان برگشت');
              return true;
            } catch (e) {
              return false;
            }
          });
        }
        function storageInfo() {
          return Promise.all([
            navigator.storage && navigator.storage.persisted ? navigator.storage.persisted() : Promise.resolve(false),
            navigator.storage && navigator.storage.estimate ? navigator.storage.estimate() : Promise.resolve(null),
          ]);
        }
        /* ---------- Recovery points ----------
           A snapshot is taken before every destructive action and once a day on boot, so a
           bad edit, a bad restore or a mis-tap can be rolled back. Snapshots live in their own
           localStorage key: they cost nothing until something goes wrong. */
        var SNK = 'hesab-snap-v1',
          SNAP_MAX = 8;
        function snaps() {
          try {
            var a = JSON.parse(localStorage.getItem(SNK));
            return Array.isArray(a) ? a : [];
          } catch (e) {
            return [];
          }
        }
        function snapWrite(a) {
          try {
            localStorage.setItem(SNK, JSON.stringify(a));
          } catch (e) {}
        }
        function snapSave(label) {
          var a = snaps();
          a.unshift({
            id: nid(),
            l: label,
            tx: (S.tx || []).length,
            d: new Date().toISOString().slice(0, 10),
            s: JSON.parse(JSON.stringify(S)),
          });
          if (a.length > SNAP_MAX) a.length = SNAP_MAX;
          snapWrite(a);
          return a[0];
        }
        function snapFind(id) {
          return snaps().filter(function (x) {
            return x.id === id;
          })[0];
        }
        /* Restore replaces the whole state, so it is the safety net for the actions that can
           wipe everything. On any failure the previous state is put back. */
        function snapTo(id, note) {
          var x = snapFind(id);
          if (!x) return false;
          var prev = S;
          S = x.s;
          try {
            norm();
            render();
            save();
            toast(note || 'به حالت قبل برگشت');
            return true;
          } catch (e) {
            S = prev;
            norm();
            return false;
          }
        }
        /* Snapshot the current state, run a destructive action, then offer one-tap undo. */
        function snapAct(label, fn) {
          var s = snapSave(label);
          fn();
          toast(label, function () {
            snapTo(s.id, 'برگشت خورد');
          });
        }
        function snapDrop(id) {
          snapWrite(
            snaps().filter(function (x) {
              return x.id !== id;
            }),
          );
        }
        function snapWhen(id) {
          var ms = Date.now() - id;
          var h = Math.floor(ms / 36e5);
          if (h < 1) return 'همین حالا';
          if (h < 24) return fr0(h) + ' ساعت پیش';
          return fr0(Math.floor(h / 24)) + ' روز پیش';
        }
        var PF = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }),
          PC = Object.create(null);
        /* Always hand back a fresh object. Callers keep a reference to the result and write to it
           (cur is navigated month by month), so returning the cached instance would let a month
           change rewrite the cached calendar entry, and inM() would then compare an object with
           itself and match every month. */
        function parts(iso) {
          var c = PC[iso];
          if (!c) {
            var o = {};
            var dt = new Date(iso + 'T12:00:00Z');
            if (isNaN(dt)) return parts(today());
            PF.formatToParts(dt).forEach(function (x) {
              o[x.type] = x.value;
            });
            c = PC[iso] = { y: +o.year, m: +o.month, d: +o.day };
          }
          return { y: c.y, m: c.m, d: c.d };
        }
        function today() {
          var d = new Date();
          return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        }
        var SF = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
        function sd(iso) {
          var dt = new Date(iso + 'T12:00:00Z');
          return isNaN(dt) ? '' : SF.format(dt);
        }
        /* Search normalisation: Persian text typed on different keyboards, with Persian or ASCII
           digits, with or without ZWNJ, must still match. Display text is never changed. */
        function foldFa(s) {
          return String(s == null ? '' : s)
            .replace(/[يى]/g, 'ی')
            .replace(/ك/g, 'ک')
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/[ؤئ]/g, 'ی')
            .replace(/ۀ/g, 'ه')
            .replace(/[ً-ْٰـ]/g, '')
            .replace(/[۰-۹]/g, function (d) {
              return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
            })
            .replace(/[٠-٩]/g, function (d) {
              return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d));
            })
            .replace(/‌|‏|‎/g, '')
            .toLowerCase();
        }
        function digits(s) {
          return s
            .replace(/[۰-۹]/g, function (d) {
              return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);
            })
            .replace(/[٠-٩]/g, function (d) {
              return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);
            })
            .replace(/[^\d]/g, '');
        }
        cur = parts(today());
        function inM(t, y, m) {
          var p = parts(t.date);
          return p.y === y && p.m === m;
        }
        function sum(arr, type) {
          return arr
            .filter(function (t) {
              return t.type === type;
            })
            .reduce(function (a, t) {
              return a + t.amount;
            }, 0);
        }
        function shift(y, m, n) {
          m += n;
          while (m > 12) {
            m -= 12;
            y++;
          }
          while (m < 1) {
            m += 12;
            y--;
          }
          return [y, m];
        }
        function monthTx() {
          return S.tx
            .filter(function (t) {
              return inM(t, cur.y, cur.m);
            })
            .sort(function (a, b) {
              return a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id;
            });
        }
        /* Newest transaction date overall, or null when there is nothing at all. */
        function newestTx() {
          if (!S.tx.length) return null;
          var d = '';
          for (var i = 0; i < S.tx.length; i++) if (S.tx[i].date > d) d = S.tx[i].date;
          return d || null;
        }
        function mLabel(y, m) {
          return MN[m - 1] + ' ' + String(y).replace(/\d/g, function (c) { return '۰۱۲۳۴۵۶۷۸۹'[c]; });
        }
        /* Month of the newest transaction, but only when it is not the month on screen. */
        function jumpHint() {
          var d = newestTx();
          if (!d) return '';
          var p = parts(d);
          if (p.y === cur.y && p.m === cur.m) return '';
          return (
            '<div class="list" style="margin-top:10px"><div class="empty" style="padding:14px 16px">' +
            'این ماه چیزی ثبت نشده است.<br>آخرین تراکنش شما ' +
            sd(d) +
            ' است.</div>' +
            '<button class="r" data-jump="' +
            d +
            '"><div class="ic" style="background:var(--blue)22">↩</div><div class="m"><b>رفتن به ' +
            mLabel(p.y, p.m) +
            '</b></div></button></div>'
          );
        }
        function row(t) {
          var s = t.type === 'tf' ? ['⇄', '#8e8e93'] : STY[t.cat] || STY['سایر'];
          return (
            '<button class="r" data-edit="' +
            t.id +
            '"><div class="ic" style="background:' +
            s[1] +
            '22">' +
            s[0] +
            '</div><div class="m"><b>' +
            esc(t.note || t.cat || 'انتقال بین حساب‌ها') +
            '</b><small>' +
            (t.type === 'tf' ? 'انتقال' : esc(t.cat || '')) +
            ' · ' +
            esc(ACCS[t.acc || 0] || '') +
            (t.type === 'tf' ? ' ← ' + esc(ACCS[t.to || 0] || '') : '') +
            (t.p ? ' · 👤 ' + esc(t.p) : '') +
            '</small></div><div class="v ' +
            (t.type === 'in' ? 'i' : 'o') +
            '">' +
            (t.type === 'in' ? '+' : t.type === 'tf' ? '' : '−') +
            fa(t.amount) +
            '</div></button>'
          );
        }
        function byCat(arr) {
          var by = {};
          arr
            .filter(function (t) {
              return t.type === 'out';
            })
            .forEach(function (t) {
              by[t.cat] = (by[t.cat] || 0) + t.amount;
            });
          return by;
        }
        function mhead(title) {
          /* وقتی روی ماهی غیر از ماه جاری هستیم، راه برگشت لازم است.
             data-m="0" یعنی همین ماه جاری؛ shift خودش صفر را به ماه
             جاری می‌برد، پس فقط باید دکمه را نشان بدهیم. */
          var tp = parts(today()),
            off = tp.y !== cur.y || tp.m !== cur.m;
          return (
            '<div class="head"><h1>' +
            title +
            '</h1><div class="mn">' +
            (off
              ? '<button data-m="0" class="mnow" aria-label="برگشت به امروز">امروز</button>'
              : '') +
            '<button data-m="-1" aria-label="ماه قبل"><svg class="chv" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button><span>' +
            MN[cur.m - 1] +
            ' ' +
            String(cur.y).replace(/\d/g, function (d) {
              return '۰۱۲۳۴۵۶۷۸۹'[d];
            }) +
            '</span><button data-m="1" aria-label="ماه بعد"><svg class="chv" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div></div>'
          );
        }

        function home() {
          var mt = monthTx(),
            inc = sum(mt, 'in'),
            exp = sum(mt, 'out'),
            total =
              ACCS.reduce(function (s, n, i) {
                return S.off.indexOf(i) > -1 ? s : s + accBal(i);
              }, 0) + assetsTotal();
          var h = mhead(nameBtn());
          h += alertsHtml();
          h += walletHtml(total, inc, exp);
          var tp = parts(today()),
            dd = tp.y === cur.y && tp.m === cur.m ? tp.d : dim(cur.y, cur.m),
            big = mt
              .filter(function (t) {
                return t.type === 'out';
              })
              .sort(function (a, b) {
                return b.amount - a.amount;
              })[0];
          h +=
            '<div class="card"><h2>خلاصه ماه</h2><div class="ins"><div><b>' +
            (inc ? fr0(Math.round(((inc - exp) / inc) * 100)) + '٪' : '—') +
            '</b><small>نرخ پس‌انداز</small></div><div><b>' +
            fa(Math.round(exp / dd)) +
            '</b><small>میانگین هزینه روزانه</small></div><div><b>' +
            (big ? fa(big.amount) : '—') +
            '</b><small>بزرگ‌ترین هزینه' +
            (big ? ' · ' + esc(big.cat) : '') +
            '</small></div></div></div>';
          var ms = [],
            mx = 1;
          for (var i = 5; i >= 0; i--) {
            var p = shift(cur.y, cur.m, -i),
              a = S.tx.filter(function (t) {
                return inM(t, p[0], p[1]);
              });
            var o = { n: MN[p[1] - 1], i: sum(a, 'in'), e: sum(a, 'out'), on: i === 0 };
            mx = Math.max(mx, o.i, o.e);
            ms.push(o);
          }
          h +=
            '<div class="card"><h2>روند ۶ ماه اخیر</h2><div class="chart">' +
            ms
              .map(function (o) {
                return (
                  '<div class="c' +
                  (o.on ? ' on' : '') +
                  '"><div class="bs"><i style="height:' +
                  (o.i / mx) * 100 +
                  '%;background:var(--grn)"></i><i style="height:' +
                  (o.e / mx) * 100 +
                  '%;background:var(--red)"></i></div><label>' +
                  o.n +
                  '</label></div>'
                );
              })
              .join('') +
            '</div><div class="leg"><span><i style="background:var(--grn)"></i>درآمد</span><span><i style="background:var(--red)"></i>هزینه</span></div></div>';
          h += cmpHtml();
          var by = byCat(mt),
            ks = Object.keys(by).sort(function (a, b) {
              return by[b] - by[a];
            });
          if (ks.length) {
            var acc = 0,
              cg = ks
                .map(function (k) {
                  var s = (acc / exp) * 100;
                  acc += by[k];
                  return STY[k][1] + ' ' + s + '% ' + (acc / exp) * 100 + '%';
                })
                .join(',');
            h +=
              '<div class="card"><h2>هزینه‌ها بر اساس دسته</h2><div class="donut"><div class="ring" style="background:conic-gradient(' +
              cg +
              ')"><div><span><b>' +
              fr0(ks.length) +
              '</b>دسته</span></div></div><div class="lg">' +
              ks
                .slice(0, 5)
                .map(function (k) {
                  return (
                    '<div><i style="background:' +
                    STY[k][1] +
                    '"></i><span>' +
                    k +
                    '</span><em>' +
                    fr0(Math.round((by[k] / exp) * 100)) +
                    '٪</em></div>'
                  );
                })
                .join('') +
              '</div></div></div>';
          }
          if (S.loans.length) h += loansHtml();
          /* Only real categories: a key left behind by an older build or a
             hand-edited backup used to render as a nameless row here. */
          var bk = Object.keys(S.bud)
            .filter(function (k) {
              return S.bud[k] > 0 && CATS.out.indexOf(k) >= 0;
            })
            .sort(function (a, b) {
              return (by[b] || 0) / S.bud[b] - (by[a] || 0) / S.bud[a];
            })
            .slice(0, 3);
          if (bk.length) h += '<div class="list"><div class="t">بودجه</div>' + bk.map(bRow.bind(null, by)).join('') + '</div>';
          h +=
            '<div class="list"><div class="t">آخرین تراکنش‌ها</div>' +
            (mt.length ? mt.slice(0, 5).map(row).join('') : '<div class="empty">این ماه تراکنشی ثبت نشده. با دکمه + شروع کنید.</div>') +
            '</div>';
          return h + jumpHint();
        }
        function bRow(by, k) {
          var l = S.bud[k],
            u = by[k] || 0,
            p = u / l;
          return (
            '<div class="bud"><div class="top"><div class="ic" style="background:' +
            STY[k][1] +
            '22">' +
            STY[k][0] +
            '</div><div class="m" style="flex:1"><b style="font-weight:500">' +
            k +
            '</b><small style="color:var(--mute);font-size:12.5px">' +
            fa(u) +
            ' از ' +
            fa(l) +
            '</small></div><div class="v" style="color:' +
            (p > 1 ? 'var(--red)' : p > 0.8 ? 'var(--org)' : 'var(--grn)') +
            '">' +
            fr0(Math.round(p * 100)) +
            '٪</div></div><div class="prog"><i style="width:' +
            Math.min(p, 1) * 100 +
            '%;background:' +
            (p > 1 ? 'var(--red)' : p > 0.8 ? 'var(--org)' : 'var(--blue)') +
            '"></i></div></div>'
          );
        }
        function txs() {
          var h =
            mhead('تراکنش‌ها') +
            '<input class="search" id="q" placeholder="جستجو" value="' +
            esc(q) +
            '"><div class="seg">' +
            [
              ['all', 'همه'],
              ['in', 'درآمد'],
              ['out', 'هزینه'],
            ]
              .map(function (x) {
                return '<button data-f="' + x[0] + '" aria-pressed="' + (flt === x[0]) + '">' + x[1] + '</button>';
              })
              .join('') +
            '</div>';
          h +=
            '<div class="seg">' +
            [[-1, 'همه حساب‌ها']]
              .concat(
                AO(-1).map(function (i) {
                  return [i, ACCS[i]];
                }),
              )
              .map(function (x) {
                return '<button data-af="' + x[0] + '" aria-pressed="' + (aflt === x[0]) + '">' + x[1] + '</button>';
              })
              .join('') +
            '</div>';
          var qf = foldFa(q);
          var a = (
            q
              ? S.tx.slice().sort(function (a, b) {
                  return a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id;
                })
              : monthTx()
          ).filter(function (t) {
            return (
              (flt === 'all' || t.type === flt) &&
              (aflt < 0 || (t.acc || 0) === aflt) &&
              (!q || foldFa((t.note || '') + ' ' + (t.cat || '') + ' ' + (t.p || '')).indexOf(qf) > -1)
            );
          });
          if (!a.length) {
            var jh = jumpHint();
            return (
              h +
              '<div class="list"><div class="empty">' +
              (q || flt !== 'all' || aflt >= 0 ? 'تراکنشی پیدا نشد.' : 'این ماه تراکنشی ثبت نشد.') +
              '</div></div>' +
              (q || flt !== 'all' || aflt >= 0 ? '' : jh)
            );
          }
          var days = {};
          a.forEach(function (t) {
            (days[t.date] = days[t.date] || []).push(t);
          });
          return (
            h +
            Object.keys(days)
              .sort()
              .reverse()
              .map(function (d) {
                var ds = days[d];
                return (
                  '<div class="list"><div class="t">' +
                  sd(d) +
                  ' · ' +
                  fa(sum(ds, 'in') - sum(ds, 'out')) +
                  '</div>' +
                  ds.map(row).join('') +
                  '</div>'
                );
              })
              .join('')
          );
        }
        function budCaps() {
          var by = byCat(monthTx());
          return (
            '<div class="list"><div class="t">سقف ماهانه هر دسته (' +
            (S.unit === 'R' ? 'ریال' : 'تومان') +
            ')</div>' +
            CATS.out.map(budRow.bind(null, by)).join('') +
            '</div>'
          );
        }
        /* یک خط: ایموجی، نام، نوار پیشرفت، درصد و خودِ سقف. دستهٔ بدون سقف
           هم نوار می‌گیرد تا ورودی‌ها در یک ستون راستا بمانند. */
        function budRow(by, k) {
          var l = S.bud[k] || 0,
            u = by[k] || 0,
            pr = l ? u / l : 0,
            col = pr > 1 ? 'var(--red)' : pr > 0.8 ? 'var(--org)' : 'var(--blue)';
          return (
            '<div class="bud brow"><span class="ic" style="background:' +
            STY[k][1] +
            '22">' +
            STY[k][0] +
            '</span><b class="nm">' +
            k +
            '</b><span class="bar">' +
            (l ? '<i style="width:' + Math.min(pr, 1) * 100 + '%;background:' + col + '"></i>' : '') +
            '</span>' +
            (l ? '<em class="pc" style="color:' + col + '">' + fr0(Math.round(pr * 100)) + '٪</em>' : '') +
            '<input data-b="' +
            k +
            '" inputmode="numeric" placeholder="بدون سقف" value="' +
            (l ? fi(l) : '') +
            '"></div>'
          );
        }
        /* Storage durability: how much room is left, whether the browser will protect the data,
           and when the IndexedDB mirror last ran. */
        var stOk = false,
          stEst = null;
        function storageHtml(ok, est) {
          var used = est && est.usage ? est.usage : 0,
            quota = est && est.quota ? est.quota : 0,
            mb = function (n) {
              return n > 1048576 ? fr0(Math.round(n / 1048576)) + ' مگابایت' : fr0(Math.round(n / 1024)) + ' کیلوبایت';
            },
            pct = quota ? Math.min(100, Math.max(0.6, (used / quota) * 100)) : 0,
            ago = mirrorAt ? snapWhen(mirrorAt) : 'هنوز نه';
          return (
            '<div class="card"><h2>حافظه<small>نگه‌داری داده در مرورگر</small></h2>' +
            '<div class="ins" style="margin:0 0 10px"><div><b>' +
            mb(used) +
            '</b><small>حجم داده</small></div><div><b>' +
            (quota ? fr0(Math.round(pct * 10) / 10) + '٪' : '—') +
            '</b><small>از فضای مجاز</small></div><div><b style="color:' +
            (ok ? 'var(--grn)' : 'var(--org)') +
            '">' +
            (ok ? 'فعال' : 'خیر') +
            '</b><small>ذخیره‌سازی پایدار</small></div></div>' +
            '<div class="prog"><i style="width:' +
            pct +
            '%;background:' +
            (ok ? 'var(--grn)' : 'var(--org)') +
            '"></i></div>' +
            (ok
              ? ''
              : '<p style="margin:10px 0 0;font-size:12.5px;color:var(--mute);line-height:1.8">مرورگر هنوز این داده را «پایدار» نکرده، یعنی در فشار فضا ممکن است پاکش کند. اگر برنامه را به صفحه‌ی اصلی اضافه کنی، مرورگر آن را نگه می‌دارد.</p>') +
            '<p style="margin:8px 0 0;font-size:12.5px;color:var(--mute);line-height:1.8">یک کپی داده در IndexedDB نگه داشته می‌شود؛ اگر حافظه‌ی مرورگر خالی شد، برنامه سراغ آن می‌رود. آخرین همگام‌سازی: ' +
            ago +
            '.</p>' +
            '<button class="btn g" data-x="persists" style="margin-top:10px">درخواست ذخیره‌سازی پایدار</button></div>'
          );
        }
        /* ---------- JSON file import / export ---------- */
        function saveBlob(text, name, type) {
          try {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([text], { type: type }));
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(function () {
              URL.revokeObjectURL(a.href);
            }, 3000);
            return true;
          } catch (e) {
            return false;
          }
        }
        function exportJson() {
          var name = 'hesab-backup-' + today() + '.json',
            txt = JSON.stringify(S, null, 1);
          if (!saveBlob(txt, name, 'application/json;charset=utf-8')) {
            $('bk').value = txt;
            $('bk').select();
          }
        }
        /* The file only fills the box; restoring is still a separate, confirmable press,
           so a wrong file never silently replaces the ledger. */
        function importJsonFile(file) {
          if (!file) return;
          if (file.size > 12 * 1024 * 1024) {
            toast('فایل خیلی بزرگ است');
            return;
          }
          var fr = new FileReader();
          fr.onerror = function () {
            toast('فایل خوانده نشد');
          };
          fr.onload = function () {
            var txt = String(fr.result || '');
            var okJson = false;
            try {
              var j = JSON.parse(txt);
              okJson = j && Array.isArray(j.tx);
            } catch (e) {}
            $('bk').value = txt;
            if (!okJson) {
              $('bk').placeholder = 'محتوای فایل معتبر نیست؛ داده‌های فعلی دست‌نخورده ماند.';
              toast('این فایل قالب برنامه را ندارد');
              return;
            }
            $('bk').placeholder = 'فایل خوانده شد؛ برای بازیابی دکمه را بزن.';
            toast('فایل خوانده شد؛ برای بازیابی «بازیابی» را بزن');
          };
          fr.readAsText(file);
        }
        function set() {
          return (
            '<div class="head"><h1>تنظیمات</h1></div>' +
            '<div class="card"><h2>ظاهر</h2><div class="seg" style="margin:0">' +
            [
              ['auto', 'خودکار'],
              ['light', 'روشن'],
              ['dark', 'تیره'],
            ]
              .map(function (x) {
                return '<button data-t="' + x[0] + '" aria-pressed="' + (S.theme === x[0]) + '">' + x[1] + '</button>';
              })
              .join('') +
            '</div>' +
            swatches() +
            '</div>' +
            pwaHtml() +
            storageHtml(stOk, stEst) +
            recHtml() +
            pplHtml() +
            exportHtml() +
            '<div class="card"><h2>پشتیبان‌گیری<small>' +
            fr0(S.tx.length) +
            ' تراکنش</small></h2><div style="display:flex;gap:6px;margin-bottom:10px"><button class="btn g" data-x="dljson" style="margin:0;flex:1;font-size:14px;padding:11px 8px">دانلود فایل JSON</button><button class="btn g" data-x="upjson" style="margin:0;flex:1;font-size:14px;padding:11px 8px">خواندن فایل JSON</button></div><textarea id="bk" placeholder="یا متن پشتیبان را اینجا بچسبانید"></textarea><button class="btn g" data-x="exp">نمایش پشتیبان برای کپی</button><button class="btn g" data-x="imp">بازیابی</button><input type="file" id="bf" accept=".json,application/json,text/json" hidden></div>' +
            '<div class="card"><button class="btn d" data-x="rst" style="margin:0">حذف همه داده‌ها</button></div><p class="empty">داده‌ها فقط روی همین مرورگر ذخیره می‌شوند.</p>'
          );
        }
        function render() {
          norm();
          var h = { home: home, tx: txs, bud: bud, set: set }[tab]();
          $('app').innerHTML = h;
          /* کیف پول تازه در صفحه نشسته؛ اندازه‌اش را می‌خوانیم و نوار را
             آمادهٔ جابه‌جایی می‌کنیم. */
          $('bar').innerHTML = TABS.map(function (t) {
            return (
              '<button role="tab" data-tab="' +
              t[0] +
              '" aria-selected="' +
              (tab === t[0]) +
              '"><svg viewBox="0 0 24 24">' +
              t[2] +
              '</svg>' +
              t[1] +
              '</button>'
            );
          }).join('');
          var th = S.theme === 'auto' ? '' : S.theme;
          if (th) document.documentElement.dataset.theme = th;
          else document.documentElement.removeAttribute('data-theme');
          var ac = ACC[S.accent] || ACC.blue;
          if (ac.c) document.documentElement.style.setProperty('--blue', ac.c);
          else document.documentElement.style.removeProperty('--blue');
        }

        function openSheet(id) {
          editId = id || null;
          var t = id
            ? S.tx.filter(function (x) {
                return x.id === id;
              })[0]
            : Object.assign({ type: 'out', amount: '', cat: '', acc: AO(-1)[0], date: today(), note: '' }, smsPre);
          smsPre = null;
          sType = t.type;
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' +
            (id ? 'ویرایش تراکنش' : 'تراکنش جدید') +
            '</h3>' +
            (id ? '' : '<button class="btn g" data-x="sms" style="margin:0 0 12px">📩 چسباندن پیامک بانک</button>') +
            '<div class="seg"><button data-st="out" aria-pressed="' +
            (sType === 'out') +
            '">هزینه</button><button data-st="in" aria-pressed="' +
            (sType === 'in') +
            '">درآمد</button><button data-st="tf" style="flex:.55;font-size:12px" aria-pressed="' +
            (sType === 'tf') +
            '">انتقال</button></div><div class="fld tx"><label class="full">مبلغ<input id="fa" class="amt" inputmode="numeric" placeholder="۰" value="' +
            (t.amount ? fi(t.amount) : '') +
            '"></label><label id="fcl">دسته<select id="fc"></select></label><label><span id="fal">حساب</span><select id="fk">' +
            AO(t.acc || 0)
              .map(function (i) {
                var n = ACCS[i];
                return '<option value="' + i + '"' + ((t.acc || 0) === i ? ' selected' : '') + '>' + n + '</option>';
              })
              .join('') +
            '</select></label><label id="ftl" hidden>به حساب<select id="ft">' +
            AO(t.to != null ? t.to : -1)
              .map(function (i) {
                var n = ACCS[i];
                return (
                  '<option value="' +
                  i +
                  '"' +
                  ((t.to != null
                    ? t.to
                    : AO(-1).filter(function (x) {
                        return x !== (t.acc || 0);
                      })[0]) === i
                    ? ' selected'
                    : '') +
                  '>' +
                  n +
                  '</option>'
                );
              })
              .join('') +
            '</select></label><label>تاریخ<button type="button" id="fd" data-x="cal" style="color:var(--blue);font-weight:600;font-size:16px"></button></label>' +
            personField(t) +
            '<label class="full">توضیح<input id="fn" placeholder="اختیاری" value="' +
            esc(t.note || '') +
            '" style="direction:rtl;text-align:left"></label></div>' +
            /* تکرار و «شخص جدید» کم‌کاربردند و فرم را شلوغ می‌کنند. اگر مقداری
               ندارند تا وقتی کاربر خودش باز نکند اصلاً دیده نمی‌شوند — و اگر
               دارند باز می‌آیند، وگرنه کسی که «تکرار» را زده بود بعداً می‌فهمد
               که تراکنش تکرار نشده. */
            moreBox(
              [
                id
                  ? ''
                  : '<label>تکرار<select id="fr"><option value="0">بدون تکرار</option><option value="m">هر ماه</option><option value="w">هر هفته</option><option value="d">هر روز</option></select></label>',
              ].join(''),
              moreWanted(t),
              'تکرار',
            ) +
            '<button class="btn" data-x="save">ذخیره</button>' +
            (id
              ? '<button class="btn g" data-x="dup">تکرار با تاریخ امروز</button><button class="btn d" data-x="del">حذف تراکنش</button>'
              : '');
          fillCats(t.cat);
          dateSel(t.date);
          $('ov').classList.add('on');
          $('sh').classList.add('on');
          setTimeout(function () {
            var f = $('fa');
            if (!id && f) f.focus();
          }, 350);
        }
        function pn(n) {
          return String(n).replace(/\d/g, function (d) {
            return '۰۱۲۳۴۵۶۷۸۹'[d];
          });
        }
        function j2g(y, m, d) {
          for (var dd = d, lo = Math.min(d, 28); dd >= lo; dd--) {
            var tk = y * 10000 + m * 100 + dd,
              dt = new Date(Date.UTC(y + 621, 2, 21) + ((m < 7 ? (m - 1) * 31 : 186 + (m - 7) * 30) + dd - 1) * 864e5);
            for (var i = 0; i < 8; i++) {
              var iso = dt.toISOString().slice(0, 10),
                p = parts(iso),
                k = p.y * 10000 + p.m * 100 + p.d;
              if (k === tk) return iso;
              dt = new Date(dt.getTime() + (k < tk ? 1 : -1) * 864e5);
            }
          }
          return today();
        }
        function showSheet() {
          $('ov').classList.add('on');
          $('sh').classList.remove('out', 'in', 'tf');
          $('sh').classList.add('on');
        }
        function openName() {
          $('sh').innerHTML =
            '<div class="grab"></div><h3>نام شما</h3><div class="fld"><label>نام<input id="nmi" placeholder="مثلاً مهدی" value="' +
            esc(S.name || '') +
            '" style="direction:rtl;text-align:left"></label></div><button class="btn" data-x="savename">ذخیره</button>';
          showSheet();
          setTimeout(function () {
            var f = $('nmi');
            if (f) f.focus();
          }, 350);
        }
        function gRow(g) {
          var p = Math.min(g.saved / g.target, 1);
          return (
            '<button class="bud" data-goal="' +
            g.id +
            '" style="width:100%;text-align:right;display:block"><div class="top"><div class="ic" style="background:#34c75922">🎯</div><div class="m" style="flex:1"><b style="font-weight:500">' +
            esc(g.name) +
            '</b><small style="color:var(--mute);font-size:12.5px;display:block">' +
            fa(g.saved) +
            ' از ' +
            fa(g.target) +
            '</small></div><div class="v" style="color:var(--grn)">' +
            fr0(Math.round(p * 100)) +
            '٪</div></div><div class="prog"><i style="width:' +
            p * 100 +
            '%;background:var(--grn)"></i></div></button>'
          );
        }
        function goalsHtml() {
          return (
            '<div class="list"><div class="t">اهداف پس‌انداز</div>' +
            S.goals.map(gRow).join('') +
            '<button class="r" data-x="gopen" style="color:var(--blue);font-weight:600"><div class="ic" style="background:var(--fill)">+</div>هدف جدید</button></div>'
          );
        }
        function openGoal(id) {
          editId = id || null;
          var g = id
            ? S.goals.filter(function (x) {
                return x.id === id;
              })[0]
            : null;
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' +
            (g ? esc(g.name) : 'هدف جدید') +
            '</h3>' +
            (g
              ? '<div class="fld"><label>مبلغ<input id="ga" class="amt" inputmode="numeric" placeholder="۰"></label></div><button class="btn" data-x="gadd">افزودن به هدف</button><button class="btn g" data-x="gsub">برداشت از هدف</button>' +
                '<div class="t" style="margin:14px 0 6px">ویرایش</div><div class="fld"><label>نام هدف<input id="gn" placeholder="مثلاً سفر" value="' +
                esc(g.name) +
                '" style="direction:rtl;text-align:left"></label><label>مبلغ هدف<input id="gt" class="amt" inputmode="numeric" placeholder="۰" value="' +
                fi(g.target) +
                '"></label></div><button class="btn" data-x="gsave">ذخیره‌ی تغییرات</button><button class="btn d" data-x="gdel">حذف هدف</button>'
              : '<div class="fld"><label>نام هدف<input id="gn" placeholder="مثلاً سفر" style="direction:rtl;text-align:left"></label><label>مبلغ هدف<input id="ga" class="amt" inputmode="numeric" placeholder="۰"></label></div><button class="btn" data-x="gnew">ذخیره</button>');
          showSheet();
        }
        function goalAct(k) {
          var a = P(($('ga') || { value: '' }).value),
            g = S.goals.filter(function (x) {
              return x.id === editId;
            })[0];
          if (k === 'gnew') {
            var n = ($('gn').value || '').trim();
            if (!n || !a) return;
            S.goals.push({ id: nid(), name: n, target: a, saved: 0 });
          } else if (k === 'gsave' && g) {
            var gn = (($('gn') || {}).value || '').replace(/[<>&"]/g, '').trim(),
              gt = P(($('gt') || { value: '' }).value);
            if (!gn || !gt) return;
            g.name = gn;
            g.target = gt;
            if (g.saved > gt) g.saved = gt;
          } else if (g) {
            if (k === 'gdel')
              S.goals = S.goals.filter(function (x) {
                return x !== g;
              });
            else if (a) g.saved = k === 'gadd' ? g.saved + a : Math.max(0, g.saved - a);
            else return;
          }
          save();
          closeSheet();
          render();
        }
        function dim(y, m) {
          return m < 7 ? 31 : m < 12 ? 30 : parts(j2g(y, 12, 30)).d === 30 ? 30 : 29;
        }
        function dateSel(iso) {
          pickISO = iso;
          $('fd').textContent = sd(iso);
        }
        function getDate() {
          return pickISO;
        }
        function openCal() {
          var p = parts(pickISO);
          cal.y = p.y;
          cal.m = p.m;
          drawCal();
          $('cov').classList.add('on');
          $('cal').classList.add('on');
        }
        function closeCal() {
          $('cov').classList.remove('on');
          $('cal').classList.remove('on');
        }
        function drawCal() {
          var sp = parts(pickISO),
            tp = parts(today()),
            first = (new Date(j2g(cal.y, cal.m, 1) + 'T12:00:00Z').getUTCDay() + 1) % 7,
            n = dim(cal.y, cal.m),
            h =
              '<div class="ch"><button data-c="-1" aria-label="ماه قبل"><svg class="chv" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button><b>' +
              MN[cal.m - 1] +
              ' ' +
              pn(cal.y) +
              '</b><button data-c="1" aria-label="ماه بعد"><svg class="chv" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div><div class="cg">' +
              ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
                .map(function (x) {
                  return '<span>' + x + '</span>';
                })
                .join('');
          for (var i = 0; i < first; i++) h += '<i></i>';
          for (var d = 1; d <= n; d++) {
            var c = sp.y === cal.y && sp.m === cal.m && sp.d === d ? 'sel' : tp.y === cal.y && tp.m === cal.m && tp.d === d ? 'td' : '';
            h += '<button class="' + c + '" data-pd="' + d + '">' + pn(d) + '</button>';
          }
          $('cal').innerHTML =
            h + '</div><div class="cf"><button data-x="ctoday">امروز</button><button data-x="cclose">بستن</button></div>';
        }
        function addDays(iso, n) {
          return new Date(Date.parse(iso + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);
        }
        function nextDate(iso, f, ad) {
          if (f === 'w') return addDays(iso, 7);
          if (f === 'd') return addDays(iso, 1);
          var p = parts(iso),
            y = p.y,
            m = p.m + 1;
          if (m > 12) {
            m = 1;
            y++;
          }
          return j2g(y, m, ad || p.d);
        }
        function runPending() {
          var td = today(),
            n = 0;
          S.rec.forEach(function (r) {
            var g = 0;
            while (r.next <= td && g++ < 60) {
              S.tx.push({
                id: nid(),
                type: r.type,
                amount: r.amount,
                cat: r.cat,
                acc: r.acc,
                date: r.next,
                note: r.note,
                p: r.p,
                rid: r.id,
              });
              r.next = nextDate(r.next, r.f, r.ad);
            }
          });
          if (n) save();
        }
        function recHtml() {
          return (
            '<div class="list"><div class="t">تراکنش‌های تکراری</div>' +
            (S.rec.length
              ? S.rec
                  .map(function (r) {
                    var s = STY[r.cat] || ['•', '#8e8e93'];
                    return (
                      '<div class="r"><div class="ic" style="background:' +
                      s[1] +
                      '22">' +
                      s[0] +
                      '</div><div class="m"><b>' +
                      esc(r.note || r.cat) +
                      '</b><small>' +
                      { m: 'هر ماه', w: 'هر هفته', d: 'هر روز' }[r.f] +
                      ' · بعدی: ' +
                      sd(r.next) +
                      '</small></div><div class="v">' +
                      fa(r.amount) +
                      '</div><button data-rd="' +
                      r.id +
                      '" aria-label="حذف" style="color:var(--red);font-size:22px;padding:0 4px">×</button></div>'
                    );
                  })
                  .join('')
              : '<div class="empty">هنگام ثبت تراکنش، گزینه «تکرار» را انتخاب کنید.</div>') +
            '</div>'
          );
        }
        function pwaHtml() {
          return '<div class="card"><h2>نصب روی گوشی</h2><p style="margin:0;font-size:14px;color:var(--mute);line-height:1.8">آیفون: در Safari دکمه «اشتراک‌گذاری» و سپس «Add to Home Screen». اندروید: منوی Chrome و سپس «Install app».</p></div>';
        }
        function lNext(l) {
          var d = l.first,
            ad = parts(l.first).d;
          for (var i = 0; i < l.paid; i++) d = nextDate(d, 'm', ad);
          return d;
        }
        function lRow(l) {
          var p = l.paid / l.count,
            done = l.paid >= l.count,
            nx = done ? '' : lNext(l),
            late = !done && nx < today();
          return (
            '<button class="bud" data-loan="' +
            l.id +
            '" style="width:100%;text-align:right;display:block"><div class="top"><div class="ic" style="background:#ff950022">🏦</div><div class="m" style="flex:1"><b style="font-weight:500">' +
            esc(l.name) +
            '</b><small style="color:' +
            (late ? 'var(--red)' : 'var(--mute)') +
            ';font-size:12.5px;display:block">' +
            (done ? 'تسویه شد' : (late ? 'عقب‌افتاده · ' : 'قسط بعدی: ') + sd(nx)) +
            '</small></div><div class="v">' +
            fa(l.amount) +
            '</div></div><div class="prog"><i style="width:' +
            Math.min(p, 1) * 100 +
            '%;background:' +
            (late ? 'var(--red)' : 'var(--org)') +
            '"></i></div><small style="color:var(--mute);font-size:12px;display:block;margin-top:4px">' +
            fr0(l.paid) +
            ' از ' +
            fr0(l.count) +
            ' قسط · مانده ' +
            fa(Math.max(l.count - l.paid, 0) * l.amount) +
            '</small></button>'
          );
        }
        function loansHtml() {
          return (
            '<div class="list"><div class="t">وام‌ها و اقساط</div>' +
            S.loans.map(lRow).join('') +
            '<button class="r" data-x="lopen" style="color:var(--blue);font-weight:600"><div class="ic" style="background:var(--fill)">+</div>وام جدید</button></div>'
          );
        }
        function openLoan(id) {
          editId = id || null;
          var l = id
            ? S.loans.filter(function (x) {
                return x.id === id;
              })[0]
            : null;
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' +
            (l ? esc(l.name) : 'وام جدید') +
            '</h3>' +
            (l
              ? '<div class="fld"><label>مبلغ هر قسط<b>' +
                fa(l.amount) +
                '</b></label><label>پرداخت‌شده<b>' +
                fr0(l.paid) +
                ' از ' +
                fr0(l.count) +
                '</b></label></div>' +
                (l.paid < l.count ? '<button class="btn" data-x="lpay">ثبت پرداخت قسط</button>' : '') +
                '<div class="t" style="margin:14px 0 6px">ویرایش</div>'
              : '') +
            '<div class="fld"><label>نام وام<input id="ln" placeholder="مثلاً وام خودرو" value="' +
            esc(l ? l.name : '') +
            '" style="direction:rtl;text-align:left"></label><label>مبلغ هر قسط<input id="la" class="amt" inputmode="numeric" placeholder="۰" value="' +
            (l ? fi(l.amount) : '') +
            '"></label><label>تعداد اقساط<input id="lc" inputmode="numeric" placeholder="۱۲" value="' +
            (l ? fr0(l.count) : '') +
            '"></label><label>قسط‌های پرداخت‌شده<input id="lp" inputmode="numeric" placeholder="۰" value="' +
            (l ? fr0(l.paid) : '') +
            '"></label><label>پرداخت اولیه<input id="lq" class="amt" inputmode="numeric" placeholder="۰"></label>' +
            '<p style="margin:-6px 0 0;font-size:12.5px;color:var(--mute);line-height:1.7">اگر موقع گرفتن وام پیش‌پرداختی دادی، اینجا بنویس تا همان موقع یک تراکنش ثبت شود.</p>' +
            '<label>تاریخ اولین قسط<button type="button" id="fd" data-x="cal" style="color:var(--blue);font-weight:600;font-size:16px"></button></label><label>حساب پرداخت<select id="lk">' +
            AO(-1)
              .map(function (i) {
                return (
                  '<option value="' +
                  i +
                  '"' +
                  ((l ? l.acc || 0 : AO(-1)[0]) === i ? ' selected' : '') +
                  '>' +
                  esc(ACCS[i]) +
                  '</option>'
                );
              })
              .join('') +
            '</select></label></div>' +
            (l
              ? '<button class="btn" data-x="lsave">ذخیره‌ی تغییرات</button><button class="btn d" data-x="ldel">حذف وام</button>'
              : '<button class="btn" data-x="lnew">ذخیره</button>');
          showSheet();
          dateSel(l ? l.first : today());
        }
        function loanAct(k) {
          var l = S.loans.filter(function (x) {
            return x.id === editId;
          })[0];
          if (k === 'lnew' || k === 'lsave') {
            var n = ($('ln').value || '').replace(/[<>&"]/g, '').trim(),
              a = P($('la').value),
              c = parseInt(digits($('lc').value), 10) || 0,
              p = parseInt(digits($('lp').value), 10) || 0;
            if (!n || !a || !c) return;
            /* paid can never exceed the new count, and the start date is a real date */
            var rec = { name: n, amount: a, count: c, paid: Math.min(Math.max(0, p), c), first: getDate(), acc: +$('lk').value };
            /* پیش‌پرداخت، اگر کاربر مبلغی نوشته باشد. جدا از شمارش قسط‌هاست:
               ممکن است مبلغش برابر یک قسط کامل نباشد، پس paid را دست نمی‌زنیم
               و فقط یک تراکنش واقعی ثبت می‌کنیم. */
            var down = P($('lq') ? $('lq').value : '');
            if (k === 'lsave' && l) {
              /* instalments already posted for this loan follow the new amount */
              if (l.amount !== a) {
                S.tx.forEach(function (t) {
                  if (t.cat === 'اقساط' && t.note === l.name && t.amount === l.amount) t.amount = a;
                });
              }
              Object.keys(rec).forEach(function (k2) {
                l[k2] = rec[k2];
              });
            } else S.loans.push(Object.assign({ id: nid() }, rec));
            if (down) {
              S.tx.push({ id: nid(), type: 'out', amount: down, cat: 'اقساط', acc: rec.acc || 0, date: today(), note: rec.name + ' — پیش‌پرداخت' });
              cur = parts(today());
            }
          } else if (l) {
            if (k === 'ldel')
              S.loans = S.loans.filter(function (x) {
                return x !== l;
              });
            else if (k === 'lpay' && l.paid < l.count) {
              l.paid++;
              S.tx.push({ id: nid(), type: 'out', amount: l.amount, cat: 'اقساط', acc: l.acc || 0, date: today(), note: l.name });
              cur = parts(today());
            }
          }
          save();
          closeSheet();
          render();
        }
        function AO(c) {
          return ACCS.map(function (n, i) {
            return i;
          }).filter(function (i) {
            return S.off.indexOf(i) < 0 || i === c;
          });
        }
        function accBal(i) {
          var a = S.tx.filter(function (t) {
            return (t.acc || 0) === i;
          });
          return (
            sum(a, 'in') -
            sum(a, 'out') +
            (+S.ob[i] || 0) +
            S.tx.reduce(function (s, t) {
              return t.type === 'tf' ? s + (t.to === i ? t.amount : 0) - ((t.acc || 0) === i ? t.amount : 0) : s;
            }, 0)
          );
        }
        function accAdd() {
          return '<div style="display:flex;gap:6px;margin:12px 0 0"><input class="search" id="an" style="margin:0;flex:1" placeholder="نام حساب جدید" aria-label="نام حساب جدید"><input class="search" id="ao" style="margin:0;width:120px;text-align:left" inputmode="numeric" placeholder="موجودی اولیه"></div><button class="btn g" data-x="addacc">افزودن حساب</button><p style="margin:8px 0 0;font-size:12.5px;color:var(--mute);line-height:1.7">حساب حذف‌شده از فهرست‌ها و دارایی کل کنار می‌رود؛ تراکنش‌های قبلیش در گزارش‌ها می‌مانند.</p>';
        }
        function nameBtn() {
          return (
            '<button class="nm" data-x="name">' +
            (S.name ? esc(S.name) : 'حسابداری <span style="color:var(--blue);font-size:.65em">✎</span>') +
            '</button>'
          );
        }
        function catHtml() {
          var h = '<div class="card"><h2>دسته‌ها<small>ویرایش، حذف و افزودن</small></h2>';
          [
            ['out', 'هزینه‌ها'],
            ['in', 'درآمدها'],
          ].forEach(function (g) {
            var k = g[0];
            h += '<div style="font-size:13px;color:var(--mute);font-weight:600;margin:10px 0 6px">' + g[1] + '</div>';
            S.cl[k].forEach(function (c, i) {
              h +=
                '<div style="display:flex;gap:6px;margin-bottom:6px"><input class="search" data-ce="' +
                k +
                ',' +
                i +
                '" value="' +
                esc(c.e) +
                '" maxlength="4" style="margin:0;width:52px;text-align:center" aria-label="ایموجی"><input class="search" data-cn="' +
                k +
                ',' +
                i +
                '" value="' +
                esc(c.n) +
                '" style="margin:0;flex:1" aria-label="نام دسته"><button data-cd="' +
                k +
                ',' +
                i +
                '" aria-label="حذف دسته" style="color:var(--red);font-size:22px;padding:0 4px">×</button></div>';
            });
          });
          return (
            h +
            '<div style="display:flex;gap:6px;margin-top:12px"><input class="search" id="ce" style="margin:0;width:52px;text-align:center" placeholder="😀" maxlength="4" aria-label="ایموجی"><input class="search" id="cn" style="margin:0;flex:1" placeholder="نام دسته جدید" aria-label="نام دسته جدید"><select class="search" id="ck" style="margin:0;width:92px" aria-label="نوع"><option value="out">هزینه</option><option value="in">درآمد</option></select></div><button class="btn g" data-x="addcat">افزودن دسته</button></div>'
          );
        }
        function fillCats(sel) {
          var tf = sType === 'tf',
            sh = $('sh');
          sh.classList.remove('out', 'in', 'tf');
          sh.classList.add(sType);
          $('fcl').hidden = tf;
          $('ftl').hidden = !tf;
          $('fal').textContent = tf ? 'از حساب' : 'حساب';
          if (!tf)
            $('fc').innerHTML = CATS[sType]
              .map(function (c) {
                return '<option' + (c === sel ? ' selected' : '') + '>' + c + '</option>';
              })
              .join('');
        }
        /* آیا جعبهٔ «بیشتر» باید باز باشد؟ اگر این تراکنش از قبل چیزی در آن
           دارد، پنهانش نکن: کاربر باید همان را ببیند، نه اینکه فکر کند
           ثبت نشده. بر اساس دادهٔ ذخیره‌شده — DOM هنوز ساخته نشده. */
        function moreWanted(t) {
          /* شخصی که با دست تایپ شده و در فهرست نیست، فقط اینجا ذخیره شده. */
          return !!(t.p && S.ppl.indexOf(t.p) < 0);
        }
        /* جعبهٔ «بیشتر»: فیلدهای کم‌کاربرد تا خواسته نشوند جمع می‌مانند. */
        function moreBox(html, open, label) {
          return (
            '<details class="more"' +
            (open ? ' open' : '') +
            '><summary>بیشتر' +
            (label ? ' — ' + label : '') +
            '</summary><div class="fld tx">' +
            html +
            '</div></details>'
          );
        }
        /* یک کنترل، دو کار. قبلاً یک فهرست کشویی و یک کادر «شخص جدید» جدا
           بود: همان اسم را دو جا می‌دیدی و نمی‌دانستی کدام پر است. حالا یک
           ورودی است با فهرست پیشنهاد زیرش — یکی را انتخاب می‌کنی، یا
           اسم تازه می‌نویسی و همان‌جا ثبت می‌شود. */
        /* یک ورودی با پیشنهاد زنده. datalist بومی روی بیشتر مرورگرهای
           موبایل اصلاً فیلتر نمی‌کند، پس خودمان می‌سازیم: با هر حرف،
           فهرست پایین ورودی پر می‌شود. */
        var pplHits = [],
          pplAt = -1;
        function personField(t) {
          var l = (t.p && S.ppl.indexOf(t.p) < 0 ? [t.p] : []).concat(S.ppl);
          pplList = l;
          /* پوشاننده لازم است: کادر پیشنهاد باید همسایه‌ی برچسب باشد تا
             بتواند به خودِ فیلد بچسبد. پیش از این برچسب و کادر دو برادر
             بودند، پس کادر به شیت می‌چسبید و وسط فرم باز می‌شد. */
          return (
            '<div class="ppw"><label class="ppf">شخص<input id="fp" autocomplete="off" placeholder="اختیاری" value="' +
            esc(t.p || '') +
            '" style="direction:rtl;text-align:right" role="combobox" aria-expanded="false" aria-autocomplete="list"><span class="car" aria-hidden="true">▾</span></label>' +
            '<div class="ppb" id="ppb" hidden></div></div>'
          );
        }
        var pplList = [];
        /* پیشنهاد با شروعِ همان چیزی که نوشته شده، و اگر چیزی با شروع پیدا
           نشد، هر جای متن. «ع» باید «علی» و «رضا محمدی» را نشان بدهد، نه
           اینکه فقط «ع»-ها را. */
        function pplFilter(q) {
          q = (q || '').trim();
          if (!q) return pplList.slice(0, 8);
          var lo = q.toLowerCase();
          var starts = pplList.filter(function (n) {
            return n.toLowerCase().indexOf(lo) === 0;
          });
          if (starts.length) return starts.slice(0, 8);
          return pplList
            .filter(function (n) {
              return n.toLowerCase().indexOf(lo) > 0;
            })
            .slice(0, 8);
        }
        function pplShow() {
          var f = $('fp');
          var box = $('ppb');
          if (!f || !box) return;
          pplHits = pplFilter(f.value);
          pplAt = -1;
          if (!pplHits.length) {
            box.hidden = true;
            box.innerHTML = '';
            f.setAttribute('aria-expanded', 'false');
            return;
          }
          box.innerHTML = pplHits
            .map(function (n, i) {
              return '<button type="button" data-pp="' + i + '">' + esc(n) + '</button>';
            })
            .join('');
          box.hidden = false;
          f.setAttribute('aria-expanded', 'true');
          /* شبکهٔ والد `overflow:hidden` دارد و سرِ فهرست را می‌بُرید. تا
             وقتی فهرست باز است، برش را کنار می‌گذاریم. */
          var grp = f.closest ? f.closest('.fld.tx') : null;
          if (grp) grp.classList.add('ppopen');
          pplCap(box, f);
        }
        /* قد فهرست از روی خودِ سطرها حساب می‌شود: پنج تا کامل جا می‌شوند و
           بقیه اسکرول می‌خورند. سقف ثابتِ پیکسلی روی گوشی‌هایی که متن
           درشت‌تر دارند، چهارمی را نصفه می‌برید. اگر فضای بالای فیلد کم
           باشد، فهرست به اندازهٔ همان فضا کوتاه می‌شود و اسکرول می‌خورد. */
        function pplCap(box, f) {
          var sh = $('sh');
          if (!sh) return;
          var room = f.getBoundingClientRect().top - sh.getBoundingClientRect().top - 8;
          var one = box.firstElementChild ? box.firstElementChild.getBoundingClientRect().height : 43;
          if (!one) one = 43;
          var want = one * 5 + 2;
          box.style.maxHeight = Math.max(48, Math.min(want, room)) + 'px';
        }
        function pplHide() {
          var box = $('ppb');
          var f = $('fp');
          if (box) {
            box.hidden = true;
            box.innerHTML = '';
            box.style.maxHeight = '';
            var grp = box.closest ? box.closest('.fld.tx') : null;
            if (grp) grp.classList.remove('ppopen');
          }
          if (f) f.setAttribute('aria-expanded', 'false');
          pplHits = [];
          pplAt = -1;
        }
        function pplMove(d) {
          if (!pplHits.length) return;
          pplAt = (pplAt + d + pplHits.length) % pplHits.length;
          var box = $('ppb');
          Array.prototype.forEach.call(box.children, function (b, i) {
            b.classList.toggle('on', i === pplAt);
            if (i === pplAt) b.scrollIntoView({ block: 'nearest' });
          });
        }
        function personPick() {
          var f = $('fp');
          var n = ((f && f.value) || '').replace(/[<>&"]/g, '').trim();
          if (!n) return undefined;
          /* اسمی که در فهرست نبود، همین‌جا به فهرست اضافه می‌شود تا دفعهٔ
             بعد پیشنهاد داده شود. */
          if (S.ppl.indexOf(n) < 0) S.ppl.push(n);
          return n;
        }
        function pplHtml() {
          return (
            '<div class="card"><h2>اشخاص<small>برای ثبت و جستجو</small></h2>' +
            S.ppl
              .map(function (n, i) {
                var a = S.tx.filter(function (t) {
                    return t.p === n;
                  }),
                  net = sum(a, 'in') - sum(a, 'out');
                return (
                  '<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px"><input class="search" data-pn="' +
                  i +
                  '" value="' +
                  esc(n) +
                  '" style="margin:0;flex:1" aria-label="نام شخص"><span style="font-size:12.5px;color:' +
                  (net < 0 ? 'var(--red)' : 'var(--grn)') +
                  ';min-width:70px;text-align:left">' +
                  (net ? (net < 0 ? '−' : '+') + fa(Math.abs(net)) : '') +
                  '</span><button data-pdel="' +
                  i +
                  '" aria-label="حذف شخص" style="color:var(--red);font-size:22px;padding:0 4px">×</button></div>'
                );
              })
              .join('') +
            '<input class="search" id="pnn" style="margin:10px 0 0" placeholder="نام شخص جدید" aria-label="نام شخص جدید"><button class="btn g" data-x="addppl">افزودن شخص</button></div>'
          );
        }
        function cmpHtml() {
          var pv = shift(cur.y, cur.m, -1),
            a = monthTx(),
            b = S.tx.filter(function (t) {
              return inM(t, pv[0], pv[1]);
            });
          if (!a.length && !b.length) return '';
          var i1 = sum(a, 'in'),
            e1 = sum(a, 'out'),
            i0 = sum(b, 'in'),
            e0 = sum(b, 'out'),
            mx = Math.max(i1, e1, i0, e0, 1),
            g = 'rgba(142,142,147,.4)';
          function pr(l, x, y, c) {
            var d = y ? Math.round(((x - y) / y) * 100) : null;
            return (
              '<div class="cp"><div class="cb"><i style="height:' +
              (y / mx) * 100 +
              '%;background:' +
              g +
              '"></i><i style="height:' +
              (x / mx) * 100 +
              '%;background:' +
              c +
              '"></i></div><b>' +
              fa(x) +
              '</b><small>' +
              l +
              (d === null ? '' : ' · ' + (d > 0 ? '▲ ' : '▼ ') + fr0(Math.abs(d)) + '٪') +
              '</small></div>'
            );
          }
          var c1 = byCat(a),
            c0 = byCat(b),
            ks = Object.keys(c1)
              .concat(
                Object.keys(c0).filter(function (k) {
                  return !(k in c1);
                }),
              )
              .sort(function (p, q) {
                return Math.max(c1[q] || 0, c0[q] || 0) - Math.max(c1[p] || 0, c0[p] || 0);
              })
              .slice(0, 5),
            cm = Math.max.apply(
              null,
              ks
                .map(function (k) {
                  return Math.max(c1[k] || 0, c0[k] || 0);
                })
                .concat([1]),
            );
          return (
            '<div class="card"><h2>مقایسه با ماه قبل<small>' +
            MN[cur.m - 1] +
            ' و ' +
            MN[pv[1] - 1] +
            '</small></h2><div class="cmp">' +
            pr('درآمد', i1, i0, 'var(--grn)') +
            pr('هزینه', e1, e0, 'var(--red)') +
            '</div>' +
            ks
              .map(function (k) {
                return (
                  '<div class="cr"><div class="l"><b style="font-weight:500">' +
                  STY[k][0] +
                  ' ' +
                  esc(k) +
                  '</b><span>' +
                  fa(c1[k] || 0) +
                  ' · قبل ' +
                  fa(c0[k] || 0) +
                  '</span></div><div class="t"><i style="width:' +
                  ((c1[k] || 0) / cm) * 100 +
                  '%;background:var(--red)"></i></div><div class="t"><i style="width:' +
                  ((c0[k] || 0) / cm) * 100 +
                  '%;background:' +
                  g +
                  '"></i></div></div>'
                );
              })
              .join('') +
            '<p style="margin:10px 0 0;font-size:12px;color:var(--mute)">نوار رنگی: این ماه · نوار خاکستری: ماه قبل</p></div>'
          );
        }
        function exportHtml() {
          return '<div class="card"><h2>خروجی برای اکسل<small>CSV</small></h2><button class="btn g" data-x="csvm" style="margin-top:0">دانلود تراکنش‌های این ماه</button><button class="btn g" data-x="csva">دانلود همه تراکنش‌ها</button></div>';
        }
        function csvText(all) {
          var rows = S.tx
              .filter(function (t) {
                return all || inM(t, cur.y, cur.m);
              })
              .sort(function (a, b) {
                return a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id;
              }),
            k = S.unit === 'R' ? 10 : 1,
            q = function (s) {
              s = String(s == null ? '' : s);
              return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
            },
            L = [
              'سال شمسی',
              'ماه شمسی',
              'روز شمسی',
              'تاریخ میلادی',
              'نوع',
              'دسته',
              'مبلغ (' + (S.unit === 'R' ? 'ریال' : 'تومان') + ')',
              'حساب',
              'به حساب',
              'شخص',
              'توضیح',
            ];
          return (
            '\ufeff' +
            [L.map(q).join(',')]
              .concat(
                rows.map(function (t) {
                  var p = parts(t.date);
                  return [
                    p.y,
                    p.m,
                    p.d,
                    t.date,
                    t.type === 'in' ? 'درآمد' : t.type === 'tf' ? 'انتقال' : 'هزینه',
                    t.cat || '',
                    Math.round(t.amount * k),
                    ACCS[t.acc || 0],
                    t.type === 'tf' ? ACCS[t.to || 0] : '',
                    t.p || '',
                    t.note || '',
                  ]
                    .map(q)
                    .join(',');
                }),
              )
              .join('\r\n')
          );
        }
        function exportCsv(all) {
          var txt = csvText(all),
            name = 'hesab-' + (all ? 'all' : cur.y + '-' + String(cur.m).padStart(2, '0')) + '.csv',
            fb = function () {
              var b = $('bk');
              if (b) {
                b.value = txt;
                b.select();
              }
            };
          if (!(window.claude && window.claude.use)) {
            try {
              var a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv;charset=utf-8' }));
              a.download = name;
              document.body.appendChild(a);
              a.click();
              a.remove();
            } catch (e) {
              fb();
            }
            return;
          }
          window.claude.use('downloads').then(function (d) {
            if (!d) {
              fb();
              return;
            }
            return d.save({ filename: name, data: txt }).catch(function (e) {
              if (!e || e.code !== 'declined') fb();
            });
          });
        }
        var dP = '',
          dD = 'g';
        function num(s) {
          s = String(s || '')
            .replace(/[۰-۹]/g, function (d) {
              return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);
            })
            .replace(/[٠-٩]/g, function (d) {
              return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);
            })
            .replace(/[٬,]/g, '')
            .replace(/٫/g, '.')
            .replace(/[^\d.]/g, '');
          return parseFloat(s) || 0;
        }
        function asIc(n) {
          return /سکه|طلا/.test(n)
            ? '🪙'
            : /دلار|یورو|ارز/.test(n)
              ? '💵'
              : /خودرو|ماشین/.test(n)
                ? '🚗'
                : /ملک|خانه|زمین/.test(n)
                  ? '🏠'
                  : /سهام|بورس/.test(n)
                    ? '📈'
                    : '💎';
        }
        function assetsTotal() {
          return S.assets.reduce(function (s, a) {
            return s + (a.qty || 0) * (a.price || 0);
          }, 0);
        }
        function assetsHtml() {
          return (
            '<div class="list"><div class="t">دارایی‌های غیرنقدی' +
            (S.assets.length ? ' · ' + fa(assetsTotal()) : '') +
            '</div>' +
            S.assets
              .map(function (a) {
                var v = a.qty * a.price,
                  pl = a.cost ? a.qty * (a.price - a.cost) : null;
                return (
                  '<button class="r" data-asset="' +
                  a.id +
                  '"><div class="ic" style="background:#ffcc0033">' +
                  asIc(a.name) +
                  '</div><div class="m"><b>' +
                  esc(a.name) +
                  '</b><small>' +
                  fr0(a.qty) +
                  ' × ' +
                  fa(a.price) +
                  (pl === null
                    ? ''
                    : ' · <span style="color:' +
                      (pl < 0 ? 'var(--red)' : 'var(--grn)') +
                      '">' +
                      (pl < 0 ? 'زیان ' : 'سود ') +
                      fa(Math.abs(pl)) +
                      '</span>') +
                  '</small></div><div class="v">' +
                  fa(v) +
                  '</div></button>'
                );
              })
              .join('') +
            '<button class="r" data-x="asopen" style="color:var(--blue);font-weight:600"><div class="ic" style="background:var(--fill)">+</div>دارایی جدید</button></div>'
          );
        }
        function openAsset(id) {
          editId = id || null;
          var a = id
            ? S.assets.filter(function (x) {
                return x.id === id;
              })[0]
            : null;
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' +
            (a ? esc(a.name) : 'دارایی جدید') +
            '</h3><div class="fld"><label>نام<input id="asn" placeholder="مثلاً سکه امامی" value="' +
            (a ? esc(a.name) : '') +
            '" style="direction:rtl;text-align:left"></label><label>تعداد یا مقدار<input id="asq" inputmode="decimal" placeholder="۱" value="' +
            (a ? fr0(a.qty) : '') +
            '"></label><label>قیمت امروز هر واحد<input id="ap" class="amt" inputmode="numeric" placeholder="۰" value="' +
            (a ? fi(a.price) : '') +
            '"></label><label>قیمت خرید هر واحد<input id="ac" inputmode="numeric" placeholder="اختیاری" value="' +
            (a && a.cost ? fi(a.cost) : '') +
            '"></label></div><button class="btn" data-x="assave">ذخیره</button>' +
            (a ? '<button class="btn d" data-x="asdel">حذف دارایی</button>' : '');
          showSheet();
        }
        function assetAct(k) {
          var a = S.assets.filter(function (x) {
            return x.id === editId;
          })[0];
          if (k === 'asdel') {
            S.assets = S.assets.filter(function (x) {
              return x !== a;
            });
          } else {
            var n = ($('asn').value || '').replace(/[<>&"]/g, '').trim(),
              q = num($('asq').value),
              p = P($('ap').value),
              c = P($('ac').value);
            if (!n || !q || !p) return;
            if (a) {
              a.name = n;
              a.qty = q;
              a.price = p;
              a.cost = c;
            } else S.assets.push({ id: nid(), name: n, qty: q, price: p, cost: c });
          }
          save();
          closeSheet();
          render();
        }
        function bal(p) {
          return S.debts
            .filter(function (x) {
              return x.p === p;
            })
            .reduce(function (s, x) {
              return s + x.s * x.amt;
            }, 0);
        }
        function debtsHtml() {
          var ps = [];
          S.debts.forEach(function (x) {
            if (ps.indexOf(x.p) < 0) ps.push(x.p);
          });
          var rows = ps
              .map(function (p) {
                return [p, bal(p)];
              })
              /* Settled people stay in the list: the ledger of what they borrowed and repaid
                 is the record, and dropping them at zero loses that history. */
              .sort(function (a, b) {
                if (!a[1] !== !b[1]) return a[1] ? -1 : 1;
                if (!a[1] && !b[1]) return a[0] < b[0] ? -1 : 1;
                return Math.abs(b[1]) - Math.abs(a[1]);
              }),
            own = 0,
            owe = 0,
            settled = 0;
          rows.forEach(function (r) {
            if (r[1] > 0) own += r[1];
            else if (r[1] < 0) owe -= r[1];
            else settled++;
          });
          return (
            '<div class="list"><div class="t">طلب و بدهی' +
            (rows.length ? ' · طلب ' + fa(own) + ' · بدهی ' + fa(owe) + (settled ? ' · ' + fr0(settled) + ' تسویه' : '') : '') +
            '</div>' +
            rows
              .map(function (r) {
                var m = r[1] > 0,
                  z = !r[1];
                return (
                  '<button class="r" data-debt="' +
                  esc(r[0]) +
                  '"' +
                  (z ? ' style="opacity:.5"' : '') +
                  '><div class="ic" style="background:var(--fill)">👤</div><div class="m"><b>' +
                  esc(r[0]) +
                  '</b><small>' +
                  (z ? 'تسویه شد' : m ? 'به شما بدهکار است' : 'شما بدهکارید') +
                  '</small></div><div class="v" style="color:' +
                  (z ? 'var(--mute)' : m ? 'var(--grn)' : 'var(--red)') +
                  '">' +
                  (z ? '۰' : fa(Math.abs(r[1]))) +
                  '</div></button>'
                );
              })
              .join('') +
            '<button class="r" data-x="dnew" style="color:var(--blue);font-weight:600"><div class="ic" style="background:var(--fill)">+</div>ثبت طلب یا بدهی</button></div>'
          );
        }
        function openPerson(p) {
          dP = p;
          var b = bal(p),
            es = S.debts
              .filter(function (x) {
                return x.p === p;
              })
              .sort(function (a, c) {
                return a.date < c.date ? 1 : a.date > c.date ? -1 : c.id - a.id;
              });
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' +
            esc(p) +
            '</h3><div style="text-align:center;margin-bottom:12px"><div style="font-size:30px;font-weight:800;color:' +
            (b > 0 ? 'var(--grn)' : b < 0 ? 'var(--red)' : 'var(--ink)') +
            '">' +
            fa(Math.abs(b)) +
            '</div><small style="color:var(--mute)">' +
            (b > 0 ? 'به شما بدهکار است' : b < 0 ? 'شما بدهکارید' : 'تسویه است') +
            '</small></div><div class="list">' +
            es
              .map(function (x) {
                return (
                  '<div class="r"><div class="ic" style="background:var(--fill)">' +
                  (x.s > 0 ? '↗' : '↙') +
                  '</div><button data-de="' +
                  x.id +
                  '" style="flex:1;min-width:0;text-align:right;background:none;border:0;padding:0"><b>' +
                  (x.s > 0 ? 'دادم' : 'گرفتم') +
                  (x.note ? ' · ' + esc(x.note) : '') +
                  '</b><small>' +
                  sd(x.date) +
                  '</small></button><div class="v">' +
                  fa(x.amt) +
                  '</div><button data-dd="' +
                  x.id +
                  '" aria-label="حذف" style="color:var(--red);font-size:22px;padding:0 4px">×</button></div>'
                );
              })
              .join('') +
            '</div><button class="btn" data-x="dgive">ثبت «دادم»</button><button class="btn" data-x="dget" style="background:var(--grn)">ثبت «گرفتم»</button>' +
            (b ? '<button class="btn g" data-x="dsettle">تسویه کامل</button>' : '');
          showSheet();
        }
        function openDebt(p, dir) {
          dP = p || '';
          dD = dir || 'g';
          var o = S.ppl
            .map(function (n) {
              return '<option>' + esc(n) + '</option>';
            })
            .join('');
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' +
            (p ? esc(p) : 'طلب یا بدهی') +
            '</h3><div class="seg"><button data-ddir="g" aria-pressed="' +
            (dD === 'g') +
            '">دادم</button><button data-ddir="r" aria-pressed="' +
            (dD === 'r') +
            '">گرفتم</button></div><div class="fld">' +
            (p
              ? ''
              : '<label>شخص<select id="dps"><option value="">—</option>' +
                o +
                '</select></label><label>شخص جدید<input id="dpn" placeholder="اختیاری" style="direction:rtl;text-align:left"></label>') +
            '<label>مبلغ<input id="da" class="amt" inputmode="numeric" placeholder="۰"></label><label>تاریخ<button type="button" id="fd" data-x="cal" style="color:var(--blue);font-weight:600;font-size:16px"></button></label><label>توضیح<input id="dn" placeholder="اختیاری" style="direction:rtl;text-align:left"></label></div><p style="margin:0 4px 10px;font-size:12.5px;color:var(--mute);line-height:1.7">برای تسویه یا بازپرداخت، مبلغ را در جهت مخالف ثبت کن. این دفتر جدا از حساب‌هاست.</p><button class="btn" data-x="dsave">ذخیره</button>';
          showSheet();
          dateSel(today());
        }
        function openDebtEntry(id) {
          var x = S.debts.filter(function (y) {
            return y.id === id;
          })[0];
          if (!x) return;
          editId = id;
          dP = x.p;
          $('sh').innerHTML =
            '<div class="grab"></div><h3>ویرایش ' +
            (x.s > 0 ? '«دادم»' : '«گرفتم»') +
            '</h3>' +
            '<div class="fld"><label>شخص<b>' +
            esc(x.p) +
            '</b></label><label>مبلغ<input id="da" class="amt" inputmode="numeric" placeholder="۰" value="' +
            fi(x.amt) +
            '"></label><label>تاریخ<button type="button" id="fd" data-x="cal" style="color:var(--blue);font-weight:600;font-size:16px"></button></label><label>جهت<select id="dsd">' +
            '<option value="1"' +
            (x.s > 0 ? ' selected' : '') +
            '>دادم (او به من بدهکار شد)</option><option value="-1"' +
            (x.s < 0 ? ' selected' : '') +
            '>گرفتم (من بدهکار شدم)</option></select></label><label>توضیح<input id="dn" placeholder="اختیاری" value="' +
            esc(x.note || '') +
            '" style="direction:rtl;text-align:left"></label></div><button class="btn" data-x="desave">ذخیره‌ی تغییرات</button><button class="btn d" data-x="dedel">حذف این ردیف</button>';
          showSheet();
          dateSel(x.date);
        }
        function debtAct(k) {
          if (k === 'desave') {
            var ex = S.debts.filter(function (y) {
              return y.id === editId;
            })[0];
            if (!ex) return;
            var am = P($('da').value),
              nte = ($('dn').value || '').replace(/[<>&"]/g, '').trim();
            if (!am) return;
            ex.amt = am;
            ex.date = getDate();
            ex.s = +$('dsd').value;
            ex.note = nte;
            save();
            openPerson(ex.p);
            render();
          } else if (k === 'dedel') {
            snapAct('ردیف طلب/بدهی حذف شد', function () {
              S.debts = S.debts.filter(function (y) {
                return y.id !== editId;
              });
              save();
              openPerson(dP);
              render();
            });
          } else if (k === 'dsave') {
            var p = dP || ($('dpn') ? $('dpn').value : '').replace(/[<>&"]/g, '').trim() || ($('dps') ? $('dps').value : ''),
              a = P($('da').value);
            if (!p || !a) return;
            if (S.ppl.indexOf(p) < 0) S.ppl.push(p);
            S.debts.push({
              id: nid(),
              p: p,
              s: dD === 'g' ? 1 : -1,
              amt: a,
              date: getDate(),
              note: ($('dn').value || '').replace(/[<>&"]/g, '').trim(),
            });
            save();
            openPerson(p);
            render();
          } else if (k === 'dsettle') {
            var b = bal(dP);
            if (b) {
              S.debts.push({ id: nid(), p: dP, s: b > 0 ? -1 : 1, amt: Math.abs(b), date: today(), note: 'تسویه کامل' });
              save();
              openPerson(dP);
              render();
            }
          }
        }
        function alertsHtml() {
          var td = today(),
            al = [];
          S.loans.forEach(function (l) {
            if (l.paid >= l.count) return;
            var nx = lNext(l),
              d = Math.round((Date.parse(nx + 'T12:00:00Z') - Date.parse(td + 'T12:00:00Z')) / 864e5);
            if (d <= 3) al.push({ l: l, d: d, nx: nx });
          });
          al.sort(function (a, b) {
            return a.d - b.d;
          });
          if (!al.length) return '';
          var c = al[0].d < 0 ? 'var(--red)' : 'var(--org)';
          return (
            '<div class="list" style="border:1.5px solid ' +
            c +
            '"><div class="t" style="color:' +
            c +
            '">🔔 سررسید قسط</div>' +
            al
              .map(function (x) {
                var late = x.d < 0;
                return (
                  '<div class="r"><div class="ic" style="background:' +
                  (late ? '#ff3b3022' : '#ff950022') +
                  '">🏦</div><div class="m"><b>' +
                  esc(x.l.name) +
                  '</b><small style="color:' +
                  (late ? 'var(--red)' : 'var(--mute)') +
                  '">' +
                  (late ? fr0(-x.d) + ' روز عقب‌افتاده' : x.d === 0 ? 'امروز' : x.d === 1 ? 'فردا' : fr0(x.d) + ' روز دیگر') +
                  ' · ' +
                  sd(x.nx) +
                  '</small></div><div class="v">' +
                  fa(x.l.amount) +
                  '</div><button data-lq="' +
                  x.l.id +
                  '" style="background:var(--blue);color:#fff;border-radius:99px;padding:4px 12px;font-size:12.5px;font-weight:600">پرداخت شد</button></div>'
                );
              })
              .join('') +
            '</div>'
          );
        }
        var sub = 'k';
        var ACC = {
          blue: { n: 'آبی', c: null, g: 'linear-gradient(135deg,#0a84ff,#5e5ce6 55%,#bf5af2)' },
          green: { n: 'سبز', c: '#2fb457', g: 'linear-gradient(135deg,#11998e,#38ef7d)' },
          purple: { n: 'بنفش', c: '#8e5cf0', g: 'linear-gradient(135deg,#6a11cb,#d16ba5)' },
          orange: { n: 'نارنجی', c: '#ff8a00', g: 'linear-gradient(135deg,#ff8a00,#ff3d00)' },
          pink: { n: 'صورتی', c: '#ff2d78', g: 'linear-gradient(135deg,#ff2d78,#ff8a5c)' },
          teal: { n: 'فیروزه‌ای', c: '#14b8a6', g: 'linear-gradient(135deg,#0ea5a4,#2563eb)' },
        };
        function swatches() {
          return (
            '<div style="font-size:12.5px;color:var(--mute);margin-top:14px">رنگ تم</div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px">' +
            Object.keys(ACC)
              .map(function (k) {
                var a = ACC[k],
                  on = (S.accent || 'blue') === k;
                return (
                  '<button data-ac="' +
                  k +
                  '" aria-label="' +
                  a.n +
                  '" style="width:34px;height:34px;border-radius:50%;background:' +
                  a.g +
                  ';box-shadow:' +
                  (on ? '0 0 0 3px var(--card),0 0 0 5px ' + (a.c || '#007aff') : 'none') +
                  '"></button>'
                );
              })
              .join('') +
            '</div>'
          );
        }
        function bud() {
          var T = [
              ['k', 'حساب‌ها و دارایی'],
              ['b', 'بودجه و دسته‌ها'],
              ['d', 'طلب، وام و هدف'],
            ],
            body = sub === 'k' ? accCard() + assetsHtml() : sub === 'd' ? debtsHtml() + loansHtml() + goalsHtml() : budCaps() + catHtml(),
            hd = sub === 'b' ? mhead('مدیریت مالی') : '<div class="head"><h1>مدیریت مالی</h1></div>';
          return (
            hd +
            '<div class="seg">' +
            T.map(function (x) {
              return '<button data-sub="' + x[0] + '" aria-pressed="' + (sub === x[0]) + '">' + x[1] + '</button>';
            }).join('') +
            '</div>' +
            body
          );
        }
        function accCard() {
          /* هر حساب یک سطر است که با کلیک باز می‌شود. ویرایش درجا حذف شد
             چون جای کم بود و شمارهٔ کارت و رنگ جایی نداشت. */
          return (
            '<div class="card"><h2>حساب‌ها<small>برای ویرایش روی هرکدام بزن</small></h2>' +
            AO(-1)
              .map(function (i) {
                return (
                  '<button class="arow" data-acc="' +
                  i +
                  '"><span class="ae">' +
                  esc(S.aem[i] || AIC[i] || '👛') +
                  '</span><span class="an">' +
                  esc(ACCS[i]) +
                  '</span><span class="ab">' +
                  fa(accBal(i)) +
                  '<i>' +
                  (S.unit === 'R' ? 'ریال' : 'تومان') +
                  '</i></span></button>'
                );
              })
              .join('') +
            accAdd() +
            '</div>'
          );
        }
        /* مودال ویرایش حساب: نام، ایموجی، موجودی اولیه، شمارهٔ کارت، رنگ. */
        function openAcc(i) {
          $('sh').innerHTML =
            '<div class="grab"></div><h3>ویرایش حساب</h3>' +
            '<div class="fld"><label>نام حساب<input id="an2" value="' +
            esc(ACCS[i]) +
            '" style="direction:rtl;text-align:left"></label>' +
            '<label>موجودی اولیه<input id="ob2" class="amt" inputmode="numeric" placeholder="۰" value="' +
            (S.ob[i] ? fi(S.ob[i]) : '') +
            '"></label>' +
            '<label>ایموجی<input id="em2" value="' +
            esc(S.aem[i] || AIC[i] || '👛') +
            '" style="font-size:26px;text-align:center" maxlength="4"></label>' +
            '</div>' +
            '<div style="display:flex;gap:8px">' +
            '<button class="btn g" data-x="accsave">ذخیره</button>' +
            (AO(-1).length > 1
              ? '<button class="btn d" data-x="accdel">حذف حساب</button>'
              : '') +
            '</div>';
          accEd = { i: i };
          showSheet();
        }
        function accSave() {
          if (!accEd) return;
          var i = accEd.i,
            nm = ($('an2').value || '').replace(/[<>&"]/g, '').trim(),
            em = ($('em2').value || '').trim().slice(0, 4);
          if (!nm) return;
          ACCS[i] = nm;
          S.accs = ACCS;
          S.aem[i] = em;
          S.ob[i] = P($('ob2').value);
          accEd = null;
          save();
          closeSheet();
          render();
        }
        function accDel() {
          if (!accEd) return;
          var i = accEd.i;
          if (AO(-1).length <= 1) return;
          accEd = null;
          /* حذف حساب: تراکنش‌های گذشته‌اش می‌مانند ولی شمارهٔ حساب‌ها
             بعد از آن جابه‌جا می‌شود، پس باید همان‌جا بمانند. */
          S.accs.splice(i, 1);
          S.aem.splice(i, 1);
          S.acno.splice(i, 1);
          S.acol.splice(i, 1);
          S.ob.splice(i, 1);
          S.off = S.off.map(function (x) {
            return x > i ? x - 1 : x === i ? 0 : x;
          });
          S.tx.forEach(function (t) {
            if (t.acc === i) t.acc = 0;
            else if (t.acc > i) t.acc -= 1;
            if (t.type === 'tf') {
              if (t.to === i) t.to = 0;
              else if (t.to > i) t.to -= 1;
            }
          });
          S.tx.forEach(function (t) {
            if (t.acc == null) t.acc = 0;
          });
          S.loans.forEach(function (l) {
            if (l.acc === i) l.acc = 0;
            else if (l.acc > i) l.acc -= 1;
          });
          S.debts.forEach(function (d) {
            if (d.acc === i) d.acc = 0;
            else if (d.acc > i) d.acc -= 1;
          });
          S.rec.forEach(function (r) {
            if (r.acc === i) r.acc = 0;
            else if (r.acc > i) r.acc -= 1;
            if (r.type === 'tf') {
              if (r.to === i) r.to = 0;
              else if (r.to > i) r.to -= 1;
            }
          });
          ACCS = S.accs;
          save();
          closeSheet();
          render();
        }
        /* ---------- کیف پول ---------- */
        function walletHtml(total, inc, exp) {
          var G = [
              (ACC[S.accent] || ACC.blue).g,
              'linear-gradient(135deg,#11998e,#38ef7d)',
              'linear-gradient(135deg,#ff9500,#ff375f)',
              'linear-gradient(135deg,#30b0c7,#0a84ff)',
              'linear-gradient(135deg,#434343,#111)',
              'linear-gradient(135deg,#af52de,#ff2d55)',
            ],
            u = S.unit === 'R' ? 'ریال' : 'تومان',
            ct = '<svg viewBox="0 0 24 24"><path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17"/></svg>';
          function cd(g, t, v, l, r) {
            return (
              '<div class="wc" style="background:' +
              g +
              '"><div class="wt"><span>' +
              t +
              '</span>' +
              r +
              '</div><div class="chip"></div><div class="wv">' +
              (v < 0 ? '−' : '') +
              fa(Math.abs(v)) +
              '<i>' +
              u +
              '</i></div><div class="wb"><span>' +
              l +
              '</span>' +
              ct +
              '</div></div>'
            );
          }
          var h = cd(
            G[0],
            'دارایی کل',
            total,
            esc(S.name || 'کیف پول من'),
            '<span class="pills"><button data-hide="1" class="up" aria-label="پنهان‌سازی مبالغ">' +
              (HIDE ? EYE_OFF : EYE) +
              '</button><button data-u="' +
              (S.unit === 'R' ? 'T' : 'R') +
              '" class="up">' +
              u +
              ' ⇄</button></span>',
          );
          AO(-1).forEach(function (i, j) {
            h += cd(
              G[(j + 1) % G.length],
              esc(ACCS[i]),
              accBal(i),
              'موجودی حساب',
              '<span style="font-size:20px">' + esc(S.aem[i] || AIC[i] || '👛') + '</span>',
            );
          });
          if (S.assets.length) h += cd(G[4], 'دارایی غیرنقدی', assetsTotal(), 'قیمت دستی', '<span style="font-size:20px">💎</span>');
          return (
            '<div class="wallet">' +
            h +
            '</div><div class="mini"><div><small>درآمد ماه</small><b style="color:var(--grn)">' +
            fa(inc) +
            '</b></div><div><small>هزینه ماه</small><b style="color:var(--red)">' +
            fa(exp) +
            '</b></div></div>'
          );
        }
        var sw = null,
          swD = 0,
          tmr = null,
          /* کدام کارتِ حساب چرخیده است. باید بیرون از walletHtml بماند،
             وگرنه هر render وضعیت را پاک می‌کرد. */
          /* حسابی که مودال ویرایشش باز است */
          accEd = null;
        function buzz() {
          try {
            navigator.vibrate && navigator.vibrate(12);
          } catch (e) {}
        }
        function aniApp() {
          var a = $('app');
          a.classList.remove('ani');
          void a.offsetWidth;
          a.classList.add('ani');
        }
        function toast(msg, undo, label, sticky) {
          var el = document.getElementById('toast');
          if (!el) {
            el = document.createElement('div');
            el.id = 'toast';
            document.body.appendChild(el);
          }
          el.className = 'toast glass';
          el.innerHTML = '<span>' + msg + '</span>' + (undo ? '<button id="tu">' + (label || 'برگردان') + '</button>' : '');
          void el.offsetWidth;
          el.classList.add('on');
          clearTimeout(tmr);
          if (undo) {
            document.getElementById('tu').onclick = function () {
              undo();
              el.classList.remove('on');
            };
          }
          /* An update prompt must stay put: the person may be walking away from
             the phone, and a toast that quietly expires means the new build sits
             in "waiting" forever. Everything else keeps its usual timeout. */
          if (sticky) return;
          tmr = setTimeout(function () {
            el.classList.remove('on');
          }, undo && label === 'برگردان' ? 5000 : 15000);
        }
        function delTx(id) {
          var t = S.tx.filter(function (x) {
            return x.id === id;
          })[0];
          if (!t) return;
          S.tx = S.tx.filter(function (x) {
            return x.id !== id;
          });
          save();
          render();
          buzz();
          toast('تراکنش حذف شد', function () {
            S.tx.push(t);
            save();
            render();
          });
        }
        document.addEventListener('pointerdown', function (e) {
          var r = e.target.closest && e.target.closest('.r[data-edit]');
          if (!r || e.button > 0) return;
          sw = { r: r, x: e.clientX, y: e.clientY, on: false, dx: 0, b: 0, bg: null };
        });
        /* The red panel is a sibling placed before the row: the row keeps its opaque card
           background and slides away from it, so the gap the swipe opens shows the delete
           affordance underneath, the way iOS mail does. */
        function swipeOpen(r) {
          var p = r.parentNode;
          if (!p) return null;
          if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
          var pr = p.getBoundingClientRect(),
            rr = r.getBoundingClientRect();
          /* Match the card's own corner radius on edge rows so the red panel does not
             poke out past the rounded corner; middle rows get a softer, smaller curve. */
          var rows = Array.prototype.filter.call(p.children, function (el) {
                return el.classList && el.classList.contains('r');
              }),
            at = rows.indexOf(r),
            top = at === 0 ? 22 : 13,
            bot = at === rows.length - 1 ? 22 : 13;
          var b = document.createElement('div');
          b.className = 'swipe-bg';
          b.innerHTML =
            '<span class="swipe-ic"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></svg>حذف</span>';
          b.style.top = rr.top - pr.top + 'px';
          b.style.height = rr.height + 'px';
          b.style.left = rr.left - pr.left + 'px';
          b.style.borderTopLeftRadius = top + 'px';
          b.style.borderBottomLeftRadius = bot + 'px';
          /* Both ends curved: the outer end follows the card corner, the inner end is a
             soft edge so the strip reads as a shape instead of a painted block. */
          b.style.borderTopRightRadius = '13px';
          b.style.borderBottomRightRadius = '13px';
          b.style.width = '0px';
          p.insertBefore(b, r);
          return b;
        }
        function swipeClose(r) {
          if (r && r.__sw) {
            r.__sw.remove();
            r.__sw = null;
          }
        }
        document.addEventListener('pointermove', function (e) {
          if (!sw) return;
          var dx = e.clientX - sw.x,
            dy = e.clientY - sw.y;
          if (!sw.on) {
            if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) sw.on = true;
            else if (Math.abs(dy) > 12) {
              sw = null;
              return;
            } else return;
          }
          sw.dx = Math.max(0, dx);
          if (!sw.bg) {
            sw.bg = swipeOpen(sw.r);
            sw.r.__sw = sw.bg;
          }
          /* No cap: the panel always fills the gap exactly, however far the swipe goes. */
          var W = sw.dx;
          sw.r.style.transition = 'none';
          sw.r.style.transform = 'translateX(' + sw.dx + 'px)';
          if (sw.bg) {
            sw.bg.style.width = W + 'px';
            var ic = sw.bg.firstChild;
            if (ic) ic.className = 'swipe-ic' + (W > 46 ? ' on' : '');
          }
          if (sw.dx > 110 && !sw.b) {
            sw.b = 1;
            buzz();
          }
        });
        function swEnd() {
          if (!sw) return;
          var s = sw;
          sw = null;
          if (!s.on) return;
          swD = Date.now();
          var r = s.r;
          r.style.transition = 'transform .25s ease';
          if (s.dx > 110) {
            r.style.transform = 'translateX(110%)';
            var id = +r.dataset.edit;
            setTimeout(function () {
              swipeClose(r);
              delTx(id);
            }, 220);
          } else {
            r.style.transform = '';
            if (s.bg) {
              s.bg.style.transition = 'width .2s ease';
              s.bg.style.width = '0px';
              var ic = s.bg.firstChild;
              if (ic) ic.className = 'swipe-ic';
            }
            setTimeout(function () {
              swipeClose(r);
            }, 220);
          }
        }
        document.addEventListener('pointerup', swEnd);
        document.addEventListener('pointercancel', swEnd);
        var EM = [
          '💵',
          '💰',
          '🏦',
          '💳',
          '🪙',
          '💎',
          '👛',
          '🧾',
          '🏠',
          '🚗',
          '🛒',
          '🍽',
          '✈️',
          '🎓',
          '💼',
          '📈',
          '🏪',
          '🎁',
          '🏥',
          '📱',
          '💡',
          '🐷',
          '🔒',
          '⭐',
          '🏧',
          '💸',
          '👜',
          '🧳',
        ];
        function openEmoji(i) {
          $('sh').innerHTML =
            '<div class="grab"></div><h3>ایموجی حساب</h3><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:8px">' +
            EM.map(function (e) {
              return (
                '<button data-ep="' +
                i +
                '|' +
                e +
                '" style="font-size:26px;padding:10px 0;border-radius:14px;background:var(--card)">' +
                e +
                '</button>'
              );
            }).join('') +
            '</div>';
          showSheet();
        }
        /* ---------- Hide amounts ---------- */
        var EYE = '<svg class="eyei" viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
          EYE_OFF = '<svg class="eyei" viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.3 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

        /* ---------- Bank SMS import ---------- */
        var smsPre = null,
          smU = 'R',
          smsList = [];
        var SMS_OUT = /برداشت|خرید|پرداخت|کسر|قبض|انتقال\s*به|پایا|ساتنا|کارمزد|هزینه|مصرف/,
          SMS_IN = /واریز|دریافت|سپرده|بستانکار|انتقال\s*از|بازگشت|جایزه|سود/,
          SMS_AMT = /برداشت|واریز|خرید|پرداخت|مبلغ|کسر|انتقال|کارمزد|دریافت|سپرده|هزینه|مصرف|قبض|سود/,
          SMS_NOT = /(حساب|کارت|شماره|شبا|پیگیری|مرجع|کد|سریال|رهگیری|شناسه)\s*$/,
          SMS_BAL = /مانده|موجودی|باقی/;
        var SMS_CAT = [
          [/حقوق|مزد|دستمزد/, 'حقوق'],
          [/قسط|اقساط|وام|تسهیلات/, 'اقساط'],
          [/قبض|برق|گاز|تلفن|همراه|شارژ/, 'قبوض'],
          [/اسنپ|تپسی|تاکسی|بنزین|عوارض|کرایه|مترو|اتوبوس|پارکینگ/, 'حمل\u200cونقل'],
          [/رستوران|کافه|فست|سوپر|نانوایی|غذا|دلیونو/, 'خوراک'],
          [/داروخانه|درمان|بیمارستان|دکتر|پزشک|کلینیک/, 'سلامت'],
          [/سینما|بازی|تفریح|ورزش|باشگاه/, 'تفریح'],
          [/خرید|فروشگاه|پوشاک/, 'خرید'],
        ];
        function smsNorm(s) {
          return String(s)
            .replace(/[۰-۹]/g, function (d) {
              return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);
            })
            .replace(/[٠-٩]/g, function (d) {
              return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);
            })
            .replace(/[٬،]/g, ',')
            .replace(/ي/g, 'ی')
            .replace(/ك/g, 'ک')
            .replace(/\u200c/g, ' ');
        }
        /* Parses one bank SMS. Amounts are returned as written in the message (usually rial). */
        function smsParse(raw) {
          var nr = smsNorm(raw),
            m = nr,
            iso = null,
            mm,
            y,
            mo,
            da;
          mm = m.match(/(^|[^\d])(\d{4}|\d{2})[\/\-](\d{1,2})[\/\-](\d{1,2})(?![\d:])/);
          if (mm) {
            y = +mm[2];
            mo = +mm[3];
            da = +mm[4];
            m = m.replace(mm[0], mm[1] + '          ');
          } else if ((mm = m.match(/(^|[^\d:\/])(\d{1,2})\/(\d{1,2})(?![\d\/])/))) {
            y = parts(today()).y;
            mo = +mm[2];
            da = +mm[3];
            m = m.replace(mm[0], mm[1] + '     ');
          }
          if (mm) {
            if (y < 100) y += 1400;
            if (y > 1500) {
              var gd = new Date(y + '-' + ('0' + mo).slice(-2) + '-' + ('0' + da).slice(-2) + 'T12:00:00Z');
              iso = isNaN(gd) ? null : gd.toISOString().slice(0, 10);
            } else if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) iso = j2g(y, mo, da);
          }
          m = m.replace(/\d{1,2}:\d{2}(:\d{2})?/g, '     ');
          var re = /(\d{1,3}(?:,\d{3})+|\d+)/g,
            x,
            amt = null,
            loose = null,
            bal = null;
          while ((x = re.exec(m))) {
            var i = x.index,
              j = i + x[0].length,
              pc = m.charAt(i - 1),
              nc = m.charAt(j),
              num = +x[0].replace(/,/g, '');
            if (pc === '*' || pc === 'x' || pc === 'X' || pc === '.' || nc === '.' || x[0].replace(/,/g, '').length > 13) continue;
            var ls = m.lastIndexOf('\n', i - 1) + 1,
              label = m.slice(Math.max(ls, i - 16), i).replace(/[:\-+\s]+$/, '');
            var sign = nc === '-' || pc === '-' ? -1 : nc === '+' || pc === '+' ? 1 : 0;
            if (SMS_BAL.test(label)) {
              if (bal === null) bal = num;
              continue;
            }
            /* An amount keyword wins over the identifier keywords: "برداشت از کارت" and
               "انتقال به کارت" carry the amount right after the word "کارت". */
            if (SMS_AMT.test(label)) {
              if (!amt && num > 0) amt = { n: num, sign: sign, label: label };
              continue;
            }
            if (SMS_NOT.test(label)) continue;
            if (!loose && (x[0].indexOf(',') > -1 || /^\s*(ریال|تومان)/.test(m.slice(j, j + 8))) && num > 0) loose = { n: num, sign: sign, label: label };
          }
          amt = amt || loose;
          if (!amt) return null;
          var type = amt.sign < 0 ? 'out' : amt.sign > 0 ? 'in' : null;
          if (!type) {
            var lo = amt.label.search(SMS_OUT),
              li = amt.label.search(SMS_IN);
            if (lo > -1 && (li < 0 || lo < li)) type = 'out';
            else if (li > -1) type = 'in';
          }
          if (!type) {
            var po = m.search(SMS_OUT),
              pn = m.search(SMS_IN);
            type = po > -1 && (pn < 0 || po < pn) ? 'out' : pn > -1 ? 'in' : 'out';
          }
          var lines = m
              .split('\n')
              .map(function (l) {
                return l.trim();
              })
              .filter(Boolean),
            head =
              lines.filter(function (l) {
                return /[A-Za-zآ-ی]{2,}/.test(l) && !/\d/.test(l) && l.length <= 26 && !SMS_AMT.test(l) && !SMS_BAL.test(l);
              })[0] || '',
            mer = (m.match(/(?:بابت|نزد|پذیرنده|فروشگاه)\s*[:：]?\s*([^\d\n,:]{3,28})/) || [])[1],
            kw = (amt.label.match(SMS_AMT) || [''])[0],
            note = [kw, (mer || head).trim()].filter(Boolean).join(' · ').slice(0, 48),
            cat = 'سایر';
          for (var k = 0; k < SMS_CAT.length; k++)
            if (SMS_CAT[k][0].test(nr) && CATS[type].indexOf(SMS_CAT[k][1]) > -1) {
              cat = SMS_CAT[k][1];
              break;
            }
          return { type: type, amount: amt.n, balance: bal, date: iso || today(), note: note, cat: cat };
        }
        function openSms() {
          $('sh').innerHTML =
            '<div class="grab"></div><h3>ثبت از پیامک بانک</h3><p class="syn">متن پیامک را بچسبان. برای چند پیامک، بین آن‌ها یک خط خالی بگذار.</p>' +
            '<textarea id="smt" placeholder="برداشت:1,250,000&#10;مانده:5,432,100&#10;1405/07/20-14:35" style="direction:rtl;font:inherit;font-size:15px;min-height:150px;width:100%"></textarea>' +
            '<div class="seg" style="margin-top:10px"><button data-su="R" aria-pressed="' + (smU === 'R') + '">مبلغ در پیامک: ریال</button><button data-su="T" aria-pressed="' + (smU === 'T') + '">تومان</button></div>' +
            '<p class="syn" id="smerr" style="color:var(--red)"></p><button class="btn g" data-x="smpaste" style="margin-top:0">چسباندن از کلیپ‌بورد</button><button class="btn" data-x="smgo">ادامه</button>';
          showSheet();
        }
        function smsPaste() {
          var er = $('smerr');
          if (!navigator.clipboard || !navigator.clipboard.readText) {
            er.textContent = 'مرورگر اجازه‌ی خواندن کلیپ‌بورد را نمی‌دهد؛ متن را دستی بچسبان.';
            return;
          }
          navigator.clipboard
            .readText()
            .then(function (t) {
              $('smt').value = t;
              er.textContent = '';
            })
            .catch(function () {
              er.textContent = 'دسترسی به کلیپ‌بورد داده نشد؛ متن را دستی بچسبان.';
            });
        }
        function smsGo() {
          var txt = $('smt') ? $('smt').value : '',
            items = [],
            k = smU === 'R' ? 10 : 1;
          txt
            .split(/\n\s*\n+/)
            .map(function (p) {
              return p.trim();
            })
            .filter(Boolean)
            .forEach(function (p) {
              var r = smsParse(p);
              if (r) {
                r.amount = Math.round(r.amount / k);
                if (r.amount > 0) items.push(r);
              }
            });
          if (!items.length) {
            $('smerr').textContent = 'مبلغی در متن پیدا نشد. متن کامل پیامک را بچسبان.';
            return;
          }
          if (items.length === 1) {
            var r = items[0];
            smsPre = { type: r.type, amount: r.amount, cat: r.cat, date: r.date, note: r.note };
            openSheet();
          } else smsReview(items);
        }
        /* The parser has to guess the direction of a message; this is where the user corrects it. */
        function smsReview(items) {
          smsList = items;
          items.forEach(function (r) {
            r.dup = S.tx.some(function (t) {
              return t.date === r.date && t.type === r.type && t.amount === r.amount;
            });
            r.on = !r.dup;
          });
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' +
            fr0(items.length) +
            ' پیامک پیدا شد</h3>' +
            '<p class="syn">مبلغ و نوع هر مورد را اگر اشتباه تشخیص داده شد اصلاح کن.</p><div class="list">' +
            items
              .map(function (r, i) {
                return (
                  '<div class="r"><input type="checkbox" data-si="' +
                  i +
                  '" aria-label="انتخاب" ' +
                  (r.on ? 'checked' : '') +
                  ' style="width:22px;height:22px;flex:none">' +
                  '<div class="m"><b>' +
                  esc(r.note || r.cat || '—') +
                  '</b><small>' +
                  esc(r.cat || '') +
                  ' · ' +
                  sd(r.date) +
                  (r.dup ? ' · احتمالاً تکراری' : '') +
                  '</small>' +
                  '<div style="display:flex;gap:6px;margin-top:6px"><select data-sty="' +
                  i +
                  '" aria-label="نوع تراکنش" style="flex:1;font:inherit;font-size:13px;padding:7px 9px;border-radius:10px;background:var(--fill);color:var(--ink)">' +
                  '<option value="out"' +
                  (r.type === 'out' ? ' selected' : '') +
                  '>هزینه</option><option value="in"' +
                  (r.type === 'in' ? ' selected' : '') +
                  '>درآمد</option><option value="tf"' +
                  (r.type === 'tf' ? ' selected' : '') +
                  '>انتقال</option></select>' +
                  '<select data-sto="' +
                  i +
                  '" aria-label="حساب مقصد" ' +
                  (r.type === 'tf' ? '' : 'hidden') +
                  ' style="flex:1;font:inherit;font-size:13px;padding:7px 9px;border-radius:10px;background:var(--fill);color:var(--ink)">' +
                  AO(-1)
                    .map(function (k) {
                      return (
                        '<option value="' +
                        k +
                        '"' +
                        (r.to === k ? ' selected' : '') +
                        '>' +
                        esc(ACCS[k]) +
                        '</option>'
                      );
                    })
                    .join('') +
                  '</select>' +
                  '<input data-sam="' +
                  i +
                  '" inputmode="numeric" aria-label="مبلغ" value="' +
                  fr0(r.amount) +
                  '" style="width:104px;text-align:left;font:inherit;font-size:13px;padding:7px 9px;border-radius:10px;background:var(--fill);color:var(--ink)"></div></div>' +
                  '<div class="v ' +
                  (r.type === 'in' ? 'i' : 'o') +
                  '">' +
                  (r.type === 'in' ? '+' : r.type === 'tf' ? '' : '−') +
                  fr0(r.amount) +
                  '</div></div>'
                );
              })
              .join('') +
            '</div><div class="fld"><label>حساب<select id="smk">' +
            AO(-1)
              .map(function (i) {
                return '<option value="' + i + '">' + ACCS[i] + '</option>';
              })
              .join('') +
            '</select></label></div><button class="btn" data-x="smsave">ثبت موارد انتخاب‌شده</button>';
          showSheet();
        }
        function smsSave() {
          var def = +($('smk') ? $('smk').value : AO(-1)[0]),
            n = 0,
            last = null,
            bad = 0;
          /* Validate everything before touching state, so one bad row cannot silently
             drop the other rows the user selected. */
          smsList.forEach(function (r) {
            if (!r.on || r.type !== 'tf') return;
            var from = r.acc != null ? r.acc : def;
            if (r.to == null || r.to === from) bad++;
          });
          if (bad) {
            toast('برای ' + fr0(bad) + ' انتقال، حساب مقصد را انتخاب کن');
            return;
          }
          smsList.forEach(function (r) {
            if (!r.on) return;
            var isTf = r.type === 'tf';
            S.tx.push({
              id: nid(),
              type: r.type,
              amount: r.amount,
              cat: isTf ? '' : r.cat,
              acc: isTf ? (r.acc != null ? r.acc : def) : def,
              to: isTf ? r.to : undefined,
              date: r.date,
              note: r.note,
            });
            n++;
            last = r.date;
          });
          if (!n) return;
          cur = parts(last);
          save();
          closeSheet();
          render();
          toast(fr0(n) + ' تراکنش ثبت شد');
        }
        function closeSheet() {
          $('ov').classList.remove('on');
          $('sh').classList.remove('on');
        }

        document.addEventListener('click', function (e) {
          var el = e.target.closest(
            '[data-tab],[data-m],[data-jump],[data-f],[data-t],[data-x],[data-edit],[data-st],[data-c],[data-pd],[data-goal],[data-af],[data-rd],[data-cd],[data-loan],[data-u],[data-ad],[data-pdel],[data-asset],[data-debt],[data-dd],[data-de],[data-ddir],[data-lq],[data-sub],[data-ac],[data-hide],[data-su],[data-eo],[data-ep],[data-sam],[data-acc],[data-pp]',
          );
          if (Date.now() - swD < 350) return;
          if (e.target.id === 'cov') return closeCal();
          if (e.target.id === 'ov') return closeSheet();
          if (!el) return;
          var d = el.dataset;
          if (d.tab) {
            tab = d.tab;
            render();
            scrollTo(0, 0);
            aniApp();
          /* d.m صفر هم معنی دارد: «برگشت به امروز». و نباید به shift گره بخورد،
             چون shift با صفر همان ماه فعلی را برمی‌گرداند، نه ماه امروز. */
          } else if (d.m !== undefined) {
            var n = +d.m;
            if (n === 0) {
              var tp = parts(today());
              cur.y = tp.y;
              cur.m = tp.m;
              flt = 'all';
              aflt = -1;
            } else {
              var p = shift(cur.y, cur.m, n);
              cur.y = p[0];
              cur.m = p[1];
            }
            render();
            scrollTo(0, 0);
          } else if (d.jump) {
            var jp = parts(d.jump);
            cur.y = jp.y;
            cur.m = jp.m;
            flt = 'all';
            aflt = -1;
            render();
            scrollTo(0, 0);
          } else if (d.f) {
            flt = d.f;
            render();
          } else if (d.af) {
            aflt = +d.af;
            render();
          } else if (d.c) {
            cal.m += +d.c;
            if (cal.m > 12) {
              cal.m = 1;
              cal.y++;
            }
            if (cal.m < 1) {
              cal.m = 12;
              cal.y--;
            }
            drawCal();
          } else if (d.pd) {
            dateSel(j2g(cal.y, cal.m, +d.pd));
            closeCal();
          } else if (d.goal) openGoal(+d.goal);
          else if (d.acc !== undefined) openAcc(+d.acc);
          else if (d.pp !== undefined) {
            /* یکی از پیشنهادها انتخاب شد */
            var pick = pplHits[+d.pp];
            if (pick) {
              $('fp').value = pick;
              pplHide();
              $('fp').focus();
            }
          } else if (d.eo) openEmoji(+d.eo);
          else if (d.ep) {
            var ep = d.ep.split('|');
            S.aem[+ep[0]] = ep[1];
            save();
            closeSheet();
            render();
          } else if (d.loan) openLoan(+d.loan);
          else if (d.u) {
            S.unit = d.u;
            save();
            render();
          } else if (d.ad) {
            if (AO(-1).length > 1) {
              snapAct('حساب «' + (ACCS[+d.ad] || '') + '» حذف شد', function () {
                S.off.push(+d.ad);
                save();
                render();
              });
            }
          } else if (d.pdel) {
            snapAct('شخص «' + (S.ppl[+d.pdel] || '') + '» حذف شد', function () {
              S.ppl.splice(+d.pdel, 1);
              save();
              render();
            });
          } else if (d.x === 'persists') {
            var go = navigator.storage && navigator.storage.persist ? navigator.storage.persist() : Promise.resolve(false);
            go.then(function (ok) {
              return storageInfo().then(function (r) {
                stOk = r[0];
                stEst = r[1];
                render();
                toast(ok ? 'حافظه پایدار شد' : 'مرورگر نپذیرفت؛ برنامه را به صفحه اصلی اضافه کن');
              });
            });
          } else if (d.asset) openAsset(+d.asset);
          else if (d.debt) openPerson(d.debt);
          else if (d.dd) {
            S.debts = S.debts.filter(function (x) {
              return x.id !== +d.dd;
            });
            save();
            openPerson(dP);
            render();
          } else if (d.ddir) {
            dD = d.ddir;
            document.querySelectorAll('[data-ddir]').forEach(function (b) {
              b.setAttribute('aria-pressed', b.dataset.ddir === dD);
            });
          } else if (d.lq) {
            editId = +d.lq;
            loanAct('lpay');
          } else if (d.sub) {
            sub = d.sub;
            render();
            aniApp();
          } else if (d.ac) {
            S.accent = d.ac;
            save();
            render();
          } else if (d.rd) {
            S.rec = S.rec.filter(function (r) {
              return r.id !== +d.rd;
            });
            save();
            render();
          } else if (d.cd) {
            var q2 = d.cd.split(',');
            snapAct('دسته «' + ((S.cl[q2[0]] || [])[+q2[1]] || {}).n + '» حذف شد', function () {
              var gone = S.cl[q2[0]].splice(+q2[1], 1)[0];
              if (gone && q2[0] === 'out') delete S.bud[gone.n];
              save();
              render();
            });
          } else if (d.t) {
            S.theme = d.t;
            save();
            render();
          } else if (d.edit) openSheet(+d.edit);
          else if (d.st) {
            sType = d.st;
            document.querySelectorAll('[data-st]').forEach(function (b) {
              b.setAttribute('aria-pressed', b.dataset.st === sType);
            });
            fillCats();
          } else if (d.x === 'save') {
            var a = P($('fa').value);
            if (!a) {
              $('fa').focus();
              return;
            }
            if (sType === 'tf' && $('ft').value === $('fk').value) {
              toast('حساب مبدأ و مقصد باید متفاوت باشند');
              return;
            }
            var o = {
              id: editId || nid(),
              type: sType,
              amount: a,
              cat: sType === 'tf' ? '' : $('fc').value,
              acc: +$('fk').value,
              to: sType === 'tf' ? +$('ft').value : undefined,
              date: getDate(),
              note: $('fn').value.trim(),
              p: personPick(),
            };
            if (editId)
              S.tx = S.tx.map(function (x) {
                return x.id === editId ? o : x;
              });
            else S.tx.push(o);
            var fr = $('fr');
            if (!editId && fr && fr.value !== '0' && sType !== 'tf') {
              var ad = parts(o.date).d;
              S.rec.push({
                id: nid(),
                type: sType,
                amount: a,
                cat: o.cat,
                acc: o.acc,
                note: o.note,
                p: o.p,
                f: fr.value,
                ad: ad,
                next: nextDate(o.date, fr.value, ad),
              });
            }
            cur = parts(o.date);
            save();
            closeSheet();
            render();
          } else if (d.x === 'addacc') {
            var an = $('an')
              .value.replace(/[<>&"]/g, '')
              .trim();
            if (!an) return;
            S.accs.push(an);
            S.ob.push(P($('ao').value));
            /* حساب تازه باید جای خالی در همهٔ فهرست‌های موازی داشته باشد،
               وگرنه شمارهٔ کارت و رنگِ حساب بعدی به حساب تازه می‌چسبد. */
            S.aem.push('');
            S.acno.push('');
            S.acol.push(0);
            save();
            render();
          } else if (d.x === 'addppl') {
            var pn = $('pnn')
              .value.replace(/[<>&"]/g, '')
              .trim();
            if (!pn || S.ppl.indexOf(pn) > -1) return;
            S.ppl.push(pn);
            save();
            render();
          } else if (d.x === 'asopen') openAsset();
          else if (d.x === 'accsave') accSave();
          else if (d.x === 'accdel') accDel();
          else if (/^as(save|del)$/.test(d.x)) assetAct(d.x);
          else if (d.x === 'dnew') openDebt('', 'g');
          else if (d.de) openDebtEntry(+d.de);
          else if (d.x === 'dgive') openDebt(dP, 'g');
          else if (d.x === 'dget') openDebt(dP, 'r');
          else if (d.x === 'dsave' || d.x === 'dsettle' || d.x === 'desave' || d.x === 'dedel') debtAct(d.x);
          else if (d.x === 'csvm') exportCsv(false);
          else if (d.x === 'csva') exportCsv(true);
          else if (d.x === 'lopen') openLoan();
          else if (/^l(new|save|pay|del)$/.test(d.x)) loanAct(d.x);
          else if (d.x === 'addcat') {
            var nm = $('cn')
              .value.replace(/[<>&"]/g, '')
              .trim();
            var ck = $('ck').value;
            if (!nm || CATS[ck].indexOf(nm) > -1) return;
            S.cl[ck].push({
              c: '#8e8e93',
              n: nm,
              e: (
                $('ce')
                  .value.replace(/[<>&"]/g, '')
                  .trim() || '•'
              ).slice(0, 4),
            });
            save();
            render();
          } else if (d.x === 'cal') openCal();
          else if (d.x === 'ctoday') {
            dateSel(today());
            closeCal();
          } else if (d.x === 'cclose') closeCal();
          else if (d.x === 'name') openName();
          else if (d.x === 'savename') {
            S.name = $('nmi').value.trim();
            save();
            closeSheet();
            render();
          } else if (d.x === 'gopen') openGoal();
          else if (/^g(new|save|add|sub|del)$/.test(d.x)) goalAct(d.x);
          else if (d.x === 'dup') {
            var t0 = S.tx.filter(function (x) {
              return x.id === editId;
            })[0];
            if (t0) {
              S.tx.push(Object.assign({}, t0, { id: nid(), date: today() }));
              cur = parts(today());
              save();
              closeSheet();
              render();
            }
          } else if (d.x === 'del') {
            var di = editId;
            closeSheet();
            delTx(di);
          } else if (d.x === 'dljson') {
            exportJson();
          } else if (d.x === 'upjson') {
            var bf = $('bf');
            if (bf) bf.click();
          } else if (d.x === 'exp') {
            $('bk').value = JSON.stringify(S);
            $('bk').select();
          } else if (d.x === 'imp') {
            /* Snapshot first: this is the one action that can replace the entire dataset. */
            var raw = $('bk').value,
              prev = S,
              pre = snapSave('پیش از بازیابی');
            try {
              var j = JSON.parse(raw);
              if (!j || !Array.isArray(j.tx)) throw 0;
              S = j;
              norm();
              seedIds();
              dedupeIds();
              var nd = newestTx();
              if (nd) cur = parts(nd);
              flt = 'all';
              aflt = -1;
              render();
              save();
              toast(
                'پشتیبان بازیابی شد' + (nd ? ' — نمایش ' + mLabel(cur.y, cur.m) : ''),
                function () {
                  snapTo(pre.id, 'بازیابی برگشت خورد');
                },
              );
            } catch (x) {
              S = prev;
              snapDrop(pre.id);
              $('bk').value = raw;
              $('bk').placeholder = 'متن پشتیبان معتبر نیست؛ داده‌های فعلی دست‌نخورده ماند.';
            }
          } else if (d.hide) {
            HIDE = !HIDE;
            try {
              localStorage.setItem(HIDEK, HIDE ? '1' : '0');
            } catch (e) {}
            render();
          } else if (d.x === 'sms') {
            openSms();
          } else if (d.su) {
            smU = d.su;
            document.querySelectorAll('[data-su]').forEach(function (b) {
              b.setAttribute('aria-pressed', b.dataset.su === smU);
            });
          } else if (d.x === 'smpaste') {
            smsPaste();
          } else if (d.x === 'smgo') {
            smsGo();
          } else if (d.x === 'smsave') {
            smsSave();
          } else if (d.x === 'rst') {
            if (el.dataset.s) {
              snapAct('همه داده‌ها حذف شد', function () {
                S = { tx: [], bud: {}, theme: S.theme };
                save();
                render();
              });
              delete el.dataset.s;
            } else {
              el.dataset.s = 1;
              el.textContent = 'برای تأیید دوباره بزنید';
            }
          }
        });
        document.addEventListener('input', function (e) {
          var t = e.target;
          if (t.id === 'fa' || t.id === 'ga' || t.id === 'gt' || t.id === 'la' || t.id === 'lc' || t.id === 'lp' || t.id === 'lq' || t.id === 'ob2' || t.id === 'ao' || t.id === 'ap' || t.id === 'ac' || t.id === 'da') {
            var v = digits(t.value);
            t.value = v ? fr0(v) : '';
          } else if (t.dataset.sam !== undefined) {
            var am = parseInt(digits(t.value), 10) || 0,
              sr = smsList[+t.dataset.sam];
            sr.amount = am;
            var vs = t.closest('.r').querySelector('.v');
            if (vs) vs.textContent = (sr.type === 'in' ? '+' : sr.type === 'tf' ? '' : '−') + fr0(am);
          } else if (t.id === 'q') {
            q = t.value;
            /* Re-rendering mid-composition would destroy the Persian IME session. */
            if (e.isComposing) return;
            var p = t.selectionStart;
            render();
            var n = $('q');
            if (!n) return;
            n.focus({ preventScroll: true });
            n.setSelectionRange(p, p);
          } else if (t.id === 'fp') {
            /* پیشنهاد زنده. نه وقتی که برنامه خودش مقدار می‌گذارد — وگرنه
               فرم با پیشنهاد جلوی صورت کاربر باز می‌شد. */
            if (!e.isComposing) pplShow();
          } else if (t.dataset.b) {
            var cap = P(t.value);
            t.value = cap ? fi(cap) : '';
            S.bud[t.dataset.b] = cap;
            save();
          }
        });
        document.addEventListener('change', function (e) {
          var t = e.target;
          if (t.id === 'bf') importJsonFile(t.files && t.files[0]);
          else if (t.dataset.si !== undefined) smsList[+t.dataset.si].on = t.checked;
          else if (t.dataset.sty !== undefined) {
            var si = +t.dataset.sty;
            smsList[si].type = t.value;
            var to = document.querySelector('[data-sto="' + si + '"]');
            if (to) to.hidden = t.value !== 'tf';
          } else if (t.dataset.sto !== undefined) smsList[+t.dataset.sto].to = +t.value;
          else if (t.dataset.b) render();
          else if (t.dataset.pn !== undefined) {
            var pi = +t.dataset.pn,
              po = S.ppl[pi],
              pnw = t.value.replace(/[<>&"]/g, '').trim();
            if (pnw && pnw !== po && S.ppl.indexOf(pnw) < 0) {
              S.ppl[pi] = pnw;
              S.tx.forEach(function (x) {
                if (x.p === po) x.p = pnw;
              });
              S.rec.forEach(function (x) {
                if (x.p === po) x.p = pnw;
              });
              S.debts.forEach(function (x) {
                if (x.p === po) x.p = pnw;
              });
            }
            save();
            render();
          } else if (t.dataset.ce) {
            var p = t.dataset.ce.split(',');
            S.cl[p[0]][+p[1]].e =
              t.value
                .replace(/[<>&"]/g, '')
                .trim()
                .slice(0, 4) || '•';
            save();
            render();
          } else if (t.dataset.cn) {
            var p2 = t.dataset.cn.split(','),
              c = S.cl[p2[0]][+p2[1]],
              nn = t.value.replace(/[<>&"]/g, '').trim();
            if (nn && nn !== c.n && CATS[p2[0]].indexOf(nn) < 0) {
              var on = c.n;
              c.n = nn;
              S.tx.forEach(function (x) {
                if (x.cat === on && x.type === p2[0]) x.cat = nn;
              });
              S.rec.forEach(function (x) {
                if (x.cat === on && x.type === p2[0]) x.cat = nn;
              });
              if (p2[0] === 'out' && S.bud[on] != null) {
                S.bud[nn] = S.bud[on];
                delete S.bud[on];
              }
            }
            save();
            render();
          } else if (t.dataset.an) {
            var i = +t.dataset.an;
            S.accs[i] = t.value.replace(/[<>&"]/g, '').trim() || S.accs[i];
            ACCS = S.accs;
            save();
            render();
          } else if (t.dataset.ob) {
            S.ob[+t.dataset.ob] = P(t.value);
            save();
            render();
          }
        });
        $('plus').onclick = function () {
          openSheet();
        };
        document.addEventListener('keydown', function (e) {
          /* کلیدهای فهرست پیشنهاد، فقط وقتی باز است و ورودی شخص فعال است. */
          if (pplHits.length && $('fp') && document.activeElement === $('fp')) {
            if (e.key === 'ArrowDown') {
              pplMove(1);
              e.preventDefault();
              return;
            }
            if (e.key === 'ArrowUp') {
              pplMove(-1);
              e.preventDefault();
              return;
            }
            if (e.key === 'Enter' && pplAt >= 0) {
              $('fp').value = pplHits[pplAt];
              pplHide();
              e.preventDefault();
              return;
            }
          }
          if (e.key === 'Escape') {
            /* اول فهرست را ببند، نه کل شیت را: بستن کل شیت وسط تایپ یک
               اشتباه گران است. */
            if (!$('ppb') || $('ppb').hidden) {
              closeCal();
              closeSheet();
            } else {
              pplHide();
              e.preventDefault();
            }
          }
        });
        load();
        runPending();
        render();
        /* Chain: the mirror must not be rewritten before the rescue has had its say,
           or a fresh empty state would overwrite the only surviving copy. */
        mirrorRescue().then(function () {
          mirror();
        });
        storageInfo().then(function (r) {
          stOk = r[0];
          stEst = r[1];
          if (tab === 'set') render();
        });
        aniApp();
        if (loadBroken) toast('داده‌های ذخیره‌شده خراب بود؛ یک کپی خام از آن نگه داشته شد و برنامه از صفر شروع شد.');
            if ('serviceWorker' in navigator) {
        var reloading = false,
          offered = false;
        /* A waiting worker means a new build is on disk. The old page is still running
           the old code, so ask instead of silently swapping underneath the user. */
        function offer(reg) {
          var w = reg && reg.waiting;
          /* controller check: on the very first visit there is nothing to update from,
             and offering there would be a lie. */
          if (!w || !navigator.serviceWorker.controller) return;
          if (offered) return;
          offered = true;
          try {
            if (!localStorage.getItem('hesab-update-since')) localStorage.setItem('hesab-update-since', String(Date.now()));
          } catch (e) {}
          toast('نسخهٔ جدید برنامه آماده است', function () {
            reloading = true;
            w.postMessage({ type: 'SKIP_WAITING' });
          }, 'به‌روزرسانی کن', true);
        }
        /* The prompt is deliberately never forced: a person mid-transaction should
           not lose the sheet under them. But a prompt nobody answered must not leave
           the app on a stale build forever either. After a week unanswered, the next
           visit applies the update on its own. */
        var STALE = 7 * 86400000;
        function applyIfStale(reg) {
          try {
            var pend = localStorage.getItem('hesab-update-since');
            if (reg.waiting && pend && Date.now() - +pend > STALE) {
              reloading = true;
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          } catch (e) {}
        }
        /* This ran on window 'load' before, which never fires if the page finished
           loading first — and app.js is at the end of the body, so that was a live
           bug: some visits registered no worker at all and got no updates ever. */
        var swGo = function () {
          navigator.serviceWorker.addEventListener('controllerchange', function () {
            try {
              localStorage.removeItem('hesab-update-since');
            } catch (e) {}
            if (reloading) location.reload();
          });
          navigator.serviceWorker.register('sw.js').then(function (reg) {
            /* A worker already waiting when we arrive is the common case: the person
               opened the app after a deploy and never tapped the prompt. */
            applyIfStale(reg);
            offer(reg);
            reg.addEventListener('updatefound', function () {
              var w = reg.installing;
              if (!w) return;
              w.addEventListener('statechange', function () {
                /* 'installed' also fires for an old worker's redundant install; the
                   waiting check inside offer() is what filters that. */
                if (w.state !== 'installed') return;
                applyIfStale(reg);
                offer(reg);
              });
            });
            /* Ask often, not once. A person opens this app most days, and a 30-minute
               poll meant a deploy could sit unseen for hours. Cheap: the browser
               serves the byte-identical sw.js from its own HTTP cache. */
            var poke = function () {
              reg.update().catch(function () {});
            };
            setInterval(poke, 5 * 60 * 1000);
            document.addEventListener('visibilitychange', function () {
              if (!document.hidden) {
                poke();
                applyIfStale(reg);
                offer(reg);
              }
            });
            window.addEventListener('focus', poke);
            window.addEventListener('online', poke);
          }).catch(function () {});
        };
        if (document.readyState === 'complete') swGo();
        else window.addEventListener('load', swGo);
      }
      })();
