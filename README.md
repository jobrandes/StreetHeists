# Street Heists

Phone-first comedy-crime mystery. Inspect provided evidence, string clue pairs on the corkboard to unlock deduction cards, then Accuse Who / How / Where.

## Play

```bash
npm install
npm run dev -- --port 43198
```

Open [http://127.0.0.1:43198](http://127.0.0.1:43198).

Blessed production: [https://streetheists.netlify.app](https://streetheists.netlify.app)

## Cases

1. **The Pigeon Job** — ~4 min tutorial (inspect → one clue link → accuse)
2. **The Last Toast** — flagship gala necklace theft
3. **The Late Fee** — meter pouch frame-job
4. Velvet Teaspoon / Dessert Trolley — harder unlocks

## PRISM Formal (v0.4)

- Corkboard grades **clue↔clue** links (invalid miss does not wipe the board)
- Accuse locked until required deduction chains unlock
- Public Midnight share cards never print Who/How/Where
- Wrong accuse preserves pins, links, and proof draft
