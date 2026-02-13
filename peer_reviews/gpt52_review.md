# Peer Review: GPT-5.2

Date: February 2026
Document: AlignED Research Report (all 6 pages)

---

# Peer review of “AlignED: Benchmarking AI Models on Professional Teaching Tasks” (living report website, Feb 2026)

## 1) Academic rigour and claims

### Claims generally well-scoped, with some overreach and a few unsupported “key findings”
**Appropriately scoped / supported**
- The site mostly reports *task scores* and draws cautious, task-level conclusions (e.g., Discussion “What we claim and what we do not”). This is good practice.
- The repeated emphasis that benchmarks do not measure “teaching well” is an important guardrail and is stated clearly in **Discussion → “What we claim and what we do not.”**

**Potential overclaiming / inference creep**
- **Methods → 2.5 Temperature robustness**: “*Educational knowledge, once learned, appears relatively stable.*”  
  This is a strong inference from a narrow operationalisation: stability of *binary classification accuracy on 32 neuromyth items* across temperatures. It does not justify a general claim about “educational knowledge” broadly, nor about “once learned” (which implies learning dynamics). Recommend rephrasing to something like: “On this neuromyth classification task, accuracy was relatively insensitive to temperature for most models.”
- **Abstract key finding**: “*assessment task type matters enormously, with models performing well on classification tasks but poorly on absolute grading*.”  
  This is directionally supported by your reported neuromyth/CDPK vs ACARA SG results, but “enormously” is rhetorical. Consider quantifying the contrast (e.g., typical ranges) or softening.
- **Abstract key finding**: “*performance on one benchmark does not predict performance on another*.”  
  You state this repeatedly (Abstract, Methods 2.6, Results “Cross-evaluation patterns”), but you do not report an actual analysis (e.g., rank correlation, Pearson/Spearman across overlapping model sets, with n and CI). As written, it reads like a conclusion without the supporting statistic. Either (a) add the correlation analysis, or (b) re-scope to “often does not” / “showed weak association in our current sample” and show the evidence.

**“Understanding/knowing” language**
- You mostly avoid anthropomorphic claims. Good.
- A few places imply mentalistic properties:
  - **Methods → 2.5** uses “knowledge stability” language; that’s okay if clearly defined as “answer stability under perturbation,” but currently it slides into broader epistemic claims.
  - **Results → 3.1**: “*well-informed ‘True’ response reasonably defensible*” is fine, but be careful not to imply models are “well-informed”; you can say “a ‘True’ label is defensible given ambiguity.”

### Limitations are present and fairly honest, but some major threats deserve more prominence
You list key limitations (contamination, LLM judge bias, cultural specificity, sample size differences, incomplete validation). That’s good. However, several high-impact validity threats are either missing or underdeveloped:

- **Construct validity for “diagnostic reasoning”**: Your scenarios are explicitly described in Appendix A as “teacher implementing an evidence-based strategy incorrectly” and include “Implementation Error” and “Key Mechanism.” This makes the task closer to “identify the intended flaw” than open-ended diagnosis in authentic settings. That’s not invalid, but it should be framed as *mechanism-identification in designed vignettes*, not necessarily real-world diagnostic reasoning.
- **Criterion validity for ACARA comparative judgement accuracy**: You treat “ACARA-assigned grade” as ground truth for pairwise “better demonstrates the standard.” But ACARA work samples are often exemplars at levels; the mapping from those exemplars to *pairwise superiority* may not be unique, and the “verified pairs” process is not described enough to justify a single correct answer.
- **Judge dependence**: Diagnostic scoring uses *Claude 4.5 Sonnet* as judge. You note bias risk, but you also report perfect scores for Claude 4.5 Sonnet as a *test-taker* (Results 3.2). This creates an appearance of conflict: the judge model family may advantage similar response styles. You should explicitly discuss the risk of “self-preference” and report whether the judge is the same exact model/version as one of the evaluated models.

