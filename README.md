# Sandets Sang og Sorgens Sang

Opslagsværket om Sandets Sangs Broderskab og Sorgens Sangs Broderskab i Nirahamverdenen, bygget med [Quartz](https://quartz.jzhao.xyz) ud fra en Obsidian-vault og udgivet med Cloudflare Pages.

## Indhold

Alt indhold ligger i mappen `content/` og er en kopi af Obsidian-vaulten. Den eneste forskel er, at vaultens `Forside.md` hedder `index.md` her, fordi det er sitets startside.

## Cloudflare Pages

| Indstilling | Værdi |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npx quartz plugin install && node scripts/dansk.mjs && npx quartz build` |
| Build output directory | `public` |

`scripts/dansk.mjs` tilføjer dansk til Quartz-pluginsenes knapper og overskrifter.

## Opdatering

1. Kopiér vaultens mapper ind i `content/` og overskriv de gamle filer.
2. Omdøb `Forside.md` til `index.md`.
3. Commit og push til GitHub. Cloudflare bygger og udgiver siden automatisk.

## Lokal forhåndsvisning

```bash
npm ci
npx quartz plugin install
node scripts/dansk.mjs
npx quartz build --serve
```
