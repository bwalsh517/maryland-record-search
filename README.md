# maryland-record-search

[![Tests](https://github.com/bwalsh517/maryland-record-search/actions/workflows/test.yml/badge.svg)](https://github.com/bwalsh517/maryland-record-search/actions/workflows/test.yml)
[![Lint](https://github.com/bwalsh517/maryland-record-search/actions/workflows/lint.yml/badge.svg)](https://github.com/bwalsh517/maryland-record-search/actions/workflows/lint.yml)
[![Coverage](https://github.com/bwalsh517/maryland-record-search/actions/workflows/coverage.yml/badge.svg)](https://github.com/bwalsh517/maryland-record-search/actions/workflows/coverage.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A genealogy research tool: a lookup engine for locating Maryland vital
record certificate scans - birth and death - hosted on archive.org
(via the Reclaim The Records project) or the Maryland State Archives
guide.

Given a county + month/year, a known series/file ID, or (for several
series) a raw certificate number, it returns the URL for the
specific scanned file that record would be in. It has no UI of its
own - `examples/basic-form/` ([live demo](https://bwalsh517.github.io/maryland-record-search/examples/basic-form/)) is a reference implementation showing how
to wire it into a search form, but the library is designed to be
called from your own site's search results (e.g. "user searched our
death index, got a hit for Anne Arundel County, May 1910 - call
`lookup()` to find and link the matching archive.org file").

> **On accuracy:** the goal is best-effort correct, not guaranteed
> correct. This project's record mappings were built from Maryland
> State Archives finding aids and cross-checked against real
> archive.org URLs wherever possible, but it's community-assembled
> data, not an official index - treat results as a strong starting
> point for locating a scan, not a guaranteed-correct citation, and
> verify anything research-critical against the MSA guide directly.
>
> Location/date search and a wrong result there (the wrong county,
> month, or series linked) is a bug - please
> [report it](https://github.com/bwalsh517/maryland-record-search/issues/new?template=data-correction.md).
> Certificate-number search is inherently more fragile: it depends on
> exact per-record certificate boundaries, and the source material
> itself sometimes has real holes - missing records, certificates
> scanned out of numerical order, ranges that don't quite add up.
> SE46 alone turned up a genuine "unassigned" series number, a
> certificate range given backwards in the source, and a record whose
> certificates are scanned in the wrong order, among others (see
> `src/series/se46-data.js`'s header comment) - there's no guarantee
> every such anomaly across every series has been found or accounted
> for. See "Known limitations" below for what's currently flagged
> rather than guessed at silently.

## Data sources

The scans and indices this project links to aren't hosted or produced
by this project - all credit for the underlying records goes to:

- **[Maryland State Archives](https://msa.maryland.gov/)** ([guide.msa.maryland.gov](https://guide.msa.maryland.gov/))
  is the government archive that holds and describes these records.
  Its finding aids are the primary source for the series/date/county
  breakdowns this library encodes.
- **[Reclaim The Records](https://www.reclaimtherecords.org/)**, a
  nonprofit that obtained and digitized these records through Maryland
  Public Information Act requests and put them online for free on
  archive.org, without paywalls or usage restrictions. Most of the
  archive.org URLs this project builds point to their uploads.

If you find a wrong or broken link, it's very likely a gap in this
project's mapping data, not the underlying archive - see "Known
limitations" below, and please open an issue (there's a template for
data corrections specifically).

## Install

No published package yet - clone the repo and either:

- **Node / bundler:** `require("./src/index.js")` (or `import` if your
  bundler handles CJS interop).
- **Browser, no build step:** include the files under `src/core` and
  `src/series` via `<script>` tags, in the order shown in
  `examples/basic-form/index.html`. Everything attaches to a single
  `window.MDRecordSearch` global - no bundler required.

## API

### `lookup(options)`

The main entry point. Call it one of three ways, depending on what
you already know:

| Parameter | Type | Description |
|---|---|---|
| `location` | string | County name, or `"Baltimore City"`. Accepts loose forms too - unambiguous prefixes ("Wor" -> "Worcester"), a small alias table ("pg" -> "Prince George's"), and numeric county codes. |
| `month` | number | 1-12. Omit to search the whole year (calls `lookupYear` internally). |
| `year` | number | |
| `series` | string | A known series/file ID, e.g. `"SE45-1037"`. Use this on its own instead of location/month/year. |
| `certificateNumber` | string | A raw certificate number, e.g. `"1909-A50000"`. Use this on its own instead of location/month/year. |
| `recordType` | string | `"death"` or `"birth"`. Optional - only needed when a query could plausibly match more than one record type. |

**Returns:** an array of result objects (see [Result shape](#result-shape) below). Empty if nothing matches. Never throws.

```js
lookup({ location: "Anne Arundel", month: 5, year: 1910, recordType: "death" });
lookup({ series: "SE45-1037" });
lookup({ certificateNumber: "1909-A50000", recordType: "birth" });
```

### `lookupYear(options)`

Every file covering one county across a whole year, for when you
don't know the month or want to browse a year at once.

| Parameter | Type | Description |
|---|---|---|
| `location` | string | County name, or `"Baltimore City"`. |
| `year` | number | |
| `recordType` | string | `"death"` or `"birth"`. Optional. |

**Returns:** an array of result objects, one per month a file covers
(a file that covers the whole year, or several months at once, is
only listed once - not duplicated per month). Never throws.

```js
lookupYear({ location: "Anne Arundel", year: 1969, recordType: "death" });
```

`lookup({ location, year, recordType })` with `month` omitted calls
this automatically.

### `lookupSeries(seriesId)`

Direct lookup of a known series/file, e.g. from a citation you
already have.

| Parameter | Type | Description |
|---|---|---|
| `seriesId` | string | Full series/file ID, e.g. `"SE45-1037"`. |

**Returns:** an array with one result if the ID resolves, otherwise
empty. Equivalent to `lookup({ series: seriesId })`.

```js
lookupSeries("SE45-1037");
```

### `lookupCertificate(certificateNumber, options)`

Direct lookup by a raw certificate number, for the series numbered in
a running sequence rather than per-county/per-date (currently CM1132,
CM1135, SE46, and CE502).

| Parameter | Type | Description |
|---|---|---|
| `certificateNumber` | string | E.g. `"B100000"` or `"1995-1234"`. |
| `options.recordType` | string | `"death"` or `"birth"`. Optional. |

**Returns:** an array of result objects, empty if nothing matches.
Equivalent to `lookup({ certificateNumber, recordType })`. Check
`listSeries()`'s `supportsCertificateNumberSearch` field to see which
series support this before relying on it.

```js
lookupCertificate("B100000", { recordType: "death" });
```

### `listSeries()`

Introspection helper - what series are registered, and what each one
supports, without doing a lookup.

**Returns:** an array with one entry per series:

| Field | Type | Description |
|---|---|---|
| `name` | string | Series name, e.g. `"SE43"`. |
| `recordType` | string | `"death"` or `"birth"`. |
| `seriesHome` | string | URL of the series' MSA guide page. |
| `dateRange` | object or null | `{ startYear, startMonth, endYear, endMonth }`. |
| `seriesIdRange` | object or null | `{ start, end }`, the series' own numbering bounds. |
| `supportsLocationSearch` | boolean | |
| `supportsCertificateNumberSearch` | boolean | |
| `certificateSearchRange` | object or null | Defaults to `dateRange` when certificate search is supported; narrower for a couple of series (see the generated docs). |

```js
listSeries();
// -> [{ name: "SE43", recordType: "death", dateRange: {...},
//       supportsLocationSearch: true, ... }, ...]
```

Use this to find out which series support location/date search vs.
series-ID-only lookup before building UI around it (see Known
limitations below).

### Result shape

Every `lookup`/`lookupYear`/`lookupSeries`/`lookupCertificate` call
returns an array of objects shaped like this:

| Field | Type | Description |
|---|---|---|
| `series` | string | Series name, e.g. `"SE43"`. |
| `seriesType` | string | `"death"` or `"birth"`. |
| `seriesHome` | string | URL of the series' MSA guide page. |
| `location` | string or null | Normalized county name. |
| `year` | number or null | |
| `month` | number or null | 1-12, or null if the file covers the whole year. |
| `number` | number or null | File number within the series. |
| `label` | string | Extra detail, e.g. a surname range, if the file was split. Empty string otherwise. |
| `url` | string or null | A scan or MSA guide URL. |
| `msaGuideUrl` | string or null | MSA's own page for this number, independent of `url`. |
| `part` | number or null | Distinguishes a multipart record's spans from each other. Almost always null. |
| `sortWeight` | number | 0 for an ordinary result; higher sorts after ordinary results. |
| `certificateNumber` | string or null | Set only when the result came from a certificate-number lookup. |
| `approximatePageUrl` | string or null | An approximate deep link into the scan, set only where computed. |

### `VERSION`, `REPOSITORY_URL`, `ISSUES_URL`

Library-level constants. `VERSION` matches `package.json` (the
browser build can't read `package.json` directly). `ISSUES_URL` links
to the data-correction issue template - see "On accuracy" above.

### Detailed validation errors

`lookup()` swallows errors so it's safe to call with untrusted input.
To validate a location string yourself and see *why* it failed, call
`counties.normalizeCounty()` directly - it throws a
`CountyNotFoundError` with the offending value attached:

```js
const { counties } = require("maryland-record-search");

try {
  counties.normalizeCounty(userInput);
} catch (err) {
  if (err instanceof counties.CountyNotFoundError) {
    // err.value is the original input
  }
}
```

### Full reference

The tables above cover what most integrations need. For every field's
exact type and every edge case documented in code, see the generated
reference at
[bwalsh517.github.io/maryland-record-search/docs/](https://bwalsh517.github.io/maryland-record-search/docs/),
rebuilt on every deploy.

## Project structure

```
src/
  core/
    namespace.js        - sets up window.MDRecordSearch / globalThis.MDRecordSearch
    counties.js          - county name normalization + aliases
    base-series.js        - abstract class every series extends
    series-registry.js   - the list of registered series instances
    lookup.js             - lookup() / lookupSeries() / listSeries()
  series/
    se42.js, se43.js, ...  - one file per archive.org series
  index.js                - Node/bundler entry point
examples/
  basic-form/             - reference implementation (not part of the library)
test/
  core/, series/          - node:test files, run with `npm test`
```

## Adding a new series (including birth certificates)

1. Copy an existing series file in `src/series/` as a starting point -
   `s1988.js` is the simplest (location/date + series-ID search, no
   certificate-number search), `se43.js` is the most complete simple
   case (also does surname-range file splits), and `cm1135.js` is
   worth a look if your series needs certificate-number search too,
   though it's a more involved example (see "Known limitations" below
   for why).
2. Extend `BaseSeries`, call `super(name, recordType)` - use `"birth"`
   for a birth certificate series.
3. Set `this.dateRange = { startYear, startMonth, endYear, endMonth }`
   and `this.seriesIdRange = { start, end }` in the constructor, and
   have `canHandle(location, month, year)` call
   `this.inDateRange(month, year)` (plus whatever location check the
   series needs) rather than comparing inline literals - this is what
   `listSeries()` reports as the timeline, so it needs to be the same
   data actually driving search, not a separate copy. Use `0` for
   `startMonth`/`endMonth` if the MSA guide only gives a bare year for
   that boundary rather than a specific month. `seriesIdRange` is what
   keeps a series-ID or certificate-number lookup for a number that
   was never actually generated (`0`, negative, or past the series'
   real end) from returning a plausible-looking but wrong URL - see
   `test/core/series-id-range.test.js`.
4. `ARCHIVE_RANGES` is optional, not mandatory - a series with nothing
   better than the MSA guide to link to needs neither `ARCHIVE_RANGES`
   nor an `archiveUrl()` override at all; `BaseSeries.archiveUrl()`
   already falls back to the MSA guide page using `seriesIdRange`
   alone. Provide `ARCHIVE_RANGES` (table-based lookup) or override
   `archiveUrl()` directly only if real archive.org scans exist to
   link to. Add `buildIndex()` + `lookupLocationMonthYear()` if the
   series should support location/date search, not just direct
   series-ID lookup.
5. Register the instance in `src/core/series-registry.js`.
6. Add a test file under `test/series/`.

The exception-split tables (`YEAR_EXCEPTION_SPLITS`,
`MONTH_EXCEPTION_SPLITS`) that some series use encode archival research
about counties whose certificates were filed in multiple
surname-range volumes for a given month/year - they're intentionally
just data, not something to try to generalize into a formula.

## Known limitations (not yet implemented)

- **CM1132** (death, Baltimore City, 1874-1950): fully implemented
  location/date, series-ID, and certificate-number search. Its records
  span multiple months (unlike the county grids' per-month/per-year
  files), so each result's `label` leads with the record's actual date
  span (e.g. `"01/1914-04/1914 Nos. C71526-C74735"`), not just the
  certificate range - a single hit already tells you the full window
  it covers. `lookupYear()` correctly shows each physical file once
  even though it's queried once per month, rather than once per month
  it happens to cover. A date search on a month shared between two
  consecutive records' overlapping ranges (they deliberately overlap
  by one month) returns both, not a guess at which one is right; and
  `approximatePageUrl` from certificate lookup is a rough estimate (~1
  certificate per scanned page, confirmed against one anchor point),
  not a precise page number. One confirmed unused record (CM1132-244,
  "previously a duplicate entry") returns an informative result with a
  null `url` rather than a broken or misleading link. Certificate
  lookup also accepts an optional `"YYYY-"` prefix (see
  `lookupCertificate()` above) - not needed to identify a record here
  since no letter block is ever reused, but validated against the
  record's actual date if given, for a consistent search format with
  CM1135 below.

- **CM1135** (birth, 1875-1972, Baltimore City only): fully implemented
  location/date, series-ID, and certificate-number search - CM1135-1
  through CM1135-322 (through 12/1947) are transcribed as an explicit
  per-record table (`src/series/cm1135-data.js`); the series switches
  to a `"YYYY-NNNNN"` certificate format after that and isn't
  transcribed yet, so `certificateSearchRange` is narrower than the
  series' full `dateRange` (see `listSeries()` above). Its `dateRange`
  uses `startMonth: 0` and `endMonth: 0` since only years were given
  for the untranscribed tail, not specific months.

  Unlike CM1132, this series' letter blocks are **not** one continuous
  sequence - `A` and `B` each cycle through the full `1`-`100000` range
  twice before `C`-`G` (so far), so a bare letter+number like
  `"A50000"` is genuinely ambiguous between two real certificates.
  `lookupCertificate()` returns every matching record in that case; the
  optional `"YYYY-"` prefix (see `lookupCertificate()` above) narrows
  to just the one covering that year. A trailing suffix letter on a
  few certificate numbers (e.g. `"G33501D"`) works the same way CE502's
  confirmed duplicate suffix does - matches with or without it, narrows
  to just that boundary with it.

  CM1135-113 covers two disjoint date spans on one physical record
  (kept as a single record with a list of date parts rather than two
  separate entries, so it can't get split apart later) - a month search
  only ever returns one hit for it, a year search correctly returns
  both.

  CM1135-25 through 29 are five multi-year batches of certificates
  filed out of chronological order under their own `"L"` prefix instead
  of a normal date-based slot (their year spans also overlap each other
  and the main sequence). A location/date search always returns these
  after every main-sequence match, sorted narrowest year-span first,
  rather than mixed in with more specific hits.

  A few source oddities are carried through as transcribed, not
  corrected: three certificate boundaries (including the `"D"` suffix
  example above) have an unexplained trailing letter, CM1135-302's date
  looks like a one-year typo against its neighbors, CM1135-113's date
  overlaps CM1135-112's more than the usual single-month boundary, and
  CM1135-241 is past the 100-year public-access restriction so its
  certificate range is set to the numeric gap between the surrounding
  records and labeled an estimate in its result rather than confirmed
  data.

- **S1963** (birth, Aug 1898 - Apr 1910): fully implemented location/date
  and series-ID search, including 11 known "no file" records (they
  consume a series number but have no scan - "No cards are extant for
  this month and county" per the finding aid) which correctly return an
  informative result with a null `url` rather than either a broken link
  or silent absence. One record (S1963-2001) has a confirmed archive.org
  collection-slug anomaly (its collection is `...s-1963-2346`, not
  `...s-1963-2001` like the formula would produce) - handled via an
  explicit override in `COLLECTION_OVERRIDES`; more can be added the
  same way if others turn up.

- **CE502** (death, Baltimore City, 1950-1972): fully implemented
  location/date, series-ID, and certificate-number search. All 600
  records (CE502-1 through CE502-600) are transcribed from the MSA
  finding aid as an explicit per-record table (`DATE_CERT_RECORDS` in
  `src/series/ce502-data.js`), each with a date span and a certificate
  range whose numbering resets every January 1st - so certificate
  search takes the same `"YYYY-NNNNN"` form as SE46's 1988-2014 era
  (e.g. `"1952-3000"`), not a bare number. Fixed-size (~500 cert)
  blocks mean records rarely land on calendar month boundaries, so a
  date search often returns more than one overlapping record for a
  single month - by design, not a data error (same principle as
  CM1132's overlapping-month behavior above). `approximatePageUrl`
  assumes 2 scanned pages per certificate with the first certificate
  in a record's range at page 0 (backs were scanned, same convention
  as SE46's pre-2002 era). Five transcription typos in the source
  finding aid (each a certificate range starting one number too low)
  and one confirmed pair of duplicate-numbered certificates in 1952
  (both labeled "3000" in the source, one marked "A" to tell them
  apart) were corrected after visual confirmation against the
  original MSA index - see `ce502-data.js`'s header comment for the
  full list. A certificate search for the duplicate (`"1952-3000"`)
  correctly returns both records rather than requiring the caller to
  know about the "A" suffix.
- **SE46** (death, 1973-2014): location/date search covers the
  complete 1973-1987 grid with real county granularity, and falls back
  to every record for the year, statewide, for 1988-2014 - the source
  data has no location or month dimension at all for this era, so
  rather than return nothing for a given county (which would look
  identical to there being no records at all), every result for that
  year comes back with `location: null` and `month: null`, signaling
  the county searched for is in there somewhere but not narrowed down
  further. Series-ID covers the whole series, and certificate-number
  search covers 1988-2014 (SE46's numbering has no location dimension
  at all after 1987) - takes the form `"YYYY-NNNNN"` (e.g.
  `"1995-1234"`) rather than a bare number, since SE46's certificate
  numbers reset every year. For 2013-2014
  (SE46-7032 to SE46-7215), certificate search still resolves the
  exact record - useful even without a working link, e.g. checking
  from an MSA library in person - but the result's `url` points to the
  MSA guide entry rather than a scanned page, and there's no
  `approximatePageUrl`, since there's no scan on archive.org to
  page-jump into. Pre-1988 certificate lookup isn't
  implemented yet - see `TODO.md`.
- **SM35** (birth, 1914-1951) has complete series-ID lookup for
  SM35-1 through SM35-269 (the full series) - SM35-1 through SM35-72
  map to archive.org via an explicit per-record table transcribed from
  the MSA finding aid (see `RECORDS` in `src/series/sm35.js`), and
  SM35-73 through SM35-269 map to the MSA guide by a simple formula
  (their `sr` value is known too now, but isn't used for URL
  construction, per explicit confirmation that this range uses the MSA
  guide pattern regardless). Its location/date search is deliberately
  coarse rather than unimplemented: each file's actual county/month
  coverage is an irregular free-text range (e.g. "Jan. AL-QA, WA-WO,
  QA-WA, Feb. AL-BA") rather than a clean grid, and parsing that hasn't
  been done. So a location/date search for any covered county returns
  every file for that year (with the finding aid's own description as
  the result's `label`, so the caller can see what's actually in each
  one) rather than narrowing to a specific file - but that coverage now
  spans the whole series, 1914-1951.
- **SE42** records 1-21 (before the leading special-case block starts
  in May 1898) aren't broken out by county/month yet - only direct
  series-ID lookup works for that range. Everything from record 22
  onward (May 1898 through the end of the series) is fully indexed.
- **"Unknown month" is now supported** - `lookup({ location, year })`
  with `month` omitted searches every month of that year (see
  `lookupYear()`).
- **S1988** (birth, May 1910 - Dec 1913) is registered and its
  location/date grid is fully implemented, but the archive.org URL
  range for file numbers past 1000 is a provisional estimate (1012,
  computed from the described date range assuming no gaps) rather than
  confirmed against the real archive.org holdings - see the TODO in
  `src/series/s1988.js`. `archiveUrl()` may return wrong or `null` URLs
  for numbers near the end of the series until that's confirmed.

## Testing

Zero test dependencies - uses Node's built-in test runner.

```
npm test
```

## License

MIT - see `LICENSE`.
