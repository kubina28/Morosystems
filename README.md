# MoroSystems – Test Automation Assignment

Automated tests for the MoroSystems _Automation Tester_ test case, written in **TypeScript** with **Playwright Test**
and structured using the **Page Object Model**.

| Part | Scope                                                              | Status  |
| ---- | ------------------------------------------------------------------ | ------- |
| GUI  | Google search → MoroSystems website → _Kariéra_ page → city filter | ✅ done |
| API  | `morosystems/todo-be` – get, create, update and delete tasks       | ✅ done |

## Prerequisites

- Node.js 22.6 or newer (required by the `todo-be` backend)
- Git (the backend is cloned from GitHub)
- Internet access (GUI tests run against live websites)

## Getting started

```bash
npm ci
npx playwright install chromium
npm run api:setup     # clones morosystems/todo-be into .todo-be/ and installs it
npm run api:start     # starts the backend on http://localhost:8080 – keep it running in a separate terminal
npm test
```

After a run, open the HTML report:

```bash
npm run report
```

## Running tests

| Command                              | What it runs                                              |
| ------------------------------------ | --------------------------------------------------------- |
| `npm test`                           | whole suite                                               |
| `npm run test:smoke`                 | `@smoke` tests – the complete assignment flow (steps 1–7) |
| `npm run test:regression`            | `@regression` tests                                       |
| `npx playwright test --grep @career` | _Kariéra_ page tests only (no Google dependency)          |
| `npm run test:api`                   | API tests only (the backend must be running)              |
| `npm run test:debug`                 | Playwright inspector                                      |

Configuration is read from `setup/environments/<TEST_ENV>.env` (default `prod`). Every value can be overridden
by an environment variable:

| Variable                             | Default         | Description                                                                               |
| ------------------------------------ | --------------- | ----------------------------------------------------------------------------------------- |
| `TEST_ENV`                           | `prod`          | environment file to load                                                                  |
| `HEADLESS`                           | `false`         | run browsers headless (see _Google and bot detection_)                                    |
| `BROWSERS`                           | `chromium`      | comma separated browsers: `chromium`, `firefox`, `webkit`, `msedge` (see _Cross-browser_) |
| `WORKERS`                            | `2`             | number of parallel workers                                                                |
| `VIEWPORT_WIDTH` / `VIEWPORT_HEIGHT` | `1920` / `1080` | browser viewport applied to every test                                                    |
| `DEVICE`                             | –               | Playwright device preset (viewport, touch, user agent), replaces the viewport             |

The viewport also switches the website layout: below ~1920 px the _Kariéra_ menu item is collapsed into the
_O nás_ submenu. Run e.g. `VIEWPORT_WIDTH=1280 VIEWPORT_HEIGHT=720 npm test` to cover the collapsed menu.

### Cross-browser

Presets for Firefox, WebKit (Safari engine) and Microsoft Edge are prepared in `PlaywrightFactory`, the default run
uses Chromium only. Install the browsers once and select them with `BROWSERS`:

```bash
npx playwright install firefox webkit msedge
BROWSERS=chromium,firefox,webkit,msedge npm test
```

Each browser gets its own website and Google project. The automation flag that lowers the chance of a Google
CAPTCHA can be hidden only in Chromium-based browsers (Chrome, Edge), so Google tests may be skipped more often in
Firefox and WebKit.

### Mobile

`setup/environments/prod-mobile.env` runs the MoroSystems website tests on a mobile device (`DEVICE=Pixel 7`,
where the main menu is behind the burger button). Google tests are not part of the mobile run – the assignment asks
for a responsive check of the MoroSystems website.

```bash
TEST_ENV=prod-mobile npm test
```

## Test coverage

Test files are organised by website and feature (`tests/ui/<website>/<feature>/<Name>Tests.spec.ts`) and test
names follow the `Feature_Scenario_ExpectedResult` convention.

### E2E test vs. isolated tests

The E2E test `UserJourneyTests` is a direct implementation of the assignment test case – steps 1–7 chained in one
test. It is kept as a smoke test proving the whole user journey works, but it is **not the recommended way to
cover the functionality**:

