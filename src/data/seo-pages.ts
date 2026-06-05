import { MAISONLOOKS_URL } from "./site";

export const seoPages = [
  {
    slug: "usfans-spreadsheet",
    keyword: "USFans spreadsheet",
    title: "USFans Spreadsheet - Streetwear Finds & Agent Shopping Links",
    description:
      "Browse a USFans spreadsheet index for streetwear finds, W2C links, agent shopping notes, QC checks, sneakers, hoodies, jackets, denim, bags, and accessories.",
    h1: "USFans spreadsheet for streetwear finds",
    intro:
      "This page targets shoppers looking for a cleaner USFans spreadsheet experience: streetwear categories, W2C links, buying notes, price bands, QC checks, and agent-ready haul planning.",
    related: ["USFans finds", "USFans links", "streetwear spreadsheet", "W2C spreadsheet"],
  },
  {
    slug: "usfans-finds",
    keyword: "USFans finds",
    title: "USFans Finds - Curated Streetwear Picks for Agent Hauls",
    description:
      "Find USFans spreadsheet streetwear picks for sneakers, hoodies, jackets, bags, accessories, W2C searches, QC notes, and agent shopping workflows.",
    h1: "USFans finds for your next streetwear haul",
    intro:
      "Use this index to scan popular streetwear find categories, compare spreadsheet notes, and organize agent shopping ideas by style and product intent.",
    related: ["USFans spreadsheet", "W2C finds", "agent finds", "streetwear finds"],
  },
  {
    slug: "usfans-agent",
    keyword: "USFans agent",
    title: "USFans Agent Guide - Search, Compare & Build Better Hauls",
    description:
      "A USFans agent shopping guide for finding streetwear links, checking QC priorities, and building cleaner international shopping lists.",
    h1: "USFans agent shopping guide",
    intro:
      "Agent shoppers need more than random links. This guide organizes search intent, category checks, QC priorities, and spreadsheet-style haul planning into one flow.",
    related: ["agent shopping", "USFans guide", "QC photos", "streetwear agent"],
  },
  {
    slug: "w2c-streetwear",
    keyword: "W2C streetwear",
    title: "W2C Streetwear - Find Agent-Friendly Streetstyle Links",
    description:
      "Search W2C streetwear ideas, USFans spreadsheet picks, agent-friendly categories, QC notes, and haul planning links for streetwear shoppers.",
    h1: "W2C streetwear links and search ideas",
    intro:
      "This landing page is built for W2C searches around streetwear, sneakers, hoodies, jackets, denim, bags, and accessories.",
    related: ["W2C sneakers", "W2C hoodie", "streetwear links", "agent spreadsheet"],
  },
  {
    slug: "streetwear-spreadsheet",
    keyword: "streetwear spreadsheet",
    title: "Streetwear Spreadsheet - Sneakers, Hoodies, Jackets & Bags",
    description:
      "A streetwear spreadsheet index for shoppers who want faster category scanning, W2C links, agent notes, QC checks, and organized haul research.",
    h1: "Streetwear spreadsheet for fast category scanning",
    intro:
      "Use this page as a search-friendly streetwear spreadsheet hub with category rows, price bands, and practical agent shopping notes.",
    related: ["streetwear finds", "streetwear agent", "USFans spreadsheet", "MaisonLooks streetstyle"],
  },
  {
    slug: "maisonlooks-streetstyle",
    keyword: "MaisonLooks Streetstyle",
    title: "MaisonLooks Streetstyle - Search Streetwear Finds Faster",
    description:
      "Explore MaisonLooks Streetstyle from a USFans spreadsheet context built around streetwear discovery, W2C search, QC notes, and agent shopping workflows.",
    h1: "MaisonLooks Streetstyle search hub",
    intro:
      "This page introduces MaisonLooks Streetstyle to shoppers already searching for USFans finds, W2C links, spreadsheets, and agent-ready streetwear ideas.",
    related: ["MaisonLooks", "streetstyle search", "AI try on streetwear", "W2C search"],
  },
];

export function buildSeoSchema(page: (typeof seoPages)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${page.keyword}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${page.keyword} refers to shoppers searching for curated streetwear links, spreadsheet-style product lists, and agent-friendly buying workflows.`,
        },
      },
      {
        "@type": "Question",
        name: "Where should I continue searching?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Continue discovery on MaisonLooks Streetstyle at ${MAISONLOOKS_URL}`,
        },
      },
    ],
  };
}
