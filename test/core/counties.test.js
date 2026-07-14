const test = require("node:test");
const assert = require("node:assert/strict");

const { counties } = require("../../src/index.js");


test("normalizeCounty resolves an exact name", () => {
    assert.equal(counties.normalizeCounty("Talbot"), "Talbot");
});


test("normalizeCounty resolves an unambiguous prefix", () => {
    assert.equal(counties.normalizeCounty("Wor"), "Worcester");
});


test("normalizeCounty resolves aliases to the canonical BASE_COUNTIES spelling", () => {
    for (const alias of Object.keys(counties.COUNTY_ALIASES)) {
        const resolved = counties.normalizeCounty(alias);

        // "bc" is the one intentional exception - MSA's code for
        // Baltimore City, which isn't a BASE_COUNTIES entry (same
        // reason the literal "baltimore city" string gets its own
        // check in normalizeCounty(), rather than being one of the
        // 23 counties).
        if (alias === "bc") {
            assert.equal(resolved, "Baltimore City");
            continue;
        }

        assert.ok(
            counties.BASE_COUNTIES.includes(resolved),
            `alias "${alias}" resolved to "${resolved}", which is not in BASE_COUNTIES`
        );
    }
});


test("normalizeCounty resolves MSA's complete 2-letter jurisdiction code list, case-insensitively", () => {
    const codes = {
        AL: "Allegany", AA: "Anne Arundel", BA: "Baltimore", BC: "Baltimore City",
        CV: "Calvert", CA: "Caroline", CR: "Carroll", CE: "Cecil", CH: "Charles",
        DO: "Dorchester", FR: "Frederick", GA: "Garrett", HA: "Harford", HO: "Howard",
        KE: "Kent", MO: "Montgomery", PG: "Prince George's", QA: "Queen Anne's",
        SM: "Saint Mary's", SO: "Somerset", TA: "Talbot", WA: "Washington",
        WI: "Wicomico", WO: "Worcester"
    };

    for (const [code, expected] of Object.entries(codes)) {
        assert.equal(counties.normalizeCounty(code), expected);
        assert.equal(counties.normalizeCounty(code.toLowerCase()), expected);
    }
});


test("normalizeCounty: 'saint' and 'sm' resolve to the canonical BASE_COUNTIES spelling of St. Mary's", () => {
    assert.equal(counties.normalizeCounty("saint"), "Saint Mary's");
    assert.equal(counties.normalizeCounty("sm"), "Saint Mary's");
    assert.ok(counties.BASE_COUNTIES.includes("Saint Mary's"));
});


test("normalizeCounty throws CountyNotFoundError on unknown input", () => {
    assert.throws(
        () => counties.normalizeCounty("Nonexistent County"),
        counties.CountyNotFoundError
    );
});


test("normalizeCounty throws CountyNotFoundError on ambiguous prefix", () => {
    // "Car" matches Caroline and Carroll. (A 2-letter prefix won't
    // hit this path any more - every 2-letter combination is now a
    // defined MSA alias, resolved directly rather than falling
    // through to prefix-matching.)
    assert.throws(
        () => counties.normalizeCounty("Car"),
        counties.CountyNotFoundError
    );
});


test("normalizeCounty resolves numeric county codes (Baltimore County genealogy site format)", () => {
    assert.equal(counties.normalizeCounty(1), "Allegany");
    assert.equal(counties.normalizeCounty(2), "Anne Arundel");
    assert.equal(counties.normalizeCounty(3), "Baltimore");
    assert.equal(counties.normalizeCounty(18), "Saint Mary's");
    assert.equal(counties.normalizeCounty(23), "Worcester");
});


test("normalizeCounty resolves numeric county codes given as strings", () => {
    assert.equal(counties.normalizeCounty("1"), "Allegany");
    assert.equal(counties.normalizeCounty("18"), "Saint Mary's");
});


test("normalizeCounty resolves county code 30 to Baltimore City", () => {
    assert.equal(counties.normalizeCounty(30), "Baltimore City");
});


test("normalizeCounty resolves the literal 'Baltimore City' string (not one of BASE_COUNTIES, but still a valid location)", () => {
    assert.equal(counties.normalizeCounty("Baltimore City"), "Baltimore City");
    assert.equal(counties.normalizeCounty("baltimore CITY"), "Baltimore City");
});


test("normalizeCounty throws CountyNotFoundError on an unmapped numeric code", () => {
    assert.throws(
        () => counties.normalizeCounty(99),
        counties.CountyNotFoundError
    );
});


test("normalizeCounty throws on code 47 (Washington, DC) - there's no Maryland location for it", () => {
    assert.throws(
        () => counties.normalizeCounty(47),
        counties.CountyNotFoundError
    );
});


test("every COUNTY_CODES entry (except Baltimore City) resolves to a real BASE_COUNTIES entry", () => {
    for (const [code, name] of Object.entries(counties.COUNTY_CODES)) {
        if (name === "Baltimore City") {
            continue;
        }
        assert.ok(
            counties.BASE_COUNTIES.includes(name),
            `code ${code} maps to "${name}", which is not in BASE_COUNTIES`
        );
    }
});
