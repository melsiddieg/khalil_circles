# The Circles of al-Khalīl

### Symmetry, group actions, and the combinatorial architecture of Arabic meter

Al-Khalīl ibn Aḥmad al-Farāhīdī (d. ~786 CE) classified the meters of classical Arabic
poetry into five circles. Each circle is a closed sequence of syllabic units, and each
meter is that sequence read from a different starting point. The system is usually
described as a taxonomy. It isn't. It's a generative construction, and its structure is
exactly the structure of a finite cyclic group acting on a necklace.

This document sets out that correspondence and the counts that come with it. Every
number here was computed from the sequence data rather than copied from the literature;
the code and tests are in the companion repository, and the interactive version is at
[arudi.midadalfikr.com](https://arudi.midadalfikr.com).

Two claims are worth flagging up front:

1. **The system is closed.** The five circles admit exactly 21 distinct readings. The
   tradition uses 16. The remaining 5 are lawful and were named, not overlooked.
2. **The confusability of one circle is combinatorial, not phonetic.** دائرة المشتبه is
   called "the confusable," and the reason is visible two levels below the circles, in
   the way feet decompose into units.

---

## 1. The binary encoding

Arabic prosody reduces a letter to one bit:

- **moving** (*mutaḥarrik*, متحرك) — a consonant with a vowel — is `1`
- **quiescent** (*sākin*, ساكن) — a consonant with sukūn, or a letter of prolongation —
  is `0`

Nothing else survives. A line of verse becomes a bit string, and that string is the
system's only input. The foot *faʿūlun* (فَعُولُنْ) is `11010`.

This encoding is complete for the purpose. Two lines with the same bit string are in the
same meter, and the classical tradition treats them that way.

**Note on notation.** Prosodic symbols are written right-to-left like the script. The
unit written `0//` reads *strike, strike, rest* starting from the right. Throughout this
document, the "bits" column is in **temporal order** — first sound first — so `0//`
appears as `110`. Both conventions appear in the literature and mixing them silently is
a common source of error.

---

## 2. The unit alphabet

Bits cluster into a small set of units. Five appear in the five circles:

| symbol | bits | name | gloss |
|---|---|---|---|
| `0/` | `10` | سبب خفيف | light cord |
| `0//` | `110` | وتد مجموع | joined peg |
| `0///` | `1110` | فاصلة صغرى | minor cluster |
| `//` | `11` | سبب ثقيل | heavy cord |
| `/0/` | `101` | وتد مفروق | split peg |

Three of the five are one pattern: **1^k · 0**, some moving letters closed by a single
quiescent, for k = 1, 2, 3. Only two units fall outside it — `11`, which has no closing
quiescent, and `101`.

### The unit names encode the bit patterns

*Majmūʿ* means joined; *mafrūq* means split. The two pegs contain the same letters in
the same quantities — two moving, one quiescent. The only difference is the position of
the quiescent:

```
مجموع   110    quiescent last: the two movings are together
مفروق   101    quiescent middle: it separates them
```

The terminology is a description of the bit string, not a label attached to it. This is
an observation about the classical vocabulary, and it's checkable: the two units are
anagrams, which the test suite asserts.

The split peg matters disproportionately. It appears in one circle only, and it causes
the single ambiguity in the system (§3).

---

## 3. Feet as arrangements

The classical feet are usually presented as a list to memorize. They don't need to be.
Take a multiset of units and enumerate its distinct orderings; the feet fall out.

**Peg + two cords — three orderings:**

| units | bits | foot |
|---|---|---|
| `0// 0/ 0/` | `1101010` | مفاعيلن |
| `0/ 0// 0/` | `1011010` | فاعلاتن |
| `0/ 0/ 0//` | `1010110` | مستفعلن |

**Peg + cluster — two orderings:** مفاعلتن (`1101110`), متفاعلن (`1110110`).

**Peg + cord — two orderings:** فعولن (`11010`), فاعلن (`10110`).

**Split peg + two cords — three orderings:** فاع لاتن (`1011010`), مستفع لن (`1010110`),
مفعولات (`1010101`).

Ten arrangements across the four multisets, and every one is a named classical foot. No
lookup table is involved.

### The map from decomposition to sound is not injective

Ten arrangements produce only **eight** distinct bit strings:

```
1011010    فاعلاتن   = cord · joined peg · cord
1011010    فاع لاتن  = split peg · cord · cord

1010110    مستفعلن   = cord · cord · joined peg
1010110    مستفع لن  = cord · split peg · cord
```

These pairs are identical bit for bit. No listener can distinguish them, because the
distinction is in the parse, and the parse isn't audible.

Both collisions involve the split peg. Remove `101` from the alphabet and the map
becomes injective.

This is the origin of دائرة المشتبه's name. The circle isn't confusable because of
anything about circles — the ambiguity exists at the level of feet, before any circle is
constructed. The circle inherits it.

---

## 4. Closing the line into a circle

A verse repeats its meter. Al-Khalīl's move was to stop writing the meter as a line and
join its end to its start, producing a closed loop of units — a necklace.

A necklace has no first element, so reading it requires choosing a starting point.
Different starting points give different meters.

Formally: the cyclic group **C_n** acts on a necklace of n units by rotation. The
**orbit** is the set of distinct readings. The **stabilizer** is the set of rotations
that map the necklace onto itself.

| circle | units n | orbit | stabilizer | meters used |
|---|---|---|---|---|
| المختلف | 10 | 5 | C₂ | 3 |
| المؤتلف | 6 | 2 | C₃ | 2 |
| المجتلب | 9 | 3 | C₃ | 3 |
| المشتبه | 9 | 9 | C₁ | 6 |
| المتفق | 8 | 2 | C₄ | 2 |
| | | **21** | | **16** |

### Rotation and rearrangement are the same operation

This is what makes the construction hold together rather than being two unrelated ideas.

دائرة المجتلب's necklace is (peg, cord, cord) repeated three times. Rotate by one unit
and you get (cord, cord, peg). Rotate again: (cord, peg, cord). Those are the three
arrangements from §3.

The equivalence holds because each of these multisets has exactly one distinguished unit
among otherwise identical ones, so its distinct arrangements and its cyclic rotations
coincide. It is not general — `{peg, peg, cord, cord}` has six arrangements but only
four rotations. Worth verifying rather than assuming.

So the circle isn't a new construct layered on top of the feet. It's the arrangement
space of §3 given a geometry.

### Orbit–stabilizer

For a finite group acting on an object:

> |group| = |orbit| × |stabilizer|

Applied here: 10 = 5×2, 6 = 2×3, 9 = 3×3, 9 = 9×1, 8 = 2×4. All five hold exactly.

The practical reading is a trade-off. Symmetry is sameness, and sameness reduces
variety. المتفق is the most symmetric circle (C₄) and produces the fewest meters.
المشتبه has no symmetry beyond the identity and produces the most — all nine of its
rotations are distinct.

Al-Khalīl had no term for this theorem. The relation holds anyway, because it's a
property of the objects.

---

## 5. Predicted absences

The circles admit 21 distinct readings. Classical poetry uses 16.

Al-Khalīl didn't drop the other five to make the theory fit the evidence. He named the
two in the first circle — المستطيل and الممتد — and recorded the rest. These are
*muhmal*: lawful but unused.

That's a structural argument, not a descriptive one. Once you classify by group action,
the orbit tells you what's possible regardless of what's attested, and an absence
becomes a fact needing explanation rather than a silence. The comparison to Mendeleev's
empty cells is apt, and the direction of reasoning is the same.

Where the gaps fall is also informative: all five are in the two least symmetric
circles, which are the only ones whose orbits are larger than the tradition needed.

---

## 6. Two layers: exact and lossy

The circles handle exact identity. A second mechanism handles approximate identity, and
the two have different algebraic character.

**Rotation** is a group action: exact, invertible, and it never creates genuine
ambiguity. Two meters related by rotation — الطويل and المديد, say — are never confused
in practice, because a verse has a beginning and a rhyme, and performance fixes the
phase.

**Ziḥāf** — the licensed foot variations — is not a group. The operations are lossy and
one-way. Quiescing the second letter of متفاعلن (*iḍmār*) produces مستفعلن; you cannot
invert it. These operations compose but don't undo, so they form a monoid.

All real ambiguity lives in the second layer:

- الكامل fully muḍmar sounds like الرجز
- مجزوء الوافر fully maʿṣūb matches الهزج

Both of these turn out to be the same operation at the unit level: a fāṣila collapsing
into two light cords, `0///` → `0/ 0/`. Applied to the whole necklace, that rewrite maps
دائرة المؤتلف onto دائرة المجتلب exactly, which is checkable and checked. The two
celebrated confusions are one morphism seen from two starting points.

The classical adjudication rule for ambiguous cases — *يُحمل المشترك على الأصل*, assign
the shared form to the meter where it is original rather than derived — is a prior. It's
maximum-likelihood decoding, and it works because ziḥāf is optional per foot: a single
unvaried متفاعلن anywhere in a poem identifies it as الكامل. A poem is a long codeword.

The summary: **rotation never confuses; loss confuses.** The one exception is
خفيف/مجتث, which are rotations of the same circle-4 necklace and blur only when
truncation shortens the line enough to weaken the phase anchor.

---

## 7. The construction, end to end

```
2 letter states
   ↓ cluster
5 units              three of them the family 1^k·0, two irregular
   ↓ arrange
10 arrangements      → 8 distinct rhythms (2 collisions, both from the split peg)
   ↓ sequence
16 meters in use
   ↓ close the loop
5 circles            21 readings possible
```

Each step is an operation, not a classification. The counts are consequences.

---

## 8. What is and isn't being claimed

**Claimed, and verified computationally:** the orbit and stabilizer figures; the
21 = 16 + 5 decomposition; that the classical feet are the arrangements of four
multisets; that exactly two arrangements collide and both involve the split peg; that
the fāṣila collapse maps circle 2's necklace onto circle 3's; that the two pegs are
anagrams.

**Inference, not established fact:** that al-Khalīl or his tradition consciously reasoned
about symmetry as such. The system behaves as though it does, which is a weaker and
sufficient claim. The tradition's own vocabulary — *majmūʿ* / *mafrūq* describing bit
patterns, *muhmal* for lawful-but-unused — shows structural thinking, but not group
theory.

**Not claimed:** that the circles are a "discovery of group theory." Group theory is a
19th-century formalism. What the circles contain is a complete classification of a set of
objects under a group action, executed without the formalism. Those are different
statements, and the second is the interesting one.

**Historical caveat:** whether al-Khalīl personally coined the five circle names or
whether they settled later is not something this analysis can determine. The structural
claims don't depend on it.

---

## Reproducing the results

The counts in this document are derived at load time from the circles' unit sequences,
not stored:

- `data/rotations.ts` — `sequencePeriod`, `canonicalOffset`, `stabilizerOrder`
- `data/ladder.ts` — the unit alphabet, arrangement enumeration, collision census
- `data/tadakhul.ts` — the ziḥāf edges and the fāṣila rewrite
- `data/ladder.test.ts`, `data/tadakhul.test.ts` — assertions for everything above

`scripts/verify-math.ts` runs 552 brute-force checks against the orbit and stabilizer
figures independently of the display code.

---

*Companion documents: **The Ladder of Abstraction** (the same construction, bottom-up and
in more detail), **The Turn That Changes Nothing** (group theory taught through the
circles), and **The Compass and the Ear** (the same mathematics in Islamic geometric
ornament).*
