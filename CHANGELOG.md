# Changelog

## 1.2.0

### Added

- CM1135 (Baltimore City, 1875 - 1947 for now) now has full
  location/date and certificate-number search, in addition to
  series-ID lookup - CM1135-1 through CM1135-322 transcribed as an
  explicit per-record table (`src/series/cm1135-data.js`); the series
  switches to the "YYYY-NNNNN" certificate format after 1947 and
  isn't transcribed yet. Certificate results include an
  `approximatePageUrl` using the same one-cert-per-page math as
  CM1132, gated on the record actually having an archive.org scan
  (CM1135-151 onward has none).
- CM1132's certificate-number search now accepts the same optional
  `"YYYY-"` year prefix CM1135 needs for disambiguation (see below),
  for one consistent search format across both series - validated
  against the record's actual date when given, even though no letter
  in CM1132 is ever reused the way CM1135's are.
- `listSeries()` and both series' results now report `location` and
  `msaGuideUrl` consistently for CM1132 and CM1135's certificate
  searches.

### Changed

- `BaseSeries` gains `splitCertificateQuery()`, consolidating the
  "peel off an optional `YYYY-` prefix, normalize the legacy
  `LETTER-NUMBER` dash style" step that CM1132, CM1135, SE46, and
  CE502 all need. SE46 and CE502 previously each carried their own
  copy of this; all four now share one implementation and keep only
  the part that's genuinely different per series.
- `createResult()` gains two new fields, both defaulting to values
  that leave every other series' output unchanged: `part` (ties a
  multipart record's several results together - see CM1135-113
  below) and `sortWeight` (lets a series mark a result as
  lower-confidence; `lookupMonth()`/`lookupYear()`/
  `lookupCertificate()` now stable-sort by it before returning).
- `lookupYear()`'s dedup key is now `(series, number, part)` instead
  of `(series, number)`.

### Notes on CM1135's data

- Letters `A` and `B` each cycle through the full 1-100000 range
  twice before `C`-`G` (so far) - a bare letter+number is genuinely
  ambiguous between two real certificates. Certificate lookup returns
  every match; the optional year prefix above disambiguates.
- CM1135-113 covers two disjoint date spans on one physical record,
  modeled as a single record with a list of date parts rather than
  two separate entries.
- CM1135's lost-number sets (CM1135-25 through 29, five multi-year
  batches filed out of chronological order) are always returned after
  every main-sequence match in a location/date search, narrowest
  year-span first.
- A few source oddities are carried through as transcribed, not
  corrected: three certificate boundaries carry an unexplained
  trailing "D", CM1135-302's date looks like a one-year typo against
  its neighbors, CM1135-113's date overlaps CM1135-112's more than
  the usual boundary month, and CM1135-241 is past the 100-year
  access restriction so its certificate range is set to the numeric
  gap between the surrounding records and labeled an estimate rather
  than confirmed.

## 1.1.2

### Fixed

