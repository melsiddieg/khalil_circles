# Orbits and Losses
### Symmetry-aware methods for sequence analysis — a research plan

**Status:** draft v0.1 · **Origin:** spun out of the Interactive Arud Explorer (arudi.midadalfikr.com), where the group theory of al-Khalīl's prosodic circles was implemented and verified
**Suggested repo name:** `orbits-and-losses` or `canonical`

---

## 1. Thesis

Sequence analysis mixes two kinds of transformation that have different mathematical characters, and conflating them is a source of avoidable error:

| | **Group layer** | **Monoid layer** |
|---|---|---|
| operations | reverse-complement, rotation (circular replicons), shift | motif degeneracy, mutation, CpG→TpG deamination, codon degeneracy, sequencing error |
| algebra | invertible, exact | lossy, directional, non-invertible |
| consequence | never creates genuine ambiguity — only requires canonicalization | the sole source of genuine ambiguity |
| correct response | compute the orbit representative once, up front | model the loss explicitly and adjudicate with a prior |

The claim to test: **treating these two layers separately — canonicalizing under the group before reasoning about the loss — improves accuracy, interpretability and search efficiency in motif discovery, TF site assignment, and circular genome analysis.**

The framing comes from an unusual source. Al-Khalīl ibn Aḥmad's 8th-century classification of Arabic poetic metres is a complete group-theoretic classification of necklaces under cyclic rotation, and the classical *ziḥāf* system that sits on top of it is a monoid of licensed lossy rewrites. The tradition kept the two strictly separate and had a named adjudication rule for the ambiguous case (يُحمل المشترك على الأصل — "assign the shared form to the meter where it is original, not derived": a prior). That separation, not any biological content, is what transfers.

---

## 2. Prior-art audit (Phase 0 — do this first)

**This plan is only worth executing if this section survives contact with the literature.** Much of the correspondence is already standard practice. Honest triage:

