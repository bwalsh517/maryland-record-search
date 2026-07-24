if (typeof require !== "undefined") {
    require("../core/base-series.js");
}

(function (global) {
    "use strict";

    const BaseSeries = global.MDRecordSearch.BaseSeries;

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


        buildIndex() {

            const index = {};

            for (const record of this.RECORDS) {

                if (!index[record.year]) {
                    index[record.year] = [];
                }

                index[record.year].push(record);
            }

            return index;
        }


        /**
         * Deliberately basic: each file's actual coverage is a specific
         * (sometimes multi-month, sometimes multi-county-range,
         * occasionally cross-year) span described in free text in the
         * MSA guide ("Jan. AL-QA, WA-WO, QA-WA, Feb. AL-BA") rather
         * than a clean per-county-per-month grid like the other series.
         * Parsing that reliably - including handling "SM" meaning Saint
         * Mary's County here but the series name elsewhere - is real
         * work that hasn't been done yet.
         *
         * So for now this ignores the location and month arguments
         * entirely (beyond canHandle() already excluding Baltimore
         * City and out-of-range dates) and returns every file for the
         * matching year, letting the description field tell the caller
         * what's actually in each one. That means a location/date
         * search for any county in a covered year returns the same
         * full set of ~8 files for that year - not wrong, just coarser
         * than the other series' exact per-county results.
         */
        lookupLocationMonthYear(location, month, year) {

            const records = this.index[year];

            if (!records) {
                return [];
            }

            return records.map(record =>
                this.createResult({
                    year: record.year,
                    number: record.number,
                    label: record.description,
                    url: this.archiveUrl(record.number)
                })
            );
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
