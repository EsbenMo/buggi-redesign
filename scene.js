// Animeret Halloween-baggrund: gammel kirkegård, spøgelser med varm kakao, zombie foran tv og spindelvæv med edderkopper.
// Ren dekoration (aria-hidden), ligger bag indholdet og kan sættes på pause.
(function () {
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const stars = Array.from({ length: 46 }, (_, i) => `<circle class="tw" style="animation-delay:${(i % 9) * .7}s" cx="${Math.round(rnd() * 1600)}" cy="${Math.round(rnd() * 460)}" r="${(1 + rnd() * 1.6).toFixed(1)}" fill="#e8ecff"/>`).join("");

  const stone = (x, y, w, h, kind) => {
    const top = kind === "cross"
      ? `<path d="M${x - w * .18} ${y + h}V${y + h * .3}H${x - w * .5}V${y}H${x - w * .18}V${y - h * .32}H${x + w * .18}V${y}H${x + w * .5}V${y + h * .3}H${x + w * .18}V${y + h}z"/>`
      : `<path d="M${x - w / 2} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}z"/>`;
    return `<g fill="#1d2754" stroke="#2b3875" stroke-width="2">${top}</g>` + (kind === "rip" ? `<path d="M${x - w * .22} ${y + w * .75}h${w * .44}M${x - w * .22} ${y + w * .95}h${w * .44}" stroke="#34428a" stroke-width="3" stroke-linecap="round"/>` : "");
  };
  const far = [[120, 600, 46, 70, "rip"], [260, 585, 40, 60, "cross"], [430, 610, 44, 60, "rip"], [640, 590, 52, 76, "rip"], [820, 600, 40, 56, "cross"], [1180, 585, 48, 70, "rip"], [1470, 600, 44, 62, "cross"], [1560, 612, 40, 56, "rip"]].map(a => stone(...a)).join("");
  const near = [[40, 740, 60, 90, "rip"], [640, 750, 56, 80, "cross"], [760, 745, 60, 86, "rip"], [900, 752, 50, 70, "cross"], [1530, 735, 64, 96, "rip"]].map(a => stone(...a)).join("");
  const fence = Array.from({ length: 36 }, (_, i) => `<path d="M${i * 46 + 4} 760V716l6-12 6 12V760z"/>`).join("");

  const mug = `<g><rect x="40" y="96" width="38" height="30" rx="7" fill="#9a5b2c"/><ellipse cx="59" cy="96" rx="19" ry="6" fill="#4a2a14"/><path d="M78 102c14 0 14 18 0 18" fill="none" stroke="#9a5b2c" stroke-width="5"/><circle cx="52" cy="94" r="4.5" fill="#fff"/><circle cx="64" cy="93" r="4" fill="#fff"/><path class="steam" d="M50 86c-6-10 6-14 0-24" /><path class="steam s2" d="M62 86c-6-10 6-14 0-24" /><path class="steam s3" d="M72 86c-5-9 5-12 0-20"/></g>`;
  const ghost = (fill, face) => `<path d="M0 150V62C0 26 26 0 60 0s60 26 60 62v88l-20-15-20 15-20-15-20 15-20-15z" fill="${fill}"/><ellipse cx="42" cy="58" rx="7" ry="10" fill="#101a35"/><ellipse cx="78" cy="58" rx="7" ry="10" fill="#101a35"/>${face}<ellipse cx="30" cy="108" rx="11" ry="9" fill="${fill}"/><ellipse cx="90" cy="108" rx="11" ry="9" fill="${fill}"/>${mug}`;

  const bat = `<g class="bat"><g class="bat-w"><path d="M0 0 14-10l8 6 8-6 8 8 8-8 8 6 8-6 14 10-10 2-8 8-10-6-6 8-10-8-10 8-6-8-10 6-8-8z" fill="#0a0f26"/></g></g>`;

  const scene = `
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
    <defs>
      <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a35" stop-opacity="0"/><stop offset=".7" stop-color="#2a2f6b" stop-opacity=".55"/><stop offset="1" stop-color="#3a3478" stop-opacity=".7"/></linearGradient>
      <radialGradient id="sc-moon"><stop offset="0" stop-color="#fff3c4" stop-opacity=".5"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
      <linearGradient id="sc-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa6e0" stop-opacity="0"/><stop offset="1" stop-color="#9aa6e0" stop-opacity=".35"/></linearGradient>
      <linearGradient id="sc-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fe3ff" stop-opacity=".28"/><stop offset="1" stop-color="#8fe3ff" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#sc-sky)"/>
    ${stars}
    <circle cx="1330" cy="170" r="190" fill="url(#sc-moon)"/>
    <circle cx="1330" cy="170" r="78" fill="#fff3c4"/>
    <g fill="#e9d98f" opacity=".7"><circle cx="1304" cy="148" r="14"/><circle cx="1356" cy="196" r="10"/><circle cx="1320" cy="204" r="7"/></g>
    <g fill="#2a3470" opacity=".7"><g class="cloud c1"><ellipse cx="300" cy="150" rx="140" ry="26"/><ellipse cx="380" cy="132" rx="90" ry="22"/></g><g class="cloud c2"><ellipse cx="900" cy="90" rx="160" ry="24"/><ellipse cx="840" cy="76" rx="80" ry="20"/></g></g>
    <g class="fly f1">${bat}</g><g class="fly f2">${bat}</g><g class="fly f3">${bat}</g>

    <path d="M0 640Q260 560 560 620T1120 600T1600 610V900H0z" fill="#141c48"/>
    ${far}
    <g fill="#0d1334"><path d="M1010 650V560l-30-50 12-4 24 34V470l-40-60 12-4 28 40 6-60h10l-4 70 34-48 10 6-40 70 2 70 30-24 8 8-38 40v100z"/></g>
    <path d="M0 770Q400 700 800 745T1600 725V900H0z" fill="#0b1230"/>
    <g fill="#0f163d">${fence}</g>
    ${near}

    <rect y="640" width="1600" height="260" fill="url(#sc-fog)"/>
    <g class="fog"><ellipse cx="400" cy="800" rx="420" ry="26" fill="#aab4ee" opacity=".12"/><ellipse cx="1200" cy="780" rx="460" ry="30" fill="#aab4ee" opacity=".12"/></g>

    <g id="zombie" transform="translate(110 0)">
      <path d="M440 770h180l30 16v20H410v-20z" fill="#1d2754"/>
      <rect x="470" y="690" width="140" height="102" rx="12" fill="#2b2f3f" stroke="#12162b" stroke-width="3"/>
      <rect class="tv-screen" x="484" y="704" width="88" height="74" rx="8"/>
      <circle cx="592" cy="720" r="5" fill="#8a90a8"/><circle cx="592" cy="740" r="5" fill="#8a90a8"/>
      <path d="M520 690 490 656M546 690 580 650" stroke="#8a90a8" stroke-width="3" stroke-linecap="round"/>
      <polygon class="tv-beam" points="484,704 484,778 20,830 20,690" fill="url(#sc-beam)"/>
      <rect x="12" y="780" width="260" height="60" rx="16" fill="#7a2e3a"/>
      <rect x="22" y="708" width="240" height="84" rx="18" fill="#8d3846"/>
      <rect x="0" y="742" width="42" height="98" rx="14" fill="#6a2430"/><rect x="250" y="742" width="42" height="98" rx="14" fill="#6a2430"/>
      <g class="zhead">
        <rect x="76" y="716" width="130" height="80" rx="26" fill="#46506b"/>
        <path d="M96 724l10 14-14 6zM170 722l-8 16 16 2z" fill="#2c334b"/>
        <rect x="104" y="692" width="74" height="30" rx="10" fill="#7fb86e"/>
        <circle cx="141" cy="664" r="38" fill="#8fcf7a" stroke="#4d7a42" stroke-width="3"/>
        <path d="M110 640q8-18 20-10 6-14 20-6 12-6 20 8-14-2-22 4-10-8-22-2-8-6-16 6z" fill="#3b2f2a"/>
        <circle cx="127" cy="660" r="9" fill="#fff"/><circle cx="159" cy="660" r="9" fill="#fff"/>
        <circle class="zp" cx="130" cy="661" r="4" fill="#101a35"/><circle class="zp" cx="162" cy="661" r="4" fill="#101a35"/>
        <path d="M122 684q20 8 38 0" fill="none" stroke="#3a5a33" stroke-width="3" stroke-linecap="round"/><path d="M128 680v8M140 683v8M152 682v8" stroke="#3a5a33" stroke-width="2"/>
        <path d="M168 646l12 6-10 6z" fill="#6a9a5c"/>
      </g>
      <path d="M96 744c-16 10-8 36 14 36" fill="none" stroke="#8fcf7a" stroke-width="14" stroke-linecap="round"/>
      <g><path d="M96 786h58l-6-34h-46z" fill="#fff" stroke="#c0392b" stroke-width="3"/><path d="M104 752l-3 34M118 752l-1 34M132 752l1 34M146 752l3 34" stroke="#c0392b" stroke-width="3"/><g fill="#ffeaa7"><circle cx="110" cy="748" r="7"/><circle cx="124" cy="744" r="8"/><circle cx="138" cy="748" r="7"/><circle cx="152" cy="750" r="6"/></g></g>
    </g>

    <g transform="translate(1000 520)"><g class="bob b1">${ghost("#c4cdf5", `<ellipse cx="60" cy="86" rx="7" ry="5" fill="#101a35"/>`)}</g></g>
    <g transform="translate(1210 570) scale(.82)"><g class="bob b2">${ghost("#a9b6ee", `<path d="M50 86q10 8 20 0" fill="none" stroke="#101a35" stroke-width="4" stroke-linecap="round"/>`)}</g></g>
  </svg>`;

  const web = (side) => `
  <svg class="web ${side}" viewBox="0 0 200 200" focusable="false">
    <g fill="none" stroke="#dfe5ff" stroke-width="1.4" stroke-linecap="round" opacity=".5">
      <path d="M0 0 200 0M0 0 190 70M0 0 150 150M0 0 70 190M0 0 0 200"/>
      <path d="M44 0Q36 34 0 44M88 0Q70 70 0 88M132 0Q106 106 0 132M176 0Q140 140 0 176"/>
    </g>
    <g class="sp" style="transform-origin:150px 0">
      <path d="M150 0V ${side === "r" ? 118 : 104}" stroke="#dfe5ff" stroke-width="1.5" opacity=".6"/>
      <g transform="translate(150 ${side === "r" ? 124 : 110})">
        <path d="M-6-4-18-12M-7 0-20 0M-6 4-18 12M6-4 18-12M7 0 20 0M6 4 18 12" stroke="#0a0f26" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <ellipse rx="9" ry="11" fill="#0a0f26"/><circle cy="-11" r="6" fill="#0a0f26"/><circle cx="-2.5" cy="-12" r="1.6" fill="#ff7a5c"/><circle cx="2.5" cy="-12" r="1.6" fill="#ff7a5c"/>
      </g>
    </g>
  </svg>`;

  const host = document.createElement("div");
  host.id = "scene";
  host.setAttribute("aria-hidden", "true");
  host.innerHTML = scene + web("l") + web("r");
  document.body.prepend(host);
})();
