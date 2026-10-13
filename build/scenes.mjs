/* ------------------------------------------------------------------
   CAPABILITY SCENES
   Four technical illustrations for the Capabilities page, drawn in the
   same language as the home sequence: dark drafting board, fine grid,
   light-gray subjects modeled with gradients, no photography.

     build      a building in progress under a tower crane
     grounds    striped lawn, trees, walkway, a ride-on mower
     equipment  a tracked excavator working a spoil pile
     bus        a coach bus at a stop

   Every id is prefixed with the scene name, so several scenes can sit
   inline on one page without gradient collisions.
------------------------------------------------------------------- */

const W = 560, H = 340, GY = 262;   // artboard and ground line
const f = (n) => Math.round(n * 10) / 10;
const rect = (x, y, w, h, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, w = 1, extra = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;
const circle = (cx, cy, r, fill, extra = '') => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;

/* Shared board: gradient field, drafting grid, ground band */
function board(p, { ground = '#141417', groundTop = '#3A3B42' } = {}) {
  let grid = '';
  for (let x = 20; x < W; x += 20) grid += line(x, 0, x, GY, '#FFFFFF', 0.6, 'opacity=".035"');
  for (let y = 20; y < GY; y += 20) grid += line(0, y, W, y, '#FFFFFF', 0.6, 'opacity=".035"');
  return `${rect(0, 0, W, H, `url(#${p}-bg)`)}${grid}
    ${rect(0, GY, W, H - GY, ground)}${line(0, GY, W, GY, groundTop, 1.2)}`;
}
const boardDefs = (p) => lin(`${p}-bg`, [[0, '#1C1C21'], [1, '#0E0E11']]) +
  `<radialGradient id="${p}-glow" cx=".5" cy=".55" r=".55"><stop offset="0" stop-color="#F3F4F6" stop-opacity=".07"/><stop offset="1" stop-color="#F3F4F6" stop-opacity="0"/></radialGradient>`;

const svg = (p, label, defs, body) =>
  `<svg class="scene__art" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}" focusable="false"><defs>${boardDefs(p)}${defs}</defs>${body}</svg>`;

/* ==================================================================
   1. BUILDING IN PROGRESS
================================================================== */
function build() {
  const p = 'sb';
  const X0 = 176, X1 = 336, FH = 34, top = GY - 5 * FH;   // 5 floors
  const levels = [0, 1, 2, 3, 4, 5].map((i) => GY - i * FH);
  let s = board(p);
  s += `<ellipse cx="300" cy="200" rx="260" ry="150" fill="url(#${p}-glow)"/>`;

  /* Clad floors (1-3) with glazing, mullions and slab bands */
  s += rect(X0, levels[3], X1 - X0, GY - levels[3], `url(#${p}-glass)`);
  for (let x = X0 + 16; x < X1; x += 16) s += line(x, levels[3], x, GY, '#1D2027', 1.3);
  [1, 2, 3].forEach((i) => { s += rect(X0 - 2, levels[i] - 3, X1 - X0 + 4, 5, '#A3A5AD'); });
  s += rect(X0 + 56, GY - 26, 48, 26, '#2B2F37') + line(X0 + 80, GY - 26, X0 + 80, GY, '#5A5F6B', 1);
  s += rect(X0 + 50, GY - 30, 60, 4, '#C9CBD1');                     // entry canopy

  /* Floor 4: cladding half done */
  s += rect(X0, levels[4], 64, FH, `url(#${p}-glass)`);
  for (let x = X0 + 16; x < X0 + 64; x += 16) s += line(x, levels[4], x, levels[3], '#1D2027', 1.3);

  /* Bare steel above: columns, beams, one braced bay */
  for (let x = X0; x <= X1; x += 40) s += rect(x - 2, top, 4, levels[3] - top, `url(#${p}-steel)`);
  [4, 5].forEach((i) => { s += rect(X0 - 2, levels[i] - 3, X1 - X0 + 4, 5, '#C9CBD1'); });
  s += line(X1 - 80, levels[4], X1 - 40, levels[5], '#8A8C94', 1.2) + line(X1 - 80, levels[5], X1 - 40, levels[4], '#8A8C94', 1.2);
  s += line(X1 - 80, levels[3], X1 - 40, levels[4], '#6B6D75', 1) + line(X1 - 80, levels[4], X1 - 40, levels[3], '#6B6D75', 1);

  /* Scaffold on the left face */
  const SX0 = X0 - 34, SX1 = X0 - 8;
  [SX0, SX1].forEach((x) => { s += line(x, levels[4] - 10, x, GY, '#8A8C94', 1.6); });
  for (let y = GY - 22; y > levels[4] - 6; y -= 22) {
    s += line(SX0, y, SX1 + 8, y, '#8A8C94', 1.4) + rect(SX0 - 2, y - 3, SX1 - SX0 + 12, 3, '#5A5C64');
    s += line(SX0, y, SX1, y + 22, '#55575F', 0.9);
  }

  /* Tower crane: lattice mast, jib, counter-jib, pendants, cab */
  const MX = 412, JY = 44;
  s += rect(MX - 22, GY - 8, 44, 8, '#3A3B42');
  s += line(MX - 7, GY - 8, MX - 7, JY, '#C9CBD1', 1.6) + line(MX + 7, GY - 8, MX + 7, JY, '#C9CBD1', 1.6);
  for (let y = GY - 8, k = 0; y > JY; y -= 14, k++) s += line(MX - 7, y, MX + 7, y - 14, '#8A8C94', 0.9) + line(MX - 7, y, MX + 7, y, '#6B6D75', 0.7);
  const JX0 = 214, JX1 = 516;
  s += line(JX0, JY, JX1, JY, '#E4E5E9', 1.6) + line(JX0 + 6, JY + 9, MX + 7, JY + 9, '#C9CBD1', 1.3) + line(MX + 7, JY + 9, JX1, JY + 9, '#C9CBD1', 1.3);
  for (let x = JX0 + 6; x < JX1 - 8; x += 14) s += line(x, JY + 9, x + 7, JY, '#8A8C94', 0.8) + line(x + 7, JY, x + 14, JY + 9, '#8A8C94', 0.8);
  s += `<path d="M${MX - 7} ${JY} L${MX} ${JY - 30} L${MX + 7} ${JY}" fill="none" stroke="#C9CBD1" stroke-width="1.4"/>`;
  s += line(MX, JY - 30, JX0 + 40, JY, '#9A9CA4', 0.9) + line(MX, JY - 30, JX1 - 10, JY, '#9A9CA4', 0.9);
  s += rect(JX1 - 44, JY + 10, 36, 20, `url(#${p}-weight)`);
  s += rect(MX + 8, JY + 10, 18, 16, '#2B2F37', 'stroke="#C9CBD1" stroke-width="1"') + rect(MX + 11, JY + 13, 12, 7, `url(#${p}-glass)`);

  /* Trolley, hoist line, and a beam on its way up */
  const TX = 262;
  s += rect(TX - 7, JY + 9, 14, 6, '#E4E5E9');
  s += line(TX, JY + 15, TX, 58, '#C9CBD1', 0.9);
  s += `<path d="M${TX} 58 l-4 6 a4 4 0 1 0 8 0 z" fill="#E4E5E9"/>`;
  s += line(TX, 66, TX - 26, 74, '#9A9CA4', 0.8) + line(TX, 66, TX + 26, 74, '#9A9CA4', 0.8);
  s += rect(TX - 36, 74, 72, 6, `url(#${p}-steel)`) + rect(TX - 36, 74, 72, 1.5, '#F3F4F6');

  /* Site trailer and cones */
  s += rect(452, GY - 30, 84, 30, `url(#${p}-trailer)`, 'rx="2"');
  for (let x = 462; x < 530; x += 22) s += rect(x, GY - 22, 14, 9, '#1D2027', 'stroke="#6B6D75" stroke-width=".8"');
  s += rect(448, GY - 32, 92, 3, '#8A8C94');
  [[90, 'a'], [114, 'b']].forEach(([x]) => { s += `<path d="M${x - 7} ${GY} L${x} ${GY - 18} L${x + 7} ${GY} Z" fill="#C9CBD1"/>` + rect(x - 4, GY - 11, 8, 3, '#5A5C64'); });

  const defs = lin(`${p}-glass`, [[0, '#5A606C'], [0.45, '#353A44'], [1, '#22252C']], 1, 1) +
    lin(`${p}-steel`, [[0, '#D9DADF'], [1, '#8A8C94']]) +
    lin(`${p}-weight`, [[0, '#4A4B52'], [1, '#2B2C31']]) +
    lin(`${p}-trailer`, [[0, '#C9CBD1'], [1, '#8A8C94']]);
  return svg(p, 'Illustration: a mid-rise building under construction beside a tower crane', defs, s);
}

/* ==================================================================
   2. GROUNDS AND VEGETATION
================================================================== */
function grounds() {
  const p = 'sg';
  let s = `${rect(0, 0, W, H, `url(#${p}-bg)`)}`;
  for (let x = 20; x < W; x += 20) s += line(x, 0, x, 170, '#FFFFFF', 0.6, 'opacity=".035"');
  for (let y = 20; y < 170; y += 20) s += line(0, y, W, y, '#FFFFFF', 0.6, 'opacity=".035"');

  /* Distant tree line */
  let ridge = 'M0 176';
  for (let x = 0; x <= W; x += 28) ridge += ` Q${x + 14} ${150 + ((x * 7) % 19)} ${x + 28} 172`;
  s += `<path d="${ridge} L${W} 200 L0 200 Z" fill="#1E1F24"/>`;

  /* Lawn with mowing stripes */
  s += `<path id="${p}-lawn-shape" d="M0 188 Q280 172 ${W} 186 L${W} ${H} L0 ${H} Z" fill="url(#${p}-lawn)"/>`;
  let stripes = '';
  for (let k = -12; k < 20; k += 2) stripes += `<path d="M${k * 40} ${H} L${k * 40 + 160} 170 L${k * 40 + 200} 170 L${k * 40 + 40} ${H} Z" fill="#F3F4F6" opacity=".045"/>`;
  s += `<g clip-path="url(#${p}-clip)">${stripes}</g>`;

  /* Walkway: a curved ribbon with edging */
  s += `<path d="M-10 ${H} C120 300 190 238 320 224 S520 206 ${W + 10} 202 L${W + 10} 216 C470 220 400 230 330 240 S150 312 60 ${H} Z" fill="url(#${p}-path)"/>`;
  s += `<path d="M-10 ${H} C120 300 190 238 320 224 S520 206 ${W + 10} 202" fill="none" stroke="#8A8C94" stroke-width="1"/>`;
  s += `<path d="M60 ${H} C150 312 260 248 330 240 S470 220 ${W + 10} 216" fill="none" stroke="#6B6D75" stroke-width="1"/>`;

  /* Trees: layered crowns with a lit side */
  const tree = (x, y, r) => `<g>
    ${rect(x - 3, y - r * 0.2, 6, r * 1.3, '#4A4B52')}
    <ellipse cx="${x}" cy="${y + r * 1.1}" rx="${r * 1.1}" ry="${r * 0.22}" fill="#000" opacity=".35"/>
    ${circle(x - r * 0.45, y - r * 0.2, r * 0.7, `url(#${p}-crown)`)}
    ${circle(x + r * 0.45, y - r * 0.15, r * 0.66, `url(#${p}-crown)`)}
    ${circle(x, y - r * 0.6, r * 0.78, `url(#${p}-crown)`)}
    ${circle(x - r * 0.2, y - r * 0.85, r * 0.32, '#F3F4F6', 'opacity=".06"')}
  </g>`;
  const pine = (x, y, h) => `<g>${rect(x - 2, y - 8, 4, 10, '#4A4B52')}
    <path d="M${x} ${y - h} L${x + h * 0.32} ${y - h * 0.45} L${x + h * 0.2} ${y - h * 0.45} L${x + h * 0.42} ${y - 6} L${x - h * 0.42} ${y - 6} L${x - h * 0.2} ${y - h * 0.45} L${x - h * 0.32} ${y - h * 0.45} Z" fill="url(#${p}-crown)"/></g>`;
  s += pine(64, 192, 70) + tree(140, 168, 34) + pine(488, 190, 64) + tree(420, 160, 40) + tree(530, 176, 22);

  /* Shrub row along the walk */
  [[250, 222], [276, 219], [302, 216], [372, 210], [398, 208]].forEach(([x, y]) => {
    s += `<ellipse cx="${x}" cy="${y}" rx="15" ry="10" fill="url(#${p}-crown)"/><ellipse cx="${x - 4}" cy="${y - 4}" rx="6" ry="3" fill="#F3F4F6" opacity=".06"/>`;
  });

  /* Ride-on mower, with a fresh stripe behind it */
  const MX = 200, MY = 300;
  s += `<path d="M${MX - 160} ${MY + 18} L${MX - 20} ${MY - 4} L${MX + 4} ${MY + 16} L${MX - 130} ${H} Z" fill="#F3F4F6" opacity=".05"/>`;
  s += `<ellipse cx="${MX + 22}" cy="${MY + 20}" rx="54" ry="6" fill="#000" opacity=".4"/>`;
  s += rect(MX - 10, MY + 4, 66, 9, '#3A3B42', 'rx="3"');                                  // deck
  s += `<path d="M${MX - 18} ${MY + 4} L${MX - 14} ${MY - 18} L${MX + 34} ${MY - 22} L${MX + 60} ${MY - 8} L${MX + 62} ${MY + 4} Z" fill="url(#${p}-body)"/>`;
  s += rect(MX - 8, MY - 38, 22, 20, '#2B2C31', 'rx="4"') + rect(MX - 10, MY - 22, 30, 5, '#2B2C31', 'rx="2"'); // seat
  s += line(MX + 30, MY - 22, MX + 24, MY - 42, '#8A8C94', 2) + line(MX + 16, MY - 44, MX + 32, MY - 40, '#C9CBD1', 2.4);
  s += circle(MX - 8, MY + 10, 13, '#121214') + circle(MX - 8, MY + 10, 6, '#8A8C94') + circle(MX + 52, MY + 13, 9, '#121214') + circle(MX + 52, MY + 13, 4, '#8A8C94');

  const defs = lin(`${p}-lawn`, [[0, '#2A2C31'], [1, '#18191C']]) +
    lin(`${p}-path`, [[0, '#4A4B52'], [1, '#34353B']]) +
    `<radialGradient id="${p}-crown" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6E717A"/><stop offset="1" stop-color="#2C2E33"/></radialGradient>` +
    lin(`${p}-body`, [[0, '#E4E5E9'], [1, '#9A9CA4']]) +
    `<clipPath id="${p}-clip"><path d="M0 188 Q280 172 ${W} 186 L${W} ${H} L0 ${H} Z"/></clipPath>`;
  return svg(p, 'Illustration: maintained grounds with striped lawn, trees, a walkway and a ride-on mower', defs, s);
}

/* ==================================================================
   3. HEAVY EQUIPMENT: TRACKED EXCAVATOR
================================================================== */
function equipment() {
  const p = 'se';
  let s = board(p);
  s += `<ellipse cx="270" cy="190" rx="250" ry="140" fill="url(#${p}-glow)"/>`;

  /* Spoil pile with texture */
  s += `<path d="M380 ${GY} C410 214 470 196 520 206 C545 212 560 230 ${W} 240 L${W} ${GY} Z" fill="url(#${p}-dirt)"/>`;
  for (let i = 0; i < 26; i++) s += circle(400 + ((i * 37) % 150), GY - 6 - ((i * 13) % 40), 1.4, '#8A8C94', 'opacity=".35"');

  /* Tracks: frame, pads, rollers, sprocket and idler */
  s += `<ellipse cx="226" cy="${GY + 6}" rx="130" ry="7" fill="#000" opacity=".45"/>`;
  s += rect(104, 222, 246, 40, '#1C1D21', 'rx="20" stroke="#6B6D75" stroke-width="1.4"');
  s += rect(108, 226, 238, 32, 'none', 'rx="16" stroke="#3A3B42" stroke-width="3" stroke-dasharray="5 4"');
  s += circle(126, 242, 15, '#2B2C31', 'stroke="#9A9CA4" stroke-width="1.4"') + circle(126, 242, 5, '#8A8C94');
  s += circle(328, 242, 15, '#2B2C31', 'stroke="#9A9CA4" stroke-width="1.4"') + circle(328, 242, 5, '#8A8C94');
  for (let x = 160; x < 300; x += 28) s += circle(x, 248, 8, '#2B2C31', 'stroke="#6B6D75" stroke-width="1"');

  /* Slew ring and house with counterweight */
  s += rect(150, 210, 168, 12, '#3A3B42');
  s += `<path d="M120 208 Q118 172 150 168 L246 166 L246 210 L120 210 Z" fill="url(#${p}-body)"/>`;
  s += `<path d="M120 208 Q118 186 130 178 L130 210 Z" fill="#8A8C94" opacity=".5"/>`;            // counterweight face
  for (let x = 160; x < 238; x += 10) s += line(x, 176, x, 192, '#6B6D75', 1.2);                 // engine grille
  s += rect(150, 150, 5, 18, '#4A4B52') + rect(148, 148, 9, 4, '#3A3B42');                        // exhaust
  s += line(130, 164, 236, 164, '#C9CBD1', 1.2);                                                   // handrail

  /* Cab with glazing */
  s += `<path d="M246 210 L246 128 Q246 120 254 120 L290 120 L306 162 L306 210 Z" fill="url(#${p}-body)"/>`;
  s += `<path d="M252 130 Q252 126 256 126 L286 126 L298 160 L252 160 Z" fill="url(#${p}-glass)"/>`;
  s += line(270, 126, 270, 160, '#9A9CA4', 1.4) + rect(252, 168, 46, 3, '#8A8C94');

  /* Boom, arm and bucket, with hydraulic cylinders */
  s += `<path d="M300 196 L318 176 L388 82 Q396 72 406 78 L416 88 L332 200 Z" fill="url(#${p}-boom)"/>`;
  s += `<path d="M398 80 L414 76 L476 196 L462 206 Z" fill="url(#${p}-boom)"/>`;
  s += line(312, 194, 372, 112, '#4A4B52', 5) + line(338, 162, 372, 112, '#E4E5E9', 2.4);         // boom cylinder
  s += line(394, 66, 448, 170, '#4A4B52', 5) + line(420, 116, 448, 170, '#E4E5E9', 2.4);          // arm cylinder
  s += circle(318, 192, 6, '#3A3B42', 'stroke="#C9CBD1" stroke-width="1.2"') + circle(404, 84, 6, '#3A3B42', 'stroke="#C9CBD1" stroke-width="1.2"');
  s += `<path d="M462 200 Q448 236 478 248 L512 244 L496 206 Z" fill="url(#${p}-bucket)" stroke="#C9CBD1" stroke-width="1.2"/>`;
  for (let k = 0; k < 4; k++) s += `<path d="M${480 + k * 8} 247 l4 7 l3 -8 z" fill="#C9CBD1"/>`;
  s += circle(469, 201, 5, '#3A3B42', 'stroke="#C9CBD1" stroke-width="1.2"');

  const defs = lin(`${p}-body`, [[0, '#E4E5E9'], [1, '#9EA0A8']]) +
    lin(`${p}-boom`, [[0, '#D9DADF'], [1, '#8A8C94']], 1, 1) +
    lin(`${p}-bucket`, [[0, '#4A4B52'], [1, '#2B2C31']]) +
    lin(`${p}-glass`, [[0, '#5A606C'], [1, '#22252C']], 1, 1) +
    lin(`${p}-dirt`, [[0, '#3A3B42'], [1, '#1C1D21']]);
  return svg(p, 'Illustration: a tracked excavator loading from a spoil pile', defs, s);
}

/* ==================================================================
   4. PASSENGER TRANSPORT: COACH BUS
================================================================== */
function bus() {
  const p = 'sc';
  let s = board(p, { ground: '#18181B' });
  s += `<ellipse cx="290" cy="200" rx="270" ry="140" fill="url(#${p}-glow)"/>`;
  /* Road: curb and lane dashes */
  s += rect(0, GY, W, 4, '#4A4B52');
  for (let x = 10; x < W; x += 56) s += rect(x, 306, 30, 3, '#6B6D75');

  /* Bus stop sign */
  s += line(530, GY, 530, 150, '#8A8C94', 2.4) + rect(514, 136, 32, 22, '#E4E5E9', 'rx="2"') + rect(520, 144, 20, 3, '#2E2E33') + rect(520, 150, 13, 2, '#6B6D75');

  /* Body */
  const L = 50, R = 486, T = 128, B = 246;
  s += `<ellipse cx="${(L + R) / 2}" cy="${GY + 6}" rx="${(R - L) / 2 + 8}" ry="7" fill="#000" opacity=".5"/>`;
  s += `<path d="M${L} ${T + 20} Q${L} ${T} ${L + 20} ${T} L${R - 34} ${T} Q${R - 6} ${T} ${R} ${T + 30} L${R + 6} ${B - 14} Q${R + 6} ${B} ${R - 10} ${B} L${L + 14} ${B} Q${L} ${B} ${L} ${B - 14} Z" fill="url(#${p}-body)"/>`;
  s += rect(L + 6, T + 2, R - L - 50, 3, '#F3F4F6', 'opacity=".7"');                                // roof highlight

  /* Window band, pillars, door, windshield */
  const WT = T + 14, WB = T + 58;
  s += rect(L + 14, WT, 352, WB - WT, `url(#${p}-glass)`, 'rx="4"');
  for (let x = L + 14 + 50; x < L + 366; x += 50) s += rect(x - 2, WT, 4, WB - WT, '#C9CBD1');
  s += rect(L + 14, WT + 4, 352, 2, '#F3F4F6', 'opacity=".12"');
  s += rect(L + 376, WT, 30, B - WT - 6, `url(#${p}-glass)`, 'rx="3"') + line(L + 391, WT, L + 391, B - 6, '#9A9CA4', 1);
  s += `<path d="M${L + 412} ${WT} L${R - 30} ${WT} Q${R - 8} ${WT} ${R - 2} ${WT + 26} L${R + 1} ${WB + 4} L${L + 412} ${WB + 4} Z" fill="url(#${p}-glass)"/>`;
  s += line(R - 30, WT, R - 26, T - 6, '#8A8C94', 1.6) + rect(R - 34, T - 10, 10, 6, '#3A3B42', 'rx="2"');   // mirror

  /* Livery stripe, luggage bays, lights */
  s += rect(L, WB + 10, R - L + 4, 7, '#2E2E33');
  [[L + 118, 70], [L + 194, 70], [L + 270, 70]].forEach(([x, w]) => { s += rect(x, WB + 24, w, B - WB - 34, 'none', 'stroke="#8A8C94" stroke-width="1" rx="2"') + rect(x + w / 2 - 6, B - 18, 12, 2, '#6B6D75'); });
  s += rect(R - 2, B - 26, 8, 8, '#F3F4F6', 'rx="1.5"') + rect(L - 2, B - 26, 6, 10, '#6B6D75', 'rx="1.5"');

  /* Wheels in their arches */
  [[L + 74], [R - 70]].forEach(([x]) => {
    s += `<path d="M${x - 30} ${B} A30 30 0 0 1 ${x + 30} ${B} Z" fill="#121214"/>`;
    s += circle(x, B + 2, 22, '#141416', 'stroke="#3A3B42" stroke-width="2"') + circle(x, B + 2, 12, `url(#${p}-rim)`) + circle(x, B + 2, 4, '#3A3B42');
  });

  const defs = lin(`${p}-body`, [[0, '#EEEFF2'], [0.6, '#C9CBD1'], [1, '#9EA0A8']]) +
    lin(`${p}-glass`, [[0, '#5A606C'], [0.5, '#30343D'], [1, '#1E2127']], 1, 1) +
    `<radialGradient id="${p}-rim" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#E4E5E9"/><stop offset="1" stop-color="#6B6D75"/></radialGradient>`;
  return svg(p, 'Illustration: a coach bus for passenger transportation at a stop', defs, s);
}

const SCENES = { build, grounds, equipment, bus };

/* A pair of scenes with captions, for one capability group */
export function sceneStrip(items) {
  return `<div class="scenes">
    ${items.map(([id, caption], i) => `<figure class="scene reveal" style="--reveal-delay:${i * 90}ms">
      ${SCENES[id]()}
      <figcaption class="scene__caption"><span class="scene__num">${String(i + 1).padStart(2, '0')}</span>${caption}</figcaption>
    </figure>`).join('')}
  </div>`;
}