- **Chained dependencies** – each step depends on the previous one. A failure on Google (CAPTCHA, a changed
  results page) stops the test before the MoroSystems website is checked at all, so its defects stay hidden.
- **More than one behaviour per test** – search, navigation and filtering are verified together, so a failure
  does not tell which behaviour is broken without opening the report.
- **Not reusable across configurations** – the journey depends on Google and therefore does not run on mobile.

The same functionality is therefore also covered by isolated tests, **one behaviour per test**, each starting
directly on the page it tests: `SearchTests` (Google search), `MainMenuTests` (navigation), `CareerFilterTests` (the
positions filter) and `LanguageVersionTests`. They run independently of each other and of Google (except
`SearchTests`), and on mobile as well.

**`tests/ui/e2e/UserJourneyTests.spec.ts`** – `@smoke @e2e @google`

- `UserJourney_FindMoroSystemsOnGoogleAndFilterByBrno_ShowsOnlyPositionsInBrno` – the assignment GUI test case
  as one user journey (steps 1–7), including the validation of the search results content (the MoroSystems result
  with the `morosystems.cz` domain)

**`tests/ui/google/search/SearchTests.spec.ts`** – `@regression @google`

- `GoogleSearch_SearchMoroSystems_ShowsResultsPage` – URL, title, search box value, results
- `GoogleSearch_SearchMoroSystems_ListsMoroSystemsWebsite` – result title and domain
- `GoogleSearch_OpenMoroSystemsResult_OpensMoroSystemsWebsite`

**`tests/ui/morosystems/career/CareerFilterTests.spec.ts`** – `@regression @career`

Exhaustive testing of all filter combinations is not possible, so cities are chosen by equivalence partitioning –
one representative per class of filter behaviour.

- `CareerFilter_OpenCitySelect_OffersAllCitiesWithAllCitiesSelected`
- `CareerFilter_SelectBrno_ShowsExactlyPositionsInBrno` – city with positions: at least one position, exactly those
  located in Brno
- `CareerFilter_SelectHradecKralove_ShowsExactlyPositionsInHradecKralove` – city listed as one of several locations
  of a position
- `CareerFilter_SelectPrague_ShowsExactlyPositionsInPrague` – city without positions (on production)
- `CareerFilter_SelectPragueAfterBrno_OnlyPragueIsSelected` – only one city can be selected, a new selection replaces
  the previous one
- `CareerFilter_ResetToAllCities_ShowsAllPositions`
- `CareerFilter_CheckGraduates_ShowsOnlyGraduatePositions`
- `CareerFilter_UncheckGraduates_ShowsAllPositions`
- `CareerFilter_CheckGraduatesWithBrnoSelected_ShowsOnlyGraduatePositionsInBrno`

**`tests/ui/morosystems/navigation/MainMenuTests.spec.ts`** – `@regression @career`

- `MainMenu_ClickCareer_OpensCareerPage`

**`tests/ui/morosystems/language/LanguageVersionTests.spec.ts`** – `@regression @career`

The _Kariéra_ page exists only in the Czech version; the English (`morosystems.com`) and German (`morosystems.at`)
versions do not offer it. Data-driven for English and German:

- `LanguageVersion_Open<Language>Homepage_CareerLinkIsNotOffered` – page language and no career link on the page
- `LanguageVersion_SwitchTo<Language>OnCareerPage_Opens<Language>Homepage` – the language switcher on _Kariéra_
  leads to the homepage of the selected language version, which offers no career link

Open positions change over time, so filter results are validated against the positions rendered on the page rather
than against a hard-coded list.

### API

API tests run in a separate Playwright project `api` without a browser. Every test creates its own task and the
`TasksClient` deletes all tasks created by the test afterwards, so tests are independent of the backend data and of
each other.

Before writing the tests, the API documentation, the implementation and the assignment were compared (shift-left).
The findings are summarised in the [API specification review](docs/api-review.md); the tests treat the documentation
as the specification, so differences fail the tests and are reported as bugs.

**`tests/api/tasks/GetTasksTests.spec.ts`** – `@regression @api`

