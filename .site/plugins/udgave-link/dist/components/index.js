// Viser et link til den anden udgave af siden.
// Udgaven læses fra SSB_UDGAVE, når siden bygges (se scripts/hent-vault.mjs).
import { h } from "preact"

const css = `
.udgave-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}
.udgave-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  color: var(--darkgray);
  background: var(--light);
  text-decoration: none;
}
.udgave-link a:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}
`

export const UdgaveLink = (opts = {}) => {
  const Component = () => {
    const fuld = (process.env.SSB_UDGAVE || "").trim().toLowerCase() === "fuld"
    const url = fuld ? opts.offentligUrl : opts.arrangoerUrl
    const tekst = fuld ? opts.offentligTekst || "Se den offentlige udgave" : opts.arrangoerTekst || "Arrangøradgang"
    if (!url) return null
    return h("div", { class: "udgave-link" }, h("a", { href: url, rel: "noopener" }, (fuld ? "← " : "🔒 ") + tekst))
  }
  Component.css = css
  return Component
}
