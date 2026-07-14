if (typeof require !== "undefined") {
    require("./namespace.js");

    require("../series/se42.js");
    require("../series/se43.js");
    require("../series/se44.js");
    require("../series/se45.js");
    require("../series/se46.js");
    require("../series/cm1132.js");
    require("../series/cm1135.js");
    require("../series/ce502.js");
    require("../series/s1988.js");
    require("../series/sm35.js");
    require("../series/s1963.js");
}

(function (global) {
    "use strict";

    const s = global.MDRecordSearch.series;

    // Order matters only as a tie-breaker if canHandle() ever overlaps
    // across two series of the *same* record type - that shouldn't
    // happen (it would indicate a data error), but see lookup.js for
    // how overlaps are surfaced rather than silently hidden.
    global.MDRecordSearch.SERIES = [
        s.SE42,
        s.SE43,
        s.SE44,
        s.SE45,
        s.SE46,
        s.CM1132,
        s.CM1135,
        s.CE502,
        s.S1988,
        s.SM35,
        s.S1963
    ];

})(typeof window !== "undefined" ? window : globalThis);