- `GetTasks_RequestAll_ReturnsOkWithTaskList` – 200, the list contains a newly created task, every task has an ID,
  status and creation date

**`tests/api/tasks/CreateTaskTests.spec.ts`** – `@regression @api`

- `CreateTask_ValidText_ReturnsOkWithCreatedTask` – 200, generated ID, the text, `completed: false`, creation date
- `CreateTask_ValidText_TaskIsListed`
- `CreateTask_MissingText_ReturnsUnprocessableEntity` – 422 with a validation message
- `CreateTask_NumericText_ReturnsUnprocessableEntity` – expects 422 as `text` is a string in the API
  documentation, fails (see BUG-003)

**`tests/api/tasks/UpdateTaskTests.spec.ts`** – `@regression @api`

The API has no `PUT` endpoint (see the [API specification review](docs/api-review.md)); the task text is updated by `POST /tasks/{id}`, as documented.

- `UpdateTask_ValidText_ReturnsOkWithUpdatedTask` – only the text changes
- `UpdateTask_ValidText_ChangeIsPersisted`
- `UpdateTask_UnknownId_ReturnsNotFound`

**`tests/api/tasks/DeleteTaskTests.spec.ts`** – `@regression @api`

- `DeleteTask_ExistingTask_ReturnsOk`
- `DeleteTask_ExistingTask_TaskIsNotListed`
- `DeleteTask_UnknownId_ReturnsBadRequest` – expects 400 as specified by the API documentation, fails
  (see BUG-002)

## Known issues

Tests interact with the website the way a user does – one click, no retries. Failures caused by defects of the
tested website are reported, not worked around in the tests.

| ID                                                                                                  | Summary                                                                   | Severity |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| [BUG-001](docs/bug-reports/BUG-001-career-filters-react-late-on-first-interaction.md)               | Kariéra – filters react about 1 s late on the first interaction           | Low      |
| [BUG-002](docs/bug-reports/BUG-002-todo-api-unknown-task-id-statuses-do-not-match-documentation.md) | Todo API – statuses for an unknown task ID do not match the documentation | Low      |
| [BUG-003](docs/bug-reports/BUG-003-todo-api-accepts-non-string-task-text.md)                        | Todo API – task text of a non-string type is accepted                     | Medium   |

## Observations

Findings outside the tested scenarios that are worth a look, but are not reported as product defects:

- **German version – language switcher label for screen readers is in Czech.** The visually hidden label of the
  language switcher on `morosystems.at` is _„Zobrazit více jazyků“_, so a screen reader announces the switcher in
  Czech. The English version is translated correctly (_„Show more languages“_). No visual impact.
- **English version – `/kariera/` redirects to a missing page.** `morosystems.com/kariera/` answers 301 to
  `morosystems.com/?page_id=804`, which returns 404 _„Page not found“_. The German version redirects the same path
  to the Czech career page. The page is not linked anywhere, so only manually typed or old links are affected.
- **Todo API** – the missing `PUT` endpoint, whitespace-only task text, unordered task list, non-standard success
  statuses and the slow `GET /tasks` are described in the [API specification review](docs/api-review.md).

## Project structure

```
├── package.json                  solution: npm workspaces (src/*, tests/*), shared tooling and scripts
├── tsconfig.base.json            TypeScript settings shared by all projects
├── playwright.config.ts          runner settings only (reporters, timeouts, projects from the factory)
├── setup/
│   └── environments/             prod.env (desktop), prod-mobile.env (Pixel 7) – URLs, locale, screen, workers
├── src/
│   ├── common/                   project @automation/common – shared by UI and API
│   │   ├── config/               typed access to environment variables
│   │   ├── constants/            timeouts
│   │   ├── enums/                browser names, test tags
│   │   ├── factories/            PlaywrightFactory – browser presets, context options, projects
│   │   └── utils/                @step decorator, enum and text helpers
│   ├── ui/                       project @automation/ui – GUI tests support
│   │   ├── constants/            MoroSystems routes and language URLs, Google test data
│   │   ├── enums/                cities, languages
│   │   ├── fixtures/             page objects declared per website, auto fixtures (setup, consent, console log)
│   │   ├── models/               Position
│   │   ├── pom/                  BasePage, components (header, city select, language switcher, cookie dialogs), pages
│   │   └── utils/                Google CAPTCHA guard
│   └── api/                      project @automation/api – API tests support
│       ├── clients/              TasksClient – the API counterpart of page objects
│       ├── constants/            Todo API routes and test data
│       ├── enums/                HTTP statuses
│       ├── fixtures/             API client and cleanup of created tasks
│       └── models/               Task
└── tests/
    ├── api/                      project @automation/api-tests – API spec files
    └── ui/                       project @automation/ui-tests – UI spec files, no setup code in any spec
```

