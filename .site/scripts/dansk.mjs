// Tilføjer dansk (da-DK) til de oversættelser, som Quartz-pluginsene har bundtet.
// Køres efter "npx quartz plugin install" og før "npx quartz build".
// Scriptet kan køres flere gange uden at gøre skade.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "node:fs"
import { join } from "node:path"

const DA_SRC = "{\n  propertyDefaults: {\n    title: \"Uden navn\",\n    description: \"Ingen beskrivelse\",\n  },\n  components: {\n    callout: {\n      note: \"Note\",\n      abstract: \"Resumé\",\n      info: \"Info\",\n      todo: \"Huskeliste\",\n      tip: \"Tip\",\n      success: \"Udført\",\n      question: \"Spørgsmål\",\n      warning: \"Advarsel\",\n      failure: \"Fejl\",\n      danger: \"Fare\",\n      bug: \"Fejl\",\n      example: \"Eksempel\",\n      quote: \"Citat\",\n    },\n    backlinks: {\n      title: \"Henvisninger hertil\",\n      noBacklinksFound: \"Ingen henvisninger fundet\",\n    },\n    themeToggle: {\n      lightMode: \"Lyst tema\",\n      darkMode: \"Mørkt tema\",\n    },\n    readerMode: {\n      title: \"Læsetilstand\",\n    },\n    explorer: {\n      title: \"Indhold\",\n    },\n    footer: {\n      createdWith: \"Lavet med\",\n    },\n    graph: {\n      title: \"Forbindelser\",\n    },\n    recentNotes: {\n      title: \"Seneste noter\",\n      seeRemainingMore: ({ remaining }) => `Se ${remaining} mere →`,\n    },\n    transcludes: {\n      transcludeOf: ({ targetSlug }) => `Indlejring af ${targetSlug}`,\n      linkToOriginal: \"Link til original\",\n    },\n    search: {\n      title: \"Søg\",\n      searchBarPlaceholder: \"Søg i opslagsværket\",\n    },\n    tableOfContents: {\n      title: \"Indhold\",\n    },\n    contentMeta: {\n      readingTime: ({ minutes }) => `${minutes} min. læsning`,\n    },\n  },\n  pages: {\n    rss: {\n      recentNotes: \"Seneste noter\",\n      lastFewNotes: ({ count }) => `De seneste ${count} noter`,\n    },\n    error: {\n      title: \"Ikke fundet\",\n      notFound: \"Siden findes ikke, eller den er privat.\",\n      home: \"Tilbage til forsiden\",\n    },\n    folderContent: {\n      folder: \"Mappe\",\n      itemsUnderFolder: ({ count }) =>\n        count === 1 ? \"1 side i denne mappe.\" : `${count} sider i denne mappe.`,\n    },\n    tagContent: {\n      tag: \"Tag\",\n      tagIndex: \"Tag-oversigt\",\n      itemsUnderTag: ({ count }) =>\n        count === 1 ? \"1 side med dette tag.\" : `${count} sider med dette tag.`,\n      showingFirst: ({ count }) => `Viser de første ${count} tags.`,\n      totalTags: ({ count }) => `${count} tags i alt.`,\n    },\n  },\n}"

const MARKER = '"nb-NO": nb_NO_default,'
const roots = ["node_modules/@quartz-community", ".quartz/plugins"]
let patched = 0

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith(".js")) {
      const t = readFileSync(p, "utf8")
      if (!t.includes(MARKER) || t.includes('"da-DK":')) continue
      writeFileSync(p, t.replace(MARKER, MARKER + ' "da-DK": (' + DA_SRC + "),"))
      patched++
    }
  }
}
for (const r of roots) if (existsSync(r)) walk(r)
console.log("Dansk tilføjet i " + patched + " plugin-filer")
