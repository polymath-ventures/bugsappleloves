# Plan: Increasing Veracity of Apple Joke Bugs

## Current State

The site has rough estimates for:
- Platform user counts (made up round numbers)
- Bug encounter rates (gut feelings)
- Time estimates (reasonable but uncited)
- Bug report dates (made up based on OS release dates)

## Three Areas to Improve

### 1. Platform User Counts — VERIFIABLE ✓

**Current values:**
- macOS: 100 million
- iOS: 1 billion
- iPadOS: 200 million
- visionOS: 500k

**What we can cite:**
| Platform | Citeable Figure | Source |
|----------|----------------|--------|
| All Apple devices | 2.35 billion | Tim Cook, Q1 FY2025 earnings call (Jan 2025) |
| Mac | 100 million | Tim Cook, Oct 2018 event (still the last official Mac-specific figure) |
| iPhone | ~1.5 billion | Third-party estimates (Backlinko, DemandSage) — not official |
| iPad | No official figure | Must estimate from total minus iPhone/Mac |

**Recommendation:**
- Add a "Sources" section to the page footer
- For each constant, add a `source` and `sourceUrl` field
- Show citation on hover or in a footnote
- Be honest: "Apple official" vs "Third-party estimate" vs "Our estimate"

**Changes to constants.json:**
```json
{
  "macOS": {
    "count": 100000000,
    "source": "Tim Cook, Apple October 2018 Event",
    "sourceUrl": "https://techcrunch.com/2018/10/30/there-are-now-100-million-macs-in-use/",
    "confidence": "official"
  }
}
```

---

### 2. Bug Report Dates — PARTIALLY VERIFIABLE

**Problem:** Our dates are made up based on when features launched, not when bugs were first reported.

**What we found:**

| Bug | Current Date | Earliest Verifiable Report | Source |
|-----|--------------|---------------------------|--------|
| Mail Search | 2012-09-19 | April 2018 (High Sierra) | Apple Community forums |
| Autocorrect | 2009-06-17 | iOS 10 (2016) | Apple Developer Forums |
| Apple Pay | 2018-09-17 | Need to research | — |
| Google Contacts | 2014-09-17 | Need to research | — |
| AirDrop | 2013-09-18 | ~2015 forum posts | Mac-Forums.com |
| iCloud Photos | 2015-09-16 | 2014-2015 beta | Apple Community |
| Spotlight | 2011-07-20 | 2017 reports found | Apple Community |
| Hotspot | 2017-09-19 | "For years" but no specific date | Various forums |

**Approach options:**

**Option A: Forum Archaeology (High effort, high reward)**
- Use Wayback Machine to find oldest Apple Discussions posts
- Search Reddit r/apple, r/mac for oldest threads
- Document the earliest post we can find with URL

**Option B: Version-Based Dates (Lower effort, defensible)**
- Change "reported date" to "feature introduced" date
- For Mail Search: "Apple Mail introduced search in Mac OS X Tiger (2005)"
- For AirDrop: "AirDrop introduced iOS 7 (September 2013)"
- Be honest: "Bug has existed since at least [version]"

**Option C: Crowdsourced Verification**
- Add a "Report Earlier Sighting" button
- Let users submit forum links to earlier reports
- Update dates when verified

**Recommendation:** Option B + C
- Change dates to "Since at least [year]" format
- Add disclaimer: "Dates reflect earliest verified report or feature introduction"
- Add GitHub issue template for date corrections

---

### 3. Formula Tweaks — REQUIRES CAREFUL THOUGHT

**Current formula components that are guesses:**

| Variable | Example Value | Could We Source It? |
|----------|---------------|---------------------|
| featureUsageRate | 35% use Apple Mail | Maybe — survey data exists for email client market share |
| bugEncounterRate | 60% experience search failures | Hard — no public data |
| frequencyPerDay | 2.3 searches/day | Maybe — UX research on email behavior |
| Time per step | 8 seconds to search | Hard — would need UX studies |
| Power user participation | 3% rebuild index | Hard — gut feeling |

**What IS citeable:**
- Email client market share (Litmus, etc.)
- Average emails received per day (Radicati Group)
- General smartphone usage statistics
- AirDrop/iCloud usage rates (harder to find)

**What's NOT citeable:**
- Bug encounter rates
- Time spent on specific actions
- Power user workaround participation

**Recommendation:**
1. For variables where data exists, add citations
2. For variables that are guesses, make it explicit:
   - Change label from "60% of Mail users experience search failures"
   - To "We estimate 60% of Mail users experience search failures"
3. Add an "Adjust our assumptions" section explaining methodology
4. The editability already lets users correct values they disagree with

---

## Implementation Plan

### Phase 1: Add Source Citations to Data
1. Add `source`, `sourceUrl`, `sourceDate`, `confidence` fields to constants.json
2. Update each platform count with best available source
3. Add "Sources" section to page footer

### Phase 2: Fix Bug Dates
1. Research earliest verifiable report for each bug (forum archaeology)
2. Change schema from `reportedDate` to `knownSince`
3. Add `dateConfidence` field: "verified" | "estimated" | "feature-launch"
4. Update bug cards to show "Known since at least 2015" instead of exact dates

### Phase 3: Improve Formula Transparency
1. Add methodology section explaining formula components
2. Distinguish between "cited" and "estimated" values in the UI
3. Add "We estimate" prefix to uncitable statistics
4. Consider adding a confidence indicator (🔗 for cited, 📊 for estimated)

### Phase 4: Crowdsource Corrections
1. Add link to GitHub issues for corrections
2. Create issue templates for: "Earlier bug report found" and "Better source for statistic"
3. Add "Suggest correction" links to editable values

---

## Specific Research Tasks

To complete Phase 2, we need to find earliest reports for:

1. **Mail Search** — Search Apple Discussions archive, filter by 2011-2013
2. **Autocorrect stubbornness** — iOS 3 (2009) era forums if they exist
3. **Apple Pay icon** — iOS 12 era (2018) Apple Pay forum posts
4. **Google Contacts** — Likely 2014 when CardDAV was the sync method
5. **AirDrop** — iOS 7 launch reviews and forum posts (Sept 2013)
6. **iCloud Photos** — iCloud Photo Library beta feedback (2014)
7. **Spotlight** — Mac OS X Tiger launch (2005) would be the earliest possible
8. **Hotspot** — iOS 7 Instant Hotspot feature (2013) or later complaints

---

## What This Doesn't Fix

Some things are inherently unverifiable:
- How frustrated people feel (pressureFactor)
- Exactly how long actions take
- What percentage of users try workarounds
- How many engineers Apple would need

**That's okay.** The site is satirical. The goal is:
1. Be honest about what's cited vs estimated
2. Let users adjust values they disagree with
3. Show our work / methodology
4. Be directionally correct even if not precise

---

## Open Questions for You

1. **How much effort for date verification?** Full forum archaeology or just use feature launch dates?
2. **UI for citations?** Footnotes? Hover tooltips? Separate sources page?
3. **Confidence indicators?** Show 🔗/📊 icons or keep it subtle?
4. **Crowdsourcing?** Add GitHub links or keep it read-only?
