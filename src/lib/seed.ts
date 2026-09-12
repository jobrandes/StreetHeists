import type { CaseFile } from "./types";

export const PLAYER_DEFAULT_ALIAS = "Soft Hands";

export const pigeonCase: CaseFile = {
  id: "pigeon-job",
  number: 7,
  title: "The Pigeon Job",
  subtitle: "One baguette. Four suspects. Zero dignity.",
  premise:
    "At 12:07, Café Paloma's ceremonial baguette vanished from the plaza counter. The service window was open. Everyone has an alibi. One suspect has wings.",
  suspects: [
    {
      id: "marcel",
      name: "Marcel",
      role: "Pigeon · plaza regular",
      personality: "Immaculate chest, criminal little feet, declines interviews.",
    },
    {
      id: "celine",
      name: "Céline Croissant",
      role: "Pastry chef",
      personality: "Protective of butter and loudly innocent before being asked.",
    },
    {
      id: "inspector-brie",
      name: "Inspector Brie",
      role: "Health inspector",
      personality: "Carries three thermometers and a personal grudge against crumbs.",
    },
    {
      id: "nico",
      name: "Nico Deux-Sucres",
      role: "Street mime",
      personality: "Saw everything. Will only describe it through an invisible box.",
    },
  ],
  evidence: [
    {
      id: "open-window",
      title: "Service Window Still",
      kind: "still",
      caption: "Evidence #1 — The open service window",
      timestamp: "12:06",
      location: "Café Paloma · plaza counter",
      kicker: "Café security · 12:06",
      description:
        "The unattended baguette sits 18 cm inside an open service window. A striped awning cord hangs beside the sill.",
      deduction: "The baguette could be reached from the plaza without entering the café.",
      visual: "window",
      linkedSuspectIds: ["celine"],
    },
    {
      id: "crumb-trail",
      title: "Crumb Trail Still",
      kind: "still",
      caption: "Evidence #2 — Crumbs by the fountain",
      timestamp: "12:08",
      location: "North fountain · plaza",
      kicker: "Plaza camera · 12:08",
      description:
        "Large crumbs run from the café sill toward the fountain, stopping directly beneath the north statue.",
      deduction: "The escape route ended at the fountain statue.",
      visual: "crumbs",
    },
    {
      id: "blue-feather",
      title: "Trace Lab Slip",
      kind: "document",
      caption: "Evidence #3 — Feather and awning thread",
      timestamp: "12:09",
      location: "Café Paloma · service sill",
      kicker: "Municipal crumb unit · Item 03",
      description:
        "One blue-grey contour feather and a loop of red awning thread were recovered together on the café sill.",
      deduction: "A pigeon used the awning cord at the open window.",
      visual: "feather",
      linkedSuspectIds: ["marcel"],
    },
    {
      id: "statue-nest",
      title: "Fountain Telephoto Still",
      kind: "still",
      caption: "Evidence #4 — A loaf in the statue nest",
      timestamp: "12:11",
      location: "North fountain · bronze laurel",
      kicker: "Provided surveillance · 12:11",
      description:
        "A baguette heel protrudes from a nest behind the fountain statue's bronze laurel. Marcel's red leg band is visible.",
      deduction: "The missing loaf is in Marcel's statue nest.",
      visual: "fountain",
      linkedSuspectIds: ["marcel"],
    },
    {
      id: "receipt",
      title: "Inspector's Receipt",
      kind: "document",
      caption: "Evidence #5 — Inspector Brie's receipt",
      timestamp: "12:04–12:12",
      location: "Pharmacie du Plaza",
      kicker: "Pharmacy till · 12:04–12:12",
      description:
        "A time-stamped receipt places Inspector Brie buying yet another thermometer across the plaza.",
      deduction: "Brie could not have taken the baguette at 12:07.",
      visual: "receipt",
      linkedSuspectIds: ["inspector-brie"],
    },
    {
      id: "witness",
      title: "Mime's Witness Note",
      kind: "note",
      caption: "Evidence #6 — Nico's silent testimony",
      timestamp: "12:14",
      location: "Plaza interview bench",
      kicker: "Interview transcript · mostly gestures",
      description:
        "Nico reports: 'small bow, hard flap, bread-shaped burden, fountainward.' He also mimes a bird tugging a cord.",
      deduction: "The thief created a brief awning distraction, then flew toward the fountain.",
      visual: "witness",
      linkedSuspectIds: ["nico", "marcel"],
    },
  ],
  howChoices: [
    {
      id: "window-cord",
      label: "Open window + awning distraction",
      detail: "Tug the cord, reach through the service window, depart during the fuss.",
    },
    {
      id: "inside-job",
      label: "Inside job in a pastry box",
      detail: "Hide the loaf beneath yesterday's éclairs.",
    },
    {
      id: "mime-tunnel",
      label: "Invisible mime tunnel",
      detail: "Technically impossible; visually persuasive.",
    },
    {
      id: "inspection-bag",
      label: "Health inspection bag",
      detail: "Confiscate it under a fictional gluten ordinance.",
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
      detail: "Between the butter and Céline's emergency butter.",
    },
    {
      id: "mime-box",
      label: "Inside Nico's invisible box",
      detail: "Secure, spacious, imaginary.",
    },
    {
      id: "inspection-van",
      label: "Inspector Brie's van",
      detail: "Probably labeled EVIDENCE. Definitely refrigerated.",
    },
  ],
  solution: {
    who: "marcel",
    how: "window-cord",
    where: "statue-nest",
  },
  explanation: [
    "The feather and red thread put Marcel at the open service window and tie him to the awning cord.",
    "The provided plaza still follows the crumb trail straight to the north fountain statue.",
    "The final still shows the baguette in the nest beside Marcel's unmistakable red leg band.",
  ],
};

export const moreCases = [
  { title: "The Velvet Teaspoon", label: "Coming soon · Case 12" },
  { title: "Murder on the Dessert Trolley", label: "Coming soon · Case 18" },
];