Every project folder contains its own `package.json` (name, references) and `tsconfig.json`; library projects
expose their public API through `index.ts`.

Design principles:

- **Solution with projects.** The folders `src/common`, `src/ui`, `src/api`, `tests/ui` and `tests/api` are npm
  workspace projects – the counterpart of projects in a .NET solution. Each project lists the projects it references
  in its `package.json` and ESLint (`import-x/no-extraneous-dependencies`) rejects imports of unreferenced projects.
  Deep imports into another project are not allowed, only its public API.

  | Project                 | References      |
  | ----------------------- | --------------- |
  | `src/common` (common)   | –               |
  | `src/ui` (ui)           | `common`        |
  | `src/api` (api)         | `common`        |
  | `tests/ui` (ui-tests)   | `common`, `ui`  |
  | `tests/api` (api-tests) | `common`, `api` |

- **Tests contain no setup.** Page objects are declared once per website (`src/ui/fixtures/*.pages.ts`) and created
  before every test by an automatic fixture (`src/ui/fixtures/pages.fixture.ts`); tests only import them. Browser and
  context creation lives in `PlaywrightFactory`, environment values in `setup/environments`.
- **Page objects expose locators and business actions, tests own the assertions.** Actions with logic (responsive
  menu, custom city select, graduate checkbox) are wrapped by the `@step` decorator, so they appear as named steps
  in the report and trace.
- **Stable, user-facing locators** (`getByRole`, accessible names) wherever the markup allows it.
- **No hard waits.** Synchronisation relies on Playwright auto-waiting and web-first assertions.
- **Independent tests.** _Kariéra_ tests open the page directly, so a Google outage does not hide regressions of
  the MoroSystems website. The Google dependent journey is covered separately by the `@smoke` test.

## Reporting

Each run produces:

- **HTML report** – `reports/html` (`npm run report`), with pass/fail status, test steps, and for failed tests
  a screenshot, video, trace and the browser console log (errors and warnings)
- **JUnit XML** – `reports/junit/results.xml` for CI integration
- **Console output** – `list` reporter

## Google and bot detection

Google protects its search against automated traffic, which is the main source of instability in this assignment.
The suite handles it as follows:

- **Headed by default.** Google answers headless browsers with a CAPTCHA far more often, so `HEADLESS` defaults to
  `false`. The `navigator.webdriver` automation flag is disabled and the query is typed key by key.
- **CAPTCHA → skip, not fail.** If Google shows its _unusual traffic_ page, the test is skipped with a clear
  annotation in the report instead of failing on a misleading locator timeout.
- **Serial Google project.** Tests tagged `@google` run in a dedicated `chromium-google` project with one worker,
  because parallel searches from one IP degrade the results. All other tests run fully parallel.
- **One retry for Google tests.** Google occasionally returns a results page without the organic MoroSystems
  homepage result. A retried test is reported as _flaky_, so it stays visible.
- **Consent dialogs.** Google's consent dialog is accepted by a Playwright locator handler whenever it appears.
  The MoroSystems Cookie-Script dialog slides in several seconds after page load at an unpredictable moment,
  so the consent ("necessary cookies only") is stored as a cookie in advance and the dialog never interrupts a test.

## Code quality

```bash
npm run typecheck      # TypeScript, strict mode
npm run lint           # ESLint (typescript-eslint + eslint-plugin-playwright)
npm run format:check   # Prettier
```
