# AlignED Paper Site Guidelines

## Project Overview

AlignED is an independent benchmarking project that evaluates AI model performance on tasks related to professional teaching knowledge. This is a static HTML/CSS/JS site hosted on GitHub Pages. No build tools, no templating. Text is written directly in each page's HTML file.

The site is structured as a living academic paper with six pages following a standard research paper arc.

## File Structure

- Abstract/Cover: `index.html` (no charts, no inline styles)
- Introduction: `introduction.html`
- Methods: `methods.html` (includes Mermaid.js for validation diagram)
- Results: `results.html` (all charts rendered here via `js/charts.js`)
- Discussion: `discussion.html`
- Appendices: `appendices.html` (full item tables, data access, citation, contact)
- Shared styles: `css/style.css` (unified stylesheet, no inline styles on any page)
- Charts: `js/charts.js` (uses `document.body.dataset.page` for page detection)
- Navigation: `js/main.js` (mobile toggle, active link)
- Data: `data/neuromyths_scores.json`, `data/scenarios_scores.json`, `data/pedagogy_scores.json`, `data/acara_scores.json`, `data/acara_standards_grading_scores.json`, `data/model_metadata.json`
- Legacy: `data/composite_scores.json` (no longer referenced; retained for historical reference)

## Navigation Structure

```
AlignED | Abstract | 1. Introduction | 2. Methods | 3. Results | 4. Discussion | Appendices
```

Numbered links reinforce the paper structure. Every page has the same header and footer.

## Page Detection

Charts only render on the Results page. Detection uses `document.body.dataset.page`:
- `data-page="abstract"` — index.html
- `data-page="introduction"` — introduction.html
- `data-page="methods"` — methods.html
- `data-page="results"` — results.html (charts render here)
- `data-page="discussion"` — discussion.html
- `data-page="appendices"` — appendices.html

## Writing Rules (MUST follow for all copy changes)

### Epistemic Precision (most important rule)

AlignED exists because overclaiming is common in EdTech. The website must not do the same.

What AlignED does: benchmarks how models respond to specific tasks related to professional teaching knowledge. What it does NOT do (never claim or imply): determine whether a model "understands" education, certify safety or suitability, prove a model "can teach" or "knows how learning works", or replace professional judgement.

General principle: Report what was measured. Let the reader draw the inference.

| Never write | Write instead |
|-------------|---------------|
| "Model X understands pedagogy" | "Model X scored 34/36 on diagnostic scenarios" |
| "Tests whether AI knows how learning works" | "Tests how models handle tasks related to professional teaching knowledge" |
| "Ensures educational safety" | "Provides benchmark data to inform decisions" |

### The Evaluation Gap (critical framing)

AlignED focuses on tasks teachers do, not tasks students do. Do not claim that most other benchmarks test only student knowledge. The correct framing is:

> "There is a shortage of evaluations that test models on the educational tasks they are currently being used for: identifying misconceptions about learning, diagnosing why teaching strategies fail in practice, answering the kinds of questions that appear on teacher certification exams, and comparing student work against curriculum standards."

### Tone

- Short, confident sentences. Vary sentence length.
- Active voice. Be direct about limitations.
- Trust the reader's intelligence.
- Lead with findings, not methodology on results pages.
- Use British/Australian spelling (prioritise, recognise, organisation, behaviour).

### AI Slop Blacklist

DO NOT USE any of the following:

Punctuation: Em dashes as all-purpose connectors (max one per page, zero is fine). Excessive colons. Semicolons as sentence glue.

Phrasing: "It's not X, it's Y" / "Not just X, but Y". "In today's rapidly evolving...". "It's worth noting that...". "This is particularly important because...". "Whether you're a teacher, a policymaker, or a developer...". "The short answer is...". "Here's the thing:". "Let's dive in" / "Let's explore" / "Let's unpack". "At the end of the day". "Importantly," / "Crucially," / "Notably,".

Words: Groundbreaking, Revolutionary, Ensure, Empower, Leverage, Harness, Holistic, Cutting-edge, State-of-the-art, Stakeholders, Ecosystem, Deep dive, Robust (as general praise; fine when referring to temperature robustness as a measured property), Genuine/Genuinely.

Structural: Don't use rhetorical questions for every section header. Mix with declarative headers. Don't repeat "complementary" when describing ACARA. Say it once.

### Footer Tagline (all pages)

Use: "Benchmarking AI performance on professional teaching tasks."
Do NOT use: "Evaluating AI alignment with educational research evidence."

## Visual Design

Warm parchment palette inspired by claude.ai and Financial Times:
- Background: `#F4F1EB` (warm parchment)
- Surface: `#FEFDFB` (off-white for cards)
- Text: `#2D3748`
- Primary: `#3B6B9A` (academic blue)
- Accent: `#B67D5C` (terracotta)

Typography: Inter (headings/UI) + Georgia (body text) + Consolas (code/prompts).
Prose max-width: 960px. Charts can go wider (1100px via `.container-wide`).

## CSS Rules

All styles live in `css/style.css`. No inline styles on any page. The old dual-stylesheet problem (index.html and results.html had their own inline styles) has been resolved.