---

## 2) Internal consistency (numbers, model counts, benchmark descriptions)

### Model counts and “up to 32” are mostly consistent, but there are several mismatches/ambiguities
- **Abstract/Cover**: “*Up to 32 models from five providers have been tested.*”  
  **Methods → Models evaluated**: “*32 models from five providers have been tested across one or more benchmarks.*” (consistent)
- **Methods → 2.1 Neuromyth Identification**: says “*up to 31*” models; **Results → 3.1** says “*31 models tested*” (consistent with each other).
- **Abstract key findings at a glance**: “32 Models tested” but neuromyths only 31; that’s fine if 32 is union across benchmarks.

### Item count inconsistency: neuromyths “32 items” vs “most models answered 28 of 32”
- **Results → 3.1**: “*Most models answered 28 of 32 items; five models were run on the full 32-item survey with the v2 corrected answer key.*”  
  This is a major comparability issue: scores across models are not on the same denominator if some models were scored on 28 items and others on 32 (unless you re-scored everyone on the same subset). The text implies different answer keys/versions (“v2 corrected answer key”) and different item sets. You need to state clearly:
  - Which 4 items were missing for “most models” and why.
  - Whether reported percentages are computed on 28 or 32 per model.
  - Whether rankings change when restricted to the common subset.
  - How “v2 corrected answer key” differs from Dekker et al. (2012) and why it is justified.

### “Five evaluations” vs “four methodological sections” is explained but still confusing
- **Methods → What AlignED evaluates**: five evaluations, but “organised into four methodological sections” because CDPK and SEND share approach. This is okay, but the navigation and headings still label 2.3 as one section. Consider explicitly numbering CDPK and SEND as 2.3a/2.3b or similar to reduce confusion.

### ACARA counts: “79 verified pairs” and “204 cases” need reconciliation
- **Methods → 2.4**: SG pilot run on 7 models; comparative judgement 79 pairs; 237 evaluations per model (79 pairs × 2 orientations × 3 trials = 474, not 237).  
  You state: “Each orientation is evaluated 3 times (trials), yielding 237 total evaluations per model.” But:
  - 79 pairs × 2 orientations = 158 orientations
  - 158 × 3 trials = **474** evaluations per model  
  So **237** is exactly half of what your described design implies. This is a clear internal inconsistency that must be fixed (either the design is different—e.g., only one orientation per pair per trial—or the arithmetic is wrong).
- **Results → 3.4**: SG pilot “*7 models tested on 204 cases*.”  
  Methods does not define what a “case” is for SG. If SG is “each work sample individually,” then cases might be number of samples. But 204 is not obviously derivable from 79 pairs (which would imply 158 samples if each pair contains two unique samples). You need to explain:
  - How many unique samples exist
  - Whether samples repeat across pairs
  - How 204 was constructed

### Excluded models list conflicts with “12 models evaluated”
- **Methods → 2.4**: “12 models evaluated” for comparative judgement, then “Excluded models: Four models were excluded… DeepSeek R1, Gemini 3 Pro, GPT-5.2, and GPT-5 Mini.”  
  If four were excluded, were they part of the 12 attempted, or excluded before counting? As written, it’s ambiguous whether “12 models evaluated” means “attempted” or “included in results.” Clarify the denominator for rankings/plots.

### Diagnostic reasoning: “accuracy” terminology is misleading
- **Results → 3.2**: “Diagnostic Reasoning Accuracy” but the metric is rubric score 0–36 judged by LLM. That’s not “accuracy” in the usual sense. Consider renaming to “score” or “rubric score (% of max).”

---

## 3) Reference verification (critical): list all cited academic references + plausibility flags

Below are **all references cited** in the document text you provided (including those cited in Methods/Results but not in the Introduction reference list).