- SE44 and S1963 had no bounds at all on series-ID lookup - a number
  that was never actually generated (0, negative, or past the
  series' real end) returned a plausible-looking but wrong
  archive.org URL instead of no result. Every series now declares its
  real numbering range (`seriesIdRange`), checked before a URL is
  built - a number outside that range now correctly returns nothing,
  for every series.
- `listSeries()` now reports each series' `seriesIdRange`, so a caller
  getting no results back can tell "that number doesn't exist" apart
  from "that number exists but isn't covered by whatever search mode
  was used."

## 1.1.1

### Fixed

- CM1132: certificate-number search now accepts a dash between the
  letter block and the number (e.g. `"A-1234"` as well as `"A1234"`),
  matching how the Baltimore County Genealogical Society index
  sometimes formats them. A bare leading dash with no letter
  (`"-1234"`) still returns no result rather than guessing which
  mistake was made.
- CM1132-31: `approximatePageUrl` no longer returns a malformed link.
  That record's archive.org item has no trailing slash like every
  other record's per-file sub-item, and the item itself is split into
  several smaller files with no data yet mapping a certificate to the
  right one - now returns `null` instead, consistent with how the
  rest of the library signals no page link is available.

## 1.1.0

### Added

- CE502 (Baltimore City, 1950 - 1972) now has full location/date and
  certificate-number search, in addition to series-ID lookup - all 600
  records transcribed as an explicit per-record table
  (`src/series/ce502-data.js`). Certificate numbers reset every year,
  same `"YYYY-NNNNN"` convention as SE46's 1988-2014 era.
  `approximatePageUrl` uses the same page-jump math as SE46's pre-2002
  era (2 pages per certificate, first certificate at page 0). Five
  source-data typos and one confirmed pair of duplicate-numbered
  certificates (1952's two certificates both numbered "3000") were
  corrected/modeled after visual confirmation against the MSA series
  info - see the README's "Known limitations" section and
  `ce502-data.js`'s header comment. A certificate search can also
  target the duplicate directly with its letter suffix
  (`"1952-3000A"`), returning just that one record instead of both.

### Fixed

- SE43: counties in a given month/year now switch correctly between
  the two-letter code order (e.g. AA, AL, BA, CA...) and full-name
  alphabetical order at the right boundaries (Jan 1916 and Jan 1945),
  not just one fixed order for the whole series.
- SE45: `ARCHIVE_RANGES` upper bound corrected from `7031` (a
  copy-paste artifact from SE46's unrelated data) to `1037`, the
  series' real highest generated number.
- SE43: SE43-3223 through SE43-3452 (01/1922 Allegany through
  10/1922 Worcester) now link to the MSA guide instead of archive.org
  - the collection claims to cover 3223-3475, but scans for
  3223-3452 specifically aren't actually there.

## 1.0.0

First stable release.

### Coverage

**Death certificates**
- SE42 (May 1898 - Apr 1910) - full location/date + series-ID search
- SE43 (May 1910 - Jun 1951) - full location/date + series-ID search
- SE44 (Jul 1951 - Jun 1969) - full location/date + series-ID search
- SE45 (Jun 1969 - Dec 1972) - full location/date + series-ID search
- SE46 (1973 - 2014) - series-ID search only
- CM1132 (Baltimore City, 1874 - 1950) - location/date, series-ID,
  *and* certificate-number search, with an approximate deep link to
  the right page within a scanned item
- CE502 (Baltimore City, 1950 - 1972) - series-ID search only at this
  release (see 1.1.0 above for full location/date and
  certificate-number search, added since)

**Birth certificates**
- S1963 (Aug 1898 - Apr 1910) - full location/date + series-ID search
- S1988 (May 1910 - Dec 1913) - full location/date + series-ID search
- SM35 (1914 - 1951) - year-level location search (returns every file
  for a given year, not narrowed to a specific county - see the
  README) + series-ID search
- CM1135 (Baltimore City, 1875 - 1972) - series-ID search only

### Core API

- `lookup({ location, month, year, recordType })` - county/date search,
  with `month` omitted searching every month of a year
- `lookupYear({ location, year, recordType })` - explicit whole-year
  search
- `lookupSeries(seriesId)` - direct lookup by series/file ID
- `lookupCertificate(certificateNumber, options)` - direct lookup by
  raw certificate number (CM1132 only, for now)
- `listSeries()` - introspection: what's registered, its date range,
  and which search modes it actually supports, so a caller (or the
  example UI) never has to hardcode a list that can go stale
- County input accepts full names, unambiguous prefixes, a small alias
  table, and numeric county codes (matching a real genealogy site's
  own search-result format)

### Known limitations

See the README's "Known limitations" section for the current list -
notably S1988's exact final archive.org range boundary is a provisional
estimate, and a handful of individual data points across the birth
series (Baltimore City exclusion assumptions, a small unconfirmed gap
in SM35's early sr-offset mapping) are flagged rather than guessed at
silently.

### A note on data accuracy

The record mappings in this project were built from Maryland State
Archives finding aids and cross-checked against real archive.org URLs
wherever possible, but this is community-assembled data, not an
official index. Treat results as a strong starting point for locating
a scan, not a guaranteed-correct citation - verify anything
research-critical against the MSA guide directly.
