import type { CaseFile } from "./types";

export const PLAYER_DEFAULT_ALIAS = "Detective";

export const pigeonCase: CaseFile = {
  id: "pigeon-job",
  number: 7,
  title: "The Pigeon Job",
  subtitle: "A missing ceremonial baguette. Four persons of interest.",
  premise:
    "At 12:07, the ceremonial baguette disappeared from Caf\u00e9 Paloma\u2019s open service window. Review the provided stills and documents, then name who took it, how, and where it is now.",

  difficulty: "tutorial",
  briefing: [
    {
      title: "THE SETUP",
      copy: "Caf\u00e9 Paloma\u2019s plaza festival hung a ceremonial baguette in the open service window \u2014 a silly tradition, until it vanished at 12:07. The caf\u00e9 did not close; the plaza did not empty; someone simply took the loaf.",
    },
    {
      title: "THE STREET",
      copy: "Four regulars were in play: Marcel the banded pigeon, chef C\u00e9line at the sill, Inspector Brie across the plaza with her timed receipts, and Nico the performer miming what he saw. Crumbs, cord, and a nest will matter more than gossip.",
    },
    {
      title: "YOUR JOB",
      copy: "Build a short chain: who took it, how they moved it, and where it landed. Inspect stills, send fibers if you must, then reconstruct the plaza scene before you accuse.",
    },
  ],
  reconstruction: {
    title: "Plaza scene desk",
    intro: "Key in who / how / where while you keep reading the locker. The frame fills as you pick \u2014 wrong pieces still show, so you can catch a bad theory early.",
    slots: [
      {
        id: "who",
        label: "Who reached the sill",
        prompt: "Who actually took the baguette?",
        options: [
          { id: "marcel", label: "Marcel", detail: "Banded plaza pigeon" },
          { id: "celine", label: "C\u00e9line", detail: "Pastry chef on shift" },
          { id: "inspector-brie", label: "Inspector Brie", detail: "Health inspector" },
          { id: "nico", label: "Nico", detail: "Street performer" },
        ],
        correctOptionId: "marcel",
        sceneLineByOption: {
          marcel: "A banded pigeon works the open sill from the plaza side.",
          celine: "The chef leans from inside the window \u2014 an inside lift.",
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
          "inside-job": "Hands from the kitchen pull the loaf back into the caf\u00e9.",
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
          { id: "mime-box", label: "Performer\u2019s prop case", detail: "Plaza gear" },
          { id: "inspection-van", label: "Inspector\u2019s van", detail: "Near the pharmacy" },
        ],
        correctOptionId: "statue-nest",
        sceneLineByOption: {
          "statue-nest": "A crumb line ends at the north fountain \u2014 the loaf sits in a nest behind the bronze laurel.",
          "pastry-freezer": "The trail bends back into the caf\u00e9 cold storage.",
          "mime-box": "The trail ends at a performer\u2019s prop case on the plaza.",
          "inspection-van": "The trail points toward a van parked by the pharmacy.",
        },
      },
    ],
  },
  suspects: [
    {
      id: "marcel",
      name: "Marcel",
      role: "Plaza pigeon \u00b7 known regular",
      personality: "Often near the caf\u00e9 sill. Red leg band. Avoids handlers.",
    },
    {
      id: "celine",
      name: "C\u00e9line Croissant",
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
      caption: "Evidence #1 \u2014 Open service window",
      timestamp: "12:06",
      location: "Caf\u00e9 Paloma \u00b7 plaza counter",
      kicker: "Caf\u00e9 security \u00b7 12:06",
      description:
        "One minute before the loss, the baguette sits inside an open service window. A striped awning cord hangs beside the sill within reach from the plaza.",
      deduction: "Someone could take the baguette from outside without entering the caf\u00e9.",
      imageSrc: "/evidence/pigeon-job/open-window.jpg",
      imageStamp: "12:06 \u00b7 CAF\u00c9 PALOMA \u00b7 SERVICE WINDOW",
      visualTell: "Open sill with the baguette + hanging awning cord within reach.",
      linkedSuspectIds: ["celine"],
      howHint: "Reach-through from the plaza",
      whereHint: "Caf\u00e9 service window",

      hotspots: [
        {
          id: "awning-cord",
          x: 22,
          y: 48,
          label: "Awning cord",
          reveal: "The striped awning cord hangs within reach of the open sill \u2014 a ready handhold from the plaza.",
        },
      ],
    },
    {
      id: "crumb-trail",
      title: "Crumb Trail Still",
      kind: "still",
      caption: "Evidence #2 \u2014 Crumb trail",
      timestamp: "12:08",
      location: "North fountain \u00b7 plaza",
      kicker: "Plaza camera \u00b7 12:08",
      description:
        "A trail of crumbs runs from the caf\u00e9 sill across the stones and stops under the north fountain statue.",
      deduction: "The baguette was moved from the caf\u00e9 toward the fountain.",
      imageSrc: "/evidence/pigeon-job/crumb-trail.jpg",
      imageStamp: "12:08 \u00b7 PLAZA CAM \u00b7 CRUMB TRAIL",
      visualTell: "Crumb line runs from the caf\u00e9 toward the fountain.",
      howHint: "Carried across the plaza",
      whereHint: "Path ends at fountain",
    },
    {
      id: "blue-feather",
      title: "Trace Lab Slip",
      kind: "document",
      caption: "Evidence #3 \u2014 Feather and awning thread",
      timestamp: "12:09",
      location: "Caf\u00e9 Paloma \u00b7 service sill",
      kicker: "Municipal lab \u00b7 Item 03",
      description:
        "A blue-grey contour feather and a loop of red awning thread were recovered together on the sill.",
      deduction: "A bird used the awning cord at the open window.",
      imageSrc: "/evidence/pigeon-job/blue-feather.jpg",
      imageStamp: "12:09 \u00b7 MUNICIPAL LAB \u00b7 ITEM 03",
      visualTell: "Blue-grey feather recovered with a loop of red awning thread.",
      linkedSuspectIds: ["marcel"],
      howHint: "Awning cord used as leverage",
      whereHint: "Caf\u00e9 sill",

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
            detail: "Bird ID only \u2014 skips the fiber question",
          },
          {
            id: "sill-dust",
            label: "Sill dust scrapings",
            detail: "General residue from the service window",
          },
          {
            id: "crumb-scrap",
            label: "Crumb scrap from the sill",
            detail: "Bakery waste \u2014 unlikely to name a method",
          },
        ],
        correctSampleId: "red-thread",
        wrongSampleResponse:
          "Lab queues it, then shrugs \u2014 that sample doesn\u2019t answer how the loaf left. Pick something else from this slip.",
        resultTitle: "Lab return \u00b7 fiber match",
        resultText:
          "Municipal lab: the red thread is a spectroscopic match for Caf\u00e9 Paloma\u2019s awning cord. Contour feather is Columba livia (street pigeon).",
      },
    },
    {
      id: "statue-nest",
      title: "Fountain Telephoto Still",
      kind: "still",
      caption: "Evidence #4 \u2014 Nest on the statue",
      timestamp: "12:11",
      location: "North fountain \u00b7 bronze laurel",
      kicker: "Surveillance \u00b7 12:11",
      description:
        "A baguette heel sits in a nest behind the statue\u2019s bronze laurel. A pigeon with a red leg band is in frame.",
      deduction: "The missing loaf is in that nest.",
      imageSrc: "/evidence/pigeon-job/statue-nest.jpg",
      imageStamp: "12:11 \u00b7 TELEPHOTO \u00b7 FOUNTAIN NEST",
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
          reveal: "A bright red plastic leg band marks this pigeon \u2014 the same regular seen around Caf\u00e9 Paloma.",
        },
      ],
    },
    {
      id: "receipt",
      title: "Inspector\u2019s Receipt",
      kind: "document",
      caption: "Evidence #5 \u2014 Timed pharmacy receipt",
      timestamp: "12:04\u201312:12",
      location: "Plaza Pharmacy",
      kicker: "Pharmacy till \u00b7 12:04\u201312:12",
      description:
        "A receipt places Inspector Brie buying thermometers across the plaza for the full window around 12:07.",
      deduction: "Brie was not at the caf\u00e9 sill when the baguette vanished.",
      imageSrc: "/evidence/pigeon-job/receipt.jpg",
      imageStamp: "12:04\u201312:12 \u00b7 PLAZA PHARMACY",
      visualTell: "Inspector Brie stamped on-site at the pharmacy for the whole theft window.",
      linkedSuspectIds: ["inspector-brie"],
      howHint: "Alibi by timestamp",
      whereHint: "Pharmacy across plaza",
    },
    {
      id: "witness",
      title: "Witness Interview Notes",
      kind: "note",
      caption: "Evidence #6 \u2014 Nico\u2019s account",
      timestamp: "12:14",
      location: "Plaza interview bench",
      kicker: "Interview \u00b7 gesture demo",
      description:
        "Nico demonstrates a tug on a hanging cord, a lift from the sill, then a flight line toward the fountain.",
      deduction: "The theft used the awning cord, then went fountainward.",
      imageSrc: "/evidence/pigeon-job/witness.jpg",
      imageStamp: "12:14 \u00b7 INTERVIEW BENCH \u00b7 NICO",
      visualTell: "Gesture sequence: tug cord \u2192 lift loaf \u2192 fly line toward fountain.",
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
      label: "Caf\u00e9 pastry freezer",
      detail: "Back-of-house cold storage.",
    },
    {
      id: "mime-box",
      label: "Performer\u2019s prop case",
      detail: "Hidden among plaza performance gear.",
    },
    {
      id: "inspection-van",
      label: "Inspector\u2019s van",
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
      claim: "I never went near that caf\u00e9 window. I was on the fountain ledge the whole time.",
      correctEvidenceId: "blue-feather",
      successResponse:
        "Marcel ruffles. The lab-linked feather and awning thread put him at the sill \u2014 he stops denying the window.",
      failureResponse:
        "Marcel shrugs it off. That exhibit doesn\u2019t pin him to the window.",
    },
    {
      id: "brie-cafe",
      suspectId: "inspector-brie",
      claim: "I was right there at Caf\u00e9 Paloma when the loaf vanished.",
      correctEvidenceId: "receipt",
      successResponse:
        "Brie\u2019s clipped tone breaks. The pharmacy receipt parks her across the plaza for the whole window.",
      failureResponse:
        "Brie stays cool. That piece doesn\u2019t move her off the caf\u00e9 story.",
    },
  ],

  explanation: [
    "The feather and red awning thread place a bird at the open service window using the cord.",
    "The crumb trail runs from that sill to the north fountain statue.",
    "The telephoto still shows the baguette in the statue nest beside a red leg band.",
  ],
};

