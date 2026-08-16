# The Ladder of Abstraction

### From two letter-states to five circles: al-Khalīl's system built from the bottom up

Al-Khalīl's circles are usually presented from the top: five circles, sixteen meters.
Read that way, the system looks like a taxonomy of poetry that already existed.

Read from the bottom, it's a construction. Five rungs, where each rung is produced from
the one below by an operation you can carry out yourself. The units, the feet, and the
meters aren't catalogued — they're derived. This document works through the derivation.

Every count below is computed from the unit alphabet, not quoted. The companion software
([arudi.midadalfikr.com](https://arudi.midadalfikr.com)) derives them at load time and
`data/ladder.test.ts` asserts them.

**The funnel:** 2 letter states → 5 units → 10 arrangements → 8 distinct rhythms →
16 meters in use → 5 circles.

---

## Rung 1 — The letter

Prosody records one property of a letter: whether it's moving or quiescent.

- **moving** (*mutaḥarrik*, متحرك) — a consonant with a vowel — is `1`
- **quiescent** (*sākin*, ساكن) — a consonant with sukūn, or a letter of prolongation —
  is `0`

Nothing else survives. Not the consonant, not the vowel, not the word or its meaning. A
line of verse becomes a bit string, and that string is the system's only input.

The foot *faʿūlun*:

| فَ | عُ | و | لُ | نْ |
|---|---|---|---|---|
| 1 | 1 | 0 | 1 | 0 |

`11010`.

This is the largest abstraction in the system and the easiest to skip past. Everything
above depends on the claim that a two-symbol alphabet captures the meter completely. It
does.

---

## Rung 2 — The unit

Bits cluster into a small set of units. Five appear across the circles:

| symbol | bits | name | gloss |
|---|---|---|---|
| `0/` | `10` | سبب خفيف | light cord |
| `0//` | `110` | وتد مجموع | joined peg |
| `0///` | `1110` | فاصلة صغرى | minor cluster |
| `//` | `11` | سبب ثقيل | heavy cord |
| `/0/` | `101` | وتد مفروق | split peg |

> **Notation.** Prosodic symbols are written right-to-left like the script, so `0//`
> reads *strike, strike, rest* from the right. The bits column is in temporal order,
> first sound first. Both conventions are used in the literature; mixing them silently
> causes errors.

### Three of the five are one family

The first three rows are the pattern **1^k · 0** — some moving letters closed by one
quiescent — for k = 1, 2, 3:

```
k=1    10      sabab khafīf
k=2    110     watid majmūʿ
k=3    1110    fāṣila ṣughrā
```

Two units fall outside it: `11`, which has no closing quiescent, and `101`.

### The unit names encode the bit patterns

*Majmūʿ* means joined. *Mafrūq* means split.

```
مجموع   110    quiescent last: the two movings are together
مفروق   101    quiescent middle: it separates them
```

Both units contain two moving letters and one quiescent letter. Only the position of the
quiescent differs. The names describe the bit strings rather than labelling them, which
is checkable — the two are anagrams, and the test suite asserts it.

The split peg is worth marking here. It appears in one circle only, and it produces the
single ambiguity in the system.

---

## Rung 3 — The foot

Take a multiset of units and enumerate its distinct orderings. The classical feet fall
out of the enumeration.

**Peg + two cords — three orderings:**

| arrangement | bits | foot |
|---|---|---|
| `0// 0/ 0/` | `1101010` | مفاعيلن |
| `0/ 0// 0/` | `1011010` | فاعلاتن |
| `0/ 0/ 0//` | `1010110` | مستفعلن |

These are exactly the three classical seven-letter feet.

**Peg + cluster — two orderings:**

| arrangement | bits | foot |
|---|---|---|
| `0// 0///` | `1101110` | مفاعلتن |
| `0/// 0//` | `1110110` | متفاعلن |

**Peg + cord — two orderings:**

| arrangement | bits | foot |
|---|---|---|
| `0// 0/` | `11010` | فعولن |
| `0/ 0//` | `10110` | فاعلن |

**Split peg + two cords — three orderings:**

| arrangement | bits | foot |
|---|---|---|
| `/0/ 0/ 0/` | `1011010` | فاع لاتن |
| `0/ /0/ 0/` | `1010110` | مستفع لن |
| `0/ 0/ /0/` | `1010101` | مفعولات |

Ten arrangements across four multisets, and every one is a named classical foot.

### Two arrangements collide

Ten arrangements produce eight distinct bit strings:

```
1011010    فاعلاتن   = cord · joined peg · cord
1011010    فاع لاتن  = split peg · cord · cord

1010110    مستفعلن   = cord · cord · joined peg
1010110    مستفع لن  = cord · split peg · cord
```

Identical bit for bit. Two decompositions, one sound. The difference is in the parse, and
the parse isn't audible.

Two points follow:

1. **Both collisions involve the split peg.** Remove `101` from the alphabet and the map
   from decomposition to sound becomes injective.

2. **This happens two rungs below the circles.** دائرة المشتبه is called "the
   confusable," but the ambiguity isn't a property of that circle. It already exists in
   the combinatorics, before any circle is constructed. The circle inherits it.

---

## Rung 4 — The meter

A meter is a sequence of feet. الطويل is فعولن مفاعيلن فعولن مفاعيلن. الكامل is
متفاعلن three times. الرجز is مستفعلن three times.

This rung isn't really a construction step. Al-Khalīl doesn't build meters by selecting
feet; he builds them by operating on the line, which is rung 5. What's worth noting is
how the meters group by the multiset their feet came from:

| circle | multiset | meters | repeated foot |
|---|---|---|---|
| المتفق | peg + cord | المتقارب، المتدارك | فعولن، فاعلن |
| المؤتلف | peg + cluster | الوافر، الكامل | مفاعلتن، متفاعلن |
| المجتلب | peg + 2 cords | الهزج، الرجز، الرمل | مفاعيلن، مستفعلن، فاعلاتن |

Each circle has as many meters as its multiset has arrangements, and each meter is one
arrangement repeated.

---

## Rung 5 — The circle

Join the end of the line to its beginning.

A verse repeats its meter, so the line can be closed into a loop. The meter becomes a
necklace: a closed sequence of units with no first element. Reading it requires choosing
a starting point, and different starting points give different meters.

| circle | units | distinct readings | meters used |
|---|---|---|---|
| المختلف | 10 | 5 | 3 |
| المؤتلف | 6 | 2 | 2 |
| المجتلب | 9 | 3 | 3 |
| المشتبه | 9 | 9 | 6 |
| المتفق | 8 | 2 | 2 |
| | | **21** | **16** |

### Rotation and rearrangement are the same operation

This is why rung 5 follows from rung 3 rather than replacing it.

دائرة المجتلب's necklace is (peg, cord, cord) three times over. Rotate by one unit:
(cord, cord, peg). Rotate again: (cord, peg, cord). Those are the three arrangements
from rung 3.

The equivalence holds because each of these multisets has one distinguished unit among
otherwise identical ones, so its distinct arrangements and its cyclic rotations coincide.
It isn't general — `{peg, peg, cord, cord}` has six arrangements but four rotations —
which is why it's worth checking rather than assuming.

The circle isn't a new construct on top of the feet. It's the arrangement space of rung 3
with a geometry attached.

### What the geometry adds

**A closed catalogue.** Twenty-one distinct readings across five circles. Not
twenty-one found so far — twenty-one possible.

**Predicted absences.** Poets use 16 of the 21. Al-Khalīl named the unused ones rather
than dropping them; المستطيل and الممتد are lawful rhythms nobody wrote. Once you
classify by group action, the orbit tells you what's possible independent of what's
attested, so an absence becomes a fact requiring explanation. Mendeleev's empty cells
work the same way.

**An explanation for the counts.** Why does المؤتلف yield two meters and المشتبه nine,
when both are built the same way? Because rotations that map a necklace onto itself
produce no new reading. The relation is exact:

> units = distinct readings × symmetries

10 = 5×2, 6 = 2×3, 9 = 3×3, 9 = 9×1, 8 = 2×4. This is the orbit–stabilizer theorem.
Al-Khalīl had no name for it. The relation holds anyway, because it's a property of the
objects rather than of the vocabulary describing them.

---

## The construction, end to end

```
2 letter states
    ↓ cluster
5 units            three of them the family 1^k·0, two irregular
    ↓ arrange
10 arrangements    → 8 distinct rhythms (2 collisions, both from the split peg)
    ↓ sequence
16 meters in use
    ↓ close the loop
5 circles          21 readings possible
```

Two symbols to sixteen meters, with no uncounted step.

## Three things the bottom-up reading shows

**The abstraction comes first and is total.** Reducing verse to `1` and `0` discards
everything a poem is about. Nothing in the system works without it, and it happens on
rung 1, before any of the structure appears.

**The vocabulary already contains the mathematics.** *Majmūʿ* and *mafrūq* describe
`110` and `101` precisely. Whoever named the units was describing structure.

**The ambiguity has a specific cause.** Ten arrangements collapse into eight sounds, and
both collisions come from the one irregular unit. The six meters of المشتبه that
students confuse aren't evidence of a defect in that circle. They're a consequence of a
single bit pattern, visible three rungs earlier.

The top-down reading makes al-Khalīl a good cataloguer. The bottom-up reading shows him
building the machine that generates the meters, then reading off it verses nobody had
written.

---

*Every number here is derived. See `data/ladder.ts` and `data/ladder.test.ts`, and the
interactive «سُلَّم التجريد» view at
[arudi.midadalfikr.com](https://arudi.midadalfikr.com). Companion documents: **The
Circles of al-Khalīl** (the same material as a technical article), **The Turn That
Changes Nothing** (group theory taught through the circles), and **The Compass and the
Ear** (the same mathematics in Islamic geometric ornament).*
