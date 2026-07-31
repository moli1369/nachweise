/* ---------------------------------------------------------------
   Sprachumschaltung, Laden der Szene und Aufbau der Tafeln.
   Die Texte stehen in inhalte.js.
   --------------------------------------------------------------- */

const SPRACHEN = ["de", "en"];
const SPEICHER = "sprache";

function startsprache() {
  const ausUrl = new URLSearchParams(location.search).get("lang");
  if (SPRACHEN.includes(ausUrl)) return ausUrl;
  try {
    const gemerkt = localStorage.getItem(SPEICHER);
    if (SPRACHEN.includes(gemerkt)) return gemerkt;
  } catch { /* Speicher gesperrt — kein Problem */ }
  return (navigator.language || "de").toLowerCase().startsWith("en") ? "en" : "de";
}

let sprache = startsprache();
const t = (schluessel) => UI[sprache][schluessel] ?? schluessel;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* --- Tafelinhalt ---------------------------------------------------- */

function inhaltBauen(art, daten) {
  const teile = [];

  if (daten.text) teile.push(daten.text.map((p) => `<p>${esc(p)}</p>`).join(""));

  if (art === "nachweise") {
    teile.push(NACHWEISE.map((n) => {
      const x = n[sprache];
      return `<article class="posten">
        <div class="posten__kopf">
          <h3>${esc(x.titel)}</h3>
          <div class="posten__links">
            <a class="knopf" href="assets/certificates/${esc(n.datei)}" rel="noopener">${esc(t("ansehen"))}</a>
            <a class="knopf" href="assets/certificates/${esc(n.datei)}" download>PDF</a>
          </div>
        </div>
        <p class="posten__meta">${esc(n.anbieter)} · ${esc(n.jahr)} · ${esc(x.umfang)}</p>
        <p>${esc(x.inhalt)}</p>
        <p class="posten__praxis">${esc(x.praxis)}</p>
      </article>`;
    }).join(""));
    teile.push(`<p class="sammel"><a class="knopf knopf--voll" href="assets/docs/Zertifikatsmappe.pdf" download>${esc(t("alle"))}</a></p>`);
  }

  if (art === "projekte") {
    teile.push(PROJEKTE.map((p) => {
      const x = p[sprache];
      return `<article class="posten">
        <p class="augenbraue">${esc(x.tag)}</p>
        <h3>${esc(x.titel)}</h3>
        <p>${esc(x.text)}</p>
        <div class="zahlen">${x.zahlen.map(([w, l]) => `<div><b>${esc(w)}</b><span>${esc(l)}</span></div>`).join("")}</div>
      </article>`;
    }).join(""));
  }

  if (art === "stationen") {
    teile.push(STATIONEN.map((s) => {
      const x = s[sprache];
      return `<article class="posten">
        <h3>${esc(x.titel)}</h3>
        <p class="posten__meta">${esc(x.meta)}</p>
        <ul class="liste">${x.punkte.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </article>`;
    }).join(""));
  }

  if (art === "kenntnisse") {
    teile.push(`<ul class="liste">${KENNTNISSE.map((k) => {
      const [label, wert] = k[sprache];
      return `<li><b>${esc(label)}:</b> ${esc(wert)}</li>`;
    }).join("")}</ul>`);
  }

  if (art === "konsole") {
    teile.push('<div class="konsolen">' + KONSOLEN.map((k, i) =>
      `<div class="konsole">
         <p class="konsole__kopf">${esc(k.kopf)}</p>
         <pre class="konsole__feld" id="konsole-${i}" aria-live="off"></pre>
       </div>`).join("") + "</div>");
  }

  if (art === "paar" && daten.paare) {
    teile.push(`<dl class="paar">${daten.paare.map(([dt, dd]) =>
      `<div><dt>${esc(dt)}</dt><dd>${dd}</dd></div>`).join("")}</dl>`);
  }

  return teile.join("");
}


