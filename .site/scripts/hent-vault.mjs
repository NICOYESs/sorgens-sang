// Kopierer Obsidian-vaulten (mappen over .site) ind i .site/content, som Quartz bygger fra.
// Mapper og filer, der starter med punktum (.obsidian, .site, .git osv.), springes over.
// Vaultens Forside.md bliver til index.md, som er sitets startside, og får titlen Forside.
//
// Udgaver (miljøvariablen SSB_UDGAVE):
//   offentlig (standard)  Al spillederviden fjernes, så den slet ikke findes i den byggede side:
//                         - mappen Sandheden og noter med tagget ssb/sandhed eller "spillederviden: true"
//                         - alle [!sandhed]-bokse
//                         - alt mellem %% kun-arrangør %% og %% /kun-arrangør %%
//                         - listepunkter og tabelrækker, der linker til en fjernet note
//                         - personkort på kortet, der linker til en fjernet note
//   fuld                  Alt kommer med. Bruges til arrangørsiden bag Cloudflare Access.
//
// SSB_BASEURL kan sættes til sidens adresse (fx sorgens-sang-arrangoer.pages.dev).
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs"
import { basename, join, relative, resolve } from "node:path"

const udgave = (process.env.SSB_UDGAVE || "offentlig").trim().toLowerCase()
const fuld = udgave === "fuld"
const vault = resolve("..")
const content = resolve("content")

rmSync(content, { recursive: true, force: true })
mkdirSync(content)

const skjult = (sti) => relative(vault, sti).split(/[\\/]/).some((del) => del.startsWith("."))
let antal = 0
for (const navn of readdirSync(vault)) {
  if (navn.startsWith(".")) continue
  cpSync(join(vault, navn), join(content, navn), { recursive: true, filter: (src) => !skjult(src) })
  antal++
}

function alleFiler(mappe) {
  const ud = []
  for (const navn of readdirSync(mappe)) {
    const sti = join(mappe, navn)
    if (statSync(sti).isDirectory()) ud.push(...alleFiler(sti))
    else ud.push(sti)
  }
  return ud
}

const frontmatter = (tekst) => (tekst.startsWith("---\n") ? tekst.slice(4, tekst.indexOf("\n---", 4)) : "")

