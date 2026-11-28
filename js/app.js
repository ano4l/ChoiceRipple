/* ChoiceLab — app logic: profiles, student practice flow, parent and teacher progress. */
(function () {
  'use strict';
  var D = window.CRData, A = window.CRArt;
  var app = document.getElementById('app');
  var KEY = 'choiceRipple.v1';
  var DAY = 86400000;
  /* Student access codes and PINs are a preview of the future sign-in. Off unless js/config.js turns it on (or ?access=on). */
  var ACCESS = !!(window.CRConfig && window.CRConfig.studentAccess) || /[?&]access=on\b/.test(location.search);
  var CODE_ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I/L, so a code is easy to read out and type
  function rnd(n) {
    if (window.crypto && window.crypto.getRandomValues) { var a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0] % n; }
    return Math.floor(Math.random() * n);
  }
  function newCode(s) {
    var c;
    do { c = ''; for (var i = 0; i < 6; i++) c += CODE_ABC.charAt(rnd(CODE_ABC.length)); } while (s.students.some(function (x) { return x.code === c; }));
    return c;
  }
  function newPin() { return ('000' + rnd(10000)).slice(-4); }

  /* ───────── state ───────── */
  function daysAgo(n, h) { var d = new Date(Date.now() - n * DAY); d.setHours(h || 16, 12, 0, 0); return d.toISOString(); }
  function addAssign(s, sid, id, by, g, opt) {
    var list = s.assigned[sid] || (s.assigned[sid] = []);
    if (list.some(function (a) { return a.id === id; })) return;
    var e = { id: id, by: by };
    if (g) e.g = g;
    if (opt) e.opt = true;
    list.push(e);
  }
  /* sample class for the teacher view; classmates use ids c1–c5 so they never collide with added students */
  function addSchool(s) {
    var mates = [
      { id: 'c1', name: 'Jordan Reyes', grade: 'Grade 7', avatar: 4, joined: daysAgo(20) },
      { id: 'c2', name: 'Priyanka Shah', grade: 'Grade 7', avatar: 9, joined: daysAgo(20) },
      { id: 'c3', name: 'Dante Williams', grade: 'Grade 7', avatar: 10, joined: daysAgo(20) },
      { id: 'c4', name: 'Hana Sato', grade: 'Grade 7', avatar: 7, joined: daysAgo(18) },
      { id: 'c5', name: 'Elias Novak', grade: 'Grade 7', avatar: 3, joined: daysAgo(6) }
    ];
    var theirs = {
      c1: { joke: { tries: [{ c: 'join', at: daysAgo(4) }, { c: 'speak', at: daysAgo(4) }], value: 'Fitting in' }, wronganswer: { tries: [{ c: 'quiet', at: daysAgo(3) }], value: 'Staying calm' } },
      c2: { joke: { tries: [{ c: 'speak', at: daysAgo(4), note: 'I said something because Ben looked really sad and I would want someone to do that for me.' }], value: 'Courage' }, wronganswer: { tries: [{ c: 'support', at: daysAgo(3) }], value: 'Kindness' }, picture: { tries: [{ c: 'support', at: daysAgo(1) }], value: 'Being fair' } },
      c3: { joke: { tries: [{ c: 'join', at: daysAgo(3) }], value: 'Fitting in' }, heated: { tries: [{ c: 'snap', at: daysAgo(1) }, { c: 'walk', at: daysAgo(1) }], value: 'Staying calm' } },
      c4: { joke: { tries: [{ c: 'silent', at: daysAgo(2) }], value: 'Staying safe' }, picture: { tries: [{ c: 'emoji', at: daysAgo(1) }, { c: 'support', at: daysAgo(1) }], value: 'Kindness' } },
      c5: {}
    };
    s.teacher = { name: 'Ms. Rivera', role: 'Teacher' };
    s.nextGroup = 3;
    s.groups = [
      { id: 'g1', name: 'Grade 7 · Period 3', kind: 'Class', students: ['s1', 'c1', 'c2', 'c3', 'c4', 'c5'], assigned: ['joke', 'wronganswer', 'picture'], optional: ['pileon'] },
      { id: 'g2', name: 'Reflection room', kind: 'ISS / detention group', students: ['c3', 'c5'], assigned: ['heated', 'blamed'], optional: [] }
    ];
    mates.forEach(function (m) {
      if (!s.students.some(function (x) { return x.id === m.id; })) { s.students.push(m); s.progress[m.id] = theirs[m.id]; }
    });
    s.groups.forEach(function (g) {
      g.students = g.students.filter(function (id) { return s.students.some(function (x) { return x.id === id; }); });
      g.students.forEach(function (sid) {
        g.assigned.forEach(function (id) { addAssign(s, sid, id, 'teacher', g.id); });
        (g.optional || []).forEach(function (id) { addAssign(s, sid, id, 'teacher', g.id, true); });
      });
    });
    return s;
  }
  function seed() {
    return addSchool({
      v: 1, active: null, nextId: 3, family: ['s1', 's2'],
      students: [
        { id: 's1', name: 'Maya Okafor', grade: 'Grade 7', avatar: 0, joined: daysAgo(24) },
        { id: 's2', name: 'Leo Okafor', grade: 'Grade 5', avatar: 1, joined: daysAgo(9) }
      ],
      progress: {
        s1: {
          heated: { tries: [{ c: 'snap', at: daysAgo(12) }, { c: 'walk', at: daysAgo(12), note: 'I picked walking away because yelling back just makes it bigger. Next time I will take a breath first.' }], value: 'Staying calm' },
          picture: { tries: [{ c: 'support', at: daysAgo(8) }], value: 'Kindness' },
          badgrade: { tries: [{ c: 'dismiss', at: daysAgo(5) }, { c: 'offer', at: daysAgo(5) }], value: 'Kindness' },
          joke: { tries: [{ c: 'silent', at: daysAgo(2), note: 'I stayed quiet because I did not want them to pick on me too. Next time I could ask Ben to sit with me.' }], value: 'Fitting in' },
          /* started (a choice was made) but the reflection is not finished yet */
          talkedover: { tries: [{ c: 'giveup', at: daysAgo(0, 9) }], open: true }
        },
        s2: { directions: { tries: [{ c: 'raise', at: daysAgo(3) }], value: 'Courage' } }
      },
      assigned: {
        s1: [{ id: 'heated', by: 'parent' }, { id: 'badgrade', by: 'parent' }, { id: 'talkedover', by: 'parent' }, { id: 'phonegrab', by: 'parent' }, { id: 'apology', by: 'parent' }, { id: 'stagefright', by: 'parent', opt: true }],
        s2: [{ id: 'directions', by: 'parent' }, { id: 'dare', by: 'parent' }, { id: 'nickname', by: 'parent' }, { id: 'ragequit', by: 'parent', opt: true }]
      }
    });
  }
  /* bring data saved by the earlier parent-and-student-only version up to date */
  function migrate(s) {
    s.progress = s.progress || {}; s.assigned = s.assigned || {};
    Object.keys(s.assigned).forEach(function (sid) {
      s.assigned[sid] = s.assigned[sid].map(function (a) { return typeof a === 'string' ? { id: a, by: 'parent' } : a; });
    });
    if (!s.family) s.family = s.students.map(function (x) { return x.id; });
    if (!s.groups || !s.teacher) addSchool(s);
    s.groups.forEach(function (g) { g.optional = g.optional || []; });
    /* every student has a character they can edit; older profiles start from their preset picture */
    s.students.forEach(function (x) { if (!x.look) x.look = A.preset(x.avatar || 0); });
    s.students.forEach(function (x) { if (!x.code) x.code = newCode(s); if (!/^\d{4}$/.test(x.pin || '')) x.pin = newPin(); });
    return s;
  }
  var state;
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.v === 1 && s.students) return migrate(s); } } catch (e) { /* storage unavailable */ }
    return migrate(seed());
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* keep running in memory */ } }
  state = load();
  save(); // keeps freshly made access codes and PINs the same on the next visit

  /* ───────── helpers ───────── */
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function student(id) { return state.students.filter(function (s) { return s.id === id; })[0]; }
  function activeStudent() { return state.active ? student(state.active) : null; }
  function first(name) { return String(name || '').trim().split(/\s+/)[0] || 'Student'; }
  function prog(sid) { return state.progress[sid] || (state.progress[sid] = {}); }
  function assignedTo(sid) { return state.assigned[sid] || (state.assigned[sid] = []); }
  function rec(sid, scid) { return prog(sid)[scid]; }
  /* a practice counts once its reflection is finished; `open` marks one that was started and not finished */
  function isDone(sid, scid) { var r = rec(sid, scid); return !!(r && r.tries && r.tries.length && !r.open); }
  function isStarted(sid, scid) { var r = rec(sid, scid); return !!(r && r.open && r.tries && r.tries.length); }
  /* the practice this student has started and not finished, if there is one: it has to be finished before another opens */
  function openOne(sid) {
    var p = prog(sid);
    return Object.keys(p).filter(function (id) { return isStarted(sid, id) && D.scenario(id); })[0] || null;
  }
  function progressChip(sid, scid) {
    return isDone(sid, scid) ? '<span class="status done">' + ICON.check + ' Completed</span>'
      : isStarted(sid, scid) ? '<span class="status started">Started</span>' : '<span class="status todo">Not started</span>';
  }
  function choiceOf(s, cid) { return s.choices.filter(function (c) { return c.id === cid; })[0]; }
  function pending(sid, opt) { return assignedTo(sid).filter(function (a) { return !!a.opt === opt && !isDone(sid, a.id) && D.scenario(a.id); }).map(function (a) { return a.id; }); }
  function waiting(sid) { return pending(sid, false); }
  function optional(sid) { return pending(sid, true); }
  function assignEntry(sid, id) { return assignedTo(sid).filter(function (a) { return a.id === id; })[0]; }
  function fromLabel(sid, id) { var a = assignEntry(sid, id); return a && a.by === 'teacher' ? 'From ' + state.teacher.name : 'From your parent'; }
  /* students only see what was assigned or offered to them, plus anything they already practiced */
  function canSee(sid, id) { return !!(assignEntry(sid, id) || rec(sid, id)); }
  function scopeCount(sid) { return doneList(sid).length + waiting(sid).length + optional(sid).length; }
  function lookOf(st) { return st ? st.look : null; }
  var MIN_WORDS = 10;
  function words(t) { return String(t || '').split(/\s+/).filter(function (w) { return /[A-Za-z0-9\u00C0-\uFFFF]/.test(w); }).length; }
  function family() { return state.family.map(student).filter(Boolean); }
  function group(id) { return state.groups.filter(function (g) { return g.id === id; })[0]; }
  function groupStudents(g) { return g.students.map(student).filter(Boolean); }
  function newStudent(name, grade) {
    var id = 's' + (state.nextId++);
    state.students.push({ id: id, name: name, grade: grade, look: A.preset(state.students.length + 1), joined: new Date().toISOString(), code: newCode(state), pin: newPin() });
    return id;
  }
  function dropGroupAssign(sid, gid, id) {
    state.assigned[sid] = assignedTo(sid).filter(function (a) { return !(a.g === gid && (!id || a.id === id)); });
  }
  function doneList(sid) {
    return D.scenarios.filter(function (s) { return isDone(sid, s.id); }).sort(function (a, b) {
      var ra = rec(sid, a.id).tries, rb = rec(sid, b.id).tries;
      return new Date(rb[rb.length - 1].at) - new Date(ra[ra.length - 1].at);
    });
  }
  function queue(sid) { return waiting(sid).concat(optional(sid)); }
  function fmtDate(iso) {
    var d = new Date(iso), n = new Date(), a = new Date(d.getFullYear(), d.getMonth(), d.getDate()), b = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    var diff = Math.round((b - a) / DAY);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return diff + ' days ago';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  function lets(html) { return html.replace(/Let’s/g, '<span class="lets">Let’s</span>'); }
  function said(text) { return esc(text).replace(/“[^”]+”/g, function (m) { return '<span class="said">' + m + '</span>'; }); }
  function art(id, cls) { var s = D.scenario(id); return '<span class="art ' + (cls || '') + '">' + A.scene(id, s && s.alt, lookNow, s && s.scene) + '</span>'; }
  function choiceArt(s, c, cls) { return '<span class="art ' + (cls || '') + '">' + A.choicePic(s, c, lookNow, 'Picture of this choice: ' + c.label) + '</span>'; }
  function effectArt(s, c, cls) { return '<span class="art ' + (cls || '') + '">' + A.effectPic(s, c, lookNow, 'Picture of what could happen after this choice') + '</span>'; }
  function chip(topicId) { var t = D.topic(topicId); return '<span class="chip" style="--chip-bg:' + t.bg + ';--chip-ink:' + t.ink + '">' + esc(t.short || t.name) + '</span>'; }
  function avatar(st, cls) { return '<span class="avatar ' + (cls || '') + '">' + A.avatar(st.look, '') + '</span>'; }
  function tone(kind) { return '<span class="tone tone-' + kind + '">' + D.kind[kind].tag + '</span>'; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  /* decorative concentric rings: the ripple motif */
  /* Courage Credits: the same amount for every finished practice, whatever the choice was */
  var CREDIT = 20;
  function credits(sid) { return doneList(sid).length * CREDIT; }
  var WRAP = {
    strong: 'You thought it through and picked a step that helps.',
    mixed: 'You thought it through and found a way to make that choice stronger.',
    risky: 'You looked honestly at a tough choice and found a better option.'
  };
  function rings(cls, n) {
    var c = '';
    for (var i = 1; i <= (n || 7); i++) c += '<circle cx="200" cy="200" r="' + (i * 28) + '"/>';
    return '<svg class="rings ' + (cls || '') + '" viewBox="0 0 400 400" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.6">' + c + '</g></svg>';
  }
  function topicVars(topicId) { var t = D.topic(topicId); return ' style="--chip-bg:' + t.bg + ';--chip-ink:' + t.ink + '"'; }
  /* an avatar wrapped in a ring that fills with progress */
  function ringAvatar(st, cls, pct, label) { return '<span class="pring" style="--p:' + pct + '" role="img" aria-label="' + esc(label) + '">' + avatar(st, cls) + '</span>'; }
  var ICON = {
    sound: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    stop: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14m-6-6l6 6l-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M19 12H5m6-6l-6 6l6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sparks: '<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><path d="M30 4c1.6 8.6 4.4 11.4 13 13c-8.6 1.6-11.4 4.4-13 13c-1.6-8.6-4.4-11.4-13-13c8.6-1.6 11.4-4.4 13-13z" fill="currentColor"/><path d="M12 26c1 5.4 2.6 7 8 8c-5.4 1-7 2.6-8 8c-1-5.4-2.6-7-8-8c5.4-1 7-2.6 8-8z" fill="currentColor" opacity=".8"/></svg>',
    bubble: '<svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true"><path d="M7 5h18a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H14l-6.5 5v-5H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M9.5 11.5h13M9.5 16.5h8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.2" fill="currentColor"/></svg>',
    burst: '<svg class="burst" viewBox="0 0 32 32" aria-hidden="true"><path d="M7 21h9M9.5 9.5l5.5 6M20 4.5l1.5 8" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" fill="currentColor"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    ripple: '<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="16" cy="16" r="3" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="8" opacity=".7"/><circle cx="16" cy="16" r="13" opacity=".35"/></g></svg>'
  };

  /* ───────── read-aloud ─────────
     Uses the voices already on the device. It picks the most natural-sounding English voice it
     can find (the "Natural" voices in Edge, Google voices in Chrome, enhanced voices on Apple
     devices), reads sentence by sentence so the pauses sound right, and lets the student choose
     a different voice on their profile page. */
  var Voice = {
    key: null,
    ok: 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    list: function () {
      if (!this.ok) return [];
      return window.speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
    },
    score: function (v) {
      var n = v.name, s = 0, want = (navigator.language || 'en-US').toLowerCase();
      if (/natural|neural/i.test(n)) s += 60;
      if (/google/i.test(n)) s += 40;
      if (/premium|enhanced|siri/i.test(n)) s += 45;
      if (/online/i.test(n)) s += 10;
      if (/^(samantha|ava|allison|susan|zoe|nicky|karen|serena|moira|tessa|daniel)\b/i.test(n)) s += 25;
      if (/aria|jenny|emma|sonia|libby|michelle|ana\b|andrew|brian/i.test(n)) s += 8;
      if (/natural/i.test(n) && /\b(ava|emma|andrew|brian)\b/i.test(n)) s += 14; /* the newest, most human-sounding Edge voices */
      if (/compact|espeak|albert|bad news|bahh|bells|boing|bubbles|cellos|fred|jester|organ|trinoids|whisper|zarvox|junior|ralph|kathy|superstar|wobble|good news|deranged|hysterical|pipe/i.test(n)) s -= 90;
      var l = v.lang.toLowerCase().replace('_', '-');
      if (l === want) s += 12; else if (l === 'en-us') s += 8;
      return s;
    },
    best: function () {
      var vs = this.list(), self = this;
      if (!vs.length) return null;
      var saved = state.voice && vs.filter(function (v) { return v.name === state.voice; })[0];
      return saved || vs.slice().sort(function (a, b) { return self.score(b) - self.score(a); })[0];
    },
    stop: function () { if (this.ok) window.speechSynthesis.cancel(); this.key = null; this.paint(); },
    toggle: function (key, parts) {
      if (!this.ok) { this.paint('Read-aloud isn’t available in this browser.'); return; }
      if (this.key === key) { this.stop(); return; }
      window.speechSynthesis.cancel();
      this.key = key;
      var self = this, v = this.best(), natural = v && this.score(v) >= 40, list = [];
      parts.filter(Boolean).forEach(function (t) {
        /* speech engines stumble on quote marks and separators, so read the words without them */
        t = String(t).replace(/[“”"]/g, '').replace(/\s*·\s*/g, ', ').replace(/\s*[—–]\s*/g, ', ').replace(/…/g, '.');
        (String(t).match(/[^.!?…]+[.!?…]+[”’"')]*|[^.!?…]+$/g) || [t]).forEach(function (x) { if (x.trim()) list.push(x.trim()); });
      });
      list.forEach(function (text, i) {
        var u = new SpeechSynthesisUtterance(text);
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
        u.rate = natural ? 0.97 : 0.9; u.pitch = 1;
        if (i === list.length - 1) u.onend = function () { if (self.key === key) { self.key = null; self.paint(); } };
        u.onerror = function (ev) { if (ev.error !== 'canceled' && ev.error !== 'interrupted' && self.key === key) { self.key = null; self.paint('Your browser couldn’t find a voice. Check its text-to-speech settings.'); } };
        window.speechSynthesis.speak(u);
      });
      this.paint();
    },
    paint: function (msg) {
      var self = this;
      Array.prototype.forEach.call(document.querySelectorAll('[data-speak]'), function (b) {
        var on = b.getAttribute('data-speak') === self.key;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.innerHTML = (on ? ICON.stop : ICON.sound) + '<span>' + (on ? 'Stop' : b.getAttribute('data-label')) + '</span>';
      });
      var st = document.getElementById('voiceStatus');
      if (st) st.textContent = msg || '';
    },
    tip: function () {
      if (!this.ok) return 'Read-aloud isn’t available in this browser.';
      var v = this.best();
      if (!v) return '';
      return this.score(v) >= 40 ? 'This is a natural-sounding voice.'
        : 'This device only has basic voices. For a natural voice, open ChoiceLab in Microsoft Edge or Google Chrome, or download an “Enhanced” voice in your iPhone, iPad or Mac settings (Accessibility → Spoken Content → Voices).';
    },
    options: function () {
      var self = this, cur = this.best(), vs = this.list().slice().sort(function (a, b) { return self.score(b) - self.score(a); });
      if (!vs.length) return '<option value="">Best voice on this device</option>';
      return vs.map(function (v) { return '<option value="' + esc(v.name) + '"' + (cur && cur.name === v.name ? ' selected' : '') + '>' + esc(v.name.replace(/^Microsoft |^Google /, '').replace(/ - .*$/, '')) + (self.score(v) >= 40 ? ' · natural' : '') + '</option>'; }).join('');
    }
  };
  if (Voice.ok) {
    Voice.list();
    window.speechSynthesis.onvoiceschanged = function () {
      var sel = document.getElementById('voicePick'), tip = document.getElementById('voiceTip');
      if (sel) sel.innerHTML = Voice.options();
      if (tip) tip.textContent = Voice.tip();
    };
  }
  function speakBtn(key, label, cls) {
    return '<button type="button" class="speak ' + (cls || '') + '" data-act="speak" data-speak="' + key + '" data-label="' + esc(label) + '" aria-pressed="false">' + ICON.sound + '<span>' + esc(label) + '</span></button>';
  }

  /* ───────── routing ───────── */
  var play = null;           // { id, mode, step 1-5, sel, note, first }
  var sessionDone = [];      // scenario ids finished since the app opened
  var libGroup = 'all', assignGroup = 'everyday';
  var lastPage = '#/';       // last page that was not a practice or a preview
  var lastRole = 'home';     // which tab stays lit while an adult previews or browses the library
  var lookNow = null;        // whose character is drawn into the pictures on this page
  var trail = [];            // pages visited in the app, so "Back" returns to the previous one
  var draft = null;          // the character and name being edited on the profile page
  var folds = {}, foldsFor = ''; // which fold-away sections are open on the current page
  var joinCode = '';         // access code carried in by a sign-in link (#/join/CODE), the link a QR code will hold
  var showPin = null;        // the student whose PIN an adult has chosen to show on this page
  var pendingAssign = false; // "Assign practice" was tapped on a card: open the next page at its assign list
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var p = h.split('/').filter(Boolean);
    return { name: p[0] || 'home', a: p[1], b: p[2] };
  }
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  function backBtn(fallback, label) { return '<a class="back" data-act="back" href="' + esc(fallback) + '">' + ICON.back + ' ' + (label || 'Back') + '</a>'; }

  function render(keepScroll) {
    Voice.stop();
    var r = route(), html, nav = 'home', here = location.hash || '#/';
    if (r.name === 'join') {
      /* a student's own sign-in link: carry the code to the sign-in page, where they still type their PIN */
      if (ACCESS) {
        joinCode = String(r.a || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
        var cur = activeStudent();
        if (cur && cur.code !== joinCode) { state.active = null; save(); }
      }
      location.replace('#/student');
      return;
    }
    if (trail[trail.length - 2] === here && !keepScroll) trail.pop(); else if (trail[trail.length - 1] !== here) trail.push(here);
    if (foldsFor !== here) { folds = {}; foldsFor = here; showPin = null; }
    if (pendingAssign) folds.assign = true;
    if (r.name === 'home' || r.name === 'student' || r.name === 'parent' || r.name === 'teacher') lastRole = r.name;
    if (!(r.name === 'student' && r.a === 'profile')) draft = null;
    lookNow = null;
    if (r.name === 'student') { nav = 'student'; lookNow = lookOf(activeStudent()); html = r.a === 'profile' ? viewProfileEdit() : viewStudent(); }
    else if (r.name === 'practice') { nav = 'student'; lookNow = lookOf(activeStudent()); html = viewPlay(r.a, 'practice'); }
    else if (r.name === 'preview') { nav = lastRole === 'student' ? 'home' : lastRole; html = viewPlay(r.a, 'preview'); }
    else if (r.name === 'done') { nav = 'student'; lookNow = lookOf(activeStudent()); html = viewDone(); }
    else if (r.name === 'library') { nav = lastRole === 'student' ? 'home' : lastRole; html = viewLibrary(); }
    else if (r.name === 'parent') { nav = 'parent'; lookNow = r.a ? lookOf(student(r.a)) : null; html = r.a ? viewParentStudent(r.a) : viewParent(); }
    else if (r.name === 'teacher') { nav = 'teacher'; lookNow = r.a === 's' ? lookOf(student(r.b)) : null; html = r.a === 'g' ? viewTeacherGroup(r.b) : r.a === 's' ? viewTeacherStudent(r.b) : viewTeacher(); }
    else html = viewHome();
    if (html == null) return; // a view redirected
    if (r.name !== 'practice' && r.name !== 'preview') { play = null; if (r.name !== 'done') lastPage = here; }
    app.classList.toggle('no-anim', !!keepScroll);
    app.innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
      var on = a.getAttribute('data-nav') === nav;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.body.setAttribute('data-view', r.name);
    if (!keepScroll) window.scrollTo(0, 0);
    if (pendingAssign) {
      pendingAssign = false;
      var fa = document.getElementById('fold-assign');
      if (fa) { fa.scrollIntoView({ block: 'start' }); var fs = fa.querySelector('summary'); if (fs) fs.focus({ preventScroll: true }); }
    }
  }
  function focusTitle() { var t = document.querySelector('.step-title'); if (t) t.focus({ preventScroll: true }); }

  /* ───────── HOME ───────── */
  function previewCard(id) {
    var s = D.scenario(id);
    return '<article class="pcard"' + topicVars(s.topic) + '><div class="pcard-top">' + art(id, 'art-card') + chip(s.topic) + '</div>' +
      '<div class="pcard-body"><h3>' + esc(s.title) + '</h3><p>' + esc(s.ask) + '</p>' +
      '<a class="btn small ghost" href="#/preview/' + id + '">See how it works</a></div></article>';
  }
  function groupTabs(act, cur, withAll) {
    var tabs = (withAll ? [{ id: 'all', name: 'All ' + D.scenarios.length }] : []).concat(D.groups);
    return '<div class="filter gtabs" role="group" aria-label="Choose a type of practice">' + tabs.map(function (g) {
      var n = g.id === 'all' ? '' : ' · ' + D.scenarios.filter(function (s) { return D.topic(s.topic).group === g.id; }).length;
      return '<button type="button" class="fchip' + (cur === g.id ? ' is-on' : '') + '" data-act="' + act + '" data-group="' + g.id + '" aria-pressed="' + (cur === g.id) + '">' + esc(g.tab || g.name) + n + '</button>';
    }).join('') + '</div>';
  }
  function viewHome() {
    var f = D.scenario(D.featured[0]);
    return '<div class="page">' +
      '<section class="hero">' +
        '<div class="hero-copy"><p class="eyebrow">' + ICON.ripple + ' For students and the adults who support them</p>' +
          '<h1>Practice what to do in real-life situations, <span class="accent">before or after they happen.</span></h1>' +
          '<p class="lede">ChoiceLab helps students practice real-life situations, think through their choices, and learn what they can do next. Parents and teachers can assign practice and follow their progress.</p>' +
          '<div class="actions"><a class="btn primary" href="#/student">I’m a student</a><a class="btn ghost" href="#/parent">I’m a parent</a><a class="btn ghost" href="#/teacher">I’m a teacher</a></div></div>' +
        '<div class="hero-stage"><div class="stage-bg">' + rings('live', 9) + '</div><aside class="hero-demo" aria-label="Sample practice">' +
          '<div class="demo-head">' + art(f.id, 'art-card') + '<div>' + chip(f.topic) + '<h2>' + esc(f.title) + '</h2><p class="place">' + ICON.pin + esc(f.place) + '</p></div></div>' +
          '<p class="demo-ask">' + esc(f.ask) + '</p>' +
          '<ul class="demo-choices">' + f.choices.map(function (c, i) { return '<li><span class="key">' + 'ABC'[i] + '</span>' + esc(c.label) + '</li>'; }).join('') + '</ul>' +
          '<a class="btn primary block" href="#/preview/' + f.id + '">See how it works ' + ICON.arrow + '</a>' +
        '</aside></div>' +
      '</section>' +

      '<section class="steps3 five" aria-label="How a practice works">' +
        '<div class="step3"><span class="num">1</span><div><h3>Situation</h3><p>A short real-life moment with a picture. Listen reads it aloud.</p></div></div>' +
        '<div class="step3"><span class="num">2</span><div><h3>Your choice</h3><p>Three honest options, each with a picture of what it looks like.</p></div></div>' +
        '<div class="step3"><span class="num">3</span><div><h3>What could happen</h3><p>The likely outcome of that exact choice, as cause and effect.</p></div></div>' +
        '<div class="step3"><span class="num">4</span><div><h3>Reflect</h3><p>Write why you chose it and what you’d do next time, in 10 words or more.</p></div></div>' +
        '<div class="step3"><span class="num">5</span><div><h3>Complete</h3><p>A message for that choice, Courage Credits, and the next practice.</p></div></div>' +
      '</section>' +

      '<section class="block"><div class="block-head"><h2>Try a scenario</h2><p>No sign-in needed. Nothing is saved while you preview.</p></div>' +
        '<div class="pgrid">' + D.featured.map(previewCard).join('') + '</div></section>' +

      '<section class="panel libcta"><div><h2>' + D.scenarios.length + ' scenarios across ' + D.topics.length + ' topics</h2>' +
        '<p>Students see only the practices assigned to them, plus any optional ones a parent or teacher makes available. Parents and teachers can browse everything.</p>' +
        D.groups.map(function (g) {
          var ts = D.topics.filter(function (t) { return t.group === g.id; });
          return '<p class="libcta-g"><strong>' + esc(g.name) + '</strong> · ' + D.scenarios.filter(function (s) { return D.topic(s.topic).group === g.id; }).length + ' scenarios</p><div class="row-tags">' + ts.map(function (t) { return chip(t.id); }).join('') + '</div>';
        }).join('') + '</div>' +
        '<a class="btn ghost" href="#/library">Browse the full library ' + ICON.arrow + '</a></section>' +
    '</div>';
  }

  /* ───────── LIBRARY (parents and teachers) ───────── */
  function viewLibrary() {
    var topics = D.topics.filter(function (t) { return libGroup === 'all' || t.group === libGroup; });
    return '<div class="page">' +
      '<div class="ptop">' + backBtn(lastRole === 'parent' ? '#/parent' : lastRole === 'teacher' ? '#/teacher' : '#/') + '</div>' +
      '<section class="phead"><p class="eyebrow">For parents and teachers</p><h1>Scenario library</h1>' +
        '<p class="lede">' + D.scenarios.length + ' scenarios across ' + D.topics.length + ' topics. Preview any of them here. To assign one, open a student’s profile or a class and use “Assign practice.”</p></section>' +
      groupTabs('lib-group', libGroup, true) +
      topics.map(function (t) {
        return '<section class="block lib-topic"><div class="block-head"><h2>' + esc(t.name) + '</h2><p>' + esc(D.group(t.group).name) + '</p></div><div class="rows">' +
          D.scenarios.filter(function (s) { return s.topic === t.id; }).map(function (s) {
            return '<article class="row">' + art(s.id, 'art-thumb') + '<div class="row-main">' + chip(s.topic) + '<h3>' + esc(s.title) + '</h3><p class="place">' + ICON.pin + esc(s.place) + '</p></div>' +
              '<a class="btn small ghost" href="#/preview/' + s.id + '">Preview</a></article>';
          }).join('') + '</div></section>';
      }).join('') +
    '</div>';
  }
  /* the assign list used on a student's profile and on a class page: pick a section, then topics */
  function assignList(rowBtns) {
    var g = D.group(assignGroup) || D.groups[0];
    return '<p class="pick-type">Type of practice</p>' + groupTabs('assign-group', g.id) + '<p class="hint gblurb"><strong>' + esc(g.name) + '.</strong> ' + esc(g.blurb) + '</p><div class="agroups">' + D.topics.filter(function (t) { return t.group === g.id; }).map(function (t) {
      var rows = D.scenarios.filter(function (s) { return s.topic === t.id; }).map(function (s) {
        return '<li class="arow">' + art(s.id, 'art-tiny') + '<span class="arow-main"><strong>' + esc(s.title) + '</strong><span>' + esc(s.ask) + ' <a href="#/preview/' + s.id + '">Preview</a></span></span>' + rowBtns(s) + '</li>';
      }).join('');
      return '<div class="agroup"><h3>' + chip(t.id) + '</h3><ul>' + rows + '</ul></div>';
    }).join('') + '</div>';
  }
  /* a section adults can open when they want the detail; it remembers whether it is open while they stay on the page */
  function fold(key, title, sub, body, def) {
    var open = folds[key] == null ? !!def : folds[key];
    return '<section class="panel foldp" id="fold-' + key + '"><details class="fold' + (key === 'assign' ? ' assign' : '') + '" data-fold="' + key + '"' + (open ? ' open' : '') + '>' +
      '<summary><div><h2>' + title + '</h2><p class="hint">' + sub + '</p></div><span class="fold-cue"><span class="fold-word" aria-hidden="true"></span><span class="chev" aria-hidden="true"></span></span></summary>' +
      '<div class="fold-body">' + body + '</div></details></section>';
  }
  /* ask before anything that removes a student, a group or saved progress */
  function ask(o) {
    var d = document.createElement('dialog');
    d.className = 'ask';
    d.setAttribute('aria-labelledby', 'askTitle');
    d.innerHTML = '<h2 id="askTitle">' + esc(o.title) + '</h2><p>' + esc(o.body) + '</p><div class="actions">' +
      '<button type="button" class="btn ghost" data-no>Cancel</button><button type="button" class="btn danger" data-yes>' + esc(o.ok) + '</button></div>';
    if (!d.showModal) { if (window.confirm(o.title + '\n\n' + o.body)) o.then(); return; }
    document.body.appendChild(d);
    d.querySelector('[data-no]').onclick = function () { d.close(); };
    d.querySelector('[data-yes]').onclick = function () { d.close('yes'); };
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.addEventListener('close', function () { var yes = d.returnValue === 'yes'; d.remove(); if (yes) o.then(); });
    d.showModal();
    d.querySelector('[data-no]').focus();
  }
  function pairBtns(act, attrs, on) {
    var b = function (opt, isOn, label) {
      return '<button type="button" class="btn small ' + (isOn ? 'on' : 'ghost') + '" data-act="' + act + '"' + attrs + (opt ? ' data-opt="1"' : '') + ' aria-pressed="' + isOn + '">' + (isOn ? ICON.check + ' ' : '') + label + '</button>';
    };
    return '<span class="pair">' + b(0, on === 'assigned', on === 'assigned' ? 'Assigned' : 'Assign') + b(1, on === 'optional', 'Optional') + '</span>';
  }

  /* ───────── STUDENT ───────── */
  function viewStudentPicker() {
    return '<div class="page narrow"><section class="panel center">' +
      '<p class="eyebrow">Student practice</p><h1>Who’s practicing?</h1><p class="lede">Pick your profile. Your progress is saved to it, and the adults who support you see the same profile.</p>' +
      '<div class="who">' + state.students.map(function (s) {
        var n = doneList(s.id).length;
        return '<button type="button" class="who-card" data-act="pick-student" data-id="' + s.id + '">' + avatar(s, 'lg') + '<strong>' + esc(s.name) + '</strong><span>' + esc(s.grade) + ' · ' + plural(n, 'practice') + ' done</span></button>';
      }).join('') + '</div>' +
      '<p class="hint">Not on the list? A parent or teacher can add you from their view.</p>' +
    '</section></div>';
  }
  function viewStudentSignIn() {
    return '<div class="page narrow"><section class="panel center signin">' +
      '<p class="eyebrow">Student practice</p><h1>Open your practice</h1>' +
      '<p class="lede">Type the access code and 4-digit PIN your parent or teacher gave you. You don’t need an email address.</p>' +
      '<form id="signInForm" class="signin-form" novalidate>' +
        '<label class="field"><span>Access code</span><input name="code" class="codein" maxlength="8" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="6 letters and numbers" value="' + esc(joinCode) + '"></label>' +
        '<label class="field"><span>PIN</span><input name="pin" class="codein" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="4 digits"></label>' +
        '<p id="signInMsg" class="voice-status" role="alert"></p>' +
        '<button class="btn primary big block" type="submit">Open my practice ' + ICON.arrow + '</button></form>' +
      '<p class="hint">No code yet, or forgot your PIN? Ask your parent or teacher. They can give you a new PIN.</p>' +
    '</section></div>';
  }
  function scenarioRow(st, s) {
    var done = isDone(st.id, s.id), e = assignEntry(st.id, s.id), started = isStarted(st.id, s.id);
    var lock = openOne(st.id), locked = lock && lock !== s.id;
    var status = (e ? '<span class="status assigned">' + esc(fromLabel(st.id, s.id)) + (e.opt ? ' · optional' : '') + '</span>' : '') +
      (done ? '<span class="status done">' + ICON.check + ' Done</span>' : started ? '<span class="status started">Started</span>' : '<span class="status todo">Not started</span>');
    return '<article class="row' + (done ? ' is-done' : '') + (locked ? ' is-locked' : '') + '">' + art(s.id, 'art-thumb') +
      '<div class="row-main"><div class="row-tags">' + chip(s.topic) + status + '</div><h3>' + esc(s.title) + '</h3><p class="place">' + ICON.pin + esc(s.place) + '</p></div>' +
      (locked ? '<span class="lockmsg">' + ICON.lock + ' Finish “' + esc(D.scenario(lock).title) + '” first</span>'
        : '<a class="btn small ' + (done ? 'ghost' : 'primary') + '" href="#/practice/' + s.id + '">' + (done ? 'Practice again' : started ? 'Keep going' : 'Start') + '</a>') + '</article>';
  }
  function viewStudent() {
    var st = activeStudent();
    if (!st) return ACCESS ? viewStudentSignIn() : viewStudentPicker();
    var done = doneList(st.id), w = waiting(st.id), o = optional(st.id), total = scopeCount(st.id), going = openOne(st.id), nextId = going || w[0] || o[0];
    var nxOpt = nextId && o.indexOf(nextId) >= 0;
    var pct = total ? Math.round(done.length / total * 100) : 0;
    var nx = nextId && D.scenario(nextId);
    var rows = function (ids) { return '<div class="rows">' + ids.map(function (id) { return scenarioRow(st, D.scenario(id)); }).join('') + '</div>'; };
    var up = nx
      ? '<section class="upnext">' + rings('', 8) + '<div class="upnext-main">' + art(nx.id, 'art-card') + '<div><p class="eyebrow">' + (going ? 'Finish this one first' : 'Up next') + (assignEntry(st.id, nx.id) ? ' · ' + esc(fromLabel(st.id, nx.id)) : '') + (nxOpt ? ' · optional' : '') + '</p><h2>' + esc(nx.title) + '</h2><div class="row-tags">' + chip(nx.topic) + '<span class="place">' + ICON.pin + esc(nx.place) + '</span></div></div></div>' +
        '<a class="btn sun big" href="#/practice/' + nx.id + '">' + (going ? 'Keep going ' : 'Start practice ') + ICON.arrow + '</a></section>'
      : '<section class="upnext all-done">' + rings('', 8) + '<div><p class="eyebrow">' + (done.length ? 'All caught up' : 'Nothing assigned yet') + '</p><h2>' + (done.length ? 'You’ve finished everything assigned to you.' : 'Your practices will show up here.') + '</h2><p>' + (done.length ? 'You can practice one again below to try a different choice.' : 'Ask your parent or teacher to assign your first practice.') + '</p></div></section>';
    return '<div class="page">' +
      '<section class="me">' + ringAvatar(st, 'xl', pct, done.length + ' of ' + total + ' practices done') +
        '<div class="me-main"><p class="eyebrow">' + esc(st.grade) + '</p><h1>' + lets('Let’s practice, ' + esc(first(st.name)) + '.') + '</h1>' +
          '<p class="me-stats"><strong>' + done.length + '</strong> of ' + total + ' practices done' + (w.length ? ' · <strong>' + w.length + '</strong> assigned and waiting' : '') + ' · <strong>' + credits(st.id) + '</strong> Courage Credits</p></div>' +
        '<div class="me-actions"><a class="btn small ghost" href="#/student/profile">Edit my character</a><button type="button" class="btn small quiet" data-act="switch-student">' + (ACCESS ? 'Sign out' : 'Switch student') + '</button></div>' +
      '</section>' + up +
      (w.length ? '<section class="block"><div class="block-head"><h2>Assigned to you</h2><p>' + plural(w.length, 'practice') + ' picked for you. Finish each one before you start the next.</p></div>' + rows(w) + '</section>' : '') +
      (o.length ? '<section class="block"><div class="block-head"><h2>Optional practices</h2><p>Extra practices you can try if you want to.</p></div>' + rows(o) + '</section>' : '') +
      (done.length ? '<section class="block"><div class="block-head"><h2>Finished</h2><p>Practice one again to try a different choice.</p></div>' + rows(done.map(function (s) { return s.id; })) + '</section>' : '') +
    '</div>';
  }

  /* the character maker: every part is a choice, and the picture updates as you pick */
  function swatches(name, list, cur, label) {
    return '<fieldset class="field"><legend>' + label + '</legend><div class="swatches">' + list.map(function (v, i) {
      return '<label class="sw"><input type="radio" name="' + name + '" value="' + v + '"' + (v === cur ? ' checked' : '') + ' aria-label="' + label + ' ' + (i + 1) + '"><span style="--sw:' + (name === 'skin' ? A.options.skinHex[v] : v) + '"></span></label>';
    }).join('') + '</div></fieldset>';
  }
  function viewProfileEdit() {
    var st = activeStudent();
    if (!st) { go('#/student'); return null; }
    if (!draft) draft = { name: st.name, grade: st.grade, look: Object.assign({}, st.look) };
    var O = A.options, L = draft.look;
    var grades = ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    var presets = '';
    for (var i = 0; i < A.avatarCount; i++) presets += '<button type="button" class="preset" data-act="preset" data-i="' + i + '" aria-label="Start from character ' + (i + 1) + '"><span class="avatar md">' + A.avatar(i, '') + '</span></button>';
    return '<div class="page"><a class="back" href="#/student">' + ICON.back + ' Back to my practice</a>' +
      '<form class="panel maker" id="profileForm">' +
        /* the preview follows you down the options; it sticks inside its own column, never over the buttons */
        '<div class="maker-side"><div class="maker-stick"><p class="eyebrow">My character</p><h1>Make it look like you.</h1>' +
          '<div class="maker-preview" id="lookPreview">' + A.portrait(L, 'Your character') + '</div>' +
          '<p class="hint">This is who you’ll see in your scenarios and in the picture for each choice. Your parent and teacher see the same character on your progress page.</p>' +
        '</div></div>' +
        '<div class="maker-opts">' +
          '<div class="maker-about"><label class="field"><span>Name</span><input name="name" maxlength="40" required value="' + esc(draft.name) + '" autocomplete="off"></label>' +
            '<label class="field"><span>Grade</span><select name="grade">' + grades.map(function (g) { return '<option' + (g === draft.grade ? ' selected' : '') + '>' + g + '</option>'; }).join('') + '</select></label></div>' +
          '<fieldset class="field"><legend>Quick start</legend><div class="presets">' + presets + '</div></fieldset>' +
          swatches('skin', O.skin, L.skin, 'Skin tone') +
          '<fieldset class="field"><legend>Hair or head covering</legend><div class="hairs">' + O.hair.map(function (h) {
            return '<label class="hairpick"><input type="radio" name="hair" value="' + h[0] + '"' + (h[0] === L.hair ? ' checked' : '') + '><span class="avatar md" data-hair="' + h[0] + '">' + A.avatar(Object.assign({}, L, { hair: h[0] }), '') + '</span><em>' + h[1] + '</em></label>';
          }).join('') + '</div></fieldset>' +
          swatches('hc', O.hc, L.hc, 'Hair or covering colour') +
          '<fieldset class="field"><legend>Top</legend><div class="optchips">' + O.top.map(function (t) {
            return '<label class="optchip"><input type="radio" name="top" value="' + t[0] + '"' + (t[0] === L.top ? ' checked' : '') + '><span>' + t[1] + '</span></label>';
          }).join('') + '</div></fieldset>' +
          swatches('tc', O.tc, L.tc, 'Top colour') +
          '<fieldset class="field"><legend>Glasses</legend><div class="optchips"><label class="optchip"><input type="checkbox" name="glasses"' + (L.glasses ? ' checked' : '') + '><span>I wear glasses</span></label></div></fieldset>' +
          swatches('bg', O.bg, L.bg || O.bg[0], 'Background') +
          '<div class="field voice-field"><label for="voicePick"><span>Read-aloud voice</span></label><div class="voice-row"><select id="voicePick" name="voice">' + Voice.options() + '</select>' +
            '<button type="button" class="btn small ghost" data-act="voice-test">' + ICON.sound + ' Hear it</button></div><p class="hint" id="voiceTip">' + esc(Voice.tip()) + '</p></div>' +
        '</div>' +
        '<div class="actions maker-actions"><button class="btn primary" type="submit">Save my character</button><a class="btn ghost" href="#/student">Cancel</a></div>' +
      '</form></div>';
  }
  function readMaker(f) {
    var g = function (n) { var el = f.querySelector('input[name=' + n + ']:checked'); return el ? el.value : draft.look[n]; };
    draft.name = f.elements.name.value; draft.grade = f.elements.grade.value;
    draft.look = { skin: g('skin'), hair: g('hair'), hc: g('hc'), top: g('top'), tc: g('tc'), bg: g('bg'), glasses: f.elements.glasses.checked ? 1 : 0 };
  }
  function paintMaker() {
    var p = document.getElementById('lookPreview'); if (p) p.innerHTML = A.portrait(draft.look, 'Your character');
    Array.prototype.forEach.call(document.querySelectorAll('[data-hair]'), function (el) { el.innerHTML = A.avatar(Object.assign({}, draft.look, { hair: el.getAttribute('data-hair') }), ''); });
  }

  /* ───────── PLAY: situation → your choice → what could happen → reflect → complete ───────── */
  var STEPS = ['Situation', 'Your choice', 'What could happen', 'Reflect', 'Complete'];
  function stepper(n) {
    return '<ol class="stepper' + (n > 5 ? ' all' : '') + '" aria-label="' + (n > 5 ? 'All 5 steps done' : 'Step ' + n + ' of 5') + '">' + STEPS.map(function (l, i) {
      return '<li class="' + (i + 1 < n ? 'was' : i + 1 === n ? 'now' : '') + '"' + (i + 1 === n ? ' aria-current="step"' : '') + '><span>' + (i + 1 < n ? ICON.check : i + 1) + '</span>' + l + '</li>';
    }).join('') + '</ol>';
  }
  function viewPlay(id, mode) {
    var s = D.scenario(id), st = activeStudent();
    if (!s) { go(mode === 'practice' ? '#/student' : '#/'); return null; }
    if (mode === 'practice' && (!st || !canSee(st.id, id))) { go('#/student'); return null; }
    if (mode === 'practice') { var lock = openOne(st.id); if (lock && lock !== id) { go('#/student'); return null; } }
    if (!play || play.id !== id || play.mode !== mode) {
      play = { id: id, mode: mode, step: 1, sel: null, note: '', first: mode === 'practice' && !isDone(st.id, id) };
      if (mode === 'practice' && isStarted(st.id, id)) {
        var lt = rec(st.id, id).tries, lc = lt[lt.length - 1].c;
        if (choiceOf(s, lc)) { play.sel = lc; play.step = 3; }
      }
    }
    if (play.step > 2 && !play.sel) play.step = 2;
    return [playSituation, playChoose, playOutcome, playReflect, playComplete][play.step - 1](s);
  }
  function backLink(mode) {
    return mode === 'practice' ? '<a class="back" href="#/student">' + ICON.back + ' My practice</a>' : backBtn(lastPage);
  }
  function playTop(mode, n) {
    return '<div class="play-top' + (n > 5 ? ' done' : '') + '">' + (n > 5 ? '<p class="cmp-step">Scenario complete (5/5)</p>' : backLink(mode)) + stepper(n) + '</div>' +
      (mode === 'preview' && n < 5 ? '<p class="banner">You’re previewing. Nothing is saved. <a href="#/student">Start practicing as a student</a></p>' : '');
  }
  function scnHead(s) {
    return '<header class="scn-head">' + art(s.id, 'art-play') +
      '<div class="scn-meta">' + chip(s.topic) + '<h1 class="scn-title step-title" tabindex="-1">' + esc(s.title) + '</h1><p class="place">' + ICON.pin + esc(s.place) + '</p></div></header>';
  }
  /* 1 · Situation */
  function playSituation(s) {
    var mode = play.mode;
    return '<div class="page play">' + playTop(mode, 1) +
      (s.note ? '<p class="banner note"><strong>Heads up:</strong> ' + esc(s.note) + ' <a href="' + (mode === 'practice' ? '#/student' : esc(lastPage)) + '">Skip this one</a></p>' : '') +
      scnHead(s) +
      '<section class="scn-card" aria-label="The situation"><div class="scn-card-top"><h2>The situation</h2>' + speakBtn('scenario', 'Listen') + '</div>' +
        '<p class="scn-text">' + said(s.text) + '</p></section>' +
      '<p id="voiceStatus" class="voice-status" role="status" aria-live="polite"></p>' +
      '<p class="pick-status">Read or listen first. Then choose what you would do.</p>' +
      '<div class="action-bar"><button type="button" class="btn primary big" data-act="step" data-to="2">Next: your choice ' + ICON.arrow + '</button></div>' +
    '</div>';
  }
  /* 2 · Your choice */
  function playChoose(s) {
    var mode = play.mode;
    return '<div class="page play">' + playTop(mode, 2) +
      '<section class="recap">' + art(s.id, 'art-mini') + '<div><p class="eyebrow">' + esc(s.title) + '</p><p>' + said(s.text) + '</p></div></section>' +
      '<form id="choiceForm" class="choose" novalidate>' +
        '<div class="ask-row"><h1 class="scn-ask step-title" id="askTitle" tabindex="-1">' + esc(s.ask) + '</h1>' + speakBtn('choices', 'Hear the choices') + '</div>' +
        '<div class="choices" role="radiogroup" aria-labelledby="askTitle">' + s.choices.map(function (c, i) {
          var on = play.sel === c.id;
          return '<label class="choice' + (on ? ' is-selected' : '') + '"><input type="radio" name="choice" value="' + c.id + '"' + (on ? ' checked' : '') + '>' +
            choiceArt(s, c, 'art-choice') +
            '<span class="choice-main"><span class="key" aria-hidden="true">' + 'ABC'[i] + '</span><span class="choice-text">' + esc(c.label) + '</span></span><span class="tick" aria-hidden="true">' + ICON.check + '</span></label>';
        }).join('') + '</div>' +
        '<p id="voiceStatus" class="voice-status" role="status" aria-live="polite"></p>' +
        '<p id="pickStatus" class="pick-status" role="status" aria-live="polite">' + pickText(s) + '</p>' +
        '<div class="retry-row"><button type="button" class="btn ghost block" data-act="step" data-to="1">Back to the situation</button></div>' +
        '<div class="action-bar two"><button type="button" class="btn ghost" data-act="step" data-to="1">Back to the situation</button>' +
          '<button type="submit" class="btn primary big" id="continueBtn"' + (play.sel ? '' : ' disabled') + '>See what could happen ' + ICON.arrow + '</button></div>' +
      '</form></div>';
  }
  function pickText(s) {
    if (!play.sel) return 'Pick the choice closest to what you’d really do. You need to choose one to continue.';
    var i = s.choices.map(function (c) { return c.id; }).indexOf(play.sel);
    return '<strong>Choice ' + 'ABC'[i] + ' selected.</strong> Tap the button to see what could happen.';
  }
  function nextTarget(s) {
    if (play.mode === 'practice') {
      var st = activeStudent(), q = queue(st.id).filter(function (id) { return id !== s.id; });
      return q.length ? { href: '#/practice/' + q[0], label: 'Continue to next scenario', sub: D.scenario(q[0]).title } : { href: '#/done', label: 'Finish practice', sub: 'See how you did' };
    }
    var ids = D.scenarios.map(function (x) { return x.id; }), order = D.featured.concat(ids.filter(function (x) { return D.featured.indexOf(x) < 0; }));
    var n = order[(order.indexOf(s.id) + 1) % order.length];
    return { href: '#/preview/' + n, label: 'Try another scenario', sub: D.scenario(n).title };
  }
  function choseCard(s, c) {
    return '<section class="chose">' + choiceArt(s, c, 'art-mini') +
      '<div class="chose-main"><p class="eyebrow">' + esc(s.title) + ' · You chose</p><p class="chose-label">' + esc(c.label) + '</p>' + tone(c.kind) + '</div></section>';
  }
  /* 3 · What could happen: the choice (cause) beside its likely outcome (effect) */
  function playOutcome(s) {
    var c = choiceOf(s, play.sel), K = D.kind[c.kind], mode = play.mode;
    return '<div class="page play reflect outcome kind-' + c.kind + '">' + playTop(mode, 3) +
      '<div class="reflect-head"><div><p class="eyebrow">What could happen</p><h1 class="reflect-title step-title" id="reflectTitle" tabindex="-1">' + lets(esc(K.heading)) + '</h1></div>' + speakBtn('outcome', 'Listen') + '</div>' +
      '<section class="cause" aria-label="Your choice and what could happen">' +
        '<figure class="cause-fig">' + choiceArt(s, c, 'art-cause') + '<figcaption><b>Your choice</b><span>' + esc(c.label) + '</span></figcaption></figure>' +
        '<span class="cause-arrow" aria-hidden="true">' + ICON.ripple + ICON.arrow + '</span>' +
        '<figure class="cause-fig effect">' + effectArt(s, c, 'art-cause') + '<figcaption><b>What could happen</b>' + tone(c.kind) + '</figcaption></figure>' +
      '</section>' +
      '<section class="rcard impact"><h2>Why that could happen</h2><p>' + said(c.impact) + '</p></section>' +
      (s.resource ? '<p class="resource">Learn more with a trusted adult: <a href="' + esc(s.resource.url) + '" target="_blank" rel="noopener">' + esc(s.resource.label) + '</a></p>' : '') +
      '<p id="voiceStatus" class="voice-status" role="status" aria-live="polite"></p>' +
      '<div class="retry-row"><button type="button" class="btn ghost block" data-act="retry">Try a different choice</button></div>' +
      '<div class="action-bar two"><button type="button" class="btn ghost" data-act="retry">Try a different choice</button>' +
        '<button type="button" class="btn primary big" data-act="step" data-to="4">Next: reflect ' + ICON.arrow + '</button></div>' +
    '</div>';
  }
  /* 4 · Reflect: the student writes at least ten words before they can finish */
  var REFLECT_ASK = {
    strong: 'Why did you choose that? What would help you do it when it’s real?',
    mixed: 'Why did you choose that? What could you add next time to make it stronger?',
    risky: 'Why did you choose that? What might you do differently next time?'
  };
  function reflectQ(c) { return REFLECT_ASK[c.kind] || REFLECT_ASK.mixed; }
  function countText(n) {
    return n >= MIN_WORDS ? '<strong>' + n + ' words.</strong> You’re ready to finish.' : n + ' of ' + MIN_WORDS + ' words. ' + (n ? 'Keep going.' : 'Write at least ' + MIN_WORDS + ' words to finish.');
  }
  function playReflect(s) {
    var c = choiceOf(s, play.sel), K = D.kind[c.kind], mode = play.mode, st = activeStudent();
    var r = mode === 'practice' && st ? rec(st.id, s.id) : null, n = words(play.note), must = mode === 'practice';
    var values = r
      ? '<section class="values"><h2>What mattered most to you in that moment?</h2><p class="hint">Optional. Tap one.</p><div class="pills">' + D.values.map(function (v) {
          var on = r.value === v;
          return '<button type="button" class="pill' + (on ? ' is-on' : '') + '" data-act="value" data-value="' + esc(v) + '" aria-pressed="' + !!on + '">' + esc(v) + '</button>';
        }).join('') + '</div></section>' : '';
    return '<div class="page play reflect think kind-' + c.kind + '">' + playTop(mode, 4) +
      choseCard(s, c) +
      '<div class="reflect-head"><div><p class="eyebrow">Reflect</p><h1 class="reflect-title step-title" tabindex="-1">Think it through.</h1></div>' + speakBtn('reflect', 'Listen') + '</div>' +
      '<section class="rcard next"><h2>' + K.nextLabel + '</h2><p>' + said(c.next) + '</p></section>' +
      '<form id="reflectForm" class="rform" novalidate>' +
        '<label class="rform-q" for="reflectText">' + reflectQ(c) + '</label>' +
        '<p class="hint" id="reflectHint">' + (must ? 'Write at least ' + MIN_WORDS + ' words in your own words to finish. There are no wrong answers.' : 'Students write at least ' + MIN_WORDS + ' words here before they can finish. In a preview you can skip it.') + '</p>' +
        '<textarea id="reflectText" name="note" rows="4" maxlength="600" aria-describedby="reflectHint wordCount" placeholder="I chose that because… Next time I could…">' + esc(play.note) + '</textarea>' +
        '<p id="wordCount" class="wordcount' + (n >= MIN_WORDS ? ' is-ready' : '') + '" role="status" aria-live="polite">' + countText(n) + '</p>' +
        values +
        '<p id="voiceStatus" class="voice-status" role="status" aria-live="polite"></p>' +
        '<div class="retry-row"><button type="button" class="btn ghost block" data-act="step" data-to="3">Back to what could happen</button></div>' +
        '<div class="action-bar two"><button type="button" class="btn ghost" data-act="step" data-to="3">Back</button>' +
          '<button type="submit" class="btn primary big" id="finishBtn"' + (must && n < MIN_WORDS ? ' disabled' : '') + '>Finish scenario ' + ICON.arrow + '</button></div>' +
      '</form></div>';
  }
  /* 5 · Complete: a message for this scenario and this choice, credit, and the student's own words */
  function wrapUp(s) {
    var c = choiceOf(s, play.sel), mode = play.mode, st = activeStudent();
    var r = mode === 'practice' && st ? rec(st.id, s.id) : null;
    var again = mode === 'practice' && !(play.first && doneList(st.id).length < 2);
    var w = { c: c, value: r && r.value, note: play.note, total: mode === 'practice' ? credits(st.id) : null,
      title: ['You made it through ' + (again ? 'another' : 'a'), 'real-life moment.'], sum: WRAP[c.kind],
      foot: 'Credits celebrate practice, not perfect answers.' };
    if (mode === 'preview') { w.amount = '+' + CREDIT + ' Courage Credits'; w.why = 'What a student earns for each finished practice. Nothing is saved in a preview.'; }
    else if (play.first) { w.amount = '+' + CREDIT + ' Courage Credits'; w.why = 'Earned for practicing a thoughtful next step.'; }
    else { w.amount = CREDIT + ' Courage Credits kept'; w.why = 'You earned these the first time. Trying it again is practice too.'; }
    return w;
  }
  function playComplete(s) {
    var w = wrapUp(s), c = w.c, mode = play.mode, nx = nextTarget(s);
    /* the last picture is a helpful outcome with the student in it: their own choice when it helps, otherwise the stronger step */
    var best = c.kind === 'strong' ? c : s.choices.filter(function (x) { return x.kind === 'strong'; })[0] || c;
    var cap = best === c ? 'What your choice can lead to' : 'Next time you could: ' + esc(best.label);
    var away = mode === 'practice' ? '<a class="btn ghost" href="#/student">Return to assignments</a>' : '<a class="btn ghost" data-act="back" href="' + esc(lastPage) + '">Back to where you were</a>';
    return '<div class="page play complete kind-' + c.kind + '">' + playTop(mode, 6) +
      '<header class="cmp-head"><h1 class="cmp-title step-title" id="completeTitle" tabindex="-1">' + ICON.burst + w.title[0] + ' <em>' + w.title[1] + '</em></h1></header>' +
      '<p class="cmp-sum">You chose: <strong>' + esc(c.label) + '</strong>' + (/[.!?”’"]$/.test(c.label) ? '' : '.') + '<span>' + w.sum + ' ' + said(c.close) + '</span></p>' +
      '<p class="cmp-listen">' + speakBtn('complete', 'Listen') + '</p>' +
      '<figure class="cmp-fig"><span class="art art-hero">' + A.effectPic(s, best, lookNow, 'Picture: ' + (best === c ? 'what your choice can lead to' : 'what a stronger step can lead to')) + '</span><figcaption>' + cap + '</figcaption></figure>' +
      '<section class="credit" aria-label="Courage Credits"><span class="sparks" aria-hidden="true">' + ICON.sparks + '</span><span class="sparks r" aria-hidden="true">' + ICON.sparks + '</span>' +
        '<p class="credit-amt">' + w.amount + '</p><p class="credit-why">' + w.why + '</p>' +
        (w.total != null ? '<p class="credit-total">Your total: ' + w.total + '</p>' : '') + '</section>' +
      '<section class="yours">' + ICON.bubble + '<div class="yours-main"><h2>Your reflection</h2>' +
        (w.note ? '<p class="yours-text">' + esc(w.note) + '</p>' : '<p class="yours-text muted">Students see their own written reflection here.</p>') +
        (w.value ? '<p class="yours-value">What mattered most to you: <strong>' + esc(w.value) + '</strong></p>' : '') + '</div></section>' +
      '<p id="voiceStatus" class="voice-status" role="status" aria-live="polite"></p>' +
      '<div class="cmp-actions"><a class="btn primary big" href="' + nx.href + '"><span>' + nx.label + '<small>' + esc(nx.sub) + '</small></span>' + ICON.arrow + '</a>' + away + '</div>' +
      '<p class="cmp-foot"><span>' + w.foot + '</span></p>' +
      (mode === 'preview' ? '<p class="after-note">Like it? <a href="#/student">Start practicing as a student</a> to save progress.</p>' : '') +
    '</div>';
  }
  function commitChoice() {
    var s = D.scenario(play.id);
    if (!play.sel || !s) return;
    if (play.mode === 'practice') {
      var st = activeStudent(), p = prog(st.id), r = p[s.id] || (p[s.id] = { tries: [], open: true });
      r.tries.push({ c: play.sel, at: new Date().toISOString() });
      save();
    }
    play.step = 3;
    render(); focusTitle();
  }
  function finishReflect(f) {
    var text = f.elements.note.value.replace(/\s+/g, ' ').trim().slice(0, 600);
    if (play.mode === 'practice') {
      if (words(text) < MIN_WORDS) { f.elements.note.focus(); return; }
      var st = activeStudent(), r = rec(st.id, play.id);
      if (!r || !r.tries.length) return;
      r.tries[r.tries.length - 1].note = text;
      delete r.open;
      if (sessionDone.indexOf(play.id) < 0) sessionDone.push(play.id);
      save();
    }
    play.note = text; play.step = 5;
    render(); focusTitle();
  }
  function viewDone() {
    var st = activeStudent();
    if (!st) { go('#/student'); return null; }
    var done = doneList(st.id).length, left = queue(st.id);
    var all = sessionDone.map(D.scenario).filter(Boolean), today = all.slice(-4).reverse(), more = all.length - today.length;
    return '<div class="page narrow"><section class="panel center done">' + rings('', 9) +
      '<span class="done-mark">' + ICON.ripple + '</span>' +
      '<p class="eyebrow">Practice complete</p><h1>Nice work, ' + esc(first(st.name)) + '.</h1>' +
      '<p class="lede">' + (left.length ? 'You’ve finished <strong>' + plural(done, 'practice') + '</strong>, with ' + left.length + ' more waiting.' : 'You’ve finished everything picked for you: <strong>' + plural(done, 'practice') + '</strong>. That’s a lot of real moments thought through.') + ' You have <strong>' + credits(st.id) + '</strong> Courage Credits.</p>' +
      (today.length ? '<ul class="done-list">' + today.map(function (s) {
        var r = rec(st.id, s.id), c = r && choiceOf(s, r.tries[r.tries.length - 1].c);
        return '<li>' + art(s.id, 'art-mini') + '<div><strong>' + esc(s.title) + '</strong><span>' + (c ? esc(c.close) : '') + '</span></div></li>';
      }).join('') + '</ul>' + (more > 0 ? '<p class="hint">Plus ' + plural(more, 'more practice') + ' this session.</p>' : '') : '') +
      '<div class="actions center">' + (left.length ? '<a class="btn primary" href="#/practice/' + left[0] + '">Keep practicing ' + ICON.arrow + '</a>' : '') +
        '<a class="btn ' + (left.length ? 'ghost' : 'primary') + '" href="#/student">Back to my practice</a></div>' +
    '</section></div>';
  }

  /* ───────── PARENT ───────── */
  function lastPracticed(sid) {
    var d = doneList(sid);
    if (!d.length) return 'Hasn’t practiced yet';
    var t = rec(sid, d[0].id).tries;
    return 'Last practiced ' + fmtDate(t[t.length - 1].at).toLowerCase();
  }
  function viewParent() {
    return '<div class="page">' +
      '<div class="ptop">' + backBtn('#/') + '<a class="btn small ghost" href="#/library">Browse the full library</a></div>' +
      '<section class="phead"><p class="eyebrow">Parent view</p><h1>Your students</h1><p class="lede">Assign practice to a student, or open their profile to see what they’ve practiced, what they chose, and what they wrote.</p></section>' +
      '<div class="kids">' + family().map(function (s) {
        var done = doneList(s.id).length, w = waiting(s.id).length, total = scopeCount(s.id), pct = total ? Math.round(done / total * 100) : 0;
        return '<article class="kid">' + ringAvatar(s, 'xl', pct, done + ' of ' + total + ' practices done') +
          '<div class="kid-main"><h2><a href="#/parent/' + s.id + '">' + esc(s.name) + '</a></h2><p class="kid-grade">' + esc(s.grade) + '</p>' +
            '<p class="kid-stats"><strong>' + done + '</strong> ' + (done === 1 ? 'practice' : 'practices') + ' done' + (w ? ' · ' + w + ' assigned and waiting' : '') + '</p>' +
            '<p class="kid-last">' + lastPracticed(s.id) + '</p></div>' +
          '<div class="kid-acts"><a class="btn small primary" data-act="assign-for" href="#/parent/' + s.id + '" aria-label="Assign practice to ' + esc(s.name) + '">' + ICON.plus + ' Assign practice</a>' +
            '<a class="btn small ghost" href="#/parent/' + s.id + '" aria-label="Open ' + esc(s.name) + '’s profile">Open profile ' + ICON.arrow + '</a></div></article>';
      }).join('') + '</div>' +
      '<form class="panel add" id="addStudentForm"><h2>Add a student</h2><p class="hint">Creates a profile they can open from the Student view. They can change their own name and make their character look like them.</p>' +
        '<div class="add-row"><label class="field"><span>First and last name</span><input name="name" maxlength="40" required autocomplete="off" placeholder="e.g. Sam Rivera"></label>' +
        '<label class="field"><span>Grade</span><select name="grade"><option>Grade 4</option><option>Grade 5</option><option selected>Grade 6</option><option>Grade 7</option><option>Grade 8</option><option>Grade 9</option><option>Grade 10</option></select></label>' +
        '<button class="btn primary" type="submit">Add student</button></div></form>' +
    '</div>';
  }
  function historyItem(st, s, tag) {
    var r = rec(st.id, s.id), t = r.tries, f = choiceOf(s, t[0].c), l = choiceOf(s, t[t.length - 1].c), changed = t.length > 1 && f && l && f.id !== l.id;
    if (!f || !l) return '';
    var note = t.map(function (x) { return x.note; }).filter(Boolean).pop();
    return '<details class="hist"><summary>' + art(s.id, 'art-thumb') +
      '<span class="hist-main"><span class="row-tags">' + chip(s.topic) + (tag || '') + '<span class="when">' + fmtDate(t[t.length - 1].at) + '</span></span><strong>' + esc(s.title) + '</strong>' +
        '<span class="hist-choice">' + (changed ? '<b>First chose:</b> ' + esc(f.label) + ' <b>Then:</b> ' + esc(l.label) : '<b>Chose:</b> ' + esc(l.label)) + '</span></span>' +
      '<span class="hist-tone">' + tone(l.kind) + '<span class="chev" aria-hidden="true"></span></span></summary>' +
      '<div class="hist-body">' +
        '<p class="hist-sit"><strong>The situation:</strong> ' + esc(s.text) + '</p>' +
        '<div class="hist-grid">' +
          (changed ? '<div class="hbox"><h4>First choice ' + tone(f.kind) + '</h4><p class="q">' + esc(f.label) + '</p><p>' + esc(f.impact) + '</p></div>' : '') +
          '<div class="hbox"><h4>' + (changed ? 'Final choice ' : 'Their choice ') + tone(l.kind) + '</h4><p class="q">' + esc(l.label) + '</p><p>' + esc(l.impact) + '</p></div>' +
          '<div class="hbox"><h4>What ' + esc(first(st.name)) + ' read next</h4><p>' + esc(l.next) + '</p><p class="q">' + esc(l.close) + '</p></div>' +
          '<div class="hbox wrote"><h4>What ' + esc(first(st.name)) + ' wrote</h4>' + (note ? '<p class="q">“' + esc(note) + '”</p>' : '<p>No written reflection was saved for this practice.</p>') + '</div>' +
        '</div>' +
        (r.value ? '<p class="hist-value">What mattered most to ' + esc(first(st.name)) + ': <strong>' + esc(r.value) + '</strong></p>' : '') +
        '<p class="talk"><strong>Talk about it:</strong> ' + esc(s.talk) + '</p>' +
      '</div></details>';
  }
  function viewParentStudent(sid) {
    var st = student(sid), fam = family();
    if (!st || state.family.indexOf(sid) < 0) { go('#/parent'); return null; }
    var tabs = fam.length > 1 ? '<nav class="kidtabs" aria-label="Switch student">' + fam.map(function (s) {
      return '<a href="#/parent/' + s.id + '" class="' + (s.id === sid ? 'is-on' : '') + '"' + (s.id === sid ? ' aria-current="page"' : '') + '>' + avatar(s, 'sm') + esc(first(s.name)) + '</a>';
    }).join('') + '</nav>' : '';
    return studentReport(st, { role: 'parent', top: backBtn('#/parent') + tabs });
  }
  /* one student's own profile and progress — shared by the parent and teacher views */
  function studentReport(st, ctx) {
    var sid = st.id;
    function who(id) { var e = assignEntry(sid, id); return !e ? '' : (e.by === ctx.role ? (e.opt ? 'Offered by you' : 'Assigned by you') : (e.by === 'teacher' ? 'From ' + esc(state.teacher.name) : 'From a parent') + (e.opt ? ' · optional' : '')); }
    var done = doneList(sid), w = waiting(sid), opts = optional(sid), total = scopeCount(sid), pct = total ? Math.round(done.length / total * 100) : 0, fn = esc(first(st.name));
    var topicsTouched = D.topics.filter(function (t) { return done.some(function (s) { return s.topic === t.id; }); }).length;
    var second = done.filter(function (s) { var t = rec(sid, s.id).tries; return t.length > 1; }).length;
    var counts = { strong: 0, mixed: 0, risky: 0 };
    done.forEach(function (s) { var c = choiceOf(s, rec(sid, s.id).tries[0].c); if (c) counts[c.kind]++; });
    var talkable = done.filter(function (s) { var c = choiceOf(s, rec(sid, s.id).tries[0].c); return c && c.kind !== 'strong'; }).slice(0, 3);
    var worth = talkable.length ? '<h3 class="worth-h">Worth talking about</h3><ul class="worth">' + talkable.map(function (s) {
      return '<li>' + art(s.id, 'art-tiny') + '<span class="arow-main"><strong>' + esc(s.title) + '</strong><span>' + esc(s.talk) + '</span></span></li>';
    }).join('') + '</ul>' : '';
    var snap = done.length
      ? '<div class="snap"><div class="snapbar" role="img" aria-label="First choices: ' + counts.strong + ' helpful, ' + counts.mixed + ' partly helpful, ' + counts.risky + ' that make it harder">' +
          ['strong', 'mixed', 'risky'].map(function (k) { return counts[k] ? '<i class="tone-' + k + '" style="flex:' + counts[k] + '"></i>' : ''; }).join('') + '</div>' +
        '<ul class="legend">' + ['strong', 'mixed', 'risky'].map(function (k) { return '<li><i class="dot tone-' + k + '"></i>' + counts[k] + ' ' + D.kind[k].tag.toLowerCase() + '</li>'; }).join('') + '</ul>' +
        '<p class="hint">This counts ' + fn + '’s <em>first</em> pick in each scenario. Less helpful first picks are part of practicing: they’re the moments most worth talking through.</p>' + worth + '</div>'
      : '<p class="empty">Choices will show up here after ' + fn + ' finishes a practice.</p>';
    var byTopic = D.topics.map(function (t) {
      var all = D.scenarios.filter(function (s) { return s.topic === t.id; }), d = all.filter(function (s) { return isDone(sid, s.id); }).length;
      return '<li><span class="tname">' + esc(t.short || t.name) + '</span><span class="tbar" style="--chip-bg:' + t.bg + ';--chip-ink:' + t.ink + '"><i style="width:' + (d / all.length * 100) + '%"></i></span><span class="tnum">' + d + '/' + all.length + '</span></li>';
    }).join('');
    var assign = assignList(function (s) {
      var d = isDone(sid, s.id), e = assignEntry(sid, s.id), mine = !!e && e.by === ctx.role;
      return d ? '<span class="status done">' + ICON.check + ' Completed</span>'
        : e && !mine ? '<span class="status assigned">' + who(s.id) + '</span>'
        : pairBtns('assign', ' data-by="' + ctx.role + '" data-sid="' + sid + '" data-id="' + s.id + '"', mine ? (e.opt ? 'optional' : 'assigned') : '');
    });
    var whoChip = function (id) { var t = who(id); return t ? '<span class="status assigned">' + t + '</span>' : ''; };
    var queued = w.concat(opts), startedN = queued.filter(function (id) { return isStarted(sid, id); }).length;
    var lastTry = done.length ? rec(sid, done[0].id).tries : null;
    var waitRows = queued.map(function (id) {
      var s = D.scenario(id);
      return '<li>' + art(id, 'art-tiny') + '<span class="arow-main"><strong>' + esc(s.title) + '</strong><span>' + esc(D.topic(s.topic).name) + '</span></span>' +
        '<span class="wl-tags">' + whoChip(id) + progressChip(sid, id) + '</span></li>';
    }).join('');
    return '<div class="page">' +
      '<div class="ptop">' + ctx.top + '</div>' +
      '<section class="profile">' + avatar(st, 'xxl') +
        '<div class="profile-main"><p class="eyebrow">Student profile</p><h1>' + esc(st.name) + '</h1>' +
          '<p class="profile-meta">' + esc(st.grade) + ' · Practicing since ' + new Date(st.joined).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) + ' · ' + lastPracticed(sid) + ' · ' + credits(sid) + ' Courage Credits</p>' +
          '<p class="profile-note">' + fn + ' sees only the practices assigned or offered here, with the same name and character.</p>' +
          '<div class="profile-actions"><button type="button" class="btn primary" data-act="jump-assign">' + ICON.plus + ' Assign practice to ' + fn + '</button></div></div></section>' +
      '<section class="stats">' +
        '<div class="stat lead"><strong>' + done.length + '<small>/' + total + '</small></strong><span>Practices completed</span><span class="donut" style="--p:' + pct + '" aria-hidden="true"></span></div>' +
        '<div class="stat"><strong>' + w.length + '</strong><span>Assigned and waiting' + (startedN ? ' · ' + startedN + ' started' : '') + (opts.length ? ' · ' + opts.length + ' optional' : '') + '</span></div>' +
        '<div class="stat ring"><strong>' + topicsTouched + '<small>/' + D.topics.length + '</small></strong><span>Topics practiced</span><span class="donut soft" style="--p:' + Math.round(topicsTouched / D.topics.length * 100) + '" aria-hidden="true"></span></div>' +
        '<div class="stat"><strong>' + second + '</strong><span>Went back to try a different choice</span></div>' +
      '</section>' +
      '<section class="panel"><div class="block-head"><h2>Assigned to ' + fn + '</h2><p>' + (queued.length ? 'Who assigned each practice, and whether ' + fn + ' has started it. ' + fn + ' sees the assigned ones first, then the optional ones.' : 'Nothing is waiting right now.') + '</p></div>' +
        (queued.length ? '<ul class="waitlist">' + waitRows + '</ul>' : '<p class="empty">' + (done.length ? fn + ' has finished everything assigned. ' : '') + 'Use “Assign practice to ' + fn + '” to add a practice.</p>') + '</section>' +
      fold('done', 'Completed practices',
        done.length ? '<strong>' + plural(done.length, 'practice') + '</strong> finished · last one ' + fmtDate(lastTry[lastTry.length - 1].at).toLowerCase() + '. Open to see each choice, what ' + fn + ' read, and what ' + fn + ' wrote.' : 'Nothing completed yet.',
        done.length ? '<div class="hists">' + done.map(function (s) { return historyItem(st, s, whoChip(s.id)); }).join('') + '</div>' : '<p class="empty">When ' + fn + ' finishes a practice, it appears here with the choice they made.</p>') +
      fold('choosing', 'How ' + fn + ' is choosing',
        done.length ? 'First picks: <strong>' + counts.strong + '</strong> “' + D.kind.strong.tag + '” · <strong>' + counts.mixed + '</strong> “' + D.kind.mixed.tag + '” · <strong>' + counts.risky + '</strong> “' + D.kind.risky.tag + '.” Open for what’s worth talking about.' : 'Shows up after ' + fn + ' finishes a practice.',
        snap) +
      fold('topics', 'Progress by topic', '<strong>' + topicsTouched + ' of ' + D.topics.length + '</strong> topics practiced so far.', '<ul class="tlist">' + byTopic + '</ul>') +
      fold('assign', 'Assign practice to ' + fn, '<strong>Assign</strong> puts a practice in ' + fn + '’s “Up next.” <strong>Optional</strong> makes it available without requiring it. Tap again to remove.', assign, done.length + queued.length === 0) +
      (ACCESS ? fold('access', 'Student sign-in', fn + ' opens only their own profile with this access code and a 4-digit PIN. No email address needed.',
        '<dl class="access"><div><dt>Access code</dt><dd>' + esc(st.code) + '</dd></div><div><dt>PIN</dt><dd>' + (showPin === sid ? esc(st.pin) : '••••') + '</dd></div></dl>' +
        '<div class="actions"><button type="button" class="btn small ghost" data-act="pin-show" data-sid="' + sid + '" aria-pressed="' + (showPin === sid) + '">' + (showPin === sid ? 'Hide PIN' : 'Show PIN') + '</button>' +
          '<button type="button" class="btn small ghost" data-act="pin-reset" data-sid="' + sid + '">Reset PIN</button></div>' +
        '<p class="hint">Sign-in link for ' + fn + ': <span class="mono">' + esc(location.href.split('#')[0] + '#/join/' + st.code) + '</span><br>It opens the sign-in page with the code filled in; ' + fn + ' still types the PIN. A printable QR code of this link is planned.</p>') : '') +
    '</div>';
  }

  /* ───────── TEACHER ───────── */
  function gStats(g) {
    var sts = groupStudents(g), ids = g.assigned.filter(D.scenario), total = sts.length * ids.length, done = 0, notStarted = 0;
    sts.forEach(function (st) {
      var d = ids.filter(function (id) { return isDone(st.id, id); }).length;
      done += d; if (ids.length && !d && !ids.some(function (id) { return isStarted(st.id, id); })) notStarted++;
    });
    return { students: sts, ids: ids, total: total, done: done, pct: total ? Math.round(done / total * 100) : 0, notStarted: notStarted };
  }
  function viewTeacher() {
    var t = state.teacher, roles = ['Teacher', 'Counselor', 'Dean', 'Assistant principal'], kinds = ['Class', 'Small group', 'ISS / detention group'];
    return '<div class="page">' +
      '<div class="ptop">' + backBtn('#/') + '<a class="btn small ghost" href="#/library">Browse the full library</a></div>' +
      '<section class="phead"><p class="eyebrow">' + esc(t.role) + ' view · ' + esc(t.name) + '</p><h1>Your classes and groups</h1><p class="lede">Assign practice to a whole class, a small group, or one student. Then see how they’re choosing and where a conversation would help.</p></section>' +
      (state.groups.length ? '<div class="kids">' + state.groups.map(function (g) {
        var k = gStats(g);
        return '<article class="kid gcard"><div class="kid-main"><p class="eyebrow">' + esc(g.kind) + '</p><h2><a href="#/teacher/g/' + g.id + '">' + esc(g.name) + '</a></h2>' +
          '<div class="stack">' + k.students.slice(0, 6).map(function (s) { return avatar(s, 'md'); }).join('') + '<span>' + plural(k.students.length, 'student') + '</span></div>' +
          '<div class="meter" role="img" aria-label="' + k.done + ' of ' + k.total + ' assigned practices done"><i style="width:' + k.pct + '%"></i></div>' +
          '<p class="kid-stats">' + (k.ids.length ? '<strong>' + k.done + '</strong> of ' + k.total + ' assigned practices done' : 'Nothing assigned yet') + '</p></div>' +
          '<div class="kid-acts"><a class="btn small primary" data-act="assign-for" href="#/teacher/g/' + g.id + '" aria-label="Assign practice to everyone in ' + esc(g.name) + '">' + ICON.plus + ' Assign practice</a>' +
            '<a class="btn small ghost" href="#/teacher/g/' + g.id + '" aria-label="Open ' + esc(g.name) + '">Open ' + ICON.arrow + '</a></div></article>';
      }).join('') + '</div>' : '<p class="empty">No classes or groups yet. Add one below to get started.</p>') +
      '<div class="pcols">' +
        '<form class="panel add" id="addGroupForm"><h2>Add a class or group</h2><p class="hint">Then add students and assign practice to all of them at once.</p>' +
          '<label class="field"><span>Name</span><input name="name" maxlength="40" required autocomplete="off" placeholder="e.g. Grade 6 · Period 2"></label>' +
          '<label class="field"><span>Type</span><select name="kind">' + kinds.map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></label>' +
          '<div class="actions"><button class="btn primary" type="submit">Add</button></div></form>' +
        '<form class="panel add" id="teacherForm"><h2>How students see you</h2><p class="hint">Practice you assign shows up for students as “From ' + esc(t.name) + '.”</p>' +
          '<label class="field"><span>Your name</span><input name="name" maxlength="30" required autocomplete="off" value="' + esc(t.name) + '"></label>' +
          '<label class="field"><span>Your role</span><select name="role">' + roles.map(function (r) { return '<option' + (r === t.role ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select></label>' +
          '<div class="actions"><button class="btn ghost" type="submit">Save</button><span id="teacherSaved" class="hint" role="status" aria-live="polite"></span></div></form>' +
      '</div>' +
    '</div>';
  }
  function insight(s, sts) {
    var doneSts = sts.filter(function (st) { return isDone(st.id, s.id); }), n = doneSts.length, retried = 0, counts = {};
    s.choices.forEach(function (c) { counts[c.id] = 0; });
    doneSts.forEach(function (st) { var t = rec(st.id, s.id).tries; if (counts[t[0].c] != null) counts[t[0].c]++; if (t.length > 1) retried++; });
    return '<article class="insight"><header>' + art(s.id, 'art-thumb') +
      '<div class="row-main">' + chip(s.topic) + '<h3>' + esc(s.title) + '</h3><p class="place">' + n + ' of ' + sts.length + ' done' + (retried ? ' · ' + retried + ' went back to try a different choice' : '') + '</p></div>' +
      '<a class="btn small ghost" href="#/preview/' + s.id + '">Preview</a></header>' +
      (n ? '<ul class="cbars">' + s.choices.map(function (c) {
        var k = counts[c.id];
        return '<li><div class="cbar-top"><span>' + esc(c.label) + '</span>' + tone(c.kind) + '</div><div class="cbar"><i class="tone-' + c.kind + '" style="width:' + (k / n * 100) + '%"></i></div><span class="cbar-n">' + plural(k, 'student') + '</span></li>';
      }).join('') + '</ul><p class="talk"><strong>Discuss as a class:</strong> ' + esc(s.talk) + '</p>' : '<p class="empty">No one has finished this one yet.</p>') +
    '</article>';
  }
  function viewTeacherGroup(gid) {
    var g = group(gid);
    if (!g) { go('#/teacher'); return null; }
    var k = gStats(g), sts = k.students;
    var others = state.students.filter(function (s) { return g.students.indexOf(s.id) < 0; });
    var roster = sts.map(function (st) {
      var d = k.ids.filter(function (id) { return isDone(st.id, id); }).length, stN = k.ids.filter(function (id) { return isStarted(st.id, id); }).length;
      return '<li class="rrow">' + avatar(st) +
        '<a class="rrow-main" href="#/teacher/s/' + st.id + '"><strong>' + esc(st.name) + '</strong><span>' + esc(st.grade) + ' · ' + lastPracticed(st.id) + '</span></a>' +
        '<span class="rrow-prog">' + (k.ids.length ? '<span class="meter"><i style="width:' + (d / k.ids.length * 100) + '%"></i></span><span>' + d + ' of ' + k.ids.length + ' assigned done' + (stN ? ' · ' + stN + ' started' : d ? '' : ' · not started') + '</span>' : '<span>' + plural(doneList(st.id).length, 'practice') + ' done</span>') + '</span>' +
        '<span class="rrow-actions"><a class="btn small ghost" href="#/teacher/s/' + st.id + '">View progress</a>' +
        '<button type="button" class="btn small quiet" data-act="roster-remove" data-g="' + g.id + '" data-sid="' + st.id + '" aria-label="Remove ' + esc(st.name) + ' from ' + esc(g.name) + '">Remove</button></span></li>';
    }).join('');
    var assign = assignList(function (s) {
      return pairBtns('gassign', ' data-g="' + g.id + '" data-id="' + s.id + '"', g.assigned.indexOf(s.id) >= 0 ? 'assigned' : g.optional.indexOf(s.id) >= 0 ? 'optional' : '');
    });
    var cls = g.kind === 'Class' ? 'class' : 'group', optIds = g.optional.filter(D.scenario);
    var arow = function (id, opt) {
      var sc = D.scenario(id), dn = 0, sn = 0;
      sts.forEach(function (st) { if (isDone(st.id, id)) dn++; else if (isStarted(st.id, id)) sn++; });
      return '<li>' + art(id, 'art-tiny') + '<span class="arow-main"><strong>' + esc(sc.title) + '</strong><span>' + esc(D.topic(sc.topic).name) + ' · <a href="#/preview/' + id + '">Preview</a></span></span>' +
        '<span class="wl-tags"><span class="status ' + (opt ? 'todo' : 'assigned') + '">' + (opt ? 'Optional for everyone' : ICON.check + ' Assigned to everyone') + '</span>' +
          (sts.length ? '<span class="tally"><b>' + dn + '</b> done · <b>' + sn + '</b> started · <b>' + (sts.length - dn - sn) + '</b> not started</span>' : '') + '</span>' +
        '<button type="button" class="btn small quiet" data-act="gremove" data-g="' + g.id + '" data-id="' + id + '"' + (opt ? ' data-opt="1"' : '') + ' aria-label="Remove ' + esc(sc.title) + ' from ' + esc(g.name) + '">Remove</button></li>';
    };
    var assignedRows = k.ids.map(function (id) { return arow(id, false); }).concat(optIds.map(function (id) { return arow(id, true); })).join('');
    return '<div class="page">' +
      '<div class="ptop">' + backBtn('#/teacher') + '</div>' +
      '<section class="profile"><div class="profile-main"><p class="eyebrow">' + esc(g.kind) + '</p><h1>' + esc(g.name) + '</h1>' +
        '<p class="profile-meta">' + plural(sts.length, 'student') + ' · ' + plural(k.ids.length, 'practice') + ' assigned to everyone' + (optIds.length ? ' · ' + optIds.length + ' optional' : '') + '</p>' +
        '<div class="profile-actions"><button type="button" class="btn primary" data-act="jump-assign">' + ICON.plus + ' Assign practice to everyone</button></div></div>' +
        '<div class="stack big">' + sts.slice(0, 7).map(function (s) { return avatar(s, 'lg'); }).join('') + '</div></section>' +
      '<section class="stats three">' +
        '<div class="stat lead"><strong>' + k.done + '<small>/' + k.total + '</small></strong><span>Assigned practices completed</span><span class="donut" style="--p:' + k.pct + '" aria-hidden="true"></span></div>' +
        '<div class="stat"><strong>' + k.ids.length + '</strong><span>Scenarios assigned to this ' + cls + '</span></div>' +
        '<div class="stat"><strong>' + k.notStarted + '</strong><span>' + (k.notStarted === 1 ? 'Student hasn’t' : 'Students haven’t') + ' started the assigned practice</span></div>' +
      '</section>' +
      '<section class="panel"><div class="block-head"><h2>Assigned to this ' + cls + '</h2><p>' + (assignedRows ? 'Every student in ' + esc(g.name) + ' has these. Each row shows how far the ' + cls + ' has got.' : 'Nothing is assigned to this ' + cls + ' yet.') + '</p></div>' +
        (assignedRows ? '<ul class="waitlist">' + assignedRows + '</ul>' : '<p class="empty">Use “Assign practice to everyone” to pick the first scenario.</p>') + '</section>' +
      fold('assign', 'Assign practice to everyone', '<strong>Assign</strong> puts a practice in “Up next” for each student in ' + esc(g.name) + '. <strong>Optional</strong> makes it available without requiring it. Tap again to remove.', assign, !assignedRows) +
      '<section class="panel"><div class="block-head"><h2>Students</h2><p>Open a student to see their own profile, choices, and reflections.</p></div>' +
        (sts.length ? '<ul class="roster">' + roster + '</ul>' : '<p class="empty">No students yet. Add one below.</p>') +
        '<form class="roster-add" id="rosterForm" data-g="' + g.id + '"><h3>Add a student</h3><div class="add-row">' +
          '<label class="field"><span>Existing profile</span><select name="existing"><option value="">Choose a student…</option>' + others.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + ' · ' + esc(s.grade) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field"><span>Or a new student’s name</span><input name="name" maxlength="40" autocomplete="off" placeholder="e.g. Sam Rivera"></label>' +
          '<button class="btn primary" type="submit">Add student</button></div></form></section>' +
      '<section class="panel"><div class="block-head"><h2>How the ' + cls + ' is choosing</h2><p>' + (k.ids.length ? 'Bars count each student’s <em>first</em> pick. Open a student to see who chose what.' : 'Assign a scenario and results will show up here.') + '</p></div>' +
        (k.ids.length ? '<div class="insights">' + k.ids.map(function (id) { return insight(D.scenario(id), sts); }).join('') + '</div>' : '<p class="empty">Nothing is assigned to this ' + cls + ' yet.</p>') + '</section>' +
      '<p class="page-end"><button type="button" class="linklike danger" data-act="gdelete" data-g="' + g.id + '">Delete ' + esc(g.name) + '</button></p>' +
    '</div>';
  }
  function viewTeacherStudent(sid) {
    var st = student(sid), mine = state.groups.filter(function (g) { return g.students.indexOf(sid) >= 0; });
    if (!st || !mine.length) { go('#/teacher'); return null; }
    var m = lastPage.match(/^#\/teacher\/g\/(\w+)/), from = (m && mine.filter(function (g) { return g.id === m[1]; })[0]) || mine[0];
    return studentReport(st, {
      role: 'teacher',
      top: backBtn('#/teacher/g/' + from.id) +
        '<span class="row-tags">' + mine.map(function (g) { return '<span class="status assigned">' + esc(g.name) + '</span>'; }).join('') + '</span>'
    });
  }

  /* ───────── events ───────── */
  function keepPlace(el, selector) {
    var before = el.getBoundingClientRect().top;
    folds.assign = true;
    render(true);
    var again = document.querySelector(selector);
    if (again) { window.scrollBy(0, again.getBoundingClientRect().top - before); again.focus({ preventScroll: true }); }
  }
  /* assign a scenario to a whole class or group, make it optional, or take it away again */
  function groupToggle(g, scid, opt) {
    var list = opt ? g.optional : g.assigned, other = opt ? g.assigned : g.optional, at = list.indexOf(scid);
    g.students.forEach(function (x) { dropGroupAssign(x, g.id, scid); });
    if (other.indexOf(scid) >= 0) other.splice(other.indexOf(scid), 1);
    if (at >= 0) list.splice(at, 1);
    else { list.push(scid); g.students.forEach(function (x) { addAssign(state, x, scid, 'teacher', g.id, opt); }); }
    save();
  }
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d && d.hasAttribute && d.hasAttribute('data-fold')) folds[d.getAttribute('data-fold')] = d.open;
  }, true);
  function choiceLines(s) { return s.choices.map(function (c, i) { return 'Choice ' + 'ABC'[i] + '. ' + c.label + '.'; }); }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act'), s, st, c, K;
    switch (act) {
      case 'back':
        if (trail.length > 1) { e.preventDefault(); history.back(); }
        break;
      case 'speak':
        s = play && D.scenario(play.id);
        if (!s) return;
        var key = el.getAttribute('data-speak');
        c = play.sel && choiceOf(s, play.sel); K = c && D.kind[c.kind];
        if (key === 'scenario') Voice.toggle(key, (s.note ? [s.note] : []).concat([s.title + '.', s.text]));
        else if (key === 'choices') Voice.toggle(key, [s.ask].concat(choiceLines(s)));
        else if (!c) return;
        else if (key === 'outcome') Voice.toggle(key, ['You chose: ' + c.label + '.', K.heading, c.impact]);
        else if (key === 'reflect') Voice.toggle(key, [K.nextLabel + '.', c.next, reflectQ(c), play.mode === 'practice' ? 'Write at least ten words.' : '']);
        else if (key === 'complete') {
          var w = wrapUp(s);
          Voice.toggle(key, ['Scenario complete.', w.title.join(' '), 'You chose: ' + c.label + '.', w.sum, c.close, w.amount + '. ' + w.why]
            .concat(w.total != null ? ['Your total: ' + w.total + '.'] : []).concat(w.note ? ['Your reflection.', w.note] : [])
            .concat(w.value ? ['What mattered most to you: ' + w.value + '.'] : []).concat([w.foot]));
        }
        break;
      case 'step':
        /* forward only when the current step is complete; going back is always allowed */
        if (!play) return;
        var to = Number(el.getAttribute('data-to')), ta = document.getElementById('reflectText');
        if (ta) play.note = ta.value;
        if (to < play.step || (to === 2 && play.step === 1) || (to === 4 && play.step === 3 && play.sel)) { play.step = to; render(); focusTitle(); }
        break;
      case 'retry':
        if (!play) return;
        play.step = 2; play.sel = null; render(); focusTitle();
        break;
      case 'value':
        st = activeStudent(); s = play && D.scenario(play.id);
        if (!st || !s) return;
        var r = rec(st.id, s.id); if (!r) return;
        var v = el.getAttribute('data-value');
        r.value = r.value === v ? null : v; save();
        Array.prototype.forEach.call(document.querySelectorAll('.pill'), function (p) {
          var on = p.getAttribute('data-value') === r.value;
          p.classList.toggle('is-on', on); p.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        break;
      case 'pick-student':
        state.active = el.getAttribute('data-id'); save(); sessionDone = []; render();
        break;
      case 'assign-for':
        e.preventDefault();
        pendingAssign = true;
        go(el.getAttribute('href'));
        break;
      case 'pin-show':
        showPin = showPin === el.getAttribute('data-sid') ? null : el.getAttribute('data-sid');
        folds.access = true; render(true);
        break;
      case 'pin-reset':
        var ps = student(el.getAttribute('data-sid'));
        if (!ps) return;
        ask({
          title: 'Reset the PIN for ' + ps.name + '?',
          body: 'The old PIN stops working straight away. ' + first(ps.name) + ' will need the new one to open their practice.',
          ok: 'Reset PIN',
          then: function () { ps.pin = newPin(); showPin = ps.id; save(); folds.access = true; render(true); }
        });
        break;
      case 'switch-student':
        state.active = null; save(); sessionDone = []; render();
        break;
      case 'preset':
        var pf = document.getElementById('profileForm'); if (!pf || !draft) return;
        readMaker(pf);
        var pl = A.preset(Number(el.getAttribute('data-i')));
        draft.look = { skin: pl.skin, hair: pl.hair, hc: pl.hc, top: pl.top, tc: pl.tc, bg: pl.bg, glasses: pl.glasses ? 1 : 0 };
        render(true);
        break;
      case 'voice-test':
        var vp = document.getElementById('voicePick');
        if (vp && vp.value) { state.voice = vp.value; save(); }
        Voice.key = null;
        Voice.toggle('test', ['Hi! This is the voice that will read your scenarios aloud.', 'You can pick a different one any time.']);
        break;
      case 'lib-group': libGroup = el.getAttribute('data-group'); render(true); break;
      case 'assign-group':
        assignGroup = el.getAttribute('data-group');
        keepPlace(el, '[data-act="assign-group"][data-group="' + assignGroup + '"]');
        break;
      case 'assign':
        var sid = el.getAttribute('data-sid'), id = el.getAttribute('data-id'), by = el.getAttribute('data-by') || 'parent', opt = el.hasAttribute('data-opt'), mine = assignEntry(sid, id);
        if (mine && mine.by !== by) return;
        if (mine && !!mine.opt === opt) state.assigned[sid] = assignedTo(sid).filter(function (a) { return a !== mine; });
        else if (mine) { if (opt) mine.opt = true; else delete mine.opt; }
        else addAssign(state, sid, id, by, null, opt);
        save();
        keepPlace(el, '[data-act="assign"][data-id="' + id + '"]' + (opt ? '[data-opt]' : ':not([data-opt])'));
        break;
      case 'gassign':
        var g = group(el.getAttribute('data-g')), scid = el.getAttribute('data-id'), gopt = el.hasAttribute('data-opt');
        if (!g) return;
        groupToggle(g, scid, gopt);
        keepPlace(el, '.fold [data-act="gassign"][data-id="' + scid + '"]' + (gopt ? '[data-opt]' : ':not([data-opt])'));
        break;
      case 'gremove':
        var xg = group(el.getAttribute('data-g')), xid = el.getAttribute('data-id'), xopt = el.hasAttribute('data-opt');
        if (!xg || (xopt ? xg.optional : xg.assigned).indexOf(xid) < 0) return;
        groupToggle(xg, xid, xopt);
        render(true);
        break;
      case 'jump-assign':
        folds.assign = true;
        render(true);
        var fa = document.getElementById('fold-assign');
        if (fa) {
          fa.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
          var fs = fa.querySelector('summary'); if (fs) fs.focus({ preventScroll: true });
        }
        break;
      case 'roster-remove':
        var rg = group(el.getAttribute('data-g')), rs = el.getAttribute('data-sid'), rst = student(rs);
        if (!rg || !rst) return;
        ask({
          title: 'Remove ' + rst.name + ' from ' + rg.name + '?',
          body: first(rst.name) + ' keeps their profile and everything they have completed. Practice assigned through ' + rg.name + ' that isn’t finished comes off their list.',
          ok: 'Remove student',
          then: function () {
            rg.students = rg.students.filter(function (x) { return x !== rs; });
            dropGroupAssign(rs, rg.id);
            save(); render(true);
          }
        });
        break;
      case 'gdelete':
        var dg = group(el.getAttribute('data-g'));
        if (!dg) return;
        ask({
          title: 'Delete ' + dg.name + '?',
          body: 'Students keep their profiles and completed practices. Practice assigned through ' + dg.name + ' that isn’t finished comes off their lists. This can’t be undone.',
          ok: 'Delete ' + (dg.kind === 'Class' ? 'class' : 'group'),
          then: function () {
            dg.students.forEach(function (x) { dropGroupAssign(x, dg.id); });
            state.groups = state.groups.filter(function (x) { return x !== dg; });
            save(); go('#/teacher');
          }
        });
        break;
      case 'reset':
        ask({
          title: 'Reset ChoiceLab to the sample data?',
          body: 'This clears every profile, class and all progress saved in this browser.',
          ok: 'Reset',
          then: function () { state = migrate(seed()); save(); play = null; sessionDone = []; go('#/'); }
        });
        break;
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'choice' && play) {
      play.sel = t.value;
      var s = D.scenario(play.id);
      Array.prototype.forEach.call(document.querySelectorAll('.choice'), function (l) { l.classList.toggle('is-selected', l.querySelector('input').checked); });
      var b = document.getElementById('continueBtn'); if (b) b.disabled = false;
      var p = document.getElementById('pickStatus'); if (p) p.innerHTML = pickText(s);
      return;
    }
    var f = t.form;
    if (f && f.id === 'profileForm' && draft) {
      if (t.name === 'voice') { state.voice = t.value; save(); var vt = document.getElementById('voiceTip'); if (vt) vt.textContent = Voice.tip(); return; }
      readMaker(f);
      if (t.name !== 'name' && t.name !== 'grade') paintMaker();
    }
  });
  /* the reflection: count words as the student types, and unlock Finish at ten */
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'reflectText' || !play) return;
    play.note = e.target.value;
    var n = words(play.note), wc = document.getElementById('wordCount'), b = document.getElementById('finishBtn');
    if (wc) { wc.innerHTML = countText(n); wc.classList.toggle('is-ready', n >= MIN_WORDS); }
    if (b && play.mode === 'practice') b.disabled = n < MIN_WORDS;
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    e.preventDefault();
    if (f.id === 'signInForm') {
      var code = f.elements.code.value.toUpperCase().replace(/[^A-Z0-9]/g, ''), pin = f.elements.pin.value.trim();
      var hit = state.students.filter(function (x) { return x.code === code && x.pin === pin; })[0];
      if (!hit) {
        /* one message for a wrong code or a wrong PIN, so it never confirms that a code exists */
        document.getElementById('signInMsg').textContent = 'That code and PIN don’t match. Check them and try again, or ask your parent or teacher.';
        f.elements.pin.value = ''; f.elements.pin.focus();
        return;
      }
      state.active = hit.id; joinCode = ''; sessionDone = []; save(); render();
      return;
    }
    if (f.id === 'choiceForm') { if (play && play.sel) commitChoice(); return; }
    if (f.id === 'reflectForm') { if (play && play.sel) finishReflect(f); return; }
    if (f.id === 'profileForm') {
      var st = activeStudent(); if (!st || !draft) return;
      readMaker(f);
      var name = draft.name.trim(); if (!name) { f.elements.name.focus(); return; }
      st.name = name; st.grade = draft.grade; st.look = draft.look;
      if (f.elements.voice && f.elements.voice.value) state.voice = f.elements.voice.value;
      draft = null;
      save(); go('#/student'); return;
    }
    if (f.id === 'addStudentForm') {
      var nm = f.elements.name.value.trim(); if (!nm) { f.elements.name.focus(); return; }
      var id = newStudent(nm, f.elements.grade.value);
      state.family.push(id);
      save(); go('#/parent/' + id); return;
    }
    if (f.id === 'teacherForm') {
      var tn = f.elements.name.value.trim(); if (!tn) { f.elements.name.focus(); return; }
      state.teacher = { name: tn, role: f.elements.role.value };
      save(); render(true);
      var ok = document.getElementById('teacherSaved'); if (ok) ok.textContent = 'Saved.';
      return;
    }
    if (f.id === 'addGroupForm') {
      var gn = f.elements.name.value.trim(); if (!gn) { f.elements.name.focus(); return; }
      var gid = 'g' + (state.nextGroup++);
      state.groups.push({ id: gid, name: gn, kind: f.elements.kind.value, students: [], assigned: [], optional: [] });
      save(); go('#/teacher/g/' + gid); return;
    }
    if (f.id === 'rosterForm') {
      var rg = group(f.getAttribute('data-g')); if (!rg) return;
      var pick = f.elements.existing.value, typed = f.elements.name.value.trim(), add = pick;
      if (!add && typed) { var mates = groupStudents(rg); add = newStudent(typed, mates.length ? mates[0].grade : 'Grade 6'); }
      if (!add) { f.elements.name.focus(); return; }
      if (rg.students.indexOf(add) < 0) {
        rg.students.push(add);
        rg.assigned.forEach(function (x) { addAssign(state, add, x, 'teacher', rg.id); });
        rg.optional.forEach(function (x) { addAssign(state, add, x, 'teacher', rg.id, true); });
      }
      save(); render(true);
    }
  });
  window.addEventListener('hashchange', function () { render(); });
  window.addEventListener('beforeunload', function () { if (Voice.ok) window.speechSynthesis.cancel(); });

  render();
})();