/** Case 08 \u2014 witness contradictions + timeline/alibi (not the same puzzle shape as Case 07). */
export const lateFeeCase: CaseFile = {
  id: "late-fee",
  number: 8,
  title: "The Late Fee",
  subtitle: "A clipped courier pouch. Two clocks that cannot both be true.",
  premise:
    "At the Harbor Street fair, courier Jules clipped a cash pouch to meter #441 while buying tacos. By 15:07 it was gone. Compare the statements and timestamps, then name who took it, how, and where it is now.",

  difficulty: "standard",
  unlockAfterCaseId: "pigeon-job",
  briefing: [
    {
      title: "THE SETUP",
      copy: "Harbor Street fair, mid-afternoon. Courier Jules clipped a cash pouch to meter #441 while buying tacos. By 15:07 the pouch was gone \u2014 and two stories about who took it cannot both be true.",
    },
    {
      title: "THE CLOCKS",
      copy: "Paz the busker swears Rita ticketed the meter and walked off with the pouch. Rita\u2019s depot punch card says she never left the yard. Someone is selling a false lead; the tip-jar still and grease bin will settle it.",
    },
    {
      title: "YOUR JOB",
      copy: "Spot the contradiction, confront the liar with the right exhibit, then reconstruct the theft path before you lock Who / How / Where.",
    },
  ],
  reconstruction: {
    title: "Harbor Street scene desk",
    intro: "Build the theft in three beats while you keep inspecting. Key options, flip back to evidence, watch the street frame rewrite itself.",
    slots: [
      {
        id: "who",
        label: "Who took the pouch",
        prompt: "Who actually clipped the pouch?",
        options: [
          { id: "rita", label: "Rita Toll", detail: "Meter attendant" },
          { id: "jules", label: "Jules Spoke", detail: "Courier \u00b7 owner" },
          { id: "paz", label: "Paz Blanco", detail: "Accordion busker" },
          { id: "devon", label: "Devon Quill", detail: "Taco-truck owner" },
        ],
        correctOptionId: "paz",
        sceneLineByOption: {
          rita: "An orange attendant vest works meter #441 with a ticket printer.",
          jules: "The courier doubles back from the taco line to his own pouch.",
          paz: "A figure in attendant gear moves on the meter \u2014 a blue accordion strap peeks from the coat.",
          devon: "The taco-truck owner slips from the window toward the meter.",
        },
      },
      {
        id: "how",
        label: "How it was taken",
        prompt: "How did the thief get the pouch off the meter?",
        options: [
          { id: "vest-key-ruse", label: "Attendant vest + meter key", detail: "Disguise and unlock" },
          { id: "taco-distract", label: "Window distraction grab", detail: "Snatch while Jules orders" },
          { id: "official-ticket", label: "Real ticket confiscation", detail: "Genuine attendant take" },
          { id: "courier-fake", label: "Owner staged the loss", detail: "Jules hid it himself" },
        ],
        correctOptionId: "vest-key-ruse",
        sceneLineByOption: {
          "vest-key-ruse": "Stolen attendant gear and a meter key unlock the clip in one move.",
          "taco-distract": "While Jules orders, a hand from the taco line snags the pouch.",
          "official-ticket": "A real attendant tickets the meter and claims the pouch as abandoned.",
          "courier-fake": "Jules stages a theft to claim a payout later.",
        },
      },
      {
        id: "where",
        label: "Where it was stashed",
        prompt: "Where is the pouch now?",
        options: [
          { id: "grease-bin", label: "Taco-truck grease bin", detail: "Rear of Devon\u2019s truck" },
          { id: "accordion-case", label: "Busker instrument case", detail: "On the curb" },
          { id: "depot-locker", label: "Meter depot locker", detail: "Rita\u2019s gear cage" },
          { id: "courier-basket", label: "Jules\u2019s bike basket", detail: "Back on the courier bike" },
        ],
        correctOptionId: "grease-bin",
        sceneLineByOption: {
          "grease-bin": "The thief turns toward the taco truck and stashes the pouch in the rear grease bin.",
          "accordion-case": "The pouch disappears into a curb-side accordion case.",
          "depot-locker": "The pouch rides back to Harbor Depot gear cages.",
          "courier-basket": "The pouch returns to the courier bike as if never gone.",
        },
      },
    ],
  },
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
      role: "Bike courier \u00b7 pouch owner",
      personality: "Left the pouch on the meter while ordering. Swears he never left the taco line.",
    },
    {
      id: "paz",
      name: "Paz Blanco",
      role: "Accordion busker",
      personality: "Worked the fair tip jar. Eager to narrate what Rita \u201cmust have\u201d done.",
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
      caption: "Evidence #1 \u2014 Pouch clipped to the meter",
      timestamp: "15:02",
      location: "Harbor St \u00b7 meter #441",
      kicker: "Fair cam \u00b7 15:02",
      description:
        "A black courier pouch hangs from meter #441. At the edge of frame: an orange attendant vest and a handheld ticket printer.",
      deduction: "Someone in attendant gear was at that meter just before the pouch vanished.",
      imageSrc: "/evidence/late-fee/meter-still.svg",
      imageStamp: "15:02 \u00b7 FAIR CAM \u00b7 METER #441",
      visualTell: "Black pouch clipped to meter #441 with an orange attendant vest at frame edge.",
      linkedSuspectIds: ["rita", "paz"],
      howHint: "Attendant gear at the meter",
      whereHint: "Meter #441 post",
    },
    {
      id: "taco-receipt",
      title: "Taco Window Receipt",
      kind: "document",
      caption: "Evidence #2 \u2014 Jules\u2019s order stamp",
      timestamp: "15:04",
      location: "Devon\u2019s taco truck \u00b7 service window",
      kicker: "Till strip \u00b7 15:04",
      description:
        "Jules Spoke paid for a #3 combo at 15:04. The receipt printer sits at Devon\u2019s window; Jules\u2019s name is on the order note.",
      deduction: "Jules was at the taco line at 15:04 \u2014 not at the meter.",
      imageSrc: "/evidence/late-fee/taco-receipt.svg",
      imageStamp: "15:04 \u00b7 DEVON\u2019S TACO WINDOW",
      visualTell: "Order stamped 15:04 for Jules Spoke at the taco window.",
      linkedSuspectIds: ["jules", "devon"],
      howHint: "Alibi by till stamp",
      whereHint: "Taco truck window",
    },
    {
      id: "paz-statement",
      title: "Paz\u2019s Witness Card",
      kind: "note",
      caption: "Evidence #3 \u2014 Busker statement",
      timestamp: "15:18",
      location: "Fair interview bench",
      kicker: "Interview \u00b7 Paz Blanco",
      description:
        "Paz writes: \u201cRita ticketed #441, then walked off with a black pouch toward the alley behind the taco truck.\u201d",
      deduction: "Paz blames Rita and points toward the taco-truck alley.",
      imageSrc: "/evidence/late-fee/paz-statement.svg",
      imageStamp: "15:18 \u00b7 INTERVIEW \u00b7 PAZ STATEMENT",
      visualTell: "Paz\u2019s written claim: Rita ticketed #441 then left with the pouch toward the alley.",
      linkedSuspectIds: ["paz", "rita"],
      howHint: "Claims a ticket-then-take",
      whereHint: "Toward taco-truck alley",
    },
    {
      id: "rita-timecard",
      title: "Harbor Depot Punch Card",
      kind: "document",
      caption: "Evidence #4 \u2014 Rita\u2019s on-site clock",
      timestamp: "14:55\u201315:20",
      location: "Harbor Meter Depot",
      kicker: "Depot clock \u00b7 badge Rita Toll",
      description:
        "Rita\u2019s badge is punched in at the Harbor Depot from 14:55 through 15:20. The depot is a twelve-minute walk from meter #441.",
      deduction: "Rita cannot be the attendant on Harbor Street during the theft window \u2014 Paz\u2019s story collapses.",
      imageSrc: "/evidence/late-fee/rita-timecard.svg",
      imageStamp: "DEPOT CLOCK \u00b7 RITA TOLL",
      visualTell: "Rita punched in at Harbor Depot 14:55\u201315:20 \u2014 not on Harbor Street.",
      linkedSuspectIds: ["rita"],
      howHint: "Breaks the Rita blame",
      whereHint: "Depot, not the fair",
    },
    {
      id: "tip-jar-video",
      title: "Tip-Jar Phone Still",
      kind: "still",
      caption: "Evidence #5 \u2014 Vest, key, pouch",
      timestamp: "15:05",
      location: "Harbor St \u00b7 busking spot facing #441",
      kicker: "Paz\u2019s phone \u00b7 15:05",
      description:
        "A frame from Paz\u2019s own tip-jar video: a figure in an orange attendant vest uses a meter key, unclips the black pouch, and turns toward the taco truck. A blue accordion strap peeks from the figure\u2019s coat.",
      deduction: "The thief wore attendant gear and carries accordion kit \u2014 that is Paz\u2019s kit, not Rita\u2019s.",
      imageSrc: "/evidence/late-fee/tip-jar-video.svg",
      imageStamp: "15:05 \u00b7 PAZ PHONE \u00b7 TIP-JAR STILL",
      visualTell: "Orange vest + meter key + black pouch + blue accordion strap on the thief.",
      linkedSuspectIds: ["paz"],
      howHint: "Meter key + vest disguise",
      whereHint: "Leaves toward taco truck",

      hotspots: [
        {
          id: "blue-strap",
          x: 30,
          y: 62,
          label: "Blue strap",
          reveal: "A blue accordion strap peeks from the thief\u2019s coat \u2014 Paz\u2019s kit, not Rita\u2019s depot gear.",
        },
      ],
    },
    {
      id: "grease-bin",
      title: "Grease-Bin Still",
      kind: "still",
      caption: "Evidence #6 \u2014 Stash behind the truck",
      timestamp: "15:12",
      location: "Devon\u2019s taco truck \u00b7 rear grease bin",
      kicker: "Alley cam \u00b7 15:12",
      description:
        "The black pouch is under napkins in Devon\u2019s grease bin. Blue accordion-strap fibers cling to the zipper.",
      deduction: "The pouch was stashed in the grease bin after the meter theft; the fibers match Paz\u2019s accordion strap.",
      imageSrc: "/evidence/late-fee/grease-bin.svg",
      imageStamp: "15:12 \u00b7 ALLEY CAM \u00b7 GREASE BIN",
      visualTell: "Pouch in the grease bin with blue accordion-strap fibers on the zipper.",
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
      detail: "A genuine attendant tickets the meter and takes the pouch as \u2018abandoned property.\u2019",
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
      detail: "Rear waste bin behind Devon\u2019s truck.",
    },
    {
      id: "accordion-case",
      label: "Busker instrument case",
      detail: "Inside Paz\u2019s accordion case on the curb.",
    },
    {
      id: "depot-locker",
      label: "Meter depot locker",
      detail: "Rita\u2019s gear cage at Harbor Depot.",
    },
    {
      id: "courier-basket",
      label: "Jules\u2019s bike basket",
      detail: "Moved back onto the courier bike.",
    },
  ],
  solution: {
    who: "paz",
    how: "vest-key-ruse",
    where: "grease-bin",
  },

  solutionEvidence: {
    who: ["tip-jar-video", "grease-bin"],
    how: ["tip-jar-video", "meter-still"],
    where: ["grease-bin"],
  },
  contradictions: [
    {
      id: "paz-vs-rita-clock",
      evidenceIdA: "paz-statement",
      evidenceIdB: "rita-timecard",
      phraseA: "Rita ticketed #441, then walked off with a black pouch",
      phraseB: "14:55 through 15:20",
      insight:
        "Paz blames Rita on Harbor Street during the theft window, but Rita\u2019s depot punch card keeps her off the street the whole time.",
    },
  ],
  confrontations: [
    {
      id: "paz-blames-rita",
      suspectId: "paz",
      claim: "Rita ticketed the meter and took the pouch. I only saw it happen.",
      correctEvidenceId: "rita-timecard",
      successResponse:
        "Paz\u2019s smile thins. Rita\u2019s depot clock wrecks the story \u2014 he was selling a false lead.",
      failureResponse:
        "Paz keeps talking. That exhibit doesn\u2019t break his Rita story.",
    },
    {
      id: "paz-not-me",
      suspectId: "paz",
      claim: "I never touched attendant gear. I was just busking.",
      correctEvidenceId: "tip-jar-video",
      successResponse:
        "Paz goes quiet. His own tip-jar still shows vest, meter key, pouch, and his blue accordion strap.",
      failureResponse:
        "Paz laughs it off. You\u2019ll need the frame that shows the gear.",
    },
  ],

  explanation: [
    "Rita\u2019s depot punch card clears her for the whole theft window \u2014 Paz\u2019s statement blaming Rita is a false lead.",
    "Paz\u2019s own tip-jar still shows attendant vest + meter key, with a blue accordion strap on the thief.",
    "The grease-bin still recovers the pouch with accordion-strap fibers \u2014 Paz took it and stashed it behind the taco truck.",
  ],
};

export const playableCases: CaseFile[] = [pigeonCase, lateFeeCase];

export const moreCases = [
  {
    title: "The Velvet Teaspoon",
    label: "Hard \u00b7 unlocks after The Late Fee",
    difficulty: "hard" as const,
    unlockAfterCaseId: "late-fee",
  },
  {
    title: "Murder on the Dessert Trolley",
    label: "Hard \u00b7 unlocks after The Velvet Teaspoon",
    difficulty: "hard" as const,
    unlockAfterCaseId: "velvet-teaspoon",
  },
];

export function getCase(id: string): CaseFile | undefined {
  return playableCases.find((item) => item.id === id);
}

export function requireCase(id: string): CaseFile {
  const found = getCase(id);
  if (!found) throw new Error(`Unknown case: ${id}`);
  return found;
}
