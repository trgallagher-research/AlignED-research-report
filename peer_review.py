"""
Peer Review Script for AlignED Research Report

Calls Gemini 3 Pro and GPT-4o to perform independent peer reviews
of the entire AlignED research report site, including reference
verification for hallucinations.
"""

import os
import json
from pathlib import Path
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load API keys from .env
load_dotenv()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Pages to review, in reading order
PAGES = [
    "index.html",
    "introduction.html",
    "methods.html",
    "results.html",
    "discussion.html",
    "appendices.html",
]

# Directory containing the HTML files
SITE_DIR = Path(__file__).parent


def extract_text_from_html(filepath):
    """
    Read an HTML file and extract clean text content.
    Strips all HTML tags, scripts, and styles.
    Returns a string with the page title and body text.
    """
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    # Remove script and style elements
    for tag in soup(["script", "style"]):
        tag.decompose()

    # Get page title
    title = soup.title.string if soup.title else filepath.name

    # Get text from main content area, or full body if no main
    main = soup.find("main") or soup.find("section", class_="content-section")
    if main:
        text = main.get_text(separator="\n", strip=True)
    else:
        body = soup.find("body")
        text = body.get_text(separator="\n", strip=True) if body else soup.get_text(separator="\n", strip=True)

    return f"=== {title} ===\n\n{text}"


def build_full_document():
    """
    Combine all pages into a single document for review.
    Returns the combined text.
    """
    sections = []
    for page in PAGES:
        filepath = SITE_DIR / page
        if filepath.exists():
            sections.append(extract_text_from_html(filepath))
        else:
            sections.append(f"=== {page} === [FILE NOT FOUND]")

    return "\n\n" + "=" * 60 + "\n\n".join(sections)


# The peer review prompt
REVIEW_PROMPT = """You are acting as an academic peer reviewer for a research report website called "AlignED: Benchmarking AI Models on Professional Teaching Tasks."

The full text of the site is provided below, structured as six pages (Abstract/Cover, Introduction, Methods, Results, Discussion, Appendices). This is a living academic paper that benchmarks AI model performance on professional teaching tasks.

Please provide a thorough peer review covering ALL of the following:

## 1. ACADEMIC RIGOUR AND CLAIMS
- Are claims appropriately scoped and supported by the data described?
- Are there any instances of overclaiming (saying models "understand" or "know" things rather than reporting scores)?
- Is the distinction between what was measured and what can be inferred clearly maintained?
- Are limitations honestly stated?

## 2. INTERNAL CONSISTENCY
- Do numbers, statistics, and claims match across pages? (e.g., if the Abstract says "32 models" does Methods say the same?)
- Are model names, provider counts, and benchmark descriptions consistent throughout?
- Do the Methods descriptions match what is reported in Results?

## 3. REFERENCE VERIFICATION (CRITICAL)
- List every academic reference cited in the document.
- For each reference, assess whether the citation details (authors, year, title, journal, volume, pages) appear plausible and internally consistent.
- Flag any references where: the author names seem unusual or potentially fabricated, the journal/venue does not seem to exist, the year does not match the described content, the title seems oddly specific or generic in a way that suggests hallucination.
- Note: you cannot verify references exist, but you CAN flag inconsistencies, anachronisms, or implausible details.

## 4. WRITING QUALITY
- Is the writing clear, direct, and appropriately academic?
- Are there any passages that read like AI-generated filler (vague, repetitive, or using buzzwords)?
- Is the tone consistent across pages?

## 5. METHODOLOGICAL CONCERNS
- Are the evaluation methods clearly described and appropriate?
- Are there obvious confounds or threats to validity not acknowledged?
- Is the scoring approach for each benchmark defensible?

## 6. STRUCTURAL AND LOGICAL FLOW
- Does the paper flow logically from Introduction through to Discussion?
- Are there gaps in the argument or missing connections?
- Is anything repeated unnecessarily across pages?

## 7. FACTUAL CLAIMS TO VERIFY
- Flag any specific factual claims (statistics, dates, findings attributed to other studies) that should be independently verified.
- Pay particular attention to claims about OECD TALIS data, Dekker et al. findings, and other cited studies.

Please structure your review with clear headings. Be specific — cite the exact text or page where issues appear. Be honest and direct about problems. The authors want genuine criticism, not praise.

---

FULL DOCUMENT TEXT:

"""


