(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const app = $("#app");
  const BOOKS = window.BOOKS, TAGS = window.TAGS, LIBS = window.LIBRARIES;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- tilstand ----
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };
  const urlLib = new URLSearchParams(location.search).get("lib");
  // Biblioteket i adressen vinder over det gemte valg (fund 2): QR-koder og delte links viser altid det rigtige sted.
  let libId = LIBS.some(l => l.id === urlLib) ? urlLib : store.get("buggi-lib");
  if (!LIBS.some(l => l.id === libId)) libId = null;
  let whyOn = store.get("buggi-why") === "1";
  const disc = { moods: new Set(), themes: new Set(), len: "alle", lvl: "alle", cat: "alle" };
  const lib = () => LIBS.find(l => l.id === libId);
  const bookById = id => BOOKS.find(b => b.id === id);

  // ---- hjælpere ----
  const lixLabel = l => l < 15 ? "Let at læse" : l < 25 ? "Middel" : "Svær";
  const lenLabel = p => p < 110 ? "Kort" : p < 160 ? "Mellem" : "Lang";
  const inTarget = b => b.age[0] <= 12 && b.age[1] >= 8 && b.age[0] <= 11; // 8–12 år er målgruppen
  const pin = id => `<button class="why-pin" data-why="${id}" aria-label="Hvorfor ser det sådan ud? ${esc(WHY[id].t)}">?</button>`;
  const cover = (b, big) => `<span class="cover${big ? " big" : ""}" style="--c1:${b.c[0]};--c2:${b.c[1]}" aria-hidden="true"><span class="cover-t">${esc(b.title)}</span><span class="cover-e">${b.tags.slice(0, 2).map(t => TAGS[t].e).join("")}</span></span>`;
  const dot = b => lib() ? `<span class="avail ${b.av ? "yes" : "no"}">${b.av ? "På hylden" : "Udlånt"}</span>` : "";
  const bookCard = (b, extra = "") => `<a class="card" href="#/book/${b.id}">${cover(b)}<span class="card-title">${esc(b.title)}</span><span class="card-meta">${esc(b.author)} · ${b.age[0]}–${b.age[1]} år</span>${dot(b)}${extra}</a>`;
  const tagChip = id => `<span class="tag"><span aria-hidden="true">${TAGS[id].e}</span> ${TAGS[id].label}</span>`;

  // ---- fuzzy søgning (fund 5, 18) ----
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zæøå0-9 ]/g, "");
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[n];
  }
  function search(q) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return { results: [], corrected: null };
    let usedFuzzy = false;
    const scored = BOOKS.map(b => {
      const hay = norm([b.title, b.author, ...b.topics, b.cat].join(" ")).split(/\s+/);
      let score = 0, ok = true;
      for (const w of words) {
        let best = 99;
        for (const h of hay) {
          if (h.startsWith(w)) { best = 0; break; }
          const d = Math.min(lev(w, h), lev(w, h.slice(0, w.length)));
          if (d < best) best = d;
        }
        const allowed = w.length <= 3 ? 0 : w.length <= 6 ? 1 : 2;
        if (best === 0) score += 2; else if (best <= allowed) { score += 1; usedFuzzy = true; } else ok = false;
      }
      return ok ? { b, score } : null;
    }).filter(Boolean).sort((a, b) => b.score - a.score);
    const results = scored.map(s => s.b);
    return { results, corrected: usedFuzzy && results[0] ? results[0] : null };
  }

  // ---- relaterede bøger (emne, kategori, lix, alder) ----
  function related(b, mode) {
    return BOOKS.filter(x => x.id !== b.id && inTarget(x)).map(x => {
      const sharedTags = x.tags.filter(t => b.tags.includes(t));
      const sharedTopics = x.topics.filter(t => b.topics.includes(t));
      let s = sharedTags.length * 2 + sharedTopics.length * 2 + (x.cat === b.cat ? 2 : 0);
      const ageOverlap = Math.min(x.age[1], b.age[1]) - Math.max(x.age[0], b.age[0]) >= 1;
      if (ageOverlap) s += 1;
      const dl = x.lix - b.lix;
      if (mode === "lettere" ? dl < -2 : mode === "svaerere" ? dl > 2 : Math.abs(dl) <= 10) s += 2; else s -= 2;
      const reasons = [];
      if (sharedTags[0]) reasons.push(TAGS[sharedTags[0]].label);
      if (sharedTopics[0]) reasons.push(sharedTopics[0]);
      if (x.cat === b.cat) reasons.push(x.cat);
      reasons.push(dl < -2 ? "Lidt lettere" : dl > 2 ? "Lidt sværere" : "Samme niveau");
      return { x, s, reasons };
    }).filter(r => r.s > 2).sort((a, b) => b.s - a.s).slice(0, 4);
  }

  // ---- bibliotekvælger (combobox) ----
  const zr = g => { const r = (window.LIB_ZIPS || {})[g]; return r ? (r[0] === r[1] ? r[0] : r[0] + "–" + r[1]) : ""; };
  function libPicker(id, label, compact) {
    const cur = lib();
    const groups = [...new Set(LIBS.map(l => l.group))];
    return `<div class="picker ${compact ? "compact" : ""}" data-picker>
      <label class="picker-label" for="${id}">${esc(label)}</label>
      <button class="picker-btn" id="${id}" type="button" aria-haspopup="listbox" aria-expanded="false">
        <span aria-hidden="true">🏫</span> <span class="picker-val">${cur ? esc(cur.name) : "Ikke valgt endnu"}</span> <span class="chev" aria-hidden="true">▾</span>
      </button>
      <div class="picker-pop" hidden>
        <label class="sr" for="${id}-q">Søg efter skole, bibliotek eller postnummer</label>
        <input class="picker-q" id="${id}-q" type="search" placeholder="Skriv navn eller postnummer" autocomplete="off">
        <button class="geo" type="button">📍 Brug min placering</button>
        <ul class="picker-list" role="listbox" aria-label="Skoler og biblioteker">
          ${groups.map(g => `<li class="grp" role="presentation" data-g="${esc(g)}"><span>${esc(g)}</span>${zr(g) ? `<span class="zr">${zr(g)}</span>` : ""}</li>` + LIBS.filter(l => l.group === g).map(l => `<li role="option" tabindex="-1" data-lib="${l.id}" aria-selected="${l.id === libId}"><span>${esc(l.name)}</span><small>${l.zip}${l.dist ? " · " + l.dist : ""}</small></li>`).join("")).join("")}
        </ul>
      </div>
    </div>`;
  }

  function wirePickers(root) {
    root.querySelectorAll("[data-picker]").forEach(p => {
      const btn = $(".picker-btn", p), pop = $(".picker-pop", p), q = $(".picker-q", p);
      const open = o => { pop.hidden = !o; btn.setAttribute("aria-expanded", o); if (o) { q.value = ""; filter(""); q.focus(); } };
      const filter = v => {
        const n = norm(v).trim(); let any = false;
        const zipQ = /^\d{1,4}$/.test(n) ? n : "";
        const own = zipQ ? LIBS.filter(l => l.zip.startsWith(zipQ)).map(l => l.id) : [];
        const inRange = id => { const l = LIBS.find(x => x.id === id), r = (window.LIB_ZIPS || {})[l.group]; return zipQ.length === 4 && r && +zipQ >= r[0] && +zipQ <= r[1]; };
        pop.querySelectorAll("li[data-lib]").forEach(li => {
          const id = li.dataset.lib;
          const show = !n || (zipQ ? (own.length ? own.includes(id) : inRange(id)) : norm(li.textContent).includes(n));
          li.hidden = !show; if (show) any = true;
        });
        pop.querySelectorAll(".grp").forEach(g => { let s = g.nextElementSibling, vis = false; while (s && !s.classList.contains("grp")) { if (!s.hidden) vis = true; s = s.nextElementSibling; } g.hidden = !vis; });
      };
      btn.addEventListener("click", () => open(pop.hidden));
      q.addEventListener("input", () => filter(q.value));
      q.addEventListener("keydown", e => { if (e.key === "Escape") { open(false); btn.focus(); } if (e.key === "ArrowDown") { const f = pop.querySelector("li[data-lib]:not([hidden])"); if (f) f.focus(); } });
      pop.addEventListener("keydown", e => {
        const li = e.target.closest("li[data-lib]"); if (!li) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(li.dataset.lib); }
        if (e.key === "ArrowDown") { e.preventDefault(); let n = li.nextElementSibling; while (n && (n.hidden || !n.dataset.lib)) n = n.nextElementSibling; if (n) n.focus(); }
        if (e.key === "ArrowUp") { e.preventDefault(); let n = li.previousElementSibling; while (n && (n.hidden || !n.dataset.lib)) n = n.previousElementSibling; (n || q).focus(); }
        if (e.key === "Escape") { open(false); btn.focus(); }
      });
      pop.addEventListener("click", e => { const li = e.target.closest("li[data-lib]"); if (li) choose(li.dataset.lib); });
      $(".geo", p).addEventListener("click", () => choose("kbh-nord")); // prototype: simuleret placering
    });
  }
  let toastT;
  function toast(msg, undo) {
    const t = $("#toast"); t.innerHTML = `${esc(msg)} ${undo ? '<button type="button" id="undo">Fortryd</button>' : ""}`; t.hidden = false;
    if (undo) $("#undo").onclick = () => { undo(); t.hidden = true; };
    clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 5000);
  }
  function choose(id) {
    const prev = libId; libId = id; store.set("buggi-lib", id);
    toast(`Du er nu på ${lib().name}.`, () => { libId = prev; if (prev) store.set("buggi-lib", prev); route(); });
    route();
  }

  // ---- sider ----
  function header() {
    const r = location.hash.split("/")[1] || "";
    const item = (h, e, t, on) => `<a href="${h}" ${on ? 'aria-current="page"' : ""}><span class="ni" aria-hidden="true">${e}</span><span>${t}</span></a>`;
    $("#hdr").innerHTML = `
      <a class="logo" href="#/" aria-label="Buggi, til forsiden">bug<span>g</span>i</a>
      <div class="hdr-lib">${libPicker("lib-top", "Vælg skole eller bibliotek", true)}${pin("librarybar")}</div>
      <nav aria-label="Hovedmenu" class="nav">${item("#/", "🏠", "Hjem", r === "" || r === "book" || r === "shelf")}${item("#/discover", "😊", "Opdag", r === "discover")}${item("#/search", "🔍", "Søg", r === "search")}${pin("nav")}</nav>`;
    wirePickers($("#hdr"));
  }

  function searchBox(val = "") {
    return `<form class="searchbox" role="search" data-search>
      <label for="q">Søg efter bøger</label>
      <div class="sb-row"><input id="q" name="q" type="search" value="${esc(val)}" placeholder="Titel, forfatter eller emne – fx heste" autocomplete="off"><button type="submit">Søg</button></div>
      ${pin("search")}
    </form>`;
  }

  function row(title, sub, books, showAll) {
    return `<section class="row" aria-labelledby="h-${title.length}${books[0]?.id}"><div class="row-h"><h2 id="h-${title.length}${books[0]?.id}">${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}</div><div class="rail">${books.map(b => bookCard(b)).join("")}</div></section>`;
  }

  function viewHome() {
    const target = BOOKS.filter(inTarget);
    const scary = target.filter(b => b.tags.includes("uhyggelig"));
    const readP = bookById("percy");
    const relP = related(readP).map(r => r.x);
    const onb = lib() ? "" : `<section class="onb" aria-labelledby="onb-h">${pin("onboarding")}
      <h2 id="onb-h">Hvor er du?</h2>
      <p>Vælg din skole eller dit bibliotek, så viser vi kun bøger, der står på hylden lige nu – og hvor du finder dem.</p>
      <div class="onb-ill" aria-hidden="true">📚 → 🚶 → 📖</div>
      ${libPicker("lib-onb", "Vælg skole eller bibliotek", false)}
      <p class="small">Vil du bare kigge? Bladr videre herunder – du kan altid vælge senere.</p></section>`;
    app.innerHTML = `<div class="hero"><h1>Find din næste bog</h1>${searchBox()}</div>
      ${onb}
      <div class="rows">${pin("rows")}
        ${row("Uhyggelige bøger til Halloween", "Til dig, der tør", scary)}
        ${row("Har du læst Percy Jackson?", "Prøv også disse", relP)}
        ${row("Hjertevarme bøger", "Når du har lyst til at blive glad", target.filter(b => b.tags.includes("hjertevarm")).slice(0, 8))}
        ${row("Sjove bøger", "Hvor du kommer til at grine", target.filter(b => b.tags.includes("sjov")).slice(0, 8))}
        ${row("Fakta: dyr, rummet og fortid", "Bøger hvor du lærer noget", target.filter(b => b.cat === "Fakta"))}
        ${row("Bøger til 8–12 år", "Valgt til din alder", target.slice(0, 10))}
      </div>
      <section class="about-teaser" aria-labelledby="ab-h"><h2 id="ab-h">Hvad er Buggi?</h2><p>Buggi hjælper dig med at finde en god bog. Vælg dit bibliotek, så ser du, om bogen står på hylden – og hvor.</p><a class="cta" href="#/about">Læs mere om Buggi</a></section>`;
    wirePickers(app);
  }

  function viewDiscover() {
    const moodBtn = (t, key) => `<button type="button" class="chip big" aria-pressed="${disc[key].has(t.id)}" data-tog="${t.id}" data-set="${key}"><span class="ce" aria-hidden="true">${t.e}</span><span class="cl">${t.label}</span></button>`;
    const seg = (k, label, opts) => `<fieldset class="seg"><legend>${label}</legend>${opts.map(([v, t]) => `<label><input type="radio" name="${k}" value="${v}" ${disc[k] === v ? "checked" : ""}><span>${t}</span></label>`).join("")}</fieldset>`;
    app.innerHTML = `<div class="page-h"><h1>Opdag bøger</h1><p>Vælg hvordan bogen skal føles og hvad den skal handle om.</p></div>
      <div class="disc-layout">
        <aside class="filters" aria-label="Filtre">${pin("moods")}
          <section aria-labelledby="g1"><h2 id="g1">Hvordan skal bogen føles?</h2><div class="grid">${MOODS.map(t => moodBtn(t, "moods")).join("")}</div></section>
          <section aria-labelledby="g2"><h2 id="g2">Hvad skal den handle om?</h2><div class="grid">${THEMES.map(t => moodBtn(t, "themes")).join("")}</div></section>
          <p class="rule">${pin("filterrule")}<b>Jo flere du vælger, jo færre bøger.</b> Vi viser kun bøger, der passer til alt, du har valgt.<span class="small hints" id="hints"></span></p>
          <div class="segs">
            ${seg("len", "Hvor lang?", [["alle", "Alle"], ["Kort", "Kort"], ["Mellem", "Mellem"], ["Lang", "Lang"]])}
            ${seg("lvl", "Hvor svær?", [["alle", "Alle"], ["Let at læse", "Let"], ["Middel", "Middel"], ["Svær", "Svær"]])}
            ${seg("cat", "Hvilken slags?", [["alle", "Begge"], ["Fiktion", "Fortælling"], ["Fakta", "Fakta"]])}
          </div>
        </aside>
        <section class="results" id="results" aria-labelledby="res-h" tabindex="-1">${pin("stickycta")}
          <div class="active" id="active"></div>
          <h2 id="res-h" role="status"></h2>
          <div id="res-body"></div>
        </section>
      </div>
      <div class="sticky-cta"><a class="cta" href="#results" data-jump></a></div>`;
    app.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { const set = disc[c.dataset.set]; set.has(c.dataset.tog) ? set.delete(c.dataset.tog) : set.add(c.dataset.tog); updateDiscover(); }));
    app.querySelectorAll(".seg input").forEach(i => i.addEventListener("change", () => { disc[i.name] = i.value; updateDiscover(); }));
    app.querySelector("[data-jump]").addEventListener("click", e => { e.preventDefault(); const r = $("#results"); r.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); r.focus({ preventScroll: true }); });
    app.addEventListener("click", discoverClicks);
    updateDiscover();
    wirePickers(app);
  }
  function discoverClicks(e) {
    if (!$("#active")) return app.removeEventListener("click", discoverClicks);
    const rm = e.target.closest("[data-rm]");
    if (rm) { const [k, v] = rm.dataset.rm.split(":"); if (k === "moods" || k === "themes") disc[k].delete(v); else disc[k] = "alle"; updateDiscover(); }
    if (e.target.closest("[data-clear]")) { disc.moods.clear(); disc.themes.clear(); disc.len = disc.lvl = disc.cat = "alle"; updateDiscover(); }
  }
  // Opdaterer kun det, der ændrer sig, så filterpanelets scrollposition og fokus bevares
  function updateDiscover() {
    const results = filteredDiscover();
    app.querySelectorAll(".chip[data-tog]").forEach(c => c.setAttribute("aria-pressed", disc[c.dataset.set].has(c.dataset.tog)));
    app.querySelectorAll(".seg input").forEach(i => { i.checked = disc[i.name] === i.value; });
    const labels = { len: { Kort: "Kort", Mellem: "Mellem", Lang: "Lang" }, lvl: { "Let at læse": "Let", Middel: "Middel", Svær: "Svær" }, cat: { Fiktion: "Fortælling", Fakta: "Fakta" } };
    const act = [
      ...[...disc.moods].map(id => ["moods:" + id, TAGS[id].e + " " + TAGS[id].label]),
      ...[...disc.themes].map(id => ["themes:" + id, TAGS[id].e + " " + TAGS[id].label]),
      ...["len", "lvl", "cat"].filter(k => disc[k] !== "alle").map(k => [k + ":x", { len: "Længde: ", lvl: "Sværhed: ", cat: "Slags: " }[k] + labels[k][disc[k]]])
    ];
    $("#active").innerHTML = act.length ? `<span class="act-l">Du har valgt:</span>${act.map(([k, t]) => `<button type="button" class="act" data-rm="${k}" aria-label="Fjern ${esc(t)}">${esc(t)} <span aria-hidden="true">✕</span></button>`).join("")}<button type="button" class="link" data-clear>Nulstil alt</button>` : `<span class="act-l small">Du har ikke valgt noget endnu. Vi viser alle bøger til 8–12 år.</span>`;
    const sel = [...disc.moods, ...disc.themes];
    $("#hints").innerHTML = sel.length ? "<br>" + esc(sel.map(id => TAGS[id].label + ": " + TAGS[id].hint).join(" · ")) : "";
    $("#res-h").textContent = `${results.length} ${results.length === 1 ? "bog" : "bøger"} passer til dig`;
    $("#res-body").innerHTML = results.length ? `<div class="list">${results.map(b => bookCard(b)).join("")}</div>` : `<p class="empty">Ingen bøger passer til alle dine valg. Fjern et af dem ovenfor, eller <button class="link" type="button" data-clear>nulstil alt</button>.</p>`;
    app.querySelector("[data-jump]").textContent = `Vis ${results.length} ${results.length === 1 ? "bog" : "bøger"}`;
  }
  function filteredDiscover() {
    return BOOKS.filter(b => inTarget(b)).filter(b => [...disc.moods, ...disc.themes].every(t => b.tags.includes(t))
      && (disc.len === "alle" || lenLabel(b.pages) === disc.len) && (disc.lvl === "alle" || lixLabel(b.lix) === disc.lvl)
      && (disc.cat === "alle" || (disc.cat === "Fakta" ? b.cat === "Fakta" : b.cat !== "Fakta")));
  }

  function viewSearch(q = "") {
    const { results, corrected } = q ? search(q) : { results: [], corrected: null };
    let out = "";
    if (q) {
      if (results.length) out = `${corrected ? `<p class="didyou" role="status">Viser resultater for <b>${esc(corrected.title)}</b>. Du skrev “${esc(q)}”.</p>` : ""}
        <h2 class="res-h">${results.length} ${results.length === 1 ? "resultat" : "resultater"}</h2><div class="list">${results.map(b => bookCard(b)).join("")}</div>`;
      else out = `<div class="empty"><h2>Vi fandt ikke “${esc(q)}”</h2><p>Prøv et emne i stedet:</p><div class="chips">${["heste", "fodbold", "spøgelser", "venskab"].map(t => `<a class="chip" href="#/search?q=${t}">${t}</a>`).join("")}</div></div>`;
    }
    app.innerHTML = `<div class="page-h"><h1>Søg</h1></div>${searchBox(q)}<div class="search-out">${out}</div>`;
    wirePickers(app);
  }

  function viewBook(id, mode = "samme") {
    const b = bookById(id); if (!b) return viewHome();
    const rel = related(b, mode);
    const avail = lib()
      ? `<div class="availbox ${b.av ? "yes" : "no"}">${pin("avail")}<p><span class="avail ${b.av ? "yes" : "no"}">${b.av ? "På hylden" : "Udlånt"}</span> <b>${esc(lib().name)}</b></p>
          ${b.av ? `<p class="small"><span class="dotg" aria-hidden="true"></span> Grøn prik betyder: bogen står på hylden lige nu.</p><a class="cta" href="#/shelf/${b.id}">Find på hylden</a>` : `<p class="small">Bogen er ikke på hylden lige nu. Du kan reservere den på bibliotekets hjemmeside, eller se lignende bøger nedenfor.</p>`}<p class="small res-link"><a href="https://bibliotek.dk" target="_blank" rel="noopener">Reservér på bibliotekets hjemmeside (åbner i nyt vindue)</a></p></div>`
      : `<div class="availbox none">${pin("avail")}<p><b>Står den på hylden?</b> Vælg dit bibliotek, så ser du det her – og hvor du finder bogen.</p>${libPicker("lib-book", "Vælg skole eller bibliotek", false)}</div>`;
    app.innerHTML = `<a class="back" href="#/">← Tilbage</a>
      <article class="book">${pin("book")}
        <div class="book-top">${cover(b, true)}<div><h1>${esc(b.title)}</h1><p class="by">af ${esc(b.author)}</p>
          <ul class="facts"><li>${b.age[0]}–${b.age[1]} år</li><li>${b.pages} sider</li><li>${lixLabel(b.lix)}</li><li>${esc(b.cat)}</li><li>Udgivet ${b.year}</li></ul></div></div>
        <p class="blurb">${esc(b.d)}</p>
        <div class="tags"><span class="sr">Humør og emner:</span>${b.tags.map(tagChip).join("")}</div>
        ${avail}
        ${seriesBox(b)}
        <p class="share"><button class="ghost sm" type="button" data-share="${b.id}">🔗 Kopiér link til bogen</button></p>
      </article>
      <section class="rel" aria-labelledby="rel-h">${pin("related")}<h2 id="rel-h">Lyst til noget lignende?</h2>
        <fieldset class="seg"><legend>Hvor svær skal den næste være?</legend>${[["lettere", "Lidt lettere"], ["samme", "Samme niveau"], ["svaerere", "Lidt sværere"]].map(([v, t]) => `<label><input type="radio" name="mode" value="${v}" ${mode === v ? "checked" : ""}><span>${t}</span></label>`).join("")}</fieldset>
        <div class="list">${rel.length ? rel.map(r => bookCard(r.x, `<span class="why-r">Fordi: ${esc(r.reasons.slice(0, 3).join(" · "))}</span>`)).join("") : `<p class="empty">Ingen bøger på det niveau. Prøv et andet.</p>`}</div>
      </section>`;
    app.querySelectorAll('input[name="mode"]').forEach(i => i.addEventListener("change", () => { viewBook(id, i.value); app.querySelector(`input[name="mode"]:checked`)?.focus(); }));
    wirePickers(app);
  }

  function seriesBox(b) {
    if (!b.series) return "";
    const s = b.series;
    return `<section class="series" aria-labelledby="ser-h"><h2 id="ser-h">Serie: ${esc(s.name)}</h2><ol>${s.ids.map(i => { const x = bookById(i); return `<li>${i === b.id ? `<b aria-current="true">Bog ${x.series.n}: ${esc(x.title)} (du kigger på denne)</b>` : `<a href="#/book/${x.id}">Bog ${x.series.n}: ${esc(x.title)}</a>`}</li>`; }).join("")}</ol></section>`;
  }

  function viewAbout() {
    app.innerHTML = `<div class="page-h"><h1>Om Buggi</h1></div>
      <div class="prose">
        <h2>Til dig, der leder efter en bog</h2>
        <p>Buggi hjælper dig med at finde en bog, du får lyst til at læse. Vælg, hvordan bogen skal føles og hvad den skal handle om, eller søg efter en titel, en forfatter eller et emne.</p>
        <ol class="steps">
          <li><b>1</b> Vælg din skole eller dit bibliotek.</li>
          <li><b>2</b> Find en bog, du får lyst til.</li>
          <li><b>3</b> Tryk “Find på hylden”, og gå hen og tag den.</li>
        </ol>
        <p>Buggi har over 11.000 titler til børn i 3.–5. klasse. Du kan ikke låne bøger her. Det gør du på biblioteket.</p>
        <h2>Til forældre og lærere</h2>
        <p>Skoler og biblioteker med abonnement ser deres egne titler, om bogen står på hylden, og hvor den står. Du kan reservere en bog på bibliotekets egen hjemmeside via linket på bogens side.</p>
        <p>Buggi er lavet, så børn både med og uden læsevanskeligheder kan bruge den: store knapper, ord ved alle ikoner og søgning, der tåler stavefejl.</p>
        <h2>Til biblioteker</h2>
        <ul><li><b>QR-koder på reolerne:</b> et link som <code>?lib=kbh-nord</code> åbner Buggi direkte på dit bibliotek. Valget i adressen vinder altid over det, en tidligere bruger har gemt.</li>
        <li><b>Kiosktilstand:</b> på en fælles PC kan Buggi køre i fuld skærm med biblioteket indlæst.</li></ul>
        <h2 id="tilg">Tilgængelighed</h2>
        <p>Prototypen følger WCAG 2.2 niveau AA som mål: kontrast, synligt fokus, labels på alle felter, store trykflader, tastaturbetjening og respekt for “reducér bevægelse”. Skrifttypen Atkinson Hyperlegible er valgt for sin læsbarhed.</p>
        <h2 id="feedback">Fortæl os, hvad du synes</h2>
        <p>Mangler der en bog? Er noget svært at finde? Skriv her, hvis du er barn eller voksen.</p>
        <form class="fb" data-fb>
          <label for="fb-who">Jeg er</label>
          <select id="fb-who" name="who"><option>et barn</option><option>en forælder</option><option>en lærer eller bibliotekar</option></select>
          <label for="fb-msg">Hvad vil du fortælle?</label>
          <textarea id="fb-msg" name="msg" rows="4" required></textarea>
          <button class="cta" type="submit">Send</button>
          <p class="small">Prototype: beskeden sendes ikke.</p>
        </form>
        <p class="fb-ok" role="status" hidden>Tak! Vi har modtaget din besked. (Prototype: den blev ikke sendt.)</p>
      </div>`;
  }

  function viewShelf(id) {
    const b = bookById(id); if (!b) return viewHome();
    const [s1, s2, s3] = b.shelf;
    app.innerHTML = `<a class="back" href="#/book/${b.id}">← Tilbage til bogen</a>
      <section class="shelfpage">${pin("shelf")}<h1>Find “${esc(b.title)}” på hylden</h1>
        <ol class="steps"><li><b>1</b> Find skiltet <mark>${esc(s1)}</mark></li><li><b>2</b> Så skiltet <mark>${esc(s2)}</mark></li><li><b>3</b> Led efter forfatterens efternavn: <mark>${esc(s3)}</mark></li></ol>
        <svg class="shelfsvg" viewBox="0 0 360 250" role="img" aria-label="Reol med skiltene ${esc(s1)}, ${esc(s2)} og bogstavet ${esc(s3)}. Bogen står på midterste hylde.">
          <rect x="20" y="30" width="320" height="200" rx="10" fill="#7a4a21"/><rect x="30" y="40" width="300" height="180" rx="6" fill="#5c3416"/>
          <rect x="30" y="98" width="300" height="6" fill="#7a4a21"/><rect x="30" y="158" width="300" height="6" fill="#7a4a21"/>
          <g font-family="Atkinson Hyperlegible,sans-serif" font-weight="700" text-anchor="middle">
            <rect x="60" y="6" width="90" height="26" rx="6" fill="#ffd23f"/><text x="105" y="25" font-size="16" fill="#101a35">${esc(s1)}</text>
            <rect x="160" y="6" width="100" height="26" rx="6" fill="#ff7a5c"/><text x="210" y="25" font-size="16" fill="#101a35">${esc(s2)}</text>
            <rect x="270" y="6" width="40" height="26" rx="6" fill="#3ddc97"/><text x="290" y="25" font-size="16" fill="#101a35">${esc(s3)}</text></g>
          ${[0, 1, 2].map(r => [...Array(11)].map((_, i) => `<rect x="${38 + i * 26}" y="${[48, 108, 168][r] + (i % 3) * 3}" width="20" height="${44 - (i % 3) * 3}" rx="2" fill="${["#63b3ed", "#fbb6ce", "#9ae6b4", "#fbd38d", "#d6bcfa"][(i + r) % 5]}" opacity="0.8"/>`).join("")).join("")}
          <rect x="116" y="105" width="22" height="48" rx="2" fill="${b.c[1]}" stroke="#ffd23f" stroke-width="3"/>
          <circle cx="127" cy="96" r="7" fill="#3ddc97" stroke="#101a35" stroke-width="2"/>
        </svg>
        <p class="legend"><span class="dotg" aria-hidden="true"></span> Grøn prik betyder: bogen står på hylden lige nu${lib() ? ` på ${esc(lib().name)}` : ""}.</p>
      </section>`;
    wirePickers(app);
  }

  // ---- router ----
  function route() {
    const [path, qs] = location.hash.slice(1).split("?");
    const parts = path.split("/").filter(Boolean);
    header();
    const v = parts[0] || "";
    if (v === "discover") viewDiscover();
    else if (v === "search") viewSearch(new URLSearchParams(qs || "").get("q") || "");
    else if (v === "book") viewBook(parts[1]);
    else if (v === "shelf") viewShelf(parts[1]);
    else if (v === "about") viewAbout();
    else viewHome();
    document.title = ({ discover: "Opdag", search: "Søg", book: "Bog", shelf: "Find på hylden", about: "Om Buggi" }[v] || "Find din næste bog") + " – Buggi (redesign-prototype)";
    $("#why-drawer").hidden = true;
    document.body.classList.toggle("why-on", whyOn);
    $("#why-toggle").setAttribute("aria-pressed", whyOn);
  }
  window.addEventListener("hashchange", () => { route(); const m = $("#app"); m.focus({ preventScroll: true }); window.scrollTo(0, 0); });

  // delegerede events
  document.addEventListener("submit", e => { if (e.target.matches("[data-fb]")) { e.preventDefault(); e.target.hidden = true; const ok = $(".fb-ok"); ok.hidden = false; ok.tabIndex = -1; ok.focus(); return; } if (e.target.matches("[data-search]")) { e.preventDefault(); const q = new FormData(e.target).get("q").trim(); location.hash = "#/search" + (q ? "?q=" + encodeURIComponent(q) : ""); if (location.hash === "#/search?q=" + encodeURIComponent(q)) route(); } });
  document.addEventListener("click", e => {
    const sh = e.target.closest("[data-share]"); if (sh) { const u = location.origin + location.pathname + (libId ? "?lib=" + libId : "") + "#/book/" + sh.dataset.share; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => toast("Linket er kopieret."), () => toast("Kunne ikke kopiere. Kopiér adressen i browseren.")); }
    const an = e.target.closest("[data-anchor]"); if (an) setTimeout(() => document.getElementById(an.dataset.anchor)?.scrollIntoView(), 120);
    const w = e.target.closest(".why-pin"); if (w) { e.preventDefault(); showWhy(w.dataset.why); }
    if (!e.target.closest("[data-picker]")) document.querySelectorAll(".picker-pop").forEach(p => { p.hidden = true; p.parentElement.querySelector(".picker-btn").setAttribute("aria-expanded", "false"); });
  });
  function showWhy(id) {
    const w = WHY[id], d = $("#why-drawer");
    d.innerHTML = `<button class="close" type="button" aria-label="Luk begrundelsen">✕</button>
      <p class="eyebrow">Hvorfor ser det sådan ud?</p><h2 id="why-t">${esc(w.t)}</h2>
      <p class="meta">${w.f.length ? "Fund i reviewet: " + w.f.map(n => "#" + n).join(", ") + " · " : ""}Severity ${w.sev} af 4${w.n ? " · " + esc(w.n) : ""}</p>
      <h3>Før (buggi.dk i dag)</h3><p>${esc(w.before)}</p><h3>Nu (prototypen)</h3><p>${esc(w.now)}</p><h3>Begrundelse</h3><p>${esc(w.why)}</p>
      <a class="rep" href="report.html#fund">Se hele reviewet og alle 21 fund →</a>`;
    d.hidden = false; $(".close", d).focus(); $(".close", d).onclick = () => { d.hidden = true; };
  }
  $("#why-toggle").addEventListener("click", () => { whyOn = !whyOn; store.set("buggi-why", whyOn ? "1" : "0"); document.body.classList.toggle("why-on", whyOn); $("#why-toggle").setAttribute("aria-pressed", whyOn); if (!whyOn) $("#why-drawer").hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") $("#why-drawer").hidden = true; });

  // Cookie-kort: ikke en dialog, ligeværdige valg, børnesprog (fund 11)
  function cookieCard() {
    if (store.get("buggi-cookies")) return;
    const c = document.createElement("section");
    c.className = "cookies"; c.setAttribute("aria-labelledby", "ck-h");
    c.innerHTML = `<h2 id="ck-h">Må Buggi huske lidt?</h2><p>Buggi kan huske dit bibliotek, så du ikke skal vælge igen. Vi bruger ikke cookies til reklamer.</p>
      <div class="ck-btns"><button type="button" data-ck="nec">Kun det nødvendige</button><button type="button" data-ck="all">Ja, husk mit bibliotek</button></div>
      <button class="why-pin" data-why="cookie" aria-label="Hvorfor ser det sådan ud? Cookie-kort">?</button>`;
    document.body.appendChild(c);
    c.addEventListener("click", e => { const b = e.target.closest("[data-ck]"); if (!b) return; store.set("buggi-cookies", b.dataset.ck); c.remove(); });
  }
  cookieCard();
  route();
})();
