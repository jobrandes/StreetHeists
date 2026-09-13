import type { CaseFile } from "@/lib/types";

/**
 * Case 10 — timed trolley route + diversion.
 * Hook (distinct from trail / clocks / lipstick ID): an allergen-card swap
 * triggers a scripted-looking shriek so the stage manager can scoop the
 * chocolate detective’s head (USB inside) into the prompt cubby.
 *
 * JUDGMENT CALL: “murder” is dessert farce, not gore — Jo can retitle darker.
 */
export const dessertTrolleyCase: CaseFile = {
  id: "dessert-trolley",
  number: 10,
  title: "Murder on the Dessert Trolley",
  subtitle: "Inspector Mousse loses his head. The shriek wasn’t in the script.",
  premise:
    "Midnight Express dinner theatre plated a chocolate detective named Inspector Mousse. Mid-Act II the dessert trolley rolled out, Tilda shrieked, lights hiccuped — and the Inspector was found decapitated. Nobody died. Something inside the chocolate did get stolen.",
  difficulty: "hard",
  unlockAfterCaseId: "velvet-teaspoon",
  briefing: [
    {
      title: "THE SHOW",
      copy: "Dinner theatre, Act II toast. Otto Ladle pushes the famous dessert trolley. Inspector Mousse is the house mascot: chocolate trench coat, hollow head, one very stupid USB cavity for ‘case files.’",
    },
    {
      title: "THE BIT",
      copy: "Tilda Frontrow’s allergen card grew a hazelnut sticker it never earned. She shrieked on cue that isn’t in the book. Vance Prompt’s pencil is all over the margins. The prompt cubby smells like cocoa and guilt.",
    },
    {
      title: "YOUR JOB",
      copy: "Gather the cue sheet, route log, cam stills, and prep notes. Then Decide Who / How / Where with exhibits. Case file keeps the running sheet.",
    },
  ],
  reconstruction: {
    title: "Theatre Decide draft",
    intro: "Fill Who / How / Where while you keep Gathering. Wrong theories still preview — catch them before Accuse.",
    slots: [
      {
        id: "who",
        label: "Who took the head",
        prompt: "Who scooped Inspector Mousse’s head?",
        options: [
          { id: "vance", label: "Vance Prompt", detail: "Stage manager" },
          { id: "otto", label: "Otto Ladle", detail: "Trolley waiter" },
          { id: "tilda", label: "Tilda Frontrow", detail: "Allergic guest" },
          { id: "amelie", label: "Amélie Glaze", detail: "Pastry lead" },
        ],
        correctOptionId: "vance",
        sceneLineByOption: {
          vance: "The stage manager vanishes stage-left with chocolate on his cuff.",
          otto: "The waiter ducks behind the trolley during the shriek.",
          tilda: "The guest’s shriek covers her own reach for the mousse.",
          amelie: "Pastry slips in with a plating knife mid-blackout.",
        },
      },
      {
        id: "how",
        label: "How the diversion worked",
        prompt: "How did the thief create cover?",
        options: [
          {
            id: "allergen-shriek",
            label: "Fake allergen card · staged shriek",
            detail: "Hazelnut sticker forces a scream on cue",
          },
          {
            id: "blackout-only",
            label: "House blackout alone",
            detail: "Lights fail; no shriek needed",
          },
          {
            id: "waiter-drop",
            label: "Waiter drops the trolley",
            detail: "Chaos from a spill",
          },
          {
            id: "toast-distract",
            label: "Toast distraction alone",
            detail: "Amélie’s speech covers the lift",
          },
        ],
        correctOptionId: "allergen-shriek",
        sceneLineByOption: {
          "allergen-shriek":
            "A sticky hazelnut lie makes Tilda shriek; the shriek wasn’t in the book — Vance wrote it in.",
          "blackout-only": "Lights die and the head vanishes without a sound cue.",
          "waiter-drop": "Otto spills the trolley; hands scramble in chocolate.",
          "toast-distract": "Amélie’s toast holds every eye while the head walks off.",
        },
      },
      {
        id: "where",
        label: "Where the head went",
        prompt: "Where is the chocolate head / USB now?",
        options: [
          {
            id: "prompt-cubby",
            label: "Stage-left prompt cubby",
            detail: "Vance’s hole in the wall",
          },
          {
            id: "trolley-drawer",
            label: "Trolley lower drawer",
            detail: "Under napkins on Otto’s cart",
          },
          {
            id: "pastry-fridge",
            label: "Pastry walk-in",
            detail: "Amélie’s cold box",
          },
          {
            id: "tilda-clutch",
            label: "Tilda’s theatre clutch",
            detail: "Guest handbag",
          },
        ],
        correctOptionId: "prompt-cubby",
        sceneLineByOption: {
          "prompt-cubby": "Chocolate curls and a USB wink from the stage-left prompt cubby.",
          "trolley-drawer": "The head rides under linen in the trolley.",
          "pastry-fridge": "The head chills beside tomorrow’s éclairs.",
          "tilda-clutch": "The guest’s clutch suddenly weighs a kilo of cocoa.",
        },
      },
    ],
  },
  suspects: [
    {
      id: "vance",
      name: "Vance Prompt",
      role: "Stage manager",
      personality:
        "Writes cues like arrest warrants. Keeps a prompt cubby that is not on the tour.",
    },
    {
      id: "otto",
      name: "Otto Ladle",
      role: "Trolley waiter",
      personality:
        "Pushes dessert like a parade float. Swears the shriek made him forget left from left.",
    },
    {
      id: "tilda",
      name: "Tilda Frontrow",
      role: "Allergic guest · Season ticket",
      personality:
        "Shellfish only — until a sticker invents hazelnut. Screams on time, every time.",
    },
    {
      id: "amelie",
      name: "Amélie Glaze",
      role: "Pastry lead",
      personality:
        "Plates Inspector Mousse with religious care. Offended by anyone who breaks a chocolate jawline.",
    },
  ],
  evidence: [
    {
      id: "cue-sheet",
      title: "Act II Cue Sheet",
      kind: "document",
      caption: "Evidence #1 — Shriek not in book",
      timestamp: "20:00",
      location: "Stage manager desk",
      kicker: "SM desk · Act II",
      description:
        "Printed cues list trolley enter, toast, blackout. A pencil line adds ‘20:13 SHRIEK (not in book) — V.P.’",
      deduction:
        "The shriek was authored backstage — Vance’s initials own the margin.",
      imageSrc: "/evidence/dessert-trolley/cue-sheet.svg",
      imageStamp: "20:00 · STAGE MANAGER · CUES",
      visualTell: "Pencil shriek cue initialed V.P., marked not in book.",
      linkedSuspectIds: ["vance"],
      howHint: "Staged diversion cue",
      whereHint: "Points at SM control",
    },
    {
      id: "allergen-card",
      title: "Allergen Card Swap",
      kind: "document",
      caption: "Evidence #2 — Hazelnut sticker",
      timestamp: "20:05",
      location: "Props table",
      kicker: "Props · guest card",
      description:
        "Tilda Frontrow’s card lists shellfish. A sticky hazelnut add-on sits over the original print; the real card peeks underneath.",
      deduction:
        "Someone manufactured a hazelnut emergency to force a scream.",
      imageSrc: "/evidence/dessert-trolley/allergen-card.svg",
      imageStamp: "20:05 · PROPS TABLE · CARD",
      visualTell: "Hazelnut sticker stuck over Tilda’s shellfish-only card.",
      linkedSuspectIds: ["vance", "tilda"],
      howHint: "Fake allergen triggers shriek",
      whereHint: "Guest seat / props",
    },
    {
      id: "route-log",
      title: "Trolley Route Log",
      kind: "document",
      caption: "Evidence #3 — Alone at mousse",
      timestamp: "20:12",
      location: "Service log",
      kicker: "Service · table times",
      description:
        "T1 Otto+Vance, T2 Otto only, T3 Vance alone at mousse beat, T4 Otto returns post-shriek.",
      deduction:
        "Vance had solo access at the sculpture beat — the theft window.",
      imageSrc: "/evidence/dessert-trolley/route-log.svg",
      imageStamp: "20:12 · SERVICE LOG · ROUTE",
      visualTell: "Vance alone at Table 3 / mousse timing.",
      linkedSuspectIds: ["vance", "otto"],
      howHint: "Solo access during diversion setup",
      whereHint: "Aisle to stage left",
    },
    {
      id: "trolley-cam",
      title: "Trolley Cam Still",
      kind: "still",
      caption: "Evidence #4 — Hand on mousse",
      timestamp: "20:12",
      location: "House aisle",
      kicker: "House cam · 20:12",
      description:
        "Otto pushes; a second hand — Vance — reaches the Inspector Mousse plate during the roll.",
      deduction:
        "Vance touched the sculpture before the shriek landed.",
      imageSrc: "/evidence/dessert-trolley/trolley-cam.svg",
      imageStamp: "20:12 · HOUSE CAM · AISLE",
      visualTell: "Vance’s hand near Inspector Mousse on the trolley.",
      linkedSuspectIds: ["vance", "otto"],
      howHint: "Pre-positioned for the scoop",
      whereHint: "On the trolley path",
      hotspots: [
        {
          id: "vance-hand",
          x: 68,
          y: 48,
          label: "Second hand",
          reveal: "Not Otto’s — sleeve matches Vance’s SM black.",
        },
      ],
    },
    {
      id: "prep-list",
      title: "Pastry Prep List",
      kind: "note",
      caption: "Evidence #5 — Intact at plating",
      timestamp: "19:40",
      location: "Pastry",
      kicker: "Amélie · prep",
      description:
        "Inspector Mousse plated 19:40, head intact, USB cavity sealed. Note: ‘If it arrives broken, not my knife.’",
      deduction:
        "Pastry didn’t ship a pre-broken head — breakage happened in the room.",
      imageSrc: "/evidence/dessert-trolley/prep-list.svg",
      imageStamp: "19:40 · PASTRY · AMÉLIE",
      visualTell: "Intact plating note at 19:40; no hazelnut on plate.",
      linkedSuspectIds: ["amelie"],
      howHint: "Clears pastry breakage",
      whereHint: "Left pastry intact",
    },
    {
      id: "prompt-cubby",
      title: "Prompt Cubby Still",
      kind: "still",
      caption: "Evidence #6 — Chocolate + USB",
      timestamp: "20:18",
      location: "Stage left",
      kicker: "Stage left · cubby",
      description:
        "Stage-left prompt cubby holds a chocolate hair curl and a blue USB — the Inspector’s brain, relocated.",
      deduction:
        "The head’s cargo landed in Vance’s cubby after the shriek cover.",
      imageSrc: "/evidence/dessert-trolley/prompt-cubby.svg",
      imageStamp: "20:18 · STAGE LEFT · CUBBY",
      visualTell: "Chocolate curl + USB in the prompt cubby.",
      linkedSuspectIds: ["vance"],
      howHint: "Stash after diversion",
      whereHint: "Stage-left prompt cubby",
      hotspots: [
        {
          id: "usb",
          x: 55,
          y: 60,
          label: "USB",
          reveal: "Blue drive from the hollow head — case files, allegedly.",
        },
      ],
    },
  ],
  howChoices: [
    {
      id: "allergen-shriek",
      label: "Fake allergen card · staged shriek",
      detail: "Hazelnut sticker forces a scream that isn’t in the script.",
    },
    {
      id: "blackout-only",
      label: "House blackout alone",
      detail: "Lights fail; no shriek needed.",
    },
    {
      id: "waiter-drop",
      label: "Waiter drops the trolley",
      detail: "Chaos from a spill.",
    },
    {
      id: "toast-distract",
      label: "Toast distraction alone",
      detail: "Amélie’s speech covers the lift.",
    },
  ],
  whereChoices: [
    {
      id: "prompt-cubby",
      label: "Stage-left prompt cubby",
      detail: "Vance’s hole in the wall.",
    },
    {
      id: "trolley-drawer",
      label: "Trolley lower drawer",
      detail: "Under napkins on Otto’s cart.",
    },
    {
      id: "pastry-fridge",
      label: "Pastry walk-in",
      detail: "Amélie’s cold box.",
    },
    {
      id: "tilda-clutch",
      label: "Tilda’s theatre clutch",
      detail: "Guest handbag.",
    },
  ],
  solution: {
    who: "vance",
    how: "allergen-shriek",
    where: "prompt-cubby",
  },
  solutionEvidence: {
    who: ["route-log", "trolley-cam", "prompt-cubby"],
    how: ["cue-sheet", "allergen-card"],
    where: ["prompt-cubby"],
  },
  explanation: [
    "Vance penciled a shriek that isn’t in the book and swapped Tilda’s allergen card to force it.",
    "The route log and trolley cam put Vance alone on the mousse at the theft beat.",
    "The prompt cubby holds the chocolate curl and USB — the Inspector’s head cargo, restashed stage-left.",
  ],
};