def review_with_gemini(document_text):
    """
    Send the document to Gemini 3 Pro for peer review.
    Returns the review text.
    """
    from google import genai

    print("Connecting to Gemini API...")
    client = genai.Client(api_key=GOOGLE_API_KEY)

    # First, check available pro models
    print("Checking available Gemini models...")
    pro_models = []
    for m in client.models.list():
        name = m.name.lower()
        if "pro" in name and ("gemini-3" in name or "gemini-2.5" in name):
            pro_models.append(m.name)

    print(f"Available Pro models: {pro_models}")

    # Choose the best available model (prefer Gemini 3 Pro)
    model_id = None
    for candidate in ["gemini-3-pro-preview", "gemini-3-pro", "gemini-2.5-pro-preview-05-06", "gemini-2.5-pro", "gemini-2.5-pro-preview"]:
        if any(candidate in m for m in pro_models):
            model_id = next(m for m in pro_models if candidate in m)
            break

    if not model_id:
        # Fall back to whatever pro model is available
        if pro_models:
            model_id = pro_models[0]
        else:
            print("ERROR: No Gemini Pro model found. Available models:")
            for m in client.models.list():
                print(f"  {m.name}")
            return "ERROR: No Gemini Pro model available"

    print(f"Using model: {model_id}")

    full_prompt = REVIEW_PROMPT + document_text

    print("Sending to Gemini for review (this may take a minute)...")
    response = client.models.generate_content(
        model=model_id,
        contents=full_prompt,
        config={
            "temperature": 0.3,
            "max_output_tokens": 8000,
        },
    )

    return response.text


def review_with_openai(document_text):
    """
    Send the document to GPT-4o for peer review.
    Returns the review text.
    """
    from openai import OpenAI

    print("Connecting to OpenAI API...")
    client = OpenAI(api_key=OPENAI_API_KEY)

    print("Sending to GPT-5.2 for review (this may take a minute)...")
    response = client.chat.completions.create(
        model="gpt-5.2",
        messages=[
            {
                "role": "system",
                "content": "You are an experienced academic peer reviewer specializing in educational technology and AI evaluation research. Provide thorough, honest, constructive feedback."
            },
            {
                "role": "user",
                "content": REVIEW_PROMPT + document_text,
            }
        ],
        temperature=0.3,
        max_completion_tokens=8000,
    )

    # Report token usage and estimated cost
    usage = response.usage
    if usage:
        input_cost = (usage.prompt_tokens / 1_000_000) * 5.00
        output_cost = (usage.completion_tokens / 1_000_000) * 15.00
        total_cost = input_cost + output_cost
        print(f"  Tokens used: {usage.prompt_tokens:,} input + {usage.completion_tokens:,} output")
        print(f"  Estimated cost: ${total_cost:.4f}")

    return response.choices[0].message.content


def main():
    """
    Run peer reviews with both Gemini 3 Pro and GPT-4o.
    Save results to files.
    """
    # Check API keys
    if not GOOGLE_API_KEY:
        print("ERROR: GOOGLE_API_KEY not found in .env")
        return
    if not OPENAI_API_KEY:
        print("ERROR: OPENAI_API_KEY not found in .env")
        return

    # Build the full document
    print("Extracting text from all 6 pages...")
    document_text = build_full_document()
    word_count = len(document_text.split())
    print(f"Total document: {word_count:,} words ({len(document_text):,} characters)")

    # Output directory
    output_dir = SITE_DIR / "peer_reviews"
    output_dir.mkdir(exist_ok=True)

    # Run OpenAI review (Gemini already done - skip)
    print("\n" + "=" * 60)
    print("GPT-5.2 PEER REVIEW")
    print("=" * 60)
    try:
        openai_review = review_with_openai(document_text)
        openai_output = output_dir / "gpt52_review.md"
        with open(openai_output, "w", encoding="utf-8") as f:
            f.write("# Peer Review: GPT-5.2\n\n")
            f.write(f"Date: February 2026\n")
            f.write(f"Document: AlignED Research Report (all 6 pages)\n\n")
            f.write("---\n\n")
            f.write(openai_review)
        print(f"\nGPT-4o review saved to: {openai_output}")
    except Exception as e:
        print(f"OpenAI review failed: {e}")
        openai_review = f"ERROR: {e}"

    print("\n" + "=" * 60)
    print("PEER REVIEW COMPLETE")
    print("=" * 60)
    print(f"\nReviews saved in: {output_dir}")


if __name__ == "__main__":
    main()
