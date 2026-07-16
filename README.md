# maryland-record-search

[![Tests](https://github.com/bwalsh517/maryland-record-search/actions/workflows/test.yml/badge.svg)](https://github.com/bwalsh517/maryland-record-search/actions/workflows/test.yml)
[![Lint](https://github.com/bwalsh517/maryland-record-search/actions/workflows/lint.yml/badge.svg)](https://github.com/bwalsh517/maryland-record-search/actions/workflows/lint.yml)
[![Coverage](https://github.com/bwalsh517/maryland-record-search/actions/workflows/coverage.yml/badge.svg)](https://github.com/bwalsh517/maryland-record-search/actions/workflows/coverage.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A genealogy research tool: a lookup engine for locating Maryland vital
record certificate scans - birth and death - hosted on archive.org
(via the Reclaim The Records project) or the Maryland State Archives
guide.

Given a county + month/year, a known series/file ID, or (for one
series so far) a raw certificate number, it returns the URL for the
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

The main entry point. Always returns an array (possibly empty).
**Never throws** - malformed input just yields no results.

Two ways to call it:

```js
// By location and date
lookup({ location: "Anne Arundel", month: 5, year: 1910 });
// -> [{ series: "SE43", number: 1, url: "https://archive.org/...", ... }]

// By a known series/file ID
lookup({ series: "SE45-1037" });
```

`location` is a Maryland county name (or `"Baltimore City"`). It's
normalized loosely - exact names, unambiguous prefixes ("Wor" ->
"Worcester"), a small alias table ("pg" -> "Prince George's"), and
numeric county codes (`3` -> "Baltimore", `18` -> "Saint Mary's",
`30` -> "Baltimore City") are all accepted. The numeric codes match
the format the Baltimore County genealogy society's site returns in
its own search results - the same legend also appears on Reclaim The
Records' own archive.org listings for the Maryland death indices (see
`COUNTY_CODES` in `src/core/counties.js` for the full table). Code 47
(Washington, DC) and codes above 30 besides that are intentionally not
included, since they're out-of-state and there's no Maryland location
to resolve them to. Normalization happens
once, before `canHandle()` decides which series to consider - not
only later inside each series' own lookup - so a numeric code routes
exactly the same way the matching name would. See
`src/core/counties.js` for the full alias list.

Once more than one record type is registered, pass `recordType`
(`"death"` or `"birth"`) to disambiguate; omit it and every registered
series is considered, same as today with death-only data.

### `lookupYear(options)`

All files covering one county (or `"Baltimore City"`) across every
month of a given year - for when you don't know the month, or want to
browse a whole year at once:

```js
lookupYear({ location: "Anne Arundel", year: 1969 });
// -> one result per month, correctly spanning any series transition
//    mid-year (e.g. SE44 ending and SE45 starting in the same year)
```

Series that file certificates once per *year* rather than per month
(the same file covers all 12 months for that county) are deduplicated
to a single result rather than appearing 12 times. The same applies
more generally to any file spanning multiple months but not the whole
year (e.g. CM1132's certificate books) - each distinct file appears
exactly once, at the first month it's found, not once per month it
happens to cover.

`lookup({ location, year, recordType })` with `month` omitted calls
this automatically - `lookupYear` is exposed separately in case you
want it without `lookup()`'s branching, or want the intent explicit
in your own code.

### `lookupSeries(seriesId)`

Direct lookup of a known series/file, e.g. `"SE45-1037"`. Equivalent to
`lookup({ series: seriesId })` - exposed separately since it's a common
case (e.g. resolving a citation someone already has).

### `lookupCertificate(certificateNumber, options)`

Direct lookup by a raw certificate number, for the few series numbered
in one continuous running sequence rather than per-county/per-date.
Currently only CM1132 (Baltimore City death certificates) supports
this - its numbering runs through un-lettered `1`-`100000`, then
`A1`-`A100000`, `B1`-`B100000`, and so on through `G`. Equivalent to
`lookup({ certificateNumber, recordType })`.

```js
lookupCertificate("B45678");
// -> [{ series: "CM1132", number: 94, label: "Nos. B99667-C2499",
//       url: "https://archive.org/details/.../",
//       certificateNumber: "B45678",
//       approximatePageUrl: "https://archive.org/details/.../page/n123/mode/1up" }]
```

`approximatePageUrl` is a deep link to roughly the right page within
the scanned item, estimated from the certificate's position within
that record's range (assuming ~1 certificate per scanned page - a
rough estimate confirmed against one known anchor point, not a precise
formula; see the comment on `lookupCertificateNumber()` in
`src/series/cm1132.js`). If the estimate overshoots the item's actual
page count, archive.org's viewer just lands on page 1 rather than
breaking, so an imprecise estimate is harmless - just less useful for
certificates near the end of a large range. Use `listSeries()`'s
`supportsCertificateNumberSearch` field to check which series support
this before relying on it.

### `VERSION`

`MDRecordSearch.VERSION` (or `VERSION` from `require("maryland-record-search")`)
is the library's version string, matching `package.json`. Since the
browser build has no access to `package.json` at all, this is how a
caller can display or check the version at runtime - the example
page's "Available series" heading shows it this way.

### `REPOSITORY_URL` / `ISSUES_URL`

`MDRecordSearch.REPOSITORY_URL` is this project's GitHub repo.
`MDRecordSearch.ISSUES_URL` links directly to the data-correction
issue template - the place to report a wrong result (see "On
accuracy" above). Both are library-level constants, not part of
`listSeries()`'s output, since they're the same for every series
rather than something that varies per series. The example page uses
`ISSUES_URL` for its "Report it" link, read from the library rather
than hardcoded, so it can't drift out of sync.

### `listSeries()`

Introspection helper - returns what's registered, without doing a
lookup:

```js
listSeries();
// -> [{
//      name: "SE43",
//      recordType: "death",
//      seriesHome: "...",
//      dateRange: { startYear: 1910, startMonth: 5, endYear: 1951, endMonth: 6 },
//      supportsLocationSearch: true,
//      supportsCertificateNumberSearch: false,
//      certificateSearchRange: null
//    }, ...]
```

`dateRange` is the exact same data each series' `canHandle()` uses
internally (via a shared `inDateRange()` helper on `BaseSeries`) - not
a separately-maintained copy, so it can't silently drift out of sync
with what a search actually does. The example page's "Available
series" section is built entirely from `listSeries()`, including the
timeline - see `examples/basic-form/app.js`.

`startMonth`/`endMonth` can be `0` to mean "just a year, no month
precision" - matching how the MSA guide sometimes lists a series'
start or end as a bare year rather than a specific month. `0` on
`startMonth` is treated as January (the earliest possible month that
year) and `0` on `endMonth` as December (the latest), so the whole
year is included in range checks either way - and the example page
displays a bare year instead of a fabricated month when it sees `0`.

`certificateSearchRange` is `null` when `supportsCertificateNumberSearch`
is `false`. When certificate search is supported, it defaults to the
series' own `dateRange` - most series that support certificate search
at all cover their whole span, so "implemented" means the whole
series unless a series explicitly says otherwise. SE46 is the one
current exception: its certificate numbering has no location
dimension at all after 1987, and 1973-1987 isn't covered by
certificate lookup at all (see Known limitations below), so
`certificateSearchRange` for SE46 is explicitly
`{ startYear: 1988, startMonth: 0, endYear: 2014, endMonth: 0 }`,
narrower than its full `dateRange` of 1973-2014.

Use this to find out which series support location/date search vs.
series-ID-only lookup today (see Known limitations below) before
building UI around it.

### Result shape

```js
{
  series: "SE43",           // series name
  seriesType: "death",      // record type
  seriesHome: "http://...", // MSA guide page for this series
  location: "Anne Arundel", // normalized county name, or null
  year: 1910,
  month: 5,                 // null if the file covers the whole year
  number: 1,                // file number within the series
  label: "",                // surname-range label, e.g. "A-K", if the file was split
  url: "https://archive.org/details/..."
}
```

### Detailed validation errors

`lookup()` swallows errors so it's safe to call with untrusted input.
If you want to validate a location string yourself and see *why* it
failed (e.g. to show the user a helpful message), call
`counties.normalizeCounty()` directly - it throws a `CountyNotFoundError`
with the offending value attached.

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
   `cm1135.js` is the simplest (series-ID lookup only), `se43.js` is
   the most complete (also does location/date search, including
   surname-range file splits).
2. Extend `BaseSeries`, call `super(name, recordType)` - use `"birth"`
   for a birth certificate series.
3. Set `this.dateRange = { startYear, startMonth, endYear, endMonth }`
   in the constructor, and have `canHandle(location, month, year)` call
   `this.inDateRange(month, year)` (plus whatever location check the
   series needs) rather than comparing inline literals - this is what
   `listSeries()` reports as the timeline, so it needs to be the same
   data actually driving search, not a separate copy. Use `0` for
   `startMonth`/`endMonth` if the MSA guide only gives a bare year for
   that boundary rather than a specific month.
4. Provide `ARCHIVE_RANGES` at minimum. Add `buildIndex()` +
   `lookupLocationMonthYear()` if the series should support
   location/date search, not just direct series-ID lookup.
5. Register the instance in `src/core/series-registry.js`.
6. Add a test file under `test/series/`.

The exception-split tables (`YEAR_EXCEPTION_SPLITS`,
`MONTH_EXCEPTION_SPLITS`) that some series use encode archival research
about counties whose certificates were filed in multiple
surname-range volumes for a given month/year - they're intentionally
just data, not something to try to generalize into a formula.

## Known limitations (not yet implemented)

- **CM1132** (death, Baltimore City, 1874-1950): fully implemented
  location/date, series-ID, and certificate-number search - the only
  series with certificate-number lookup so far. Its records span
  multiple months (unlike the county grids' per-month/per-year files),
  so each result's `label` leads with the record's actual date span
  (e.g. `"01/1914-04/1914 Nos. C71526-C74735"`), not just the
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
  null `url` rather than a broken or misleading link.

- **CM1135** (birth, 1875-1972, Baltimore City only): series-ID search
  only - no location/date search implemented. Its `dateRange` uses
  `startMonth: 0` and `endMonth: 0` since only years were given, not
  specific months (see the `month: 0` convention documented under
  `listSeries()` above).

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
