import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Uden navn",
    description: "Ingen beskrivelse",
  },
  components: {
    callout: {
      note: "Note",
      abstract: "Resumé",
      info: "Info",
      todo: "Huskeliste",
      tip: "Tip",
      success: "Udført",
      question: "Spørgsmål",
      warning: "Advarsel",
      failure: "Fejl",
      danger: "Fare",
      bug: "Fejl",
      example: "Eksempel",
      quote: "Citat",
    },
    backlinks: {
      title: "Henvisninger hertil",
      noBacklinksFound: "Ingen henvisninger fundet",
    },
    themeToggle: {
      lightMode: "Lyst tema",
      darkMode: "Mørkt tema",
    },
    readerMode: {
      title: "Læsetilstand",
    },
    explorer: {
      title: "Indhold",
    },
    footer: {
      createdWith: "Lavet med",
    },
    graph: {
      title: "Forbindelser",
    },
    recentNotes: {
      title: "Seneste noter",
      seeRemainingMore: ({ remaining }) => `Se ${remaining} mere →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Indlejring af ${targetSlug}`,
      linkToOriginal: "Link til original",
    },
    search: {
      title: "Søg",
      searchBarPlaceholder: "Søg i opslagsværket",
    },
    tableOfContents: {
      title: "Indhold",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} min. læsning`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Seneste noter",
      lastFewNotes: ({ count }) => `De seneste ${count} noter`,
    },
    error: {
      title: "Ikke fundet",
      notFound: "Siden findes ikke, eller den er privat.",
      home: "Tilbage til forsiden",
    },
    folderContent: {
      folder: "Mappe",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 side i denne mappe." : `${count} sider i denne mappe.`,
    },
    tagContent: {
      tag: "Tag",
      tagIndex: "Tag-oversigt",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 side med dette tag." : `${count} sider med dette tag.`,
      showingFirst: ({ count }) => `Viser de første ${count} tags.`,
      totalTags: ({ count }) => `${count} tags i alt.`,
    },
  },
} as const satisfies Translation
