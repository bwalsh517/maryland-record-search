# Changelog

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
- CE502 (Baltimore City, 1950 - 1972) - series-ID search only

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
