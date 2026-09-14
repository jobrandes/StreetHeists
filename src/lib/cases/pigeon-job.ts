import type { CaseFile } from "@/lib/types";

/** Case 07 — tutorial physical trail. */
export const pigeonCase: CaseFile = {
  id: "pigeon-job",
  number: 7,
  title: "The Pigeon Job",
  subtitle: "~4 min tutorial — inspect, link one pair, accuse.",
  premise:
    "At 12:07, Café Paloma’s ceremonial baguette did what baguettes should never do: it left. Not with dignity — with crumbs, a cord, and a pigeon who treats open windows like a career ladder. Name who took it, how, and where the loaf is moonlighting now.",

  difficulty: "tutorial",
  briefing: [
    {
      title: "THE SETUP",
      copy: "Café Paloma’s plaza festival hung a ceremonial baguette in the open service window — a silly tradition, until it vanished at 12:07. The café did not close; the plaza did not empty; someone simply took the loaf.",
    },
    {
      title: "THE STREET",
      copy: "Four regulars were in play: Marcel the banded pigeon, chef Céline at the sill, Inspector Brie across the plaza with her timed receipts, and Nico the performer miming what he saw. Crumbs, cord, and a nest will matter more than gossip.",
    },
    {
      title: "YOUR JOB",
      copy: "~4 minutes. Inspect a few clues, string ONE sound pair on the corkboard to unlock the deduction card, then Accuse. This is the tutorial — not the forever hero case.",
    },
  ],
  reconstruction: {
    title: "Plaza Decide draft",
    intro: "Fill Who / How / Where while you keep reading Gather. Wrong picks still show — catch a bad theory before you Accuse.",
    slots: [
      {
        id: "who",
        label: "Who reached the sill",
        prompt: "Who actually took the baguette?",
        options: [
          { id: "marcel", label: "Marcel", detail: "Banded plaza pigeon" },
          { id: "celine", label: "Céline", detail: "Pastry chef on shift" },
          { id: "inspector-brie", label: "Inspector Brie", detail: "Health inspector" },
          { id: "nico", label: "Nico", detail: "Street performer" },
        ],
        correctOptionId: "marcel",
        sceneLineByOption: {
          marcel: "A banded pigeon works the open sill from the plaza side.",
          celine: "The chef leans from inside the window — an inside lift.",
          "inspector-brie": "The inspector steps to the sill with an official bag.",
          nico: "The performer reaches through the crowd toward the loaf.",
        },
      },
      {
        id: "how",
        label: "How it left",
        prompt: "How did the loaf leave the window?",
        options: [
          { id: "window-cord", label: "Awning cord + reach-through", detail: "Tug, lift, go" },
          { id: "inside-job", label: "Inside kitchen lift", detail: "Staff pull from behind" },
          { id: "mime-tunnel", label: "Crowd handoff", detail: "Hidden plaza pass" },
          { id: "inspection-bag", label: "Inspection confiscation", detail: "Taken under pretext" },
        ],
        correctOptionId: "window-cord",
        sceneLineByOption: {
          "window-cord": "An awning cord becomes a handhold; the loaf slides out through the open window.",
          "inside-job": "Hands from the kitchen pull the loaf back into the café.",
          "mime-tunnel": "A plaza pass hides the loaf in the festival crowd.",
          "inspection-bag": "An official bag swallows the loaf at the sill.",
        },
      },
      {
        id: "where",
        label: "Where it landed",
        prompt: "Where is the baguette now?",
        options: [
          { id: "statue-nest", label: "Fountain statue nest", detail: "Bronze laurel" },
          { id: "pastry-freezer", label: "Pastry freezer", detail: "Back-of-house" },
          { id: "mime-box", label: "Performer’s prop case", detail: "Plaza gear" },
          { id: "inspection-van", label: "Inspector’s van", detail: "Near the pharmacy" },
        ],
        correctOptionId: "statue-nest",
        sceneLineByOption: {
          "statue-nest": "A crumb line ends at the north fountain — the loaf sits in a nest behind the bronze laurel.",
          "pastry-freezer": "The trail bends back into the café cold storage.",
          "mime-box": "The trail ends at a performer’s prop case on the plaza.",
          "inspection-van": "The trail points toward a van parked by the pharmacy.",
        },
      },
    ],
  },
  suspects: [
    {
      id: "marcel",
      name: "Marcel",
      role: "Plaza pigeon · known regular",
      personality: "Red leg band, café loyalty program, zero respect for glassware. Treats sill height like a business plan.",
    },
    {
      id: "celine",
      name: "Céline Croissant",
      role: "Pastry chef",
      personality: "Will invent new pastry crimes before admitting a bird outplayed her window protocol.",
    },
    {
      id: "inspector-brie",
      name: "Inspector Brie",
      role: "Health inspector",
      personality: "Timed receipts, clipboard posture, and a gift for looking guilty while buying nothing.",
    },
    {
      id: "nico",
      name: "Nico Deux-Sucres",
      role: "Street performer",
      personality: "Silent on principle. Demonstrates crimes he definitely did not commit, allegedly.",
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
      imageSrc: "/evidence/pigeon-job/open-window.jpg",
      imageStamp: "12:06 · CAFÉ PALOMA · SERVICE WINDOW",
      visualTell: "Open sill with the baguette + hanging awning cord within reach.",
      linkedSuspectIds: ["celine"],
      howHint: "Reach-through from the plaza",
      whereHint: "Café service window",

      hotspots: [
        {
          id: "awning-cord",
          x: 22,
          y: 48,
          label: "Awning cord",
          reveal: "The striped awning cord hangs within reach of the open sill — a ready handhold from the plaza.",
        },
      ],
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
      imageSrc: "/evidence/pigeon-job/crumb-trail.jpg",
      imageStamp: "12:08 · PLAZA CAM · CRUMB TRAIL",
      visualTell: "Crumb line runs from the café toward the fountain.",
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
      imageSrc: "/evidence/pigeon-job/blue-feather.jpg",
      imageStamp: "12:09 · MUNICIPAL LAB · ITEM 03",
      visualTell: "Blue-grey feather recovered with a loop of red awning thread.",
      linkedSuspectIds: ["marcel"],
      howHint: "Awning cord used as leverage",
      whereHint: "Café sill",

      analysis: {
        prompt: "What do you send to the municipal lab?",
        inspectDelay: 1,
        samples: [
          {
            id: "red-thread",
            label: "Red thread loop",
            detail: "The fiber recovered with the feather",
          },
          {
            id: "whole-feather",
            label: "Whole contour feather",
            detail: "Bird ID only — skips the fiber question",
          },
          {
            id: "sill-dust",
            label: "Sill dust scrapings",
            detail: "General residue from the service window",
          },
          {
            id: "crumb-scrap",
            label: "Crumb scrap from the sill",
            detail: "Bakery waste — unlikely to name a method",
          },
        ],
        correctSampleId: "red-thread",
        wrongSampleResponse:
          "Lab queues it, then shrugs — that sample doesn’t answer how the loaf left. Pick something else from this slip.",
        resultTitle: "Lab return · fiber match",
        resultText:
          "Municipal lab: the red thread is a spectroscopic match for Café Paloma’s awning cord. Contour feather is Columba livia (street pigeon).",
      },
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
      imageSrc: "/evidence/pigeon-job/statue-nest.jpg",
      imageStamp: "12:11 · TELEPHOTO · FOUNTAIN NEST",
      visualTell: "Baguette heel in the nest beside a pigeon with a red leg band.",
      linkedSuspectIds: ["marcel"],
      howHint: "Stashed after the carry",
      whereHint: "Fountain statue nest",

      hotspots: [
        {
          id: "red-band",
          x: 68,
          y: 55,
          label: "Red leg band",
          reveal: "A bright red plastic leg band marks this pigeon — the same regular seen around Café Paloma.",
        },
      ],
    },
    {
      id: "receipt",
      title: "Inspector’s Receipt",
      kind: "document",
      caption: "Evidence #5 — Timed pharmacy receipt",
      timestamp: "12:04–12:12",
      location: "Plaza Pharmacy",
      kicker: "Pharmacy till · 12:04–12:12",
      description:
        "A receipt places Inspector Brie buying thermometers across the plaza for the full window around 12:07.",
      deduction: "Brie was not at the café sill when the baguette vanished.",
      imageSrc: "/evidence/pigeon-job/receipt.jpg",
      imageStamp: "12:04–12:12 · PLAZA PHARMACY",
      visualTell: "Inspector Brie stamped on-site at the pharmacy for the whole theft window.",
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
      imageSrc: "/evidence/pigeon-job/witness.jpg",
      imageStamp: "12:14 · INTERVIEW BENCH · NICO",
      visualTell: "Gesture sequence: tug cord → lift loaf → fly line toward fountain.",
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

  solutionEvidence: {
    who: ["statue-nest", "blue-feather"],
    how: ["open-window", "blue-feather", "witness"],
    where: ["statue-nest", "crumb-trail"],
  },
  confrontations: [
    {
      id: "marcel-window",
      suspectId: "marcel",
      claim: "I never went near that café window. I was on the fountain ledge the whole time.",
      correctEvidenceId: "blue-feather",
      successResponse:
        "Marcel ruffles. The lab-linked feather and awning thread put him at the sill — he stops denying the window.",
      failureResponse:
        "Marcel shrugs it off. That exhibit doesn’t pin him to the window.",
    },
    {
      id: "brie-cafe",
      suspectId: "inspector-brie",
      claim: "I was right there at Café Paloma when the loaf vanished.",
      correctEvidenceId: "receipt",
      successResponse:
        "Brie’s clipped tone breaks. The pharmacy receipt parks her across the plaza for the whole window.",
      failureResponse:
        "Brie stays cool. That piece doesn’t move her off the café story.",
    },
  ],


  deductionChains: [
    {
      id: "trail-to-nest",
      title: "Trail to the nest",
      requiredEvidenceIds: ["crumb-trail", "statue-nest"],
      correctPairs: [["crumb-trail", "statue-nest"]],
      pairsRequired: 1,
      insight:
        "Crumbs run fountainward and the nest holds the loaf beside Marcel’s red band — the trail ends on the statue.",
      missHint: "Try a trail clue with a place clue (crumbs → nest).",
    },
  ],
  chainsRequiredToAccuse: 1,
  explanation: [
    "The feather and red awning thread place a bird at the open service window using the cord.",
    "The crumb trail runs from that sill to the north fountain statue.",
    "The telephoto still shows the baguette in the statue nest beside a red leg band.",
  ],
};