let fjernet = []
if (!fuld) {
  // 1. Find de noter, der er spillederviden i sig selv.
  const navne = new Set()
  for (const sti of alleFiler(content).filter((s) => s.endsWith(".md"))) {
    const rel = relative(content, sti)
    const fm = frontmatter(readFileSync(sti, "utf8"))
    const hemmelig =
      rel.split(/[\\/]/)[0] === "Sandheden" ||
      /^tags:.*\bssb\/sandhed\b/m.test(fm) ||
      /^spillederviden:\s*true\s*$/m.test(fm)
    if (!hemmelig) continue
    navne.add(basename(sti, ".md").toLowerCase())
    const alias = fm.match(/^aliases:\s*\[(.*)\]/m)
    if (alias) alias[1].split(",").forEach((a) => navne.add(a.trim().toLowerCase()))
    rmSync(sti)
    fjernet.push(rel)
  }
  const sandheden = join(content, "Sandheden")
  if (existsSync(sandheden) && alleFiler(sandheden).length === 0) rmSync(sandheden, { recursive: true })

  const linkMaal = (inde) => inde.split("|")[0].split("#")[0].replace(/\\$/, "").trim().toLowerCase()
  const linkerTilFjernet = (linje) =>
    [...linje.matchAll(/!?\[\[([^\]]+)\]\]/g)].some((m) => navne.has(linkMaal(m[1])))

  // 2. Rens de noter, der er tilbage.
  const rens = (tekst) => {
    // Blokke markeret kun til arrangører
    tekst = tekst.replace(/%%\s*kun-arrangør\s*%%[\s\S]*?%%\s*\/kun-arrangør\s*%%\n?/g, "")
    // Obsidian-kommentarer
    tekst = tekst.replace(/%%[\s\S]*?%%/g, "")
    const ud = []
    const linjer = tekst.split("\n")
    for (let i = 0; i < linjer.length; i++) {
      const l = linjer[i]
      // [!sandhed]-bokse: overskriften og alle følgende linjer, der starter med >
      if (/^>\s*\[!sandhed\]/i.test(l)) {
        while (i + 1 < linjer.length && /^>/.test(linjer[i + 1])) i++
        continue
      }
      if (linkerTilFjernet(l) && (/^\s*([-*+]|\d+\.)\s/.test(l) || /^\s*\|/.test(l) || /^\s*!\[\[/.test(l))) continue
      // Øvrige links til fjernede noter bliver til almindelig tekst
      ud.push(
        l.replace(/!?\[\[([^\]]+)\]\]/g, (hele, inde) => {
          if (!navne.has(linkMaal(inde))) return hele
          const [maal, vist] = inde.split("|")
          return (vist ?? maal.split("#")[0]).replace(/\\$/, "")
        }),
      )
    }
    // Overskrifter, der står tomme tilbage, fjernes
    const ren = []
    for (let i = 0; i < ud.length; i++) {
      const m = ud[i].match(/^(#{1,6})\s/)
      if (m) {
        let j = i + 1
        while (j < ud.length && ud[j].trim() === "") j++
        const naeste = j < ud.length ? ud[j].match(/^(#{1,6})\s/) : null
        if (j >= ud.length || (naeste && naeste[1].length <= m[1].length)) continue
      }
      ren.push(ud[i])
    }
    return ren.join("\n").replace(/\n{3,}/g, "\n\n")
  }

  const rensKort = (tekst) => {
    const json = tekst.match(/```json\n([\s\S]*?)\n```/)
    if (!json) return tekst
    const data = JSON.parse(json[1])
    const vaek = new Set()
    for (const el of data.elements) {
      const m = (el.link || "").match(/^\[\[([^\]]+)\]\]$/)
      if (m && navne.has(linkMaal(m[1]))) vaek.add(el.id)
    }
    for (const el of data.elements) if (el.containerId && vaek.has(el.containerId)) vaek.add(el.id)
    if (vaek.size === 0) return tekst
    data.elements = data.elements.filter((el) => !vaek.has(el.id))
    tekst = tekst.replace(json[0], "```json\n" + JSON.stringify(data, null, 1) + "\n```")
    return tekst.replace(/(## Text Elements\n)([\s\S]*?)(\n## )/, (hele, start, blokke, slut) => {
      const behold = blokke.split("\n\n").filter((b) => {
        const id = b.trim().match(/\^(\S+)$/)
        return !(id && vaek.has(id[1]))
      })
      return start + behold.join("\n\n") + slut
    })
  }

  for (const sti of alleFiler(content).filter((s) => s.endsWith(".md"))) {
    const tekst = readFileSync(sti, "utf8")
    writeFileSync(sti, sti.endsWith(".excalidraw.md") ? rensKort(tekst) : rens(tekst))
  }
}

if (existsSync(join(content, "Forside.md"))) {
  const index = join(content, "index.md")
  renameSync(join(content, "Forside.md"), index)
  // Uden en titel ville startsiden hedde "index" på sitet.
  const tekst = readFileSync(index, "utf8")
  if (tekst.startsWith("---\n") && !/^title:/m.test(frontmatter(tekst))) {
    writeFileSync(index, "---\ntitle: Forside\n" + tekst.slice(4))
  }
} else {
  console.warn("Advarsel: Forside.md blev ikke fundet i vaulten")
}

// Sidens titel og adresse afhænger af udgaven.
const config = resolve("quartz.config.yaml")
let cfg = readFileSync(config, "utf8")
if (fuld) cfg = cfg.replace(/^(\s*pageTitleSuffix:).*$/m, '$1 " · Arrangører"')
if (process.env.SSB_BASEURL) cfg = cfg.replace(/^(\s*baseUrl:).*$/m, "$1 " + process.env.SSB_BASEURL.trim())
writeFileSync(config, cfg)

console.log("Udgave: " + (fuld ? "fuld (arrangører)" : "offentlig"))
console.log("Vaulten er hentet ind i content/ (" + antal + " mapper og filer)")
if (fjernet.length) console.log("Spillederviden fjernet: " + fjernet.join(", "))
