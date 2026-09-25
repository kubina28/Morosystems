# BUG-001: Kariéra – filters react about 1 s late on the first interaction

|                     |                                                                                 |
| ------------------- | ------------------------------------------------------------------------------- |
| **Page**            | https://www.morosystems.cz/kariera/ – section _Koho hledáme_                    |
| **Component**       | city select box (_Všechna města_), checkbox _Pozice vhodná pro absolventy_      |
| **Severity**        | Low – the filters work, but do not respond to the first interaction immediately |
| **Reproducibility** | 8 of 8 attempts                                                                 |
| **Environment**     | production, Chromium 153 (Playwright 1.63), Windows 10                          |
| **Found**           | 2026-09-25                                                                      |

## Steps to reproduce

1. Open https://www.morosystems.cz/kariera/ in a new browser session and wait until the page is loaded.
2. Click the city select box _Všechna města_ once (or the checkbox _Pozice vhodná pro absolventy_).
3. Observe the page without clicking again.

## Expected result

The list of cities opens (the positions are filtered) immediately after the click.

## Actual result

- Nothing happens for about **0.8–1.4 s**, then the click takes effect.
  Measured single click → effect: city select 824, 974, 938, 1100 ms; checkbox 1337, 977, 893, 1374 ms.
- Only the **first** interaction after the page load is affected – every following interaction responds in
  30–75 ms.
- A user who clicks again during that time toggles the control back – the select opens and closes, the checkbox
  is checked and unchecked. In a scripted run clicking every 0.5 s, the checkbox filter was applied only after
  the **3rd click** (6 of 6 runs).

## Evidence

- Before the first user interaction the page loads only **2** scripts; the first click triggers loading of another
  **~25** scripts, including the one handling the filters (`app.js`, `.js-filter__link` click handler).
- The page HTML contains `rocketlazyloadscript` markers – WP Rocket _Delay JavaScript execution_ is enabled.

## Probable cause

WP Rocket delays execution of the site scripts until the first user interaction and replays the captured click
once the scripts are loaded, which causes the delay.

## Suggested fix

Exclude the script handling the positions filters (`app.js` / `.js-filter`) from WP Rocket
_Delay JavaScript execution_, so the filters respond to the first interaction immediately.

## Notes

- The automated tests do not fail on the delay itself – assertions wait up to 10 s.
- With 4 or more browsers running in parallel on one machine, the click on the city select was occasionally lost
  completely (the select did not open within 10 s). This was **not reproduced** with 1–2 browsers (35 of 35 and
  36 of 36 runs passed), so it is most likely caused by CPU load on the test machine rather than by the website.
  The test suite therefore runs with 2 workers.
