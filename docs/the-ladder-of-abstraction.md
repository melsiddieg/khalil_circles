# The Ladder of Abstraction

### From two letter-states to five circles: al-Khalīl's system built from the bottom up

Al-Khalīl's circles are almost always presented from the top. *Here are five circles;
here are the sixteen meters they yield.* Read that way the system looks like a
classification — a tidy filing cabinet for facts about poetry that already existed.

Read from the bottom it is something else: a **construction**. Five rungs, where each
rung is produced from the one below by an operation you can carry out yourself, and
where the classical objects — the units, the feet, the meters — are not catalogued but
*derived*. This document climbs it.

Every count below is computed, not quoted. The companion software
([arudi.midadalfikr.com](https://arudi.midadalfikr.com)) derives them at load time from
the unit alphabet, and `data/ladder.test.ts` asserts them.

**The funnel:**

| | 2 | → | 5 | → | 10 | → | 8 | → | 16 | → | 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | letter states | | units | | arrangements | | distinct rhythms | | meters in use | | circles |

---

## Rung 1 — The letter: two states, and no third

Prosody knows exactly one thing about a letter: **is it moving or still?**

- A letter carrying a vowel — *mutaḥarrik*, متحرك — is **1**.
- A letter with sukūn, or a letter of prolongation, — *sākin*, ساكن — is **0**.

Nothing else survives the abstraction. Not which consonant, not which vowel, not the
word, not the meaning. A line of poetry becomes a string of ones and zeros, and that
string is the entire raw material of the system.

Take the simplest foot, *faʿūlun*:

| فَ | عُ | و | لُ | نْ |
|---|---|---|---|---|
| 1 | 1 | 0 | 1 | 0 |

`11010`. That is what a poem looks like from inside the machine.

This is the first and largest act of abstraction in the whole system, and it is the one
most easily passed over. An eighth-century scholar decided that the sound of Arabic
verse could be *completely* captured in a binary alphabet — and was right.

---

## Rung 2 — The unit: five clusters

Movings and stills do not combine freely. They gather into a short list of clusters,
and those clusters are the alphabet everything above is written in.

| | bits | name | |
|---|---|---|---|
| `0/` | `10` | سبب خفيف | light cord |
| `0//` | `110` | وتد مجموع | joined peg |
| `0///` | `1110` | فاصلة صغرى | minor cluster |
| `//` | `11` | سبب ثقيل | heavy cord |
| `/0/` | `101` | وتد مفروق | **split** peg |

> *Prosodic symbols are written right-to-left like the script: `0//` reads
> strike–strike–rest, from the right. The bit column is in temporal order,
> first sound first.*

### Three of the five are one family

Look at the first three rows. They are the single pattern **1^k · 0** — some moving
letters closed by exactly one still one — for k = 1, 2, 3:

```
k=1    10      sabab khafīf
k=2    110     watid majmūʿ
k=3    1110    fāṣila ṣughrā
```

The alphabet is very nearly a single arithmetic progression. Only two units fall
outside it: `11`, two movings with no closing still, and `101`.

### The names are readings of the bit patterns

This is the finding that should stop you.

```
مجموع   110     the two movings JOINED, then the still
مفروق   101     the still SPLITTING them apart
```

*Majmūʿ* means **joined**. *Mafrūq* means **split**. Both units contain exactly two
moving letters and one still letter — the same bag of symbols, in the same quantities.
The **only** difference is where the still one sits. Put it at the end and the movings
are joined; put it in the middle and they are split.

The Arabic terminology is not a label attached to a pattern after the fact. It is a
**description of the bit string**. Whoever named these units was looking at exactly
what we are looking at.

That split peg is worth marking now, because it causes everything interesting that
follows. It appears in only one of the five circles, and it is the sole reason that
circle is called *the confusable*.

---

## Rung 3 — The foot: arrangements

Here the construction starts generating rather than describing.

**Do not list the feet. Choose a multiset of units and lay it out every possible way.**

### A peg and two cords → three arrangements

| arrangement | bits | foot |
|---|---|---|
| `0// 0/ 0/` | `1101010` | مفاعيلن |
| `0/ 0// 0/` | `1011010` | فاعلاتن |
| `0/ 0/ 0//` | `1010110` | مستفعلن |

Three orderings, and they are *exactly* the three classical seven-letter feet. Nothing
was looked up. The feet fell out of the counting.

### A peg and a cluster → two arrangements

| arrangement | bits | foot |
|---|---|---|
| `0// 0///` | `1101110` | مفاعلتن |
| `0/// 0//` | `1110110` | متفاعلن |

Exactly the two feet of دائرة المؤتلف.

### A peg and a cord → two arrangements

| arrangement | bits | foot |
|---|---|---|
| `0// 0/` | `11010` | فعولن |
| `0/ 0//` | `10110` | فاعلن |

Exactly the two feet of دائرة المتفق.

### A split peg and two cords → three arrangements

| arrangement | bits | foot |
|---|---|---|
| `/0/ 0/ 0/` | `1011010` | فاع لاتن |
| `0/ /0/ 0/` | `1010110` | مستفع لن |
| `0/ 0/ /0/` | `1010101` | مفعولات |

Ten arrangements in total, across the four multisets, and every one of them is a named
classical foot.

### The twist: abstraction loses information here

Ten arrangements — but only **eight** distinct rhythms. Compare the bit strings:

```
1011010   فاعلاتن  = 0/ 0// 0/     (cord · joined peg · cord)
1011010   فاع لاتن = /0/ 0/ 0/     (split peg · cord · cord)

1010110   مستفعلن  = 0/ 0/ 0//     (cord · cord · joined peg)
1010110   مستفع لن = 0/ /0/ 0/     (cord · split peg · cord)
```

**Identical, letter for letter.** Two different decompositions produce exactly the same
sound. No ear can separate them — only the parse into units can, and the parse is not
audible.

Two observations about this, both of which matter later:

1. **Both collisions involve the split peg.** Neither would exist without `101`. The
   one irregular unit in the alphabet is the sole source of ambiguity in the system.

2. **This happens two rungs *below* the circles.** The confusability that makes
   دائرة المشتبه "the confusable" is not a property of that circle. It is already
   present in the raw combinatorics, before any circle has been drawn.

---

## Rung 4 — The meter: feet in sequence

A meter is a row of feet. الطويل is فعولن مفاعيلن فعولن مفاعيلن; الكامل is متفاعلن
three times; الرجز is مستفعلن three times.

This rung is the shortest to describe and the least interesting mathematically, because
in al-Khalīl's hands it is not really a construction step at all. He does not build
meters by choosing feet. He builds them by doing something to the *line* — which is
rung 5.

The thing worth noticing is what the meters look like once they are lined up by which
multiset their feet came from:

| circle | multiset | its meters | the foot each repeats |
|---|---|---|---|
| المتفق | peg + cord | المتقارب، المتدارك | فعولن، فاعلن |
| المؤتلف | peg + cluster | الوافر، الكامل | مفاعلتن، متفاعلن |
| المجتلب | peg + 2 cords | الهزج، الرجز، الرمل | مفاعيلن، مستفعلن، فاعلاتن |

Each of these circles has exactly as many meters as its multiset has arrangements, and
each meter is one arrangement, repeated. The correspondence is exact.

---

## Rung 5 — The circle: closing the loop

The last step is the boldest, and it is the one nobody else took.

**Join the end of the line to its beginning.**

A verse repeats; its metre returns, foot after foot, line after line. So stop writing it
as a line. Bend it until the end meets the start, and the meter becomes a **necklace** —
a closed loop of units with no beginning.

A necklace has no first bead, which means you must *choose* where to start reading. And
choosing a different starting point gives you a different meter.

| circle | units | distinct readings | meters used |
|---|---|---|---|
| المختلف | 10 | 5 | 3 |
| المؤتلف | 6 | 2 | 2 |
| المجتلب | 9 | 3 | 3 |
| المشتبه | 9 | 9 | 6 |
| المتفق | 8 | 2 | 2 |
| | | **21** | **16** |

### The hinge: rotation *is* rearrangement

Here is why rung 5 follows from rung 3 rather than replacing it.

Take دائرة المجتلب. Its necklace is (peg, cord, cord) three times over. Rotate it by one
unit and you get (cord, cord, peg). Rotate again and you get (cord, peg, cord).

Those are the same three sequences the arrangements produced. **Rotating the necklace and
rearranging the foot are the same operation.**

This holds because each of these multisets has exactly one distinguished unit among
otherwise identical ones, so its arrangements and its cyclic rotations coincide. It is
not a general fact — a multiset like {peg, peg, cord, cord} has six arrangements but only
four rotations — which is what makes it worth checking rather than assuming.

So the circle is not a new idea stacked on top of the feet. It is the **arrangement space
of rung 3, given a geometry.** Al-Khalīl found the shape that the combinatorics already
had.

### What the geometry buys that the list did not

Three things the list of feet could never have given:

**A closed catalogue.** Twenty-one distinct readings across five circles, and that is
all there are. Not twenty-one found so far — twenty-one possible.

**Predicted absences.** Of the 21, poets used 16. Al-Khalīl did not quietly drop the
other five; he named them. المستطيل and الممتد are lawful rhythms that no one wrote.
This is the move of a theorist, not a compiler: trust the structure, and let the empty
cells stand as facts requiring explanation. Mendeleev did the same thing with the
elements, eleven centuries later.

**An explanation for the counts.** Why does المؤتلف yield two meters and المشتبه nine,
when both are built the same way? Because a circle's yield is determined by its internal
symmetry: rotations that map the necklace onto itself produce no new reading. The
relation is exact —

> units = distinct readings × symmetries

— 10 = 5 × 2, 6 = 2 × 3, 9 = 3 × 3, 9 = 9 × 1, 8 = 2 × 4. Modern mathematics calls this
the orbit–stabilizer theorem. Al-Khalīl had no name for it, and obeyed it anyway,
because it is a property of the objects and not of the vocabulary used to describe them.

---

## The tally

```
2 letter states
    ↓  cluster
5 units          (three of them one family; two irregular)
    ↓  arrange
10 arrangements  → but only 8 distinct rhythms
    ↓  sequence
16 meters in use
    ↓  close the loop
5 circles        (21 readings possible)
```

Two symbols to sixteen meters, without a single uncounted step.

## Why this is the interesting way to read it

The top-down reading makes al-Khalīl a great cataloguer. The bottom-up reading shows
something harder to do: he did not collect the meters of Arabic poetry, he **built the
machine that produces them** — and then read off it verses nobody had written.

Three things in the climb are worth keeping:

**The abstraction is total and it is first.** Reducing verse to `1` and `0` throws away
everything a poem is about. Nothing in the system works without that act, and it is
performed on rung 1, before any of the interesting structure appears.

**The names already contain the mathematics.** *Majmūʿ* and *mafrūq* — joined and split
— describe `110` and `101` precisely. The terminology was built by people who were
looking at structure, not decorating it.

**The loss is located.** Ten arrangements collapse into eight sounds, and both collisions
are caused by the one irregular unit. The system's most famous difficulty — the six
meters of المشتبه that students perennially confuse — is not a flaw in that circle. It is
a consequence of a single bit pattern, visible three rungs earlier, and traceable all the
way down.

---

*Every number here is derived, not asserted. See `data/ladder.ts` and
`data/ladder.test.ts` in the companion repository, and the interactive «سُلَّم التجريد»
view at [arudi.midadalfikr.com](https://arudi.midadalfikr.com). Companion essays:
**The Turn That Changes Nothing** (group theory through the circles) and **The Compass
and the Ear** (the same mathematics in Islamic geometric ornament).*
