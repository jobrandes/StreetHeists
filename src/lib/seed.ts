import type { CaseFile } from "./types";

export const PLAYER_DEFAULT_ALIAS = "Detective";

export const pigeonCase: CaseFile = {
  id: "pigeon-job",
  number: 7,
  title: "The Pigeon Job",
  subtitle: "A missing ceremonial baguette. Four persons of interest.",
  premise:
    "At 12:07, the ceremonial baguette disappeared from Café Paloma’s open service window. Review the provided stills and documents, then name who took it, how, and where it is now.",
  suspects: [
    {
      id: "marcel",
      name: "Marcel",
      role: "Plaza pigeon · known regular",
      personality: "Often near the café sill. Red leg band. Avoids handlers.",
    },
    {
      id: "celine",
      name: "Céline Croissant",
      role: "Pastry chef",
      personality: "On shift at the service window. Strong motive to protect inventory.",
    },
    {
      id: "inspector-brie",
      name: "Inspector Brie",
      role: "Health inspector",
      personality: "Across the plaza during the window. Keeps timed paper trails.",
    },
    {
      id: "nico",
      name: "Nico Deux-Sucres",
      role: "Street performer",
      personality: "Working the plaza. Gave a silent demonstration of what he saw.",
    },
  ],
  evidence: [
    {
      id: "open-window",
      title: "Service Window Still",
      kind: "still",
      caption: "Evidence #1 — Open service window",
      timestamp: "12:06",
      location: "Café Paloma · plaza counter",
      kicker: "Café security · 12:06",
      description:
        "One minute before the loss, the baguette sits inside an open service window. A striped awning cord hangs beside the sill within reach from the plaza.",
      deduction: "Someone could take the baguette from outside without entering the café.",
      visual: "window",
      linkedSuspectIds: ["celine"],
      howHint: "Reach-through from the plaza",
      whereHint: "Café service window",
    },
    {
      id: "crumb-trail",
      title: "Crumb Trail Still",
      kind: "still",
      caption: "Evidence #2 — Crumb trail",
      timestamp: "12:08",
      location: "North fountain · plaza",
      kicker: "Plaza camera · 12:08",
      description:
        "A trail of crumbs runs from the café sill across the stones and stops under the north fountain statue.",
      deduction: "The baguette was moved from the café toward the fountain.",
      visual: "crumbs",
      howHint: "Carried across the plaza",
      whereHint: "Path ends at fountain",
    },
    {
      id: "blue-feather",
      title: "Trace Lab Slip",
      kind: "document",
      caption: "Evidence #3 — Feather and awning thread",
      timestamp: "12:09",
      location: "Café Paloma · service sill",
      kicker: "Municipal lab · Item 03",
      description:
        "A blue-grey contour feather and a loop of red awning thread were recovered together on the sill.",
      deduction: "A bird used the awning cord at the open window.",
      visual: "feather",
      linkedSuspectIds: ["marcel"],
      howHint: "Awning cord used as leverage",
      whereHint: "Café sill",
    },
    {
      id: "statue-nest",
      title: "Fountain Telephoto Still",
      kind: "still",
      caption: "Evidence #4 — Nest on the statue",
      timestamp: "12:11",
      location: "North fountain · bronze laurel",
      kicker: "Surveillance · 12:11",
      description:
        "A baguette heel sits in a nest behind the statue’s bronze laurel. A pigeon with a red leg band is in frame.",
      deduction: "The missing loaf is in that nest.",
      visual: "fountain",
      linkedSuspectIds: ["marcel"],
      howHint: "Stashed after the carry",
      whereHint: "Fountain statue nest",
    },
    {
      id: "receipt",
      title: "Inspector’s Receipt",
      kind: "document",
      caption: "Evidence #5 — Timed pharmacy receipt",
      timestamp: "12:04–12:12",
      location: "Pharmacie du Plaza",
      kicker: "Pharmacy till · 12:04–12:12",
      description:
        "A receipt places Inspector Brie buying thermometers across the plaza for the full window around 12:07.",
      deduction: "Brie was not at the café sill when the baguette vanished.",
      visual: "receipt",
      linkedSuspectIds: ["inspector-brie"],
      howHint: "Alibi by timestamp",
      whereHint: "Pharmacy across plaza",
    },
    {
      id: "witness",
      title: "Witness Interview Notes",
      kind: "note",
      caption: "Evidence #6 — Nico’s account",
      timestamp: "12:14",
      location: "Plaza interview bench",
      kicker: "Interview · gesture demo",
      description:
        "Nico demonstrates a tug on a hanging cord, a lift from the sill, then a flight line toward the fountain.",
      deduction: "The theft used the awning cord, then went fountainward.",
      visual: "witness",
      linkedSuspectIds: ["nico", "marcel"],
      howHint: "Cord tug, then lift and fly",
      whereHint: "Toward the fountain",
    },
  ],
  howChoices: [
    {
      id: "window-cord",
      label: "Awning cord + reach-through",
      detail: "Tug the cord, take the loaf through the open window, leave during the distraction.",
    },
    {
      id: "inside-job",
      label: "Inside job from the kitchen",
      detail: "Staff removes it from inside and hides it in back-of-house.",
    },
    {
      id: "mime-tunnel",
      label: "Hidden handoff in the crowd",
      detail: "A plaza performer conceals a pass to an accomplice.",
    },
    {
      id: "inspection-bag",
      label: "Confiscated in an inspection bag",
      detail: "Taken under a health-inspection pretext.",
    },
  ],
  whereChoices: [
    {
      id: "statue-nest",
      label: "Fountain statue nest",
      detail: "Behind the bronze laurel above the north basin.",
    },
    {
      id: "pastry-freezer",
      label: "Café pastry freezer",
      detail: "Back-of-house cold storage.",
    },
    {
      id: "mime-box",
      label: "Performer’s prop case",
      detail: "Hidden among plaza performance gear.",
    },
    {
      id: "inspection-van",
      label: "Inspector’s van",
      detail: "Parked near the pharmacy.",
    },
  ],
  solution: {
    who: "marcel",
    how: "window-cord",
    where: "statue-nest",
  },
  explanation: [
    "The feather and red awning thread place a bird at the open service window using the cord.",
    "The crumb trail runs from that sill to the north fountain statue.",
    "The telephoto still shows the baguette in the statue nest beside a red leg band.",
  ],
};

export const moreCases = [
  { title: "The Velvet Teaspoon", label: "Coming soon · Case 12" },
  { title: "Murder on the Dessert Trolley", label: "Coming soon · Case 18" },
];
