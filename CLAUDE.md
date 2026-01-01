# CLAUDE.md

This file provides context for Claude Code when working on this project.

## Project overview

Apple Joke Bugs is a satirical static website that calculates how much time humanity has wasted due to long-standing Apple software bugs. It uses a formula-based approach with editable values so users can adjust assumptions.

## Tech stack

- Pure HTML/CSS/JavaScript (no build step, no frameworks)
- Static hosting on GitHub Pages
- JSON for data storage

## Key files

- `app.js` - Formula engine (`FormulaEngine` class), rendering, editable value handlers
- `styles.css` - Inverted Apple design (black bg, white text, SF Pro fonts)
- `data/bugs.json` - Bug definitions with full formula data
- `data/constants.json` - Platform user counts (macOS, iOS, iPadOS, visionOS), Apple facts

## Design system

Uses an inverted Apple aesthetic:
- `--bg-primary: #000000` (black background)
- `--text-primary: #f5f5f7` (white text)
- `--accent: #2997ff` (Apple blue)
- SF Pro Display / SF Pro Text fonts with system fallbacks

## Bug data schema

Each bug in `bugs.json` requires:
- `id`, `title`, `subtitle`, `description`
- `platforms` - array of affected platforms
- `scope` - featureUsageRate, bugEncounterRate, frequencyPerDay
- `behavioralFlow` - steps with seconds and retries
- `powerUserTax` - workaround sinks with participation rates
- `shameFactors` - pressureFactor (1.0-2.0)
- `engineeringEstimate` - hoursToFix, teamSize, sprints

## Editable values

Users can click any value to edit it. The system:
1. Replaces the span with an input (type="text" with inputMode="decimal" for Safari compatibility)
2. Uses `parentNode.replaceChild()` for Safari compatibility
3. Adds a slight delay before `focus()` for Safari
4. Stores data on the input element itself
5. Recalculates all impacts on blur

## Important notes

- Safari has quirks with input focus and DOM manipulation - see `handleEditableClick()` in app.js
- Verdict shows "X hours every second" not "every X seconds" to avoid displaying "0s"
- Time estimates should be human effort, not computer time (e.g., rebuilding mail index = 10 min human time, not 2 hours computer time)
- visionOS is included in constants for comedy (500k users)

## Testing

Open `index.html` in a browser. No build step required. Test in both Chrome and Safari since Safari has different DOM behavior.
