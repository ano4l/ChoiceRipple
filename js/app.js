/* Choice Ripple — app logic: profiles, student practice flow, parent and teacher progress. */
(function () {
  'use strict';
  var D = window.CRData, A = window.CRArt;
  var app = document.getElementById('app');
  var KEY = 'choiceRipple.v1';
  var DAY = 86400000;

  /* ───────── state ───────── */
  function daysAgo(n, h) { var d = new Date(Date.now() - n * DAY); d.setHours(h || 16, 12, 0, 0); return d.toISOString(); }
  function addAssign(s, sid, id, by, g) {
    var list = s.assigned[sid] || (s.assigned[sid] = []);
    if (!list.some(function (a) { return a.id === id; })) list.push(g ? { id: id, by: by, g: g } : { id: id, by: by });
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
      c2: { joke: { tries: [{ c: 'speak', at: daysAgo(4) }], value: 'Courage' }, wronganswer: { tries: [{ c: 'support', at: daysAgo(3) }], value: 'Kindness' }, picture: { tries: [{ c: 'support', at: daysAgo(1) }], value: 'Being fair' } },
      c3: { joke: { tries: [{ c: 'join', at: daysAgo(3) }], value: 'Fitting in' }, heated: { tries: [{ c: 'snap', at: daysAgo(1) }, { c: 'walk', at: daysAgo(1) }], value: 'Staying calm' } },
      c4: { joke: { tries: [{ c: 'silent', at: daysAgo(2) }], value: 'Staying safe' }, picture: { tries: [{ c: 'emoji', at: daysAgo(1) }, { c: 'support', at: daysAgo(1) }], value: 'Kindness' } },
      c5: {}
    };
    s.teacher = { name: 'Ms. Rivera', role: 'Teacher' };
    s.nextGroup = 3;
    s.groups = [
      { id: 'g1', name: 'Grade 7 · Period 3', kind: 'Class', students: ['s1', 'c1', 'c2', 'c3', 'c4', 'c5'], assigned: ['joke', 'wronganswer', 'picture'] },
      { id: 'g2', name: 'Reflection room', kind: 'ISS / detention group', students: ['c3', 'c5'], assigned: ['heated', 'blamed'] }
    ];
    mates.forEach(function (m) {
      if (!s.students.some(function (x) { return x.id === m.id; })) { s.students.push(m); s.progress[m.id] = theirs[m.id]; }
    });
    s.groups.forEach(function (g) {
      g.students = g.students.filter(function (id) { return s.students.some(function (x) { return x.id === id; }); });
      g.students.forEach(function (sid) { g.assigned.forEach(function (id) { addAssign(s, sid, id, 'teacher', g.id); }); });
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
          heated: { tries: [{ c: 'snap', at: daysAgo(12) }, { c: 'walk', at: daysAgo(12) }], value: 'Staying calm' },
          picture: { tries: [{ c: 'support', at: daysAgo(8) }], value: 'Kindness' },
          badgrade: { tries: [{ c: 'dismiss', at: daysAgo(5) }, { c: 'offer', at: daysAgo(5) }], value: 'Kindness' },
          joke: { tries: [{ c: 'silent', at: daysAgo(2) }], value: 'Fitting in' }
        },
        s2: { directions: { tries: [{ c: 'raise', at: daysAgo(3) }], value: 'Courage' } }
      },
      assigned: {
        s1: [{ id: 'talkedover', by: 'parent' }, { id: 'phonegrab', by: 'parent' }, { id: 'apology', by: 'parent' }],
        s2: [{ id: 'dare', by: 'parent' }, { id: 'nickname', by: 'parent' }]
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
    return s;
  }
  var state;
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.v === 1 && s.students) return migrate(s); } } catch (e) { /* storage unavailable */ }
    return seed();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* keep running in memory */ } }
  state = load();

  /* ───────── helpers ───────── */
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function student(id) { return state.students.filter(function (s) { return s.id === id; })[0]; }
  function activeStudent() { return state.active ? student(state.active) : null; }
  function first(name) { return String(name || '').trim().split(/\s+/)[0] || 'Student'; }
  function prog(sid) { return state.progress[sid] || (state.progress[sid] = {}); }
  function assignedTo(sid) { return state.assigned[sid] || (state.assigned[sid] = []); }
  function rec(sid, scid) { return prog(sid)[scid]; }
  function isDone(sid, scid) { var r = rec(sid, scid); return !!(r && r.tries && r.tries.length); }
  function choiceOf(s, cid) { return s.choices.filter(function (c) { return c.id === cid; })[0]; }
  function waiting(sid) { return assignedTo(sid).filter(function (a) { return !isDone(sid, a.id) && D.scenario(a.id); }).map(function (a) { return a.id; }); }
  function assignEntry(sid, id) { return assignedTo(sid).filter(function (a) { return a.id === id; })[0]; }
  function fromLabel(sid, id) { var a = assignEntry(sid, id); return a && a.by === 'teacher' ? 'From ' + state.teacher.name : 'From your parent'; }
  function family() { return state.family.map(student).filter(Boolean); }
  function group(id) { return state.groups.filter(function (g) { return g.id === id; })[0]; }
  function groupStudents(g) { return g.students.map(student).filter(Boolean); }
  function newStudent(name, grade) {
    var id = 's' + (state.nextId++);
    state.students.push({ id: id, name: name, grade: grade, avatar: (state.students.length + 1) % A.avatarCount, joined: new Date().toISOString() });
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
  function queue(sid) {
    var w = waiting(sid);
    var rest = D.scenarios.filter(function (s) { return !isDone(sid, s.id) && w.indexOf(s.id) < 0; }).map(function (s) { return s.id; });
    return w.concat(rest);
  }
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
  function art(id, cls) { var s = D.scenario(id); return '<span class="art ' + (cls || '') + '">' + A.scene(id, s && s.alt) + '</span>'; }
  function chip(topicId) { var t = D.topic(topicId); return '<span class="chip" style="--chip-bg:' + t.bg + ';--chip-ink:' + t.ink + '">' + esc(t.name) + '</span>'; }
  function avatar(st, cls) { return '<span class="avatar ' + (cls || '') + '">' + A.avatar(st.avatar, '') + '</span>'; }
  function tone(kind) { return '<span class="tone tone-' + kind + '">' + D.kind[kind].tag + '</span>'; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  /* decorative concentric rings: the ripple motif */
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
    pin: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.2" fill="currentColor"/></svg>',
    ripple: '<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="16" cy="16" r="3" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="8" opacity=".7"/><circle cx="16" cy="16" r="13" opacity=".35"/></g></svg>'
  };

  /* ───────── read-aloud ───────── */
  var Voice = {
    key: null,
    ok: 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    stop: function () { if (this.ok) window.speechSynthesis.cancel(); this.key = null; this.paint(); },
    toggle: function (key, parts) {
      if (!this.ok) { this.paint('Read-aloud isn’t available in this browser.'); return; }
      if (this.key === key) { this.stop(); return; }
      window.speechSynthesis.cancel();
      this.key = key;
      var self = this, list = parts.filter(Boolean);
      list.forEach(function (text, i) {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.92;
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
    }
  };
  function speakBtn(key, label, cls) {
    return '<button type="button" class="speak ' + (cls || '') + '" data-act="speak" data-speak="' + key + '" data-label="' + esc(label) + '" aria-pressed="false">' + ICON.sound + '<span>' + esc(label) + '</span></button>';
  }

  /* ───────── routing ───────── */
  var play = null;           // { id, mode, sel, phase }
  var sessionDone = [];      // scenario ids finished since the app opened
  var homeTopic = 'all', studentTopic = 'all';
  var lastPage = '#/';       // last non-practice page, so a preview can return to it
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var p = h.split('/').filter(Boolean);
    return { name: p[0] || 'home', a: p[1], b: p[2] };
  }
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  function render(keepScroll) {
    Voice.stop();
    var r = route(), html, nav = 'home';
    if (r.name === 'student') { nav = 'student'; html = r.a === 'profile' ? viewProfileEdit() : viewStudent(); }
    else if (r.name === 'practice') { nav = 'student'; html = viewPlay(r.a, 'practice'); }
    else if (r.name === 'preview') { nav = lastPage.indexOf('#/teacher') === 0 ? 'teacher' : lastPage.indexOf('#/parent') === 0 ? 'parent' : 'home'; html = viewPlay(r.a, 'preview'); }
    else if (r.name === 'done') { nav = 'student'; html = viewDone(); }
    else if (r.name === 'parent') { nav = 'parent'; html = r.a ? viewParentStudent(r.a) : viewParent(); }
    else if (r.name === 'teacher') { nav = 'teacher'; html = r.a === 'g' ? viewTeacherGroup(r.b) : r.a === 's' ? viewTeacherStudent(r.b) : viewTeacher(); }
    else html = viewHome();
    if (html == null) return; // a view redirected
    if (r.name !== 'practice' && r.name !== 'preview') { play = null; if (r.name !== 'done') lastPage = location.hash || '#/'; }
    app.classList.toggle('no-anim', !!keepScroll);
    app.innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
      var on = a.getAttribute('data-nav') === nav;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.body.setAttribute('data-view', r.name);
    if (!keepScroll) window.scrollTo(0, 0);
  }

  /* ───────── HOME ───────── */
  function previewCard(id) {
    var s = D.scenario(id);
    return '<article class="pcard"' + topicVars(s.topic) + '><div class="pcard-top">' + art(id, 'art-card') + chip(s.topic) + '</div>' +
      '<div class="pcard-body"><h3>' + esc(s.title) + '</h3><p>' + esc(s.ask) + '</p>' +
      '<a class="btn small ghost" href="#/preview/' + id + '">See how it works</a></div></article>';
  }
  function topicFilter(current, act) {
    var b = '<div class="filter" role="group" aria-label="Filter by topic"><button type="button" class="fchip' + (current === 'all' ? ' is-on' : '') + '" data-act="' + act + '" data-topic="all" aria-pressed="' + (current === 'all') + '">All topics</button>';
    D.topics.forEach(function (t) {
      b += '<button type="button" class="fchip' + (current === t.id ? ' is-on' : '') + '" data-act="' + act + '" data-topic="' + t.id + '" aria-pressed="' + (current === t.id) + '" style="--chip-bg:' + t.bg + ';--chip-ink:' + t.ink + '">' + esc(t.name) + '</button>';
    });
    return b + '</div>';
  }
  function viewHome() {
    var f = D.scenario(D.featured[0]);
    var list = D.scenarios.filter(function (s) { return homeTopic === 'all' || s.topic === homeTopic; });
    return '<div class="page">' +
      '<section class="hero">' +
        '<div class="hero-copy"><p class="eyebrow">' + ICON.ripple + ' For students and the adults who support them</p>' +
          '<h1>' + lets('Let’s practice the hard moments <span class="accent">before they happen.</span>') + '</h1>' +
          '<p class="lede">Choice Ripple lets students rehearse real social situations, choose what they’d do, and see how that choice ripples out. Parents and teachers can follow along.</p>' +
          '<div class="actions"><a class="btn primary" href="#/student">I’m a student</a><a class="btn ghost" href="#/parent">I’m a parent</a><a class="btn ghost" href="#/teacher">I’m a teacher</a></div></div>' +
        '<div class="hero-stage"><div class="stage-bg">' + rings('live', 9) + '</div><aside class="hero-demo" aria-label="Sample practice">' +
          '<div class="demo-head">' + art(f.id, 'art-card') + '<div>' + chip(f.topic) + '<h2>' + esc(f.title) + '</h2><p class="place">' + ICON.pin + esc(f.place) + '</p></div></div>' +
          '<p class="demo-ask">' + esc(f.ask) + '</p>' +
          '<ul class="demo-choices">' + f.choices.map(function (c, i) { return '<li><span class="key">' + 'ABC'[i] + '</span>' + esc(c.label) + '</li>'; }).join('') + '</ul>' +
          '<a class="btn primary block" href="#/preview/' + f.id + '">See how it works ' + ICON.arrow + '</a>' +
        '</aside></div>' +
      '</section>' +

      '<section class="steps3" aria-label="How Choice Ripple works">' +
        '<div class="step3"><span class="num">1</span><div><h3>Read a real moment</h3><p>Short situations from hallways, group chats, and lunch tables. Read-aloud is always there.</p></div></div>' +
        '<div class="step3"><span class="num">2</span><div><h3>Choose what you’d do</h3><p>Three honest options. Pick the one closest to what you’d really do.</p></div></div>' +
        '<div class="step3"><span class="num">3</span><div><h3>See the ripple</h3><p>A reflection written for that exact choice, with a next step to try.</p></div></div>' +
      '</section>' +

      '<section class="block"><div class="block-head"><h2>Try a scenario</h2><p>No sign-in needed. Nothing is saved while you preview.</p></div>' +
        '<div class="pgrid">' + D.featured.map(previewCard).join('') + '</div></section>' +

      '<section class="block"><div class="block-head"><h2>Explore by topic</h2><p>' + D.scenarios.length + ' practice scenarios across ' + D.topics.length + ' topics.</p></div>' +
        topicFilter(homeTopic, 'home-topic') +
        '<div class="rows">' + list.map(function (s) {
          return '<article class="row">' + art(s.id, 'art-thumb') + '<div class="row-main">' + chip(s.topic) + '<h3>' + esc(s.title) + '</h3><p class="place">' + ICON.pin + esc(s.place) + '</p></div>' +
            '<a class="btn small ghost" href="#/preview/' + s.id + '">See how it works</a></article>';
        }).join('') + '</div></section>' +
    '</div>';
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
  function scenarioRow(st, s) {
    var done = isDone(st.id, s.id), wait = waiting(st.id).indexOf(s.id) >= 0;
    var status = done ? '<span class="status done">' + ICON.check + ' Done</span>' : wait ? '<span class="status assigned">' + esc(fromLabel(st.id, s.id)) + '</span>' : '';
    return '<article class="row' + (done ? ' is-done' : '') + '">' + art(s.id, 'art-thumb') +
      '<div class="row-main"><div class="row-tags">' + chip(s.topic) + status + '</div><h3>' + esc(s.title) + '</h3><p class="place">' + ICON.pin + esc(s.place) + '</p></div>' +
      '<a class="btn small ' + (done ? 'ghost' : 'primary') + '" href="#/practice/' + s.id + '">' + (done ? 'Practice again' : 'Start') + '</a></article>';
  }
  function viewStudent() {
    var st = activeStudent();
    if (!st) return viewStudentPicker();
    var done = doneList(st.id).length, total = D.scenarios.length, w = waiting(st.id), q = queue(st.id), nextId = q[0];
    var pct = Math.round(done / total * 100);
    var nx = nextId && D.scenario(nextId);
    var list = D.scenarios.filter(function (s) { return studentTopic === 'all' || s.topic === studentTopic; });
    var up = nx
      ? '<section class="upnext">' + rings('', 8) + '<div class="upnext-main">' + art(nx.id, 'art-card') + '<div><p class="eyebrow">' + (w.indexOf(nx.id) >= 0 ? 'Up next · ' + esc(fromLabel(st.id, nx.id)) : 'Up next') + '</p><h2>' + esc(nx.title) + '</h2><div class="row-tags">' + chip(nx.topic) + '<span class="place">' + ICON.pin + esc(nx.place) + '</span></div></div></div>' +
        '<a class="btn sun big" href="#/practice/' + nx.id + '">Start practice ' + ICON.arrow + '</a></section>'
      : '<section class="upnext all-done">' + rings('', 8) + '<div><p class="eyebrow">All caught up</p><h2>You’ve practiced every scenario.</h2><p>Pick any one below to try a different choice.</p></div></section>';
    return '<div class="page">' +
      '<section class="me">' + ringAvatar(st, 'xl', pct, done + ' of ' + total + ' practices done') +
        '<div class="me-main"><p class="eyebrow">' + esc(st.grade) + '</p><h1>' + lets('Let’s practice, ' + esc(first(st.name)) + '.') + '</h1>' +
          '<p class="me-stats"><strong>' + done + '</strong> of ' + total + ' practices done' + (w.length ? ' · <strong>' + w.length + '</strong> assigned and waiting' : '') + '</p></div>' +
        '<div class="me-actions"><a class="btn small ghost" href="#/student/profile">Edit my profile</a><button type="button" class="btn small quiet" data-act="switch-student">Switch student</button></div>' +
      '</section>' + up +
      (w.length > 1 ? '<section class="block"><div class="block-head"><h2>Assigned to you</h2><p>' + plural(w.length, 'practice') + ' picked for you.</p></div><div class="rows">' + w.map(function (id) { return scenarioRow(st, D.scenario(id)); }).join('') + '</div></section>' : '') +
      '<section class="block"><div class="block-head"><h2>All practices</h2><p>Go in any order. You can redo one to try a different choice.</p></div>' +
        topicFilter(studentTopic, 'student-topic') +
        '<div class="rows">' + list.map(function (s) { return scenarioRow(st, s); }).join('') + '</div></section>' +
    '</div>';
  }
  function viewProfileEdit() {
    var st = activeStudent();
    if (!st) { go('#/student'); return null; }
    var grades = ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    var av = '';
    for (var i = 0; i < A.avatarCount; i++) av += '<label class="av-pick"><input type="radio" name="avatar" value="' + i + '"' + (st.avatar === i ? ' checked' : '') + '><span class="avatar lg">' + A.avatar(i, 'Avatar ' + (i + 1)) + '</span></label>';
    return '<div class="page narrow"><a class="back" href="#/student">' + ICON.back + ' Back to my practice</a>' +
      '<form class="panel" id="profileForm"><p class="eyebrow">My profile</p><h1>This is you.</h1><p class="lede">Your parent sees this same name and picture on your progress page.</p>' +
        '<label class="field"><span>Name</span><input name="name" maxlength="40" required value="' + esc(st.name) + '" autocomplete="off"></label>' +
        '<label class="field"><span>Grade</span><select name="grade">' + grades.map(function (g) { return '<option' + (g === st.grade ? ' selected' : '') + '>' + g + '</option>'; }).join('') + '</select></label>' +
        '<fieldset class="field"><legend>Picture</legend><div class="av-grid">' + av + '</div></fieldset>' +
        '<div class="actions"><button class="btn primary" type="submit">Save profile</button><a class="btn ghost" href="#/student">Cancel</a></div>' +
      '</form></div>';
  }

  /* ───────── PLAY: scenario → choice → reflection → next ───────── */
  function stepper(n) {
    var labels = ['Read & choose', 'Reflect', 'Keep going'];
    return '<ol class="stepper" aria-label="Progress">' + labels.map(function (l, i) {
      return '<li class="' + (i + 1 < n ? 'was' : i + 1 === n ? 'now' : '') + '"' + (i + 1 === n ? ' aria-current="step"' : '') + '><span>' + (i + 1 < n ? ICON.check : i + 1) + '</span>' + l + '</li>';
    }).join('') + '</ol>';
  }
  function viewPlay(id, mode) {
    var s = D.scenario(id);
    if (!s) { go(mode === 'practice' ? '#/student' : '#/'); return null; }
    if (mode === 'practice' && !activeStudent()) { go('#/student'); return null; }
    if (!play || play.id !== id || play.mode !== mode) play = { id: id, mode: mode, sel: null, phase: 'choose' };
    return play.phase === 'reflect' && play.sel ? playReflect(s) : playChoose(s);
  }
  function backLink(mode) {
    if (mode === 'practice') return '<a class="back" href="#/student">' + ICON.back + ' My practice</a>';
    var adult = lastPage.indexOf('#/teacher') === 0 || lastPage.indexOf('#/parent') === 0;
    return '<a class="back" href="' + (adult ? esc(lastPage) : '#/') + '">' + ICON.back + (adult ? ' Back' : ' Home') + '</a>';
  }
  function playChoose(s) {
    var mode = play.mode;
    return '<div class="page play">' +
      '<div class="play-top">' + backLink(mode) + stepper(1) + '</div>' +
      (mode === 'preview' ? '<p class="banner">You’re previewing. Nothing is saved. <a href="#/student">Start practicing as a student</a></p>' : '') +
      (s.note ? '<p class="banner note"><strong>Heads up:</strong> ' + esc(s.note) + ' <a href="' + (mode === 'practice' ? '#/student' : '#/') + '">Skip this one</a></p>' : '') +
      '<header class="scn-head">' + art(s.id, 'art-play') +
        '<div class="scn-meta">' + chip(s.topic) + '<h1 class="scn-title">' + esc(s.title) + '</h1><p class="place">' + ICON.pin + esc(s.place) + '</p></div></header>' +
      '<section class="scn-card" aria-label="The situation"><div class="scn-card-top"><h2>The situation</h2>' + speakBtn('scenario', 'Listen') + '</div>' +
        '<p class="scn-text">' + said(s.text) + '</p></section>' +
      '<form id="choiceForm" class="choose" novalidate>' +
        '<div class="ask-row"><h2 class="scn-ask" id="askTitle">' + esc(s.ask) + '</h2>' + speakBtn('choices', 'Hear the choices') + '</div>' +
        '<div class="choices" role="radiogroup" aria-labelledby="askTitle">' + s.choices.map(function (c, i) {
          var on = play.sel === c.id;
          return '<label class="choice' + (on ? ' is-selected' : '') + '"><input type="radio" name="choice" value="' + c.id + '"' + (on ? ' checked' : '') + '>' +
            '<span class="key" aria-hidden="true">' + 'ABC'[i] + '</span><span class="choice-text">' + esc(c.label) + '</span><span class="tick" aria-hidden="true">' + ICON.check + '</span></label>';
        }).join('') + '</div>' +
        '<p id="voiceStatus" class="voice-status" role="status" aria-live="polite"></p>' +
        '<p id="pickStatus" class="pick-status" role="status" aria-live="polite">' + pickText(s) + '</p>' +
        '<div class="action-bar"><button type="submit" class="btn primary big" id="continueBtn"' + (play.sel ? '' : ' disabled') + '>Continue ' + ICON.arrow + '</button></div>' +
      '</form></div>';
  }
  function pickText(s) {
    if (!play.sel) return 'Pick the choice closest to what you’d really do.';
    var i = s.choices.map(function (c) { return c.id; }).indexOf(play.sel);
    return '<strong>Choice ' + 'ABC'[i] + ' selected.</strong> Tap Continue to see what happens.';
  }
  function nextTarget(s) {
    if (play.mode === 'practice') {
      var st = activeStudent(), q = queue(st.id).filter(function (id) { return id !== s.id; });
      return q.length ? { href: '#/practice/' + q[0], label: 'Next scenario', sub: D.scenario(q[0]).title } : { href: '#/done', label: 'Finish practice', sub: 'See how you did' };
    }
    var ids = D.scenarios.map(function (x) { return x.id; }), order = D.featured.concat(ids.filter(function (x) { return D.featured.indexOf(x) < 0; }));
    var n = order[(order.indexOf(s.id) + 1) % order.length];
    return { href: '#/preview/' + n, label: 'Try another scenario', sub: D.scenario(n).title };
  }
  function playReflect(s) {
    var c = choiceOf(s, play.sel), K = D.kind[c.kind], mode = play.mode, nx = nextTarget(s), st = activeStudent();
    var r = mode === 'practice' && st ? rec(st.id, s.id) : null;
    var values = mode === 'practice'
      ? '<section class="values"><h2>What mattered most to you in that moment?</h2><p class="hint">Optional. Tap one.</p><div class="pills">' + D.values.map(function (v) {
          var on = r && r.value === v;
          return '<button type="button" class="pill' + (on ? ' is-on' : '') + '" data-act="value" data-value="' + esc(v) + '" aria-pressed="' + !!on + '">' + esc(v) + '</button>';
        }).join('') + '</div></section>' : '';
    return '<div class="page play reflect kind-' + c.kind + '">' +
      '<div class="play-top">' + backLink(mode) + stepper(2) + '</div>' +
      '<section class="chose">' + art(s.id, 'art-mini') +
        '<div class="chose-main"><p class="eyebrow">' + esc(s.title) + ' · You chose</p><p class="chose-label">' + esc(c.label) + '</p>' + tone(c.kind) + '</div></section>' +
      '<div class="reflect-head"><h1 class="reflect-title" id="reflectTitle" tabindex="-1">' + lets(esc(K.heading)) + '</h1>' + speakBtn('reflection', 'Listen') + '</div>' +
      '<div class="flow"><section class="rcard impact"><h2>What this choice does</h2><p>' + said(c.impact) + '</p></section>' +
      '<section class="rcard next"><h2>' + K.nextLabel + '</h2><p>' + said(c.next) + '</p></section>' +
      '<blockquote class="closing"><span class="closing-bg" aria-hidden="true">' + rings('', 6) + '</span>' + ICON.ripple + '<p>' + said(c.close) + '</p></blockquote></div>' +
      (s.resource ? '<p class="resource">Learn more with a trusted adult: <a href="' + esc(s.resource.url) + '" target="_blank" rel="noopener">' + esc(s.resource.label) + '</a></p>' : '') +
      values +
      '<p id="voiceStatus" class="voice-status" role="status" aria-live="polite"></p>' +
      '<div class="retry-row"><button type="button" class="btn ghost block" data-act="retry">Try a different choice</button></div>' +
      '<div class="action-bar two"><button type="button" class="btn ghost" data-act="retry">Try a different choice</button>' +
        '<a class="btn primary big" href="' + nx.href + '"><span>' + nx.label + '<small>' + esc(nx.sub) + '</small></span>' + ICON.arrow + '</a></div>' +
      (mode === 'preview' ? '<p class="after-note">Like it? <a href="#/student">Start practicing as a student</a> to save progress.</p>' : '') +
    '</div>';
  }
  function commitChoice() {
    var s = D.scenario(play.id);
    if (!play.sel || !s) return;
    if (play.mode === 'practice') {
      var st = activeStudent(), p = prog(st.id), r = p[s.id] || (p[s.id] = { tries: [] });
      r.tries.push({ c: play.sel, at: new Date().toISOString() });
      if (sessionDone.indexOf(s.id) < 0) sessionDone.push(s.id);
      save();
    }
    play.phase = 'reflect';
    render();
    var t = document.getElementById('reflectTitle');
    if (t) t.focus({ preventScroll: true });
  }
  function viewDone() {
    var st = activeStudent();
    if (!st) { go('#/student'); return null; }
    var done = doneList(st.id).length, total = D.scenarios.length, left = queue(st.id);
    var all = sessionDone.map(D.scenario).filter(Boolean), today = all.slice(-4).reverse(), more = all.length - today.length;
    return '<div class="page narrow"><section class="panel center done">' + rings('', 9) +
      '<span class="done-mark">' + ICON.ripple + '</span>' +
      '<p class="eyebrow">Practice complete</p><h1>Nice work, ' + esc(first(st.name)) + '.</h1>' +
      '<p class="lede">' + (left.length ? 'You’ve finished <strong>' + done + ' of ' + total + '</strong> practices.' : 'You’ve practiced all <strong>' + total + '</strong> scenarios. That’s a lot of real moments thought through.') + '</p>' +
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
    var total = D.scenarios.length;
    return '<div class="page">' +
      '<section class="phead"><p class="eyebrow">Parent view</p><h1>Your students</h1><p class="lede">Open a student’s profile to see what they’ve practiced, what they chose, and what they read afterward.</p></section>' +
      '<div class="kids">' + family().map(function (s) {
        var done = doneList(s.id).length, w = waiting(s.id).length, pct = Math.round(done / total * 100);
        return '<a class="kid" href="#/parent/' + s.id + '">' + ringAvatar(s, 'xl', pct, done + ' of ' + total + ' practices done') +
          '<div class="kid-main"><h2>' + esc(s.name) + '</h2><p class="kid-grade">' + esc(s.grade) + '</p>' +
            '<p class="kid-stats"><strong>' + done + '</strong> of ' + total + ' done' + (w ? ' · ' + w + ' assigned and waiting' : '') + '</p>' +
            '<p class="kid-last">' + lastPracticed(s.id) + '</p></div>' +
          '<span class="kid-open">Open profile ' + ICON.arrow + '</span></a>';
      }).join('') + '</div>' +
      '<form class="panel add" id="addStudentForm"><h2>Add a student</h2><p class="hint">Creates a profile they can open from the Student view. They can change their own picture and name.</p>' +
        '<div class="add-row"><label class="field"><span>First and last name</span><input name="name" maxlength="40" required autocomplete="off" placeholder="e.g. Sam Rivera"></label>' +
        '<label class="field"><span>Grade</span><select name="grade"><option>Grade 4</option><option>Grade 5</option><option selected>Grade 6</option><option>Grade 7</option><option>Grade 8</option><option>Grade 9</option><option>Grade 10</option></select></label>' +
        '<button class="btn primary" type="submit">Add student</button></div></form>' +
    '</div>';
  }
  function historyItem(st, s) {
    var r = rec(st.id, s.id), t = r.tries, f = choiceOf(s, t[0].c), l = choiceOf(s, t[t.length - 1].c), changed = t.length > 1 && f && l && f.id !== l.id;
    if (!f || !l) return '';
    return '<details class="hist"><summary>' + art(s.id, 'art-thumb') +
      '<span class="hist-main"><span class="row-tags">' + chip(s.topic) + '<span class="when">' + fmtDate(t[t.length - 1].at) + '</span></span><strong>' + esc(s.title) + '</strong>' +
        '<span class="hist-choice">' + (changed ? '<b>First chose:</b> ' + esc(f.label) + ' <b>Then:</b> ' + esc(l.label) : '<b>Chose:</b> ' + esc(l.label)) + '</span></span>' +
      '<span class="hist-tone">' + tone(l.kind) + '<span class="chev" aria-hidden="true"></span></span></summary>' +
      '<div class="hist-body">' +
        '<p class="hist-sit"><strong>The situation:</strong> ' + esc(s.text) + '</p>' +
        '<div class="hist-grid">' +
          (changed ? '<div class="hbox"><h4>First choice ' + tone(f.kind) + '</h4><p class="q">' + esc(f.label) + '</p><p>' + esc(f.impact) + '</p></div>' : '') +
          '<div class="hbox"><h4>' + (changed ? 'Final choice ' : 'Their choice ') + tone(l.kind) + '</h4><p class="q">' + esc(l.label) + '</p><p>' + esc(l.impact) + '</p></div>' +
          '<div class="hbox"><h4>What ' + esc(first(st.name)) + ' read next</h4><p>' + esc(l.next) + '</p><p class="q">' + esc(l.close) + '</p></div>' +
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
    return studentReport(st, { role: 'parent', top: '<a class="back" href="#/parent">' + ICON.back + ' All students</a>' + tabs });
  }
  /* one student's own profile and progress — shared by the parent and teacher views */
  function studentReport(st, ctx) {
    var sid = st.id;
    function who(id) { var e = assignEntry(sid, id); return !e ? '' : e.by === ctx.role ? 'Assigned by you' : e.by === 'teacher' ? 'From ' + esc(state.teacher.name) : 'From a parent'; }
    var done = doneList(sid), total = D.scenarios.length, w = waiting(sid), pct = Math.round(done.length / total * 100), fn = esc(first(st.name));
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
      return '<li><span class="tname">' + esc(t.name) + '</span><span class="tbar" style="--chip-bg:' + t.bg + ';--chip-ink:' + t.ink + '"><i style="width:' + (d / all.length * 100) + '%"></i></span><span class="tnum">' + d + '/' + all.length + '</span></li>';
    }).join('');
    var assign = D.topics.map(function (t) {
      var rows = D.scenarios.filter(function (s) { return s.topic === t.id; }).map(function (s) {
        var d = isDone(sid, s.id), e = assignEntry(sid, s.id), a = !!e && e.by === ctx.role;
        var btn = d ? '<span class="status done">' + ICON.check + ' Completed</span>'
          : e && !a ? '<span class="status assigned">' + who(s.id) + '</span>'
          : '<button type="button" class="btn small ' + (a ? 'on' : 'ghost') + '" data-act="assign" data-by="' + ctx.role + '" data-sid="' + sid + '" data-id="' + s.id + '" aria-pressed="' + a + '">' + (a ? ICON.check + ' Assigned' : 'Assign') + '</button>';
        return '<li class="arow">' + art(s.id, 'art-tiny') + '<span class="arow-main"><strong>' + esc(s.title) + '</strong><span>' + esc(s.ask) + '</span></span>' + btn + '</li>';
      }).join('');
      return '<div class="agroup"><h3>' + chip(t.id) + '</h3><ul>' + rows + '</ul></div>';
    }).join('');
    return '<div class="page">' +
      '<div class="ptop">' + ctx.top + '</div>' +
      '<section class="profile">' + avatar(st, 'xxl') +
        '<div class="profile-main"><p class="eyebrow">Student profile</p><h1>' + esc(st.name) + '</h1>' +
          '<p class="profile-meta">' + esc(st.grade) + ' · Practicing since ' + new Date(st.joined).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) + ' · ' + lastPracticed(sid) + '</p>' +
          '<p class="profile-note">This is ' + fn + '’s own profile: the same name and picture ' + fn + ' sees when practicing. Everything below belongs to this profile only.</p></div></section>' +
      '<section class="stats">' +
        '<div class="stat lead"><strong>' + done.length + '<small>/' + total + '</small></strong><span>Practices completed</span><span class="donut" style="--p:' + pct + '" aria-hidden="true"></span></div>' +
        '<div class="stat"><strong>' + w.length + '</strong><span>Assigned and waiting</span></div>' +
        '<div class="stat ring"><strong>' + topicsTouched + '<small>/' + D.topics.length + '</small></strong><span>Topics practiced</span><span class="donut soft" style="--p:' + Math.round(topicsTouched / D.topics.length * 100) + '" aria-hidden="true"></span></div>' +
        '<div class="stat"><strong>' + second + '</strong><span>Went back to try a different choice</span></div>' +
      '</section>' +
      '<div class="pcols">' +
        '<section class="panel"><h2>How ' + fn + ' is choosing</h2>' + snap + '</section>' +
        '<section class="panel"><h2>Progress by topic</h2><ul class="tlist">' + byTopic + '</ul></section>' +
      '</div>' +
      '<section class="panel"><div class="block-head"><h2>Completed practices</h2><p>' + (done.length ? 'Open one to see the choice, the reflection ' + fn + ' read, and a question to talk about.' : 'Nothing completed yet.') + '</p></div>' +
        (done.length ? '<div class="hists">' + done.map(function (s) { return historyItem(st, s); }).join('') + '</div>' : '<p class="empty">When ' + fn + ' finishes a practice, it appears here with the choice they made.</p>') + '</section>' +
      (w.length ? '<section class="panel"><div class="block-head"><h2>Assigned and waiting</h2><p>' + fn + ' sees these first in “Up next.”</p></div><ul class="waitlist">' + w.map(function (id) {
        var s = D.scenario(id);
        return '<li>' + art(id, 'art-tiny') + '<span class="arow-main"><strong>' + esc(s.title) + '</strong><span>' + esc(D.topic(s.topic).name) + ' · not started</span></span><span class="status assigned">' + who(id) + '</span></li>';
      }).join('') + '</ul></section>' : '') +
      '<section class="panel"><details class="assign"' + (done.length + w.length === 0 ? ' open' : '') + '><summary><div><h2>Assign practice to ' + fn + '</h2><p class="hint">Pick scenarios you’d like ' + fn + ' to try. Tap again to remove one.</p></div><span class="chev" aria-hidden="true"></span></summary>' +
        '<div class="agroups">' + assign + '</div></details></section>' +
    '</div>';
  }

  /* ───────── TEACHER ───────── */
  function gStats(g) {
    var sts = groupStudents(g), ids = g.assigned.filter(D.scenario), total = sts.length * ids.length, done = 0, notStarted = 0;
    sts.forEach(function (st) {
      var d = ids.filter(function (id) { return isDone(st.id, id); }).length;
      done += d; if (ids.length && !d) notStarted++;
    });
    return { students: sts, ids: ids, total: total, done: done, pct: total ? Math.round(done / total * 100) : 0, notStarted: notStarted };
  }
  function viewTeacher() {
    var t = state.teacher, roles = ['Teacher', 'Counselor', 'Dean', 'Assistant principal'], kinds = ['Class', 'Small group', 'ISS / detention group'];
    return '<div class="page">' +
      '<section class="phead"><p class="eyebrow">' + esc(t.role) + ' view · ' + esc(t.name) + '</p><h1>Your classes and groups</h1><p class="lede">Assign practice to a whole class, a small group, or one student. Then see how they’re choosing and where a conversation would help.</p></section>' +
      (state.groups.length ? '<div class="kids">' + state.groups.map(function (g) {
        var k = gStats(g);
        return '<a class="kid gcard" href="#/teacher/g/' + g.id + '"><div class="kid-main"><p class="eyebrow">' + esc(g.kind) + '</p><h2>' + esc(g.name) + '</h2>' +
          '<div class="stack">' + k.students.slice(0, 6).map(function (s) { return avatar(s, 'md'); }).join('') + '<span>' + plural(k.students.length, 'student') + '</span></div>' +
          '<div class="meter" role="img" aria-label="' + k.done + ' of ' + k.total + ' assigned practices done"><i style="width:' + k.pct + '%"></i></div>' +
          '<p class="kid-stats">' + (k.ids.length ? '<strong>' + k.done + '</strong> of ' + k.total + ' assigned practices done' : 'Nothing assigned yet') + '</p></div>' +
          '<span class="kid-open">Open ' + ICON.arrow + '</span></a>';
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
      var d = k.ids.filter(function (id) { return isDone(st.id, id); }).length;
      return '<li class="rrow">' + avatar(st) +
        '<a class="rrow-main" href="#/teacher/s/' + st.id + '"><strong>' + esc(st.name) + '</strong><span>' + esc(st.grade) + ' · ' + lastPracticed(st.id) + '</span></a>' +
        '<span class="rrow-prog">' + (k.ids.length ? '<span class="meter"><i style="width:' + (d / k.ids.length * 100) + '%"></i></span><span>' + d + ' of ' + k.ids.length + ' assigned done</span>' : '<span>' + plural(doneList(st.id).length, 'practice') + ' done</span>') + '</span>' +
        '<span class="rrow-actions"><a class="btn small ghost" href="#/teacher/s/' + st.id + '">View progress</a>' +
        '<button type="button" class="btn small quiet" data-act="roster-remove" data-g="' + g.id + '" data-sid="' + st.id + '" aria-label="Remove ' + esc(st.name) + ' from ' + esc(g.name) + '">Remove</button></span></li>';
    }).join('');
    var assign = D.topics.map(function (t) {
      var rows = D.scenarios.filter(function (s) { return s.topic === t.id; }).map(function (s) {
        var a = g.assigned.indexOf(s.id) >= 0;
        return '<li class="arow">' + art(s.id, 'art-tiny') + '<span class="arow-main"><strong>' + esc(s.title) + '</strong><span>' + esc(s.ask) + ' <a href="#/preview/' + s.id + '">Preview</a></span></span>' +
          '<button type="button" class="btn small ' + (a ? 'on' : 'ghost') + '" data-act="gassign" data-g="' + g.id + '" data-id="' + s.id + '" aria-pressed="' + a + '">' + (a ? ICON.check + ' Assigned' : 'Assign') + '</button></li>';
      }).join('');
      return '<div class="agroup"><h3>' + chip(t.id) + '</h3><ul>' + rows + '</ul></div>';
    }).join('');
    return '<div class="page">' +
      '<div class="ptop"><a class="back" href="#/teacher">' + ICON.back + ' All classes and groups</a></div>' +
      '<section class="profile"><div class="profile-main"><p class="eyebrow">' + esc(g.kind) + '</p><h1>' + esc(g.name) + '</h1>' +
        '<p class="profile-meta">' + plural(sts.length, 'student') + ' · ' + plural(k.ids.length, 'practice') + ' assigned to everyone</p></div>' +
        '<div class="stack big">' + sts.slice(0, 7).map(function (s) { return avatar(s, 'lg'); }).join('') + '</div></section>' +
      '<section class="stats three">' +
        '<div class="stat lead"><strong>' + k.done + '<small>/' + k.total + '</small></strong><span>Assigned practices completed</span><span class="donut" style="--p:' + k.pct + '" aria-hidden="true"></span></div>' +
        '<div class="stat"><strong>' + k.ids.length + '</strong><span>Scenarios assigned to this ' + (g.kind === 'Class' ? 'class' : 'group') + '</span></div>' +
        '<div class="stat"><strong>' + k.notStarted + '</strong><span>' + (k.notStarted === 1 ? 'Student hasn’t' : 'Students haven’t') + ' started the assigned practice</span></div>' +
      '</section>' +
      '<section class="panel"><div class="block-head"><h2>Students</h2><p>Open a student to see their own profile, choices, and reflections.</p></div>' +
        (sts.length ? '<ul class="roster">' + roster + '</ul>' : '<p class="empty">No students yet. Add one below.</p>') +
        '<form class="roster-add" id="rosterForm" data-g="' + g.id + '"><h3>Add a student</h3><div class="add-row">' +
          '<label class="field"><span>Existing profile</span><select name="existing"><option value="">Choose a student…</option>' + others.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + ' · ' + esc(s.grade) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field"><span>Or a new student’s name</span><input name="name" maxlength="40" autocomplete="off" placeholder="e.g. Sam Rivera"></label>' +
          '<button class="btn primary" type="submit">Add student</button></div></form></section>' +
      '<section class="panel"><div class="block-head"><h2>How the ' + (g.kind === 'Class' ? 'class' : 'group') + ' is choosing</h2><p>' + (k.ids.length ? 'Bars count each student’s <em>first</em> pick. Open a student to see who chose what.' : 'Assign a scenario below and results will show up here.') + '</p></div>' +
        (k.ids.length ? '<div class="insights">' + k.ids.map(function (id) { return insight(D.scenario(id), sts); }).join('') + '</div>' : '<p class="empty">Nothing is assigned to this ' + (g.kind === 'Class' ? 'class' : 'group') + ' yet.</p>') + '</section>' +
      '<section class="panel"><details class="assign"' + (k.ids.length ? '' : ' open') + '><summary><div><h2>Assign practice to everyone</h2><p class="hint">Each student in ' + esc(g.name) + ' sees it first in “Up next.” Tap again to remove it.</p></div><span class="chev" aria-hidden="true"></span></summary>' +
        '<div class="agroups">' + assign + '</div></details></section>' +
      '<p class="page-end"><button type="button" class="linklike danger" data-act="gdelete" data-g="' + g.id + '">Delete ' + esc(g.name) + '</button></p>' +
    '</div>';
  }
  function viewTeacherStudent(sid) {
    var st = student(sid), mine = state.groups.filter(function (g) { return g.students.indexOf(sid) >= 0; });
    if (!st || !mine.length) { go('#/teacher'); return null; }
    var m = lastPage.match(/^#\/teacher\/g\/(\w+)/), from = (m && mine.filter(function (g) { return g.id === m[1]; })[0]) || mine[0];
    return studentReport(st, {
      role: 'teacher',
      top: '<a class="back" href="#/teacher/g/' + from.id + '">' + ICON.back + ' ' + esc(from.name) + '</a>' +
        '<span class="row-tags">' + mine.map(function (g) { return '<span class="status assigned">' + esc(g.name) + '</span>'; }).join('') + '</span>'
    });
  }

  /* ───────── events ───────── */
  function keepPlace(el, selector) {
    var before = el.getBoundingClientRect().top;
    render(true);
    var d = document.querySelector('details.assign'); if (d) d.open = true;
    var again = document.querySelector(selector);
    if (again) { window.scrollBy(0, again.getBoundingClientRect().top - before); again.focus({ preventScroll: true }); }
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act'), s, st;
    switch (act) {
      case 'speak':
        s = play && D.scenario(play.id);
        if (!s) return;
        var key = el.getAttribute('data-speak');
        if (key === 'scenario') Voice.toggle(key, (s.note ? [s.note] : []).concat([s.title + '.', s.text, s.ask]).concat(s.choices.map(function (c, i) { return 'Choice ' + 'ABC'[i] + '. ' + c.label + '.'; })));
        else if (key === 'choices') Voice.toggle(key, [s.ask].concat(s.choices.map(function (c, i) { return 'Choice ' + 'ABC'[i] + '. ' + c.label + '.'; })));
        else { var c = choiceOf(s, play.sel), K = D.kind[c.kind]; Voice.toggle(key, ['You chose: ' + c.label + '.', K.heading, c.impact, K.nextLabel + '.', c.next, c.close]); }
        break;
      case 'retry':
        play.phase = 'choose'; play.sel = null; render();
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
      case 'switch-student':
        state.active = null; save(); sessionDone = []; render();
        break;
      case 'home-topic': homeTopic = el.getAttribute('data-topic'); render(true); break;
      case 'student-topic': studentTopic = el.getAttribute('data-topic'); render(true); break;
      case 'assign':
        var sid = el.getAttribute('data-sid'), id = el.getAttribute('data-id'), by = el.getAttribute('data-by') || 'parent', mine = assignEntry(sid, id);
        if (mine) { if (mine.by === by) state.assigned[sid] = assignedTo(sid).filter(function (a) { return a !== mine; }); }
        else assignedTo(sid).push({ id: id, by: by });
        save();
        keepPlace(el, '[data-act="assign"][data-id="' + id + '"]');
        break;
      case 'gassign':
        var g = group(el.getAttribute('data-g')), scid = el.getAttribute('data-id');
        if (!g) return;
        var at = g.assigned.indexOf(scid);
        if (at >= 0) { g.assigned.splice(at, 1); g.students.forEach(function (x) { dropGroupAssign(x, g.id, scid); }); }
        else { g.assigned.push(scid); g.students.forEach(function (x) { addAssign(state, x, scid, 'teacher', g.id); }); }
        save();
        keepPlace(el, '[data-act="gassign"][data-id="' + scid + '"]');
        break;
      case 'roster-remove':
        var rg = group(el.getAttribute('data-g')), rs = el.getAttribute('data-sid');
        if (!rg) return;
        rg.students = rg.students.filter(function (x) { return x !== rs; });
        dropGroupAssign(rs, rg.id);
        save(); render(true);
        break;
      case 'gdelete':
        var dg = group(el.getAttribute('data-g'));
        if (dg && window.confirm('Delete “' + dg.name + '”? Students keep their profiles and completed practices. Practice assigned through this group that they haven’t started is removed.')) {
          dg.students.forEach(function (x) { dropGroupAssign(x, dg.id); });
          state.groups = state.groups.filter(function (x) { return x !== dg; });
          save(); go('#/teacher');
        }
        break;
      case 'reset':
        if (window.confirm('Reset Choice Ripple to the sample family? This clears all profiles and progress saved in this browser.')) {
          state = seed(); save(); play = null; sessionDone = []; go('#/');
        }
        break;
    }
  });
  document.addEventListener('change', function (e) {
    if (e.target.name === 'choice' && play) {
      play.sel = e.target.value;
      var s = D.scenario(play.id);
      Array.prototype.forEach.call(document.querySelectorAll('.choice'), function (l) { l.classList.toggle('is-selected', l.querySelector('input').checked); });
      var b = document.getElementById('continueBtn'); if (b) b.disabled = false;
      var p = document.getElementById('pickStatus'); if (p) p.innerHTML = pickText(s);
    }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    e.preventDefault();
    if (f.id === 'choiceForm') { if (play && play.sel) commitChoice(); return; }
    if (f.id === 'profileForm') {
      var st = activeStudent(); if (!st) return;
      var name = f.elements.name.value.trim(); if (!name) { f.elements.name.focus(); return; }
      st.name = name; st.grade = f.elements.grade.value;
      var av = f.querySelector('input[name=avatar]:checked'); if (av) st.avatar = Number(av.value);
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
      state.groups.push({ id: gid, name: gn, kind: f.elements.kind.value, students: [], assigned: [] });
      save(); go('#/teacher/g/' + gid); return;
    }
    if (f.id === 'rosterForm') {
      var rg = group(f.getAttribute('data-g')); if (!rg) return;
      var pick = f.elements.existing.value, typed = f.elements.name.value.trim(), add = pick;
      if (!add && typed) { var mates = groupStudents(rg); add = newStudent(typed, mates.length ? mates[0].grade : 'Grade 6'); }
      if (!add) { f.elements.name.focus(); return; }
      if (rg.students.indexOf(add) < 0) { rg.students.push(add); rg.assigned.forEach(function (x) { addAssign(state, add, x, 'teacher', rg.id); }); }
      save(); render(true);
    }
  });
  window.addEventListener('hashchange', function () { render(); });
  window.addEventListener('beforeunload', function () { if (Voice.ok) window.speechSynthesis.cancel(); });

  render();
})();