### References listed in Introduction “References”
1. **AI-for-Education. (2025). *Pedagogy Benchmark.* https://github.com/AI-for-Education/pedagogy-benchmark**  
   - Plausibility: Reasonable as a project/dataset citation. Not a traditional academic reference; fine if treated as software/dataset.
   - Suggestion: Add version/tag/date accessed.

2. **MacKenzie, D. & Wajcman, J. (Eds.). (1999). *The Social Shaping of Technology* (2nd ed.). Open University Press.**  
   - Plausibility: Highly plausible classic STS volume.

3. **Macina, J., Daheim, N., Hakimi, I., Kapur, M., Gurevych, I., & Sachan, M. (2025). “MathTutorBench: A benchmark for measuring open-ended pedagogical capabilities of LLM tutors.” *Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing (EMNLP 2025)*, 204–221.**  
   - Plausibility: The author list includes well-known NLP/edu researchers (e.g., Gurevych, Kapur). Title/venue plausible. Page numbers plausible but cannot be verified here.
   - Minor flag: EMNLP proceedings page ranges depend on format; not inherently suspicious.

4. **OECD. (2025). *Results from TALIS 2024: The State of Teaching*. TALIS, OECD Publishing.**  
   - Plausibility: OECD TALIS reports are plausible, but the *exact title* “The State of Teaching” should be verified. OECD often uses “TALIS 2024 Results (Volume X): [subtitle]”. Flag for verification of exact bibliographic details.

5. **Lee, U., Lee, S., Choi, H., Lee, J., Park, H., Jeon, Y., Cho, S., Kang, M., Koh, J., Bae, J., Nam, M., Eun, J., Jung, Y., & Jeong, Y. (2026). “OpenLearnLM Benchmark: A unified framework for evaluating knowledge, skill, and attitude in educational large language models.” arXiv:2601.13882.**  
   - Plausibility: arXiv numbering “2601.xxxxx” matches Jan 2026. Large Korean author list plausible. Title plausible.
   - Flag: Needs verification that this arXiv ID corresponds to that title/authors.

6. **Selwyn, N. (2022). “The future of AI and education: Some cautionary notes.” *European Journal of Education*, 57(4), 620–631.**  
   - Plausibility: Very plausible; Selwyn publishes in this area.

7. **Richter, E., Spitzer, M. W. H., Morgan, A., Frede, L., Weidlich, J., & Moeller, K. (2025). “Large language models outperform humans in identifying neuromyths but show sycophantic behavior in applied contexts.” *Trends in Neuroscience and Education*, 39, 100255.**  
   - Plausibility: Journal exists; article numbering like 100255 is plausible for Elsevier-style journals.
   - Flag: The claim later says “Where Spitzer et al. tested…” but the cited paper is Richter et al. with Spitzer as coauthor. Ensure consistent attribution (see below).

8. **Sriprakash, A., Williamson, B., Facer, K., Pykett, J., & Valladares Celis, C. (2024). “Sociodigital futures of education: Reparations, sovereignty, care, and democratisation.” *Oxford Review of Education*, 51(4), 561–578.**  
   - Plausibility: Title is plausible for ORE; author set plausible.
   - **Internal inconsistency flag**: Volume **51** in year **2024** may be plausible but should be checked; ORE volume numbering may not align. This is not a definitive error, but it’s a “verify” item.

### Additional references cited elsewhere (not in the Introduction list)
9. **Dekker, S., Lee, N. C., Howard-Jones, P., & Jolles, J. (2012). “Neuromyths in education: Prevalence and predictors of misconceptions among teachers.” *Frontiers in Psychology*, 3, 429.**  
   - Plausibility: Highly plausible and well-known.

10. **OECD (2002)** cited in **Results → 3.1 Q21 contested item**: “original enrichment findings came from rats…”  
   - **Major issue**: This reference is cited in-text but **not** included in the reference list anywhere. Add full bibliographic details.
   - Plausibility: OECD 2002 publication about brain/learning is plausible (OECD published “Understanding the Brain” around early 2000s), but you must specify which report.

