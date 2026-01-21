# Bugs Apple Loves

Why else would they keep them around for so long?

A satirical website documenting Apple software bugs that have remained unfixed for years. We did the math on how much time humanity has wasted.

**Live site:** [bugsappleloves.com](https://bugsappleloves.com/)

## What is this?

Every bug on this site includes:
- A description of the bug and affected platforms
- A mathematical formula calculating total time wasted by humanity
- Editable values so you can adjust the assumptions if you disagree
- A "shame multiplier" based on how long Apple has known about it
- An engineering estimate showing how quickly Apple could fix it

## Running locally

No build step required. Just open `index.html` in a browser, or serve it:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

Then visit `http://localhost:8000`

## Project structure

```
├── index.html          # Main page
├── app.js              # Formula engine and rendering
├── styles.css          # Inverted Apple-style design
├── data/
│   ├── bugs.json       # Bug definitions with formulas
│   └── constants.json  # Platform user counts, Apple facts
└── screenshots/        # Bug screenshots (add your own)
```

## Adding a bug

1. Add an entry to `data/bugs.json` following the existing schema
2. Include: title, description, platforms, scope, behavioral flow, power user tax, shame factors, and engineering estimate
3. Add a screenshot to `screenshots/`
4. Submit a PR

## The formula

Each bug's impact is calculated as:

```
Base Impact = Users Affected × Frequency × Time Per Incident
Power User Tax = Σ (Workaround Time × Participation Rate)
Shame Multiplier = Years Unfixed × Pressure Factor
```

The verdict shows how many hours humanity wastes every second, compared to the engineering hours Apple would need to fix it.

## Contributing

### Suggest a bug

Know an Apple bug that's been unfixed for years? [Open an issue](https://github.com/polymath-ventures/bugsappleloves/issues/new/choose) using the "Suggest an Apple Bug" template. The best suggestions:

- Have been unfixed for **2+ years**
- Affect a **significant number** of users
- Are **reproducible** and well-documented
- Include links to forum posts or articles as evidence

### Submit a bug directly (PR)

If you're comfortable with JSON, you can add a bug yourself:

1. Fork the repo
2. Add an entry to `data/bugs.json` following the existing schema
3. Include all required fields (see existing bugs for reference)
4. Add a screenshot to `screenshots/` (optional but nice)
5. Test locally by opening `index.html`
6. Submit a PR

## Disclaimer

This is a joke. Kind of. These bugs are real though. Not affiliated with Apple Inc. All estimates use public data and reasonable assumptions. Your actual frustration may vary.
