# Contributing

## Adding or correcting series data

Most of what's in `src/series/*.js` is archival research, not logic:
which archive.org item a given file number lives in, and which
counties had their certificates split across multiple surname-range
volumes in a given month or year. If you're correcting or extending
this data:

- Double check a file's `url` in the browser before submitting -
  wrong archive.org collection/prefix/padding is silent until someone
  actually clicks the link.
- Add a regression test in `test/series/` for anything you add or fix,
  especially exception-split entries (`YEAR_EXCEPTION_SPLITS` /
  `MONTH_EXCEPTION_SPLITS`) - these are exactly the kind of thing that
  regress silently if a later edit shifts file numbering.
- Run `npm test` before opening a PR. It's dependency-free (Node's
  built-in test runner), so there's no install step.

## Adding a new record type

See the "Adding a new series" section in `README.md`. Register new
series in `src/core/series-registry.js` and give them the appropriate
`recordType` (second argument to `super()` in the constructor) so
`lookup({ recordType: "birth" })` can filter to just that type.

## Cutting a release

```
node scripts/release.js 1.1.0
```

This bumps the version in `package.json` and `src/core/namespace.js`
(the single source `listSeries()`/`VERSION` read from), runs the test
suite, and commits and tags only those two files. It refuses to run if
there are uncommitted changes to any tracked file - commit or stash
those first. Untracked files (e.g. local scripts you don't want in the
repo) are left alone, but you'll be shown a list and asked to confirm
before it proceeds, in case something unexpected is sitting there.

Push the result yourself once you're happy with it:

```
git push && git push --tags
```

## Code style

No linter is configured yet. Keep new code consistent with the
surrounding file rather than introducing a new style - if you want to
propose adopting ESLint/Prettier project-wide, open an issue first
rather than mixing a reformat into a functional change.
