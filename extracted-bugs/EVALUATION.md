# Bug Evaluation: What Actually Rises to the Occasion?

After reviewing all 39 extracted bugs against the existing site content and applying critical analysis, here's my assessment.

---

## ALREADY IN THE SITE (Skip These)

These bugs are already covered or substantially overlap with existing entries:

| # | Extracted Bug | Existing Entry | Notes |
|---|---------------|----------------|-------|
| 1 | iOS Text Selection (10+) | `ios-text-selection` | **Already there, well covered** |
| 2 | Autocorrect (8+) | `autocorrect-insistence` | **Already there** |
| 3 | Mail Search (8+) | `mail-search` | **Already there** |
| 4 | AirDrop Unreliable (6+) | `airdrop-looking` | **Already there** |
| 5 | Hotspot Failures (5+) | `hotspot-auto-connect` | **Already there** |
| 7 | Apple Pay Card Icon (4) | `apple-pay-card-icon` | **Already there** |
| 9 | Spotlight Index (3+) | `spotlight-indexing` | **Already there** |
| 11 | Finder View Settings (2) | `finder-window-amnesia` | Similar - window/view state issues |

**Count: 8 bugs already covered**

---

## REAL BUGS TO ADD (Strong Candidates)

These are genuine bugs with multiple reports, clear reproduction, and significant time waste:

### Tier 1: Definitely Add

| # | Bug | Mentions | Why It Qualifies |
|---|-----|----------|------------------|
| 6 | **Alarm Power Button Snoozes** | 4 | UX inconsistency that causes real-world consequences (oversleeping). Power button stops calls/timers but snoozes alarms - inconsistent behavior. |
| 8 | **Safari URL/Search Confusion** | 3+ | 13+ years old, typing "something.something" goes to URL instead of search. Clear bug, massive time waste. |
| 10 | **Login Screen User Selection Lag** | 3 | 5-10 second lag on high-end hardware. Clear performance bug, affects daily use. |
| 12 | **Emoji Picker Malfunction** | 2 | Cmd+Ctrl+Space stops working randomly. Search stops working. Clear bug. |
| 18 | **Screen Time Bypass** | 2 | Parental controls don't work - 5+ years broken. Real-world impact on families. |

### Tier 2: Good Candidates

| # | Bug | Mentions | Assessment |
|---|-----|----------|------------|
| 15 | **iOS Keyboard Wrong Characters** | 2 | Documented on YouTube, real insertion errors |
| 16 | **Apple Music Skip on Disconnect** | 2 | 10+ year bug, music skips repeatedly when network drops |
| 19 | **Music Artwork Randomizes** | 2 | Album art gets scrambled on sync - annoying but real |
| 25 | **Notes Sync Failures** | 1 | iCloud Notes losing data is serious |
| 26 | **Audio Balance Randomly Shifts** | 1 | 6+ years documented, audio suddenly off-center |
| 27 | **Safari Tabs Randomly Disappear** | 1 | Data loss - tabs and tab groups vanish |

---

## GRIPES / DESIGN CHOICES (Not Bugs)

These are complaints about intentional Apple design decisions, not bugs:

| # | "Bug" | Why It's a Gripe |
|---|-------|------------------|
| 23 | Password Field No Reveal | **Security design choice** - Apple intentionally hides passwords. Other platforms do this too. Not a bug. |
| 22 | Window Resize Edge Detection | **Already in site** as `window-resize-tahoe`. Also partly just macOS design. |
| 37 | Calendar ESC Deletes Entry | **Debatable** - ESC cancels = discards unsaved. Annoying but arguably correct behavior. |
| 33 | Save Dialog Wrong Directory | **Too vague** - likely app-specific, not a system bug |
| 34 | Widget Notification Activation | **Too vague** - unclear what "smart widget interactions" means |

---

## EDGE CASES (Too Rare/Specific)

These affect narrow use cases or require specific configurations:

| # | Bug | Why It's an Edge Case |
|---|-----|-----------------------|
| 13 | Contacts Birthday O365 Shift | **Specific to Office 365 sync** - only affects Exchange users |
| 14 | eSIM After Restore | **Specific scenario** - only during restore from dual-SIM backup |
| 20 | Bluetooth Fullscreen Audio Stutter | **Specific trigger** - only during fullscreen transitions |
| 21 | Apple Watch Mac Unlock Fails | **Specific feature** - affects Watch unlock feature users only |
| 28 | Finder All Desktops Overlay | **Specific setup** - multiple desktops + "All Desktops" setting |
| 29 | Contacts Daemon Disk Reads | **Rare** - single report, may be corruption issue |
| 30 | Preview Opens Behind Windows | **Inconsistent** - may be Focus mode or app-specific |
| 31 | Cannot Forget Hotspot | **Niche** - affects specific network management scenario |
| 32 | Photos Cannot Delete | **Likely user error** - probably iCloud sync state confusion |
| 35 | Color Picker Slow | **Rare** - single report, may be system-specific |
| 36 | Podcasts Downloads Missing | **Rare** - single report, specific app issue |
| 38 | Messages Wrong Number | **User error territory** - contact data management issue |
| 39 | Multi-User Graphics Corruption | **Specific hardware** - M3 Max + multi-user switching |

---

## TOO VAGUE / ANECDOTAL

| # | Bug | Problem |
|---|-----|---------|
| 17 | Maps Unlock Slowness | **Vague** - "sluggish" is subjective, could be many causes |
| 24 | Finder Search Unrelated Results | **Duplicate** of Spotlight issues already covered |

---

## SUMMARY RECOMMENDATION

### Add These (6 bugs):

1. **Alarm Power Button Snoozes** - High impact, clear inconsistency, 4 mentions
2. **Safari URL/Search Confusion** - 13 years old, 3+ mentions, universal Safari users
3. **Login Screen Lag** - Performance bug on premium hardware, 3 mentions
4. **Emoji Picker Malfunction** - Clear reproducible bug, 2 mentions
5. **Screen Time Bypass** - 5+ years broken, real family impact, 2 mentions
6. **Safari Tabs Disappear** - Data loss is always serious, even with 1 mention

### Consider Adding (3 bugs):

7. **Apple Music Skip on Network Drop** - 10+ years old, music lovers affected
8. **Audio Balance Randomly Shifts** - 6+ years documented, affects accessibility
9. **Notes Sync Failures** - Data loss potential

### Skip (30 bugs):

- 8 already in site
- 5 are gripes/design choices
- 13 are edge cases
- 4 are too vague

---

## REPEAT COUNT ANALYSIS

The HN thread confirms the site's existing bugs are the big ones:

| Bug | HN Mentions | Already in Site? |
|-----|-------------|------------------|
| Text Selection | 10+ | Yes |
| Autocorrect | 8+ | Yes |
| Mail Search | 8+ | Yes |
| AirDrop | 6+ | Yes |
| Hotspot | 5+ | Yes |
| Apple Pay Icon | 4 | Yes |
| Spotlight | 3+ | Yes |

**The existing site has already captured the top 7 most-mentioned bugs!**

The new additions would fill in gaps for:
- Safari search/URL confusion (browser users)
- Alarm UX (everyone who uses alarms)
- Screen Time (parents)
- Emoji picker (chat users)
- Login screen lag (multi-user Macs)
