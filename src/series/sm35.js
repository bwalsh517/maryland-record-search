if (typeof require !== "undefined") {
    require("../core/base-series.js");
    require("../core/counties.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;
    const counties = global.MDRecordSearch.counties;

    class SM35Series extends BaseSeries {

        constructor() {

            super("SM35", "birth");

            this.dateRange = { startYear: 1914, startMonth: 1, endYear: 1951, endMonth: 12 };

            this.seriesIdRange = { start: 1, end: 269 };

            // Full mapping transcribed from the MSA guide for this
            // series (SM35-1 through SM35-269, the entire series).
            // `sr` is the internal record number - it's used to build
            // the archive.org URL for numbers 1-72 (see archiveUrl()),
            // but numbers 73-269 use the MSA guide URL pattern instead
            // (per explicit confirmation), so their `sr` value here is
            // informational/for reference only, not used in URL
            // construction. `description` is the MSA guide's own note
            // on what month/county ranges are actually in that file
            // (kept verbatim, not parsed - see lookupLocationMonthYear()
            // for why).
            this.RECORDS = [
                { number: 1, year: 1914, sr: "3116", description: "Jan. AL-QA, WA-WO, QA-WA, Feb. AL-BA" },
                { number: 2, year: 1914, sr: "3117", description: "Feb. CV-WO, Mar. AL-WO. Certs. for Feb. WA-WO unsorted. Rets. of SO 4451-4464" },
                { number: 3, year: 1914, sr: "3118", description: "Apr. AL-WO, May. AL-PG" },
                { number: 4, year: 1914, sr: "3119", description: "May. QA-WO, Jun. AL-WO" },
                { number: 5, year: 1914, sr: "3120", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 6, year: 1914, sr: "3121", description: "Sep. AL-WO, Oct. AL-QA" },
                { number: 7, year: 1914, sr: "3122", description: "Oct. SM-WO, Nov. AL-WO" },
                { number: 8, year: 1914, sr: "3123", description: "Dec. AL-WO" },
                { number: 9, year: 1915, sr: "3124", description: "Jan. AL-WO, Feb. AL-FR" },
                { number: 10, year: 1915, sr: "3159", description: "Feb. GA-WO, Mar. AL-WO, Apr. AL-BA" },
                { number: 11, year: 1915, sr: "3160", description: "Apr. CV-WO, May. AL-QA" },
                { number: 12, year: 1915, sr: "3161", description: "May. SM-WO, Jun. AL-WO" },
                { number: 13, year: 1915, sr: "3162", description: "Jul. AL-WO, Aug. AL-DO" },
                { number: 14, year: 1915, sr: "3163", description: "Aug. FR-WO, Sep. AL-WO, Oct. AL-BA" },
                { number: 15, year: 1915, sr: "3164", description: "Oct. CV-WO, Nov. AL-QA" },
                { number: 16, year: 1915, sr: "3165", description: "Nov. SM-WO, Dec. AL-WO" },
                { number: 17, year: 1916, sr: "3166", description: "Jan. AL-WO, Feb. AL-FR" },
                { number: 18, year: 1916, sr: "3167", description: "Feb. GA-WO, Mar. AL-WO" },
                { number: 19, year: 1916, sr: "3168", description: "Apr. AL-WO, May. AL-FR" },
                { number: 20, year: 1916, sr: "3169", description: "May. GA-WO, Jun. AL-WO" },
                { number: 21, year: 1916, sr: "3170", description: "Jul. AL-WO, Aug. AL-BA" },
                { number: 22, year: 1916, sr: "3272", description: "Aug. CV-WO, Sep. AL-KE" },
                { number: 23, year: 1916, sr: "3273", description: "Sep. MO-WO, Oct. AL-WO, Nov. AL-FR" },
                { number: 24, year: 1916, sr: "3274", description: "Nov. GA-WO, Dec. AL-WO" },
                { number: 25, year: 1917, sr: "3275", description: "Jan. AL-WO, Feb. AL-FR" },
                { number: 26, year: 1917, sr: "3276", description: "Feb. GA-WO, Mar. AL-WO" },
                { number: 27, year: 1917, sr: "3277", description: "Apr. AL-WO, May. AL-FR" },
                { number: 28, year: 1917, sr: "3278", description: "May. GA-WO, Jun. AL-WO" },
                { number: 29, year: 1917, sr: "3279", description: "Jul. AL-WO, Aug. AL-FR" },
                { number: 30, year: 1917, sr: "3280", description: "Aug. GA-WO, Sep. AL-WO" },
                { number: 31, year: 1917, sr: "3281", description: "Oct. AL-WO, Nov. AL-KE" },
                { number: 32, year: 1917, sr: "3282", description: "Nov. MO-WO, Dec. AL-WO" },
                { number: 33, year: 1918, sr: "3676-A", description: "Jan. AL-WO, Feb. AL-KE" },
                { number: 34, year: 1918, sr: "3677", description: "Feb. MO-WO, Mar. AL-WO, Apr. AL-AA" },
                { number: 35, year: 1918, sr: "3678", description: "Apr. AA-WO, May. AL-BA" },
                { number: 36, year: 1918, sr: "3679", description: "May. BA-WO, Jun. AL-WO" },
                { number: 37, year: 1918, sr: "3680", description: "Jul. AL-WO, Aug. AL-CV" },
                { number: 38, year: 1918, sr: "3681", description: "Aug. CA-WO, Sep. AL-WO" },
                { number: 39, year: 1918, sr: "3682", description: "Oct. AL-WO" },
                { number: 40, year: 1918, sr: "3683", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 41, year: 1919, sr: "3684", description: "Jan. AL-WO, Feb. AL-WO, Mar. AL-BA" },
                { number: 42, year: 1919, sr: "3685", description: "Mar. BA-WO, Apr. AL-CR" },
                { number: 43, year: 1919, sr: "3686", description: "Apr. CE-WO, May. AL-MO" },
                { number: 44, year: 1919, sr: "3687", description: "May. PG-WO, Jun. AL-WO" },
                { number: 45, year: 1919, sr: "3688", description: "Jul. AL-WO, Aug. AL-MO" },
                { number: 46, year: 1919, sr: "3689", description: "Aug. PG-WO, Sep. AL-WO" },
                { number: 47, year: 1919, sr: "3690", description: "Oct. AL-WO, Nov. AL-KE" },
                { number: 48, year: 1919, sr: "3691", description: "Nov. MO-WO, Dec. AL-WO" },
                { number: 49, year: 1920, sr: "3692", description: "Jan. AL-WO, Feb. AL-CR" },
                { number: 50, year: 1920, sr: "3693", description: "Feb. CE-WO, Mar. AL-KE" },
                { number: 51, year: 1920, sr: "3694", description: "Mar. MO-WO, Apr. AL-WO, May. AL-CA" },
                { number: 52, year: 1920, sr: "3695", description: "May. CR-WO, Jun. AL-KE" },
                { number: 53, year: 1920, sr: "3696", description: "Jun. MO-WO, Jul. AL-WO, Aug. AL-BA" },
                { number: 54, year: 1920, sr: "3697", description: "Aug. BA-WO, Sep. AL-MO" },
                { number: 55, year: 1920, sr: "3698", description: "Sep. PG-WO, Oct. AL-WO, Nov. AL-MO" },
                { number: 56, year: 1920, sr: "3699", description: "Nov. PG-WO, Dec. AL-WO" },
                { number: 57, year: 1921, sr: "3700", description: "Jan. AL-WO, Feb. AL-KE" },
                { number: 58, year: 1921, sr: "3701", description: "Feb. MO-WO, Mar. AL-WO, Apr. AL-BA" },
                { number: 59, year: 1921, sr: "3702", description: "Apr. BA-WO, May. AL-PG" },
                { number: 60, year: 1921, sr: "3703", description: "May. QA-WO, Jun. AL-WO, Jul. AL-BA" },
                { number: 61, year: 1921, sr: "3704", description: "Jul. BA-WO, Aug. AL-PG" },
                { number: 62, year: 1921, sr: "3705", description: "Aug. PG-WO, Sep. AL-WO, Oct. AL-CH" },
                { number: 63, year: 1921, sr: "3706", description: "Oct. DO-WO, Nov. AL-WO, Dec. AL-BA" },
                { number: 64, year: 1921, sr: "3707", description: "Dec. CV-WO" },
                { number: 65, year: 1922, sr: "3708", description: "Jan. AL-WI. Fogged at end" },
                { number: 66, year: 1922, sr: "3709", description: "Jan. WO, Feb. AL-WO, Mar. AL-GA" },
                { number: 67, year: 1922, sr: "3710", description: "Mar. HA-WO, Apr. AL-WO, May. AL-FR" },
                { number: 68, year: 1922, sr: "3711", description: "May. GA-WO, Jun. AL-WO, Jul. AL-CA" },
                { number: 69, year: 1922, sr: "3712", description: "Jul. CR-WO, Aug. AL-WO" },
                { number: 70, year: 1922, sr: "3713", description: "Sep. AL-WO, Oct. AL-MO" },
                { number: 71, year: 1922, sr: "3714", description: "Oct. PG-WO, Nov. AL-WO, Dec. AL-CA" },
                { number: 72, year: 1922, sr: "3715", description: "Dec. CR-WO" },
                { number: 73, year: 1923, sr: "3716", description: "Jan. AL-WO" },
                { number: 74, year: 1923, sr: "3717", description: "Feb. CR-KE, AL-CA, MO-WO, Mar. AL-WA. Fogged at end" },
                { number: 75, year: 1923, sr: "3718", description: "Mar. WI-WO, Apr. AL-WO, May. AL-PG" },
                { number: 76, year: 1923, sr: "3719", description: "May. QA-WO, Jun. AL-WO, Jul. AL-HA" },
                { number: 77, year: 1923, sr: "3720", description: "Jul. HO-WO, Aug. AL-WO, Sep. AL-CA" },
                { number: 78, year: 1923, sr: "3721", description: "Sep. CR-WO, Oct. AL-WO, Nov. AL-CR" },
                { number: 79, year: 1923, sr: "3722", description: "Nov. CE-WO, Dec. AL-WO" },
                { number: 80, year: 1924, sr: "3723", description: "Jan. AL-WO, Feb. AL-HO" },
                { number: 81, year: 1924, sr: "3724", description: "Feb. KE-WO, Mar. AL-WO, Apr. AL-CA" },
                { number: 82, year: 1924, sr: "3725", description: "Apr. CR-WO, May. AL-WO, Jun. AL-CA" },
                { number: 83, year: 1924, sr: "3726", description: "Jun. CR-WO, Jul. AL-WO, Aug. AL" },
                { number: 84, year: 1924, sr: "3727", description: "Aug. AA-WO, Sep. AL-MO" },
                { number: 85, year: 1924, sr: "3728", description: "Sep. PG-WO, Oct. AL-WO, Nov. AL-KE" },
                { number: 86, year: 1924, sr: "3729", description: "Nov. MO-WO, Dec. AL-WO" },
                { number: 87, year: 1925, sr: "3730", description: "Jan. AL-WO, Feb. AL-WA" },
                { number: 88, year: 1925, sr: "3731", description: "Feb. WI-WO, Mar. AL-WO, Apr. AL-CA" },
                { number: 89, year: 1925, sr: "3732", description: "Apr. CR-WO, May. AL-WO" },
                { number: 90, year: 1925, sr: "3733", description: "Jun. AL-WO, Jul. AL-PG" },
                { number: 91, year: 1925, sr: "3734", description: "Jul. QA-WO, Aug. AL-WO, Sep. AL-CA" },
                { number: 92, year: 1925, sr: "3735", description: "Sep. CR-WO, Oct. AL-WO" },
                { number: 93, year: 1925, sr: "3736", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 94, year: 1926, sr: "3737", description: "Jan. AL-WO, Feb. AL-MO" },
                { number: 95, year: 1926, sr: "3738", description: "Feb. PG-WO, Mar. AL-WO, Apr. AL-CR" },
                { number: 96, year: 1926, sr: "3739", description: "Apr. CR-WO, May. AL-WO" },
                { number: 97, year: 1926, sr: "3740", description: "Jun. AL-WO, Jul. AL-MO" },
                { number: 98, year: 1926, sr: "3741", description: "Jul. PG-WO, Aug. AL-WO, Sep. AL-CA" },
                { number: 99, year: 1926, sr: "3742", description: "Sep. CR-WO, Oct. AL-WO" },
                { number: 100, year: 1926, sr: "3743", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 101, year: 1927, sr: "3744", description: "Jan. AL-WO, Feb. AL-CA" },
                { number: 102, year: 1927, sr: "3745", description: "Feb. CR-WO, Mar. AL-WO" },
                { number: 103, year: 1927, sr: "3746", description: "Apr. AL-WO, May. AL-MO" },
                { number: 104, year: 1927, sr: "3747", description: "May. PG-WO, Jun. AL-WO, Jul. AL-BA" },
                { number: 105, year: 1927, sr: "3748", description: "Jul. CV-WO, Aug. AL-WO" },
                { number: 106, year: 1927, sr: "3749", description: "Sep. AL-WO, Oct. AL-PG" },
                { number: 107, year: 1927, sr: "3750", description: "Oct. QA-WO, Nov. AL-WO, Dec. AL-BA" },
                { number: 108, year: 1927, sr: "3751", description: "Dec. CV-WO" },
                { number: 109, year: 1928, sr: "3752", description: "Jan. AL-WO" },
                { number: 110, year: 1928, sr: "3753", description: "Feb. AL-WO, Mar. AL-PG" },
                { number: 111, year: 1928, sr: "3754", description: "Mar. QA-WO, Apr. AL-WO, May. AL-BA" },
                { number: 112, year: 1928, sr: "3755", description: "May. CV-WO, Jun. AL-WO" },
                { number: 113, year: 1928, sr: "3756", description: "Jul. AL-WO, Aug. AL-MO" },
                { number: 114, year: 1928, sr: "3757", description: "Aug. PG-WO, Sep. AL-WO, Oct. AL-CA" },
                { number: 115, year: 1928, sr: "3758", description: "Oct. CR-WO, Nov. AL-WO" },
                { number: 116, year: 1928, sr: "3759", description: "Dec. AL-WO" },
                { number: 117, year: 1929, sr: "3760", description: "Jan. AL-WO, Feb. AL-PG" },
                { number: 118, year: 1929, sr: "3761", description: "Feb. QA-WO, Mar. AL-WO, Apr. AL-CA" },
                { number: 119, year: 1929, sr: "3762", description: "Apr. CR-WO, May. AL-WO" },
                { number: 120, year: 1929, sr: "3763", description: "Jun. AL-WO, Jul. AL-MO" },
                { number: 121, year: 1929, sr: "3764", description: "Jul. PG-WO, Aug. AL-WO, Sep. AL-CA" },
                { number: 122, year: 1929, sr: "3765", description: "Sep. CR-WO, Oct. AL-WO, Nov. AL-CA" },
                { number: 123, year: 1929, sr: "3766", description: "Nov. CR-WO, Dec. AL-WO" },
                { number: 124, year: 1930, sr: "3767", description: "Jan. AL-WO, Feb. AL-MO" },
                { number: 125, year: 1930, sr: "3768", description: "Feb. PG-WO, Mar. AL-WO, Apr. AL-CA" },
                { number: 126, year: 1930, sr: "3769", description: "Apr. CR-WO, May. AL-WO, Jun. AL-CA" },
                { number: 127, year: 1930, sr: "3770", description: "Jun. CR-WO, Jul. AL-WO" },
                { number: 128, year: 1930, sr: "3771", description: "Aug. AL-WO, Sep. AL-MO" },
                { number: 129, year: 1930, sr: "3772", description: "Sep. PG-WO, Oct. AL-WO, Nov. AL-CA" },
                { number: 130, year: 1930, sr: "3773", description: "Nov. CR-WO, Dec. AL-WO" },
                { number: 131, year: 1931, sr: "3774", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 132, year: 1931, sr: "3775", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 133, year: 1931, sr: "3776", description: "May. AL-WO, Jun. AL-WO" },
                { number: 134, year: 1931, sr: "3777", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 135, year: 1931, sr: "3778", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 136, year: 1931, sr: "3779", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 137, year: 1932, sr: "3780", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 138, year: 1932, sr: "3781", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 139, year: 1932, sr: "3782", description: "May. AL-WO, Jun. AL-WO" },
                { number: 140, year: 1932, sr: "3783", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 141, year: 1932, sr: "3784", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 142, year: 1932, sr: "3785", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 143, year: 1933, sr: "3786", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 144, year: 1933, sr: "3787", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 145, year: 1933, sr: "3788", description: "May. AL-WO, Jun. AL-WO" },
                { number: 146, year: 1933, sr: "3789", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 147, year: 1933, sr: "3790", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 148, year: 1933, sr: "3791", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 149, year: 1934, sr: "2540", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 150, year: 1934, sr: "2541", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 151, year: 1934, sr: "2542", description: "May. AL-WO, Jun. AL-WO" },
                { number: 152, year: 1934, sr: "2543", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 153, year: 1934, sr: "2544", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 154, year: 1934, sr: "2545", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 155, year: 1935, sr: "2546", description: "Jan. AL-WO, Feb. AL-WO. Rets. of Jan. WA 1133, 1134" },
                { number: 156, year: 1935, sr: "2547", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 157, year: 1935, sr: "2548", description: "May. AL-WO, Jun. AL-WO. Rets. of May. SO 6944, Jun. AA 7716" },
                { number: 158, year: 1935, sr: "2549", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 159, year: 1935, sr: "2550", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 160, year: 1935, sr: "2551", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 161, year: 1936, sr: "2552", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 162, year: 1936, sr: "2553", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 163, year: 1936, sr: "2554", description: "May. AL-WO, Jun. AL-WO. Rets. of May. AL 5958, May. FR 6371" },
                { number: 164, year: 1936, sr: "2555", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 165, year: 1936, sr: "2556", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 166, year: 1936, sr: "2557", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 167, year: 1937, sr: "2558", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 168, year: 1937, sr: "2559", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 169, year: 1937, sr: "2560", description: "May. AL-WO, Jun. AL-WO" },
                { number: 170, year: 1937, sr: "2561", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 171, year: 1937, sr: "2562", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 172, year: 1937, sr: "2563", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 173, year: 1938, sr: "2564", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 174, year: 1938, sr: "2565", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 175, year: 1938, sr: "2566", description: "May. AL-WO, Jun. AL-WO" },
                { number: 176, year: 1938, sr: "2567", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 177, year: 1938, sr: "2568", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 178, year: 1938, sr: "2569", description: "Nov. AL-WO, Dec. AL-WO. Rets. of Dec. CE 15529, 15530" },
                { number: 179, year: 1939, sr: "2570", description: "Jan. AL-WO, Feb. AL-WO" },
                { number: 180, year: 1939, sr: "2571", description: "Mar. AL-WO, Apr. AL-WO. Rets. of Mar. AA 3005, 2967" },
                { number: 181, year: 1939, sr: "2572", description: "May. AL-WO, Jun. AL-WO" },
                { number: 182, year: 1939, sr: "2573", description: "Jul. AL-WO, Aug. AL-WO" },
                { number: 183, year: 1939, sr: "2574", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 184, year: 1939, sr: "2575", description: "Nov. AL-WO, Dec. AL-WO" },
                { number: 185, year: 1940, sr: "2576", description: "Jan. AL-WO, Feb. AL-WO. Rets. of Feb. SM 2284-2286, Feb. SO 2287-2295, 2302-2326" },
                { number: 186, year: 1940, sr: "2577", description: "Mar. AL-WO, Apr. AL-WO. Ret. of Mar. WI 3916" },
                { number: 187, year: 1940, sr: "2578", description: "May. AL-WO, Jun. AL-WO. Rets. of Jun. MO 7813, May. AL 576" },
                { number: 188, year: 1940, sr: "2579", description: "Jul. AL-WO, Aug. AL-WO. Rets. of Jul. QA 9328" },
                { number: 189, year: 1940, sr: "2580", description: "Sep. AL-WO, Oct. AL-WO" },
                { number: 190, year: 1940, sr: "2581", description: "Nov. AL-WO, Dec. AL-WO. Ret. of Dec. WI 16512" },
                { number: 191, year: 1941, sr: "2582", description: "Jan. AL-WO, Feb. AL-WO. Ret. of Jan. AL 52" },
                { number: 192, year: 1941, sr: "2583", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 193, year: 1941, sr: "2584", description: "May. AL-WO, Jun. AL-WO. Rets. of May. FR 6100, Jun. FR 7591" },
                { number: 194, year: 1941, sr: "2585", description: "Jul. AL-WO, Aug. AL-WO. Ret. of Jul. AL 8554" },
                { number: 195, year: 1941, sr: "2586", description: "Sep. AL-WO, Oct. AL-WO. Ret. of Oct. SM 14074" },
                { number: 196, year: 1941, sr: "2587", description: "Nov. AL-WO, Dec. AL-WO. Rets. of Nov. AL 14715, GA 15229, Dec. AL 16028, 16151" },
                { number: 197, year: 1942, sr: "2588", description: "Jan. AL-WO, Feb. AL-WO. Ret. of Feb. QA 2559" },
                { number: 198, year: 1942, sr: "2589", description: "Mar. AL-WO, Apr. AL-WO" },
                { number: 199, year: 1942, sr: "2590", description: "May. AL-WO, Jun. AL-WO" },
                { number: 200, year: 1942, sr: "2591", description: "Jul. AL-WO, Aug. AL-MO. Ret. of Jul. CH 9942" },
                { number: 201, year: 1942, sr: "2592", description: "Aug. PG-WO, Sep. AL-WO, Oct. AL-CR. Rets. of Sep. BA 12995-12996, Oct. AA 14699" },
                { number: 202, year: 1942, sr: "2593", description: "Oct. CE-WO, Nov. AL-MO" },
                { number: 203, year: 1942, sr: "2594", description: "Nov. PG-WO, Dec. AL-WO" },
                { number: 204, year: 1943, sr: "2595", description: "Jan. AL-WO, Feb. AL-MO" },
                { number: 205, year: 1943, sr: "2596", description: "Feb. PG-WO, Mar. AL-MO. Rets. of Mar. CE 3981, 3982" },
                { number: 206, year: 1943, sr: "2597", description: "Mar. PG-WO, Apr. AL-WO, May. AL-CA" },
                { number: 207, year: 1943, sr: "2598", description: "May. CR-WO, Jun. AL-WO" },
                { number: 208, year: 1943, sr: "2599", description: "Jul. AL-WO, Aug. AL-CE" },
                { number: 209, year: 1943, sr: "2600", description: "Aug. CH-WO, Sep. AL-WO, Oct. AL-FR. Rets. of Aug. WA 14524, Sep. AL 15013" },
                { number: 210, year: 1943, sr: "2601", description: "Oct. GA-WO, Nov. AL-WO, Dec. AL-WO" },
                { number: 211, year: 1944, sr: "2602", description: "Jan. AL-WO, Feb. AL-CH" },
                { number: 212, year: 1944, sr: "2603", description: "Feb. DO-WO, Mar. AL-WO, Apr. AL-DO. Ret. of Mar. AL 3100" },
                { number: 213, year: 1944, sr: "2604", description: "Apr. FR-WO, May. AL-WO, Jun. AL-AA" },
                { number: 214, year: 1944, sr: "2605", description: "Jun. BA-WO, Jul. AL-WA. Rets. of Jul. AL 10005, 10023, Jul. SM 11284" },
                { number: 215, year: 1944, sr: "2606", description: "Jul. WA-WO, Aug. AL-WO, Sep. AL-MO" },
                { number: 216, year: 1944, sr: "2607", description: "Sep. PG-WO, Oct. AL-WO, Nov. AL-GA" },
                { number: 217, year: 1944, sr: "2608", description: "Nov. HA-WO, Dec. AL-WO" },
                { number: 218, year: 1945, sr: "2609", description: "Jan. AL-WO, Feb. AL-TA" },
                { number: 219, year: 1945, sr: "2610", description: "Feb. WA-WO, Mar. AL-WO, Apr. AL-QA" },
                { number: 220, year: 1945, sr: "2611", description: "Apr. SM-WO, May. AL-WO, Jun. AL-MO" },
                { number: 221, year: 1945, sr: "2612", description: "Jun. PG-WO, Jul. AL-WO, Aug. AL-KE" },
                { number: 222, year: 1945, sr: "2613", description: "Aug. MO-WO, Sep. AL-WO, Oct. AL-DO" },
                { number: 223, year: 1945, sr: "2614", description: "Oct. FR-WO, Nov. AL-WO, Dec. AL-WO. Rets. of Oct. WO 16254, 16259, 16263, 1629?, 163??, 16286, 16359, Nov. WO 17787, 17791, 17788, 17790" },
                { number: 224, year: 1946, sr: "2615", description: "Jan. AL-WO, Feb. AL-DO" },
                { number: 225, year: 1946, sr: "2616", description: "Feb. FR-WO, Mar. AL-WO, Apr. AL-CA. Ret. of Feb. PG 2391" },
                { number: 226, year: 1946, sr: "2617", description: "Apr. CR-WO, May. AL-WO, Jun. AL-AA. Rets. of Apr. HA 5022, 5023" },
                { number: 227, year: 1946, sr: "2618", description: "Jun. BA-WO, Jul. AL-SO. Rets. of Jun. BA 7870, 7846, 7847, Jun. AA 9464" },
                { number: 228, year: 1946, sr: "2619", description: "Jul. TA-WO, Aug. AL-WO. Rets. of Aug. AL 11327, Aug. CE 11814, Aug. DO 564, Aug. TA 12768" },
                { number: 229, year: 1946, sr: "2620", description: "Sep. AL-WO, Oct. AL" },
                { number: 230, year: 1946, sr: "2621", description: "Oct. AA-WO, Nov. AL" },
                { number: 231, year: 1946, sr: "2622", description: "Nov. AA-WO, Dec. AL-WO" },
                { number: 232, year: 1947, sr: "2623", description: "Jan. AL-WO, Feb. AL-AA" },
                { number: 233, year: 1947, sr: "2624", description: "Feb. BA-WO, Mar. AL-BA. Rets. of Feb. BA 2738, 2741, 2742, 2746, 2750, 2756, 2757, 2761, 2766, 2768" },
                { number: 234, year: 1947, sr: "2625", description: "Mar. CV-WO, Apr. AL-CR" },
                { number: 235, year: 1947, sr: "2626", description: "Apr. CE-WO, May. AL-MO" },
                { number: 236, year: 1947, sr: "2627", description: "May. PG-WO, Jun. AL-WO" },
                { number: 237, year: 1947, sr: "2628", description: "Jul. AL-WO, Aug. AL-MO" },
                { number: 238, year: 1947, sr: "2629", description: "Aug. MO-WO, Sep. AL-WO. Ret. of Aug. WA 16758" },
                { number: 239, year: 1947, sr: "2630", description: "Oct. AL-WO, Nov. AL-GA" },
                { number: 240, year: 1947, sr: "2631", description: "Nov. HA-WO, Dec. AL-WO" },
                { number: 241, year: 1948, sr: "2632", description: "Jan. AL-WO, Feb. AL-FR" },
                { number: 242, year: 1948, sr: "2633", description: "Feb. FR-WO, Mar. AL-WA" },
                { number: 243, year: 1948, sr: "2634", description: "Mar. WI-WO, Apr. AL-WO, May. AL-GA" },
                { number: 244, year: 1948, sr: "2635", description: "May. HA-WO, Jun. AL-WO" },
                { number: 245, year: 1948, sr: "2636", description: "Jul. AL-WO, Aug. AL-GA" },
                { number: 246, year: 1948, sr: "2637", description: "Aug. HA-WO, Sep. AL-TA. Rets. of Aug. HA 150?3, Sep. AA 16528" },
                { number: 247, year: 1948, sr: "2638", description: "Sep. WA-WO, Oct. AL-WO, Nov. AL-CR" },
                { number: 248, year: 1948, sr: "2639", description: "Nov. CE-WO, Dec. AL-WO" },
                { number: 249, year: 1949, sr: "2640", description: "Jan. AL-WO, Feb. AL-CH" },
                { number: 250, year: 1949, sr: "2641", description: "Feb. DO-WO, Mar. AL-WA" },
                { number: 251, year: 1949, sr: "2642", description: "Mar. WI-WO, Apr. AL-WO, May. AL-MO. Rets. of Apr. FR 7597, 6640" },
                { number: 252, year: 1949, sr: "2643", description: "May. MO-WO, Jun. AL-WO, Jul. AL-AA" },
                { number: 253, year: 1949, sr: "2644", description: "Jul. BA-WO, Aug. AL-MO" },
                { number: 254, year: 1949, sr: "2645", description: "Aug. PG-WO, Sep. AL-WO, Oct. AL-AA" },
                { number: 255, year: 1949, sr: "2646", description: "Oct. BA-WO, Nov. AL-QA" },
                { number: 256, year: 1949, sr: "2647", description: "Nov. SM-WO, Dec. AL-WO. Rets. of Nov. SM 21120, 21121" },
                { number: 257, year: 1950, sr: "2648", description: "Jan. AL-WO, Feb. AL-HA" },
                { number: 258, year: 1950, sr: "2649", description: "Feb. HO-WO, Mar. AL-WO, Apr. AL" },
                { number: 259, year: 1950, sr: "2650", description: "Apr. AL-WO, May. AL-TA" },
                { number: 260, year: 1950, sr: "2651", description: "May. WA-WO, Jun. AL-WO, Jul. AL-FR" },
                { number: 261, year: 1950, sr: "2652", description: "Jul. GA-WO, Aug. AL-PG. Ret. of Aug. MO 14576" },
                { number: 262, year: 1950, sr: "2653", description: "Aug. QA-WO, Sep. AL-WO, Oct. AL-AA" },
                { number: 263, year: 1950, sr: "2654", description: "Oct. AA-WO, Nov. AL-MO" },
                { number: 264, year: 1950, sr: "2655", description: "Nov. MO-WO, Dec. AL-WO" },
                { number: 265, year: 1951, sr: "2656", description: "Jan. AL-WO, Feb. AL-HO" },
                { number: 266, year: 1951, sr: "2657", description: "Feb. KE-WO, Mar. AL-TA" },
                { number: 267, year: 1951, sr: "2658", description: "Mar. WA-WO, Apr. AL-WO, May. AL-CR" },
                { number: 268, year: 1951, sr: "2659", description: "May. CE-WO, Jun. AL-MO" },
                { number: 269, year: 1951, sr: "2660", description: "Jun. MO-WO" }
            ];

            this.recordsByNumber = {};

            for (const record of this.RECORDS) {
                this.recordsByNumber[record.number] = record;
            }

            // NEW, standardized shape for SM35-1 through 269 (the
            // whole series). dateRanges' split (per entry, since
            // coverage genuinely varies month to month within one
            // record) replaces the free-text `description` for
            // search purposes; note keeps the original MSA guide
            // text verbatim for display, unparsed, same as the
            // description field above. Only 1-72 have a real
            // archive.org scan (see archiveUrl() below) - 73-269
            // still get real dateRanges/split data, just no scan to
            // link to.
            //
            // Purely additive right now - not read by any live code
            // path yet. Generated from the RECORDS descriptions above
            // via simplifyCountyRanges() (see counties.js), then
            // independently re-checked two ways: every one of the 450
            // distinct year/month combinations across all 269 records
            // covers the full 23 counties once every record touching
            // that month is combined, and every county/month named
            // inside a "Rets. of"/"Ret. of"/"Certs. for" annotation
            // (specific certificate numbers, not tracked here) is
            // already accounted for by that month's own declared
            // range - except SM35-227's June, which named Anne
            // Arundel outside its declared Baltimore-Worcester range
            // and needed that county added in.
            //
            // Two records (2, 65) have trailing MSA guide prose that
            // isn't a county range at all (a certificate-number detail
            // for Somerset, a scan-condition note) - excluded from
            // dateRanges/split, kept in note like everything else.
            // Two more (223, 246) have illegible digits in their own
            // annotation prose (marked with ? in the original) -
            // preserved verbatim in note, not guessed at.
            this.STANDARD_RECORDS = [
        { number: 1, sr: "3116", dateRanges: [{ startYear: 1914, startMonth: 1, endYear: 1914, endMonth: 1, part: null }, { startYear: 1914, startMonth: 2, endYear: 1914, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Jan. AL-QA, WA-WO, QA-WA, Feb. AL-BA" },
        { number: 2, sr: "3117", dateRanges: [{ startYear: 1914, startMonth: 2, endYear: 1914, endMonth: 2, part: null, split: [{ start: "Calvert", end: "Worcester" }] }, { startYear: 1914, startMonth: 3, endYear: 1914, endMonth: 3, part: null }], note: "Feb. CV-WO, Mar. AL-WO. Certs. for Feb. WA-WO unsorted. Rets. of SO 4451-4464" },
        { number: 3, sr: "3118", dateRanges: [{ startYear: 1914, startMonth: 4, endYear: 1914, endMonth: 4, part: null }, { startYear: 1914, startMonth: 5, endYear: 1914, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Apr. AL-WO, May. AL-PG" },
        { number: 4, sr: "3119", dateRanges: [{ startYear: 1914, startMonth: 5, endYear: 1914, endMonth: 5, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1914, startMonth: 6, endYear: 1914, endMonth: 6, part: null }], note: "May. QA-WO, Jun. AL-WO" },
        { number: 5, sr: "3120", dateRanges: [{ startYear: 1914, startMonth: 7, endYear: 1914, endMonth: 7, part: null }, { startYear: 1914, startMonth: 8, endYear: 1914, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 6, sr: "3121", dateRanges: [{ startYear: 1914, startMonth: 9, endYear: 1914, endMonth: 9, part: null }, { startYear: 1914, startMonth: 10, endYear: 1914, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Queen Anne's" }] }], note: "Sep. AL-WO, Oct. AL-QA" },
        { number: 7, sr: "3122", dateRanges: [{ startYear: 1914, startMonth: 10, endYear: 1914, endMonth: 10, part: null, split: [{ start: "Saint Mary's", end: "Worcester" }] }, { startYear: 1914, startMonth: 11, endYear: 1914, endMonth: 11, part: null }], note: "Oct. SM-WO, Nov. AL-WO" },
        { number: 8, sr: "3123", dateRanges: [{ startYear: 1914, startMonth: 12, endYear: 1914, endMonth: 12, part: null }], note: "Dec. AL-WO" },
        { number: 9, sr: "3124", dateRanges: [{ startYear: 1915, startMonth: 1, endYear: 1915, endMonth: 1, part: null }, { startYear: 1915, startMonth: 2, endYear: 1915, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Jan. AL-WO, Feb. AL-FR" },
        { number: 10, sr: "3159", dateRanges: [{ startYear: 1915, startMonth: 2, endYear: 1915, endMonth: 2, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1915, startMonth: 3, endYear: 1915, endMonth: 3, part: null }, { startYear: 1915, startMonth: 4, endYear: 1915, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Feb. GA-WO, Mar. AL-WO, Apr. AL-BA" },
        { number: 11, sr: "3160", dateRanges: [{ startYear: 1915, startMonth: 4, endYear: 1915, endMonth: 4, part: null, split: [{ start: "Calvert", end: "Worcester" }] }, { startYear: 1915, startMonth: 5, endYear: 1915, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Queen Anne's" }] }], note: "Apr. CV-WO, May. AL-QA" },
        { number: 12, sr: "3161", dateRanges: [{ startYear: 1915, startMonth: 5, endYear: 1915, endMonth: 5, part: null, split: [{ start: "Saint Mary's", end: "Worcester" }] }, { startYear: 1915, startMonth: 6, endYear: 1915, endMonth: 6, part: null }], note: "May. SM-WO, Jun. AL-WO" },
        { number: 13, sr: "3162", dateRanges: [{ startYear: 1915, startMonth: 7, endYear: 1915, endMonth: 7, part: null }, { startYear: 1915, startMonth: 8, endYear: 1915, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Dorchester" }] }], note: "Jul. AL-WO, Aug. AL-DO" },
        { number: 14, sr: "3163", dateRanges: [{ startYear: 1915, startMonth: 8, endYear: 1915, endMonth: 8, part: null, split: [{ start: "Frederick", end: "Worcester" }] }, { startYear: 1915, startMonth: 9, endYear: 1915, endMonth: 9, part: null }, { startYear: 1915, startMonth: 10, endYear: 1915, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Aug. FR-WO, Sep. AL-WO, Oct. AL-BA" },
        { number: 15, sr: "3164", dateRanges: [{ startYear: 1915, startMonth: 10, endYear: 1915, endMonth: 10, part: null, split: [{ start: "Calvert", end: "Worcester" }] }, { startYear: 1915, startMonth: 11, endYear: 1915, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Queen Anne's" }] }], note: "Oct. CV-WO, Nov. AL-QA" },
        { number: 16, sr: "3165", dateRanges: [{ startYear: 1915, startMonth: 11, endYear: 1915, endMonth: 11, part: null, split: [{ start: "Saint Mary's", end: "Worcester" }] }, { startYear: 1915, startMonth: 12, endYear: 1915, endMonth: 12, part: null }], note: "Nov. SM-WO, Dec. AL-WO" },
        { number: 17, sr: "3166", dateRanges: [{ startYear: 1916, startMonth: 1, endYear: 1916, endMonth: 1, part: null }, { startYear: 1916, startMonth: 2, endYear: 1916, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Jan. AL-WO, Feb. AL-FR" },
        { number: 18, sr: "3167", dateRanges: [{ startYear: 1916, startMonth: 2, endYear: 1916, endMonth: 2, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1916, startMonth: 3, endYear: 1916, endMonth: 3, part: null }], note: "Feb. GA-WO, Mar. AL-WO" },
        { number: 19, sr: "3168", dateRanges: [{ startYear: 1916, startMonth: 4, endYear: 1916, endMonth: 4, part: null }, { startYear: 1916, startMonth: 5, endYear: 1916, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Apr. AL-WO, May. AL-FR" },
        { number: 20, sr: "3169", dateRanges: [{ startYear: 1916, startMonth: 5, endYear: 1916, endMonth: 5, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1916, startMonth: 6, endYear: 1916, endMonth: 6, part: null }], note: "May. GA-WO, Jun. AL-WO" },
        { number: 21, sr: "3170", dateRanges: [{ startYear: 1916, startMonth: 7, endYear: 1916, endMonth: 7, part: null }, { startYear: 1916, startMonth: 8, endYear: 1916, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Jul. AL-WO, Aug. AL-BA" },
        { number: 22, sr: "3272", dateRanges: [{ startYear: 1916, startMonth: 8, endYear: 1916, endMonth: 8, part: null, split: [{ start: "Calvert", end: "Worcester" }] }, { startYear: 1916, startMonth: 9, endYear: 1916, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Aug. CV-WO, Sep. AL-KE" },
        { number: 23, sr: "3273", dateRanges: [{ startYear: 1916, startMonth: 9, endYear: 1916, endMonth: 9, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1916, startMonth: 10, endYear: 1916, endMonth: 10, part: null }, { startYear: 1916, startMonth: 11, endYear: 1916, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Sep. MO-WO, Oct. AL-WO, Nov. AL-FR" },
        { number: 24, sr: "3274", dateRanges: [{ startYear: 1916, startMonth: 11, endYear: 1916, endMonth: 11, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1916, startMonth: 12, endYear: 1916, endMonth: 12, part: null }], note: "Nov. GA-WO, Dec. AL-WO" },
        { number: 25, sr: "3275", dateRanges: [{ startYear: 1917, startMonth: 1, endYear: 1917, endMonth: 1, part: null }, { startYear: 1917, startMonth: 2, endYear: 1917, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Jan. AL-WO, Feb. AL-FR" },
        { number: 26, sr: "3276", dateRanges: [{ startYear: 1917, startMonth: 2, endYear: 1917, endMonth: 2, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1917, startMonth: 3, endYear: 1917, endMonth: 3, part: null }], note: "Feb. GA-WO, Mar. AL-WO" },
        { number: 27, sr: "3277", dateRanges: [{ startYear: 1917, startMonth: 4, endYear: 1917, endMonth: 4, part: null }, { startYear: 1917, startMonth: 5, endYear: 1917, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Apr. AL-WO, May. AL-FR" },
        { number: 28, sr: "3278", dateRanges: [{ startYear: 1917, startMonth: 5, endYear: 1917, endMonth: 5, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1917, startMonth: 6, endYear: 1917, endMonth: 6, part: null }], note: "May. GA-WO, Jun. AL-WO" },
        { number: 29, sr: "3279", dateRanges: [{ startYear: 1917, startMonth: 7, endYear: 1917, endMonth: 7, part: null }, { startYear: 1917, startMonth: 8, endYear: 1917, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Jul. AL-WO, Aug. AL-FR" },
        { number: 30, sr: "3280", dateRanges: [{ startYear: 1917, startMonth: 8, endYear: 1917, endMonth: 8, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1917, startMonth: 9, endYear: 1917, endMonth: 9, part: null }], note: "Aug. GA-WO, Sep. AL-WO" },
        { number: 31, sr: "3281", dateRanges: [{ startYear: 1917, startMonth: 10, endYear: 1917, endMonth: 10, part: null }, { startYear: 1917, startMonth: 11, endYear: 1917, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Oct. AL-WO, Nov. AL-KE" },
        { number: 32, sr: "3282", dateRanges: [{ startYear: 1917, startMonth: 11, endYear: 1917, endMonth: 11, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1917, startMonth: 12, endYear: 1917, endMonth: 12, part: null }], note: "Nov. MO-WO, Dec. AL-WO" },
        { number: 33, sr: "3676-A", dateRanges: [{ startYear: 1918, startMonth: 1, endYear: 1918, endMonth: 1, part: null }, { startYear: 1918, startMonth: 2, endYear: 1918, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Jan. AL-WO, Feb. AL-KE" },
        { number: 34, sr: "3677", dateRanges: [{ startYear: 1918, startMonth: 2, endYear: 1918, endMonth: 2, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1918, startMonth: 3, endYear: 1918, endMonth: 3, part: null }, { startYear: 1918, startMonth: 4, endYear: 1918, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Anne Arundel" }] }], note: "Feb. MO-WO, Mar. AL-WO, Apr. AL-AA" },
        { number: 35, sr: "3678", dateRanges: [{ startYear: 1918, startMonth: 4, endYear: 1918, endMonth: 4, part: null, split: [{ start: "Anne Arundel", end: "Worcester" }] }, { startYear: 1918, startMonth: 5, endYear: 1918, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Apr. AA-WO, May. AL-BA" },
        { number: 36, sr: "3679", dateRanges: [{ startYear: 1918, startMonth: 5, endYear: 1918, endMonth: 5, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1918, startMonth: 6, endYear: 1918, endMonth: 6, part: null }], note: "May. BA-WO, Jun. AL-WO" },
        { number: 37, sr: "3680", dateRanges: [{ startYear: 1918, startMonth: 7, endYear: 1918, endMonth: 7, part: null }, { startYear: 1918, startMonth: 8, endYear: 1918, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Calvert" }] }], note: "Jul. AL-WO, Aug. AL-CV" },
        { number: 38, sr: "3681", dateRanges: [{ startYear: 1918, startMonth: 8, endYear: 1918, endMonth: 8, part: null, split: [{ start: "Caroline", end: "Worcester" }] }, { startYear: 1918, startMonth: 9, endYear: 1918, endMonth: 9, part: null }], note: "Aug. CA-WO, Sep. AL-WO" },
        { number: 39, sr: "3682", dateRanges: [{ startYear: 1918, startMonth: 10, endYear: 1918, endMonth: 10, part: null }], note: "Oct. AL-WO" },
        { number: 40, sr: "3683", dateRanges: [{ startYear: 1918, startMonth: 11, endYear: 1918, endMonth: 11, part: null }, { startYear: 1918, startMonth: 12, endYear: 1918, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 41, sr: "3684", dateRanges: [{ startYear: 1919, startMonth: 1, endYear: 1919, endMonth: 1, part: null }, { startYear: 1919, startMonth: 2, endYear: 1919, endMonth: 2, part: null }, { startYear: 1919, startMonth: 3, endYear: 1919, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Jan. AL-WO, Feb. AL-WO, Mar. AL-BA" },
        { number: 42, sr: "3685", dateRanges: [{ startYear: 1919, startMonth: 3, endYear: 1919, endMonth: 3, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1919, startMonth: 4, endYear: 1919, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Mar. BA-WO, Apr. AL-CR" },
        { number: 43, sr: "3686", dateRanges: [{ startYear: 1919, startMonth: 4, endYear: 1919, endMonth: 4, part: null, split: [{ start: "Cecil", end: "Worcester" }] }, { startYear: 1919, startMonth: 5, endYear: 1919, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Apr. CE-WO, May. AL-MO" },
        { number: 44, sr: "3687", dateRanges: [{ startYear: 1919, startMonth: 5, endYear: 1919, endMonth: 5, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1919, startMonth: 6, endYear: 1919, endMonth: 6, part: null }], note: "May. PG-WO, Jun. AL-WO" },
        { number: 45, sr: "3688", dateRanges: [{ startYear: 1919, startMonth: 7, endYear: 1919, endMonth: 7, part: null }, { startYear: 1919, startMonth: 8, endYear: 1919, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jul. AL-WO, Aug. AL-MO" },
        { number: 46, sr: "3689", dateRanges: [{ startYear: 1919, startMonth: 8, endYear: 1919, endMonth: 8, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1919, startMonth: 9, endYear: 1919, endMonth: 9, part: null }], note: "Aug. PG-WO, Sep. AL-WO" },
        { number: 47, sr: "3690", dateRanges: [{ startYear: 1919, startMonth: 10, endYear: 1919, endMonth: 10, part: null }, { startYear: 1919, startMonth: 11, endYear: 1919, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Oct. AL-WO, Nov. AL-KE" },
        { number: 48, sr: "3691", dateRanges: [{ startYear: 1919, startMonth: 11, endYear: 1919, endMonth: 11, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1919, startMonth: 12, endYear: 1919, endMonth: 12, part: null }], note: "Nov. MO-WO, Dec. AL-WO" },
        { number: 49, sr: "3692", dateRanges: [{ startYear: 1920, startMonth: 1, endYear: 1920, endMonth: 1, part: null }, { startYear: 1920, startMonth: 2, endYear: 1920, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Jan. AL-WO, Feb. AL-CR" },
        { number: 50, sr: "3693", dateRanges: [{ startYear: 1920, startMonth: 2, endYear: 1920, endMonth: 2, part: null, split: [{ start: "Cecil", end: "Worcester" }] }, { startYear: 1920, startMonth: 3, endYear: 1920, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Feb. CE-WO, Mar. AL-KE" },
        { number: 51, sr: "3694", dateRanges: [{ startYear: 1920, startMonth: 3, endYear: 1920, endMonth: 3, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1920, startMonth: 4, endYear: 1920, endMonth: 4, part: null }, { startYear: 1920, startMonth: 5, endYear: 1920, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Mar. MO-WO, Apr. AL-WO, May. AL-CA" },
        { number: 52, sr: "3695", dateRanges: [{ startYear: 1920, startMonth: 5, endYear: 1920, endMonth: 5, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1920, startMonth: 6, endYear: 1920, endMonth: 6, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "May. CR-WO, Jun. AL-KE" },
        { number: 53, sr: "3696", dateRanges: [{ startYear: 1920, startMonth: 6, endYear: 1920, endMonth: 6, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1920, startMonth: 7, endYear: 1920, endMonth: 7, part: null }, { startYear: 1920, startMonth: 8, endYear: 1920, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Jun. MO-WO, Jul. AL-WO, Aug. AL-BA" },
        { number: 54, sr: "3697", dateRanges: [{ startYear: 1920, startMonth: 8, endYear: 1920, endMonth: 8, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1920, startMonth: 9, endYear: 1920, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Aug. BA-WO, Sep. AL-MO" },
        { number: 55, sr: "3698", dateRanges: [{ startYear: 1920, startMonth: 9, endYear: 1920, endMonth: 9, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1920, startMonth: 10, endYear: 1920, endMonth: 10, part: null }, { startYear: 1920, startMonth: 11, endYear: 1920, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Sep. PG-WO, Oct. AL-WO, Nov. AL-MO" },
        { number: 56, sr: "3699", dateRanges: [{ startYear: 1920, startMonth: 11, endYear: 1920, endMonth: 11, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1920, startMonth: 12, endYear: 1920, endMonth: 12, part: null }], note: "Nov. PG-WO, Dec. AL-WO" },
        { number: 57, sr: "3700", dateRanges: [{ startYear: 1921, startMonth: 1, endYear: 1921, endMonth: 1, part: null }, { startYear: 1921, startMonth: 2, endYear: 1921, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Jan. AL-WO, Feb. AL-KE" },
        { number: 58, sr: "3701", dateRanges: [{ startYear: 1921, startMonth: 2, endYear: 1921, endMonth: 2, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1921, startMonth: 3, endYear: 1921, endMonth: 3, part: null }, { startYear: 1921, startMonth: 4, endYear: 1921, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Feb. MO-WO, Mar. AL-WO, Apr. AL-BA" },
        { number: 59, sr: "3702", dateRanges: [{ startYear: 1921, startMonth: 4, endYear: 1921, endMonth: 4, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1921, startMonth: 5, endYear: 1921, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Apr. BA-WO, May. AL-PG" },
        { number: 60, sr: "3703", dateRanges: [{ startYear: 1921, startMonth: 5, endYear: 1921, endMonth: 5, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1921, startMonth: 6, endYear: 1921, endMonth: 6, part: null }, { startYear: 1921, startMonth: 7, endYear: 1921, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "May. QA-WO, Jun. AL-WO, Jul. AL-BA" },
        { number: 61, sr: "3704", dateRanges: [{ startYear: 1921, startMonth: 7, endYear: 1921, endMonth: 7, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1921, startMonth: 8, endYear: 1921, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Jul. BA-WO, Aug. AL-PG" },
        { number: 62, sr: "3705", dateRanges: [{ startYear: 1921, startMonth: 8, endYear: 1921, endMonth: 8, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1921, startMonth: 9, endYear: 1921, endMonth: 9, part: null }, { startYear: 1921, startMonth: 10, endYear: 1921, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Charles" }] }], note: "Aug. PG-WO, Sep. AL-WO, Oct. AL-CH" },
        { number: 63, sr: "3706", dateRanges: [{ startYear: 1921, startMonth: 10, endYear: 1921, endMonth: 10, part: null, split: [{ start: "Dorchester", end: "Worcester" }] }, { startYear: 1921, startMonth: 11, endYear: 1921, endMonth: 11, part: null }, { startYear: 1921, startMonth: 12, endYear: 1921, endMonth: 12, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Oct. DO-WO, Nov. AL-WO, Dec. AL-BA" },
        { number: 64, sr: "3707", dateRanges: [{ startYear: 1921, startMonth: 12, endYear: 1921, endMonth: 12, part: null, split: [{ start: "Calvert", end: "Worcester" }] }], note: "Dec. CV-WO" },
        { number: 65, sr: "3708", dateRanges: [{ startYear: 1922, startMonth: 1, endYear: 1922, endMonth: 1, part: null, split: [{ start: "Allegany", end: "Wicomico" }] }], note: "Jan. AL-WI. Fogged at end" },
        { number: 66, sr: "3709", dateRanges: [{ startYear: 1922, startMonth: 1, endYear: 1922, endMonth: 1, part: null, split: [{ start: "Worcester", end: "Worcester" }] }, { startYear: 1922, startMonth: 2, endYear: 1922, endMonth: 2, part: null }, { startYear: 1922, startMonth: 3, endYear: 1922, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Garrett" }] }], note: "Jan. WO, Feb. AL-WO, Mar. AL-GA" },
        { number: 67, sr: "3710", dateRanges: [{ startYear: 1922, startMonth: 3, endYear: 1922, endMonth: 3, part: null, split: [{ start: "Harford", end: "Worcester" }] }, { startYear: 1922, startMonth: 4, endYear: 1922, endMonth: 4, part: null }, { startYear: 1922, startMonth: 5, endYear: 1922, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Mar. HA-WO, Apr. AL-WO, May. AL-FR" },
        { number: 68, sr: "3711", dateRanges: [{ startYear: 1922, startMonth: 5, endYear: 1922, endMonth: 5, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1922, startMonth: 6, endYear: 1922, endMonth: 6, part: null }, { startYear: 1922, startMonth: 7, endYear: 1922, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "May. GA-WO, Jun. AL-WO, Jul. AL-CA" },
        { number: 69, sr: "3712", dateRanges: [{ startYear: 1922, startMonth: 7, endYear: 1922, endMonth: 7, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1922, startMonth: 8, endYear: 1922, endMonth: 8, part: null }], note: "Jul. CR-WO, Aug. AL-WO" },
        { number: 70, sr: "3713", dateRanges: [{ startYear: 1922, startMonth: 9, endYear: 1922, endMonth: 9, part: null }, { startYear: 1922, startMonth: 10, endYear: 1922, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Sep. AL-WO, Oct. AL-MO" },
        { number: 71, sr: "3714", dateRanges: [{ startYear: 1922, startMonth: 10, endYear: 1922, endMonth: 10, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1922, startMonth: 11, endYear: 1922, endMonth: 11, part: null }, { startYear: 1922, startMonth: 12, endYear: 1922, endMonth: 12, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Oct. PG-WO, Nov. AL-WO, Dec. AL-CA" },
        { number: 72, sr: "3715", dateRanges: [{ startYear: 1922, startMonth: 12, endYear: 1922, endMonth: 12, part: null, split: [{ start: "Carroll", end: "Worcester" }] }], note: "Dec. CR-WO" },
        { number: 73, sr: "3716", dateRanges: [{ startYear: 1923, startMonth: 1, endYear: 1923, endMonth: 1, part: null }], note: "Jan. AL-WO" },
        { number: 74, sr: "3717", dateRanges: [{ startYear: 1923, startMonth: 2, endYear: 1923, endMonth: 2, part: null }, { startYear: 1923, startMonth: 3, endYear: 1923, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Washington" }] }], note: "Feb. CR-KE, AL-CA, MO-WO, Mar. AL-WA. Fogged at end" },
        { number: 75, sr: "3718", dateRanges: [{ startYear: 1923, startMonth: 3, endYear: 1923, endMonth: 3, part: null, split: [{ start: "Wicomico", end: "Worcester" }] }, { startYear: 1923, startMonth: 4, endYear: 1923, endMonth: 4, part: null }, { startYear: 1923, startMonth: 5, endYear: 1923, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Mar. WI-WO, Apr. AL-WO, May. AL-PG" },
        { number: 76, sr: "3719", dateRanges: [{ startYear: 1923, startMonth: 5, endYear: 1923, endMonth: 5, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1923, startMonth: 6, endYear: 1923, endMonth: 6, part: null }, { startYear: 1923, startMonth: 7, endYear: 1923, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Harford" }] }], note: "May. QA-WO, Jun. AL-WO, Jul. AL-HA" },
        { number: 77, sr: "3720", dateRanges: [{ startYear: 1923, startMonth: 7, endYear: 1923, endMonth: 7, part: null, split: [{ start: "Howard", end: "Worcester" }] }, { startYear: 1923, startMonth: 8, endYear: 1923, endMonth: 8, part: null }, { startYear: 1923, startMonth: 9, endYear: 1923, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Jul. HO-WO, Aug. AL-WO, Sep. AL-CA" },
        { number: 78, sr: "3721", dateRanges: [{ startYear: 1923, startMonth: 9, endYear: 1923, endMonth: 9, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1923, startMonth: 10, endYear: 1923, endMonth: 10, part: null }, { startYear: 1923, startMonth: 11, endYear: 1923, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Sep. CR-WO, Oct. AL-WO, Nov. AL-CR" },
        { number: 79, sr: "3722", dateRanges: [{ startYear: 1923, startMonth: 11, endYear: 1923, endMonth: 11, part: null, split: [{ start: "Cecil", end: "Worcester" }] }, { startYear: 1923, startMonth: 12, endYear: 1923, endMonth: 12, part: null }], note: "Nov. CE-WO, Dec. AL-WO" },
        { number: 80, sr: "3723", dateRanges: [{ startYear: 1924, startMonth: 1, endYear: 1924, endMonth: 1, part: null }, { startYear: 1924, startMonth: 2, endYear: 1924, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Howard" }] }], note: "Jan. AL-WO, Feb. AL-HO" },
        { number: 81, sr: "3724", dateRanges: [{ startYear: 1924, startMonth: 2, endYear: 1924, endMonth: 2, part: null, split: [{ start: "Kent", end: "Worcester" }] }, { startYear: 1924, startMonth: 3, endYear: 1924, endMonth: 3, part: null }, { startYear: 1924, startMonth: 4, endYear: 1924, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Feb. KE-WO, Mar. AL-WO, Apr. AL-CA" },
        { number: 82, sr: "3725", dateRanges: [{ startYear: 1924, startMonth: 4, endYear: 1924, endMonth: 4, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1924, startMonth: 5, endYear: 1924, endMonth: 5, part: null }, { startYear: 1924, startMonth: 6, endYear: 1924, endMonth: 6, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Apr. CR-WO, May. AL-WO, Jun. AL-CA" },
        { number: 83, sr: "3726", dateRanges: [{ startYear: 1924, startMonth: 6, endYear: 1924, endMonth: 6, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1924, startMonth: 7, endYear: 1924, endMonth: 7, part: null }, { startYear: 1924, startMonth: 8, endYear: 1924, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Allegany" }] }], note: "Jun. CR-WO, Jul. AL-WO, Aug. AL" },
        { number: 84, sr: "3727", dateRanges: [{ startYear: 1924, startMonth: 8, endYear: 1924, endMonth: 8, part: null, split: [{ start: "Anne Arundel", end: "Worcester" }] }, { startYear: 1924, startMonth: 9, endYear: 1924, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Aug. AA-WO, Sep. AL-MO" },
        { number: 85, sr: "3728", dateRanges: [{ startYear: 1924, startMonth: 9, endYear: 1924, endMonth: 9, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1924, startMonth: 10, endYear: 1924, endMonth: 10, part: null }, { startYear: 1924, startMonth: 11, endYear: 1924, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Sep. PG-WO, Oct. AL-WO, Nov. AL-KE" },
        { number: 86, sr: "3729", dateRanges: [{ startYear: 1924, startMonth: 11, endYear: 1924, endMonth: 11, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1924, startMonth: 12, endYear: 1924, endMonth: 12, part: null }], note: "Nov. MO-WO, Dec. AL-WO" },
        { number: 87, sr: "3730", dateRanges: [{ startYear: 1925, startMonth: 1, endYear: 1925, endMonth: 1, part: null }, { startYear: 1925, startMonth: 2, endYear: 1925, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Washington" }] }], note: "Jan. AL-WO, Feb. AL-WA" },
        { number: 88, sr: "3731", dateRanges: [{ startYear: 1925, startMonth: 2, endYear: 1925, endMonth: 2, part: null, split: [{ start: "Wicomico", end: "Worcester" }] }, { startYear: 1925, startMonth: 3, endYear: 1925, endMonth: 3, part: null }, { startYear: 1925, startMonth: 4, endYear: 1925, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Feb. WI-WO, Mar. AL-WO, Apr. AL-CA" },
        { number: 89, sr: "3732", dateRanges: [{ startYear: 1925, startMonth: 4, endYear: 1925, endMonth: 4, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1925, startMonth: 5, endYear: 1925, endMonth: 5, part: null }], note: "Apr. CR-WO, May. AL-WO" },
        { number: 90, sr: "3733", dateRanges: [{ startYear: 1925, startMonth: 6, endYear: 1925, endMonth: 6, part: null }, { startYear: 1925, startMonth: 7, endYear: 1925, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Jun. AL-WO, Jul. AL-PG" },
        { number: 91, sr: "3734", dateRanges: [{ startYear: 1925, startMonth: 7, endYear: 1925, endMonth: 7, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1925, startMonth: 8, endYear: 1925, endMonth: 8, part: null }, { startYear: 1925, startMonth: 9, endYear: 1925, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Jul. QA-WO, Aug. AL-WO, Sep. AL-CA" },
        { number: 92, sr: "3735", dateRanges: [{ startYear: 1925, startMonth: 9, endYear: 1925, endMonth: 9, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1925, startMonth: 10, endYear: 1925, endMonth: 10, part: null }], note: "Sep. CR-WO, Oct. AL-WO" },
        { number: 93, sr: "3736", dateRanges: [{ startYear: 1925, startMonth: 11, endYear: 1925, endMonth: 11, part: null }, { startYear: 1925, startMonth: 12, endYear: 1925, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 94, sr: "3737", dateRanges: [{ startYear: 1926, startMonth: 1, endYear: 1926, endMonth: 1, part: null }, { startYear: 1926, startMonth: 2, endYear: 1926, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jan. AL-WO, Feb. AL-MO" },
        { number: 95, sr: "3738", dateRanges: [{ startYear: 1926, startMonth: 2, endYear: 1926, endMonth: 2, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1926, startMonth: 3, endYear: 1926, endMonth: 3, part: null }, { startYear: 1926, startMonth: 4, endYear: 1926, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Feb. PG-WO, Mar. AL-WO, Apr. AL-CR" },
        { number: 96, sr: "3739", dateRanges: [{ startYear: 1926, startMonth: 4, endYear: 1926, endMonth: 4, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1926, startMonth: 5, endYear: 1926, endMonth: 5, part: null }], note: "Apr. CR-WO, May. AL-WO" },
        { number: 97, sr: "3740", dateRanges: [{ startYear: 1926, startMonth: 6, endYear: 1926, endMonth: 6, part: null }, { startYear: 1926, startMonth: 7, endYear: 1926, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jun. AL-WO, Jul. AL-MO" },
        { number: 98, sr: "3741", dateRanges: [{ startYear: 1926, startMonth: 7, endYear: 1926, endMonth: 7, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1926, startMonth: 8, endYear: 1926, endMonth: 8, part: null }, { startYear: 1926, startMonth: 9, endYear: 1926, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Jul. PG-WO, Aug. AL-WO, Sep. AL-CA" },
        { number: 99, sr: "3742", dateRanges: [{ startYear: 1926, startMonth: 9, endYear: 1926, endMonth: 9, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1926, startMonth: 10, endYear: 1926, endMonth: 10, part: null }], note: "Sep. CR-WO, Oct. AL-WO" },
        { number: 100, sr: "3743", dateRanges: [{ startYear: 1926, startMonth: 11, endYear: 1926, endMonth: 11, part: null }, { startYear: 1926, startMonth: 12, endYear: 1926, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 101, sr: "3744", dateRanges: [{ startYear: 1927, startMonth: 1, endYear: 1927, endMonth: 1, part: null }, { startYear: 1927, startMonth: 2, endYear: 1927, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Jan. AL-WO, Feb. AL-CA" },
        { number: 102, sr: "3745", dateRanges: [{ startYear: 1927, startMonth: 2, endYear: 1927, endMonth: 2, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1927, startMonth: 3, endYear: 1927, endMonth: 3, part: null }], note: "Feb. CR-WO, Mar. AL-WO" },
        { number: 103, sr: "3746", dateRanges: [{ startYear: 1927, startMonth: 4, endYear: 1927, endMonth: 4, part: null }, { startYear: 1927, startMonth: 5, endYear: 1927, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Apr. AL-WO, May. AL-MO" },
        { number: 104, sr: "3747", dateRanges: [{ startYear: 1927, startMonth: 5, endYear: 1927, endMonth: 5, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1927, startMonth: 6, endYear: 1927, endMonth: 6, part: null }, { startYear: 1927, startMonth: 7, endYear: 1927, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "May. PG-WO, Jun. AL-WO, Jul. AL-BA" },
        { number: 105, sr: "3748", dateRanges: [{ startYear: 1927, startMonth: 7, endYear: 1927, endMonth: 7, part: null, split: [{ start: "Calvert", end: "Worcester" }] }, { startYear: 1927, startMonth: 8, endYear: 1927, endMonth: 8, part: null }], note: "Jul. CV-WO, Aug. AL-WO" },
        { number: 106, sr: "3749", dateRanges: [{ startYear: 1927, startMonth: 9, endYear: 1927, endMonth: 9, part: null }, { startYear: 1927, startMonth: 10, endYear: 1927, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Sep. AL-WO, Oct. AL-PG" },
        { number: 107, sr: "3750", dateRanges: [{ startYear: 1927, startMonth: 10, endYear: 1927, endMonth: 10, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1927, startMonth: 11, endYear: 1927, endMonth: 11, part: null }, { startYear: 1927, startMonth: 12, endYear: 1927, endMonth: 12, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Oct. QA-WO, Nov. AL-WO, Dec. AL-BA" },
        { number: 108, sr: "3751", dateRanges: [{ startYear: 1927, startMonth: 12, endYear: 1927, endMonth: 12, part: null, split: [{ start: "Calvert", end: "Worcester" }] }], note: "Dec. CV-WO" },
        { number: 109, sr: "3752", dateRanges: [{ startYear: 1928, startMonth: 1, endYear: 1928, endMonth: 1, part: null }], note: "Jan. AL-WO" },
        { number: 110, sr: "3753", dateRanges: [{ startYear: 1928, startMonth: 2, endYear: 1928, endMonth: 2, part: null }, { startYear: 1928, startMonth: 3, endYear: 1928, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Feb. AL-WO, Mar. AL-PG" },
        { number: 111, sr: "3754", dateRanges: [{ startYear: 1928, startMonth: 3, endYear: 1928, endMonth: 3, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1928, startMonth: 4, endYear: 1928, endMonth: 4, part: null }, { startYear: 1928, startMonth: 5, endYear: 1928, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Mar. QA-WO, Apr. AL-WO, May. AL-BA" },
        { number: 112, sr: "3755", dateRanges: [{ startYear: 1928, startMonth: 5, endYear: 1928, endMonth: 5, part: null, split: [{ start: "Calvert", end: "Worcester" }] }, { startYear: 1928, startMonth: 6, endYear: 1928, endMonth: 6, part: null }], note: "May. CV-WO, Jun. AL-WO" },
        { number: 113, sr: "3756", dateRanges: [{ startYear: 1928, startMonth: 7, endYear: 1928, endMonth: 7, part: null }, { startYear: 1928, startMonth: 8, endYear: 1928, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jul. AL-WO, Aug. AL-MO" },
        { number: 114, sr: "3757", dateRanges: [{ startYear: 1928, startMonth: 8, endYear: 1928, endMonth: 8, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1928, startMonth: 9, endYear: 1928, endMonth: 9, part: null }, { startYear: 1928, startMonth: 10, endYear: 1928, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Aug. PG-WO, Sep. AL-WO, Oct. AL-CA" },
        { number: 115, sr: "3758", dateRanges: [{ startYear: 1928, startMonth: 10, endYear: 1928, endMonth: 10, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1928, startMonth: 11, endYear: 1928, endMonth: 11, part: null }], note: "Oct. CR-WO, Nov. AL-WO" },
        { number: 116, sr: "3759", dateRanges: [{ startYear: 1928, startMonth: 12, endYear: 1928, endMonth: 12, part: null }], note: "Dec. AL-WO" },
        { number: 117, sr: "3760", dateRanges: [{ startYear: 1929, startMonth: 1, endYear: 1929, endMonth: 1, part: null }, { startYear: 1929, startMonth: 2, endYear: 1929, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Jan. AL-WO, Feb. AL-PG" },
        { number: 118, sr: "3761", dateRanges: [{ startYear: 1929, startMonth: 2, endYear: 1929, endMonth: 2, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1929, startMonth: 3, endYear: 1929, endMonth: 3, part: null }, { startYear: 1929, startMonth: 4, endYear: 1929, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Feb. QA-WO, Mar. AL-WO, Apr. AL-CA" },
        { number: 119, sr: "3762", dateRanges: [{ startYear: 1929, startMonth: 4, endYear: 1929, endMonth: 4, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1929, startMonth: 5, endYear: 1929, endMonth: 5, part: null }], note: "Apr. CR-WO, May. AL-WO" },
        { number: 120, sr: "3763", dateRanges: [{ startYear: 1929, startMonth: 6, endYear: 1929, endMonth: 6, part: null }, { startYear: 1929, startMonth: 7, endYear: 1929, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jun. AL-WO, Jul. AL-MO" },
        { number: 121, sr: "3764", dateRanges: [{ startYear: 1929, startMonth: 7, endYear: 1929, endMonth: 7, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1929, startMonth: 8, endYear: 1929, endMonth: 8, part: null }, { startYear: 1929, startMonth: 9, endYear: 1929, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Jul. PG-WO, Aug. AL-WO, Sep. AL-CA" },
        { number: 122, sr: "3765", dateRanges: [{ startYear: 1929, startMonth: 9, endYear: 1929, endMonth: 9, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1929, startMonth: 10, endYear: 1929, endMonth: 10, part: null }, { startYear: 1929, startMonth: 11, endYear: 1929, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Sep. CR-WO, Oct. AL-WO, Nov. AL-CA" },
        { number: 123, sr: "3766", dateRanges: [{ startYear: 1929, startMonth: 11, endYear: 1929, endMonth: 11, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1929, startMonth: 12, endYear: 1929, endMonth: 12, part: null }], note: "Nov. CR-WO, Dec. AL-WO" },
        { number: 124, sr: "3767", dateRanges: [{ startYear: 1930, startMonth: 1, endYear: 1930, endMonth: 1, part: null }, { startYear: 1930, startMonth: 2, endYear: 1930, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jan. AL-WO, Feb. AL-MO" },
        { number: 125, sr: "3768", dateRanges: [{ startYear: 1930, startMonth: 2, endYear: 1930, endMonth: 2, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1930, startMonth: 3, endYear: 1930, endMonth: 3, part: null }, { startYear: 1930, startMonth: 4, endYear: 1930, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Feb. PG-WO, Mar. AL-WO, Apr. AL-CA" },
        { number: 126, sr: "3769", dateRanges: [{ startYear: 1930, startMonth: 4, endYear: 1930, endMonth: 4, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1930, startMonth: 5, endYear: 1930, endMonth: 5, part: null }, { startYear: 1930, startMonth: 6, endYear: 1930, endMonth: 6, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Apr. CR-WO, May. AL-WO, Jun. AL-CA" },
        { number: 127, sr: "3770", dateRanges: [{ startYear: 1930, startMonth: 6, endYear: 1930, endMonth: 6, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1930, startMonth: 7, endYear: 1930, endMonth: 7, part: null }], note: "Jun. CR-WO, Jul. AL-WO" },
        { number: 128, sr: "3771", dateRanges: [{ startYear: 1930, startMonth: 8, endYear: 1930, endMonth: 8, part: null }, { startYear: 1930, startMonth: 9, endYear: 1930, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Aug. AL-WO, Sep. AL-MO" },
        { number: 129, sr: "3772", dateRanges: [{ startYear: 1930, startMonth: 9, endYear: 1930, endMonth: 9, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1930, startMonth: 10, endYear: 1930, endMonth: 10, part: null }, { startYear: 1930, startMonth: 11, endYear: 1930, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Sep. PG-WO, Oct. AL-WO, Nov. AL-CA" },
        { number: 130, sr: "3773", dateRanges: [{ startYear: 1930, startMonth: 11, endYear: 1930, endMonth: 11, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1930, startMonth: 12, endYear: 1930, endMonth: 12, part: null }], note: "Nov. CR-WO, Dec. AL-WO" },
        { number: 131, sr: "3774", dateRanges: [{ startYear: 1931, startMonth: 1, endYear: 1931, endMonth: 1, part: null }, { startYear: 1931, startMonth: 2, endYear: 1931, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 132, sr: "3775", dateRanges: [{ startYear: 1931, startMonth: 3, endYear: 1931, endMonth: 3, part: null }, { startYear: 1931, startMonth: 4, endYear: 1931, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 133, sr: "3776", dateRanges: [{ startYear: 1931, startMonth: 5, endYear: 1931, endMonth: 5, part: null }, { startYear: 1931, startMonth: 6, endYear: 1931, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 134, sr: "3777", dateRanges: [{ startYear: 1931, startMonth: 7, endYear: 1931, endMonth: 7, part: null }, { startYear: 1931, startMonth: 8, endYear: 1931, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 135, sr: "3778", dateRanges: [{ startYear: 1931, startMonth: 9, endYear: 1931, endMonth: 9, part: null }, { startYear: 1931, startMonth: 10, endYear: 1931, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 136, sr: "3779", dateRanges: [{ startYear: 1931, startMonth: 11, endYear: 1931, endMonth: 11, part: null }, { startYear: 1931, startMonth: 12, endYear: 1931, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 137, sr: "3780", dateRanges: [{ startYear: 1932, startMonth: 1, endYear: 1932, endMonth: 1, part: null }, { startYear: 1932, startMonth: 2, endYear: 1932, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 138, sr: "3781", dateRanges: [{ startYear: 1932, startMonth: 3, endYear: 1932, endMonth: 3, part: null }, { startYear: 1932, startMonth: 4, endYear: 1932, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 139, sr: "3782", dateRanges: [{ startYear: 1932, startMonth: 5, endYear: 1932, endMonth: 5, part: null }, { startYear: 1932, startMonth: 6, endYear: 1932, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 140, sr: "3783", dateRanges: [{ startYear: 1932, startMonth: 7, endYear: 1932, endMonth: 7, part: null }, { startYear: 1932, startMonth: 8, endYear: 1932, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 141, sr: "3784", dateRanges: [{ startYear: 1932, startMonth: 9, endYear: 1932, endMonth: 9, part: null }, { startYear: 1932, startMonth: 10, endYear: 1932, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 142, sr: "3785", dateRanges: [{ startYear: 1932, startMonth: 11, endYear: 1932, endMonth: 11, part: null }, { startYear: 1932, startMonth: 12, endYear: 1932, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 143, sr: "3786", dateRanges: [{ startYear: 1933, startMonth: 1, endYear: 1933, endMonth: 1, part: null }, { startYear: 1933, startMonth: 2, endYear: 1933, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 144, sr: "3787", dateRanges: [{ startYear: 1933, startMonth: 3, endYear: 1933, endMonth: 3, part: null }, { startYear: 1933, startMonth: 4, endYear: 1933, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 145, sr: "3788", dateRanges: [{ startYear: 1933, startMonth: 5, endYear: 1933, endMonth: 5, part: null }, { startYear: 1933, startMonth: 6, endYear: 1933, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 146, sr: "3789", dateRanges: [{ startYear: 1933, startMonth: 7, endYear: 1933, endMonth: 7, part: null }, { startYear: 1933, startMonth: 8, endYear: 1933, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 147, sr: "3790", dateRanges: [{ startYear: 1933, startMonth: 9, endYear: 1933, endMonth: 9, part: null }, { startYear: 1933, startMonth: 10, endYear: 1933, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 148, sr: "3791", dateRanges: [{ startYear: 1933, startMonth: 11, endYear: 1933, endMonth: 11, part: null }, { startYear: 1933, startMonth: 12, endYear: 1933, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 149, sr: "2540", dateRanges: [{ startYear: 1934, startMonth: 1, endYear: 1934, endMonth: 1, part: null }, { startYear: 1934, startMonth: 2, endYear: 1934, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 150, sr: "2541", dateRanges: [{ startYear: 1934, startMonth: 3, endYear: 1934, endMonth: 3, part: null }, { startYear: 1934, startMonth: 4, endYear: 1934, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 151, sr: "2542", dateRanges: [{ startYear: 1934, startMonth: 5, endYear: 1934, endMonth: 5, part: null }, { startYear: 1934, startMonth: 6, endYear: 1934, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 152, sr: "2543", dateRanges: [{ startYear: 1934, startMonth: 7, endYear: 1934, endMonth: 7, part: null }, { startYear: 1934, startMonth: 8, endYear: 1934, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 153, sr: "2544", dateRanges: [{ startYear: 1934, startMonth: 9, endYear: 1934, endMonth: 9, part: null }, { startYear: 1934, startMonth: 10, endYear: 1934, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 154, sr: "2545", dateRanges: [{ startYear: 1934, startMonth: 11, endYear: 1934, endMonth: 11, part: null }, { startYear: 1934, startMonth: 12, endYear: 1934, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 155, sr: "2546", dateRanges: [{ startYear: 1935, startMonth: 1, endYear: 1935, endMonth: 1, part: null }, { startYear: 1935, startMonth: 2, endYear: 1935, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO. Rets. of Jan. WA 1133, 1134" },
        { number: 156, sr: "2547", dateRanges: [{ startYear: 1935, startMonth: 3, endYear: 1935, endMonth: 3, part: null }, { startYear: 1935, startMonth: 4, endYear: 1935, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 157, sr: "2548", dateRanges: [{ startYear: 1935, startMonth: 5, endYear: 1935, endMonth: 5, part: null }, { startYear: 1935, startMonth: 6, endYear: 1935, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO. Rets. of May. SO 6944, Jun. AA 7716" },
        { number: 158, sr: "2549", dateRanges: [{ startYear: 1935, startMonth: 7, endYear: 1935, endMonth: 7, part: null }, { startYear: 1935, startMonth: 8, endYear: 1935, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 159, sr: "2550", dateRanges: [{ startYear: 1935, startMonth: 9, endYear: 1935, endMonth: 9, part: null }, { startYear: 1935, startMonth: 10, endYear: 1935, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 160, sr: "2551", dateRanges: [{ startYear: 1935, startMonth: 11, endYear: 1935, endMonth: 11, part: null }, { startYear: 1935, startMonth: 12, endYear: 1935, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 161, sr: "2552", dateRanges: [{ startYear: 1936, startMonth: 1, endYear: 1936, endMonth: 1, part: null }, { startYear: 1936, startMonth: 2, endYear: 1936, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 162, sr: "2553", dateRanges: [{ startYear: 1936, startMonth: 3, endYear: 1936, endMonth: 3, part: null }, { startYear: 1936, startMonth: 4, endYear: 1936, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 163, sr: "2554", dateRanges: [{ startYear: 1936, startMonth: 5, endYear: 1936, endMonth: 5, part: null }, { startYear: 1936, startMonth: 6, endYear: 1936, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO. Rets. of May. AL 5958, May. FR 6371" },
        { number: 164, sr: "2555", dateRanges: [{ startYear: 1936, startMonth: 7, endYear: 1936, endMonth: 7, part: null }, { startYear: 1936, startMonth: 8, endYear: 1936, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 165, sr: "2556", dateRanges: [{ startYear: 1936, startMonth: 9, endYear: 1936, endMonth: 9, part: null }, { startYear: 1936, startMonth: 10, endYear: 1936, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 166, sr: "2557", dateRanges: [{ startYear: 1936, startMonth: 11, endYear: 1936, endMonth: 11, part: null }, { startYear: 1936, startMonth: 12, endYear: 1936, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 167, sr: "2558", dateRanges: [{ startYear: 1937, startMonth: 1, endYear: 1937, endMonth: 1, part: null }, { startYear: 1937, startMonth: 2, endYear: 1937, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 168, sr: "2559", dateRanges: [{ startYear: 1937, startMonth: 3, endYear: 1937, endMonth: 3, part: null }, { startYear: 1937, startMonth: 4, endYear: 1937, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 169, sr: "2560", dateRanges: [{ startYear: 1937, startMonth: 5, endYear: 1937, endMonth: 5, part: null }, { startYear: 1937, startMonth: 6, endYear: 1937, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 170, sr: "2561", dateRanges: [{ startYear: 1937, startMonth: 7, endYear: 1937, endMonth: 7, part: null }, { startYear: 1937, startMonth: 8, endYear: 1937, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 171, sr: "2562", dateRanges: [{ startYear: 1937, startMonth: 9, endYear: 1937, endMonth: 9, part: null }, { startYear: 1937, startMonth: 10, endYear: 1937, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 172, sr: "2563", dateRanges: [{ startYear: 1937, startMonth: 11, endYear: 1937, endMonth: 11, part: null }, { startYear: 1937, startMonth: 12, endYear: 1937, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 173, sr: "2564", dateRanges: [{ startYear: 1938, startMonth: 1, endYear: 1938, endMonth: 1, part: null }, { startYear: 1938, startMonth: 2, endYear: 1938, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 174, sr: "2565", dateRanges: [{ startYear: 1938, startMonth: 3, endYear: 1938, endMonth: 3, part: null }, { startYear: 1938, startMonth: 4, endYear: 1938, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 175, sr: "2566", dateRanges: [{ startYear: 1938, startMonth: 5, endYear: 1938, endMonth: 5, part: null }, { startYear: 1938, startMonth: 6, endYear: 1938, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 176, sr: "2567", dateRanges: [{ startYear: 1938, startMonth: 7, endYear: 1938, endMonth: 7, part: null }, { startYear: 1938, startMonth: 8, endYear: 1938, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 177, sr: "2568", dateRanges: [{ startYear: 1938, startMonth: 9, endYear: 1938, endMonth: 9, part: null }, { startYear: 1938, startMonth: 10, endYear: 1938, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 178, sr: "2569", dateRanges: [{ startYear: 1938, startMonth: 11, endYear: 1938, endMonth: 11, part: null }, { startYear: 1938, startMonth: 12, endYear: 1938, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO. Rets. of Dec. CE 15529, 15530" },
        { number: 179, sr: "2570", dateRanges: [{ startYear: 1939, startMonth: 1, endYear: 1939, endMonth: 1, part: null }, { startYear: 1939, startMonth: 2, endYear: 1939, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO" },
        { number: 180, sr: "2571", dateRanges: [{ startYear: 1939, startMonth: 3, endYear: 1939, endMonth: 3, part: null }, { startYear: 1939, startMonth: 4, endYear: 1939, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO. Rets. of Mar. AA 3005, 2967" },
        { number: 181, sr: "2572", dateRanges: [{ startYear: 1939, startMonth: 5, endYear: 1939, endMonth: 5, part: null }, { startYear: 1939, startMonth: 6, endYear: 1939, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 182, sr: "2573", dateRanges: [{ startYear: 1939, startMonth: 7, endYear: 1939, endMonth: 7, part: null }, { startYear: 1939, startMonth: 8, endYear: 1939, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO" },
        { number: 183, sr: "2574", dateRanges: [{ startYear: 1939, startMonth: 9, endYear: 1939, endMonth: 9, part: null }, { startYear: 1939, startMonth: 10, endYear: 1939, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 184, sr: "2575", dateRanges: [{ startYear: 1939, startMonth: 11, endYear: 1939, endMonth: 11, part: null }, { startYear: 1939, startMonth: 12, endYear: 1939, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO" },
        { number: 185, sr: "2576", dateRanges: [{ startYear: 1940, startMonth: 1, endYear: 1940, endMonth: 1, part: null }, { startYear: 1940, startMonth: 2, endYear: 1940, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO. Rets. of Feb. SM 2284-2286, Feb. SO 2287-2295, 2302-2326" },
        { number: 186, sr: "2577", dateRanges: [{ startYear: 1940, startMonth: 3, endYear: 1940, endMonth: 3, part: null }, { startYear: 1940, startMonth: 4, endYear: 1940, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO. Ret. of Mar. WI 3916" },
        { number: 187, sr: "2578", dateRanges: [{ startYear: 1940, startMonth: 5, endYear: 1940, endMonth: 5, part: null }, { startYear: 1940, startMonth: 6, endYear: 1940, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO. Rets. of Jun. MO 7813, May. AL 576" },
        { number: 188, sr: "2579", dateRanges: [{ startYear: 1940, startMonth: 7, endYear: 1940, endMonth: 7, part: null }, { startYear: 1940, startMonth: 8, endYear: 1940, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO. Rets. of Jul. QA 9328" },
        { number: 189, sr: "2580", dateRanges: [{ startYear: 1940, startMonth: 9, endYear: 1940, endMonth: 9, part: null }, { startYear: 1940, startMonth: 10, endYear: 1940, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO" },
        { number: 190, sr: "2581", dateRanges: [{ startYear: 1940, startMonth: 11, endYear: 1940, endMonth: 11, part: null }, { startYear: 1940, startMonth: 12, endYear: 1940, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO. Ret. of Dec. WI 16512" },
        { number: 191, sr: "2582", dateRanges: [{ startYear: 1941, startMonth: 1, endYear: 1941, endMonth: 1, part: null }, { startYear: 1941, startMonth: 2, endYear: 1941, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO. Ret. of Jan. AL 52" },
        { number: 192, sr: "2583", dateRanges: [{ startYear: 1941, startMonth: 3, endYear: 1941, endMonth: 3, part: null }, { startYear: 1941, startMonth: 4, endYear: 1941, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 193, sr: "2584", dateRanges: [{ startYear: 1941, startMonth: 5, endYear: 1941, endMonth: 5, part: null }, { startYear: 1941, startMonth: 6, endYear: 1941, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO. Rets. of May. FR 6100, Jun. FR 7591" },
        { number: 194, sr: "2585", dateRanges: [{ startYear: 1941, startMonth: 7, endYear: 1941, endMonth: 7, part: null }, { startYear: 1941, startMonth: 8, endYear: 1941, endMonth: 8, part: null }], note: "Jul. AL-WO, Aug. AL-WO. Ret. of Jul. AL 8554" },
        { number: 195, sr: "2586", dateRanges: [{ startYear: 1941, startMonth: 9, endYear: 1941, endMonth: 9, part: null }, { startYear: 1941, startMonth: 10, endYear: 1941, endMonth: 10, part: null }], note: "Sep. AL-WO, Oct. AL-WO. Ret. of Oct. SM 14074" },
        { number: 196, sr: "2587", dateRanges: [{ startYear: 1941, startMonth: 11, endYear: 1941, endMonth: 11, part: null }, { startYear: 1941, startMonth: 12, endYear: 1941, endMonth: 12, part: null }], note: "Nov. AL-WO, Dec. AL-WO. Rets. of Nov. AL 14715, GA 15229, Dec. AL 16028, 16151" },
        { number: 197, sr: "2588", dateRanges: [{ startYear: 1942, startMonth: 1, endYear: 1942, endMonth: 1, part: null }, { startYear: 1942, startMonth: 2, endYear: 1942, endMonth: 2, part: null }], note: "Jan. AL-WO, Feb. AL-WO. Ret. of Feb. QA 2559" },
        { number: 198, sr: "2589", dateRanges: [{ startYear: 1942, startMonth: 3, endYear: 1942, endMonth: 3, part: null }, { startYear: 1942, startMonth: 4, endYear: 1942, endMonth: 4, part: null }], note: "Mar. AL-WO, Apr. AL-WO" },
        { number: 199, sr: "2590", dateRanges: [{ startYear: 1942, startMonth: 5, endYear: 1942, endMonth: 5, part: null }, { startYear: 1942, startMonth: 6, endYear: 1942, endMonth: 6, part: null }], note: "May. AL-WO, Jun. AL-WO" },
        { number: 200, sr: "2591", dateRanges: [{ startYear: 1942, startMonth: 7, endYear: 1942, endMonth: 7, part: null }, { startYear: 1942, startMonth: 8, endYear: 1942, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jul. AL-WO, Aug. AL-MO. Ret. of Jul. CH 9942" },
        { number: 201, sr: "2592", dateRanges: [{ startYear: 1942, startMonth: 8, endYear: 1942, endMonth: 8, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1942, startMonth: 9, endYear: 1942, endMonth: 9, part: null }, { startYear: 1942, startMonth: 10, endYear: 1942, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Aug. PG-WO, Sep. AL-WO, Oct. AL-CR. Rets. of Sep. BA 12995-12996, Oct. AA 14699" },
        { number: 202, sr: "2593", dateRanges: [{ startYear: 1942, startMonth: 10, endYear: 1942, endMonth: 10, part: null, split: [{ start: "Cecil", end: "Worcester" }] }, { startYear: 1942, startMonth: 11, endYear: 1942, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Oct. CE-WO, Nov. AL-MO" },
        { number: 203, sr: "2594", dateRanges: [{ startYear: 1942, startMonth: 11, endYear: 1942, endMonth: 11, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1942, startMonth: 12, endYear: 1942, endMonth: 12, part: null }], note: "Nov. PG-WO, Dec. AL-WO" },
        { number: 204, sr: "2595", dateRanges: [{ startYear: 1943, startMonth: 1, endYear: 1943, endMonth: 1, part: null }, { startYear: 1943, startMonth: 2, endYear: 1943, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jan. AL-WO, Feb. AL-MO" },
        { number: 205, sr: "2596", dateRanges: [{ startYear: 1943, startMonth: 2, endYear: 1943, endMonth: 2, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1943, startMonth: 3, endYear: 1943, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Feb. PG-WO, Mar. AL-MO. Rets. of Mar. CE 3981, 3982" },
        { number: 206, sr: "2597", dateRanges: [{ startYear: 1943, startMonth: 3, endYear: 1943, endMonth: 3, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1943, startMonth: 4, endYear: 1943, endMonth: 4, part: null }, { startYear: 1943, startMonth: 5, endYear: 1943, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Mar. PG-WO, Apr. AL-WO, May. AL-CA" },
        { number: 207, sr: "2598", dateRanges: [{ startYear: 1943, startMonth: 5, endYear: 1943, endMonth: 5, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1943, startMonth: 6, endYear: 1943, endMonth: 6, part: null }], note: "May. CR-WO, Jun. AL-WO" },
        { number: 208, sr: "2599", dateRanges: [{ startYear: 1943, startMonth: 7, endYear: 1943, endMonth: 7, part: null }, { startYear: 1943, startMonth: 8, endYear: 1943, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Cecil" }] }], note: "Jul. AL-WO, Aug. AL-CE" },
        { number: 209, sr: "2600", dateRanges: [{ startYear: 1943, startMonth: 8, endYear: 1943, endMonth: 8, part: null, split: [{ start: "Charles", end: "Worcester" }] }, { startYear: 1943, startMonth: 9, endYear: 1943, endMonth: 9, part: null }, { startYear: 1943, startMonth: 10, endYear: 1943, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Aug. CH-WO, Sep. AL-WO, Oct. AL-FR. Rets. of Aug. WA 14524, Sep. AL 15013" },
        { number: 210, sr: "2601", dateRanges: [{ startYear: 1943, startMonth: 10, endYear: 1943, endMonth: 10, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1943, startMonth: 11, endYear: 1943, endMonth: 11, part: null }, { startYear: 1943, startMonth: 12, endYear: 1943, endMonth: 12, part: null }], note: "Oct. GA-WO, Nov. AL-WO, Dec. AL-WO" },
        { number: 211, sr: "2602", dateRanges: [{ startYear: 1944, startMonth: 1, endYear: 1944, endMonth: 1, part: null }, { startYear: 1944, startMonth: 2, endYear: 1944, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Charles" }] }], note: "Jan. AL-WO, Feb. AL-CH" },
        { number: 212, sr: "2603", dateRanges: [{ startYear: 1944, startMonth: 2, endYear: 1944, endMonth: 2, part: null, split: [{ start: "Dorchester", end: "Worcester" }] }, { startYear: 1944, startMonth: 3, endYear: 1944, endMonth: 3, part: null }, { startYear: 1944, startMonth: 4, endYear: 1944, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Dorchester" }] }], note: "Feb. DO-WO, Mar. AL-WO, Apr. AL-DO. Ret. of Mar. AL 3100" },
        { number: 213, sr: "2604", dateRanges: [{ startYear: 1944, startMonth: 4, endYear: 1944, endMonth: 4, part: null, split: [{ start: "Frederick", end: "Worcester" }] }, { startYear: 1944, startMonth: 5, endYear: 1944, endMonth: 5, part: null }, { startYear: 1944, startMonth: 6, endYear: 1944, endMonth: 6, part: null, split: [{ start: "Allegany", end: "Anne Arundel" }] }], note: "Apr. FR-WO, May. AL-WO, Jun. AL-AA" },
        { number: 214, sr: "2605", dateRanges: [{ startYear: 1944, startMonth: 6, endYear: 1944, endMonth: 6, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1944, startMonth: 7, endYear: 1944, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Washington" }] }], note: "Jun. BA-WO, Jul. AL-WA. Rets. of Jul. AL 10005, 10023, Jul. SM 11284" },
        { number: 215, sr: "2606", dateRanges: [{ startYear: 1944, startMonth: 7, endYear: 1944, endMonth: 7, part: null, split: [{ start: "Washington", end: "Worcester" }] }, { startYear: 1944, startMonth: 8, endYear: 1944, endMonth: 8, part: null }, { startYear: 1944, startMonth: 9, endYear: 1944, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jul. WA-WO, Aug. AL-WO, Sep. AL-MO" },
        { number: 216, sr: "2607", dateRanges: [{ startYear: 1944, startMonth: 9, endYear: 1944, endMonth: 9, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1944, startMonth: 10, endYear: 1944, endMonth: 10, part: null }, { startYear: 1944, startMonth: 11, endYear: 1944, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Garrett" }] }], note: "Sep. PG-WO, Oct. AL-WO, Nov. AL-GA" },
        { number: 217, sr: "2608", dateRanges: [{ startYear: 1944, startMonth: 11, endYear: 1944, endMonth: 11, part: null, split: [{ start: "Harford", end: "Worcester" }] }, { startYear: 1944, startMonth: 12, endYear: 1944, endMonth: 12, part: null }], note: "Nov. HA-WO, Dec. AL-WO" },
        { number: 218, sr: "2609", dateRanges: [{ startYear: 1945, startMonth: 1, endYear: 1945, endMonth: 1, part: null }, { startYear: 1945, startMonth: 2, endYear: 1945, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Talbot" }] }], note: "Jan. AL-WO, Feb. AL-TA" },
        { number: 219, sr: "2610", dateRanges: [{ startYear: 1945, startMonth: 2, endYear: 1945, endMonth: 2, part: null, split: [{ start: "Washington", end: "Worcester" }] }, { startYear: 1945, startMonth: 3, endYear: 1945, endMonth: 3, part: null }, { startYear: 1945, startMonth: 4, endYear: 1945, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Queen Anne's" }] }], note: "Feb. WA-WO, Mar. AL-WO, Apr. AL-QA" },
        { number: 220, sr: "2611", dateRanges: [{ startYear: 1945, startMonth: 4, endYear: 1945, endMonth: 4, part: null, split: [{ start: "Saint Mary's", end: "Worcester" }] }, { startYear: 1945, startMonth: 5, endYear: 1945, endMonth: 5, part: null }, { startYear: 1945, startMonth: 6, endYear: 1945, endMonth: 6, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Apr. SM-WO, May. AL-WO, Jun. AL-MO" },
        { number: 221, sr: "2612", dateRanges: [{ startYear: 1945, startMonth: 6, endYear: 1945, endMonth: 6, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1945, startMonth: 7, endYear: 1945, endMonth: 7, part: null }, { startYear: 1945, startMonth: 8, endYear: 1945, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Kent" }] }], note: "Jun. PG-WO, Jul. AL-WO, Aug. AL-KE" },
        { number: 222, sr: "2613", dateRanges: [{ startYear: 1945, startMonth: 8, endYear: 1945, endMonth: 8, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1945, startMonth: 9, endYear: 1945, endMonth: 9, part: null }, { startYear: 1945, startMonth: 10, endYear: 1945, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Dorchester" }] }], note: "Aug. MO-WO, Sep. AL-WO, Oct. AL-DO" },
        { number: 223, sr: "2614", dateRanges: [{ startYear: 1945, startMonth: 10, endYear: 1945, endMonth: 10, part: null, split: [{ start: "Frederick", end: "Worcester" }] }, { startYear: 1945, startMonth: 11, endYear: 1945, endMonth: 11, part: null }, { startYear: 1945, startMonth: 12, endYear: 1945, endMonth: 12, part: null }], note: "Oct. FR-WO, Nov. AL-WO, Dec. AL-WO. Rets. of Oct. WO 16254, 16259, 16263, 1629?, 163??, 16286, 16359, Nov. WO 17787, 17791, 17788, 17790" },
        { number: 224, sr: "2615", dateRanges: [{ startYear: 1946, startMonth: 1, endYear: 1946, endMonth: 1, part: null }, { startYear: 1946, startMonth: 2, endYear: 1946, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Dorchester" }] }], note: "Jan. AL-WO, Feb. AL-DO" },
        { number: 225, sr: "2616", dateRanges: [{ startYear: 1946, startMonth: 2, endYear: 1946, endMonth: 2, part: null, split: [{ start: "Frederick", end: "Worcester" }] }, { startYear: 1946, startMonth: 3, endYear: 1946, endMonth: 3, part: null }, { startYear: 1946, startMonth: 4, endYear: 1946, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Caroline" }] }], note: "Feb. FR-WO, Mar. AL-WO, Apr. AL-CA. Ret. of Feb. PG 2391" },
        { number: 226, sr: "2617", dateRanges: [{ startYear: 1946, startMonth: 4, endYear: 1946, endMonth: 4, part: null, split: [{ start: "Carroll", end: "Worcester" }] }, { startYear: 1946, startMonth: 5, endYear: 1946, endMonth: 5, part: null }, { startYear: 1946, startMonth: 6, endYear: 1946, endMonth: 6, part: null, split: [{ start: "Allegany", end: "Anne Arundel" }] }], note: "Apr. CR-WO, May. AL-WO, Jun. AL-AA. Rets. of Apr. HA 5022, 5023" },
        { number: 227, sr: "2618", dateRanges: [{ startYear: 1946, startMonth: 6, endYear: 1946, endMonth: 6, part: null, split: [{ start: "Anne Arundel", end: "Worcester" }] }, { startYear: 1946, startMonth: 7, endYear: 1946, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Somerset" }] }], note: "Jun. BA-WO, Jul. AL-SO. Rets. of Jun. BA 7870, 7846, 7847, Jun. AA 9464" },
        { number: 228, sr: "2619", dateRanges: [{ startYear: 1946, startMonth: 7, endYear: 1946, endMonth: 7, part: null, split: [{ start: "Talbot", end: "Worcester" }] }, { startYear: 1946, startMonth: 8, endYear: 1946, endMonth: 8, part: null }], note: "Jul. TA-WO, Aug. AL-WO. Rets. of Aug. AL 11327, Aug. CE 11814, Aug. DO 564, Aug. TA 12768" },
        { number: 229, sr: "2620", dateRanges: [{ startYear: 1946, startMonth: 9, endYear: 1946, endMonth: 9, part: null }, { startYear: 1946, startMonth: 10, endYear: 1946, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Allegany" }] }], note: "Sep. AL-WO, Oct. AL" },
        { number: 230, sr: "2621", dateRanges: [{ startYear: 1946, startMonth: 10, endYear: 1946, endMonth: 10, part: null, split: [{ start: "Anne Arundel", end: "Worcester" }] }, { startYear: 1946, startMonth: 11, endYear: 1946, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Allegany" }] }], note: "Oct. AA-WO, Nov. AL" },
        { number: 231, sr: "2622", dateRanges: [{ startYear: 1946, startMonth: 11, endYear: 1946, endMonth: 11, part: null, split: [{ start: "Anne Arundel", end: "Worcester" }] }, { startYear: 1946, startMonth: 12, endYear: 1946, endMonth: 12, part: null }], note: "Nov. AA-WO, Dec. AL-WO" },
        { number: 232, sr: "2623", dateRanges: [{ startYear: 1947, startMonth: 1, endYear: 1947, endMonth: 1, part: null }, { startYear: 1947, startMonth: 2, endYear: 1947, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Anne Arundel" }] }], note: "Jan. AL-WO, Feb. AL-AA" },
        { number: 233, sr: "2624", dateRanges: [{ startYear: 1947, startMonth: 2, endYear: 1947, endMonth: 2, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1947, startMonth: 3, endYear: 1947, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Baltimore" }] }], note: "Feb. BA-WO, Mar. AL-BA. Rets. of Feb. BA 2738, 2741, 2742, 2746, 2750, 2756, 2757, 2761, 2766, 2768" },
        { number: 234, sr: "2625", dateRanges: [{ startYear: 1947, startMonth: 3, endYear: 1947, endMonth: 3, part: null, split: [{ start: "Calvert", end: "Worcester" }] }, { startYear: 1947, startMonth: 4, endYear: 1947, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Mar. CV-WO, Apr. AL-CR" },
        { number: 235, sr: "2626", dateRanges: [{ startYear: 1947, startMonth: 4, endYear: 1947, endMonth: 4, part: null, split: [{ start: "Cecil", end: "Worcester" }] }, { startYear: 1947, startMonth: 5, endYear: 1947, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Apr. CE-WO, May. AL-MO" },
        { number: 236, sr: "2627", dateRanges: [{ startYear: 1947, startMonth: 5, endYear: 1947, endMonth: 5, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1947, startMonth: 6, endYear: 1947, endMonth: 6, part: null }], note: "May. PG-WO, Jun. AL-WO" },
        { number: 237, sr: "2628", dateRanges: [{ startYear: 1947, startMonth: 7, endYear: 1947, endMonth: 7, part: null }, { startYear: 1947, startMonth: 8, endYear: 1947, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jul. AL-WO, Aug. AL-MO" },
        { number: 238, sr: "2629", dateRanges: [{ startYear: 1947, startMonth: 8, endYear: 1947, endMonth: 8, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1947, startMonth: 9, endYear: 1947, endMonth: 9, part: null }], note: "Aug. MO-WO, Sep. AL-WO. Ret. of Aug. WA 16758" },
        { number: 239, sr: "2630", dateRanges: [{ startYear: 1947, startMonth: 10, endYear: 1947, endMonth: 10, part: null }, { startYear: 1947, startMonth: 11, endYear: 1947, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Garrett" }] }], note: "Oct. AL-WO, Nov. AL-GA" },
        { number: 240, sr: "2631", dateRanges: [{ startYear: 1947, startMonth: 11, endYear: 1947, endMonth: 11, part: null, split: [{ start: "Harford", end: "Worcester" }] }, { startYear: 1947, startMonth: 12, endYear: 1947, endMonth: 12, part: null }], note: "Nov. HA-WO, Dec. AL-WO" },
        { number: 241, sr: "2632", dateRanges: [{ startYear: 1948, startMonth: 1, endYear: 1948, endMonth: 1, part: null }, { startYear: 1948, startMonth: 2, endYear: 1948, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "Jan. AL-WO, Feb. AL-FR" },
        { number: 242, sr: "2633", dateRanges: [{ startYear: 1948, startMonth: 2, endYear: 1948, endMonth: 2, part: null, split: [{ start: "Frederick", end: "Worcester" }] }, { startYear: 1948, startMonth: 3, endYear: 1948, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Washington" }] }], note: "Feb. FR-WO, Mar. AL-WA" },
        { number: 243, sr: "2634", dateRanges: [{ startYear: 1948, startMonth: 3, endYear: 1948, endMonth: 3, part: null, split: [{ start: "Wicomico", end: "Worcester" }] }, { startYear: 1948, startMonth: 4, endYear: 1948, endMonth: 4, part: null }, { startYear: 1948, startMonth: 5, endYear: 1948, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Garrett" }] }], note: "Mar. WI-WO, Apr. AL-WO, May. AL-GA" },
        { number: 244, sr: "2635", dateRanges: [{ startYear: 1948, startMonth: 5, endYear: 1948, endMonth: 5, part: null, split: [{ start: "Harford", end: "Worcester" }] }, { startYear: 1948, startMonth: 6, endYear: 1948, endMonth: 6, part: null }], note: "May. HA-WO, Jun. AL-WO" },
        { number: 245, sr: "2636", dateRanges: [{ startYear: 1948, startMonth: 7, endYear: 1948, endMonth: 7, part: null }, { startYear: 1948, startMonth: 8, endYear: 1948, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Garrett" }] }], note: "Jul. AL-WO, Aug. AL-GA" },
        { number: 246, sr: "2637", dateRanges: [{ startYear: 1948, startMonth: 8, endYear: 1948, endMonth: 8, part: null, split: [{ start: "Harford", end: "Worcester" }] }, { startYear: 1948, startMonth: 9, endYear: 1948, endMonth: 9, part: null, split: [{ start: "Allegany", end: "Talbot" }] }], note: "Aug. HA-WO, Sep. AL-TA. Rets. of Aug. HA 150?3, Sep. AA 16528" },
        { number: 247, sr: "2638", dateRanges: [{ startYear: 1948, startMonth: 9, endYear: 1948, endMonth: 9, part: null, split: [{ start: "Washington", end: "Worcester" }] }, { startYear: 1948, startMonth: 10, endYear: 1948, endMonth: 10, part: null }, { startYear: 1948, startMonth: 11, endYear: 1948, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Sep. WA-WO, Oct. AL-WO, Nov. AL-CR" },
        { number: 248, sr: "2639", dateRanges: [{ startYear: 1948, startMonth: 11, endYear: 1948, endMonth: 11, part: null, split: [{ start: "Cecil", end: "Worcester" }] }, { startYear: 1948, startMonth: 12, endYear: 1948, endMonth: 12, part: null }], note: "Nov. CE-WO, Dec. AL-WO" },
        { number: 249, sr: "2640", dateRanges: [{ startYear: 1949, startMonth: 1, endYear: 1949, endMonth: 1, part: null }, { startYear: 1949, startMonth: 2, endYear: 1949, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Charles" }] }], note: "Jan. AL-WO, Feb. AL-CH" },
        { number: 250, sr: "2641", dateRanges: [{ startYear: 1949, startMonth: 2, endYear: 1949, endMonth: 2, part: null, split: [{ start: "Dorchester", end: "Worcester" }] }, { startYear: 1949, startMonth: 3, endYear: 1949, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Washington" }] }], note: "Feb. DO-WO, Mar. AL-WA" },
        { number: 251, sr: "2642", dateRanges: [{ startYear: 1949, startMonth: 3, endYear: 1949, endMonth: 3, part: null, split: [{ start: "Wicomico", end: "Worcester" }] }, { startYear: 1949, startMonth: 4, endYear: 1949, endMonth: 4, part: null }, { startYear: 1949, startMonth: 5, endYear: 1949, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Mar. WI-WO, Apr. AL-WO, May. AL-MO. Rets. of Apr. FR 7597, 6640" },
        { number: 252, sr: "2643", dateRanges: [{ startYear: 1949, startMonth: 5, endYear: 1949, endMonth: 5, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1949, startMonth: 6, endYear: 1949, endMonth: 6, part: null }, { startYear: 1949, startMonth: 7, endYear: 1949, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Anne Arundel" }] }], note: "May. MO-WO, Jun. AL-WO, Jul. AL-AA" },
        { number: 253, sr: "2644", dateRanges: [{ startYear: 1949, startMonth: 7, endYear: 1949, endMonth: 7, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1949, startMonth: 8, endYear: 1949, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Jul. BA-WO, Aug. AL-MO" },
        { number: 254, sr: "2645", dateRanges: [{ startYear: 1949, startMonth: 8, endYear: 1949, endMonth: 8, part: null, split: [{ start: "Prince George's", end: "Worcester" }] }, { startYear: 1949, startMonth: 9, endYear: 1949, endMonth: 9, part: null }, { startYear: 1949, startMonth: 10, endYear: 1949, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Anne Arundel" }] }], note: "Aug. PG-WO, Sep. AL-WO, Oct. AL-AA" },
        { number: 255, sr: "2646", dateRanges: [{ startYear: 1949, startMonth: 10, endYear: 1949, endMonth: 10, part: null, split: [{ start: "Baltimore", end: "Worcester" }] }, { startYear: 1949, startMonth: 11, endYear: 1949, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Queen Anne's" }] }], note: "Oct. BA-WO, Nov. AL-QA" },
        { number: 256, sr: "2647", dateRanges: [{ startYear: 1949, startMonth: 11, endYear: 1949, endMonth: 11, part: null, split: [{ start: "Saint Mary's", end: "Worcester" }] }, { startYear: 1949, startMonth: 12, endYear: 1949, endMonth: 12, part: null }], note: "Nov. SM-WO, Dec. AL-WO. Rets. of Nov. SM 21120, 21121" },
        { number: 257, sr: "2648", dateRanges: [{ startYear: 1950, startMonth: 1, endYear: 1950, endMonth: 1, part: null }, { startYear: 1950, startMonth: 2, endYear: 1950, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Harford" }] }], note: "Jan. AL-WO, Feb. AL-HA" },
        { number: 258, sr: "2649", dateRanges: [{ startYear: 1950, startMonth: 2, endYear: 1950, endMonth: 2, part: null, split: [{ start: "Howard", end: "Worcester" }] }, { startYear: 1950, startMonth: 3, endYear: 1950, endMonth: 3, part: null }, { startYear: 1950, startMonth: 4, endYear: 1950, endMonth: 4, part: null, split: [{ start: "Allegany", end: "Allegany" }] }], note: "Feb. HO-WO, Mar. AL-WO, Apr. AL" },
        { number: 259, sr: "2650", dateRanges: [{ startYear: 1950, startMonth: 4, endYear: 1950, endMonth: 4, part: null }, { startYear: 1950, startMonth: 5, endYear: 1950, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Talbot" }] }], note: "Apr. AL-WO, May. AL-TA" },
        { number: 260, sr: "2651", dateRanges: [{ startYear: 1950, startMonth: 5, endYear: 1950, endMonth: 5, part: null, split: [{ start: "Washington", end: "Worcester" }] }, { startYear: 1950, startMonth: 6, endYear: 1950, endMonth: 6, part: null }, { startYear: 1950, startMonth: 7, endYear: 1950, endMonth: 7, part: null, split: [{ start: "Allegany", end: "Frederick" }] }], note: "May. WA-WO, Jun. AL-WO, Jul. AL-FR" },
        { number: 261, sr: "2652", dateRanges: [{ startYear: 1950, startMonth: 7, endYear: 1950, endMonth: 7, part: null, split: [{ start: "Garrett", end: "Worcester" }] }, { startYear: 1950, startMonth: 8, endYear: 1950, endMonth: 8, part: null, split: [{ start: "Allegany", end: "Prince George's" }] }], note: "Jul. GA-WO, Aug. AL-PG. Ret. of Aug. MO 14576" },
        { number: 262, sr: "2653", dateRanges: [{ startYear: 1950, startMonth: 8, endYear: 1950, endMonth: 8, part: null, split: [{ start: "Queen Anne's", end: "Worcester" }] }, { startYear: 1950, startMonth: 9, endYear: 1950, endMonth: 9, part: null }, { startYear: 1950, startMonth: 10, endYear: 1950, endMonth: 10, part: null, split: [{ start: "Allegany", end: "Anne Arundel" }] }], note: "Aug. QA-WO, Sep. AL-WO, Oct. AL-AA" },
        { number: 263, sr: "2654", dateRanges: [{ startYear: 1950, startMonth: 10, endYear: 1950, endMonth: 10, part: null, split: [{ start: "Anne Arundel", end: "Worcester" }] }, { startYear: 1950, startMonth: 11, endYear: 1950, endMonth: 11, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "Oct. AA-WO, Nov. AL-MO" },
        { number: 264, sr: "2655", dateRanges: [{ startYear: 1950, startMonth: 11, endYear: 1950, endMonth: 11, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }, { startYear: 1950, startMonth: 12, endYear: 1950, endMonth: 12, part: null }], note: "Nov. MO-WO, Dec. AL-WO" },
        { number: 265, sr: "2656", dateRanges: [{ startYear: 1951, startMonth: 1, endYear: 1951, endMonth: 1, part: null }, { startYear: 1951, startMonth: 2, endYear: 1951, endMonth: 2, part: null, split: [{ start: "Allegany", end: "Howard" }] }], note: "Jan. AL-WO, Feb. AL-HO" },
        { number: 266, sr: "2657", dateRanges: [{ startYear: 1951, startMonth: 2, endYear: 1951, endMonth: 2, part: null, split: [{ start: "Kent", end: "Worcester" }] }, { startYear: 1951, startMonth: 3, endYear: 1951, endMonth: 3, part: null, split: [{ start: "Allegany", end: "Talbot" }] }], note: "Feb. KE-WO, Mar. AL-TA" },
        { number: 267, sr: "2658", dateRanges: [{ startYear: 1951, startMonth: 3, endYear: 1951, endMonth: 3, part: null, split: [{ start: "Washington", end: "Worcester" }] }, { startYear: 1951, startMonth: 4, endYear: 1951, endMonth: 4, part: null }, { startYear: 1951, startMonth: 5, endYear: 1951, endMonth: 5, part: null, split: [{ start: "Allegany", end: "Carroll" }] }], note: "Mar. WA-WO, Apr. AL-WO, May. AL-CR" },
        { number: 268, sr: "2659", dateRanges: [{ startYear: 1951, startMonth: 5, endYear: 1951, endMonth: 5, part: null, split: [{ start: "Cecil", end: "Worcester" }] }, { startYear: 1951, startMonth: 6, endYear: 1951, endMonth: 6, part: null, split: [{ start: "Allegany", end: "Montgomery" }] }], note: "May. CE-WO, Jun. AL-MO" },
        { number: 269, sr: "2660", dateRanges: [{ startYear: 1951, startMonth: 6, endYear: 1951, endMonth: 6, part: null, split: [{ start: "Montgomery", end: "Worcester" }] }], note: "Jun. MO-WO" },
            ];

            // SM35-1 through SM35-72 have real archive.org scans,
            // addressed by each record's own `sr` value rather than a
            // shared collection/prefix table (see RECORDS above) - all
            // 269 records have an sr value, but it's only meaningful for
            // building a URL within this range (see archiveUrl() below).
            // 73-269 have no archive.org scan at all; BaseSeries.
            // archiveUrl()'s default MSA fallback handles them.
            this.ARCHIVE_SR_RANGE = { start: 1, end: 72 };

            // Archive.org blocks: "SM35 1-35" and "SM35 36-72".
            this.ARCHIVE_BLOCKS = [
                { start: 1, end: 35, collection: 1 },
                { start: 36, end: 72, collection: 36 }
            ];
        }


        canHandle(location, month, year) {

            // Confirmed: SM35 is a county-only file, same as S1988 and
            // S1963 - Baltimore City births are handled by a separate
            // series.
            if (location === "Baltimore City") {
                return false;
            }

            // End month within 1951 not confirmed - "through 1951" is
            // assumed to mean December here, same convention used
            // elsewhere when only a year was given (see dateRange
            // above, which is what listSeries() reports too).
            return this.inDateRange(month, year);
        }


        // Kept for the generic cross-series seriesIdRange sanity
        // check (see test/core/series-id-range.test.js) - not used by
        // lookupLocationMonthYear() below, which reads STANDARD_RECORDS
        // directly. A record's dateRanges could in principle span more
        // than one year, though no case in this data actually does.
        buildIndex() {

            const index = {};

            for (const record of this.STANDARD_RECORDS) {
                const years = new Set(record.dateRanges.map(dr => dr.startYear));

                for (const year of years) {
                    if (!index[year]) {
                        index[year] = [];
                    }
                    index[year].push(record);
                }
            }

            return index;
        }


        /**
         * Filters STANDARD_RECORDS by month/year, then - for any
         * record whose that-month entry has a split - checks whether
         * the queried county actually falls in it. A month with no
         * split on that entry is full statewide coverage, so every
         * county matches.
         *
         * label stays the record's full verbatim note (every month
         * that file covers, not just the queried one) - a researcher
         * benefits from seeing the whole file's real coverage, the
         * same reasoning that kept note verbatim in the first place.
         */
        lookupLocationMonthYear(location, month, year) {

            const results = [];

            for (const record of this.STANDARD_RECORDS) {
                const dr = record.dateRanges.find(d => d.startYear === year && d.startMonth === month);
                if (!dr) {
                    continue;
                }

                const covered = !dr.split || dr.split.some(s => counties.isCountyInRange(location, s.start, s.end));
                if (!covered) {
                    continue;
                }

                results.push(this.createResult({
                    year,
                    month,
                    location: counties.normalizeCounty(location),
                    number: record.number,
                    label: record.note,
                    url: this.archiveUrl(record.number)
                }));
            }

            return results;
        }


        /**
         * Every record touching a given month/year, across every
         * county - for browsing a month/year at once, no location
         * required. Same STANDARD_RECORDS filter as
         * lookupLocationMonthYear() above, minus the county check.
         * location is null on every result here - unlike a real
         * per-record location, SM35's coverage genuinely varies by
         * county within one record, so there's no single value to put
         * there; the label (the record's full verbatim note) already
         * says what's actually covered.
         */
        lookupAllForMonth(month, year) {

            const results = [];

            for (const record of this.STANDARD_RECORDS) {
                const dr = record.dateRanges.find(d => d.startYear === year && d.startMonth === month);
                if (!dr) {
                    continue;
                }

                results.push(this.createResult({
                    year,
                    month,
                    location: null,
                    number: record.number,
                    label: record.note,
                    url: this.archiveUrl(record.number)
                }));
            }

            return results;
        }


        // Full override, not buildArchiveUrl/ARCHIVE_RANGES - the
        // sr-based archive.org URL for 1-72 doesn't fit the shared
        // collection/prefix range-table shape used by other series.
        archiveUrl(number) {

            const { start, end } = this.ARCHIVE_SR_RANGE;
            const record = this.recordsByNumber[number];

            if (record && number >= start && number <= end) {

                const block = this.ARCHIVE_BLOCKS.find(b => number >= b.start && number <= b.end);
                const collection = block ? block.collection : number;

                return (
                    "https://archive.org/details/" +
                    `reclaim-the-records-maryland-birth-certificates-1914-1922-sm-35-${collection}` +
                    "/" +
                    `Reclaim_The_Records_-_Maryland_Birth_Certificates_-_1914-1922_-_SM35-sr${record.sr}` +
                    "/"
                );
            }

            return super.archiveUrl(number);
        }

    }

    const instance = new SM35Series();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = instance;
    }

    global.MDRecordSearch.series.SM35 = instance;

})(typeof window !== "undefined" ? window : globalThis);