### Citation attribution inconsistency
- **Introduction → related work**: “Where Spitzer et al. tested a small number of models…” but the cited study is **Richter et al. (2025)**. Spitzer is a coauthor, but “Spitzer et al.” is inconsistent with the reference list and earlier “Richter et al.” usage. Fix to one consistent citation key.

---

## 4) Writing quality

### Strengths
- Generally clear, readable, and appropriately academic for a web-based living report.
- Good use of concrete examples (e.g., retrieval practice scenario; Q15 vs Q27).

### Passages that read like AI-generated filler / rhetorical inflation
- **Introduction** has several paragraphs that are high-level and somewhat repetitive (“opportunity and uncertainty,” “speed of adoption unprecedented,” “this is a call for evidence”). This is not wrong, but it could be tightened substantially.
- Phrases like “*This is not a call for caution over action. It is a call for evidence alongside action.*” are rhetorically effective but feel more like policy writing than research reporting. Consider reducing slogan-like constructions.

### Tone consistency
- Mostly consistent. The Discussion is appropriately cautious.
- Some sections oscillate between research tone and advocacy (“The field needs fifty.”). That’s fine for a living benchmark project, but if you want “academic paper” framing, consider moderating the advocacy voice or clearly labeling it as “implications/opinion.”

---

## 5) Methodological concerns (major)

### (A) Comparability and versioning problems (neuromyths)
- The neuromyth benchmark is described as fixed 32 items with a validated key, but Results indicate:
  - many models answered only 28 items
  - “v2 corrected answer key” used for five models  
This undermines fairness and comparability. You need a clear versioning protocol:
1) define benchmark version (items + key)  
2) ensure all models are scored on the same version for leaderboard comparisons  
3) if not possible, report separate leaderboards by version or restrict to common subset.

### (B) LLM-as-judge validity and leakage risks (diagnostic reasoning)
- Using Claude 4.5 Sonnet as judge is acceptable as an engineering choice, but academically you need stronger validation:
  - inter-rater reliability with at least 2–3 human expert raters on a stratified sample
  - judge-model sensitivity analysis (e.g., re-score with a different judge model and report rank stability)
- Potential leakage: if scenarios or “key mechanisms” resemble common “learning science” blog content, models may pattern-match. That’s not disqualifying, but you should acknowledge that this benchmark may measure familiarity with popular cognitive science narratives.

### (C) Construct validity of “teacher certification knowledge”
- You treat CDPK/SEND as “foundational teaching knowledge.” That’s reasonable, but you also imply “translated and validated for cross-cultural applicability” (**Methods → 2.3**). That is a strong claim that requires citation and description of the validation process (who translated, what procedure, what evidence of validity). As written, it is unsupported.

### (D) ACARA benchmark: ground truth and scoring defensibility
- Comparative judgement:
  - You assume a single correct answer per pair. How were “verified pairs” verified? By whom? What agreement? Were ties allowed?
  - Reliability metric is “same answer regardless of order.” That measures *position invariance*, not test-retest reliability in the psychometric sense. Consider renaming to “order invariance” or “position-swap consistency.”
- Standards-based grading:
  - You attribute low performance partly to underspecified standards. That’s plausible, but you should also consider whether the *prompt* and *label definitions* create class imbalance and ambiguity. You report strong central tendency bias; you should report the true distribution of labels in the dataset to contextualize this.

### (E) Statistical reporting is thin
- You mention “confidence intervals where appropriate” (Discussion limitations) but none are shown in the provided text. If charts include them, fine; if not, add:
  - binomial CIs for neuromyths (n=32) and ACARA SG (n=204 cases)
  - standard errors across the 5 iterations at T=0 (neuromyths)
  - uncertainty for comparative judgement accuracy given repeated trials and dependence structure

---

## 6) Structural and logical flow

