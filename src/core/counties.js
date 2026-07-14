if (typeof require !== "undefined") {
    require("./namespace.js");
}

(function (global) {
    "use strict";

    const BASE_COUNTIES = [
        "Anne Arundel",
        "Allegany",
        "Baltimore",
        "Caroline",
        "Cecil",
        "Charles",
        "Carroll",
        "Calvert",
        "Dorchester",
        "Frederick",
        "Garrett",
        "Harford",
        "Howard",
        "Kent",
        "Montgomery",
        "Prince George's",
        "Queen Anne's",
        "Saint Mary's",
        "Somerset",
        "Talbot",
        "Washington",
        "Wicomico",
        "Worcester"
    ];

    function alphabeticalCountyOrder() {
        return [...BASE_COUNTIES].sort();
    }

    function alphabeticalCountyCityOrder() {
        return [
            ...BASE_COUNTIES,
            "Baltimore City"
        ].sort();
    }

    // Values here must be exact matches against BASE_COUNTIES (e.g.
    // "Saint Mary's", not "St. Mary's") or alias-based lookups for
    // that county will silently return zero results.
    const COUNTY_ALIASES = {
        "alle": "Allegany",
        "ann": "Anne Arundel",
        "bal": "Baltimore",
        "cal": "Calvert",
        "caro": "Caroline",
        "carr": "Carroll",
        "cec": "Cecil",
        "cha": "Charles",
        "dor": "Dorchester",
        "fre": "Frederick",
        "gar": "Garrett",
        "har": "Harford",
        "how": "Howard",
        "ken": "Kent",
        "mon": "Montgomery",
        "prince": "Prince George's",
        "queen": "Queen Anne's",
        "saint": "Saint Mary's",
        "som": "Somerset",
        "tal": "Talbot",
        "was": "Washington",
        "wic": "Wicomico",
        "wor": "Worcester",

        // MSA's own 2-letter jurisdiction codes, used to identify
        // counties directly in some finding aids (seen in SE46's
        // 1973-1987 grid, and other series are expected to use these
        // too). "bc" resolves to the literal "Baltimore City" string
        // rather than a BASE_COUNTIES entry - same as the dedicated
        // check above, just reached through this table instead.
        "al": "Allegany",
        "aa": "Anne Arundel",
        "ba": "Baltimore",
        "bc": "Baltimore City",
        "cv": "Calvert",
        "ca": "Caroline",
        "cr": "Carroll",
        "ce": "Cecil",
        "ch": "Charles",
        "do": "Dorchester",
        "fr": "Frederick",
        "ga": "Garrett",
        "ha": "Harford",
        "ho": "Howard",
        "ke": "Kent",
        "mo": "Montgomery",
        "pg": "Prince George's",
        "qa": "Queen Anne's",
        "sm": "Saint Mary's",
        "so": "Somerset",
        "ta": "Talbot",
        "wa": "Washington",
        "wi": "Wicomico",
        "wo": "Worcester"
    };

    // Numeric county codes, as returned in search results from the
    // Baltimore County genealogy society's site. These accompany "Sex"
    // (1=male, 2=female, 9=not checked) and "Race" (1=white,
    // 2=non-white, 9=not checked) codes in the same result records,
    // which aren't handled here since they're not location data - only
    // the county code list is relevant to normalizeCounty().
    //
    // Code 30 (Baltimore City) works end-to-end through lookup() too:
    // location is normalized once in lookup.js before canHandle() ever
    // runs, so a numeric code routes to the right series exactly like
    // the matching name/alias would.
    const COUNTY_CODES = {
        1: "Allegany",
        2: "Anne Arundel",
        3: "Baltimore",
        4: "Calvert",
        5: "Caroline",
        6: "Carroll",
        7: "Cecil",
        8: "Charles",
        9: "Dorchester",
        10: "Frederick",
        11: "Garrett",
        12: "Harford",
        13: "Howard",
        14: "Kent",
        15: "Montgomery",
        16: "Prince George's",
        17: "Queen Anne's",
        18: "Saint Mary's",
        19: "Somerset",
        20: "Talbot",
        21: "Washington",
        22: "Wicomico",
        23: "Worcester",
        30: "Baltimore City"
    };

    // Not included above: per the same source legend, code 47 is
    // Washington, DC, explicitly noted as having no certificate in
    // Maryland records at all, and every other code past 30 besides
    // 47 belongs to some other state with no published key. There's
    // no Maryland location to resolve any of these to, so they
    // correctly fall through to CountyNotFoundError rather than being
    // mapped to something fake.

    /**
     * Thrown by normalizeCounty() when a location string can't be
     * resolved to exactly one county. Exported so callers who want
     * detailed validation errors can catch it specifically -
     * MDRecordSearch.lookup() itself never lets this escape; it
     * catches it internally and returns an empty result set instead,
     * so a bad location string from a caller's own search index
     * can't throw and break their page.
     */
    class CountyNotFoundError extends Error {
        constructor(value) {
            super(`Unknown or ambiguous county: ${value}`);
            this.name = "CountyNotFoundError";
            this.value = value;
        }
    }

    function normalizeCounty(value) {

        const raw = String(value == null ? "" : value).trim();

        if (/^\d+$/.test(raw)) {

            const county = COUNTY_CODES[Number(raw)];

            if (county) {
                return county;
            }

            throw new CountyNotFoundError(value);
        }

        const normalized = raw.toLowerCase();

        // Baltimore City isn't one of the 23 BASE_COUNTIES (every
        // series treats it separately, via canHandle()) but is still a
        // valid location value throughout this library, so it needs to
        // survive normalization rather than being rejected as unknown.
        if (normalized === "baltimore city") {
            return "Baltimore City";
        }

        if (COUNTY_ALIASES[normalized]) {
            return COUNTY_ALIASES[normalized];
        }

        const matches = BASE_COUNTIES.filter(
            c => c.toLowerCase().startsWith(normalized)
        );

        if (matches.length === 1) {
            return matches[0];
        }

        throw new CountyNotFoundError(value);
    }

    const counties = {
        BASE_COUNTIES,
        COUNTY_ALIASES,
        COUNTY_CODES,
        CountyNotFoundError,
        alphabeticalCountyOrder,
        alphabeticalCountyCityOrder,
        normalizeCounty
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = counties;
    }

    global.MDRecordSearch.counties = counties;

})(typeof window !== "undefined" ? window : globalThis);