/* --- Konsolen ---------------------------------------------------------
   Die beiden Sitzungen tippen sich selbst. Die Zeitgeber werden beim
   Schließen der Tafel wieder abgeräumt, damit im Hintergrund nichts
   weiterläuft.
   ---------------------------------------------------------------------- */

let tippUhren = [];

function tippenAnhalten() {
  tippUhren.forEach(clearTimeout);
  tippUhren = [];
}

function tippenStarten() {
  tippenAnhalten();
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  KONSOLEN.forEach((konsole, i) => {
    const feld = document.getElementById("konsole-" + i);
    if (!feld) return;

    if (ruhig) {
      feld.innerHTML = konsole.zeilen
        .map(([p, c]) => (p ? '<span class="eingabe">' + esc(p) + "</span>" : "") + esc(c))
        .join("\n");
      return;
    }

    let z = 0, k = 0, aus = "";
    const takt = () => {
      if (z >= konsole.zeilen.length) {
        tippUhren.push(setTimeout(() => { aus = ""; z = 0; k = 0; takt(); }, 4000));
        return;
      }
      const [eingang, befehl] = konsole.zeilen[z];
      if (k === 0 && eingang) aus += '<span class="eingabe">' + esc(eingang) + "</span>";
      if (k < befehl.length) {
        aus += esc(befehl[k]); k++;
        feld.innerHTML = aus + '<span class="zeiger"></span>';
        tippUhren.push(setTimeout(takt, eingang ? 26 : 12));
      } else {
        aus += "\n"; z++; k = 0;
        feld.innerHTML = aus + '<span class="zeiger"></span>';
        tippUhren.push(setTimeout(takt, eingang ? 380 : 180));
      }
      feld.scrollTop = feld.scrollHeight;
    };
    tippUhren.push(setTimeout(takt, i * 700));
  });
}

/* --- Tafel öffnen und schließen -------------------------------------- */

const tafel = document.getElementById("tafel");
let vorherFokus = null;

function tafelOeffnen(schluessel) {
  const eintrag = TAFELN[schluessel];
  if (!eintrag) return;
  const d = eintrag[sprache];
  vorherFokus = document.activeElement;
  document.getElementById("tafel-marke").textContent = d.marke;
  document.getElementById("tafel-titel").textContent = d.titel;
  document.getElementById("tafel-inhalt").innerHTML = inhaltBauen(d.art, d);
  tafel.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("tafel-zu").focus();
  if (d.art === "konsole") tippenStarten();
}

function tafelSchliessen() {
  tippenAnhalten();
  tafel.hidden = true;
  document.body.style.overflow = "";
  if (vorherFokus && vorherFokus.focus) vorherFokus.focus();
}

document.getElementById("tafel-zu").addEventListener("click", tafelSchliessen);
tafel.addEventListener("click", (e) => { if (e.target === tafel) tafelSchliessen(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !tafel.hidden) tafelSchliessen();
});

/* --- Oberfläche ------------------------------------------------------ */

function oberflaeche() {
  document.documentElement.lang = sprache;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.getElementById("cv-link").href = t("cv.datei");
  document.getElementById("tafel-zu").setAttribute("aria-label", t("zu"));
  const svg = document.querySelector("#szene svg");
  if (svg) svg.setAttribute("aria-label", t("szene.alt"));
  document.querySelectorAll(".sprache button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.lang === sprache));
  });
}

function beschriften() {
  document.querySelectorAll("#szene [data-key]").forEach((teil) => {
    const eintrag = TAFELN[teil.dataset.key];
    if (!eintrag) return;
    const marke = eintrag[sprache].marke;
    const text = teil.querySelector("text");
    if (text) text.textContent = marke;
    teil.setAttribute("aria-label", marke);
  });
}

function knoepfeBauen() {
  const leiste = document.getElementById("tafeln");
  leiste.innerHTML = REIHENFOLGE.map((k) =>
    `<button type="button" data-oeffnen="${k}">${esc(TAFELN[k][sprache].marke)}</button>`).join("");
  leiste.querySelectorAll("[data-oeffnen]").forEach((b) => {
    b.addEventListener("click", () => tafelOeffnen(b.dataset.oeffnen));
  });
}

