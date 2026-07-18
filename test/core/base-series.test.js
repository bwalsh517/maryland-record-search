const test = require("node:test");
const assert = require("node:assert/strict");

const BaseSeries = require("../../src/core/base-series.js");


function makeSeries(dateRange) {
    const series = new BaseSeries("TEST", "death");
    series.dateRange = dateRange;
    return series;
}


test("inDateRange with no dateRange declared is unrestricted", () => {
    const series = new BaseSeries("TEST", "death");
    assert.equal(series.inDateRange(1, 1500), true);
    assert.equal(series.inDateRange(12, 2100), true);
});


test("inDateRange with fully month-precise bounds behaves like a normal inclusive range", () => {
    const series = makeSeries({ startYear: 1910, startMonth: 5, endYear: 1951, endMonth: 6 });

    assert.equal(series.inDateRange(4, 1910), false);
    assert.equal(series.inDateRange(5, 1910), true);
    assert.equal(series.inDateRange(6, 1951), true);
    assert.equal(series.inDateRange(7, 1951), false);
});


test("splitCertificateQuery: a plain letter+number has no year, dash untouched", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("B45678"), { year: null, rest: "B45678" });
});


test("splitCertificateQuery: a bare number (no letter) is untouched", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("9585"), { year: null, rest: "9585" });
});


test("splitCertificateQuery: a YYYY- prefix is extracted as a number", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("1900-B45678"), { year: 1900, rest: "B45678" });
});


test("splitCertificateQuery: the legacy LETTER-NUMBER dash style is normalized away", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("A-1234"), { year: null, rest: "A1234" });
});


test("splitCertificateQuery: a year prefix and the legacy dash style combine correctly", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("1900-A-1234"), { year: 1900, rest: "A1234" });
});


test("splitCertificateQuery: lowercase input is uppercased", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("b45678"), { year: null, rest: "B45678" });
    assert.deepEqual(series.splitCertificateQuery("a-1234"), { year: null, rest: "A1234" });
});


test("splitCertificateQuery: leading/trailing whitespace is trimmed", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("  B45678  "), { year: null, rest: "B45678" });
});


test("splitCertificateQuery: a trailing suffix letter (CM1135's D-style, CE502's letter-duplicate style) survives untouched", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("G33501D"), { year: null, rest: "G33501D" });
    assert.deepEqual(series.splitCertificateQuery("1945-G33501D"), { year: 1945, rest: "G33501D" });
    assert.deepEqual(series.splitCertificateQuery("1952-3000A"), { year: 1952, rest: "3000A" });
});


test("splitCertificateQuery: empty, null, or non-string input returns no year and an empty rest", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery(""), { year: null, rest: "" });
    assert.deepEqual(series.splitCertificateQuery(null), { year: null, rest: "" });
    assert.deepEqual(series.splitCertificateQuery(undefined), { year: null, rest: "" });
});


test("splitCertificateQuery: a dash with nothing after it is left alone, not treated as a year prefix", () => {
    const series = new BaseSeries("TEST", "death");
    assert.deepEqual(series.splitCertificateQuery("1900-"), { year: null, rest: "1900-" });
});


test("inDateRange treats startMonth 0 as January (includes the whole start year)", () => {
    const series = makeSeries({ startYear: 1900, startMonth: 0, endYear: 1905, endMonth: 6 });

    assert.equal(series.inDateRange(1, 1900), true);
    assert.equal(series.inDateRange(12, 1900), true);
    assert.equal(series.inDateRange(12, 1899), false);
});


test("inDateRange treats endMonth 0 as December (includes the whole end year)", () => {
    const series = makeSeries({ startYear: 1910, startMonth: 3, endYear: 1920, endMonth: 0 });

    assert.equal(series.inDateRange(2, 1910), false);
    assert.equal(series.inDateRange(3, 1910), true);
    assert.equal(series.inDateRange(1, 1920), true);
    assert.equal(series.inDateRange(12, 1920), true);
    assert.equal(series.inDateRange(1, 1921), false);
});


test("inDateRange works with both boundaries as full years", () => {
    const series = makeSeries({ startYear: 1926, startMonth: 0, endYear: 1930, endMonth: 0 });

    assert.equal(series.inDateRange(1, 1926), true);
    assert.equal(series.inDateRange(12, 1930), true);
    assert.equal(series.inDateRange(12, 1925), false);
    assert.equal(series.inDateRange(1, 1931), false);
});
