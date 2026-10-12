
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
          return fr0(S.unit === 'R' ? Math.round(n * 10) : n);
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
          try {
            var s = JSON.parse(localStorage.getItem(KEY));
            if (s && s.tx) S = s;
          } catch (e) {}
          norm();
        }
        function norm() {
          S.tx = (Array.isArray(S.tx) ? S.tx : []).filter(function (t) {
            return t && typeof t.amount === 'number' && isFinite(t.amount) && /^\d{4}-\d\d-\d\d$/.test(t.date);
          });
          S.goals = S.goals || [];
          S.ob = S.ob || [0, 0, 0];
          S.accs = S.accs || ['نقد', 'حساب بانکی', 'کارت اعتباری'];
          ACCS = S.accs;
          S.rec = S.rec || [];
          S.loans = S.loans || [];
          S.off = S.off || [];
          S.ppl = S.ppl || [];
          S.assets = S.assets || [];
          S.debts = S.debts || [];
          S.aem = S.aem || [];
          while (S.ob.length < S.accs.length) S.ob.push(0);
          S.unit = S.unit || 'T';
          S.cats = S.cats || { out: [], in: [] };
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
          if (!S.cl) {
            S.cl = {};
            ['out', 'in'].forEach(function (k) {
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
          }
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
          if (!syApplying) syDirty();
        }
        var PF = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }),
          PC = {};
        function parts(iso) {
          var c = PC[iso];
          if (c) return c;
          var o = {};
          var dt = new Date(iso + 'T12:00:00Z');
          if (isNaN(dt)) return parts(today());
          PF.formatToParts(dt).forEach(function (x) {
            o[x.type] = x.value;
          });
          return (PC[iso] = { y: +o.year, m: +o.month, d: +o.day });
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
            (t.type === 'tf' ? 'انتقال' : t.cat) +
            ' · ' +
            ACCS[t.acc || 0] +
            (t.type === 'tf' ? ' ← ' + ACCS[t.to || 0] : '') +
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
          return (
            '<div class="head"><h1>' +
            title +
            '</h1><div class="mn"><button data-m="-1" aria-label="ماه قبل"><svg class="chv" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button><span>' +
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
          var bk = Object.keys(S.bud)
            .filter(function (k) {
              return S.bud[k] > 0;
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
          return h;
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
              (!q || (t.note + ' ' + t.cat + ' ' + (t.p || '')).indexOf(q) > -1)
            );
          });
          if (!a.length) return h + '<div class="list"><div class="empty">تراکنشی پیدا نشد.</div></div>';
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
            CATS.out
              .map(function (k) {
                var l = S.bud[k] || 0;
                return (
                  '<div class="bud"><div class="top"><div class="ic" style="background:' +
                  STY[k][1] +
                  '22">' +
                  STY[k][0] +
                  '</div><b style="flex:1;font-weight:500">' +
                  k +
                  '</b><input data-b="' +
                  k +
                  '" inputmode="numeric" placeholder="بدون سقف" value="' +
                  (l ? fi(l) : '') +
                  '"></div>' +
                  (l ? '<div style="margin-top:2px">' + bRow(by, k).replace('class="bud"', 'style="padding:6px 0 0"') + '</div>' : '') +
                  '</div>'
                );
              })
              .join('') +
            '</div>'
          );
        }
        function set() {
          return (
            '<div class="head"><h1>تنظیمات</h1></div>' +
            syncHtml() +
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
            recHtml() +
            pplHtml() +
            exportHtml() +
            '<div class="card"><h2>پشتیبان‌گیری<small>' +
            fr0(S.tx.length) +
            ' تراکنش</small></h2><textarea id="bk" placeholder="برای بازیابی، متن پشتیبان را اینجا بچسبانید"></textarea><button class="btn g" data-x="exp">نمایش پشتیبان برای کپی</button><button class="btn g" data-x="imp">بازیابی از متن</button></div>' +
            '<div class="card"><button class="btn d" data-x="rst" style="margin:0">حذف همه داده‌ها</button></div><p class="empty">داده‌ها فقط روی همین مرورگر ذخیره می‌شوند.</p>'
          );
        }
        function render() {
          norm();
          var h = { home: home, tx: txs, bud: bud, set: set }[tab]();
          $('app').innerHTML = h;
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
            '">انتقال</button></div><div class="fld"><label>مبلغ<input id="fa" class="amt" inputmode="numeric" placeholder="۰" value="' +
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
            (id
              ? ''
              : '<label>تکرار<select id="fr"><option value="0">بدون تکرار</option><option value="m">هر ماه</option><option value="w">هر هفته</option><option value="d">هر روز</option></select></label>') +
            personField(t) +
            '<label>توضیح<input id="fn" placeholder="اختیاری" value="' +
            esc(t.note || '') +
            '" style="direction:rtl;text-align:left"></label></div><button class="btn" data-x="save">ذخیره</button>' +
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
              ? '<div class="fld"><label>مبلغ<input id="ga" class="amt" inputmode="numeric" placeholder="۰"></label></div><button class="btn" data-x="gadd">افزودن به هدف</button><button class="btn g" data-x="gsub">برداشت از هدف</button><button class="btn d" data-x="gdel">حذف هدف</button>'
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
            S.goals.push({ id: Date.now(), name: n, target: a, saved: 0 });
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
                id: Date.now() + n++,
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
                '<button class="btn d" data-x="ldel">حذف وام</button>'
              : '<div class="fld"><label>نام وام<input id="ln" placeholder="مثلاً وام خودرو" style="direction:rtl;text-align:left"></label><label>مبلغ هر قسط<input id="la" class="amt" inputmode="numeric" placeholder="۰"></label><label>تعداد اقساط<input id="lc" inputmode="numeric" placeholder="۱۲"></label><label>قسط‌های پرداخت‌شده<input id="lp" inputmode="numeric" placeholder="۰"></label><label>تاریخ اولین قسط<button type="button" id="fd" data-x="cal" style="color:var(--blue);font-weight:600;font-size:16px"></button></label><label>حساب پرداخت<select id="lk">' +
                AO(-1)
                  .map(function (i) {
                    return '<option value="' + i + '">' + ACCS[i] + '</option>';
                  })
                  .join('') +
                '</select></label></div><button class="btn" data-x="lnew">ذخیره</button>');
          showSheet();
          if (!l) dateSel(today());
        }
        function loanAct(k) {
          var l = S.loans.filter(function (x) {
            return x.id === editId;
          })[0];
          if (k === 'lnew') {
            var n = ($('ln').value || '').replace(/[<>&"]/g, '').trim(),
              a = P($('la').value),
              c = parseInt(digits($('lc').value), 10) || 0,
              p = parseInt(digits($('lp').value), 10) || 0;
            if (!n || !a || !c) return;
            S.loans.push({ id: Date.now(), name: n, amount: a, count: c, paid: Math.min(p, c), first: getDate(), acc: +$('lk').value });
          } else if (l) {
            if (k === 'ldel')
              S.loans = S.loans.filter(function (x) {
                return x !== l;
              });
            else if (k === 'lpay' && l.paid < l.count) {
              l.paid++;
              S.tx.push({ id: Date.now(), type: 'out', amount: l.amount, cat: 'اقساط', acc: l.acc || 0, date: today(), note: l.name });
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
            (S.ob[i] || 0) +
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
            '<button class="nm" data-x="name">حسابداری' +
            (S.name ? ' ' + esc(S.name) : ' <span style="color:var(--blue);font-size:.65em">✎</span>') +
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
        function personField(t) {
          var l = (t.p && S.ppl.indexOf(t.p) < 0 ? [t.p] : []).concat(S.ppl);
          return (
            '<label>شخص<select id="fp"><option value="">—</option>' +
            l
              .map(function (n) {
                return '<option' + (t.p === n ? ' selected' : '') + '>' + esc(n) + '</option>';
              })
              .join('') +
            '</select></label><label>شخص جدید<input id="fpn" placeholder="اختیاری" style="direction:rtl;text-align:left"></label>'
          );
        }
        function personPick() {
          var n = ($('fpn').value || '').replace(/[<>&"]/g, '').trim();
          if (n && S.ppl.indexOf(n) < 0) S.ppl.push(n);
          return n || $('fp').value || undefined;
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
            return s + a.qty * a.price;
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
            } else S.assets.push({ id: Date.now(), name: n, qty: q, price: p, cost: c });
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
              .filter(function (r) {
                return r[1] !== 0;
              })
              .sort(function (a, b) {
                return Math.abs(b[1]) - Math.abs(a[1]);
              }),
            own = 0,
            owe = 0;
          rows.forEach(function (r) {
            if (r[1] > 0) own += r[1];
            else owe -= r[1];
          });
          return (
            '<div class="list"><div class="t">طلب و بدهی' +
            (rows.length ? ' · طلب ' + fa(own) + ' · بدهی ' + fa(owe) : '') +
            '</div>' +
            rows
              .map(function (r) {
                var m = r[1] > 0;
                return (
                  '<button class="r" data-debt="' +
                  esc(r[0]) +
                  '"><div class="ic" style="background:var(--fill)">👤</div><div class="m"><b>' +
                  esc(r[0]) +
                  '</b><small>' +
                  (m ? 'به شما بدهکار است' : 'شما بدهکارید') +
                  '</small></div><div class="v" style="color:' +
                  (m ? 'var(--grn)' : 'var(--red)') +
                  '">' +
                  fa(Math.abs(r[1])) +
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
                  '</div><div class="m"><b>' +
                  (x.s > 0 ? 'دادم' : 'گرفتم') +
                  (x.note ? ' · ' + esc(x.note) : '') +
                  '</b><small>' +
                  sd(x.date) +
                  '</small></div><div class="v">' +
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
        function debtAct(k) {
          if (k === 'dsave') {
            var p = dP || ($('dpn') ? $('dpn').value : '').replace(/[<>&"]/g, '').trim() || ($('dps') ? $('dps').value : ''),
              a = P($('da').value);
            if (!p || !a) return;
            if (S.ppl.indexOf(p) < 0) S.ppl.push(p);
            S.debts.push({
              id: Date.now(),
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
              S.debts.push({ id: Date.now(), p: dP, s: b > 0 ? -1 : 1, amt: Math.abs(b), date: today(), note: 'تسویه کامل' });
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
          return (
            '<div class="card"><h2>حساب‌ها<small>نام و موجودی اولیه</small></h2>' +
            AO(-1)
              .map(function (i) {
                var n = ACCS[i];
                return (
                  '<div style="display:flex;gap:8px;margin-bottom:8px"><button data-eo="' +
                  i +
                  '" aria-label="ایموجی حساب" class="search" style="margin:0;width:52px;padding:6px 0;font-size:22px">' +
                  esc(S.aem[i] || AIC[i] || '👛') +
                  '</button><input class="search" style="margin:0;flex:1" data-an="' +
                  i +
                  '" value="' +
                  n +
                  '" aria-label="نام حساب"><input class="search" style="margin:0;width:120px;text-align:left" data-ob="' +
                  i +
                  '" inputmode="numeric" placeholder="موجودی اولیه" value="' +
                  (S.ob[i] ? fi(S.ob[i]) : '') +
                  '">' +
                  (AO(-1).length > 1
                    ? '<button data-ad="' + i + '" aria-label="حذف حساب" style="color:var(--red);font-size:22px;padding:0 4px">×</button>'
                    : '') +
                  '</div>'
                );
              })
              .join('') +
            accAdd() +
            '</div>'
          );
        }
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
          tmr = null;
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
        function toast(msg, undo) {
          var el = document.getElementById('toast');
          if (!el) {
            el = document.createElement('div');
            el.id = 'toast';
            document.body.appendChild(el);
          }
          el.className = 'toast glass';
          el.innerHTML = '<span>' + msg + '</span>' + (undo ? '<button id="tu">برگردان</button>' : '');
          void el.offsetWidth;
          el.classList.add('on');
          clearTimeout(tmr);
          if (undo) {
            document.getElementById('tu').onclick = function () {
              undo();
              el.classList.remove('on');
            };
          }
          tmr = setTimeout(function () {
            el.classList.remove('on');
          }, 5000);
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
          sw = { r: r, x: e.clientX, y: e.clientY, on: false, dx: 0, b: 0 };
        });
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
          sw.r.style.transition = 'none';
          sw.r.style.transform = 'translateX(' + sw.dx + 'px)';
          sw.r.style.boxShadow = '-700px 0 0 0 var(--red)';
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
              delTx(id);
            }, 220);
          } else {
            r.style.transform = '';
            setTimeout(function () {
              r.style.boxShadow = '';
            }, 250);
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
            if (SMS_NOT.test(label)) continue;
            var sign = nc === '-' || pc === '-' ? -1 : nc === '+' || pc === '+' ? 1 : 0;
            if (SMS_BAL.test(label)) {
              if (bal === null) bal = num;
              continue;
            }
            if (SMS_AMT.test(label)) {
              if (!amt && num > 0) amt = { n: num, sign: sign, label: label };
            } else if (!loose && (x[0].indexOf(',') > -1 || /^\s*(ریال|تومان)/.test(m.slice(j, j + 8))) && num > 0) loose = { n: num, sign: sign, label: label };
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
        function smsReview(items) {
          smsList = items;
          items.forEach(function (r) {
            r.dup = S.tx.some(function (t) {
              return t.date === r.date && t.type === r.type && t.amount === r.amount;
            });
            r.on = !r.dup;
          });
          $('sh').innerHTML =
            '<div class="grab"></div><h3>' + fr0(items.length) + ' پیامک پیدا شد</h3><div class="list">' +
            items
              .map(function (r, i) {
                return (
                  '<label class="r" style="cursor:pointer"><input type="checkbox" data-si="' + i + '"' + (r.on ? ' checked' : '') + ' style="width:20px;height:20px;flex:none"><div class="m"><b>' +
                  esc(r.note || r.cat) + '</b><small>' + esc(r.cat) + ' · ' + sd(r.date) + (r.dup ? ' · احتمالاً تکراری' : '') + '</small></div><div class="v ' + (r.type === 'in' ? 'i' : 'o') + '">' +
                  (r.type === 'in' ? '+' : '−') + fa(r.amount) + '</div></label>'
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
          var acc = +($('smk') ? $('smk').value : AO(-1)[0]),
            n = 0,
            last = null;
          smsList.forEach(function (r, i) {
            if (!r.on) return;
            S.tx.push({ id: Date.now() + i, type: r.type, amount: r.amount, cat: r.cat, acc: acc, date: r.date, note: r.note });
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
            '[data-tab],[data-m],[data-f],[data-t],[data-x],[data-edit],[data-st],[data-c],[data-pd],[data-goal],[data-af],[data-rd],[data-cd],[data-loan],[data-u],[data-ad],[data-pdel],[data-asset],[data-debt],[data-dd],[data-ddir],[data-lq],[data-sub],[data-ac],[data-hide],[data-su],[data-eo],[data-ep],[data-sam]',
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
          } else if (d.m) {
            var p = shift(cur.y, cur.m, +d.m);
            cur.y = p[0];
            cur.m = p[1];
            render();
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
          else if (d.eo) openEmoji(+d.eo);
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
              S.off.push(+d.ad);
              save();
              render();
            }
          } else if (d.pdel) {
            S.ppl.splice(+d.pdel, 1);
            save();
            render();
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
            var gone = S.cl[q2[0]].splice(+q2[1], 1)[0];
            if (gone && q2[0] === 'out') delete S.bud[gone.n];
            save();
            render();
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
              id: editId || Date.now(),
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
                id: Date.now() + 1,
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
          else if (/^as(save|del)$/.test(d.x)) assetAct(d.x);
          else if (d.x === 'dnew') openDebt('', 'g');
          else if (d.x === 'dgive') openDebt(dP, 'g');
          else if (d.x === 'dget') openDebt(dP, 'r');
          else if (d.x === 'dsave' || d.x === 'dsettle') debtAct(d.x);
          else if (d.x === 'csvm') exportCsv(false);
          else if (d.x === 'csva') exportCsv(true);
          else if (d.x === 'lopen') openLoan();
          else if (/^l(new|pay|del)$/.test(d.x)) loanAct(d.x);
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
          else if (/^g(new|add|sub|del)$/.test(d.x)) goalAct(d.x);
          else if (d.x === 'dup') {
            var t0 = S.tx.filter(function (x) {
              return x.id === editId;
            })[0];
            if (t0) {
              S.tx.push(Object.assign({}, t0, { id: Date.now(), date: today() }));
              cur = parts(today());
              save();
              closeSheet();
              render();
            }
          } else if (d.x === 'del') {
            var di = editId;
            closeSheet();
            delTx(di);
          } else if (d.x === 'exp') {
            $('bk').value = JSON.stringify(S);
            $('bk').select();
          } else if (d.x === 'imp') {
            try {
              var j = JSON.parse($('bk').value);
              if (!j.tx) throw 0;
              S = j;
              save();
              render();
            } catch (x) {
              $('bk').value = '';
              $('bk').placeholder = 'متن پشتیبان معتبر نیست.';
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
          } else if (d.x === 'syauth') syAuthSheet('login');
          else if (d.sam) syAuthSheet(d.sam);
          else if (d.x === 'synow') syNow();
          else if (d.x === 'sypw') syPwSheet();
          else if (d.x === 'sydel') syDelSheet();
          else if (d.x === 'syout') syLogout();
          else if (/^sy(authgo|pwgo|delgo)$/.test(d.x)) syGo(el);
          else if (/^syc-(merge|cloud|local)$/.test(d.x)) syResolve(d.x.slice(4));
          else if (d.x === 'rst') {
            if (el.dataset.s) {
              S = { tx: [], bud: {}, theme: S.theme };
              save();
              render();
            } else {
              el.dataset.s = 1;
              el.textContent = SY ? 'برای تأیید دوباره بزنید (نسخه ابری هم پاک می‌شود)' : 'برای تأیید دوباره بزنید';
            }
          }
        });
        document.addEventListener('input', function (e) {
          var t = e.target;
          if (t.id === 'fa' || t.id === 'ga' || t.id === 'la' || t.id === 'ao' || t.id === 'ap' || t.id === 'ac' || t.id === 'da') {
            var v = digits(t.value);
            t.value = v ? fr0(v) : '';
          } else if (t.id === 'q') {
            q = t.value;
            var p = t.selectionStart;
            render();
            var n = $('q');
            n.focus();
            n.setSelectionRange(p, p);
          } else if (t.dataset.b) {
            var cap = P(t.value);
            t.value = cap ? fi(cap) : '';
            S.bud[t.dataset.b] = cap;
            save();
          }
        });
        document.addEventListener('change', function (e) {
          var t = e.target;
          if (t.dataset.si !== undefined) smsList[+t.dataset.si].on = t.checked;
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
          if (e.key === 'Escape') {
            closeCal();
            closeSheet();
          }
        });
        /* ---------- Cloud sync: end-to-end encrypted, last-writer + merge on conflict ---------- */
        /* Offline-only builds ship <meta name="hesab-sync" content="off">: the sync UI and network calls are disabled. */
        var SYNC_OFF = !!document.querySelector('meta[name="hesab-sync"][content="off"]');
        var SYK = 'hesab-sync-v1',
          SY = null,
          syApplying = false,
          syBusy = false,
          syT = null,
          syMsg = '',
          syRemote = null;
        var TE = new TextEncoder(),
          TD = new TextDecoder();
        var SYE = {
          bad_credentials: 'نام کاربری یا رمز عبور اشتباه است.',
          taken: 'این نام کاربری قبلاً ثبت شده است.',
          locked: 'به‌دلیل چند تلاش ناموفق، ورود موقتاً قفل شد. چند دقیقه بعد دوباره امتحان کن.',
          invalid: 'ورودی نامعتبر است.',
          full: 'ظرفیت ثبت‌نام فعلاً تکمیل است.',
          too_large: 'حجم داده از حد مجاز بیشتر است.',
          unauthorized: 'نشست منقضی شده؛ دوباره وارد شو.',
          rate_limited: 'درخواست‌ها زیاد بود؛ کمی بعد دوباره امتحان کن.',
          server: 'خطای سرور؛ کمی بعد دوباره امتحان کن.',
        };
        function syLoad() {
          try {
            SY = JSON.parse(localStorage.getItem(SYK));
          } catch (e) {
            SY = null;
          }
          if (!SY || !SY.u || !SY.token || !SY.key) SY = null;
        }
        function syStore() {
          try {
            if (SY) localStorage.setItem(SYK, JSON.stringify(SY));
            else localStorage.removeItem(SYK);
          } catch (e) {}
        }
        function b64(buf) {
          var a = new Uint8Array(buf),
            s = '';
          for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
          return btoa(s);
        }
        function unb64(s) {
          var b = atob(s),
            a = new Uint8Array(b.length);
          for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
          return a;
        }
        function pbk(pw, salt) {
          return crypto.subtle.importKey('raw', TE.encode(pw), 'PBKDF2', false, ['deriveBits']).then(function (k) {
            return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: TE.encode(salt), iterations: 210000, hash: 'SHA-256' }, k, 256);
          });
        }
        /* Two independent keys from one password: "auth" goes to the server, "enc" never leaves the device. */
        function syKeys(u, pw) {
          return Promise.all([pbk(pw, 'hesab-auth:' + u), pbk(pw, 'hesab-enc:' + u)]).then(function (r) {
            return { auth: b64(r[0]), enc: b64(r[1]) };
          });
        }
        function aesKey(b) {
          return crypto.subtle.importKey('raw', unb64(b), 'AES-GCM', false, ['encrypt', 'decrypt']);
        }
        function seal(keyB64, text) {
          var iv = crypto.getRandomValues(new Uint8Array(12));
          return aesKey(keyB64)
            .then(function (k) {
              return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, TE.encode(text));
            })
            .then(function (ct) {
              return { iv: b64(iv), ct: b64(ct) };
            });
        }
        function unseal(keyB64, iv, ct) {
          return aesKey(keyB64)
            .then(function (k) {
              return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, k, unb64(ct));
            })
            .then(function (p) {
              return JSON.parse(TD.decode(p));
            });
        }
        function syUser(u) {
          return String(u || '').trim().normalize('NFKC').toLowerCase();
        }
        function syUserOk(u) {
          return /^[\p{L}\p{N}_.-]{3,32}$/u.test(u);
        }
        function syApi(method, path, body, tok) {
          var h = { 'content-type': 'application/json' };
          if (tok) h.authorization = 'Bearer ' + tok;
          return fetch('/api' + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' }).then(function (r) {
            return r
              .json()
              .catch(function () {
                return {};
              })
              .then(function (j) {
                return { ok: r.ok, status: r.status, j: j };
              });
          });
        }
        function syErr(r) {
          return SYE[r.j && r.j.error] || (r.status === 429 ? SYE.rate_limited : 'خطا (' + r.status + ')');
        }
        function syHas() {
          return !!(S.tx.length || S.loans.length || S.assets.length || S.debts.length || S.goals.length || S.rec.length || S.ppl.length);
        }
        function syPersist() {
          try {
            localStorage.setItem(KEY, JSON.stringify(S));
          } catch (e) {}
        }
        function syDrop(msg) {
          SY = null;
          syStore();
          syMsg = msg || '';
          if (tab === 'set') render();
        }
        function syDirty() {
          if (!SY || syApplying) return;
          SY.dirty = true;
          SY.ver = (SY.ver || 0) + 1;
          syStore();
          clearTimeout(syT);
          syT = setTimeout(syPush, 10000); /* batch edits: fewer database wake-ups */
          syRefresh();
        }
        function syStatusHtml() {
          if (!SY) return '';
          if (syBusy) return '<small class="syn">در حال همگام‌سازی…</small>';
          if (syMsg) return '<small class="syn" style="color:var(--red)">' + esc(syMsg) + '</small>';
          if (SY.dirty) return '<small class="syn">تغییرات منتظر ارسال است…</small>';
          var t = SY.last ? new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(new Date(SY.last)) : '';
          return '<small class="syn" style="color:var(--grn)">✓ همگام' + (t ? ' · آخرین: ' + t : '') + '</small>';
        }
        function syRefresh() {
          var el = $('sys');
          if (el) el.innerHTML = syStatusHtml();
        }
        function syncHtml() {
          if (SYNC_OFF) return '';
          if (!SY)
            return '<div class="card"><h2>همگام‌سازی ابری</h2><p class="syn">با ساخت حساب، داده‌هایت روی چند دستگاه همگام می‌شود. داده قبل از ارسال روی همین دستگاه رمزگذاری می‌شود و سرور نمی‌تواند آن را بخواند.</p>' + (syMsg ? '<p class="syn" style="color:var(--red)">' + esc(syMsg) + '</p>' : '') + '<button class="btn" data-x="syauth" style="margin-top:0">ورود یا ثبت‌نام</button></div>';
          return '<div class="card"><h2>همگام‌سازی ابری<small>' + esc(SY.u) + '</small></h2><div id="sys">' + syStatusHtml() + '</div><button class="btn g" data-x="synow">همگام‌سازی الان</button><button class="btn g" data-x="sypw">تغییر رمز عبور</button><button class="btn g" data-x="syout">خروج از حساب</button><button class="btn d" data-x="sydel">حذف حساب ابری</button></div>';
        }
        function syApply(data, rev) {
          syApplying = true;
          S = data;
          norm();
          syPersist();
          syApplying = false;
          SY.rev = rev;
          SY.dirty = false;
          SY.last = Date.now();
          syMsg = '';
          syStore();
          render();
        }
        function syMerge(a, b) {
          /* a = this device, b = cloud. Union by id; settings come from the cloud except where this device has more. */
          var m = JSON.parse(JSON.stringify(b));
          ['tx', 'rec', 'goals', 'loans', 'assets', 'debts'].forEach(function (k) {
            var seen = {};
            m[k] = (b[k] || []).slice();
            m[k].forEach(function (x) {
              seen[x.id] = 1;
            });
            (a[k] || []).forEach(function (x) {
              if (!seen[x.id]) m[k].push(x);
            });
          });
          m.ppl = (b.ppl || []).concat((a.ppl || []).filter(function (n) { return (b.ppl || []).indexOf(n) < 0; }));
          m.bud = Object.assign({}, b.bud, a.bud);
          if (a.cl && m.cl)
            ['out', 'in'].forEach(function (g) {
              var names = (m.cl[g] || []).map(function (c) { return c.n; });
              (a.cl[g] || []).forEach(function (c) {
                if (names.indexOf(c.n) < 0) m.cl[g].push(c);
              });
            });
          if ((a.accs || []).length > (b.accs || []).length) {
            m.accs = a.accs;
            m.ob = a.ob;
            m.off = a.off;
            m.aem = a.aem;
          }
          m.name = b.name || a.name;
          return m;
        }
        function syConflict() {
          if (!syRemote) return;
          if ($('sh').classList.contains('on')) return void setTimeout(syConflict, 3000);
          $('sh').innerHTML =
            '<div class="grab"></div><h3>نسخه‌ها فرق دارند</h3><p class="syn">هم نسخه‌ی ابری و هم نسخه‌ی این دستگاه تغییر کرده‌اند. کدام را نگه داریم؟</p>' +
            '<button class="btn" data-x="syc-merge">ادغام (پیشنهادی)</button><p class="syn">تراکنش‌ها و موارد جدید هر دو طرف حفظ می‌شود. چیزی که در یکی حذف شده و در دیگری مانده، برمی‌گردد.</p>' +
            '<button class="btn g" data-x="syc-cloud">استفاده از نسخه‌ی ابری</button><button class="btn g" data-x="syc-local">نگه داشتن نسخه‌ی این دستگاه</button>';
          showSheet();
        }
        function syResolve(c) {
          var r = syRemote;
          syRemote = null;
          if (!r || !SY) return;
          if (c === 'cloud') syApply(r.data, r.rev);
          else {
            if (c === 'merge') {
              syApplying = true;
              S = syMerge(S, r.data);
              norm();
              syPersist();
              syApplying = false;
            }
            SY.rev = r.rev;
            SY.dirty = true;
            SY.ver = (SY.ver || 0) + 1;
            syStore();
            render();
            syPush();
          }
          closeSheet();
        }
        function syPull(initial) {
          if (!SY || syBusy) return Promise.resolve();
          syBusy = true;
          syMsg = '';
          syRefresh();
          return syApi('GET', '/data', null, SY.token)
            .then(function (r) {
              if (r.status === 401) return syDrop('نشست منقضی شد؛ دوباره وارد شو.');
              if (!r.ok) throw syErr(r);
              var j = r.j;
              if (!j.ct) {
                SY.rev = j.rev;
                if (syHas()) SY.dirty = true;
                syStore();
                return;
              }
              if (!initial && j.rev === SY.rev) return;
              return unseal(SY.key, j.iv, j.ct).then(function (data) {
                var localChanged = initial ? syHas() : SY.dirty;
                if (!localChanged) syApply(data, j.rev);
                else {
                  syRemote = { rev: j.rev, data: data };
                  syConflict();
                }
              });
            })
            .catch(function (e) {
              syMsg = typeof e === 'string' ? e : 'همگام‌سازی انجام نشد (اتصال یا رمزگشایی).';
            })
            .then(function () {
              syBusy = false;
              syRefresh();
            });
        }
        function syPush() {
          if (!SY || syBusy || !SY.dirty || syRemote) return Promise.resolve();
          syBusy = true;
          syMsg = '';
          var snap = JSON.stringify(S),
            base = SY.rev,
            ver = SY.ver || 0,
            retry = false;
          syRefresh();
          return seal(SY.key, snap)
            .then(function (p) {
              return syApi('PUT', '/data', { baseRev: base, iv: p.iv, ct: p.ct }, SY.token);
            })
            .then(function (r) {
              if (r.status === 401) return syDrop('نشست منقضی شد؛ دوباره وارد شو.');
              if (r.status === 409) {
                retry = true;
                return;
              }
              if (!r.ok) throw syErr(r);
              SY.rev = r.j.rev;
              if ((SY.ver || 0) === ver) SY.dirty = false;
              SY.last = Date.now();
              syStore();
            })
            .catch(function (e) {
              syMsg = typeof e === 'string' ? e : 'ارسال انجام نشد (بدون اتصال؟). بعداً دوباره تلاش می‌شود.';
            })
            .then(function () {
              syBusy = false;
              syRefresh();
              if (retry) return syPull(false);
            });
        }
        function syAuth(mode, u0, pw, pw2) {
          var u = syUser(u0);
          if (!syUserOk(u)) return Promise.reject('نام کاربری باید ۳ تا ۳۲ نویسه باشد (حروف، عدد، _ . -).');
          if (pw.length < 8) return Promise.reject('رمز عبور حداقل ۸ نویسه باشد.');
          if (mode === 'register' && pw !== pw2) return Promise.reject('تکرار رمز با رمز یکسان نیست.');
          return syKeys(u, pw).then(function (k) {
            return syApi('POST', mode === 'register' ? '/register' : '/login', { u: u, a: k.auth }).then(function (r) {
              if (!r.ok) throw syErr(r);
              SY = { u: u, token: r.j.token, key: k.enc, rev: r.j.rev || 0, dirty: false, ver: 0, last: 0 };
              syStore();
              if (mode === 'register' || r.j.empty) {
                SY.dirty = true;
                SY.ver = 1;
                syStore();
                return syPush();
              }
              return syPull(true);
            });
          });
        }
        function syAuthSheet(mode) {
          var reg = mode === 'register';
          $('sh').innerHTML =
            '<div class="grab"></div><h3>همگام‌سازی ابری</h3><div class="seg"><button data-sam="login" aria-pressed="' + !reg + '">ورود</button><button data-sam="register" aria-pressed="' + reg + '">ثبت‌نام</button></div>' +
            '<div class="fld"><label>نام کاربری<input id="syu" autocomplete="username" autocapitalize="off" spellcheck="false" style="direction:ltr"></label><label>رمز عبور<input id="syp" type="password" autocomplete="' + (reg ? 'new-password' : 'current-password') + '" style="direction:ltr"></label>' +
            (reg ? '<label>تکرار رمز<input id="syp2" type="password" autocomplete="new-password" style="direction:ltr"></label>' : '') + '</div>' +
            (reg ? '<p class="syn">داده‌ات روی همین دستگاه رمزگذاری می‌شود. اگر رمز را فراموش کنی، هیچ‌کس (حتی مدیر سایت) نمی‌تواند آن را بازیابی کند.</p>' : '') +
            '<p class="syn" id="syerr" style="color:var(--red)"></p><button class="btn" data-x="syauthgo" data-mode="' + mode + '">' + (reg ? 'ساخت حساب' : 'ورود') + '</button>';
          showSheet();
        }
        function syPwSheet() {
          $('sh').innerHTML =
            '<div class="grab"></div><h3>تغییر رمز عبور</h3><div class="fld"><label>رمز فعلی<input id="syo" type="password" autocomplete="current-password" style="direction:ltr"></label><label>رمز جدید<input id="syp" type="password" autocomplete="new-password" style="direction:ltr"></label><label>تکرار رمز جدید<input id="syp2" type="password" autocomplete="new-password" style="direction:ltr"></label></div><p class="syn">بعد از تغییر رمز، دستگاه‌های دیگر باید دوباره وارد شوند.</p><p class="syn" id="syerr" style="color:var(--red)"></p><button class="btn" data-x="sypwgo">تغییر رمز</button>';
          showSheet();
        }
        function syDelSheet() {
          $('sh').innerHTML =
            '<div class="grab"></div><h3>حذف حساب ابری</h3><p class="syn">حساب و نسخه‌ی ابری داده‌هایت برای همیشه پاک می‌شود. داده‌ی روی همین دستگاه می‌ماند.</p><div class="fld"><label>رمز عبور<input id="syp" type="password" autocomplete="current-password" style="direction:ltr"></label></div><p class="syn" id="syerr" style="color:var(--red)"></p><button class="btn d" data-x="sydelgo">حذف حساب ابری</button>';
          showSheet();
        }
        function syFail(e) {
          var m = typeof e === 'string' ? e : 'اتصال به سرور برقرار نشد.';
          if ($('syerr')) $('syerr').textContent = m;
          var b = document.querySelector('#sh .btn');
          if (b) b.disabled = false;
        }
        function syGo(el) {
          var d = el.dataset.x;
          el.disabled = true;
          if ($('syerr')) $('syerr').textContent = '';
          var val = function (id) {
            return $(id) ? $(id).value : '';
          };
          if (d === 'syauthgo') {
            syAuth(el.dataset.mode, val('syu'), val('syp'), val('syp2'))
              .then(function () {
                if (!syRemote) closeSheet();
                render();
              })
              .catch(syFail);
          } else if (d === 'sypwgo') {
            var nw = val('syp');
            if (nw.length < 8) return syFail('رمز جدید حداقل ۸ نویسه باشد.');
            if (nw !== val('syp2')) return syFail('تکرار رمز با رمز جدید یکسان نیست.');
            Promise.all([syKeys(SY.u, val('syo')), syKeys(SY.u, nw)])
              .then(function (k) {
                return (SY.dirty ? syPush() : Promise.resolve()).then(function () {
                  if (!SY || SY.dirty) throw 'ابتدا همگام‌سازی را کامل کن (اتصال یا تعارض).';
                  return syApi('GET', '/data', null, SY.token).then(function (r) {
                    if (!r.ok) throw syErr(r);
                    if (r.j.rev !== SY.rev) throw 'نسخه‌ی ابری جدیدتر است؛ اول همگام‌سازی کن.';
                    return seal(k[1].enc, JSON.stringify(S)).then(function (p) {
                      return syApi('POST', '/password', { a: k[0].auth, na: k[1].auth, iv: p.iv, ct: p.ct, baseRev: SY.rev }, SY.token).then(function (r2) {
                        if (!r2.ok) throw syErr(r2);
                        SY.key = k[1].enc;
                        SY.rev = r2.j.rev;
                        SY.last = Date.now();
                        syStore();
                      });
                    });
                  });
                });
              })
              .then(function () {
                closeSheet();
                toast('رمز عبور تغییر کرد');
                render();
              })
              .catch(syFail);
          } else if (d === 'sydelgo') {
            syKeys(SY.u, val('syp'))
              .then(function (k) {
                return syApi('POST', '/delete', { a: k.auth }, SY.token);
              })
              .then(function (r) {
                if (!r.ok) throw syErr(r);
                SY = null;
                syStore();
                closeSheet();
                toast('حساب ابری حذف شد');
                render();
              })
              .catch(syFail);
          }
        }
        function syNow() {
          if (!SY) return;
          syPull(false).then(function () {
            return syPush();
          });
        }
        function syLogout() {
          var tok = SY && SY.token;
          SY = null;
          syStore();
          syMsg = '';
          if (tok) syApi('POST', '/logout', null, tok).catch(function () {});
          render();
        }
        function syBoot() {
          if (SYNC_OFF) return;
          syLoad();
          var last = 0;
          var run = function (force) {
            if (!SY) return;
            /* Returning to the tab re-syncs at most every 5 minutes (unless edits are waiting) to limit database wake-ups. */
            if (!force && !SY.dirty && Date.now() - last < 300000) return;
            last = Date.now();
            syPull(false).then(function () {
              if (SY && SY.dirty) return syPush();
            });
          };
          run(true);
          document.addEventListener('visibilitychange', function () {
            if (!document.hidden) run(false);
          });
          window.addEventListener('online', function () {
            run(true);
          });
        }
        load();
        runPending();
        render();
        aniApp();
        syBoot();
      })();

    if ('serviceWorker' in navigator)
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {});
      });
