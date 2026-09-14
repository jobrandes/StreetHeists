import type { CaseFile } from "@/lib/types";

/** Case 09 — flagship gala theft. Chair Elena Voss is about to be blamed. */
export const lastToastCase: CaseFile = {
  id: "last-toast",
  number: 9,
  title: "The Last Toast",
  subtitle: "A $2M necklace vanishes mid-toast. The chair is about to take the fall.",
  premise:
    "Gala night. Chair Elena Voss raises a glass — and a two-million-dollar necklace leaves her throat between 21:12 and 21:16. The room already whispers her name. You have the stills, the kitchen ticket, the seating chart, and a lift reflection that does not want to be found. Name who took it, how, and where it is — before Elena’s reputation is the collateral.",
  difficulty: "standard",
  unlockAfterCaseId: "pigeon-job",
  briefing: [
    {
      title: "THE STAKES",
      copy: "Elena Voss, gala chair, is minutes from being blamed for a $2M necklace loss on her own throat. The donor circle wants a name. If the wrong story sticks, Elena’s chair — and the charity’s season — go with it.",
    },
    {
      title: "THE WINDOW",
      copy: "21:12: necklace on, toast begins. 21:16: same camera angle, necklace gone, and the sleeve in frame is not Elena’s. Kitchen timing and an empty plus-one seat will matter more than gossip.",
    },
    {
      title: "YOUR JOB",
      copy: "Inspect the clues. String 2–3 sound pairs on the corkboard until the deduction cards unlock. Then Decide Who / How / Where with proof. Accuse stays locked until the chains hold.",
    },
  ],
  reconstruction: {
    title: "Gala Decide draft",
    intro: "Build Who / How / Where while you keep Gathering. Wrong picks still show — catch a bad theory before Accuse.",
    slots: [
      {
        id: "who",
        label: "Who took the necklace",
        prompt: "Who actually lifted the necklace?",
        options: [
          { id: "elena", label: "Elena Voss", detail: "Gala chair" },
          { id: "plus-one", label: "Plus-One", detail: "Guest of the chair’s circle" },
          { id: "house-captain", label: "House Captain", detail: "Service lead" },
          { id: "donor-child", label: "Donor’s adult child", detail: "Family of the lender" },
        ],
        correctOptionId: "plus-one",
        sceneLineByOption: {
          elena: "The chair palms her own necklace during the toast — a self-theft story.",
          "plus-one": "The plus-one leaves an empty seat and works the toast distraction.",
          "house-captain": "Service lead uses the tray line to pocket the piece.",
          "donor-child": "The donor’s adult child never risks the floor — vault theory.",
        },
      },
      {
        id: "how",
        label: "How it left her throat",
        prompt: "How was the necklace taken?",
        options: [
          { id: "toast-swap", label: "Toast distraction-swap", detail: "Eyes up, clasp gone" },
          { id: "service-pocket", label: "Service-line pocket", detail: "Tray-side lift" },
          { id: "never-left-vault", label: "Never left the vault", detail: "Frame job / still vaulted" },
        ],
        correctOptionId: "toast-swap",
        sceneLineByOption: {
          "toast-swap": "During the toast, eyes go up — a hand swaps the clasp in the dark.",
          "service-pocket": "A service tray brushes the chair; the necklace drops into a pocket.",
          "never-left-vault": "The floor piece was a decoy — the real necklace never left the vault.",
        },
      },
      {
        id: "where",
        label: "Where it is now",
        prompt: "Where is the necklace?",
        options: [
          { id: "service-lift", label: "Service lift", detail: "Back-of-house elevator" },
          { id: "with-plus-one", label: "Out with the plus-one", detail: "Coat / exit" },
          { id: "donor-vault", label: "Still in donor vault", detail: "Never traveled" },
        ],
        correctOptionId: "service-lift",
        sceneLineByOption: {
          "service-lift": "A lift-door reflection catches the necklace leaving on a service tray.",
          "with-plus-one": "The plus-one’s coat is already on the curb.",
          "donor-vault": "Vault log says the piece never cleared outbound after dressing.",
        },
      },
    ],
  },
  suspects: [
    {
      id: "elena",
      name: "Elena Voss",
      role: "Gala chair",
      personality: "Composed under fire. About to be blamed for a theft on her own throat.",
    },
    {
      id: "plus-one",
      name: "The Plus-One",
      role: "Guest · Table 1",
      personality: "Charming, under-documented, and missing from the seat during the toast window.",
    },
    {
      id: "house-captain",
      name: "House Captain",
      role: "Service lead",
      personality: "Owns the tray lanes and the lift keys. Swears the toast was clean.",
    },
    {
      id: "donor-child",
      name: "Donor’s adult child",
      role: "Lender family",
      personality: "Knows the vault codes. Would love a story that ends with Elena ruined.",
    },
  ],
  evidence: [
    {
      id: "cctv-912",
      title: "Ballroom Still · 21:12",
      kind: "still",
      caption: "Evidence #1 — Necklace on at toast",
      timestamp: "21:12",
      location: "Ballroom · head table",
      kicker: "Ballroom cam · 21:12",
      description:
        "As the toast begins, Elena Voss still wears the $2M necklace. Hands raise glasses. The clasp is visible at her nape.",
      deduction: "At 21:12 the necklace is still on Elena — the loss happens after the toast starts.",
      imageSrc: "/evidence/last-toast/cctv-912.svg",
      imageStamp: "21:12 · BALLROOM CAM · NECKLACE ON",
      visualTell: "Necklace on Elena at toast start.",
      linkedSuspectIds: ["elena"],
      howHint: "Still worn when toast begins",
      whereHint: "On Elena at head table",
      conceal: {
        label: "Lift the toast card",
        text: "The printed toast card in Elena’s hand is the donor’s script — she never leaves the spotlight during these four minutes.",
      },
    },
    {
      id: "cctv-916",
      title: "Mirror Catch at the Toast",
      kind: "still",
      caption: "Evidence — Mirror catch at the toast",
      timestamp: "21:47",
      location: "Ballroom · head table",
      kicker: "Gala still · 21:47 · inside the alibi window",
      description:
        "Timestamp 21:47 — inside the Stage alibi window (21:40–21:55). At first glance the toast looks clean. Zoom the glass at frame right: the reflection hides a second silhouette and a glitter that should not be there.",
      deduction:
        "The still is stamped 21:47, squarely inside the alibi window — yet the mirror crop hides a handoff the room never watched.",
      imageSrc: "/evidence/last-toast/cctv-916.svg",
      imageStamp: "21:47 · TOAST · SOMETHING IN THE GLASS",
      visualTell: "21:47 stamp vs alibi window — glass crop hides the swap.",
      linkedSuspectIds: ["plus-one", "elena"],
      howHint: "Toast-window swap",
      whereHint: "Toward service lift",
      alibiCheck: {
        stage: "Stage",
        window: "21:40–21:55",
        detail:
          "Alibi says Stage for this window. This still is stamped 21:47 — same window — but the glass crop shows what the alibi leaves out.",
      },
      hotspots: [
        {
          id: "mirror-catch",
          x: 72,
          y: 48,
          label: "Zoom crop — glass reflection",
          reveal:
            "In the lift-door glass: a tray hand and a glitter of the necklace leaving — stamped 21:47, while Stage claims a clean alibi.",
        },
      ],
      conceal: {
        label: "Check the sleeve in the glass",
        text: "The cuff in the reflection is not Elena’s gown — it matches the plus-one’s coat-check jacket. The still hid the swap in plain sight.",
      },
    },
    {
      id: "kitchen-ticket",
      title: "Kitchen Service Ticket",
      kind: "document",
      caption: "Evidence #3 — Toast time vs service run",
      timestamp: "21:14",
      location: "Back kitchen · pass",
      kicker: "Kitchen ticket · 21:14",
      description:
        "Toast is called at 21:12. A house-captain lane service lift run is logged at 21:15 — champagne tray to table 1 — overlapping the loss window.",
      deduction: "Service timing overlaps the toast distraction; the lift run is the exit lane.",
      imageSrc: "/evidence/last-toast/kitchen-ticket.svg",
      imageStamp: "21:14 · KITCHEN · SERVICE TICKET",
      visualTell: "Toast 21:12 vs lift run 21:15.",
      linkedSuspectIds: ["house-captain", "plus-one"],
      howHint: "Toast distraction covers the swap",
      whereHint: "Service lift lane",
    },
    {
      id: "seating-chart",
      title: "Table 1 Seating Chart",
      kind: "document",
      caption: "Evidence #4 — Empty plus-one seat",
      timestamp: "21:12–21:16",
      location: "Donor circle · table 1",
      kicker: "Seating · toast window",
      description:
        "Seating chart for table 1 marks the plus-one seat empty for the entire toast window while Elena remains standing with the mic.",
      deduction:
        "The plus-one is not in the seat when the necklace vanishes — they are free to work the swap.",
      imageSrc: "/evidence/last-toast/seating-chart.svg",
      imageStamp: "GALA · SEATING CHART · TABLE 1",
      visualTell: "Plus-one seat empty 21:12–21:16.",
      linkedSuspectIds: ["plus-one"],
      howHint: "Empty seat during toast",
      whereHint: "Away from table toward service",
    },
    {
      id: "vault-log",
      title: "Donor Vault Access Log",
      kind: "document",
      caption: "Evidence #5 — Vault never inbound",
      timestamp: "20:40–21:20",
      location: "Donor vault",
      kicker: "Vault log",
      description:
        "Necklace cleared outbound to chair dressing at 20:40. No vault movement at 21:12. Alarm after toast. No inbound return.",
      deduction: "The necklace is not still in the vault — the ‘never left vault’ story is a frame.",
      imageSrc: "/evidence/last-toast/vault-log.svg",
      imageStamp: "DONOR VAULT · ACCESS LOG",
      visualTell: "Outbound to dressing; no return.",
      linkedSuspectIds: ["donor-child", "elena"],
      howHint: "Not a vault-only frame",
      whereHint: "Not in vault",
    },
  ],
  howChoices: [
    {
      id: "toast-swap",
      label: "Toast distraction-swap",
      detail: "During the toast, eyes go up; the clasp is swapped in the dark.",
    },
    {
      id: "service-pocket",
      label: "Service-line pocket",
      detail: "A tray brush drops the necklace into a service pocket.",
    },
    {
      id: "never-left-vault",
      label: "Never left the vault",
      detail: "The floor piece was theater — the real necklace stayed vaulted.",
    },
  ],
  whereChoices: [
    {
      id: "service-lift",
      label: "Service lift",
      detail: "Leaving on a tray through the back-of-house elevator.",
    },
    {
      id: "with-plus-one",
      label: "Out with the plus-one",
      detail: "Already in a coat toward the curb.",
    },
    {
      id: "donor-vault",
      label: "Still in donor vault",
      detail: "Never traveled to the ballroom.",
    },
  ],
  solution: {
    who: "plus-one",
    how: "toast-swap",
    where: "service-lift",
  },
  solutionEvidence: {
    who: ["seating-chart", "cctv-916"],
    how: ["cctv-912", "cctv-916", "kitchen-ticket"],
    where: ["cctv-916", "kitchen-ticket"],
  },
  contradictions: [
    {
      id: "toast-vs-ticket",
      evidenceIdA: "cctv-912",
      evidenceIdB: "kitchen-ticket",
      phraseA: "Toast fills the room’s attention at 21:12",
      phraseB: "Service lift run hits table 1 at 21:15",
      insight:
        "The toast is the distraction; the lift run is the exit — they are one play, not two coincidences.",
    },
  ],
  confrontations: [
    {
      id: "plus-one-seat",
      suspectId: "plus-one",
      claim: "I never left my seat during the toast. Ask anyone at table 1.",
      correctEvidenceId: "seating-chart",
      successResponse:
        "The plus-one’s smile thins. The seating chart parks their seat empty for the whole toast window.",
      failureResponse:
        "They shrug. That exhibit doesn’t move them off the ‘I stayed seated’ story.",
    },
    {
      id: "elena-sleeve",
      suspectId: "elena",
      claim: "If the necklace left my throat, it was still me in that 21:16 frame.",
      correctEvidenceId: "cctv-916",
      successResponse:
        "Elena studies the sleeve mismatch and the lift reflection. She stops volunteering as the only body in frame.",
      failureResponse:
        "Elena stays composed. You’ll need the frame that breaks the ‘only me’ story.",
    },
  ],
  deductionChains: [
    {
      id: "toast-window-swap",
      title: "Toast-window swap",
      requiredEvidenceIds: ["cctv-912", "cctv-916"],
      correctPairs: [["cctv-912", "cctv-916"]],
      pairsRequired: 1,
      insight:
        "21:12 necklace on; 21:16 same angle gone with a mismatched sleeve — the swap happens inside the toast.",
    },
    {
      id: "service-timing",
      title: "Service timing",
      requiredEvidenceIds: ["kitchen-ticket", "cctv-912"],
      correctPairs: [["kitchen-ticket", "cctv-912"]],
      pairsRequired: 1,
      unlockOnContradictionId: "toast-vs-ticket",
      insight:
        "Toast call and service-lift run lock together — the distraction and the exit are one chain.",
    },
    {
      id: "empty-seat-exit",
      title: "Empty seat → lift",
      requiredEvidenceIds: ["seating-chart", "cctv-916"],
      correctPairs: [["seating-chart", "cctv-916"]],
      pairsRequired: 1,
      insight:
        "Plus-one seat empty during the toast; lift reflection carries the necklace out — Elena is being framed.",
    },
  ],
  chainsRequiredToAccuse: 2,
  explanation: [
    "21:12 shows Elena still wearing the necklace; 21:16 shows it gone with a sleeve that is not hers.",
    "The kitchen ticket puts a service lift run on table 1 inside the toast window — the exit lane.",
    "The seating chart parks the plus-one’s seat empty for the whole toast; the lift reflection is where the necklace goes.",
  ],
};
