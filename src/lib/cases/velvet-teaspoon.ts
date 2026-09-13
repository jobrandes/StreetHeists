import type { CaseFile } from "@/lib/types";

/**
 * Case 09 — identity-mark + seating fraud.
 * Hook (distinct from pigeon trail / late-fee clocks): a place-card swap
 * "clears" the trophy as dirty serviceware; lipstick shade IDs the pourer
 * who framed a rival via the sugar-caddy stash.
 *
 * JUDGMENT CALL: comedy leans farce-of-manners; Jo may want meaner or softer.
 */
export const velvetTeaspoonCase: CaseFile = {
  id: "velvet-teaspoon",
  number: 9,
  title: "The Velvet Teaspoon",
  subtitle: "A salon trophy vanishes mid-steep. The place cards lied first.",
  premise:
    "At the Gilded Infuser’s Second Steep ceremony, the Velvet Teaspoon — a ridiculous velvet-lined sterling prize for Most Theatrical Pour — vanished from its display nest. Someone cleared it like dirty china. The lipstick on the stash drawer is louder than the guests.",
  difficulty: "hard",
  unlockAfterCaseId: "late-fee",
  briefing: [
    {
      title: "THE SALON",
      copy: "Once a year, Cordelia Clotted awards the Velvet Teaspoon to whoever can make Earl Grey sound like opera. This year the spoon itself became the drama — gone between toast and applause.",
    },
    {
      title: "THE TELL",
      copy: "Place cards moved. A side tray gained a napkin-shaped secret. Madame Roux’s sugar caddy suddenly owns a trophy it shouldn’t. Powder-room shade charts do not lie, even when hosts do.",
    },
    {
      title: "YOUR JOB",
      copy: "Gather every salon still and score card we hand you. Then Decide Who / How / Where with proof. Case file keeps the manners so you don’t have to.",
    },
  ],
  reconstruction: {
    title: "Salon Decide draft",
    intro: "Fill Who / How / Where while you keep Gathering. Wrong theories still preview — catch them before Accuse.",
    slots: [
      {
        id: "who",
        label: "Who took the spoon",
        prompt: "Who cleared the Velvet Teaspoon?",
        options: [
          { id: "cordelia", label: "Cordelia Clotted", detail: "Salon hostess" },
          { id: "pippa", label: "Pippa Steep", detail: "Silent pourer" },
          { id: "basil", label: "Sir Basil Brew", detail: "Tea critic" },
          { id: "roux", label: "Madame Roux", detail: "Rival saloniste" },
        ],
        correctOptionId: "pippa",
        sceneLineByOption: {
          cordelia: "The hostess palms her own prize mid-toast — theatrical, and wrong.",
          pippa: "The quiet pourer lifts the nest like finished china and melts into the pass.",
          basil: "The critic pockets the spoon while scoring someone else’s steep.",
          roux: "The rival smiles too wide and the nest empties toward her table.",
        },
      },
      {
        id: "how",
        label: "How it left the nest",
        prompt: "How did the spoon leave the display?",
        options: [
          {
            id: "place-card-clear",
            label: "Swapped cards · cleared as used service",
            detail: "Nest ‘belongs’ to the wrong cover, then rides a side tray",
          },
          {
            id: "critic-confiscate",
            label: "Critic ‘sample’ confiscation",
            detail: "Taken under tasting-notes pretext",
          },
          {
            id: "hostess-stash",
            label: "Hostess hid it for drama",
            detail: "Cordelia staged a scandal",
          },
          {
            id: "rival-snatch",
            label: "Direct snatch to Roux’s purse",
            detail: "Open grab during applause",
          },
        ],
        correctOptionId: "place-card-clear",
        sceneLineByOption: {
          "place-card-clear":
            "A place-card swap reassigns the nest; the pourer clears it onto a napkin-covered tray.",
          "critic-confiscate": "Basil bags the spoon as a ‘texture sample.’",
          "hostess-stash": "Cordelia spirits the prize away for a later reveal.",
          "rival-snatch": "Roux snatches the spoon in plain sight.",
        },
      },
      {
        id: "where",
        label: "Where it was planted",
        prompt: "Where is the Velvet Teaspoon now?",
        options: [
          {
            id: "sugar-caddy",
            label: "Table 3 sugar-caddy drawer",
            detail: "Madame Roux’s cover — framed",
          },
          {
            id: "basil-notes",
            label: "Inside Basil’s score folio",
            detail: "Critic’s leather folder",
          },
          {
            id: "cordelia-clutch",
            label: "Cordelia’s speech clutch",
            detail: "Hostess handbag",
          },
          {
            id: "pass-drain",
            label: "Kitchen pass drain tray",
            detail: "Back-of-house rinse",
          },
        ],
        correctOptionId: "sugar-caddy",
        sceneLineByOption: {
          "sugar-caddy":
            "The spoon rests in Table 3’s sugar-caddy drawer — lipstick already tattling.",
          "basil-notes": "The spoon hides between tasting pages.",
          "cordelia-clutch": "The prize sits under a speech card in Cordelia’s clutch.",
          "pass-drain": "The spoon waits among rinsed teaspoons on the pass.",
        },
      },
    ],
  },
  suspects: [
    {
      id: "cordelia",
      name: "Cordelia Clotted",
      role: "Salon hostess · trophy owner",
      personality:
        "Speaks in toast-length paragraphs. Would burn the building before admitting a dull steep.",
    },
    {
      id: "pippa",
      name: "Pippa Steep",
      role: "Silent pourer",
      personality:
        "Hired to be invisible. Wears Opera Rose like a dare. Circles tables that aren’t hers.",
    },
    {
      id: "basil",
      name: "Sir Basil Brew",
      role: "Tea critic",
      personality:
        "Scores pours out of 10 and people out of patience. Writes in the margins like a crime scene.",
    },
    {
      id: "roux",
      name: "Madame Roux",
      role: "Rival saloniste",
      personality:
        "Visiting ‘in friendship.’ Would weaponize a sugar cube. Convenient drawer energy.",
    },
  ],
  evidence: [
    {
      id: "nest-still",
      title: "Display Nest Still",
      kind: "still",
      caption: "Evidence #1 — Empty velvet nest",
      timestamp: "16:12",
      location: "Gilded Infuser · center pedestal",
      kicker: "Salon cam · 16:12",
      description:
        "The velvet nest is empty. At frame edge, a place card sits half-rotated — Pippa’s name over Roux’s crossed-out cover.",
      deduction:
        "The nest wasn’t snatched in panic — it was reassigned, then cleared like finished china.",
      imageSrc: "/evidence/velvet-teaspoon/nest-still.svg",
      imageStamp: "16:12 · SALON CAM · NEST",
      visualTell: "Empty velvet nest beside a half-swapped Pippa/Roux place card.",
      linkedSuspectIds: ["pippa", "roux"],
      howHint: "Cleared after a card swap",
      whereHint: "Left the pedestal nest",
      hotspots: [
        {
          id: "place-card",
          x: 78,
          y: 42,
          label: "Place card",
          reveal: "Roux is struck through; Pippa is written over in pourer pencil.",
        },
      ],
    },
    {
      id: "seating-chart",
      title: "Hostess Seating Chart",
      kind: "document",
      caption: "Evidence #2 — Mid-service swap",
      timestamp: "16:05",
      location: "Hostess desk",
      kicker: "Desk chart · inked revise",
      description:
        "Cordelia’s chart shows Table 3 moved from Roux to Pippa mid-service. Margin note: quiet pourer covers nest.",
      deduction:
        "Someone authorized — or forged — a mid-ceremony reassignment that put the pourer on the nest.",
      imageSrc: "/evidence/velvet-teaspoon/seating-chart.svg",
      imageStamp: "16:05 · HOSTESS DESK · CHART",
      visualTell: "Ink arrow swaps Roux ↔ Pippa; margin says pourer covers nest.",
      linkedSuspectIds: ["pippa", "cordelia", "roux"],
      howHint: "Place-card / cover fraud",
      whereHint: "Points work toward Table 3",
    },
    {
      id: "basil-score",
      title: "Basil’s Score Card",
      kind: "note",
      caption: "Evidence #3 — Critic margin",
      timestamp: "16:18",
      location: "Critic’s seat · Table 2",
      kicker: "Basil Brew · live notes",
      description:
        "Basil scores the Second Steep a theatrical 7/10, then notes Pippa orbiting Table 3 twice — ‘Not tasting. Transporting.’",
      deduction:
        "The pourer’s path is logistics, not hospitality — twice around the framed table.",
      imageSrc: "/evidence/velvet-teaspoon/basil-score.svg",
      imageStamp: "16:18 · CRITIC NOTES · BASIL",
      visualTell: "Pippa circled Table 3 twice during Second Steep.",
      linkedSuspectIds: ["pippa", "basil"],
      howHint: "Transport under pourer cover",
      whereHint: "Table 3 orbit",
    },
    {
      id: "side-tray",
      title: "Side Tray Photo",
      kind: "still",
      caption: "Evidence #4 — Napkin silhouette",
      timestamp: "16:14",
      location: "Service pass",
      kicker: "Pass cam · 16:14",
      description:
        "A pourer side tray carries cups and one linen napkin with a teaspoon-shaped bulge beneath.",
      deduction:
        "The trophy rode out under laundry, not in a purse — serviceware camouflage.",
      imageSrc: "/evidence/velvet-teaspoon/side-tray.svg",
      imageStamp: "16:14 · PASS CAM · TRAY",
      visualTell: "Teaspoon silhouette under a napkin on the pourer tray.",
      linkedSuspectIds: ["pippa"],
      howHint: "Cleared on a side tray under linen",
      whereHint: "Moved through the pass",
    },
    {
      id: "lipstick-chart",
      title: "Powder-Room Shade Chart",
      kind: "document",
      caption: "Evidence #5 — Opera Rose exclusivity",
      timestamp: "16:20",
      location: "Powder room",
      kicker: "Shade log · staff copy",
      description:
        "Guest lipstick log: Cordelia Pearl Nude, Roux Brick Lecture, Pippa Opera Rose — marked only wearer. Basil abstains on principle.",
      deduction:
        "Any Opera Rose smear is Pippa’s signature, not Roux’s frame job.",
      imageSrc: "/evidence/velvet-teaspoon/lipstick-chart.svg",
      imageStamp: "16:20 · POWDER ROOM · CHART",
      visualTell: "Opera Rose listed as Pippa-only.",
      linkedSuspectIds: ["pippa"],
      howHint: "IDs the handler",
      whereHint: "Matches smear on stash",
    },
    {
      id: "sugar-caddy",
      title: "Sugar Caddy Still",
      kind: "still",
      caption: "Evidence #6 — Framed drawer",
      timestamp: "16:22",
      location: "Table 3 · sugar caddy",
      kicker: "Table cam · 16:22",
      description:
        "The Velvet Teaspoon lies in Table 3’s sugar-caddy drawer. Opera Rose lipstick smears the velvet lining.",
      deduction:
        "Planted on Roux’s cover — but the lipstick convicts the pourer who put it there.",
      imageSrc: "/evidence/velvet-teaspoon/sugar-caddy.svg",
      imageStamp: "16:22 · TABLE 3 · CADDY",
      visualTell: "Velvet spoon in T3 drawer with Opera Rose smear.",
      linkedSuspectIds: ["pippa", "roux"],
      howHint: "Stashed after the clear",
      whereHint: "Table 3 sugar-caddy drawer",
      hotspots: [
        {
          id: "rose-smear",
          x: 62,
          y: 58,
          label: "Lipstick smear",
          reveal: "Opera Rose on the velvet lining — Pippa’s only shade.",
        },
      ],
    },
  ],
  howChoices: [
    {
      id: "place-card-clear",
      label: "Swapped cards · cleared as used service",
      detail: "Reassign the nest, clear it onto a napkin tray, plant it later.",
    },
    {
      id: "critic-confiscate",
      label: "Critic ‘sample’ confiscation",
      detail: "Taken under tasting-notes pretext.",
    },
    {
      id: "hostess-stash",
      label: "Hostess hid it for drama",
      detail: "Cordelia staged the disappearance.",
    },
    {
      id: "rival-snatch",
      label: "Direct snatch to Roux’s purse",
      detail: "Open grab during applause.",
    },
  ],
  whereChoices: [
    {
      id: "sugar-caddy",
      label: "Table 3 sugar-caddy drawer",
      detail: "Madame Roux’s cover — framed.",
    },
    {
      id: "basil-notes",
      label: "Inside Basil’s score folio",
      detail: "Critic’s leather folder.",
    },
    {
      id: "cordelia-clutch",
      label: "Cordelia’s speech clutch",
      detail: "Hostess handbag.",
    },
    {
      id: "pass-drain",
      label: "Kitchen pass drain tray",
      detail: "Back-of-house rinse.",
    },
  ],
  solution: {
    who: "pippa",
    how: "place-card-clear",
    where: "sugar-caddy",
  },
  solutionEvidence: {
    who: ["lipstick-chart", "sugar-caddy", "basil-score"],
    how: ["nest-still", "seating-chart", "side-tray"],
    where: ["sugar-caddy", "basil-score"],
  },
  explanation: [
    "The seating chart and nest still show a mid-service place-card swap that let the pourer ‘clear’ the trophy.",
    "The side-tray napkin silhouette is how it rode out of the room.",
    "Opera Rose on the sugar-caddy lining matches Pippa alone — Roux was framed, not guilty.",
  ],
};