### Overall flow works, but there are repeated claims and some missing connective tissue
- The “paper-like” structure is coherent.
- Repetition: “performance on one benchmark does not predict another” appears in Abstract, Methods, Results, Discussion. Repetition is fine, but it becomes a refrain without the promised analysis. Either add the analysis or reduce repetition.
- Missing connection: You introduce “pedagogical alignment” conceptually in Introduction, but Results mostly report performance without mapping back to “alignment” as a measurable construct. Consider adding a short section in Discussion clarifying how each benchmark operationalises aspects of pedagogical alignment (and what it does not cover).

---

## 7) Specific factual claims that should be independently verified

### OECD TALIS claims (high priority to verify precisely)
- **Abstract**: “OECD TALIS 2024 data shows 41%…”  
- **Introduction → How teachers are already using AI**: “survey conducted in 2024 and published in 2025… 41%… 68% summarise… 64% lesson plans… 26% assessment…”  
These are precise percentages and publication timing claims. They should be verified against the actual TALIS 2024 report tables and wording (and whether “across participating countries” vs “across OECD countries” is accurate). Also clarify whether 41% is weighted, which countries, and whether it refers to “ever used” vs “used in last X months.”

### Dekker et al. (2012) neuromyth prevalence numbers
- **Methods → 2.1**: “49% of neuromyths were endorsed… learning styles 93%… 10% brain 48%… enriched environments 95%.”  
- **Appendix A** lists belief-rate ranges for some items.  
These should be checked against the original paper’s exact item wording and reported percentages (and whether those percentages are UK vs NL vs combined). Also, “enriched environments improve brain function” being 95% seems very high; it may depend on item wording and sample.

### Richter et al. (2025) / “Spitzer et al.” claims
- **Introduction**: “roughly 80% accuracy in isolation but sycophantic behaviour in applied contexts.”  
Verify that the cited paper actually reports those conditions and that “sycophantic” is their framing (or yours). Also fix the inconsistent attribution (“Richter et al.” vs “Spitzer et al.”).

### OECD (2002) rat enrichment claim
- **Results → 3.1 Q21** cites OECD (2002) as the basis for the “rats in deprived conditions” explanation. This needs a full reference and should be checked for accuracy; the classic enrichment literature is not uniquely “OECD 2002.”

### Release dates and model naming
- **Results → 3.5**: “Claude 4.5 Opus (November 2025)” etc.  
These dates and model names (e.g., “Claude 4.5 Opus (Thinking)”, “Claude 4.5 Sonnet”, “Gemini 3 Flash”, “Gemini 3 Pro”, “GPT-5.2”, “GPT-5 Mini”) should be verified and pinned to exact API model IDs. If these are internal labels, say so. If public, cite provider release notes.

---

# Summary of highest-priority fixes (actionable)

1. **Fix ACARA arithmetic inconsistency**: 79 pairs × 2 orientations × 3 trials ≠ 237. This is a critical internal consistency error (Methods 2.4).
2. **Resolve neuromyth versioning**: explain 28 vs 32 items, “v2 corrected answer key,” and ensure fair comparability (Results 3.1; Methods 2.1).
3. **Add correlation evidence** for “performance does not predict performance” (Abstract/Methods/Results). Even a simple Spearman rank correlation matrix across overlapping model sets would substantiate the claim.
4. **Strengthen judge validation** for diagnostic reasoning and explicitly address judge/test-taker overlap and potential self-preference (Methods 2.2; Results 3.2).
5. **Complete missing reference**: OECD (2002) is cited but not listed; verify OECD TALIS bibliographic details and percentages.
6. **Clarify ACARA ground truth**: how “verified pairs” were verified; define “cases” for SG; report label distribution and human agreement.

If you want, I can also propose a compact “reporting checklist” section (what to include per benchmark: dataset version, n, scoring, uncertainty, judge validation, contamination risk) tailored to living benchmark websites.