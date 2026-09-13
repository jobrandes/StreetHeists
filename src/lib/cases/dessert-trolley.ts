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
      copy: "Gather the house cam, cue sheet, and route log. Decide Who / How / Where with proof. Case file remembers the blocking so you don’t have to.",
    },
  ],
  reconstruction: {
    title: "House Decide draft",
    intro: "Fill Who / How / Where while you keep Gathering. The trolley won’t wait for a second night.",
    slots: [
      {
        id: "who",
        label: "Who murdered the mousse",
        prompt: "Who took Inspector Mousse’s head?",
        options: [
          { id: "amelie", label: "Chef Amélie Glacé", detail: "Pastry chef" },
          { id: "vance", label: "Vance Prompt", detail: "Stage manager" },
          { id: "tilda", label: "Tilda Frontrow", detail: "Leading lady" },
          { id: "otto", label: "Otto Ladle", detail: "Trolley waiter" },
        ],
        correctOptionId: "vance",
        sceneLineByOption: {
          amelie: "The pastry chef ‘replates’ the Inspector mid-aisle — too tidy.",
          vance: "The stage manager’s hand finds the chocolate head during the shriek blackout.",
          tilda: "The leading lady smashes dessert in a panic — messy, not precise.",
          otto: "The waiter scoops while pushing — both hands full of trolley, somehow.",
        },
      },
      {
        id: "how",
        label: "How the diversion worked",
        prompt: "How did the thief get cover?",
        options: [
          {
            id: "allergen-shriek",
            label: "Allergen-card swap · shriek cover",
            detail: "Fake hazelnut panic, then scoop",
          },
          {
            id: "otto-bump",
            label: "Waiter ‘accident’ bump",
            detail: "Trolley collision drops the head",
          },
          {
            id: "chef-replate",
            label: "Chef emergency replate",
            detail: "Amélie rebuilds on the floor",
          },
          {
            id: "actress-tantrum",
            label: "Actress dessert tantrum",
            detail: "Tilda destroys her own prop",
          },
        ],
        correctOptionId: "allergen-shriek",
        sceneLineByOption: {
          "allergen-shriek":
            "A sticky hazelnut lie triggers Tilda’s shriek; under the noise the head vanishes.",
          "otto-bump": "Otto clips a chair; the head rolls into a napkin.",
          "chef-replate": "Amélie claims a melt emergency and rebuilds offstage.",
          "actress-tantrum": "Tilda pulverizes the Inspector for attention.",
        },
      },
      {
        id: "where",
        label: "Where the head went",
        prompt: "Where is the chocolate head (and USB) now?",
        options: [
          {
            id: "prompt-cubby",
            label: "Stage-left prompt cubby",
            detail: "Vance’s book nook",
          },
          {
            id: "pastry-walk",
            label: "Pastry walk-in",
            detail: "Amélie’s cold shelf",
          },
          {
            id: "tilda-tote",
            label: "Tilda’s dressing tote",
            detail: "Star dressing room",
          },
          {
            id: "trolley-skirt",
            label: "Under the trolley skirt",
            detail: "Still on the cart",
          },
        ],
        correctOptionId: "prompt-cubby",
        sceneLineByOption: {
          "prompt-cubby":
            "Chocolate curls and a blue USB wait in the stage-left prompt cubby.",
          "pastry-walk": "The head chills beside spare éclairs.",
          "tilda-tote": "Cocoa smears a star’s tote bag.",
          "trolley-skirt": "The head hides under linen still on the cart.",
        },
      },
    ],
  },
  suspects: [
    {
      id: "amelie",
      name: "Chef Amélie Glacé",
      role: "Pastry chef",
      personality:
        "Protects chocolate like it’s union. Left a prep list that sounds like an alibi and a threat.",
    },
    {
      id: "vance",
      name: "Vance Prompt",
      role: "Stage manager",
      personality:
        "Owns every pencil in the building. Writes cues that aren’t in the play. Smiles like a blackout.",
    },
    {
      id: "tilda",
      name: "Tilda Frontrow",
      role: "Leading lady",
      personality:
        "Allergic to shellfish, drama, and being upstaged by dessert. Did not order hazelnut.",
    },
    {
      id: "otto",
      name: "Otto Ladle",
      role: "Trolley waiter",
      personality:
        "Pushes the cart, dodges blame, remembers table times better than lines.",
    },
  ],
  evidence: [
    {
      id: "trolley-cam",
      title: "Trolley Cam Still",
      kind: "still",
      caption: "Evidence #1 — Hand on the mousse",
      timestamp: "20:12",
      location: "House aisle · dessert pass",
      kicker: "House cam · 20:12",
      description:
        "Otto pushes the trolley. A second hand — Vance’s cue-ring visible — hovers at Inspector Mousse’s collar.",
      deduction:
        "The stage manager had contact with the sculpture at the exact service beat.",
      imageSrc: "/evidence/dessert-trolley/trolley-cam.svg",
      imageStamp: "20:12 · HOUSE CAM · AISLE",
      visualTell: "Vance’s hand near Inspector Mousse while Otto pushes.",
      linkedSuspectIds: ["vance", "otto"],
      howHint: "Hands-on during the roll",
      whereHint: "Aisle at trolley",
      hotspots: [
        {
          id: "cue-ring",
          x: 68,
          y: 40,
          label: "Cue ring",
          reveal: "Vance’s stage-manager ring on the reaching hand.",
        },
      ],
    },
    {
      id: "allergen-card",
      title: "Allergen Card Swap",
      kind: "document",
      caption: "Evidence #2 — Hazelnut sticker",
      timestamp: "20:05",
      location: "Props table",
      kicker: "Props · Tilda card",
      description:
        "Tilda’s allergen card lists shellfish. A fresh hazelnut sticky sits on top; the original printing peeks beneath.",
      deduction:
        "Someone manufactured a hazelnut panic Tilda was never meant to have.",
      imageSrc: "/evidence/dessert-trolley/allergen-card.svg",
      imageStamp: "20:05 · PROPS TABLE · CARD",
      visualTell: "Hazelnut sticker over Tilda’s real allergen card.",
      linkedSuspectIds: ["vance", "tilda"],
      howHint: "Diversion via fake allergen",
      whereHint: "Props before curtain",
    },
    {
      id: "cue-sheet",
      title: "Act II Cue Sheet",
      kind: "note",
      caption: "Evidence #3 — Shriek not in book",
      timestamp: "20:00",
      location: "Stage manager desk",
      kicker: "Vance pencil · cues",
      description:
        "Printed cues list trolley enter and toast. A pencil line adds ‘20:13 SHRIEK (not in book) — V.P.’ then blackout cover.",
      deduction:
        "The shriek was planned by the stage manager, not the playwright.",
      imageSrc: "/evidence/dessert-trolley/cue-sheet.svg",
      imageStamp: "20:00 · STAGE MANAGER · CUES",
      visualTell: "Vance-initialed shriek cue that isn’t in the script.",
      linkedSuspectIds: ["vance"],
      howHint: "Scripted diversion",
      whereHint: "Timed to 20:13",
    },
    {
      id: "route-log",
      title: "Trolley Route Log",
      kind: "document",
      caption: "Evidence #4 — Alone at the mousse",
      timestamp: "20:12",
      location: "Service clipboard",
      kicker: "Otto’s route times",
      description:
        "Table times: Otto+Vance at T1, Otto alone at T2, Vance alone at the mousse on T3 at 20:12, Otto returns after the shriek.",
      deduction:
        "Only Vance had solo access to Inspector Mousse at the critical minute.",
      imageSrc: "/evidence/dessert-trolley/route-log.svg",
      imageStamp: "20:12 · SERVICE LOG · ROUTE",
      visualTell: "Vance alone at mousse on T3 at 20:12.",
      linkedSuspectIds: ["vance", "otto"],
      howHint: "Solo window mid-route",
      whereHint: "Between tables 2 and 4",
    },
    {
      id: "prompt-cubby",
      title: "Prompt Cubby Still",
      kind: "still",
      caption: "Evidence #5 — Chocolate + USB",
      timestamp: "20:18",
      location: "Stage left · prompt cubby",
      kicker: "Post-blackout still",
      description:
        "Stage-left prompt cubby holds a chocolate hair curl and a blue USB — the Inspector’s ‘case files.’",
      deduction:
        "The head (and the drive inside it) landed in Vance’s working cubby.",
      imageSrc: "/evidence/dessert-trolley/prompt-cubby.svg",
      imageStamp: "20:18 · STAGE LEFT · CUBBY",
      visualTell: "Chocolate curl and USB in the prompt cubby.",
      linkedSuspectIds: ["vance"],
      howHint: "Stash after the scoop",
      whereHint: "Stage-left prompt cubby",
    },
    {
      id: "prep-list",
      title: "Pastry Prep List",
      kind: "note",
      caption: "Evidence #6 — Intact at plating",
      timestamp: "19:40",
      location: "Pastry pass",
      kicker: "Amélie Glacé · prep",
      description:
        "Amélie initials Inspector Mousse plated 19:40, head intact, USB cavity sealed, no hazelnut on the plate. Margin: if it arrives broken, not my knife.",
      deduction:
        "The sculpture left pastry whole — the ‘murder’ happened on the floor, not in the kitchen.",
      imageSrc: "/evidence/dessert-trolley/prep-list.svg",
      imageStamp: "19:40 · PASTRY · AMÉLIE",
      visualTell: "Mousse intact at 19:40; no hazelnut on plate.",
      linkedSuspectIds: ["amelie"],
      howHint: "Clears kitchen sabotage",
      whereHint: "Damage after plating",
    },
  ],
  howChoices: [
    {
      id: "allergen-shriek",
      label: "Allergen-card swap · shriek cover",
      detail: "Fake hazelnut panic, scoop the head under the noise.",
    },
    {
      id: "otto-bump",
      label: "Waiter ‘accident’ bump",
      detail: "Trolley collision drops the head.",
    },
    {
      id: "chef-replate",
      label: "Chef emergency replate",
      detail: "Amélie rebuilds offstage.",
    },
    {
      id: "actress-tantrum",
      label: "Actress dessert tantrum",
      detail: "Tilda destroys the prop.",
    },
  ],
  whereChoices: [
    {
      id: "prompt-cubby",
      label: "Stage-left prompt cubby",
      detail: "Vance’s book nook.",
    },
    {
      id: "pastry-walk",
      label: "Pastry walk-in",
      detail: "Amélie’s cold shelf.",
    },
    {
      id: "tilda-tote",
      label: "Tilda’s dressing tote",
      detail: "Star dressing room.",
    },
    {
      id: "trolley-skirt",
      label: "Under the trolley skirt",
      detail: "Still on the cart.",
    },
  ],
  solution: {
    who: "vance",
    how: "allergen-shriek",
    where: "prompt-cubby",
  },
  solutionEvidence: {
    who: ["trolley-cam", "route-log", "cue-sheet"],
    how: ["allergen-card", "cue-sheet", "prep-list"],
    where: ["prompt-cubby", "route-log"],
  },
  explanation: [
    "The route log and trolley cam put Vance alone on the sculpture at 20:12.",
    "The allergen sticker plus Vance’s penciled shriek cue built the diversion.",
    "The prompt cubby holds the chocolate head and USB — pastry’s prep list proves it left the kitchen intact.",
  ],
};
