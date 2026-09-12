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

/** Case 08 — witness contradictions + timeline/alibi (not the same puzzle shape as Case 07). */
export const lateFeeCase: CaseFile = {
  id: "late-fee",
  number: 8,
  title: "The Late Fee",
  subtitle: "A clipped courier pouch. Two clocks that cannot both be true.",
  premise:
    "At the Harbor Street fair, courier Jules clipped a cash pouch to meter #441 while buying tacos. By 15:07 it was gone. Compare the statements and timestamps, then name who took it, how, and where it is now.",
  suspects: [
    {
      id: "rita",
      name: "Rita Toll",
      role: "Meter attendant",
      personality: "Owns the handheld ticket printer and the orange vest. Keeps a depot punch clock.",
    },
    {
      id: "jules",
      name: "Jules Spoke",
      role: "Bike courier · pouch owner",
      personality: "Left the pouch on the meter while ordering. Swears he never left the taco line.",
    },
    {
      id: "paz",
      name: "Paz Blanco",
      role: "Accordion busker",
      personality: "Worked the fair tip jar. Eager to narrate what Rita “must have” done.",
    },
    {
      id: "devon",
      name: "Devon Quill",
      role: "Taco-truck owner",
      personality: "Busy at the window. Grease bin sits behind the truck.",
    },
  ],
  evidence: [
    {
      id: "meter-still",
      title: "Meter #441 Still",
      kind: "still",
      caption: "Evidence #1 — Pouch clipped to the meter",
      timestamp: "15:02",
      location: "Harbor St · meter #441",
      kicker: "Fair cam · 15:02",
      description:
        "A black courier pouch hangs from meter #441. At the edge of frame: an orange attendant vest and a handheld ticket printer.",
      deduction: "Someone in attendant gear was at that meter just before the pouch vanished.",
      visual: "window",
      linkedSuspectIds: ["rita", "paz"],
      howHint: "Attendant gear at the meter",
      whereHint: "Meter #441 post",
    },
    {
      id: "taco-receipt",
      title: "Taco Window Receipt",
      kind: "document",
      caption: "Evidence #2 — Jules’s order stamp",
      timestamp: "15:04",
      location: "Devon’s taco truck · service window",
      kicker: "Till strip · 15:04",
      description:
        "Jules Spoke paid for a #3 combo at 15:04. The receipt printer sits at Devon’s window; Jules’s name is on the order note.",
      deduction: "Jules was at the taco line at 15:04 — not at the meter.",
      visual: "receipt",
      linkedSuspectIds: ["jules", "devon"],
      howHint: "Alibi by till stamp",
      whereHint: "Taco truck window",
    },
    {
      id: "paz-statement",
      title: "Paz’s Witness Card",
      kind: "note",
      caption: "Evidence #3 — Busker statement",
      timestamp: "15:18",
      location: "Fair interview bench",
      kicker: "Interview · Paz Blanco",
      description:
        "Paz writes: “Rita ticketed #441, then walked off with a black pouch toward the alley behind the taco truck.”",
      deduction: "Paz blames Rita and points toward the taco-truck alley.",
      visual: "witness",
      linkedSuspectIds: ["paz", "rita"],
      howHint: "Claims a ticket-then-take",
      whereHint: "Toward taco-truck alley",
    },
    {
      id: "rita-timecard",
      title: "Harbor Depot Punch Card",
      kind: "document",
      caption: "Evidence #4 — Rita’s on-site clock",
      timestamp: "14:55–15:20",
      location: "Harbor Meter Depot",
      kicker: "Depot clock · badge Rita Toll",
      description:
        "Rita’s badge is punched in at the Harbor Depot from 14:55 through 15:20. The depot is a twelve-minute walk from meter #441.",
      deduction: "Rita cannot be the attendant on Harbor Street during the theft window — Paz’s story collapses.",
      visual: "receipt",
      linkedSuspectIds: ["rita"],
      howHint: "Breaks the Rita blame",
      whereHint: "Depot, not the fair",
    },
    {
      id: "tip-jar-video",
      title: "Tip-Jar Phone Still",
      kind: "still",
      caption: "Evidence #5 — Vest, key, pouch",
      timestamp: "15:05",
      location: "Harbor St · busking spot facing #441",
      kicker: "Paz’s phone · 15:05",
      description:
        "A frame from Paz’s own tip-jar video: a figure in an orange attendant vest uses a meter key, unclips the black pouch, and turns toward the taco truck. A blue accordion strap peeks from the figure’s coat.",
      deduction: "The thief wore attendant gear and carries accordion kit — that is Paz’s kit, not Rita’s.",
      visual: "feather",
      linkedSuspectIds: ["paz"],
      howHint: "Meter key + vest disguise",
      whereHint: "Leaves toward taco truck",
    },
    {
      id: "grease-bin",
      title: "Grease-Bin Still",
      kind: "still",
      caption: "Evidence #6 — Stash behind the truck",
      timestamp: "15:12",
      location: "Devon’s taco truck · rear grease bin",
      kicker: "Alley cam · 15:12",
      description:
        "The black pouch is under napkins in Devon’s grease bin. Blue accordion-strap fibers cling to the zipper.",
      deduction: "The pouch was stashed in the grease bin after the meter theft; the fibers match Paz’s accordion strap.",
      visual: "crumbs",
      linkedSuspectIds: ["paz", "devon"],
      howHint: "Stashed after the clip",
      whereHint: "Taco-truck grease bin",
    },
  ],
  howChoices: [
    {
      id: "vest-key-ruse",
      label: "Attendant vest + meter key",
      detail: "Wear stolen attendant gear, unlock the clip with a meter key, walk off.",
    },
    {
      id: "taco-distract",
      label: "Window distraction grab",
      detail: "Someone at the taco line snags the pouch while Jules orders.",
    },
    {
      id: "official-ticket",
      label: "Real ticket confiscation",
      detail: "A genuine attendant tickets the meter and takes the pouch as ‘abandoned property.’",
    },
    {
      id: "courier-fake",
      label: "Owner staged the loss",
      detail: "Jules hid his own pouch to claim a payout.",
    },
  ],
  whereChoices: [
    {
      id: "grease-bin",
      label: "Taco-truck grease bin",
      detail: "Rear waste bin behind Devon’s truck.",
    },
    {
      id: "accordion-case",
      label: "Busker instrument case",
      detail: "Inside Paz’s accordion case on the curb.",
    },
    {
      id: "depot-locker",
      label: "Meter depot locker",
      detail: "Rita’s gear cage at Harbor Depot.",
    },
    {
      id: "courier-basket",
      label: "Jules’s bike basket",
      detail: "Moved back onto the courier bike.",
    },
  ],
  solution: {
    who: "paz",
    how: "vest-key-ruse",
    where: "grease-bin",
  },
  explanation: [
    "Rita’s depot punch card clears her for the whole theft window — Paz’s statement blaming Rita is a false lead.",
    "Paz’s own tip-jar still shows attendant vest + meter key, with a blue accordion strap on the thief.",
    "The grease-bin still recovers the pouch with accordion-strap fibers — Paz took it and stashed it behind the taco truck.",
  ],
};

export const playableCases: CaseFile[] = [pigeonCase, lateFeeCase];

export const moreCases = [
  { title: "The Velvet Teaspoon", label: "Coming soon · Case 12" },
  { title: "Murder on the Dessert Trolley", label: "Coming soon · Case 18" },
];

export function getCase(id: string): CaseFile | undefined {
  return playableCases.find((item) => item.id === id);
}

export function requireCase(id: string): CaseFile {
  const found = getCase(id);
  if (!found) throw new Error(`Unknown case: ${id}`);
  return found;
}
