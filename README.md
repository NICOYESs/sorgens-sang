# Sandets Sang og Sorgens Sang

Opslagsværket om Sandets Sangs Broderskab og Sorgens Sangs Broderskab i Nirahamverdenen, bygget med [Quartz](https://quartz.jzhao.xyz) ud fra en Obsidian-vault og udgivet med Cloudflare Workers.

## Indhold

Alt indhold ligger i mappen `content/` og er en kopi af Obsidian-vaulten. Den eneste forskel er, at vaultens `Forside.md` hedder `index.md` her, fordi det er sitets startside.

## Cloudflare Workers

Siden udgives som en Cloudflare Worker med statiske filer. Opsætningen ligger i `wrangler.jsonc`: Worker-navnet, byggekommandoen og mappen `public`, som filerne hentes fra. I Cloudflare skal deploy-kommandoen være `npx wrangler deploy`, og build-feltet kan stå tomt, fordi wrangler selv kører byggekommandoen.

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
