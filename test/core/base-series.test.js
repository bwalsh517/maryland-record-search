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
