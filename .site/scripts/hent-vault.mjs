// Kopierer Obsidian-vaulten (mappen over .site) ind i .site/content, som Quartz bygger fra.
// Mapper og filer, der starter med punktum (.obsidian, .site, .git osv.), springes over.
// Vaultens Forside.md bliver til index.md, som er sitets startside, og får titlen Forside.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const vault = resolve("..")
const content = resolve("content")

rmSync(content, { recursive: true, force: true })
mkdirSync(content)

let antal = 0
for (const navn of readdirSync(vault)) {
  if (navn.startsWith(".")) continue
  cpSync(join(vault, navn), join(content, navn), {
    recursive: true,
    filter: (src) => !src.slice(vault.length + 1).split(/[\\/]/).some((del) => del.startsWith(".")),
  })
  antal++
}

if (existsSync(join(content, "Forside.md"))) {
  const index = join(content, "index.md")
  renameSync(join(content, "Forside.md"), index)
  // Uden en titel ville startsiden hedde "index" på sitet.
  const tekst = readFileSync(index, "utf8")
  if (tekst.startsWith("---\n") && !/^title:/m.test(tekst.split("\n---")[0])) {
    writeFileSync(index, "---\ntitle: Forside\n" + tekst.slice(4))
  }
} else {
  console.warn("Advarsel: Forside.md blev ikke fundet i vaulten")
}

console.log("Vaulten er hentet ind i content/ (" + antal + " mapper og filer)")