/* --- Szene ----------------------------------------------------------- */


/* --- Tiefenstaffelung ------------------------------------------------
   Die Ebenen der Szene folgen dem Zeiger unterschiedlich schnell.
   Ferne Hügel wandern mit, der Vordergrund läuft dagegen — das Auge
   liest daraus Tiefe, ohne dass eine 3D-Bibliothek nötig wäre.
   Auf Geräten ohne feinen Zeiger und bei reduzierter Bewegung bleibt
   das Bild ruhig.
   -------------------------------------------------------------------- */

function tiefeAktivieren() {
  const buehne = document.querySelector(".buehne");
  const svg = document.querySelector("#szene svg");
  if (!buehne || !svg) return;

  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)");
  const grob  = window.matchMedia("(pointer: coarse)");
  if (ruhig.matches || grob.matches) return;

  const ebenen = [...svg.querySelectorAll(".ebene")].map((el) => ({
    el, tiefe: parseFloat(el.dataset.tiefe) || 0, x: 0, y: 0, zx: 0, zy: 0
  }));
  if (!ebenen.length) return;

  let laeuft = false;

  function schritt() {
    let bewegung = false;
    for (const e of ebenen) {
      e.x += (e.zx - e.x) * 0.08;
      e.y += (e.zy - e.y) * 0.08;
      if (Math.abs(e.zx - e.x) > 0.01 || Math.abs(e.zy - e.y) > 0.01) bewegung = true;
      e.el.setAttribute("transform", `translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})`);
    }
    if (bewegung) requestAnimationFrame(schritt);
    else laeuft = false;
  }

  function anstossen() {
    if (!laeuft) { laeuft = true; requestAnimationFrame(schritt); }
  }

  buehne.addEventListener("pointermove", (ev) => {
    const kasten = buehne.getBoundingClientRect();
    const ax = (ev.clientX - kasten.left) / kasten.width  - 0.5;
    const ay = (ev.clientY - kasten.top)  / kasten.height - 0.5;
    for (const e of ebenen) { e.zx = ax * e.tiefe; e.zy = ay * e.tiefe * 0.4; }
    anstossen();
  });

  buehne.addEventListener("pointerleave", () => {
    for (const e of ebenen) { e.zx = 0; e.zy = 0; }
    anstossen();
  });
}

function szeneVerdrahten() {
  document.querySelectorAll("#szene [data-key]").forEach((teil) => {
    teil.setAttribute("tabindex", "0");
    teil.setAttribute("role", "button");
    teil.addEventListener("click", () => tafelOeffnen(teil.dataset.key));
    teil.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tafelOeffnen(teil.dataset.key); }
    });
  });
  beschriften();
  oberflaeche();
  tiefeAktivieren();
}

async function szeneLaden() {
  const host = document.getElementById("szene");
  try {
    const antwort = await fetch("assets/img/szene.svg");
    if (!antwort.ok) throw new Error(antwort.status);
    host.innerHTML = await antwort.text();
  } catch {
    host.innerHTML = '<img src="assets/img/szene.svg" alt="' + t("szene.alt") + '" style="width:100%;height:auto">';
    const h = document.querySelector(".hinweis");
    if (h) h.remove();
    return;
  }
  szeneVerdrahten();
}

/* --- Umschalten ------------------------------------------------------- */

function spracheSetzen(neu) {
  if (!SPRACHEN.includes(neu) || neu === sprache) return;
  sprache = neu;
  try { localStorage.setItem(SPEICHER, neu); } catch { /* egal */ }
  oberflaeche();
  beschriften();
  knoepfeBauen();
  if (!tafel.hidden) tafelSchliessen();
}

document.querySelectorAll(".sprache button").forEach((b) => {
  b.addEventListener("click", () => spracheSetzen(b.dataset.lang));
});

oberflaeche();
knoepfeBauen();
szeneLaden();
