/* ChoiceLab — anime-style scene illustrations, drawn as SVG.
   Every scenario gets its own small scene: characters, pose, and emotion are
   composed per situation in SCENES at the bottom of this file. */
(function (global) {
  'use strict';

  var INK = '#3b2f3a';
  var SKIN = { a: '#f9dfcb', b: '#f0c8a4', c: '#dcaa80', d: '#b98058', e: '#8c583c', f: '#66402d' };
  var ST = 'stroke="' + INK + '" stroke-linejoin="round" stroke-linecap="round"';

  function rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function mix(h, t, a) {
    var c = rgb(h), d = rgb(t);
    return '#' + c.map(function (v, i) { return Math.round(v + (d[i] - v) * a).toString(16).padStart(2, '0'); }).join('');
  }
  function dark(h, a) { return mix(h, '#2a1f2e', a == null ? 0.18 : a); }
  function light(h, a) { return mix(h, '#ffffff', a == null ? 0.28 : a); }
  function P(d, fill, sw, extra) {
    return '<path d="' + d + '" fill="' + (fill || 'none') + '" ' + ST + ' stroke-width="' + (sw == null ? 1.1 : sw) + '"' + (extra || '') + '/>';
  }
  function blob(cs, fill, sw) {
    var c = cs.map(function (k) { return '<circle cx="' + k[0] + '" cy="' + k[1] + '" r="' + k[2] + '"/>'; }).join('');
    return '<g fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (sw || 2.2) + '">' + c + '</g><g fill="' + fill + '">' + c + '</g>';
  }

  /* ---------- hair ---------- */
  function shine(c) { return '<path d="M-10,-16.5 Q-3,-21.5 6,-18.5" fill="none" stroke="' + light(c, 0.34) + '" stroke-width="1.7" stroke-linecap="round" opacity=".75"/>'; }
  var CAP = 'M-17.6,1 C-20.5,-27.5 20.5,-27.5 17.6,1';
  var FRINGE = {
    swept: ' L15,-7 C10,-9.5 6,-10 3,-5.5 C1,-10 -6,-12.5 -12,-7 C-14,-5 -15.5,-3 -17.6,1Z',
    blunt: ' L16,-5.5 L10.5,-6 L9.5,-3 L4.5,-6 L3.5,-3 L-2.5,-6 L-3.5,-3 L-8.5,-6 L-9.5,-3 L-16,-5.5Z',
    part: ' C17,-7 10,-12.5 1,-15 C-8,-12 -16.5,-6 -17.6,1Z',
    swoop: ' L16,-8 C8,-5 0,-8.5 -6.5,-16 C-8,-8 -13,-4 -17.6,1Z',
    close: ' C15.5,-8.5 9,-13 0,-13 C-9,-13 -15.5,-8.5 -17.6,1Z',
    wisp: ' L15.5,-6 C12,-9 9,-8 7.5,-4.5 C5,-9.5 0,-10 -2,-5 C-5,-10 -10,-10 -12.5,-5.5 C-14.5,-6 -16,-4 -17.6,1Z'
  };
  function hair(style, c) {
    var o = { back: '', front: '', over: '', ears: true };
    var cap = function (f) { return P(CAP + FRINGE[f], c) + shine(c); };
    switch (style) {
      case 'short': o.front = cap('swept'); break;
      case 'swoop': o.front = cap('swoop'); break;
      case 'wisp': o.front = cap('wisp'); break;
      case 'spiky':
        o.front = P('M-17.6,1 L-20.5,-8 L-17,-10 L-19.5,-19 L-13,-17 L-11.5,-25.5 L-5,-20.5 L0,-27.5 L5,-20.5 L11.5,-25.5 L13,-17 L19.5,-19 L17,-10 L20.5,-8 L17.6,1 L14,-6 L10,-2.5 L6,-8 L2,-3 L-3,-9 L-7,-3 L-11,-8 L-14,-3Z', c) + shine(c);
        break;
      case 'bob':
        o.back = P('M-19.5,-4 C-22,-29 22,-29 19.5,-4 L20.5,13 C20.5,18 14,19.5 12,16 L-12,16 C-14,19.5 -20.5,18 -20.5,13Z', c);
        o.front = cap('blunt'); break;
      case 'long':
        o.back = P('M-19.5,-4 C-23,-30 23,-30 19.5,-4 L23.5,42 C19,46 14,45 12,42 L12,8 L-12,8 L-12,42 C-14,45 -19,46 -23.5,42Z', c);
        o.front = cap('part'); break;
      case 'wavy':
        o.back = P('M-20,-4 C-24.5,-31 24.5,-31 20,-4 C26,5 22,13 25.5,21 C28,30 23,38 16,36 L-16,36 C-23,38 -28,30 -25.5,21 C-22,13 -26,5 -20,-4Z', c);
        o.front = cap('swoop'); break;
      case 'pony':
        o.back = P('M11,-17 C27,-23 32,-4 25,11 C23.5,15.5 18.5,14 20,9.5 C22.5,0 20,-8 11,-9Z', c) +
          '<ellipse cx="14.5" cy="-13.5" rx="2.2" ry="3.4" fill="#e9c46a" ' + ST + ' stroke-width=".9" transform="rotate(-35 14.5 -13.5)"/>';
        o.front = cap('swept'); break;
      case 'buns':
        o.back = blob([[-13.5, -19.5, 7.2], [13.5, -19.5, 7.2]], c);
        o.front = cap('blunt'); break;
      case 'afro':
        o.back = blob([[0, -8, 20], [-17, -14, 8.5], [-21, -3, 8], [-10, -24, 8.5], [0, -27.5, 8.5], [10, -24, 8.5], [17, -14, 8.5], [21, -3, 8], [-19, 7, 6.5], [19, 7, 6.5]], c);
        o.front = P('M-16.6,-1 C-17.5,-16 -8,-19.5 0,-19.5 C8,-19.5 17.5,-16 16.6,-1 C13,-9.5 6,-12 0,-12 C-6,-12 -13,-9.5 -16.6,-1Z', c, 0.9);
        break;
      case 'curly':
        o.back = blob([[0, -9, 19], [-17, -13, 8], [-20, -2, 7.5], [-20.5, 9, 7], [-18.5, 19, 6.5], [-9, -23, 8], [1, -26, 8], [11, -22.5, 8], [18, -12, 8], [20.5, -1, 7.5], [20.5, 10, 7], [18.5, 19, 6.5]], c);
        o.front = blob([[-11, -11, 5.4], [-3.5, -13.5, 5.6], [4.5, -13, 5.6], [11.5, -10.5, 5.2]], c, 1.8);
        break;
      case 'puffs':
        o.back = blob([[-17.5, -17, 9.5], [17.5, -17, 9.5]], c);
        o.front = cap('close'); break;
      case 'braids':
        o.front = cap('part');
        o.over = [-1, 1].map(function (k) {
          var s = '';
          for (var i = 0; i < 5; i++) s += '<ellipse cx="' + (k * (17.5 + (i % 2 ? 0.9 : -0.9))) + '" cy="' + (10 + i * 6.4) + '" rx="3.6" ry="4" fill="' + c + '" ' + ST + ' stroke-width="1"/>';
          return s + '<circle cx="' + (k * 17.5) + '" cy="42.5" r="2.3" fill="#d98b7b" ' + ST + ' stroke-width=".9"/>';
        }).join('');
        break;
      case 'fade': o.front = cap('close'); break;
      case 'twists':
        o.back = blob([[-14, -15, 4.4], [-9, -20.5, 4.6], [-3, -23.5, 4.8], [3.5, -23.5, 4.8], [9.5, -20.5, 4.6], [14.5, -15, 4.4], [-17, -8.5, 4], [17, -8.5, 4]], c, 2);
        o.front = cap('close') + blob([[-10, -13.5, 3.6], [-3.5, -16, 3.8], [3.5, -16, 3.8], [10, -13.5, 3.6]], c, 1.6);
        break;
      case 'beanie':
        o.front = P(CAP + FRINGE.wisp, c) +
          P('M-18.6,-7 C-20,-30 20,-30 18.6,-7Z', '#7d8fb3') +
          '<rect x="-19.6" y="-11.5" width="39.2" height="6.6" rx="3.2" fill="#6a7aa0" ' + ST + ' stroke-width="1.1"/>';
        break;
      case 'hijab':
        o.ears = false;
        o.back = P('M-20.5,2 C-24,-29.5 24,-29.5 20.5,2 C21.5,14 18,23 14,29 L-14,29 C-18,23 -21.5,14 -20.5,2Z', c);
        o.front = '<path fill-rule="evenodd" d="M-20.5,2 C-24,-29.5 24,-29.5 20.5,2 C21.5,12 19,18 15,22 L-15,22 C-19,18 -21.5,12 -20.5,2Z M-12.8,-1 C-12.8,-14 12.8,-14 12.8,-1 C12.8,8 7.5,15.2 0,16.8 C-7.5,15.2 -12.8,8 -12.8,-1Z" fill="' + c + '" ' + ST + ' stroke-width="1.1"/>' +
          '<path d="M-12,-11 Q0,-17 12,-11" fill="none" stroke="' + dark(c, 0.14) + '" stroke-width="1.2" stroke-linecap="round"/>';
        o.over = P('M-15.5,13 C-9,22.5 9,22.5 15.5,13 L20,31 C10,37.5 -10,37.5 -20,31Z', c) +
          '<path d="M-9,25 Q-2,29.5 7,26" fill="none" stroke="' + dark(c, 0.16) + '" stroke-width="1.1" stroke-linecap="round"/>';
        break;
      default: o.front = cap('swept');
    }
    return o;
  }

  /* ---------- face ---------- */
  var EXPR = {
    neutral: { eyes: 'open', brow: 'flat', mouth: 'flat' },
    smile: { eyes: 'open', brow: 'flat', mouth: 'smile' },
    happy: { eyes: 'happy', brow: 'raised', mouth: 'grin', blush: 1 },
    talk: { eyes: 'open', brow: 'raised', mouth: 'grin' },
    cheeky: { eyes: 'open', brow: 'cocky', mouth: 'grin' },
    smirk: { eyes: 'half', brow: 'cocky', mouth: 'smirk' },
    bossy: { eyes: 'shut', brow: 'angry', mouth: 'smirk' },
    laugh: { eyes: 'squeeze', brow: 'raised', mouth: 'laugh' },
    mock: { eyes: 'happy', brow: 'angry', mouth: 'laugh' },
    angry: { eyes: 'angry', brow: 'angry', mouth: 'grit', anger: 1, blush: 3 },
    shout: { eyes: 'angry', brow: 'angry', mouth: 'shout', anger: 1 },
    annoyed: { eyes: 'half', brow: 'angry', mouth: 'frown' },
    pout: { eyes: 'shut', brow: 'angry', mouth: 'smallfrown' },
    sad: { eyes: 'sad', brow: 'sad', mouth: 'frown' },
    down: { eyes: 'down', brow: 'sad', mouth: 'smallfrown', gloom: 1 },
    hurt: { eyes: 'sad', brow: 'sad', mouth: 'wobble', tear: 1 },
    stung: { eyes: 'sad', brow: 'angry', mouth: 'grit', tear: 1, blush: 3 },
    worried: { eyes: 'open', brow: 'sad', mouth: 'smallfrown', sweat: 1 },
    nervous: { eyes: 'open', brow: 'sad', mouth: 'wavy', sweat: 1 },
    uneasy: { eyes: 'open', brow: 'sad', mouth: 'wavy', sweat: 1 },
    shock: { eyes: 'wide', brow: 'raised', mouth: 'o' },
    scared: { eyes: 'wide', brow: 'sad', mouth: 'wavy', sweat: 1 },
    embarrassed: { eyes: 'down', brow: 'sad', mouth: 'wavy', blush: 2 },
    confused: { eyes: 'open', brow: 'tilt', mouth: 'smallo' },
    thinking: { eyes: 'open', brow: 'tilt', mouth: 'flat', sweat: 1 },
    firm: { eyes: 'open', brow: 'furrow', mouth: 'flat' },
    caring: { eyes: 'open', brow: 'sad', mouth: 'smallfrown' },
    plead: { eyes: 'sparkle', brow: 'sad', mouth: 'smallsmile' },
    disgust: { eyes: 'squeeze', brow: 'angry', mouth: 'wobble' },
    overwhelmed: { eyes: 'squeeze', brow: 'sad', mouth: 'wavy', sweat: 1 },
    hopeful: { eyes: 'open', brow: 'sad', mouth: 'smallsmile', sweat: 1 },
    curious: { eyes: 'open', brow: 'raised', mouth: 'smallo' },
    regret: { eyes: 'open', brow: 'sad', mouth: 'smallfrown', sweat: 1, blush: 1 },
    alarmed: { eyes: 'wide', brow: 'furrow', mouth: 'smallo', sweat: 1 }
  };

  function eye(cx, t, o) {
    var cy = 2.2, k = cx < 0 ? 1 : -1, lx = o.lx || 0, ly = o.ly || 0, ic = o.iris || '#5a4038', sk = o.skin;
    var lash = '<path d="M' + (cx - 3.9) + ',' + (cy - 2.4) + ' Q' + cx + ',' + (cy - 5.9) + ' ' + (cx + 3.9) + ',' + (cy - 2.4) + '" fill="none" ' + ST + ' stroke-width="1.5"/>';
    var ball = function (dy) {
      var y = cy + ly + (dy || 0);
      return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="3.6" ry="4.5" fill="#fff"/>' +
        '<ellipse cx="' + (cx + lx) + '" cy="' + (y + 0.3) + '" rx="2.8" ry="3.8" fill="' + ic + '"/>' +
        '<ellipse cx="' + (cx + lx) + '" cy="' + (y + 0.7) + '" rx="1.35" ry="2.1" fill="#241b26"/>' +
        '<circle cx="' + (cx + lx - 1) + '" cy="' + (y - 1.6) + '" r="1.1" fill="#fff"/>';
    };
    var line = function (d, w) { return '<path d="' + d + '" fill="none" ' + ST + ' stroke-width="' + (w || 1.6) + '"/>'; };
    var lid = function (yL, yR) {
      return '<path d="M' + (cx - 4.8) + ',' + (cy - 6.6) + ' H' + (cx + 4.8) + ' V' + yR + ' L' + (cx - 4.8) + ',' + yL + 'Z" fill="' + sk + '"/>' +
        line('M' + (cx - 4.3) + ',' + yL + ' L' + (cx + 4.3) + ',' + yR, 1.6);
    };
    switch (t) {
      case 'wide':
        return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="4.4" ry="5" fill="#fff" ' + ST + ' stroke-width="1"/><circle cx="' + (cx + lx * 0.6) + '" cy="' + (cy + ly * 0.6) + '" r="1.55" fill="#241b26"/>';
      case 'happy': return line('M' + (cx - 3.6) + ',' + (cy + 1.2) + ' Q' + cx + ',' + (cy - 3.8) + ' ' + (cx + 3.6) + ',' + (cy + 1.2), 1.7);
      case 'shut': return line('M' + (cx - 3.6) + ',' + (cy - 0.4) + ' Q' + cx + ',' + (cy + 2.9) + ' ' + (cx + 3.6) + ',' + (cy - 0.4), 1.7);
      case 'squeeze':
        var ox = cx - k * 3.3, ix = cx + k * 2.7;
        return line('M' + ox + ',' + (cy - 2.7) + ' L' + ix + ',' + cy + ' L' + ox + ',' + (cy + 2.7), 1.7);
      case 'half': return ball(0.6) + lid(cy - 0.9, cy - 0.9);
      case 'down': return ball(1.5) + lid(cy + 0.1, cy + 0.1);
      case 'angry': return ball() + (k === 1 ? lid(cy - 3.6, cy - 0.5) : lid(cy - 0.5, cy - 3.6));
      case 'sad': return ball(0.4) + (k === 1 ? lid(cy - 0.9, cy - 3.3) : lid(cy - 3.3, cy - 0.9));
      case 'sparkle':
        return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="4" ry="4.9" fill="#fff"/><ellipse cx="' + (cx + lx) + '" cy="' + (cy + 0.3) + '" rx="3.3" ry="4.3" fill="' + ic + '"/>' +
          '<circle cx="' + (cx + lx - 1.2) + '" cy="' + (cy - 1.7) + '" r="1.35" fill="#fff"/><circle cx="' + (cx + lx + 1.3) + '" cy="' + (cy + 1.9) + '" r=".8" fill="#fff"/>' +
          '<path d="M' + (cx - 4.2) + ',' + (cy - 2.6) + ' Q' + cx + ',' + (cy - 6.3) + ' ' + (cx + 4.2) + ',' + (cy - 2.6) + '" fill="none" ' + ST + ' stroke-width="1.5"/>';
      default: return ball() + lash;
    }
  }
  function brow(cx, t) {
    var k = cx < 0 ? 1 : -1, ix = cx + k * 3.7, ox = cx - k * 4.3, a, b;
    if (t === 'cocky') t = cx < 0 ? 'raised' : 'furrow';
    if (t === 'tilt') t = cx < 0 ? 'sad' : 'raised';
    switch (t) {
      case 'raised': a = -9.4; b = -8.8; break;
      case 'angry': a = -4.3; b = -8.2; break;
      case 'furrow': a = -5.3; b = -7.5; break;
      case 'sad': a = -9; b = -5.6; break;
      default: a = -7; b = -7;
    }
    var my = (a + b) / 2 - (t === 'flat' || t === 'raised' ? 0.9 : 0.2);
    return '<path d="M' + ix + ',' + a + ' Q' + cx + ',' + my + ' ' + ox + ',' + b + '" fill="none" ' + ST + ' stroke-width="1.5" opacity=".92"/>';
  }
  function mouth(t) {
    var l = function (d) { return '<path d="' + d + '" fill="none" ' + ST + ' stroke-width="1.35"/>'; };
    var M = '#8a3d42';
    switch (t) {
      case 'smile': return l('M-3.6,9.8 Q0,13.4 3.6,9.8');
      case 'smallsmile': return l('M-2.4,10.3 Q0,12.3 2.4,10.3');
      case 'grin': return P('M-4.4,9.2 Q0,15.6 4.4,9.2Z', M, 1) + '<path d="M-3.4,9.7 Q0,11.3 3.4,9.7Z" fill="#fff"/>';
      case 'laugh': return P('M-5,8.6 Q0,17.2 5,8.6Z', M, 1) + '<path d="M-3.9,9.1 Q0,10.8 3.9,9.1Z" fill="#fff"/><ellipse cx="0" cy="13.6" rx="2" ry="1.2" fill="#d98080"/>';
      case 'frown': return l('M-3.4,12 Q0,8.9 3.4,12');
      case 'smallfrown': return l('M-2.3,11.7 Q0,9.9 2.3,11.7');
      case 'wobble': return l('M-3.5,11.5 q1.1,-1.9 2.3,-.5 q1.2,1.3 2.3,0 q1.2,-1.3 2.4,.6');
      case 'wavy': return l('M-3.6,10.9 q.9,-1.5 1.8,0 t1.8,0 t1.8,0 t1.8,0');
      case 'o': return '<ellipse cx="0" cy="11.3" rx="2" ry="2.6" fill="' + M + '" ' + ST + ' stroke-width="1"/>';
      case 'smallo': return '<ellipse cx="0" cy="11" rx="1.4" ry="1.7" fill="' + M + '" ' + ST + ' stroke-width=".9"/>';
      case 'shout': return P('M-4.6,8.9 Q0,7.6 4.6,8.9 Q5,15 0,15.4 Q-5,15 -4.6,8.9Z', M, 1) + '<path d="M-3.6,9.3 Q0,8.5 3.6,9.3 L3.3,10.6 Q0,10 -3.3,10.6Z" fill="#fff"/>';
      case 'grit': return '<rect x="-3.9" y="9.2" width="7.8" height="3.5" rx="1.3" fill="#fff" ' + ST + ' stroke-width="1"/><path d="M-1.3,9.2v3.5M1.3,9.2v3.5" stroke="' + INK + '" stroke-width=".7"/>';
      case 'smirk': return l('M-3,10.7 Q.6,12.5 4.1,8.7');
      default: return l('M-2.6,10.8 H2.6');
    }
  }

  /* ---------- body + arms ---------- */
  var POSE = {
    down: { R: [21, 44, 19, 60, 0, 'fist'] },
    crossed: { R: [23, 46, -5, 43, 1, 'none'], L: [-23, 48, 6, 47.5, 1, 'none'] },
    stop: { R: [28, 39, 28, 20, 1, 'palm'], L: [-21, 44, -19, 60, 0, 'fist'] },
    raise: { R: [23, 14, 20, -15, 1, 'palm'], L: [-21, 44, -19, 60, 0, 'fist'] },
    half: { R: [25, 39, 24, 24, 1, 'open'], L: [-21, 44, -19, 60, 0, 'fist'] },
    phone: { R: [22, 48, 7, 43, 1, 'fist'], L: [-22, 48, -7, 43, 1, 'fist'], item: [0, 40] },
    faceHide: { R: [23, 40, 10.5, 9.5, 1, 'open'] },
    mouthCover: { R: [23, 40, 3, 11.5, 1, 'open'], L: [-21, 44, -19, 60, 0, 'fist'] },
    point: { R: [27, 33, 39, 28, 1, 'point'], L: [-21, 44, -19, 60, 0, 'fist'] },
    fists: { R: [25, 41, 26, 54, 1, 'fist'] },
    tense: { R: [28, 46, 21, 34, 1, 'fist'] },
    neck: { R: [30, 22, 16, 4, 0, 'none'], L: [-21, 44, -19, 60, 0, 'fist'] },
    chin: { R: [22, 47, 5, 19.5, 1, 'fist'], L: [-21, 44, -19, 60, 0, 'fist'] },
    shrug: { R: [26, 43, 33, 30, 1, 'open'] },
    hug: { R: [22, 47, -13, 41, 1, 'open'], L: [-23, 44, -16, 53, 1, 'none'] },
    headHold: { R: [30, 18, 14, -10, 1, 'open'] },
    hairGrab: { R: [30, 20, 9, -12, 1, 'open'], L: [-21, 44, -19, 60, 0, 'fist'] },
    offer: { R: [26, 43, 37, 35, 1, 'open'], L: [-21, 44, -19, 60, 0, 'fist'], item: [41, 31] },
    reach: { R: [28, 33, 41, 29, 1, 'open'], L: [2, 45, 34, 40, 1, 'open'] },
    hold: { R: [22, 48, 10, 47, 1, 'fist'], L: [-22, 48, -10, 47, 1, 'fist'], item: [0, 44] },
    comfort: { R: [28, 39, 41, 35, 1, 'open'], L: [-21, 44, -19, 60, 0, 'fist'] },
    pinch: { R: [23, 42, 1, 7.6, 1, 'fist'], L: [-21, 44, -19, 60, 0, 'fist'] },
    wave: { R: [28, 33, 31, 14, 1, 'palm'], L: [-21, 44, -19, 60, 0, 'fist'] },
    together: { R: [21, 45, 2.6, 37, 1, 'open'], L: [-21, 45, -2.6, 37, 1, 'open'] },
    keepAway: { R: [29, 24, 33, 5, 1, 'fist'], L: [-28, 39, -28, 21, 1, 'palm'], item: [35, -2] },
    write: { R: [21, 49, 6, 53, 1, 'fist'], L: [-21, 49, -8, 54, 1, 'fist'] },
    hip: { R: [28, 41, 17, 51, 1, 'none'] }
  };

  function item(t, x, y) {
    var g = function (s) { return '<g transform="translate(' + x + ' ' + y + ')">' + s + '</g>'; };
    switch (t) {
      case 'phone': return g('<rect x="-5.5" y="-9" width="11" height="18" rx="2.2" fill="#444a63" ' + ST + ' stroke-width="1"/><rect x="-4" y="-7" width="8" height="12.5" rx="1" fill="#d9ecf4"/>');
      case 'paper': return g('<rect x="-9" y="-11" width="18" height="22" rx="1.2" fill="#fffdf6" ' + ST + ' stroke-width="1"/><path d="M-5.5,-6h11M-5.5,-2h11M-5.5,2h8" stroke="#b9b3c4" stroke-width="1.1" stroke-linecap="round"/>');
      case 'papers': return g('<rect x="-12" y="-12" width="21" height="24" rx="1.2" fill="#f2ecdf" ' + ST + ' stroke-width="1" transform="rotate(-8)"/><rect x="-9" y="-12" width="21" height="24" rx="1.2" fill="#fffdf6" ' + ST + ' stroke-width="1" transform="rotate(5)"/><path d="M-4,-6h12M-4,-2h12M-4,2h8" stroke="#b9b3c4" stroke-width="1.1" stroke-linecap="round" transform="rotate(5)"/>');
      case 'book': return g('<rect x="-11" y="-9" width="22" height="18" rx="1.6" fill="#8fa9c9" ' + ST + ' stroke-width="1"/><path d="M-7,-9v18" stroke="' + INK + '" stroke-width=".8"/><rect x="-3.5" y="-4.5" width="10" height="4" rx="1" fill="#f5efe2"/>');
      case 'lunchbox': return g('<rect x="-12" y="-6" width="24" height="13" rx="2.6" fill="#e8b96a" ' + ST + ' stroke-width="1"/><path d="M-12,-2.5h24" stroke="' + INK + '" stroke-width=".9"/><rect x="-2.5" y="-4.3" width="5" height="3.4" rx="1" fill="#fff6dd" ' + ST + ' stroke-width=".7"/>');
      case 'vape': return g('<rect x="-5.5" y="-2" width="11" height="4" rx="2" fill="#6b7186" ' + ST + ' stroke-width=".9" transform="rotate(-20)"/><g fill="#eef0f3" opacity=".9"><circle cx="8" cy="-7" r="2.6"/><circle cx="11.5" cy="-10.5" r="3.3"/><circle cx="7.5" cy="-13.5" r="2.4"/></g>');
      case 'pencil': return g('<path d="M-1,-9 L1.4,-9 L1.4,4 L.2,7 L-1,4Z" fill="#e9c46a" ' + ST + ' stroke-width=".8" transform="rotate(25)"/>');
      case 'ball': return g('<circle cx="0" cy="0" r="9.5" fill="#fffdf6" ' + ST + ' stroke-width="1.1"/><path d="M0,-4.2l4,2.9l-1.5,4.7h-5l-1.5,-4.7z" fill="' + INK + '"/><path d="M0,-4.2v-5M4,-1.3l4.6,-1.6M2.5,3.4l3,4M-2.5,3.4l-3,4M-4,-1.3l-4.6,-1.6" stroke="' + INK + '" stroke-width=".9"/>');
      case 'cash': return g('<rect x="-11" y="-6" width="22" height="12" rx="1.6" fill="#b9d9b0" ' + ST + ' stroke-width="1" transform="rotate(-8)"/><circle cx="0" cy="0" r="3.4" fill="#8fbf8a" ' + ST + ' stroke-width=".8"/>');
      case 'controller': return g('<path d="M-12,-5 h24 a5,5 0 0 1 5,5 l1.5,7 a3.4,3.4 0 0 1 -6.4,2 l-2,-4 h-20.2 l-2,4 a3.4,3.4 0 0 1 -6.4,-2 l1.5,-7 a5,5 0 0 1 5,-5z" fill="#59607a" ' + ST + ' stroke-width="1"/><path d="M-9,-1v5M-11.5,1.5h5" stroke="#d9d3e2" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="2.6" r="1.6" fill="#e2755f"/><circle cx="11" cy="-.4" r="1.6" fill="#e3b85f"/>');
      default: return '';
    }
  }

  function arm(side, a, lk) {
    var sx = side * 15, sy = 29.5, ex = a[0], ey = a[1], hx = a[2], hy = a[3], hand = a[5];
    var d = 'M' + sx + ',' + sy + ' Q' + ex + ',' + ey + ' ' + hx + ',' + hy;
    var col = lk.short ? lk.skin : lk.tc;
    var s = '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="9.6" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="7.4" stroke-linecap="round"/>';
    if (lk.short) {
      var t = 0.42, ax = sx + (ex - sx) * t, ay = sy + (ey - sy) * t, bx = ex + (hx - ex) * t, by = ey + (hy - ey) * t, px = ax + (bx - ax) * t, py = ay + (by - ay) * t;
      var d2 = 'M' + sx + ',' + sy + ' Q' + ax + ',' + ay + ' ' + px + ',' + py;
      s += '<path d="' + d2 + '" fill="none" stroke="' + INK + '" stroke-width="10.6" stroke-linecap="butt"/><path d="' + d2 + '" fill="none" stroke="' + lk.tc + '" stroke-width="8.6" stroke-linecap="butt"/>';
    }
    var sk = lk.skin;
    if (hand === 'fist') s += '<circle cx="' + hx + '" cy="' + hy + '" r="4.1" fill="' + sk + '" ' + ST + ' stroke-width="1"/>';
    else if (hand === 'open') s += '<circle cx="' + hx + '" cy="' + hy + '" r="4.4" fill="' + sk + '" ' + ST + ' stroke-width="1"/>';
    else if (hand === 'palm') {
      var f = [[-3.4, -4.6], [-1.15, -5.5], [1.15, -5.5], [3.4, -4.6], [0, 0]].map(function (p, i) { return [hx + p[0], hy + p[1], i === 4 ? 4.7 : 1.75]; });
      s += blob(f, sk, 2);
    } else if (hand === 'point') {
      var dx = hx - ex, dy = hy - ey, n = Math.sqrt(dx * dx + dy * dy) || 1, tx = hx + dx / n * 7.5, ty = hy + dy / n * 7.5;
      s += '<path d="M' + hx + ',' + hy + ' L' + tx + ',' + ty + '" stroke="' + INK + '" stroke-width="4.6" stroke-linecap="round"/><path d="M' + hx + ',' + hy + ' L' + tx + ',' + ty + '" stroke="' + sk + '" stroke-width="2.7" stroke-linecap="round"/>' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="4" fill="' + sk + '" ' + ST + ' stroke-width="1"/>';
    }
    return s;
  }

  function torso(lk) {
    var tc = lk.tc, t2 = lk.tc2 || light(tc, 0.5), sk = lk.skin, T = 'M-18,120 L-18,36 C-18,27 -11,23 -5,21.5 L5,21.5 C11,23 18,27 18,36 L18,120Z';
    var neck = '<rect x="-3.8" y="13" width="7.6" height="10" fill="' + dark(sk, 0.1) + '" ' + ST + ' stroke-width="1"/>';
    var s = neck;
    switch (lk.top) {
      case 'hoodie':
        s += P(T, tc) + P('M-9.5,23 C-13,16 -7.5,14 -5,18.5 L0,26 L5,18.5 C7.5,14 13,16 9.5,23 C6,28 -6,28 -9.5,23Z', dark(tc, 0.1)) +
          '<path d="M-2.2,26.5v8M2.2,26.5v8" stroke="#f6f0e4" stroke-width="1.1" stroke-linecap="round"/>' +
          '<path d="M-8,52h16" stroke="' + dark(tc, 0.22) + '" stroke-width="1" stroke-linecap="round"/>';
        break;
      case 'collar':
        s += P(T, tc) + P('M-6.5,21 L0,28 L-8,30.5Z', '#fffdf6', 1) + P('M6.5,21 L0,28 L8,30.5Z', '#fffdf6', 1) +
          P('M0,27.5 l-2.3,3.2 l2.3,11 l2.3,-11Z', t2, 0.9);
        break;
      case 'sweater':
        s += P(T, tc) + '<rect x="-18" y="40" width="36" height="4.2" fill="' + t2 + '"/><rect x="-18" y="47.5" width="36" height="2.4" fill="' + t2 + '"/>' +
          P(T, 'none') + '<path d="M-5.5,21.5 Q0,27.5 5.5,21.5" fill="' + sk + '" ' + ST + ' stroke-width="1"/><path d="M-6.3,21.2 Q0,29 6.3,21.2" fill="none" stroke="' + dark(tc, 0.2) + '" stroke-width="1.6"/>';
        break;
      case 'jacket':
        s += P(T, t2) + '<path d="M-5.5,21.5 Q0,27 5.5,21.5" fill="' + sk + '" ' + ST + ' stroke-width="1"/>' +
          P('M-18,120 L-18,36 C-18,27 -11,23 -6,21.5 L-3.5,42 L-4.5,120Z', tc) + P('M18,120 L18,36 C18,27 11,23 6,21.5 L3.5,42 L4.5,120Z', tc);
        break;
      case 'jersey':
        s += P(T, tc) + '<path d="M-5.8,21.5 Q0,28 5.8,21.5" fill="' + sk + '" ' + ST + ' stroke-width="1"/><path d="M-6.6,21.2 Q0,29.6 6.6,21.2" fill="none" stroke="' + t2 + '" stroke-width="1.8"/>' +
          '<text x="0" y="48" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="12" fill="' + t2 + '">' + (lk.num || 7) + '</text>';
        break;
      default:
        s += P(T, tc) + '<path d="M-5.8,21.5 Q0,28 5.8,21.5" fill="' + sk + '" ' + ST + ' stroke-width="1"/>';
    }
    return s;
  }

  /* ---------- character ---------- */
  function head(lk, e) {
    var sk = lk.skin, H = hair(lk.hair, lk.hc), lx = (lk.look && lk.look[0]) || 0, ly = (lk.look && lk.look[1]) || 0;
    var eo = { lx: lx, ly: ly, skin: sk, iris: lk.iris };
    var s = '';
    if (H.ears) s += '<ellipse cx="-16.4" cy="2" rx="3" ry="3.6" fill="' + sk + '" ' + ST + ' stroke-width="1"/><ellipse cx="16.4" cy="2" rx="3" ry="3.6" fill="' + sk + '" ' + ST + ' stroke-width="1"/>';
    var FACE = 'M-16,-3 C-16,-22 16,-22 16,-3 C16,7 10,15 0,17.6 C-10,15 -16,7 -16,-3Z';
    s += P(FACE, sk, 1.1);
    if (e.gloom) s += '<path d="' + FACE + '" fill="url(#crGloom)"/>';
    if (e.blush) {
      var bc = e.blush === 3 ? '#e2685f' : '#ec8f86', bo = e.blush === 1 ? 0.42 : 0.62, rx = e.blush === 1 ? 3.1 : 3.8;
      s += '<g fill="' + bc + '" opacity="' + bo + '"><ellipse cx="-10.4" cy="8" rx="' + rx + '" ry="2"/><ellipse cx="10.4" cy="8" rx="' + rx + '" ry="2"/></g>';
      if (e.blush === 2) s += '<path d="M-12.4,7l1.2,2M-10.4,7l1.2,2M-8.4,7l1.2,2M8.6,7l1.2,2M10.6,7l1.2,2M12.6,7l1.2,2" stroke="#d76a66" stroke-width=".7" stroke-linecap="round"/>';
    }
    s += eye(-7.2, e.eyes, eo) + eye(7.2, e.eyes, eo);
    s += '<path d="M.3,6.2 l-.9,1.5" stroke="' + dark(sk, 0.3) + '" stroke-width="1" stroke-linecap="round" fill="none"/>';
    s += mouth(e.mouth);
    if (e.tear) s += '<path d="M-10.6,6.4 c1.9,2.7 1.9,4.6 0,4.6 c-1.9,0 -1.9,-1.9 0,-4.6Z" fill="#a8d8f0" ' + ST + ' stroke-width=".7"/>';
    if (e.tears) s += '<g fill="#a8d8f0" ' + ST + ' stroke-width=".7"><path d="M-10.6,5.4 c2,3 2,5 0,5 c-2,0 -2,-2 0,-5Z"/><path d="M10.6,5.4 c2,3 2,5 0,5 c-2,0 -2,-2 0,-5Z"/></g>';
    s += H.front;
    s += brow(-7.2, e.brow) + brow(7.2, e.brow);
    if (lk.glasses) s += '<g fill="rgba(255,255,255,.22)" ' + ST + ' stroke-width="1.15"><rect x="-12.6" y="-3.2" width="10.6" height="10.2" rx="3.6"/><rect x="2" y="-3.2" width="10.6" height="10.2" rx="3.6"/></g><path d="M-2,1.2h4" stroke="' + INK + '" stroke-width="1.15"/>';
    if (e.gloom) s += '<path d="M6.5,-16.5v7.5M10,-17.5v9.5M13.5,-15.5v7.5" stroke="#6f7ba6" stroke-width="1.1" stroke-linecap="round" opacity=".75"/>';
    if (e.sweat) s += '<path d="M18.4,-13.5 c2.6,3.7 2.6,6.4 0,6.4 c-2.6,0 -2.6,-2.7 0,-6.4Z" fill="#b5dcf0" ' + ST + ' stroke-width=".75"/>';
    if (e.anger) s += '<g transform="translate(16 -19)" fill="none" stroke="#cf4d43" stroke-width="1.7" stroke-linecap="round"><path d="M-3.6,-1.2 q2.4,0 2.4,-2.4M1.2,-3.6 q0,2.4 2.4,2.4M3.6,1.2 q-2.4,0 -2.4,2.4M-1.2,3.6 q0,-2.4 -2.4,-2.4"/></g>';
    return { back: H.back, s: s, over: H.over };
  }

  var REC = null;
  var LOOK_KEYS = ['skin', 'hair', 'hc', 'top', 'tc', 'tc2', 'glasses'];
  function pick(l) { var n = {}; LOOK_KEYS.forEach(function (k) { if (l[k] != null) n[k] = l[k]; }); return n; }
  function wear(o, look) {
    if (!look) return o;
    var n = Object.assign({}, o), team = o.top === 'jersey';
    LOOK_KEYS.forEach(function (k) { if (team && (k === 'top' || k === 'tc' || k === 'tc2')) return; n[k] = look[k]; });
    if (!team) n.short = null;
    return n;
  }
  function C(x, y, o) {
    if (REC) { var ri = REC.n++; if (ri === REC.me) o = wear(o, REC.look); else REC.cast.push(o); }
    var lk = {
      skin: SKIN[o.skin] || o.skin || SKIN.b, hair: o.hair || 'short', hc: o.hc || '#3a2c2e', top: o.top || 'tee', tc: o.tc || '#8fae8b', tc2: o.tc2,
      look: o.look, iris: o.iris, glasses: o.glasses, num: o.num
    };
    lk.short = o.short != null ? o.short : (lk.top === 'tee' || lk.top === 'jersey');
    var e = Object.assign({}, EXPR[o.ex] || EXPR.neutral, o.over || {});
    var p = POSE[o.pose] || POSE.down, R = p.R, L = p.L || [-R[0], R[1], -R[2], R[3], R[4], R[5]];
    var hd = head(lk, e), s = o.s || 1.5, tilt = o.tilt || 0, drop = o.drop || 0;
    var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (o.flip ? -s : s) + ' ' + s + ')">';
    g += '<g transform="translate(0 ' + drop + ') rotate(' + tilt + ' 0 14)">' + hd.back + '</g>';
    if (!L[4]) g += arm(-1, L, lk);
    if (!R[4]) g += arm(1, R, lk);
    g += torso(lk);
    g += '<g transform="translate(0 ' + drop + ') rotate(' + tilt + ' 0 14)">' + hd.s + hd.over + '</g>';
    if (o.item && p.item) g += item(o.item, p.item[0], p.item[1]);
    if (L[4]) g += arm(-1, L, lk);
    if (R[4]) g += arm(1, R, lk);
    return g + '</g>';
  }

  /* ---------- backgrounds ---------- */
  var BG = {
    hall: function () {
      var s = '<rect width="200" height="150" fill="#efe7d8"/>';
      for (var i = 0; i < 6; i++) {
        var x = i * 35 - 6;
        s += '<rect x="' + x + '" y="14" width="33" height="110" rx="2" fill="' + (i % 2 ? '#b9cdc9' : '#aec4c6') + '" stroke="#7f989c" stroke-width="1"/>' +
          '<path d="M' + (x + 8) + ',24h17M' + (x + 8) + ',29h17M' + (x + 8) + ',34h17" stroke="#869fa3" stroke-width="1.3" stroke-linecap="round"/>' +
          '<rect x="' + (x + 24) + '" y="66" width="3.4" height="9" rx="1.5" fill="#7f989c"/>';
      }
      return s + '<rect y="124" width="200" height="26" fill="#dccfb9"/><path d="M0,124h200" stroke="#bcae96" stroke-width="1.2"/>';
    },
    classroom: function () {
      return '<rect width="200" height="150" fill="#f1e8d9"/>' +
        '<rect x="14" y="12" width="118" height="58" rx="2" fill="#86a898" stroke="#b39672" stroke-width="3.2"/>' +
        '<path d="M26,28h46M26,38h62M26,48h34" stroke="#e8f1ea" stroke-width="1.8" stroke-linecap="round" opacity=".6"/>' +
        '<rect x="150" y="10" width="40" height="56" rx="2" fill="#d5e7ee" stroke="#b9a98d" stroke-width="2.4"/><path d="M170,10v56M150,38h40" stroke="#b9a98d" stroke-width="1.8"/>' +
        '<rect y="98" width="200" height="52" fill="#e3d5bd"/><path d="M0,98h200" stroke="#c7b698" stroke-width="1.2"/>';
    },
    cafe: function () {
      var s = '<rect width="200" height="150" fill="#f3eadb"/>';
      for (var i = 0; i < 3; i++) {
        var x = 8 + i * 64;
        s += '<rect x="' + x + '" y="10" width="56" height="62" rx="2" fill="#d8e9ec" stroke="#c2b193" stroke-width="2.4"/>' +
          '<circle cx="' + (x + 18) + '" cy="62" r="14" fill="#bcd5b2"/><circle cx="' + (x + 40) + '" cy="66" r="11" fill="#c9dcbc"/>' +
          '<rect x="' + x + '" y="10" width="56" height="62" rx="2" fill="none" stroke="#c2b193" stroke-width="2.4"/><path d="M' + (x + 28) + ',10v62" stroke="#c2b193" stroke-width="1.6"/>';
      }
      return s + '<rect y="100" width="200" height="50" fill="#e6d8c1"/><path d="M0,100h200" stroke="#cbbb9e" stroke-width="1.2"/>';
    },
    field: function () {
      return '<rect width="200" height="150" fill="url(#crSky)"/>' +
        '<g fill="#fff" opacity=".85"><ellipse cx="38" cy="24" rx="20" ry="7"/><ellipse cx="52" cy="19" rx="13" ry="6"/><ellipse cx="156" cy="32" rx="18" ry="6"/></g>' +
        '<path d="M0,94 Q30,78 60,90 T120,86 T200,90 V150 H0Z" fill="#c2d6ab"/><rect y="98" width="200" height="52" fill="#b5cd9c"/>' +
        '<g fill="none" stroke="#fbf8f0" stroke-width="2.6" stroke-linecap="round"><path d="M132,98V58H192V98"/></g><path d="M134,62h56M134,70h56M134,78h56M134,86h56M146,60v38M160,60v38M174,60v38" stroke="#fbf8f0" stroke-width=".7" opacity=".75"/>' +
        '<path d="M0,116h200" stroke="#e9f0dc" stroke-width="2" opacity=".8"/>';
    },
    brick: function () {
      var s = '<rect width="200" height="150" fill="#d6ab95"/>';
      for (var r = 0; r < 9; r++) {
        s += '<path d="M0,' + (r * 14 + 6) + 'h200" stroke="#c39681" stroke-width="1.1"/>';
        for (var c = 0; c < 7; c++) s += '<path d="M' + (c * 32 + (r % 2 ? 16 : 0)) + ',' + (r * 14 + 6) + 'v14" stroke="#c39681" stroke-width="1.1"/>';
      }
      return s + '<rect x="150" y="16" width="34" height="26" rx="2" fill="#a9bcc4" stroke="#8d7767" stroke-width="2"/>' +
        '<rect x="14" y="0" width="7" height="132" fill="#9aa7ad" stroke="#7d8a90" stroke-width="1"/>' +
        '<rect y="130" width="200" height="20" fill="#cfc3b2"/><path d="M0,130h200" stroke="#b3a691" stroke-width="1.2"/>';
    },
    gate: function () {
      var s = '<rect width="200" height="150" fill="url(#crSky)"/><g fill="#fff" opacity=".85"><ellipse cx="150" cy="22" rx="22" ry="7"/><ellipse cx="134" cy="27" rx="13" ry="5"/></g>' +
        '<circle cx="176" cy="74" r="24" fill="#bcd3ae"/><circle cx="156" cy="86" r="16" fill="#c8dbb9"/>' +
        '<rect x="0" y="40" width="74" height="70" fill="#ecdcc4" stroke="#c9b697" stroke-width="1.4"/>' +
        '<g fill="#cfe2e8" stroke="#c9b697" stroke-width="1.2"><rect x="8" y="50" width="16" height="16"/><rect x="32" y="50" width="16" height="16"/><rect x="8" y="76" width="16" height="16"/><rect x="32" y="76" width="16" height="16"/></g>' +
        '<rect y="110" width="200" height="40" fill="#d9ceb9"/>';
      for (var i = 0; i < 9; i++) if (i < 3 || i > 5) s += '<rect x="' + (78 + i * 14) + '" y="56" width="3.2" height="58" rx="1.4" fill="#8f9aa6"/>';
      return s + '<path d="M76,62h44M160,62h40M76,104h44M160,104h40" stroke="#8f9aa6" stroke-width="2.6" stroke-linecap="round"/>' +
        '<rect x="118" y="50" width="5" height="66" rx="2" fill="#7c8793"/><rect x="158" y="50" width="5" height="66" rx="2" fill="#7c8793"/>';
    },
    room: function () {
      return '<rect width="200" height="150" fill="#8f96b5"/>' +
        '<rect x="126" y="12" width="58" height="52" rx="3" fill="#4f5a85" stroke="#d9cdb8" stroke-width="3"/><circle cx="166" cy="30" r="8" fill="#f6edc9"/><g fill="#f6edc9"><circle cx="138" cy="24" r="1.1"/><circle cx="148" cy="44" r="1"/><circle cx="174" cy="52" r="1.1"/><circle cx="136" cy="52" r=".9"/></g><path d="M155,12v52" stroke="#d9cdb8" stroke-width="2"/>' +
        '<rect x="12" y="24" width="56" height="5" rx="2" fill="#c9b79c"/><g stroke="' + INK + '" stroke-width=".6"><rect x="18" y="8" width="6" height="16" fill="#d99a8b"/><rect x="24" y="11" width="5" height="13" fill="#e9c46a"/><rect x="29" y="7" width="7" height="17" fill="#8fb3a6"/><rect x="36" y="12" width="5" height="12" fill="#f1e6d3"/></g>' +
        '<ellipse cx="60" cy="118" rx="90" ry="60" fill="#fbe9b7" opacity=".2"/>' +
        '<rect y="112" width="200" height="38" fill="#7a809f"/>';
    },
    lab: function () {
      var s = '<rect width="200" height="150" fill="#eee9dc"/><rect x="10" y="18" width="92" height="5" rx="2" fill="#c9b79c"/><rect x="10" y="50" width="92" height="5" rx="2" fill="#c9b79c"/>';
      [[20, '#a9d2c8'], [40, '#e6c285'], [62, '#c5b3dc'], [84, '#a9c8e0']].forEach(function (b, i) {
        s += '<path d="M' + (b[0] - 3) + ',' + (i % 2 ? 33 : 2) + 'h6v6l5,10h-16l5,-10z" fill="' + b[1] + '" stroke="#8d8799" stroke-width="1" opacity=".9" transform="translate(0 ' + (i % 2 ? 1 : 0) + ')"/>';
      });
      return s + '<rect x="138" y="10" width="50" height="54" rx="2" fill="#d5e7ee" stroke="#b9a98d" stroke-width="2.4"/><path d="M163,10v54M138,37h50" stroke="#b9a98d" stroke-width="1.6"/>' +
        '<rect y="100" width="200" height="50" fill="#dfd6c3"/>';
    },
    library: function () {
      var s = '<rect width="200" height="150" fill="#e9dfcc"/>', cols = ['#d9a08f', '#e6c77f', '#9dbba8', '#a9b7d6', '#c9aacb', '#f1e6d3', '#b7c9a0', '#dbb38f'];
      for (var r = 0; r < 3; r++) {
        var x = 2;
        for (var i = 0; x < 198; i++) {
          var w = 6 + ((i * 7 + r * 3) % 5), h = 26 + ((i * 5 + r * 11) % 9);
          s += '<rect x="' + x + '" y="' + (8 + r * 42 + (36 - h)) + '" width="' + w + '" height="' + h + '" rx="1" fill="' + cols[(i + r * 3) % cols.length] + '" stroke="#b7a78c" stroke-width=".6"/>';
          x += w + 1;
        }
        s += '<rect x="0" y="' + (44 + r * 42) + '" width="200" height="5" fill="#bfa987"/>';
      }
      return s + '<rect width="200" height="150" fill="#f3ecdd" opacity=".35"/>';
    },
    dusk: function () {
      return '<rect width="200" height="150" fill="url(#crDusk)"/><circle cx="160" cy="40" r="13" fill="#fbe7c1" opacity=".8"/>' +
        '<path d="M0,96 Q40,80 80,92 T200,84 V150 H0Z" fill="#b9b3c9"/>' +
        '<g fill="#8f8aa6"><rect x="18" y="52" width="6" height="60" rx="2"/><circle cx="21" cy="42" r="22"/><circle cx="38" cy="54" r="14"/><circle cx="6" cy="56" r="14"/></g>' +
        '<rect x="30" y="104" width="150" height="8" rx="3" fill="#a58d7a" stroke="#7d6a5d" stroke-width="1"/><rect x="30" y="118" width="150" height="8" rx="3" fill="#a58d7a" stroke="#7d6a5d" stroke-width="1"/>' +
        '<rect y="132" width="200" height="18" fill="#a9a3bb"/>';
    },
    home: function () {
      return '<rect width="200" height="150" fill="#f1e5d3"/>' +
        '<rect x="118" y="12" width="62" height="50" rx="3" fill="#d5e7ee" stroke="#c7b698" stroke-width="2.6"/><path d="M149,12v50M118,37h62" stroke="#c7b698" stroke-width="1.8"/>' +
        '<path d="M112,10 q6,26 0,56 M186,10 q-6,26 0,56" fill="none" stroke="#d9a7b0" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="16" y="16" width="30" height="24" rx="2" fill="#fffdf6" stroke="#b39672" stroke-width="2.4"/><circle cx="26" cy="26" r="4" fill="#e9c46a"/><path d="M18,38 l9,-8 l6,5 l5,-4 l6,7z" fill="#9dbba8"/>' +
        '<rect x="64" y="20" width="4" height="52" fill="#b9a98d"/><path d="M52,22 h28 l-6,-16 h-16z" fill="#fbe9b7" stroke="#c7b698" stroke-width="1.4"/>' +
        '<rect y="104" width="200" height="46" fill="#dccbb0"/><path d="M0,104h200" stroke="#c7b698" stroke-width="1.2"/>' +
        '<rect x="-8" y="86" width="216" height="40" rx="12" fill="#9fb4c9" stroke="#7f95ab" stroke-width="1.4"/><rect x="-8" y="112" width="216" height="40" rx="6" fill="#8ea5bd" stroke="#7f95ab" stroke-width="1.4"/>';
    },
    church: function () {
      var s = '<rect width="200" height="150" fill="#ece4d6"/>', cols = ['#e9c46a', '#d9a7b0', '#9dbba8', '#a9b7d6', '#c9aacb', '#e6b08a'];
      [34, 100, 166].forEach(function (x, k) {
        s += '<path d="M' + (x - 17) + ',86 V36 Q' + x + ',2 ' + (x + 17) + ',36 V86Z" fill="#f7f1e3" stroke="#b9a98d" stroke-width="2.6"/>';
        for (var i = 0; i < 6; i++) s += '<rect x="' + (x - 13 + (i % 2) * 14) + '" y="' + (36 + Math.floor(i / 2) * 16) + '" width="12" height="14" rx="1.5" fill="' + cols[(i + k * 2) % 6] + '" opacity=".8"/>';
        s += '<path d="M' + (x - 13) + ',34 Q' + x + ',10 ' + (x + 13) + ',34Z" fill="' + cols[(k + 3) % 6] + '" opacity=".8"/><path d="M' + x + ',16V86" stroke="#b9a98d" stroke-width="1.6"/>';
      });
      s += '<rect y="100" width="200" height="50" fill="#d8c9ae"/>';
      for (var r = 0; r < 2; r++) s += '<rect x="-6" y="' + (104 + r * 22) + '" width="212" height="16" rx="3" fill="#a9825f" stroke="#86664a" stroke-width="1.2"/><path d="M0,' + (108 + r * 22) + 'h200" stroke="#c19a76" stroke-width="1.6"/>';
      return s;
    },
    bus: function () {
      var s = '<rect width="200" height="150" fill="#dcd6c8"/><rect y="0" width="200" height="12" fill="#c9c2b2"/>';
      for (var i = 0; i < 4; i++) {
        var x = 6 + i * 49;
        s += '<rect x="' + x + '" y="20" width="42" height="46" rx="6" fill="url(#crSky)" stroke="#9aa3ad" stroke-width="2.4"/><circle cx="' + (x + 12) + '" cy="60" r="10" fill="#bcd5b2" opacity=".9"/><circle cx="' + (x + 30) + '" cy="64" r="8" fill="#c9dcbc" opacity=".9"/><rect x="' + x + '" y="20" width="42" height="46" rx="6" fill="none" stroke="#9aa3ad" stroke-width="2.4"/>';
      }
      s += '<path d="M0,14h200" stroke="#e3b85f" stroke-width="2.4"/><rect y="78" width="200" height="72" fill="#cfc8b8"/>';
      for (var k = 0; k < 3; k++) s += '<rect x="' + (-14 + k * 78) + '" y="84" width="64" height="76" rx="12" fill="#6f93a8" stroke="#557687" stroke-width="1.6"/><rect x="' + (-8 + k * 78) + '" y="90" width="52" height="10" rx="5" fill="#86a8ba"/>';
      return s;
    },
    plain: function () {
      return '<rect width="200" height="150" fill="#eef0e6"/><g fill="none" stroke="#d6dccb" stroke-width="2"><circle cx="150" cy="40" r="20"/><circle cx="150" cy="40" r="38"/><circle cx="150" cy="40" r="58"/></g>';
    }
  };

  Object.keys(BG).forEach(function (k) { var f = BG[k]; BG[k] = function () { if (REC) REC.bg = k; return f(); }; });

  /* ---------- props ---------- */
  function table(y, c) { c = c || '#e9cda6'; return '<rect x="-6" y="' + y + '" width="212" height="' + (156 - y) + '" rx="5" fill="' + c + '" ' + ST + ' stroke-width="1.3"/><path d="M0,' + (y + 5) + 'h200" stroke="' + light(c, 0.4) + '" stroke-width="2" stroke-linecap="round"/>'; }
  function mark(x, y, t, size, col, rot) {
    return '<text x="' + x + '" y="' + y + '" font-family="Arial Rounded MT Bold,Trebuchet MS,Arial,sans-serif" font-weight="900" font-size="' + (size || 16) + '" fill="' + (col || INK) + '" text-anchor="middle"' + (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + ' stroke="#fffdf6" stroke-width="2.6" paint-order="stroke" stroke-linejoin="round">' + t + '</text>';
  }
  function bubble(x, y, w, h, tail, inner, fill) {
    var tx = tail === 'r' ? x + w - 12 : tail === 'c' ? x + w / 2 - 4 : x + 8, dir = tail === 'r' ? 6 : tail === 'c' ? 0 : -6;
    return '<path d="M' + tx + ',' + (y + h - 1) + ' l' + dir + ',9 l8,-9Z" fill="' + (fill || '#fffdf6') + '" ' + ST + ' stroke-width="1.2"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + Math.min(10, h / 2) + '" fill="' + (fill || '#fffdf6') + '" ' + ST + ' stroke-width="1.2"/>' +
      '<path d="M' + (tx + 0.8) + ',' + (y + h - 1.4) + ' h6.6" stroke="' + (fill || '#fffdf6') + '" stroke-width="2.2"/>' + (inner || '');
  }
  function scribble(x, y, w, col) {
    return '<path d="M' + x + ',' + y + 'h' + w + 'M' + x + ',' + (y + 6) + 'h' + (w * 0.7) + '" stroke="' + (col || '#b7b0c2') + '" stroke-width="2.2" stroke-linecap="round"/>';
  }
  function dots(x, y, col) { return '<g fill="' + (col || '#8d8799') + '"><circle cx="' + x + '" cy="' + y + '" r="2"/><circle cx="' + (x + 7) + '" cy="' + y + '" r="2"/><circle cx="' + (x + 14) + '" cy="' + y + '" r="2"/></g>'; }
  function card(x, y, w, h, inner, fill) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="' + (fill || '#fffdf6') + '" ' + ST + ' stroke-width="1.2"/>' + (inner || '');
  }
  function emoji(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#f2cf73" ' + ST + ' stroke-width=".9"/>' +
      '<path d="M' + (x - r * 0.55) + ',' + (y - r * 0.1) + ' q' + (r * 0.22) + ',-' + (r * 0.4) + ' ' + (r * 0.44) + ',0 M' + (x + r * 0.11) + ',' + (y - r * 0.1) + ' q' + (r * 0.22) + ',-' + (r * 0.4) + ' ' + (r * 0.44) + ',0" fill="none" ' + ST + ' stroke-width=".9"/>' +
      '<path d="M' + (x - r * 0.5) + ',' + (y + r * 0.2) + ' q' + (r * 0.5) + ',' + (r * 0.75) + ' ' + r + ',0Z" fill="#8a3d42"/>';
  }
  function crowd(y, n, op) {
    var s = '<g opacity="' + (op || 0.5) + '">', cols = ['#9aa3b5', '#a79aa9', '#8f9fa4', '#a8a08f'];
    for (var i = 0; i < n; i++) {
      var x = 14 + i * (172 / Math.max(1, n - 1)), yy = y + (i % 2 ? 5 : 0);
      s += '<path d="M' + (x - 13) + ',150 V' + (yy + 22) + ' Q' + x + ',' + (yy + 10) + ' ' + (x + 13) + ',' + (yy + 22) + ' V150Z" fill="' + cols[i % 4] + '"/><circle cx="' + x + '" cy="' + yy + '" r="11" fill="' + cols[(i + 1) % 4] + '"/>';
    }
    return s + '</g>';
  }
  function burst(x, y, r, col) {
    var s = '';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4 + 0.3; s += 'M' + (x + Math.cos(a) * r * 0.55).toFixed(1) + ',' + (y + Math.sin(a) * r * 0.55).toFixed(1) + 'L' + (x + Math.cos(a) * r).toFixed(1) + ',' + (y + Math.sin(a) * r).toFixed(1); }
    return '<path d="' + s + '" stroke="' + (col || '#d9a441') + '" stroke-width="2" stroke-linecap="round" fill="none"/>';
  }
  function tray(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-24" y="-7" width="48" height="15" rx="4" fill="#c9d3d6" ' + ST + ' stroke-width="1.1"/><circle cx="-11" cy="0" r="5.4" fill="#f4e3bd" ' + ST + ' stroke-width=".9"/><rect x="1" y="-4.5" width="10" height="8" rx="2" fill="#d99a8b" ' + ST + ' stroke-width=".9"/><circle cx="17" cy="0" r="3.4" fill="#b5cd9c" ' + ST + ' stroke-width=".9"/></g>';
  }
  function paperOn(x, y, rot, kind) {
    var inner = kind === 'red' ? '<path d="M-6,-7l5,5m0,-5l-5,5M-6,2l5,5m0,-5l-5,5" stroke="#cf4d43" stroke-width="1.6" stroke-linecap="round"/><path d="M2,-5h5M2,4h5" stroke="#b9b3c4" stroke-width="1.2" stroke-linecap="round"/>'
      : kind === 'a' ? '<text x="0" y="5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="13" fill="#4f9a78">A</text>'
        : '<path d="M-6,-7h12M-6,-3h12M-6,1h12M-6,5h7" stroke="#b9b3c4" stroke-width="1.2" stroke-linecap="round"/>';
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ')"><rect x="-10" y="-12" width="20" height="24" rx="1.4" fill="#fffdf6" ' + ST + ' stroke-width="1"/>' + inner + '</g>';
  }
  function laptop(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-22" y="-28" width="44" height="29" rx="3" fill="#59607a" ' + ST + ' stroke-width="1.2"/><rect x="-18.5" y="-24.5" width="37" height="22" rx="1.5" fill="#f4f1ea"/><rect x="-14" y="-20" width="20" height="3.4" rx="1.4" fill="#cfc9d8"/><rect x="-14" y="-13" width="28" height="7" rx="1.4" fill="none" stroke="#cfc9d8" stroke-width="1.2" stroke-dasharray="2.4 2"/><path d="M-27,1h54l-3,5h-48z" fill="#737a94" ' + ST + ' stroke-width="1.1"/></g>';
  }
  function smoke(x, y) {
    return '<g fill="#b9b6bd" opacity=".85"><circle cx="' + x + '" cy="' + y + '" r="11"/><circle cx="' + (x + 13) + '" cy="' + (y - 9) + '" r="13"/><circle cx="' + (x + 2) + '" cy="' + (y - 22) + '" r="10"/><circle cx="' + (x + 19) + '" cy="' + (y - 29) + '" r="9"/><circle cx="' + (x + 30) + '" cy="' + (y - 14) + '" r="8"/></g>' +
      '<g fill="#d3d1d6" opacity=".9"><circle cx="' + (x + 3) + '" cy="' + (y - 4) + '" r="6"/><circle cx="' + (x + 15) + '" cy="' + (y - 14) + '" r="7"/><circle cx="' + (x + 6) + '" cy="' + (y - 25) + '" r="5"/></g>';
  }

  /* ---------- scenes: one per scenario ---------- */
  var HA = function (x, y, r, size) { return mark(x, y, 'ha', size || 13, '#c8574f', r); };
  var SCENES = {
    // CONFLICT — hallway taunt: one kid laughing and pointing, the other red-faced and furious
    heated: function () {
      return BG.hall() + crowd(92, 4, 0.3) +
        C(48, 76, { skin: 'c', hair: 'spiky', hc: '#3a2c2e', top: 'hoodie', tc: '#c9806b', ex: 'mock', pose: 'point', look: [1.2, 0] }) +
        C(152, 80, { flip: 1, skin: 'e', hair: 'fade', hc: '#2b2228', top: 'tee', tc: '#7d9cc0', ex: 'angry', pose: 'tense', look: [1.2, 0] }) +
        HA(92, 30, -10) + HA(108, 46, 8, 10);
    },
    // CONFLICT — blamed after the game
    blamed: function () {
      return BG.field() +
        C(48, 74, { skin: 'b', hair: 'swoop', hc: '#8a5a3b', top: 'jersey', tc: '#c9806b', tc2: '#fbf3e4', num: 9, ex: 'shout', pose: 'point', look: [1.2, 0] }) +
        C(152, 82, { flip: 1, skin: 'd', hair: 'pony', hc: '#2f2630', top: 'jersey', tc: '#c9806b', tc2: '#fbf3e4', num: 4, ex: 'stung', pose: 'tense', look: [1, 0.6], tilt: 4 }) +
        burst(100, 30, 12, '#cf8a5a');
    },
    // FRIENDSHIP — a friend has gone quiet; worried kid checks an unanswered message
    quiet: function () {
      return BG.cafe() +
        C(156, 58, { s: 1.15, skin: 'e', hair: 'puffs', hc: '#2b2228', top: 'sweater', tc: '#d9a7b0', tc2: '#f6e7e2', ex: 'pout', pose: 'crossed', tilt: 6 }) +
        card(8, 8, 60, 32, scribble(16, 18, 32) + '<path d="M48,31l3,3l6,-7" fill="none" stroke="#9aa3b5" stroke-width="1.6" stroke-linecap="round"/>') +
        C(72, 80, { s: 1.6, skin: 'b', hair: 'bob', hc: '#5a3d33', top: 'hoodie', tc: '#8fae8b', ex: 'worried', pose: 'phone', item: 'phone', look: [0, 1.4] });
    },
    // FRIENDSHIP — owing an apology
    apology: function () {
      return BG.library() +
        C(50, 80, { flip: 1, skin: 'c', hair: 'curly', hc: '#3a2c2e', top: 'tee', tc: '#e3b85f', ex: 'down', pose: 'hold', item: 'book', tilt: -5, s: 1.45 }) +
        C(148, 78, { flip: 1, skin: 'a', hair: 'wisp', hc: '#b98a52', top: 'jacket', tc: '#7d8fb3', tc2: '#f3ead9', ex: 'regret', pose: 'neck', look: [1.3, 0.4] });
    },
    // PEER PRESSURE — an older kid offers a vape; the other backs off, hand up
    vape: function () {
      return BG.brick() +
        C(44, 72, { s: 1.55, skin: 'b', hair: 'beanie', hc: '#5a3d33', top: 'jacket', tc: '#59607a', tc2: '#d9d3c5', ex: 'smirk', pose: 'offer', item: 'vape', look: [1.2, 0] }) +
        C(160, 86, { s: 1.35, flip: 1, skin: 'd', hair: 'twists', hc: '#2b2228', top: 'hoodie', tc: '#e3b85f', ex: 'uneasy', pose: 'stop', look: [1.2, -0.3] });
    },
    // PEER PRESSURE — dared to sneak off campus
    dare: function () {
      return BG.gate() +
        C(30, 80, { s: 1.15, flip: 1, skin: 'a', hair: 'spiky', hc: '#c79a55', top: 'tee', tc: '#c9806b', ex: 'cheeky', pose: 'point', look: [-1.2, 0] }) +
        C(84, 84, { s: 1.15, skin: 'e', hair: 'afro', hc: '#2b2228', top: 'hoodie', tc: '#8fae8b', ex: 'happy', pose: 'wave' }) +
        C(160, 84, { s: 1.4, flip: 1, skin: 'c', hair: 'long', hc: '#3a2c2e', top: 'sweater', tc: '#a99ac9', tc2: '#efe7f6', ex: 'nervous', pose: 'hug', look: [1.2, 0] });
    },
    // SPEAKING UP — lost on the directions while everyone else works
    directions: function () {
      return BG.classroom() +
        C(40, 82, { s: 1.2, skin: 'd', hair: 'braids', hc: '#2f2630', top: 'collar', tc: '#f3ead9', tc2: '#c9806b', ex: 'neutral', pose: 'write', look: [0.4, 1.6], tilt: 6 }) +
        C(118, 72, { s: 1.6, skin: 'a', hair: 'short', hc: '#6b4a36', top: 'sweater', tc: '#7d9cc0', tc2: '#e8eef6', glasses: 1, ex: 'confused', pose: 'hold', item: 'paper', look: [0, 1.2] }) +
        mark(168, 40, '?', 28, '#5f7fae', 12) + mark(186, 62, '?', 16, '#5f7fae', -8) +
        table(138, '#e4c9a0');
    },
    // SPEAKING UP — talked over in a group
    talkedover: function () {
      return BG.classroom() +
        C(30, 76, { s: 1.2, skin: 'c', hair: 'long', hc: '#2f2630', top: 'tee', tc: '#d9a7b0', ex: 'talk', pose: 'half', look: [1.3, 0] }) +
        C(170, 76, { s: 1.2, flip: 1, skin: 'e', hair: 'fade', hc: '#2b2228', top: 'hoodie', tc: '#e3b85f', ex: 'talk', pose: 'half', look: [1.3, 0] }) +
        bubble(40, 6, 56, 28, 'l', scribble(50, 16, 34)) + bubble(100, 14, 58, 28, 'r', scribble(110, 24, 36, '#c9a9a1')) +
        C(100, 92, { s: 1.4, skin: 'b', hair: 'buns', hc: '#6b4a36', top: 'sweater', tc: '#8fae8b', tc2: '#eaf2e4', ex: 'annoyed', pose: 'down', over: { sweat: 1 } }) +
        table(140, '#e4c9a0');
    },
    // EMPATHY — a wrong answer and laughing classmates
    wronganswer: function () {
      return BG.classroom() +
        C(26, 78, { s: 1.1, skin: 'a', hair: 'spiky', hc: '#3a2c2e', top: 'tee', tc: '#7d9cc0', ex: 'mock', pose: 'point', look: [1.3, 0] }) +
        C(174, 78, { s: 1.1, flip: 1, skin: 'c', hair: 'pony', hc: '#8a5a3b', top: 'hoodie', tc: '#c9806b', ex: 'laugh', pose: 'mouthCover' }) +
        HA(46, 34, -12, 12) + HA(150, 32, 10, 12) +
        C(100, 78, { s: 1.6, skin: 'c', hair: 'hijab', hc: '#a99ac9', top: 'sweater', tc: '#f3ead9', tc2: '#d9a7b0', ex: 'embarrassed', pose: 'hug', tilt: 5 });
    },
    // EMPATHY — a partner crushed by a grade
    badgrade: function () {
      return BG.classroom() +
        C(152, 74, { s: 1.35, flip: 1, skin: 'e', hair: 'curly', hc: '#2b2228', top: 'tee', tc: '#8fae8b', ex: 'caring', pose: 'down', look: [1.3, 0.8] }) +
        C(62, 80, { s: 1.6, skin: 'b', hair: 'swoop', hc: '#2f2630', top: 'hoodie', tc: '#59607a', ex: 'down', pose: 'hairGrab', tilt: 9, drop: 2 }) +
        table(130, '#e4c9a0') + paperOn(98, 141, -10, 'red') + paperOn(160, 142, 8, 'a');
    },
    // BOUNDARIES — a friend grabbing for your phone
    phonegrab: function () {
      return BG.hall() +
        C(44, 80, { s: 1.45, skin: 'a', hair: 'buns', hc: '#c98a6a', top: 'tee', tc: '#e3b85f', ex: 'cheeky', pose: 'reach', look: [1.4, -0.6] }) +
        C(142, 84, { s: 1.45, skin: 'd', hair: 'wavy', hc: '#3a2c2e', top: 'hoodie', tc: '#a99ac9', ex: 'annoyed', pose: 'keepAway', item: 'phone', look: [-1.4, 0] });
    },
    // BOUNDARIES — "use my name"
    nickname: function () {
      return BG.field() +
        C(46, 80, { skin: 'b', hair: 'short', hc: '#c79a55', top: 'hoodie', tc: '#8fae8b', ex: 'smirk', pose: 'shrug', look: [1.2, 0], s: 1.4 }) +
        bubble(64, 8, 48, 26, 'l', mark(88, 27, 'lol', 13, '#8d8799')) +
        C(154, 80, { flip: 1, skin: 'f', hair: 'twists', hc: '#241d22', top: 'collar', tc: '#f3ead9', tc2: '#5d9ea0', ex: 'firm', pose: 'stop', look: [1.2, 0] });
    },
    // DIGITAL — an embarrassing photo spreading in the group chat
    picture: function () {
      return BG.room() +
        card(112, 8, 76, 52, '<rect x="120" y="15" width="60" height="30" rx="4" fill="#d9d3e2"/><circle cx="150" cy="27" r="6.5" fill="#b7b0c6"/><path d="M137,45 q13,-13 26,0Z" fill="#b7b0c6"/><path d="M120,52h34" stroke="#cfc9d8" stroke-width="2.4" stroke-linecap="round"/>') +
        card(126, 66, 62, 24, emoji(140, 78, 7) + emoji(157, 78, 7) + emoji(174, 78, 7)) +
        card(112, 96, 76, 24, '<path d="M124,108h34m-9,-7l9,7l-9,7" fill="none" stroke="#c8574f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' + dots(166, 108, '#c8574f'), '#fdeee9') +
        C(56, 82, { s: 1.6, skin: 'c', hair: 'short', hc: '#2f2630', top: 'hoodie', tc: '#5d9ea0', ex: 'shock', pose: 'phone', item: 'phone', look: [0, 1.4], over: { sweat: 1 } });
    },
    // DIGITAL — "prove you trust me" password request
    password: function () {
      return BG.room() +
        bubble(70, 6, 50, 34, 'l', '<rect x="85" y="21" width="20" height="14" rx="3" fill="#e3b85f" ' + ST + ' stroke-width="1.1"/><path d="M89,21v-4a6,6 0 0 1 12,0v4" fill="none" ' + ST + ' stroke-width="1.6"/><circle cx="95" cy="28" r="2" fill="' + INK + '"/>') +
        C(46, 82, { skin: 'a', hair: 'pony', hc: '#8a5a3b', top: 'sweater', tc: '#d9a7b0', tc2: '#f8ecee', ex: 'plead', pose: 'together', look: [1, 0] }) +
        C(152, 82, { flip: 1, skin: 'e', hair: 'afro', hc: '#2b2228', top: 'tee', tc: '#e3b85f', ex: 'uneasy', pose: 'phone', item: 'phone', look: [1.3, 0], s: 1.4 });
    },
    // BULLYING — mocked at the lunch table
    joke: function () {
      return BG.cafe() +
        C(34, 70, { s: 1.25, skin: 'b', hair: 'spiky', hc: '#6b4a36', top: 'hoodie', tc: '#c9806b', ex: 'laugh', pose: 'point' }) +
        C(178, 72, { s: 1.1, flip: 1, skin: 'c', hair: 'bob', hc: '#2f2630', top: 'tee', tc: '#a99ac9', ex: 'mock', pose: 'mouthCover' }) +
        HA(70, 30, -10) + HA(152, 36, 10, 11) +
        C(116, 80, { s: 1.55, skin: 'a', hair: 'wisp', hc: '#3a2c2e', top: 'sweater', tc: '#7d9cc0', tc2: '#e8eef6', glasses: 1, ex: 'hurt', pose: 'down', tilt: 7, drop: 2, over: { gloom: 1, eyes: 'down' } }) +
        table(132) + tray(116, 142);
    },
    // BULLYING — shut out on purpose; she waves hopefully while others whisper
    leftout: function () {
      return BG.hall() +
        C(150, 62, { s: 1, flip: 1, skin: 'a', hair: 'long', hc: '#c79a55', top: 'tee', tc: '#d9a7b0', ex: 'smirk', pose: 'mouthCover', look: [1.3, 0] }) +
        C(186, 66, { s: 1, flip: 1, skin: 'c', hair: 'short', hc: '#3a2c2e', top: 'hoodie', tc: '#59607a', ex: 'annoyed', pose: 'crossed', look: [1.3, 0] }) +
        dots(112, 42, '#8d8799') +
        C(66, 82, { s: 1.6, skin: 'e', hair: 'braids', hc: '#2b2228', top: 'sweater', tc: '#e3b85f', tc2: '#fbf1d3', ex: 'hopeful', pose: 'wave' });
    },
    // HONESTY — "send me your answers"
    answers: function () {
      return BG.room() +
        bubble(8, 10, 74, 40, 'r', paperOn(30, 30, -6) + '<path d="M46,30h14m-5,-5l5,5l-5,5" fill="none" stroke="#5f7fae" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' + mark(71, 36, '?', 15, '#5f7fae')) +
        C(130, 78, { s: 1.6, flip: 1, skin: 'd', hair: 'bob', hc: '#2b2228', top: 'tee', tc: '#d9a7b0', ex: 'thinking', pose: 'chin', look: [1.4, -0.5] }) +
        table(134, '#c9b79c') + paperOn(48, 143, 12) + '<path d="M72,136l22,8" stroke="' + INK + '" stroke-width="4.6" stroke-linecap="round"/><path d="M72,136l22,8" stroke="#e3b85f" stroke-width="3" stroke-linecap="round"/>';
    },
    // HONESTY — broke something and nobody saw
    broken: function () {
      return BG.lab() +
        C(132, 76, { s: 1.6, skin: 'b', hair: 'puffs', hc: '#3a2c2e', top: 'collar', tc: '#f3ead9', tc2: '#8fae8b', ex: 'scared', pose: 'headHold', look: [-1, 1.2] }) +
        table(128, '#cfc6b3') +
        '<g transform="translate(44 137) rotate(-8)"><rect x="-22" y="-10" width="44" height="22" rx="3" fill="#59607a" ' + ST + ' stroke-width="1.2"/><rect x="-19" y="-7" width="38" height="16" rx="1.5" fill="#d9ecf4"/><path d="M-6,-7l5,7l-7,2l9,7M-1,0l8,-3l4,5" fill="none" ' + ST + ' stroke-width="1.1"/></g>' +
        burst(44, 110, 15, '#d9a441') + mark(76, 114, '!', 22, '#c8574f', 10);
    },
    // TEAMWORK — one person takes over the project
    takeover: function () {
      return BG.library() +
        C(30, 84, { s: 1.15, skin: 'd', hair: 'fade', hc: '#2b2228', top: 'hoodie', tc: '#7d9cc0', ex: 'annoyed', pose: 'crossed', look: [1.3, 0] }) +
        C(172, 86, { s: 1.15, flip: 1, skin: 'a', hair: 'bob', hc: '#c98a6a', top: 'tee', tc: '#8fae8b', ex: 'down', pose: 'down', tilt: 4 }) +
        C(100, 70, { s: 1.5, skin: 'b', hair: 'pony', hc: '#2f2630', top: 'collar', tc: '#f3ead9', tc2: '#c9806b', ex: 'bossy', pose: 'hold', item: 'papers' });
    },
    // TEAMWORK — a teammate's part isn't done
    missingpart: function () {
      return BG.library() +
        bubble(104, 6, 34, 30, 'r', '<circle cx="121" cy="21" r="9" fill="#fffdf6" ' + ST + ' stroke-width="1.3"/><path d="M121,15v6.5l4.5,2.5" fill="none" ' + ST + ' stroke-width="1.5"/>') +
        C(160, 72, { s: 1.3, flip: 1, skin: 'a', hair: 'long', hc: '#6b4a36', top: 'sweater', tc: '#a99ac9', tc2: '#efe7f6', ex: 'annoyed', pose: 'crossed', look: [1.3, 0.3] }) +
        C(60, 76, { s: 1.55, skin: 'e', hair: 'twists', hc: '#241d22', top: 'tee', tc: '#e3b85f', ex: 'overwhelmed', pose: 'headHold' }) +
        table(132, '#d9c3a0') + laptop(60, 144);
    },
    // BIAS — "I'll just call you Sam"
    name: function () {
      return BG.classroom() +
        bubble(58, 6, 60, 28, 'l', mark(88, 26, 'Sam?', 14, '#8d8799')) +
        C(44, 80, { s: 1.4, skin: 'a', hair: 'swoop', hc: '#b98a52', top: 'hoodie', tc: '#c9806b', ex: 'happy', pose: 'shrug', over: { blush: 0 } }) +
        C(152, 80, { flip: 1, skin: 'f', hair: 'twists', hc: '#241d22', top: 'sweater', tc: '#5d9ea0', tc2: '#e3f0ef', ex: 'down', pose: 'down', tilt: 3 });
    },
    // BIAS — lunch from home gets mocked
    food: function () {
      return BG.cafe() +
        C(40, 70, { s: 1.3, skin: 'b', hair: 'short', hc: '#8a5a3b', top: 'tee', tc: '#7d9cc0', ex: 'disgust', pose: 'pinch', tilt: -6 }) +
        table(134) +
        C(136, 62, { s: 1.55, flip: 1, skin: 'c', hair: 'long', hc: '#241d22', top: 'tee', tc: '#d9a7b0', ex: 'embarrassed', pose: 'hold', item: 'lunchbox', tilt: 5 });
    },
    // SAFETY — a friend shares something heavy
    secret: function () {
      return BG.dusk() +
        C(58, 84, { s: 1.5, skin: 'b', hair: 'wavy', hc: '#4a3a52', top: 'hoodie', tc: '#8f96b5', ex: 'down', pose: 'hug', tilt: 8, drop: 3 }) +
        C(146, 78, { s: 1.5, flip: 1, skin: 'd', hair: 'short', hc: '#2b2228', top: 'jacket', tc: '#8fae8b', tc2: '#f3ead9', ex: 'caring', pose: 'comfort', look: [1.3, 0.5] });
    },
    // SAFETY — smoke in the hallway; one kid wants to look, the other stops them
    smoke: function () {
      return BG.hall() + smoke(-6, 58) +
        C(78, 84, { s: 1.4, flip: 1, skin: 'c', hair: 'curly', hc: '#8a5a3b', top: 'tee', tc: '#e3b85f', ex: 'curious', pose: 'point', look: [1.3, -0.8] }) +
        C(158, 80, { s: 1.4, flip: 1, skin: 'a', hair: 'buns', hc: '#2f2630', top: 'hoodie', tc: '#c9806b', ex: 'alarmed', pose: 'stop', look: [1.3, 0] }) +
        mark(186, 34, '!', 22, '#c8574f', 8);
    }
  };

  var DEFS = '<defs><linearGradient id="crGloom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6594" stop-opacity=".5"/><stop offset=".62" stop-color="#5a6594" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="crSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3ec"/><stop offset="1" stop-color="#eef3e4"/></linearGradient>' +
    '<linearGradient id="crDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3bcd6"/><stop offset=".7" stop-color="#f1d9c9"/></linearGradient></defs>';

  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function svg(inner, alt) {
    return '<svg class="art-svg" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(alt || 'Scenario illustration') + '">' + DEFS + inner + '</svg>';
  }
  /* Who is "you" in each hand-drawn scene: the index of that C() call, so the student's own
     character can stand in. null = you are watching and are not in the picture. */
  var ME = { heated: 1, blamed: 1, quiet: 1, apology: 1, vape: 1, dare: 2, directions: 1, talkedover: 2, wronganswer: null, badgrade: 0, phonegrab: 1, nickname: 1, picture: 0, password: 1, joke: null, leftout: null, answers: 0, broken: 0, takeover: 0, missingpart: null, name: null, food: null, secret: 1, smoke: 1 };
  function draw(id, look) {
    REC = { n: 0, me: ME[id], look: look || null, cast: [], bg: 'plain' };
    var out; try { out = { inner: SCENES[id](), cast: REC.cast, bg: REC.bg }; } finally { REC = null; }
    return out;
  }
  var PROBE = {};
  function probe(id) { return PROBE[id] || (PROBE[id] = SCENES[id] ? draw(id) : { cast: [], bg: 'plain' }); }
  function scene(id, alt, look, spec) {
    return svg(spec ? stage(spec, look) : SCENES[id] ? draw(id, look).inner : BG.plain(), alt);
  }

  /* profile avatars reuse the same character parts */
  var AVATARS = [
    { skin: 'e', hair: 'braids', hc: '#2b2228', top: 'sweater', tc: '#e3b85f', tc2: '#fbf1d3', bg: '#dfeee6' },
    { skin: 'b', hair: 'spiky', hc: '#3a2c2e', top: 'hoodie', tc: '#7d9cc0', bg: '#f6e3d3' },
    { skin: 'c', hair: 'bob', hc: '#5a3d33', top: 'tee', tc: '#d9a7b0', bg: '#e6e2f3' },
    { skin: 'a', hair: 'wisp', hc: '#b98a52', top: 'hoodie', tc: '#8fae8b', bg: '#fbefc9', glasses: 1 },
    { skin: 'd', hair: 'fade', hc: '#2b2228', top: 'jacket', tc: '#59607a', tc2: '#f3ead9', bg: '#dbe9ef' },
    { skin: 'c', hair: 'hijab', hc: '#8fb3a6', top: 'sweater', tc: '#f3ead9', tc2: '#d9a7b0', bg: '#f6e0e0' },
    { skin: 'f', hair: 'puffs', hc: '#241d22', top: 'tee', tc: '#a99ac9', bg: '#fbefc9' },
    { skin: 'a', hair: 'buns', hc: '#c98a6a', top: 'collar', tc: '#f3ead9', tc2: '#5d9ea0', bg: '#dfeee6' },
    { skin: 'd', hair: 'curly', hc: '#3a2c2e', top: 'hoodie', tc: '#c9806b', bg: '#e6e2f3' },
    { skin: 'b', hair: 'long', hc: '#2f2630', top: 'sweater', tc: '#5d9ea0', tc2: '#e3f0ef', bg: '#f6e3d3' },
    { skin: 'e', hair: 'twists', hc: '#241d22', top: 'tee', tc: '#8fae8b', bg: '#dbe9ef', glasses: 1 },
    { skin: 'c', hair: 'pony', hc: '#8a5a3b', top: 'jersey', tc: '#c9806b', tc2: '#fbf3e4', bg: '#f6e0e0' }
  ];
  function preset(i) { return AVATARS[((i | 0) % AVATARS.length + AVATARS.length) % AVATARS.length]; }
  function avatar(a, label) {
    if (!a || typeof a !== 'object') a = preset(a);
    return '<svg class="avatar-svg" viewBox="0 0 64 64" role="img" aria-label="' + esc(label || 'Profile picture') + '">' + DEFS +
      '<rect width="64" height="64" fill="' + (a.bg || '#dfeee6') + '"/>' + C(32, 34, Object.assign({ s: 1.12, ex: 'smile' }, pick(a))) + '</svg>';
  }
  /* a bigger, waving version for the character maker */
  function portrait(a, label) {
    if (!a || typeof a !== 'object') a = preset(a);
    return '<svg class="avatar-svg" viewBox="0 0 120 120" role="img" aria-label="' + esc(label || 'Your character') + '">' + DEFS +
      '<rect width="120" height="120" fill="' + (a.bg || '#dfeee6') + '"/><g fill="none" stroke="#fff" stroke-width="1.6" opacity=".55"><circle cx="60" cy="60" r="34"/><circle cx="60" cy="60" r="50"/><circle cx="60" cy="60" r="66"/></g>' +
      C(60, 56, Object.assign({ s: 1.75, ex: 'happy', pose: 'wave' }, pick(a))) + '</svg>';
  }
  var OPTIONS = {
    skin: ['a', 'b', 'c', 'd', 'e', 'f'], skinHex: SKIN,
    hair: [['short', 'Short'], ['swoop', 'Swoop'], ['wisp', 'Fringe'], ['spiky', 'Spiky'], ['fade', 'Fade'], ['bob', 'Bob'], ['long', 'Long'], ['wavy', 'Wavy'], ['pony', 'Ponytail'], ['buns', 'Buns'], ['puffs', 'Puffs'], ['braids', 'Braids'], ['twists', 'Twists'], ['afro', 'Afro'], ['curly', 'Curly'], ['beanie', 'Beanie'], ['hijab', 'Hijab']],
    hc: ['#241d22', '#3a2c2e', '#5a3d33', '#8a5a3b', '#b98a52', '#e0c27a', '#c9603e', '#9a9aa6', '#8fb3a6', '#a99ac9', '#d9a7b0', '#59607a'],
    top: [['tee', 'T-shirt'], ['hoodie', 'Hoodie'], ['sweater', 'Sweater'], ['collar', 'Collared shirt'], ['jacket', 'Jacket'], ['jersey', 'Jersey']],
    tc: ['#7d9cc0', '#8fae8b', '#c9806b', '#e3b85f', '#a99ac9', '#d9a7b0', '#5d9ea0', '#59607a', '#f3ead9', '#cf6a6a'],
    bg: ['#dfeee6', '#f6e3d3', '#e6e2f3', '#fbefc9', '#dbe9ef', '#f6e0e0']
  };

  /* ---------- the cast for staged pictures ---------- */
  var ADULTS = {
    teacher: { skin: 'c', hair: 'bob', hc: '#4a3a35', top: 'collar', tc: '#6f8fb0', tc2: '#f3ead9', glasses: 1 },
    coach: { skin: 'd', hair: 'fade', hc: '#2b2228', top: 'jacket', tc: '#c9806b', tc2: '#f3ead9' },
    mom: { skin: 'b', hair: 'wavy', hc: '#5a3d33', top: 'sweater', tc: '#b98fb0', tc2: '#f1e3ee' },
    dad: { skin: 'b', hair: 'short', hc: '#3a2c2e', top: 'collar', tc: '#8fae8b', tc2: '#f3ead9' },
    grandma: { skin: 'c', hair: 'curly', hc: '#c9c5cc', top: 'sweater', tc: '#d9a7b0', tc2: '#f8ecee', glasses: 1 },
    pastor: { skin: 'e', hair: 'fade', hc: '#3a3336', top: 'collar', tc: '#59607a', tc2: '#f3ead9' },
    leader: { skin: 'a', hair: 'pony', hc: '#8a5a3b', top: 'hoodie', tc: '#5d9ea0' },
    counselor: { skin: 'f', hair: 'afro', hc: '#241d22', top: 'jacket', tc: '#a99ac9', tc2: '#f3ead9', glasses: 1 }
  };
  function npc(who, look) {
    if (ADULTS[who]) {
      var a = Object.assign({ adult: 1 }, ADULTS[who]);
      if (look && /^(mom|dad|grandma)$/.test(who)) a.skin = look.skin;   // family looks like family
      return a;
    }
    var i = (parseInt(String(who).slice(1), 10) || 1) - 1, k = preset(i);
    if (look && k.skin === look.skin && k.hair === look.hair) k = preset(i + 5);   // no accidental twins
    return k;
  }
  var DEF_LOOK = AVATARS[1];
  function fig(x, y, s, look, f, o) {
    return C(x, y, Object.assign({ s: s, look: [1.2, 0] }, pick(look), { ex: f[0], pose: f[1], item: f[2] }, o || {}));
  }
  function grown(x, y, s, n, f, o) { return fig(x, n.adult ? y - 8 : y, n.adult ? s * 1.15 : s, n, f, Object.assign({ flip: 1 }, o || {})); }
  function heart(x, y, k) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + (k || 1) + ')" d="M0,4 C-7,-5 -15,3 0,14 C15,3 7,-5 0,4Z" fill="#e58a9a" ' + ST + ' stroke-width="1.1"/>'; }
  function storm(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-15,4 a8,8 0 0 1 6,-12 a10,10 0 0 1 18,0 a8,8 0 0 1 6,12z" fill="#8d8799" ' + ST + ' stroke-width="1.1"/><path d="M1,5 l-5,9 h6 l-4,9" fill="none" stroke="#e3b85f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }
  function rays() { return '<g fill="#fff3bf" opacity=".5"><path d="M100,-12 L34,150 H76Z"/><path d="M100,-12 L124,150 H170Z"/><path d="M100,-12 L92,150 H108Z"/></g>'; }
  function sparkle(x, y, k, col) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + k + ')" d="M0,-9 C1,-3 3,-1 9,0 C3,1 1,3 0,9 C-1,3 -3,1 -9,0 C-3,-1 -1,-3 0,-9Z" fill="' + (col || '#f0b93a') + '" stroke="#fffdf6" stroke-width="1.2"/>'; }
  var EXTRA = {
    ha: function (n) { return HA(n ? 92 : 134, 30, -10) + HA(n ? 110 : 152, 46, 8, 10); },
    '?': function (n) { var x = n ? 100 : 142; return mark(x, 40, '?', 28, '#5f7fae', 10) + mark(x + 18, 60, '?', 16, '#5f7fae', -8); },
    '!': function (n) { return mark(n ? 100 : 146, 42, '!', 30, '#c8574f', 8); },
    dots: function (n) { return dots(n ? 93 : 136, 42, '#8d8799'); },
    table: function () { return table(134, '#e4c9a0'); },
    heart: function (n) { return heart(n ? 100 : 144, 26, 1.3); },
    storm: function (n) { return storm(n ? 100 : 146, 30); },
    light: function () { return ''; },
    chat: function (n) { var x = n ? 72 : 120; return card(x, 8, 56, 20, scribble(x + 8, 15, 30)) + card(x + 12, 32, 50, 20, scribble(x + 20, 39, 24, '#c9a9a1'), '#fdeee9'); }
  };
  /* a scenario picture described as data: { bg, me: [expression, pose, item], them: [[who, expression, pose, item]], extra } */
  function stage(spec, look) {
    var me = look || DEF_LOOK, them = spec.them || [], n = them.length, x = spec.extra;
    var s = (BG[spec.bg] || BG.plain)() + (x === 'light' ? rays() : '');
    if (n > 1) s += grown(128, 74, 1.2, npc(them[0][0], look), them[0].slice(1)) + grown(174, 78, 1.2, npc(them[1][0], look), them[1].slice(1)) + fig(46, 84, 1.45, me, spec.me);
    else if (n) s += grown(146, 80, 1.5, npc(them[0][0], look), them[0].slice(1)) + fig(56, 82, 1.5, me, spec.me);
    else s += fig(x && x !== 'light' && x !== 'table' ? 72 : 100, 80, 1.6, me, spec.me);
    return s + (x && EXTRA[x] ? EXTRA[x](n) : '');
  }

  /* ---------- a picture for every choice (the cause) and for what could happen (the effect) ---------- */
  var SHUT = { eyes: 'shut', mouth: 'smallsmile' };
  var ACTS = {
    calm: { me: ['firm', 'stop'], them: ['confused', 'down'], bub: 'line', good: ['smile', 'neutral'] },
    yell: { me: ['shout', 'fists'], them: ['angry', 'tense'], bub: 'jag', mid: ['annoyed', 'annoyed'], bad: ['regret', 'shout'] },
    ask: { me: ['talk', 'half'], them: ['neutral', 'down'], bub: '?' },
    kind: { me: ['smile', 'wave'], them: ['hopeful', 'down'], bub: 'heart', good: ['happy', 'happy'] },
    refuse: { me: ['firm', 'stop'], them: ['annoyed', 'shrug'], bub: 'no', good: ['smile', 'neutral'] },
    honest: { me: ['regret', 'neck'], them: ['neutral', 'down'], bub: 'check' },
    lie: { me: ['nervous', 'shrug'], them: ['confused', 'crossed'], bub: 'scrib', bad: ['worried', 'annoyed'] },
    tell: { me: ['talk', 'half'], them: ['caring', 'down'], bub: 'line', adult: 1, good: ['hopeful', 'caring'], mid: ['uneasy', 'caring'], bad: ['worried', 'caring'] },
    joke: { me: ['laugh', 'point'], them: ['hurt', 'down'], bub: 'ha' },
    walk: { me: ['neutral', 'down'], them: ['confused', 'shrug'], away: 1, good: ['smile', 'neutral'] },
    silent: { me: ['pout', 'crossed'], them: ['neutral', 'down'], bub: 'dots', mid: ['down', 'neutral'], bad: ['down', 'sad'] },
    ignore: { me: ['neutral', 'hip'], them: ['sad', 'wave'], look: [-1.4, 0], bad: ['uneasy', 'hurt'] },
    hide: { me: ['scared', 'faceHide'], them: ['curious', 'down'], bad: ['worried', 'annoyed'] },
    giveIn: { me: ['uneasy', 'reach'], them: ['smirk', 'offer'], mid: ['uneasy', 'smirk'], bad: ['regret', 'smirk'] },
    help: { me: ['caring', 'comfort'], them: ['sad', 'hug'], bub: 'heart', good: ['smile', 'hopeful'] },
    breathe: { me: ['neutral', 'together'], over: SHUT, solo: 1, bub: 'breath' },
    think: { me: ['thinking', 'chin'], solo: 1, bub: 'think' },
    phone: { me: ['neutral', 'phone', 'phone'], solo: 1, bub: 'msg', look: [0, 1.4] },
    post: { me: ['cheeky', 'phone', 'phone'], solo: 1, bub: 'send', look: [0, 1.4] },
    block: { me: ['firm', 'phone', 'phone'], solo: 1, bub: 'shield', look: [0, 1.4] },
    pray: { me: ['neutral', 'together'], over: SHUT, solo: 1, pre: 1 },
    write: { me: ['thinking', 'write'], solo: 1, desk: 1, look: [0, 1.5] },
    worry: { me: ['overwhelmed', 'headHold'], solo: 1, bub: 'storm' },
    grab: { me: ['angry', 'reach'], them: ['shock', 'keepAway'], bub: '!', bad: ['regret', 'angry'] },
    share: { me: ['smile', 'offer'], them: ['happy', 'down'], good: ['happy', 'happy'] },
    read: { me: ['neutral', 'hold', 'book'], solo: 1, look: [0, 1.4] }
  };
  function bub(mx, inner, fill) { return bubble(mx + 10, 5, 46, 27, 'l', inner, fill); }
  var BUB = {
    line: function (mx) { return bub(mx, scribble(mx + 19, 15, 28)); },
    '?': function (mx) { return bub(mx, mark(mx + 33, 26, '?', 19, '#5f7fae')); },
    heart: function (mx) { return bub(mx, heart(mx + 33, 11, 0.95)); },
    no: function (mx) { return bub(mx, '<path d="M' + (mx + 26) + ',11 l14,14 m0,-14 l-14,14" fill="none" stroke="#c8574f" stroke-width="3.4" stroke-linecap="round"/>'); },
    check: function (mx) { return bub(mx, '<path d="M' + (mx + 24) + ',19 l6,6 l12,-13" fill="none" stroke="#4f9a78" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'); },
    scrib: function (mx) { return bub(mx, '<path d="M' + (mx + 19) + ',15 q4,-6 8,0 t8,0 t8,0 M' + (mx + 19) + ',23 q4,-6 8,0 t8,0" fill="none" stroke="#b7b0c2" stroke-width="2.2" stroke-linecap="round"/>'); },
    dots: function (mx) { return bub(mx, dots(mx + 26, 19, '#8d8799')); },
    jag: function (mx) {
      var cx = mx + 36, cy = 20, d = '';
      for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, r = i % 2 ? 13 : 23; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r * 1.2).toFixed(1) + ',' + (cy + Math.sin(a) * r * 0.82).toFixed(1); }
      return '<path d="' + d + 'Z" fill="#fffdf6" ' + ST + ' stroke-width="1.2"/>' + mark(cx, 27, '!!', 17, '#c8574f');
    },
    ha: function (mx) { return HA(mx + 32, 22, -10) + HA(mx + 50, 38, 8, 10); },
    '!': function (mx) { return mark(mx + 40, 34, '!', 28, '#c8574f', 8); },
    think: function (mx) { return blob([[mx + 30, 16, 9], [mx + 42, 12, 10], [mx + 54, 17, 9], [mx + 42, 22, 9]], '#fffdf6', 2) + '<circle cx="' + (mx + 20) + '" cy="32" r="3" fill="#fffdf6" ' + ST + ' stroke-width="1"/>' + mark(mx + 42, 23, '?', 15, '#5f7fae'); },
    breath: function (mx) { return '<g fill="none" stroke="#7fb7c9" stroke-width="2.4" stroke-linecap="round"><path d="M' + (mx + 16) + ',66 q10,-4 16,2 q6,6 14,0"/><path d="M' + (mx + 20) + ',76 q8,-3 13,2 q5,4 11,0" opacity=".7"/></g>'; },
    msg: function (mx) { return card(mx + 22, 8, 44, 20, scribble(mx + 30, 15, 26)); },
    send: function (mx) { return card(mx + 22, 8, 44, 22, '<path d="M' + (mx + 32) + ',19 h22 m-8,-7 l8,7 l-8,7" fill="none" stroke="#c8574f" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>', '#fdeee9'); },
    shield: function (mx) { return '<path d="M' + (mx + 44) + ',6 l13,5 v9 q0,10 -13,15 q-13,-5 -13,-15 v-9z" fill="#dff1e6" ' + ST + ' stroke-width="1.2"/><path d="M' + (mx + 38) + ',20 l5,5 l8,-9" fill="none" stroke="#4f9a78" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'; },
    storm: function (mx) { return storm(mx + 40, 22); }
  };
  function veil(s, a) { return (BG[bgOf(s)] || BG.plain)() + '<rect width="200" height="150" fill="#fffdf6" opacity="' + a + '"/>'; }
  function bgOf(s) { return s.scene ? s.scene.bg : probe(s.id).bg; }
  function castOf(s, look) { return s.scene ? (s.scene.them || []).map(function (t) { return npc(t[0], look); }) : probe(s.id).cast.map(pick); }
  /* who shares the picture with you: the scenario's adult, a named person, or nobody */
  function partner(s, c, a, look, effect) {
    if (c.to === 'solo') return null;
    if (a.adult || c.to === 'adult') return npc(s.adult || 'teacher', look);
    if (a.solo && c.to == null && !effect) return null;
    var cast = castOf(s, look);
    return cast[c.to | 0] || cast[0] || (s.foil ? npc(s.foil, look) : null);
  }
  function choicePic(s, c, look, alt) {
    var a = ACTS[c.act] || ACTS.calm, o = partner(s, c, a, look), me = look || DEF_LOOK, mx = o ? 56 : 92;
    var inner = veil(s, 0.3) + (a.pre ? rays() : '');
    if (o) inner += grown(146, 80, 1.5, o, a.them || ['neutral', 'down']);
    if (a.away) inner += '<path d="M76,66h15M80,80h13M76,94h15" fill="none" stroke="#8d8799" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>' + fig(46, 82, 1.5, me, a.me, { flip: 1 });
    else inner += fig(mx, 82, 1.5, me, a.me, { over: a.over, look: a.look || [o ? 1.2 : 0, 0] });
    if (a.desk) inner += table(134, '#e4c9a0') + paperOn(mx + 4, 143, -6);
    if (a.bub) inner += BUB[a.bub](mx);
    return svg(inner, alt || 'A picture of this choice');
  }
  var FX = {
    strong: { ex: ['smile', 'smile'], pose: 'down', col: '#3fbf8f', key: 'good' },
    mixed: { ex: ['thinking', 'neutral'], pose: 'neck', col: '#e0a63a', key: 'mid' },
    risky: { ex: ['regret', 'hurt'], pose: 'down', col: '#e2755f', key: 'bad' }
  };
  function effectPic(s, c, look, alt) {
    var a = ACTS[c.act] || ACTS.calm, f = FX[c.kind] || FX.mixed, ex = a[f.key] || f.ex, o = partner(s, c, a, look, true), me = look || DEF_LOOK, mx = o ? 56 : 100;
    var inner = veil(s, 0.42) + '<g fill="none" stroke="' + f.col + '" stroke-linecap="round"' + (c.kind === 'risky' ? ' stroke-dasharray="8 7"' : '') + '>';
    for (var i = 1; i <= 5; i++) inner += '<circle cx="100" cy="96" r="' + (i * 23) + '" stroke-width="' + (3.4 - i * 0.4).toFixed(1) + '" opacity="' + (0.8 - i * 0.12).toFixed(2) + '"/>';
    inner += '</g>';
    if (o) inner += grown(146, 80, 1.5, o, [ex[1], /angry|shout|annoyed/.test(ex[1]) ? 'crossed' : /hurt|sad/.test(ex[1]) ? 'hug' : 'down'], /hurt|sad/.test(ex[1]) ? { tilt: 5, look: [0.4, 1] } : null);
    inner += fig(mx, 82, 1.5, me, [ex[0], c.kind === 'strong' && o ? 'half' : f.pose], c.kind === 'risky' ? { tilt: -4, look: [0.6, 1] } : null);
    if (c.kind === 'strong') inner += sparkle(100, 28, 1.25) + sparkle(118, 44, 0.7) + sparkle(84, 46, 0.6, '#59c9a0');
    else if (c.kind === 'mixed') inner += mark(100, 42, '?', 28, '#c98a1e', 8);
    else inner += storm(100, 30);
    return svg(inner, alt || 'A picture of what could happen');
  }

  global.CRArt = { scene: scene, avatar: avatar, portrait: portrait, choicePic: choicePic, effectPic: effectPic, preset: function (i) { return Object.assign({}, preset(i)); },
    options: OPTIONS, acts: Object.keys(ACTS), avatarCount: AVATARS.length, ids: Object.keys(SCENES) };
})(window);
