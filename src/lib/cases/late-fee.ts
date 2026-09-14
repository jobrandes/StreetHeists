import type { CaseFile } from "@/lib/types";

export const lateFeeCase: CaseFile = {
  id: "late-fee",
  number: 8,
  title: "The Late Fee",
  subtitle: "Rent money on a meter clip — and a frame-job that could cost Rita her badge.",
  premise:
    "Harbor Street fair. Jules clipped his rent float — three days of courier tips — to meter #441 for a taco run. By 15:07 the pouch was gone, Paz already had a novel blaming attendant Rita Toll, and Harbor Meter’s supervisor is drafting her suspension. Clocks don’t do fanfiction. Name who took it, how, and where the rent money is sweating now — before Rita’s badge goes with it.",
  difficulty: "standard",
  unlockAfterCaseId: "pigeon-job",
    briefing: [
    {
      title: "THE STAKES",
      copy: "Jules’s pouch held the rent float — cash he can’t float twice. Paz’s story fingers Rita Toll. Harbor Meter already opened a conduct file. If Paz’s version sticks, Rita loses her badge over a theft she didn’t work.",
    },
    {
      title: "THE CLOCKS",
      copy: "Paz swears Rita ticketed #441 and walked off with black leather. Rita’s depot punch card says she was dating a time clock twelve minutes away. Someone is selling a false lead with jazz hands — and a career on the line.",
    },
    {
      title: "YOUR JOB",
      copy: "Gather fair cams, punch cards, and the tip-jar still. String corkboard links until the takeaways unlock. Spot the clock contradiction. Then Decide Who / How / Where with proof that clears Rita and recovers Jules’s rent.",
    },
  ],
  reconstruction: {
    title: "Harbor Street Decide draft",
    intro: "Build the theft in three beats while you keep Gathering. Flip back to clues anytime — Case file keeps the takeaways.",
    slots: [
      {
        id: "who",
        label: "Who took the pouch",
        prompt: "Who actually clipped the pouch?",
        options: [
          { id: "rita", label: "Rita Toll", detail: "Meter attendant" },
          { id: "jules", label: "Jules Spoke", detail: "Courier · owner" },
          { id: "paz", label: "Paz Blanco", detail: "Accordion busker" },
          { id: "devon", label: "Devon Quill", detail: "Taco-truck owner" },
        ],
        correctOptionId: "paz",
        sceneLineByOption: {
          rita: "An orange attendant vest works meter #441 with a ticket printer.",
          jules: "The courier doubles back from the taco line to his own pouch.",
          paz: "A figure in attendant gear moves on the meter — a blue accordion strap peeks from the coat.",
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
          { id: "grease-bin", label: "Taco-truck grease bin", detail: "Rear of Devon’s truck" },
          { id: "accordion-case", label: "Busker instrument case", detail: "On the curb" },
          { id: "depot-locker", label: "Meter depot locker", detail: "Rita’s gear cage" },
          { id: "courier-basket", label: "Jules’s bike basket", detail: "Back on the courier bike" },
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
      personality: "Owns the ticket printer, the orange vest, and a relationship with a depot clock that will ruin someone’s afternoon.",
    },
    {
      id: "jules",
      name: "Jules Spoke",
      role: "Bike courier · pouch owner",
      personality: "Will trust a parking meter with rent money. Currently learning why that is a genre of crime.",
    },
    {
      id: "paz",
      name: "Paz Blanco",
      role: "Accordion busker",
      personality: "Tip-jar philosopher. Writes other people’s guilt in real time. Blue strap, orange ideas.",
    },
    {
      id: "devon",
      name: "Devon Quill",
      role: "Taco-truck owner",
      personality: "Grease bin is basically a municipal archive. Busy enough to miss a heist; not busy enough to miss a rumor.",
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
      imageSrc: "/evidence/late-fee/meter-still.svg",
      imageStamp: "15:02 · FAIR CAM · METER #441",
      visualTell: "Black pouch clipped to meter #441 with an orange attendant vest at frame edge.",
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
      imageSrc: "/evidence/late-fee/taco-receipt.svg",
      imageStamp: "15:04 · DEVON’S TACO WINDOW",
      visualTell: "Order stamped 15:04 for Jules Spoke at the taco window.",
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
      imageSrc: "/evidence/late-fee/paz-statement.svg",
      imageStamp: "15:18 · INTERVIEW · PAZ STATEMENT",
      visualTell: "Paz’s written claim: Rita ticketed #441 then left with the pouch toward the alley.",
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
      conceal: {
        label: "Lift depot stamp flap",
        text: "Supervisor initial on the 15:05 line: Rita was physically at the depot time clock — not roaming Harbor Street.",
      },
      imageSrc: "/evidence/late-fee/rita-timecard.svg",
      imageStamp: "DEPOT CLOCK · RITA TOLL",
      visualTell: "Rita punched in at Harbor Depot 14:55–15:20 — not on Harbor Street.",
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
      conceal: {
        label: "Enhance coat edge",
        text: "Under the orange vest: a blue accordion strap — Paz’s kit, not Harbor Meter issue gear.",
      },
      imageSrc: "/evidence/late-fee/tip-jar-video.svg",
      imageStamp: "15:05 · PAZ PHONE · TIP-JAR STILL",
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
          reveal: "A blue accordion strap peeks from the thief’s coat — Paz’s kit, not Rita’s depot gear.",
        },
      ],
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
      imageSrc: "/evidence/late-fee/grease-bin.svg",
      imageStamp: "15:12 · ALLEY CAM · GREASE BIN",
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
        "Paz blames Rita on Harbor Street during the theft window, but Rita’s depot punch card keeps her off the street the whole time.",
    },
  ],
  confrontations: [
    {
      id: "paz-blames-rita",
      suspectId: "paz",
      claim: "Rita ticketed the meter and took the pouch. I only saw it happen.",
      correctEvidenceId: "rita-timecard",
      successResponse:
        "Paz’s smile thins. Rita’s depot clock wrecks the story — he was selling a false lead.",
      failureResponse:
        "Paz keeps talking. That exhibit doesn’t break his Rita story.",
    },
    {
      id: "paz-not-me",
      suspectId: "paz",
      claim: "I never touched attendant gear. I was just busking.",
      correctEvidenceId: "tip-jar-video",
      successResponse:
        "Paz goes quiet. His own tip-jar still shows vest, meter key, pouch, and his blue accordion strap.",
      failureResponse:
        "Paz laughs it off. You’ll need the frame that shows the gear.",
    },
  ],

  deductionChains: [
    {
      id: "false-lead-collapses",
      title: "The false lead collapses",
      requiredEvidenceIds: ["paz-statement", "rita-timecard"],
      requiredCorkLinks: [
        { evidenceId: "paz-statement", suspectId: "paz" },
        { evidenceId: "rita-timecard", suspectId: "rita" },
      ],
      unlockOnContradictionId: "paz-vs-rita-clock",
      insight:
        "Paz’s Rita story cannot survive the depot clock. Rita is being framed — and her job is the collateral.",
    },
    {
      id: "rent-recovery",
      title: "Rent recovery path",
      requiredEvidenceIds: ["tip-jar-video", "grease-bin"],
      requiredCorkLinks: [
        { evidenceId: "tip-jar-video", suspectId: "paz" },
        { evidenceId: "grease-bin", suspectId: "paz" },
      ],
      insight:
        "Paz took Jules’s rent float in attendant gear and parked it in the grease bin. Clear Rita. Recover the pouch.",
    },
  ],
  explanation: [
    "Rita’s depot punch card clears her for the whole theft window — Paz’s blame was a frame that nearly cost her the badge.",
    "Paz’s own tip-jar still shows attendant vest + meter key, with his blue accordion strap on the thief.",
    "The grease-bin still recovers Jules’s rent pouch with accordion-strap fibers — Paz took it and stashed it behind the taco truck.",
  ],
};
