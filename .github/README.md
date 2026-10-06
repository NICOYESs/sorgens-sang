# Sandets Sang og Sorgens Sang

Opslagsværket om Sandets Sangs Broderskab og Sorgens Sangs Broderskab i Nirahamverdenen. Repoet er selve Obsidian-vaulten, og hjemmesiden bygges ud fra den med [Quartz](https://quartz.jzhao.xyz) og udgives med Cloudflare Pages.

## Opbygning

| Sted | Indhold |
|---|---|
| Roden | Obsidian-vaulten: `Forside.md` og mapperne Ordenen, Personer, Verden, Steder, Historie, Myter, Sandheden og Kort |
| `.obsidian/` | Vaultens Obsidian-opsætning med Excalidraw og farverne til myte- og sandhed-boksene |
| `.site/` | Quartz, som laver hjemmesiden. Mappen starter med punktum, så Obsidian ikke viser den |

Ved hver bygning kopierer `.site/scripts/hent-vault.mjs` vaulten ind i `.site/content/`, og `Forside.md` bliver til `index.md`, som er sitets startside. `.site/scripts/dansk.mjs` tilføjer dansk til Quartz-pluginsenes knapper og overskrifter.

## Cloudflare Pages

| Indstilling | Værdi |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | `.site` |
| Build command | `npx quartz plugin install && node scripts/dansk.mjs && node scripts/hent-vault.mjs && npx quartz build` |
| Build output directory | `public` |

## To udgaver

Samme vault bygges som to sider. Udgaven vælges med miljøvariablen `SSB_UDGAVE` i Cloudflare.

| Udgave | `SSB_UDGAVE` | Indhold | Adgang |
|---|---|---|---|
| Offentlig | ikke sat, eller `offentlig` | Wiki og myter. Al spillederviden er fjernet ved bygningen | Alle |
| Arrangører | `fuld` | Alt, også Sandheden og sandhed-boksene | Cloudflare Access, kun e-mails på listen |

Den offentlige udgave fjerner:

- mappen Sandheden og noter med tagget `ssb/sandhed` eller `spillederviden: true` i frontmatter
- alle `[!sandhed]`-bokse
- alt mellem `%% kun-arrangør %%` og `%% /kun-arrangør %%`
- listepunkter, tabelrækker og personkort på kortet, der linker til en fjernet note

`SSB_BASEURL` kan sættes til sidens adresse, fx `sorgens-sang-arrangoer.pages.dev`.

## Opdatering

Ret noterne i Obsidian og synkronisér med Git-pluginet (Obsidian Git). Når ændringerne er på GitHub, bygger Cloudflare siden igen af sig selv.

## Lokal forhåndsvisning

```bash
cd .site
npm ci
npx quartz plugin install
node scripts/dansk.mjs
node scripts/hent-vault.mjs
npx quartz build --serve
```