### Tier 1 — established, used daily. Foundation, not contribution.
- Canonical k-mers (`min(s, revcomp(s))`) are orbit representatives under C₂. Every k-mer counter implements this.
- Burnside's lemma gives the count: (4ᵏ + fixed)/2, with fixed = 4^(k/2) for even k and **0 for odd k** (no base is its own complement). Verified in Appendix A.
- Period-3 autocorrelation is the primary coding-region signal in prokaryotic gene finders.
- GC-skew sign flip locates *ori*/*ter*.
- Symmetric inversion bias about the ori–ter axis (Eisen et al. 2000, the "X" in bacterial dot plots).
- MEME's `-pal` flag already searches the palindromic stratum.
- The "futility theorem" for single TFBS predictions (Wasserman & Sandelin 2004).

### Tier 2 — known facts, but (I believe) not systematized in this frame. Candidate contributions.
- Motif similarity is measured **symmetrically** (TOMTOM's Pearson/Euclidean/Sandelin–Wasserman; RSAT matrix-clustering), but *confusability is asymmetric*: what matters is whether A's degenerate acceptance set **contains** B's consensus. Verify: has anyone published a directed motif-containment graph?
- Symmetry class as a *stratification of the search space* with its own multiple-testing structure, rather than a single optional flag.
- D_n (not C_n) as the correct equivalence group for circular replicons — check how many plasmid comparison tools canonicalize under rotation only.

### Tier 3 — I have not found this stated. Highest risk, highest value.
- **The vocabulary–symmetry trade-off as a quantitative constraint on TF family evolution** (Aim 3). The orbit–stabilizer theorem implies palindrome-binding TFs draw from a vocabulary smaller by orders of magnitude (256 vs 32,896 canonical 8-mers — Appendix A). Prediction: this shows up as measurable differences in motif-space occupancy between dimeric and monomeric TF structural families.

**Kill criterion for the whole project:** if Tier 2 turns out to be well covered and Tier 3 has been published, stop. Budget two weeks for this audit before any implementation.

---

## 3. Aims

### Aim 1 — The asymmetric motif confusability graph
**Question.** Which TF motifs can be mistaken for which, in which direction, and by what specific degeneracy?

**Method.** For motifs A, B with PWMs M_A, M_B, define the acceptance set S_A(θ) = {k-mers scoring ≥ θ under M_A} and the directed containment score C(A→B) = mass that M_B assigns to S_A (or the fraction of B's high-scoring k-mers accepted by A). Build a directed graph over JASPAR CORE / HOCOMOCO / CIS-BP. Label each edge with the **mechanism**: which position(s) and which ambiguity produce the containment. Identify sinks — motifs into which many others drain.

**Why it should work.** This is structurally identical to the confusion map already built for the prosodic system (`data/tadakhul.ts`, `components/TadakhulView.tsx`), where each edge is typed by the ziḥāf that causes it and الرجز is the graph's sink because *mustafʿilun* is the poorest foot in material. The prediction is that DNA has its own الرجز: low-information motifs that everything decays into.

**Predictions.**
1. Sink motifs are over-called in de novo ChIP-seq analyses relative to their expected frequency.
2. The directed graph predicts which TF pairs are systematically confused in the published literature (test against curated re-annotations).
3. Adding the adjudication prior — assign an ambiguous site to the TF for which it is the *ideal* rather than a degenerate variant — measurably improves assignment accuracy on held-out ChIP-seq.

**Data.** JASPAR CORE, HOCOMOCO v11+, CIS-BP; ENCODE/ReMap/GTRD for peaks.
**Deliverable.** A tool + a browsable graph (the existing TadakhulView is a working prototype of the UI).
**Kill criterion.** If containment turns out to be near-symmetric for >90% of edges, the asymmetry framing adds nothing — report and stop.

---

### Aim 2 — Symmetry-stratified motif discovery
**Question.** Does partitioning the motif search space by symmetry class improve power, and does a discovered motif's stabilizer predict the binding protein's oligomeric state?

**Method.** Decompose k-mer space into strata by stabilizer under the group generated by reverse-complement and shift:
- **trivial** — asymmetric (expect monomeric binding)
- **RC-palindromic / inverted repeat** (expect homodimer)
- **direct repeat with spacer s** (expect tandem or heterodimer; s is a *phase*, exactly the starting offset of a rotation — cf. the nuclear receptor DR1–DR5 rules)
- **everted repeat**

Search within strata with stratum-specific null models and multiple-testing correction. Then invert: for each known motif, compute its symmetry class and test against structural annotation (PDB, TF oligomeric state in CIS-BP/UniProt).

**Predictions.**
1. Stratified search has better power at fixed FDR for dimeric TFs (the palindromic stratum is ~128× smaller at k=8).
2. Symmetry class predicts oligomeric state at well above chance across the annotated TF universe.

**Deliverable.** A stratified motif finder, or a wrapper around MEME/STREME that formalizes what `-pal` does ad hoc.
**Kill criterion.** If symmetry class predicts oligomeric state at ≤60% accuracy, the reverse inference is not usable; keep only the search-space result.

---

### Aim 3 — The inverse law: does symmetry cost vocabulary in TF evolution? *(highest risk / highest value)*
**Question.** Al-Khalīl's system obeys an inverse law: the most symmetric circle yields the fewest metres, because |group| = |orbit| × |stabilizer|. Does the same constraint shape transcription factor families?

**Derivation.** A palindromic site of length 2k has 4^k realizations, not 4^2k. Dimeric TFs binding palindromes therefore draw from a drastically smaller recognition vocabulary than monomeric TFs of the same site length.

**Predictions.**
1. Structural families that bind palindromes (nuclear receptors, bZIP, bHLH) show **lower motif diversity per family member** than families that bind asymmetric sites.
2. Those families rely disproportionately on heterodimerization, spacer variation, or cofactors to recover specificity — heterodimerization *breaks the symmetry and restores the vocabulary*.
3. The largest TF families should be the symmetry-unconstrained ones. (C2H2 zinc fingers — monomeric, modular, and the largest family in vertebrates — is a striking prima facie confirmation. Test it properly.)

**Method.** For each structural family, compute effective vocabulary = number of distinct motifs above an information-content threshold, normalized by family size; compare against the theoretical bound implied by the family's symmetry class. Correlate with heterodimerization propensity.

**Deliverable.** A paper-shaped analysis: *symmetry as an evolutionary constraint on regulatory vocabulary*.
**Kill criterion.** If vocabulary size shows no relationship to symmetry class after controlling for family size and site length, abandon — this is a clean negative result and worth reporting as such.

---

### Aim 4 — Circular replicons: D_n, not C_n
**Question.** Are circular genome analyses systematically wrong about their own equivalence group, and how common are undetected multimers?

Four sub-aims, all cheap:

**4a. Canonicalization audit.** The correct equivalence for a circular double-stranded replicon is the dihedral group: **2n candidates** (n rotations × 2 strands), not n. Verified in Appendix B: two assemblies of one plasmid, differing by cut point and strand, are unequal under rotation alone and equal under D_n. Audit widely-used plasmid/organelle comparison tools for which group they actually implement.

**4b. Multimer QC.** A circular assembly whose rotational period p < n is a multimer or an assembly artifact. Random sequence never triggers this (verified to n = 100,000; the false-positive probability is ~4^(−n/2)), and it's computable in O(n) with a KMP failure function. **Empirical question:** what fraction of deposited circular plasmid assemblies (PLSDB, NCBI RefSeq plasmids) have nontrivial period? Nobody appears to have measured this.

**4c. Origin-spanning features.** Quantify how much annotation is lost by treating a circular replicon as a linear string. Standard fix is the doubled string s+s — which is the same trick the Arud Explorer uses to slide a window across the necklace's seam.

**4d. The ori–ter mirror.** Reverse-complement negates GC skew, so a bacterial chromosome is approximately *anti*-symmetric about its ori–ter axis: the two replichores are near mirror images. Quantify each chromosome's "achirality defect" (deviation from perfect D-symmetry about the best axis) and test whether it correlates with growth rate, replichore imbalance, or inversion history.

**Deliverable.** A small, well-tested library (`canonicalize`, `period`, `circular_search`) plus a survey paper on 4b/4d.
**Kill criterion.** 4a/4b are near-certain to produce *something*; if the multimer rate is <0.1% it's a footnote, not a paper.

---

### Aim 5 — General formalism *(optional, theory)*
Write up the group/monoid separation as a general design principle for sequence tools: canonicalize under the group, model the monoid explicitly, adjudicate with a prior. Applications beyond motifs: read mapping (mismatches are monoid ops), sketching, variant representation (the VCF left-alignment problem is a canonicalization problem under an indel-shift group).

**Risk.** This may amount to re-describing existing practice in new vocabulary. Only write it if Aims 1–4 produce concrete results that need a common frame.

---

## 4. Phasing

| Phase | Work | Duration |
|---|---|---|
| 0 | Prior-art audit (§2). Go/no-go on Tiers 2–3. | 2 weeks |
| 1 | Aim 4a–4c: library + plasmid multimer survey. Cheapest, most certain output. | 4–6 weeks |
| 2 | Aim 1: containment graph + sink identification. | 8–10 weeks |
| 3 | Aim 2: stratified search + oligomeric-state inference. | 8–10 weeks |
| 4 | Aim 3: the evolutionary analysis. Only after 1–3 confirm the frame is productive. | 12+ weeks |
| 5 | Aim 4d, Aim 5, write-up. | — |

Deliberately ordered by increasing risk. Phase 1 produces a usable artifact regardless of whether the bigger ideas survive.

---

## 5. Risks and honest failure modes

1. **The analogy is decorative.** The real risk. Mitigation: every aim has a falsifiable prediction and a kill criterion, and none of them requires the prosodic framing to be *true* — the framing only has to have *suggested* the hypothesis.
2. **Reinvention.** Much of Tier 1 is standard. Phase 0 exists to prevent embarrassment; be ruthless there.
3. **Biology has no closed catalogue.** Al-Khalīl could enumerate 21 rotations and stop. There is no finite orbit of "all promoters," so the *enumeration* move — the most impressive part of the source system — does not transfer. Do not build any aim that depends on it.
4. **Evolution is not a group.** It's a semigroup of substitutions and indels. It maps to the monoid layer, never the group layer. Any aim that treats evolutionary distance as a group action is wrong by construction.
5. **The muhmal trap.** Unattested-but-lawful metres were *declined by a tradition*; unattested k-mers were *selected against or never arose*. Same statistical shape (observed vs expected under a generative model), completely different causal story. Do not import the interpretation along with the statistics.

---

## Appendix A — verified: canonical k-mers and the parity law

```python
from itertools import product
comp = {'A':'T','T':'A','G':'C','C':'G'}
rc = lambda s: ''.join(comp[c] for c in reversed(s))
for k in range(1, 9):
    kmers = [''.join(p) for p in product('ACGT', repeat=k)]
    orbits = len({min(s, rc(s)) for s in kmers})
    fixed  = sum(1 for s in kmers if s == rc(s))
    assert orbits == (4**k + fixed)//2                 # Burnside
    assert fixed == (0 if k % 2 else 4**(k//2))        # parity law
```

| k | k-mers | orbits | RC-palindromes |
|---|---|---|---|
| 4 | 256 | 136 | 16 |
| 6 | 4,096 | 2,080 | 64 |
| 8 | 65,536 | 32,896 | **256** |

The 8-mer row is the quantitative basis of Aim 3: the palindromic stratum is 128× smaller than the full canonical space.
**Odd-length reverse-complement palindromes cannot exist** — no base is its own complement, so a palindrome has no legal centre. This is why restriction sites are overwhelmingly even-length, and it is a genuine Lagrange-style restriction: the medium legislates which symmetries may occur.

## Appendix B — verified: circular replicons

```python
def period(s):                       # smallest p with rotation by p fixing s
    n = len(s); d = s + s
    return next(p for p in range(1, n+1) if d[p:p+n] == s)

def canonical(s, strand=True):       # orbit representative under C_n, or D_n
    n = len(s); cands = [(s+s)[i:i+n] for i in range(n)]
    if strand:
        r = rc(s); cands += [(r+r)[i:i+n] for i in range(n)]
    return min(cands)
```

Results (seed 7):
- Random sequences at n = 100 … 100,000: **period = n in every case** (stabilizer C₁). The multimer test has effectively zero false positives.
- Plasmid dimer (2 × 500 bp): period 500, stabilizer **C₂**. Trimer: stabilizer **C₃**.
- Two assemblies of one 500 bp plasmid differing by cut point (137) and strand: unequal as strings, **unequal under C_n**, **equal under D_n**.
- A 24 bp feature spanning the cut point: absent from the linearized sequence, present in `s + s`.

Biological note for 4b: plasmid multimers arise by homologous recombination and destabilize inheritance (the "dimer catastrophe"); bacteria run dedicated resolution systems (Xer/*cer*, Cre/*lox*) that convert multimers back to monomers. Xer is, structurally, a stabilizer-reduction machine — it detects a nontrivial rotational symmetry and returns the replicon to its orbit representative.

## Appendix C — the source system

Implemented and verified in the Arud Explorer repo; useful as working reference code and as a UI prototype:

- `data/rotations.ts` — `sequencePeriod`, `canonicalOffset`, `stabilizerOrder` (the naive O(n²) cousins of KMP-period and Booth's algorithm)
- `components/explore/geometry.ts` — `uniqueChords`, `rotationMatches`
- `data/tadakhul.ts` + `components/TadakhulView.tsx` — **the confusion map**: a directed, mechanism-typed graph of lossy transformations with an identified sink, plus a per-edge anatomy panel. This is the direct prototype for Aim 1.
- `docs/the-turn-that-changes-nothing.pdf` — group theory via the circles (orbit–stabilizer, Lagrange, the inverse law)
- `docs/the-compass-and-the-ear.pdf` — the spatial/temporal symmetry comparison; §4 and §6 are the direct sources for Aims 2–4

## References to check in Phase 0

- Wasserman & Sandelin (2004), *Nat Rev Genet* — the futility theorem
- Gupta et al. (2007) — TOMTOM motif comparison (confirm symmetry of the measures used)
- Castro-Mondragon et al. — RSAT matrix-clustering
- Eisen et al. (2000), *Genome Biol* — symmetric inversions about the origin
- Grigoriev (1998) — GC skew and origin prediction
- Lobry (1996) — strand asymmetry in bacterial genomes
- Rocha et al. — restriction site avoidance / palindrome under-representation
- Karlin & Burge — dinucleotide bias, ρ statistics
- Booth (1980) — least circular rotation, O(n)
- Nuclear receptor DR/IR/ER spacing literature — the phase/spacer taxonomy
- Any existing work on **directed/asymmetric** motif containment — this is the decisive search
