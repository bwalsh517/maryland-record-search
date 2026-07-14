if (typeof require !== "undefined") {
    require("../core/namespace.js");
}

/**
 * Raw finding-aid data for SE46, kept separate from se46.js's lookup
 * logic since there's a lot of it. Three eras, three shapes:
 *
 * 1973-1987 (SE46-1 to SE46-4909): a computed grid. 24 jurisdictions
 * per month, strict alphabetical order (matching
 * alphabeticalCountyCityOrder() in counties.js), one record each by
 * default. SPLIT_MONTHS lists only the jurisdictions that actually
 * split into more than one record for a given month - everything
 * else fills in around them.
 *
 * The entire range is verified end-to-end - every month's given
 * split positions checked against a running cumulative total carried
 * from January 1973, closing exactly on Worcester = SE46-4909 in
 * December 1987 (the last record before the trailing specials). Zero
 * discrepancies across all 180 months, once four things are correctly
 * accounted for in that walk:
 *
 * - TRAILING_SPECIALS: a jurisdiction's regular monthly slot was
 *   pulled out and issued later instead - that jurisdiction has NO
 *   record in the regular grid sequence for that specific month, for
 *   all 7 of these (`pulledOut: true` throughout, including
 *   Baltimore's Aug 1979 entry - there is only one Baltimore record
 *   that month, the out-of-order one).
 * - UNASSIGNED_RECORDS: SE46-189 and SE46-1606 are confirmed
 *   unassigned numbers - real numbers that were never tied to any
 *   jurisdiction, consuming a slot in the sequence without producing
 *   a search result.
 * - ORDER_SWAPS: a single confirmed exception to strict alphabetical
 *   order - Prince George's was numbered before Montgomery for March
 *   1986 only, with both counties' own totals unaffected.
 * - A one-letter split easy to miss entirely: Baltimore City had a
 *   third part for Aug 1979 (SE46-2132, surname "A" only) alongside
 *   its more obvious B-L and M-Z parts - this is what an earlier pass
 *   mistook for a missing unassigned number, since a single-letter
 *   split doesn't look like a normal one at a glance.
 *
 * SE46-4909 (Dec 1987, Worcester) doubles as both the regular grid
 * slot for that month AND a catch-all for late files - one record,
 * not two.
 *
 * 1988-2014 (SE46-4917 to SE46-7215): no location dimension at all,
 * pure year + sequential certificate number. 1988 and 1989
 * (RECORDS_1988_1989) are irregular throughout, so they're a literal
 * table. 1990-2014 (YEAR_METADATA) follows a clean formula instead -
 * every lot is exactly 500 certificates except the last one of the
 * year - verified against all 25 years with zero deviation, including
 * 1990 once its 7 irregular middle lots (YEAR_1990_EXCEPTIONS) are
 * pulled out as a specific override.
 *
 * Only 1988-2012 (SE46-4917 to SE46-7031) is on archive.org. 2013 and
 * 2014 (SE46-7032 to SE46-7215) exist only as MSA guide entries - not
 * on archive.org, and not necessarily viewable there either; MSA may
 * add them later.
 */
(function (global) {
    "use strict";

    const SPLIT_MONTHS = {
        "01/1973": {
            "Baltimore": [{ label: "A-O", certStart: 234, certEnd: 504 }, { label: "P-Z", certStart: 505, certEnd: 649 }],
            "Baltimore City": [{ label: "A-E", certStart: 650, certEnd: 954 }, { label: "F-P", certStart: 955, certEnd: 1479 }, { label: "Q-Z", certStart: 1480, certEnd: 1839 }],
        },
        "02/1973": {
            "Baltimore": [{ label: "A-S", certStart: 3260, certEnd: 3573 }, { label: "T-Z", certStart: 3574, certEnd: 3629 }],
            "Baltimore City": [{ label: "A-K", certStart: 3630, certEnd: 4094 }, { label: "L-Z", certStart: 4095, certEnd: 4561 }],
        },
        "03/1973": {
            "Baltimore": [{ label: "A-R", certStart: 5757, certEnd: 6025 }, { label: "S-Z", certStart: 6026, certEnd: 6100 }],
            "Baltimore City": [{ label: "A-I", certStart: 6101, certEnd: 6540 }, { label: "J-V", certStart: 6541, certEnd: 7046 }, { label: "W-Z", certStart: 7047, certEnd: 7126 }],
            "Montgomery": [{ label: "A-L", certStart: 7436, certEnd: 7607 }, { label: "M-Z", certStart: 7608, certEnd: 7721 }],
        },
        "04/1973": {
            "Baltimore City": [{ label: "A-K", certStart: 8664, certEnd: 9175 }, { label: "L-Z", certStart: 9176, certEnd: 9663 }],
            "Montgomery": [{ label: "A-S", certStart: 9974, certEnd: 10235 }, { label: "T-Z", certStart: 10236, certEnd: 10268 }],
        },
        "05/1973": {
            "Baltimore": [{ label: "A-S", certStart: 10958, certEnd: 11260 }, { label: "T-Z", certStart: 11261, certEnd: 11302 }],
            "Baltimore City": [{ label: "A-J", certStart: 11303, certEnd: 11781 }, { label: "K-Z", certStart: 11782, certEnd: 12331 }],
            "Montgomery": [{ label: "A-R", certStart: 12611, certEnd: 12853 }, { label: "S-Z", certStart: 12854, certEnd: 12930 }],
        },
        "06/1973": {
            "Baltimore": [{ label: "A-S", certStart: 13587, certEnd: 13898 }, { label: "T-Z", certStart: 13899, certEnd: 13948 }],
            "Baltimore City": [{ label: "A-K", certStart: 13949, certEnd: 14450 }, { label: "L-Z", certStart: 14451, certEnd: 14957 }],
            "Montgomery": [{ label: "A-S", certStart: 15282, certEnd: 15533 }, { label: "T-Z", certStart: 15534, certEnd: 15566 }],
        },
        "07/1973": {
            "Baltimore": [{ label: "A-S", certStart: 16239, certEnd: 16539 }, { label: "S-Z", certStart: 16540, certEnd: 16608 }],
            "Baltimore City": [{ label: "A-J", certStart: 16609, certEnd: 17051 }, { label: "J-Z", certStart: 17052, certEnd: 17575 }],
            "Montgomery": [{ label: "A-R", certStart: 17866, certEnd: 18081 }, { label: "S-Z", certStart: 18146, certEnd: 18327 }],
        },
        "08/1973": {
            "Baltimore": [{ label: "A-T", certStart: 18804, certEnd: 19149 }, { label: "V-Z", certStart: 19150, certEnd: 19184 }],
            "Baltimore City": [{ label: "A-J", certStart: 19185, certEnd: 19698 }, { label: "K-Z", certStart: 19699, certEnd: 20219 }],
            "Montgomery": [{ label: "A-P", certStart: 20534, certEnd: 20765 }, { label: "R-Z", certStart: 20766, certEnd: 20823 }],
        },
        "09/1973": {
            "Baltimore": [{ label: "A-S", certStart: 21484, certEnd: 21802 }, { label: "S-Z", certStart: 21803, certEnd: 21875 }],
            "Baltimore City": [{ label: "A-K", certStart: 21876, certEnd: 22337 }, { label: "K-Z", certStart: 22338, certEnd: 22860 }],
            "Montgomery": [{ label: "A-M", certStart: 23217, certEnd: 23397 }, { label: "N-Z", certStart: 23398, certEnd: 23509 }],
        },
        "10/1973": {
            "Baltimore": [{ label: "A-S", certStart: 24125, certEnd: 24134 }, { label: "T-Z", certStart: 24463, certEnd: 24511 }],
            "Baltimore City": [{ label: "A-K", certStart: 24512, certEnd: 25011 }, { label: "K-Z", certStart: 25012, certEnd: 25518 }],
            "Montgomery": [{ label: "A-P", certStart: 25852, certEnd: 26094 }, { label: "Q-Z", certStart: 26095, certEnd: 26188 }],
        },
        "11/1973": {
            "Baltimore": [{ label: "A-V", certStart: 26854, certEnd: 27187 }, { label: "W-Z", certStart: 27188, certEnd: 27220 }],
            "Baltimore City": [{ label: "A-K", certStart: 27221, certEnd: 27711 }, { label: "K-W", certStart: 27712, certEnd: 28250 }, { label: "W-Z", certStart: 28251, certEnd: 28267 }],
            "Montgomery": [{ label: "A-O", certStart: 28584, certEnd: 28788 }, { label: "P-Z", certStart: 28789, certEnd: 28885 }],
        },
        "12/1973": {
            "Baltimore": [{ label: "A-S", certStart: 29575, certEnd: 29918 }, { label: "S-Z", certStart: 29919, certEnd: 29995 }],
            "Baltimore City": [{ label: "A-J", certStart: 29996, certEnd: 30482 }, { label: "K-Z", certStart: 30483, certEnd: 31054 }],
            "Montgomery": [{ label: "A-R", certStart: 31374, certEnd: 31619 }, { label: "S-Z", certStart: 31620, certEnd: 31688 }],
        },
        "01/1974": {
            "Baltimore": [{ label: "A-S", certStart: 209, certEnd: 567 }, { label: "T-Z", certStart: 568, certEnd: 627 }],
            "Baltimore City": [{ label: "A-J", certStart: 628, certEnd: 1126 }, { label: "K-Z", certStart: 1127, certEnd: 1681 }],
            "Montgomery": [{ label: "A-P", certStart: 1989, certEnd: 2234 }, { label: "R-Z", certStart: 2235, certEnd: 2315 }],
        },
        "02/1974": {
            "Baltimore City": [{ label: "A-L", certStart: 3316, certEnd: 3832 }, { label: "M-Z", certStart: 3833, certEnd: 4245 }],
            "Montgomery": [{ label: "A-S", certStart: 4554, certEnd: 4829 }, { label: "T-Z", certStart: 4830, certEnd: 4860 }],
        },
        "03/1974": {
            "Baltimore": [{ label: "A-O", certStart: 5547, certEnd: 5826 }, { label: "P-Z", certStart: 5827, certEnd: 5986 }],
            "Baltimore City": [{ label: "A-F", certStart: 5987, certEnd: 6321 }, { label: "G-R", certStart: 6322, certEnd: 6837 }, { label: "R-Z", certStart: 6838, certEnd: 7134 }],
        },
        "04/1974": {
            "Baltimore": [{ label: "A-O", certStart: 8586, certEnd: 8868 }, { label: "P-Z", certStart: 8869, certEnd: 9023 }],
            "Baltimore City": [{ label: "A-F", certStart: 9024, certEnd: 9339 }, { label: "G-R", certStart: 9340, certEnd: 9841 }, { label: "S-Z", certStart: 9842, certEnd: 10096 }],
        },
        "05/1974": {
            "Baltimore City": [{ label: "A-K", certStart: 11763, certEnd: 12282 }, { label: "L-Z", certStart: 12283, certEnd: 12794 }],
            "Montgomery": [{ label: "A-Q", certStart: 13087, certEnd: 13324 }, { label: "R-Z", certStart: 13325, certEnd: 13405 }],
        },
        "06/1974": {
            "Baltimore City": [{ label: "A-K", certStart: 14366, certEnd: 14874 }, { label: "L-Z", certStart: 14875, certEnd: 15312 }],
            "Montgomery": [{ label: "A-P", certStart: 15591, certEnd: 15810 }, { label: "R-Z", certStart: 15811, certEnd: 15888 }],
        },
        "07/1974": {
            "Baltimore": [{ label: "A-S", certStart: 16496, certEnd: 16814 }, { label: "T-Z", certStart: 16815, certEnd: 16843 }],
            "Baltimore City": [{ label: "A-K", certStart: 16844, certEnd: 17344 }, { label: "L-Z", certStart: 17345, certEnd: 17838 }],
            "Montgomery": [{ label: "A-R", certStart: 18154, certEnd: 18394 }, { label: "S-Z", certStart: 18395, certEnd: 18459 }],
        },
        "08/1974": {
            "Baltimore City": [{ label: "A-K", certStart: 19467, certEnd: 19991 }, { label: "L-Z", certStart: 19992, certEnd: 20455 }],
            "Montgomery": [{ label: "A-R", certStart: 20763, certEnd: 20992 }, { label: "S-Z", certStart: 20993, certEnd: 21050 }],
        },
        "09/1974": {
            "Baltimore": [{ label: "A-S", certStart: 21688, certEnd: 21985 }, { label: "S-Z", certStart: 21986, certEnd: 22041 }],
            "Baltimore City": [{ label: "A-J", certStart: 22042, certEnd: 22484 }, { label: "K-Z", certStart: 22485, certEnd: 22997 }],
            "Montgomery": [{ label: "A-S", certStart: 23256, certEnd: 23498 }, { label: "S-Z", certStart: 23499, certEnd: 23552 }],
        },
        "10/1974": {
            "Baltimore": [{ label: "A-W", certStart: 24189, certEnd: 24513 }, { label: "W-Z", certStart: 24514, certEnd: 24538 }],
            "Baltimore City": [{ label: "A-K", certStart: 24539, certEnd: 25046 }, { label: "L-Z", certStart: 25047, certEnd: 25532 }],
            "Montgomery": [{ label: "A-S", certStart: 25868, certEnd: 26111 }, { label: "S-Z", certStart: 26112, certEnd: 26193 }],
        },
        "11/1974": {
            "Baltimore City": [{ label: "A-K", certStart: 27195, certEnd: 27699 }, { label: "K-Z", certStart: 27700, certEnd: 28199 }],
            "Montgomery": [{ label: "A-M", certStart: 28521, certEnd: 28737 }, { label: "M-Z", certStart: 28738, certEnd: 28855 }],
        },
        "12/1974": {
            "Baltimore": [{ label: "A-O", certStart: 29491, certEnd: 29766 }, { label: "P-Z", certStart: 29767, certEnd: 29898 }],
            "Baltimore City": [{ label: "A-H", certStart: 29899, certEnd: 30286 }, { label: "H-S", certStart: 30287, certEnd: 30738 }, { label: "S-Z", certStart: 30739, certEnd: 30941 }],
            "Prince George's": [{ label: "A-G", certStart: 31625, certEnd: 31704 }, { label: "H-Z", certStart: 31705, certEnd: 31811 }],
        },
        "01/1975": {
            "Baltimore": [{ label: "A-T", certStart: 214, certEnd: 558 }, { label: "T-Z", certStart: 559, certEnd: 598 }],
            "Baltimore City": [{ label: "A-K", certStart: 599, certEnd: 1114 }, { label: "K-W", certStart: 1115, certEnd: 1670 }, { label: "W-Z", certStart: 1671, certEnd: 1684 }],
            "Montgomery": [{ label: "A-P", certStart: 1995, certEnd: 2226 }, { label: "P-Z", certStart: 2227, certEnd: 2307 }],
        },
        "02/1975": {
            "Baltimore": [{ label: "A-S", certStart: 2992, certEnd: 3301 }, { label: "S-Z", certStart: 3302, certEnd: 3364 }],
            "Baltimore City": [{ label: "A-K", certStart: 3365, certEnd: 3819 }, { label: "K-Z", certStart: 3820, certEnd: 4277 }],
            "Montgomery": [{ label: "A-S", certStart: 4590, certEnd: 4859 }, { label: "S-Z", certStart: 4860, certEnd: 4893 }],
        },
        "03/1975": {
            "Baltimore": [{ label: "A-S", certStart: 5585, certEnd: 5926 }, { label: "S-Z", certStart: 5927, certEnd: 6014 }],
            "Baltimore City": [{ label: "A-J", certStart: 6015, certEnd: 6489 }, { label: "J-W", certStart: 6490, certEnd: 7057 }, { label: "W-Z", certStart: 7058, certEnd: 7079 }],
            "Montgomery": [{ label: "A-M", certStart: 7424, certEnd: 7614 }, { label: "M-Z", certStart: 7615, certEnd: 7726 }],
        },
        "04/1975": {
            "Baltimore": [{ label: "A-S", certStart: 8388, certEnd: 8694 }, { label: "T-Z", certStart: 8695, certEnd: 8732 }],
            "Baltimore City": [{ label: "A-J", certStart: 8733, certEnd: 9210 }, { label: "K-Z", certStart: 9211, certEnd: 9732 }],
            "Montgomery": [{ label: "A-P", certStart: 10032, certEnd: 10234 }, { label: "P-Z", certStart: 10235, certEnd: 10319 }],
        },
        "05/1975": {
            "Baltimore": [{ label: "A-S", certStart: 10957, certEnd: 11277 }, { label: "T-Z", certStart: 11278, certEnd: 11318 }],
            "Baltimore City": [{ label: "A-K", certStart: 11319, certEnd: 11805 }, { label: "L-Z", certStart: 11806, certEnd: 12274 }],
            "Montgomery": [{ label: "A-R", certStart: 12600, certEnd: 12828 }, { label: "S-T", certStart: 12829, certEnd: 12894 }],
        },
        "06/1975": {
            "Baltimore": [{ label: "A-U", certStart: 13556, certEnd: 13836 }, { label: "V-Z", certStart: 13837, certEnd: 13859 }],
            "Baltimore City": [{ label: "A-K", certStart: 13860, certEnd: 14356 }, { label: "L-Z", certStart: 14357, certEnd: 14825 }],
            "Montgomery": [{ label: "A-S", certStart: 15118, certEnd: 15324 }, { label: "S-Z", certStart: 15325, certEnd: 15397 }],
        },
        "07/1975": {
            "Baltimore City": [{ label: "A-L", certStart: 16330, certEnd: 16833 }, { label: "L-Z", certStart: 16834, certEnd: 17305 }],
            "Montgomery": [{ label: "A-P", certStart: 17631, certEnd: 17828 }, { label: "P-Z", certStart: 17829, certEnd: 17923 }],
        },
        "08/1975": {
            "Baltimore": [{ label: "A-V", certStart: 18544, certEnd: 18884 }, { label: "W-Z", certStart: 18885, certEnd: 18920 }],
            "Baltimore City": [{ label: "A-L", certStart: 18821, certEnd: 19411 }, { label: "L-Z", certStart: 19412, certEnd: 19855 }],
            "Montgomery": [{ label: "A-T", certStart: 20158, certEnd: 20447 }, { label: "T-Z", certStart: 20448, certEnd: 20575 }],
        },
        "09/1975": {
            "Baltimore": [{ label: "A-R", certStart: 21122, certEnd: 21411 }, { label: "S-T", certStart: 21412, certEnd: 21483 }],
            "Baltimore City": [{ label: "A-J", certStart: 21484, certEnd: 21893 }, { label: "K-Z", certStart: 21894, certEnd: 22368 }],
            "Montgomery": [{ label: "A-R", certStart: 22633, certEnd: 22860 }, { label: "R-Z", certStart: 22861, certEnd: 22931 }],
        },
        "10/1975": {
            "Baltimore City": [{ label: "A-K", certStart: 23826, certEnd: 24331 }, { label: "L-Z", certStart: 24332, certEnd: 24799 }],
            "Montgomery": [{ label: "A-P", certStart: 25112, certEnd: 25328 }, { label: "R-Z", certStart: 25329, certEnd: 25422 }],
        },
        "11/1975": {
            "Baltimore City": [{ label: "A-L", certStart: 26372, certEnd: 26878 }, { label: "M-Z", certStart: 26879, certEnd: 27288 }],
            "Montgomery": [{ label: "A-S", certStart: 27611, certEnd: 27853 }, { label: "S-Z", certStart: 27854, certEnd: 27926 }],
        },
        "12/1975": {
            "Baltimore": [{ label: "A-T", certStart: 28561, certEnd: 28894 }, { label: "U-Z", certStart: 28895, certEnd: 28938 }],
            "Baltimore City": [{ label: "A-L", certStart: 28939, certEnd: 29446 }, { label: "L-Z", certStart: 29447, certEnd: 29954 }],
            "Montgomery": [{ label: "A-R", certStart: 30292, certEnd: 30540 }, { label: "S-Z", certStart: 30541, certEnd: 50606 }],
        },
        "01/1976": {
            "Baltimore": [{ label: "A-S", certStart: 226, certEnd: 555 }, { label: "T-Z", certStart: 556, certEnd: 600 }],
            "Baltimore City": [{ label: "A-J", certStart: 601, certEnd: 1088 }, { label: "J-W", certStart: 1089, certEnd: 1639 }, { label: "W-Z", certStart: 1640, certEnd: 1661 }],
            "Montgomery": [{ label: "A-O", certStart: 1971, certEnd: 2184 }, { label: "P-Z", certStart: 2185, certEnd: 2284 }],
        },
        "02/1976": {
            "Baltimore": [{ label: "A-P", certStart: 2934, certEnd: 3233 }, { label: "Q-Z", certStart: 3234, certEnd: 3346 }],
            "Baltimore City": [{ label: "A-G", certStart: 3347, certEnd: 3713 }, { label: "G-R", certStart: 3714, certEnd: 4214 }, { label: "R-Z", certStart: 4215, certEnd: 4503 }],
            "Montgomery": [{ label: "A-W", certStart: 4889, certEnd: 5207 }, { label: "W-Z", certStart: 5208, certEnd: 5222 }],
        },
        "03/1976": {
            "Baltimore": [{ label: "A-S", certStart: 5985, certEnd: 6298 }, { label: "S-Z", certStart: 6299, certEnd: 6368 }],
            "Baltimore City": [{ label: "A-J", certStart: 6369, certEnd: 6864 }, { label: "J-Z", certStart: 6865, certEnd: 7409 }],
            "Montgomery": [{ label: "A-R", certStart: 7736, certEnd: 7997 }, { label: "R-Z", certStart: 7998, certEnd: 8073 }],
        },
        "04/1976": {
            "Baltimore City": [{ label: "A-K", certStart: 9121, certEnd: 9619 }, { label: "L-Z", certStart: 9620, certEnd: 10129 }],
            "Montgomery": [{ label: "A-P", certStart: 10455, certEnd: 10702 }, { label: "R-Z", certStart: 10703, certEnd: 10790 }],
        },
        "05/1976": {
            "Baltimore": [{ label: "A-S", certStart: 11459, certEnd: 11781 }, { label: "T-Z", certStart: 11782, certEnd: 11818 }],
            "Baltimore City": [{ label: "A-K", certStart: 11819, certEnd: 12312 }, { label: "L-Z", certStart: 12313, certEnd: 12774 }],
            "Montgomery": [{ label: "A-S", certStart: 13095, certEnd: 13374 }, { label: "T-Z", certStart: 13375, certEnd: 13431 }],
        },
        "06/1976": {
            "Baltimore City": [{ label: "A-K", certStart: 14405, certEnd: 14902 }, { label: "L-Z", certStart: 14903, certEnd: 15343 }],
            "Montgomery": [{ label: "A-O", certStart: 15674, certEnd: 15876 }, { label: "P-Z", certStart: 15877, certEnd: 15974 }],
        },
        "07/1976": {
            "Baltimore": [{ label: "A-S", certStart: 16556, certEnd: 16844 }, { label: "T-Z", certStart: 16845, certEnd: 16891 }],
            "Baltimore City": [{ label: "A-L", certStart: 16892, certEnd: 17335 }, { label: "L-Z", certStart: 17336, certEnd: 17789 }],
            "Montgomery": [{ label: "A-R", certStart: 18088, certEnd: 18301 }, { label: "R-Z", certStart: 18302, certEnd: 18378 }],
        },
        "08/1976": {
            "Baltimore City": [{ label: "A-L", certStart: 19286, certEnd: 19798 }, { label: "M-Z", certStart: 19799, certEnd: 20209 }],
            "Montgomery": [{ label: "A-T", certStart: 20516, certEnd: 20760 }, { label: "T-Z", certStart: 20761, certEnd: 20794 }],
        },
        "09/1976": {
            "Baltimore": [{ label: "A-S", certStart: 21455, certEnd: 21729 }, { label: "S-Z", certStart: 21730, certEnd: 21805 }],
            "Baltimore City": [{ label: "A-K", certStart: 21806, certEnd: 22201 }, { label: "K-Z", certStart: 22202, certEnd: 22644 }],
            "Montgomery": [{ label: "A-P", certStart: 22933, certEnd: 23130 }, { label: "P-Z", certStart: 23131, certEnd: 23230 }],
        },
        "10/1976": {
            "Baltimore": [{ label: "A-S", certStart: 23836, certEnd: 24135 }, { label: "T-Z", certStart: 24136, certEnd: 24177 }],
            "Baltimore City": [{ label: "A-J", certStart: 24178, certEnd: 24662 }, { label: "K-Z", certStart: 24663, certEnd: 25150 }],
            "Montgomery": [{ label: "A-S", certStart: 25484, certEnd: 25726 }, { label: "S-Z", certStart: 25727, certEnd: 25805 }],
        },
        "11/1976": {
            "Baltimore": [{ label: "A-S", certStart: 26499, certEnd: 26798 }, { label: "T-Z", certStart: 26799, certEnd: 26851 }],
            "Baltimore City": [{ label: "A-K", certStart: 26852, certEnd: 27314 }, { label: "K-Z", certStart: 27315, certEnd: 27796 }],
            "Montgomery": [{ label: "A-Q", certStart: 28105, certEnd: 28342 }, { label: "R-Z", certStart: 28343, certEnd: 28435 }],
        },
        "12/1976": {
            "Baltimore": [{ label: "A-M", certStart: 29094, certEnd: 29352 }, { label: "M-Z", certStart: 29353, certEnd: 29498 }],
            "Baltimore City": [{ label: "A-G", certStart: 29499, certEnd: 29824 }, { label: "G-S", certStart: 29825, certEnd: 30294 }, { label: "S-Z", certStart: 30295, certEnd: 30525 }],
            "Prince George's": [{ label: "A-C", certStart: 31216, certEnd: 31249 }, { label: "C-Z", certStart: 31250, certEnd: 31424 }],
        },
        "01/1977": {
            "Baltimore": [{ label: "A-L", certStart: 240, certEnd: 469 }, { label: "M-Z", certStart: 470, certEnd: 642 }],
            "Baltimore City": [{ label: "A-G", certStart: 643, certEnd: 941 }, { label: "G-R", certStart: 942, certEnd: 1415 }, { label: "S-Z", certStart: 1416, certEnd: 1660 }],
            "Prince George's": [{ label: "A-C", certStart: 2322, certEnd: 2360 }, { label: "C-Z", certStart: 2361, certEnd: 2551 }],
        },
        "02/1977": {
            "Baltimore": [{ label: "A-T", certStart: 3027, certEnd: 3348 }, { label: "T-Z", certStart: 3349, certEnd: 3387 }],
            "Baltimore City": [{ label: "A-K", certStart: 3388, certEnd: 3886 }, { label: "K-Z", certStart: 3887, certEnd: 4376 }],
            "Carroll": [{ label: "A-M", certStart: 4401, certEnd: 4424 }, { label: "M-Z", certStart: 4425, certEnd: 4449 }],
            "Montgomery": [{ label: "A-R", certStart: 4723, certEnd: 4962 }, { label: "R-Z", certStart: 4963, certEnd: 5045 }],
        },
        "03/1977": {
            "Baltimore": [{ label: "A-S", certStart: 5724, certEnd: 6037 }, { label: "S-Z", certStart: 6038, certEnd: 6076 }],
            "Baltimore City": [{ label: "A-K", certStart: 6077, certEnd: 6576 }, { label: "K-Z", certStart: 6577, certEnd: 7073 }],
            "Carroll": [{ label: "A-H", certStart: 7098, certEnd: 7116 }, { label: "H-Z", certStart: 7117, certEnd: 7152 }],
            "Montgomery": [{ label: "A-R", certStart: 7422, certEnd: 7656 }, { label: "R-Z", certStart: 7657, certEnd: 7733 }],
        },
        "04/1977": {
            "Baltimore": [{ label: "A-S", certStart: 8391, certEnd: 8698 }, { label: "S-Z", certStart: 8699, certEnd: 8756 }],
            "Baltimore City": [{ label: "A-K", certStart: 8757, certEnd: 9198 }, { label: "K-Z", certStart: 9199, certEnd: 9647 }],
            "Carroll": [{ label: "A-H", certStart: 9676, certEnd: 9700 }, { label: "H-Z", certStart: 9701, certEnd: 9727 }],
            "Montgomery": [{ label: "A-S", certStart: 9979, certEnd: 10204 }, { label: "S-Z", certStart: 10205, certEnd: 10249 }],
        },
        "05/1977": {
            "Baltimore": [{ label: "A-W", certStart: 10935, certEnd: 11230 }, { label: "W-Z", certStart: 11231, certEnd: 11238 }],
            "Baltimore City": [{ label: "A-M", certStart: 11239, certEnd: 11751 }, { label: "M-Z", certStart: 11752, certEnd: 12154 }],
            "Montgomery": [{ label: "A-S", certStart: 12513, certEnd: 12787 }, { label: "T-Z", certStart: 12788, certEnd: 12828 }],
        },
        "06/1977": {
            "Baltimore": [{ label: "A-T", certStart: 13498, certEnd: 13788 }, { label: "T-Z", certStart: 13789, certEnd: 13816 }],
            "Baltimore City": [{ label: "A-K", certStart: 13817, certEnd: 14279 }, { label: "L-Z", certStart: 14280, certEnd: 14713 }],
            "Montgomery": [{ label: "A-S", certStart: 15061, certEnd: 15278 }, { label: "S-Z", certStart: 15279, certEnd: 15325 }],
        },
        "07/1977": {
            "Baltimore": [{ label: "A-S", certStart: 15996, certEnd: 16290 }, { label: "S-Z", certStart: 16291, certEnd: 16338 }],
            "Baltimore City": [{ label: "A-L", certStart: 16339, certEnd: 16825 }, { label: "L-Z", certStart: 16826, certEnd: 17250 }],
        },
        "08/1977": {
            "Baltimore City": [{ label: "A-L", certStart: 18878, certEnd: 19363 }, { label: "M-Z", certStart: 19364, certEnd: 19777 }],
            "Montgomery": [{ label: "A-R", certStart: 20094, certEnd: 20331 }, { label: "S-Z", certStart: 20332, certEnd: 20401 }],
        },
        "09/1977": {
            "Baltimore": [{ label: "A-S", certStart: 21027, certEnd: 21315 }, { label: "T-Z", certStart: 21316, certEnd: 21358 }],
            "Baltimore City": [{ label: "A-K", certStart: 21359, certEnd: 21786 }, { label: "K-Z", certStart: 21787, certEnd: 22201 }],
            "Montgomery": [{ label: "A-S", certStart: 22489, certEnd: 22739 }, { label: "S-Z", certStart: 22740, certEnd: 22795 }],
        },
        "10/1977": {
            "Baltimore": [{ label: "A-S", certStart: 23398, certEnd: 23719 }, { label: "T-Z", certStart: 23720, certEnd: 23772 }],
            "Baltimore City": [{ label: "A-J", certStart: 23773, certEnd: 24249 }, { label: "K-Z", certStart: 24250, certEnd: 24760 }],
            "Montgomery": [{ label: "A-O", certStart: 25095, certEnd: 25319 }, { label: "P-Z", certStart: 25320, certEnd: 25430 }],
        },
        "11/1977": {
            "Baltimore City": [{ label: "A-K", certStart: 26396, certEnd: 26904 }, { label: "L-Z", certStart: 26905, certEnd: 27380 }],
            "Montgomery": [{ label: "A-Q", certStart: 27716, certEnd: 27955 }, { label: "R-Z", certStart: 27956, certEnd: 28037 }],
        },
        "12/1977": {
            "Baltimore": [{ label: "A-R", certStart: 28734, certEnd: 29042 }, { label: "S-Z", certStart: 29043, certEnd: 29147 }],
            "Baltimore City": [{ label: "A-K", certStart: 29148, certEnd: 29636 }, { label: "K-Z", certStart: 29637, certEnd: 30119 }],
            "Montgomery": [{ label: "A-S", certStart: 30496, certEnd: 30782 }, { label: "S-Z", certStart: 30783, certEnd: 30848 }],
        },
        "01/1978": {
            "Baltimore": [{ label: "A-M", certStart: 280, certEnd: 548 }, { label: "M-Z", certStart: 549, certEnd: 723 }],
            "Baltimore City": [{ label: "A-G", certStart: 724, certEnd: 1100 }, { label: "H-S", certStart: 1101, certEnd: 1652 }, { label: "S-Z", certStart: 1653, certEnd: 1906 }],
            "Prince George's": [{ label: "A-B", certStart: 2719, certEnd: 2747 }, { label: "C-Z", certStart: 2748, certEnd: 2951 }],
        },
        "02/1978": {
            "Baltimore": [{ label: "A-W", certStart: 3512, certEnd: 3813 }, { label: "W-Z", certStart: 3814, certEnd: 3838 }],
            "Baltimore City": [{ label: "A-L", certStart: 3839, certEnd: 4343 }, { label: "L-Z", certStart: 4344, certEnd: 4821 }],
            "Montgomery": [{ label: "A-S", certStart: 5141, certEnd: 5384 }, { label: "S-Z", certStart: 5385, certEnd: 5439 }],
        },
        "03/1978": {
            "Baltimore": [{ label: "A-V", certStart: 6128, certEnd: 6464 }, { label: "W-Z", certStart: 6465, certEnd: 6481 }],
            "Baltimore City": [{ label: "A-K", certStart: 6482, certEnd: 7015 }, { label: "K-Z", certStart: 7016, certEnd: 7513 }],
            "Montgomery": [{ label: "A-S", certStart: 7855, certEnd: 8123 }, { label: "S-Z", certStart: 8124, certEnd: 8179 }],
        },
        "04/1978": {
            "Baltimore": [{ label: "A-R", certStart: 8929, certEnd: 9196 }, { label: "S-Z", certStart: 9197, certEnd: 9262 }],
            "Baltimore City": [{ label: "A-K", certStart: 9263, certEnd: 9713 }, { label: "K-Z", certStart: 9714, certEnd: 10182 }],
            "Montgomery": [{ label: "A-S", certStart: 10496, certEnd: 10761 }, { label: "T-Z", certStart: 10762, certEnd: 10798 }],
        },
        "05/1978": {
            "Baltimore": [{ label: "A-T", certStart: 11499, certEnd: 11805 }, { label: "V-Z", certStart: 11806, certEnd: 11832 }],
            "Baltimore City": [{ label: "A-K", certStart: 11833, certEnd: 12341 }, { label: "K-Z", certStart: 12342, certEnd: 12803 }],
            "Montgomery": [{ label: "A-T", certStart: 13146, certEnd: 13424 }, { label: "V-Z", certStart: 13245, certEnd: 13450 }],
        },
        "06/1978": {
            "Baltimore": [{ label: "A-W", certStart: 14146, certEnd: 14446 }, { label: "W-Z", certStart: 14447, certEnd: 14457 }],
            "Baltimore City": [{ label: "A-L", certStart: 14458, certEnd: 14938 }, { label: "L-Z", certStart: 14939, certEnd: 15378 }],
            "Montgomery": [{ label: "A-S", certStart: 15657, certEnd: 15921 }, { label: "T-Z", certStart: 15922, certEnd: 15961 }],
        },
        "07/1978": {
            "Baltimore": [{ label: "A-S", certStart: 16653, certEnd: 16940 }, { label: "S-Z", certStart: 16941, certEnd: 16991 }],
            "Baltimore City": [{ label: "A-K", certStart: 16992, certEnd: 17473 }, { label: "K-Z", certStart: 17474, certEnd: 17935 }],
            "Montgomery": [{ label: "A-S", certStart: 18268, certEnd: 18529 }, { label: "S-Z", certStart: 18530, certEnd: 18573 }],
        },
        "08/1978": {
            "Baltimore City": [{ label: "A-A", certStart: 19552, certEnd: 19567 }, { label: "A-L", certStart: 19568, certEnd: 20075 }, { label: "L-Z", certStart: 20076, certEnd: 20465 }],
        },
        "09/1978": {
            "Baltimore": [{ label: "A-T", certStart: 21803, certEnd: 22092 }, { label: "U-Z", certStart: 22093, certEnd: 22122 }],
            "Baltimore City": [{ label: "A-L", certStart: 22123, certEnd: 22589 }, { label: "L-Z", certStart: 22590, certEnd: 23008 }],
            "Montgomery": [{ label: "A-R", certStart: 23324, certEnd: 23339 }, { label: "S-Z", certStart: 23340, certEnd: 23570 }],
        },
        "10/1978": {
            "Baltimore": [{ label: "A-O", certStart: 24149, certEnd: 24287 }, { label: "P-Z", certStart: 24288, certEnd: 24542 }],
            "Baltimore City": [{ label: "A-G", certStart: 24543, certEnd: 24657 }, { label: "H-S", certStart: 24658, certEnd: 25008 }, { label: "S-Z", certStart: 25009, certEnd: 25480 }],
            "Prince George's": [{ label: "A-F", certStart: 26334, certEnd: 26412 }, { label: "G-Z", certStart: 26413, certEnd: 26601 }],
        },
        "11/1978": {
            "Baltimore": [{ label: "A-S", certStart: 27112, certEnd: 27415 }, { label: "S-Z", certStart: 27416, certEnd: 27467 }],
            "Baltimore City": [{ label: "A-K", certStart: 27468, certEnd: 27936 }, { label: "K-Z", certStart: 27937, certEnd: 28413 }],
            "Montgomery": [{ label: "A-R", certStart: 28739, certEnd: 28982 }, { label: "S-Z", certStart: 28983, certEnd: 29052 }],
        },
        "12/1978": {
            "Baltimore": [{ label: "A-M", certStart: 29771, certEnd: 29994 }, { label: "M-Z", certStart: 29995, certEnd: 30163 }],
            "Baltimore City": [{ label: "A-F", certStart: 30164, certEnd: 30476 }, { label: "G-S", certStart: 30477, certEnd: 30968 }, { label: "S-Z", certStart: 30969, certEnd: 31210 }],
            "Harford": [{ label: "A-B", certStart: 31445, certEnd: 31448 }, { label: "B-Z", certStart: 31449, certEnd: 31511 }],
            "Prince George's": [{ label: "A-C", certStart: 31906, certEnd: 31934 }, { label: "C-Z", certStart: 31935, certEnd: 32137 }],
        },
        "01/1979": {
            "Baltimore": [{ label: "A-O", certStart: 216, certEnd: 456 }, { label: "P-Z", certStart: 457, certEnd: 569 }],
            "Baltimore City": [{ label: "A-G", certStart: 570, certEnd: 924 }, { label: "G-S", certStart: 925, certEnd: 1366 }, { label: "S-Z", certStart: 1367, certEnd: 1561 }],
            "Prince George's": [{ label: "A-G", certStart: 2239, certEnd: 2325 }, { label: "H-Z", certStart: 2326, certEnd: 2491 }],
        },
        "02/1979": {
            "Baltimore City": [{ label: "A-K", certStart: 3267, certEnd: 3771 }, { label: "L-Z", certStart: 3772, certEnd: 4256 }],
            "Montgomery": [{ label: "A-S", certStart: 4587, certEnd: 4822 }, { label: "T-Z", certStart: 4823, certEnd: 4860 }],
        },
        "03/1979": {
            "Baltimore": [{ label: "A-S", certStart: 5541, certEnd: 5873 }, { label: "T-Z", certStart: 5874, certEnd: 5923 }],
            "Baltimore City": [{ label: "A-L", certStart: 5924, certEnd: 6421 }, { label: "M-Z", certStart: 6422, certEnd: 6843 }],
        },
        "04/1979": {
            "Baltimore": [{ label: "A-P", certStart: 8193, certEnd: 8473 }, { label: "R-Z", certStart: 8474, certEnd: 8577 }],
            "Baltimore City": [{ label: "A-J", certStart: 8578, certEnd: 9011 }, { label: "K-Z", certStart: 9012, certEnd: 9457 }],
        },
        "05/1979": {
            "Baltimore": [{ label: "A-S", certStart: 10747, certEnd: 11076 }, { label: "T-Z", certStart: 11077, certEnd: 11129 }],
            "Baltimore City": [{ label: "A-J", certStart: 11130, certEnd: 11573 }, { label: "K-Z", certStart: 11574, certEnd: 12111 }],
            "Montgomery": [{ label: "A-S", certStart: 12469, certEnd: 12748 }, { label: "T-Z", certStart: 12749, certEnd: 12794 }],
        },
        "06/1979": {
            "Baltimore": [{ label: "A-S", certStart: 13527, certEnd: 13840 }, { label: "T-Z", certStart: 13841, certEnd: 13876 }],
            "Baltimore City": [{ label: "A-J", certStart: 13877, certEnd: 14308 }, { label: "K-Z", certStart: 14309, certEnd: 14816 }],
            "Montgomery": [{ label: "A-S", certStart: 15139, certEnd: 15400 }, { label: "T-Z", certStart: 15401, certEnd: 15433 }],
        },
        "07/1979": {
            "Baltimore": [{ label: "A-S", certStart: 16137, certEnd: 16430 }, { label: "S-Z", certStart: 16431, certEnd: 16492 }],
            "Baltimore City": [{ label: "A-K", certStart: 16493, certEnd: 16951 }, { label: "K-Z", certStart: 16952, certEnd: 17402 }],
            "Montgomery": [{ label: "A-S", certStart: 17722, certEnd: 17995 }, { label: "T-Z", certStart: 17996, certEnd: 18034 }],
        },
        "08/1979": {
            "Baltimore City": [{ label: "A", certStart: 19036, certEnd: 19057 }, { label: "B-L", certStart: 19058, certEnd: 19579 }, { label: "M-Z", certStart: 19580, certEnd: 20001 }],
        },
        "09/1979": {
            "Baltimore City": [{ label: "A-L", certStart: 21665, certEnd: 22179 }, { label: "M-Z", certStart: 22180, certEnd: 22568 }],
        },
        "10/1979": {
            "Baltimore": [{ label: "A-R", certStart: 23824, certEnd: 24110 }, { label: "S-Z", certStart: 24111, certEnd: 24204 }],
            "Baltimore City": [{ label: "A-K", certStart: 24205, certEnd: 24699 }, { label: "L-Z", certStart: 24700, certEnd: 25198 }],
            "Montgomery": [{ label: "A-S", certStart: 25578, certEnd: 25894 }, { label: "T-Z", certStart: 25895, certEnd: 25942 }],
        },
        "11/1979": {
            "Baltimore": [{ label: "A-R", certStart: 26669, certEnd: 26976 }, { label: "S-Z", certStart: 26977, certEnd: 27065 }],
            "Baltimore City": [{ label: "A-J", certStart: 27066, certEnd: 27533 }, { label: "K-Z", certStart: 27534, certEnd: 27996 }],
        },
        "12/1979": {
            "Baltimore": [{ label: "A-M", certStart: 29348, certEnd: 29627 }, { label: "N-Z", certStart: 29628, certEnd: 29756 }],
            "Baltimore City": [{ label: "A-G", certStart: 29757, certEnd: 30120 }, { label: "H-S", certStart: 30121, certEnd: 30680 }, { label: "T-Z", certStart: 30681, certEnd: 30809 }],
        },
        "01/1980": {
            "Baltimore": [{ label: "A-R", certStart: 246, certEnd: 550 }, { label: "S-Z", certStart: 551, certEnd: 643 }],
            "Baltimore City": [{ label: "A-K", certStart: 644, certEnd: 1117 }, { label: "L-Z", certStart: 1118, certEnd: 1600 }],
        },
        "02/1980": {
            "Baltimore": [{ label: "A-R", certStart: 3008, certEnd: 3331 }, { label: "S-Z", certStart: 3332, certEnd: 3413 }],
            "Baltimore City": [{ label: "A-K", certStart: 3414, certEnd: 3926 }, { label: "L-Z", certStart: 3927, certEnd: 4367 }],
        },
        "03/1980": {
            "Baltimore": [{ label: "A-L", certStart: 5851, certEnd: 6098 }, { label: "M-Z", certStart: 6099, certEnd: 6299 }],
            "Baltimore City": [{ label: "A-G", certStart: 6300, certEnd: 6658 }, { label: "H-V", certStart: 6659, certEnd: 7247 }, { label: "W-Z", certStart: 7248, certEnd: 7346 }],
            "Prince George's": [{ label: "A-G", certStart: 8084, certEnd: 8175 }, { label: "H-Z", certStart: 8176, certEnd: 8327 }],
        },
        "04/1980": {
            "Baltimore": [{ label: "A-Sh", certStart: 8883, certEnd: 9189 }, { label: "Si-Z", certStart: 9190, certEnd: 9258 }],
            "Baltimore City": [{ label: "A-J", certStart: 9259, certEnd: 9737 }, { label: "K-Z", certStart: 9738, certEnd: 10226 }],
            "Montgomery": [{ label: "A-P", certStart: 10550, certEnd: 10782 }, { label: "R-Z", certStart: 10783, certEnd: 10846 }],
        },
        "05/1980": {
            "Baltimore": [{ label: "A-S", certStart: 11519, certEnd: 11854 }, { label: "T-Z", certStart: 11855, certEnd: 11894 }],
            "Baltimore City": [{ label: "A-K", certStart: 11895, certEnd: 12390 }, { label: "L-Z", certStart: 12391, certEnd: 12865 }],
            "Montgomery": [{ label: "A-T", certStart: 13179, certEnd: 13446 }, { label: "U-Z", certStart: 13447, certEnd: 13474 }],
        },
        "06/1980": {
            "Baltimore": [{ label: "A-S", certStart: 14174, certEnd: 14477 }, { label: "T-Z", certStart: 14478, certEnd: 14523 }],
            "Baltimore City": [{ label: "A-K", certStart: 14524, certEnd: 14994 }, { label: "L-Z", certStart: 14995, certEnd: 15452 }],
            "Montgomery": [{ label: "A-T", certStart: 15757, certEnd: 16017 }, { label: "U-Z", certStart: 16018, certEnd: 16042 }],
        },
        "07/1980": {
            "Baltimore": [{ label: "A-S", certStart: 16767, certEnd: 17081 }, { label: "T-Z", certStart: 17082, certEnd: 17131 }],
            "Baltimore City": [{ label: "A-J", certStart: 17132, certEnd: 17604 }, { label: "K-Z", certStart: 17605, certEnd: 18135 }],
            "Montgomery": [{ label: "A-S", certStart: 18464, certEnd: 18712 }, { label: "T-Z", certStart: 18713, certEnd: 18746 }],
        },
        "08/1980": {
            "Baltimore": [{ label: "A-T", certStart: 19471, certEnd: 19781 }, { label: "V-Z", certStart: 19782, certEnd: 19812 }],
            "Baltimore City": [{ label: "A-L", certStart: 19813, certEnd: 20320 }, { label: "M-Z", certStart: 20321, certEnd: 20754 }],
            "Montgomery": [{ label: "A-N", certStart: 21083, certEnd: 21279 }, { label: "O-Z", certStart: 21280, certEnd: 21362 }],
        },
        "09/1980": {
            "Baltimore": [{ label: "A-M", certStart: 22040, certEnd: 22266 }, { label: "N-Z", certStart: 22267, certEnd: 22401 }],
            "Baltimore City": [{ label: "A-G", certStart: 22402, certEnd: 22729 }, { label: "H-Sh", certStart: 22730, certEnd: 23149 }, { label: "Si-Z", certStart: 23150, certEnd: 23331 }],
        },
        "10/1980": {
            "Baltimore": [{ label: "A-R", certStart: 24706, certEnd: 24999 }, { label: "S-Z", certStart: 25000, certEnd: 25083 }],
            "Baltimore City": [{ label: "A-H", certStart: 25084, certEnd: 25519 }, { label: "I-Z", certStart: 25520, certEnd: 25989 }],
        },
        "11/1980": {
            "Baltimore": [{ label: "A-Re", certStart: 27367, certEnd: 27689 }, { label: "Ri-Z", certStart: 27690, certEnd: 27783 }],
            "Baltimore City": [{ label: "A-Ke", certStart: 27784, certEnd: 28249 }, { label: "Ki-Z", certStart: 28250, certEnd: 28719 }],
            "Montgomery": [{ label: "A-R", certStart: 29088, certEnd: 29362 }, { label: "S-Z", certStart: 29363, certEnd: 29433 }],
        },
        "12/1980": {
            "Baltimore": [{ label: "A-Hi", certStart: 30205, certEnd: 30431 }, { label: "Ho-Z", certStart: 30432, certEnd: 30727 }],
            "Baltimore City": [{ label: "A-Co", certStart: 30728, certEnd: 30938 }, { label: "Cr-Mc", certStart: 30939, certEnd: 31443 }, { label: "Me-Z", certStart: 31444, certEnd: 31939 }],
            "Montgomery": [{ label: "A-C", certStart: 32371, certEnd: 32463 }, { label: "D-Z", certStart: 32464, certEnd: 32772 }],
            "Prince George's": [{ label: "A-R", certStart: 32773, certEnd: 32969 }, { label: "S-Z", certStart: 32970, certEnd: 33027 }],
        },
        "01/1981": {
            "Baltimore": [{ label: "A-Mc", certStart: 284, certEnd: 562 }, { label: "Me-Z", certStart: 563, certEnd: 758 }],
            "Baltimore City": [{ label: "A-Gi", certStart: 759, certEnd: 1123 }, { label: "Gn-Sh", certStart: 1124, certEnd: 1683 }, { label: "Si-Z", certStart: 1684, certEnd: 1936 }],
            "Prince George's": [{ label: "A-Ho", certStart: 2705, certEnd: 2827 }, { label: "Hu-Z", certStart: 2828, certEnd: 2998 }],
        },
        "02/1981": {
            "Baltimore": [{ label: "A-Sm", certStart: 3569, certEnd: 3892 }, { label: "So-Z", certStart: 3893, certEnd: 3957 }],
            "Baltimore City": [{ label: "A-Ko", certStart: 3958, certEnd: 4428 }, { label: "Kr-Z", certStart: 4429, certEnd: 4910 }],
            "Montgomery": [{ label: "A-Sh", certStart: 5230, certEnd: 5496 }, { label: "Si-Z", certStart: 5497, certEnd: 5565 }],
        },
        "03/1981": {
            "Baltimore": [{ label: "A-R", certStart: 6306, certEnd: 6597 }, { label: "S-Z", certStart: 6598, certEnd: 6675 }],
            "Baltimore City": [{ label: "A-J", certStart: 6676, certEnd: 7143 }, { label: "K-Z", certStart: 7144, certEnd: 7675 }],
            "Montgomery": [{ label: "A-S", certStart: 8052, certEnd: 8316 }, { label: "T-Z", certStart: 8317, certEnd: 8353 }],
        },
        "04/1981": {
            "Baltimore": [{ label: "A-Sc", certStart: 9145, certEnd: 9422 }, { label: "Se-Z", certStart: 9423, certEnd: 9490 }],
            "Baltimore City": [{ label: "A-He", certStart: 9491, certEnd: 9838 }, { label: "Hi-Wa", certStart: 9839, certEnd: 10340 }, { label: "We-Z", certStart: 10341, certEnd: 10404 }],
            "Montgomery": [{ label: "A-Dy", certStart: 10754, certEnd: 10842 }, { label: "E-Z", certStart: 10843, certEnd: 11089 }],
            "Prince George's": [{ label: "A-L", certStart: 11090, certEnd: 11219 }, { label: "M-Z", certStart: 11220, certEnd: 11336 }],
        },
        "05/1981": {
            "Baltimore": [{ label: "A-M", certStart: 11855, certEnd: 12062 }, { label: "Mc-Z", certStart: 12063, certEnd: 12222 }],
            "Baltimore City": [{ label: "A-Go", certStart: 12223, certEnd: 12525 }, { label: "Gr-Si", certStart: 12526, certEnd: 12993 }, { label: "Sk-Z", certStart: 12994, certEnd: 13191 }],
            "Prince George's": [{ label: "A-Ca", certStart: 13849, certEnd: 13879 }, { label: "Ch-Z", certStart: 13880, certEnd: 14086 }],
        },
        "06/1981": {
            "Baltimore": [{ label: "A-Mo", certStart: 14585, certEnd: 14805 }, { label: "Mu-Z", certStart: 14806, certEnd: 14931 }],
            "Baltimore City": [{ label: "A-Gre", certStart: 14932, certEnd: 15231 }, { label: "Gri-Sc", certStart: 15232, certEnd: 15656 }, { label: "Se-Z", certStart: 15657, certEnd: 15850 }],
            "Prince George's": [{ label: "A-B", certStart: 16497, certEnd: 16522 }, { label: "C-Z", certStart: 16523, certEnd: 16721 }],
        },
        "07/1981": {
            "Baltimore City": [{ label: "A-L", certStart: 17544, certEnd: 18056 }, { label: "M-Z", certStart: 18057, certEnd: 18484 }],
            "Prince George's": [{ label: "A-B", certStart: 19120, certEnd: 19157 }, { label: "C-Z", certStart: 19158, certEnd: 19389 }],
        },
        "08/1981": {
            "Baltimore": [{ label: "A-R", certStart: 19914, certEnd: 20199 }, { label: "S-Z", certStart: 20200, certEnd: 20281 }],
            "Baltimore City": [{ label: "A-K", certStart: 20282, certEnd: 20763 }, { label: "L-Z", certStart: 20764, certEnd: 21203 }],
            "Montgomery": [{ label: "A-R", certStart: 21563, certEnd: 21785 }, { label: "S-Z", certStart: 21786, certEnd: 21854 }],
        },
        "09/1981": {
            "Baltimore": [{ label: "A-Q", certStart: 22561, certEnd: 22842 }, { label: "R-Z", certStart: 22843, certEnd: 22928 }],
            "Baltimore City": [{ label: "A-L", certStart: 22929, certEnd: 23395 }, { label: "M-Z", certStart: 23396, certEnd: 23810 }],
        },
        "10/1981": {
            "Baltimore": [{ label: "A-M", certStart: 25216, certEnd: 25453 }, { label: "N-Z", certStart: 25454, certEnd: 25596 }],
            "Baltimore City": [{ label: "A-H", certStart: 25597, certEnd: 26012 }, { label: "I-V", certStart: 26013, certEnd: 26481 }, { label: "W-Z", certStart: 26482, certEnd: 26546 }],
            "Prince George's": [{ label: "A-N", certStart: 27221, certEnd: 27364 }, { label: "P-Z", certStart: 27365, certEnd: 27460 }],
        },
        "11/1981": {
            "Baltimore": [{ label: "A-M", certStart: 28002, certEnd: 28213 }, { label: "N-Z", certStart: 28214, certEnd: 28353 }],
            "Baltimore City": [{ label: "A-G", certStart: 28354, certEnd: 28568 }, { label: "H-S", certStart: 28569, certEnd: 29111 }, { label: "T-Z", certStart: 29112, certEnd: 29222 }],
            "Prince George's": [{ label: "A-F", certStart: 29945, certEnd: 30015 }, { label: "G-Z", certStart: 30016, certEnd: 30181 }],
        },
        "12/1981": {
            "Baltimore": [{ label: "A-Ma", certStart: 30737, certEnd: 30975 }, { label: "Mc-Z", certStart: 30976, certEnd: 31142 }],
            "Baltimore City": [{ label: "A-G", certStart: 31143, certEnd: 31474 }, { label: "Go-Sn", certStart: 31475, certEnd: 31993 }, { label: "So-Z", certStart: 31994, certEnd: 32167 }],
            "Prince George's": [{ label: "A-G", certStart: 32904, certEnd: 33003 }, { label: "H-Z", certStart: 33004, certEnd: 33182 }],
        },
        "01/1982": {
            "Baltimore": [{ label: "A-N", certStart: 250, certEnd: 499 }, { label: "O-Z", certStart: 500, certEnd: 631 }],
            "Baltimore City": [{ label: "A-G", certStart: 632, certEnd: 1021 }, { label: "H-S", certStart: 1022, certEnd: 1543 }, { label: "T-Z", certStart: 1544, certEnd: 1668 }],
            "Prince George's": [{ label: "A-Ma", certStart: 2404, certEnd: 2540 }, { label: "Mc-Z", certStart: 2541, certEnd: 2635 }],
        },
        "02/1982": {
            "Baltimore City": [{ label: "A-L", certStart: 3491, certEnd: 3981 }, { label: "M-Z", certStart: 3982, certEnd: 4377 }],
        },
        "03/1982": {
            "Baltimore": [{ label: "A-M", certStart: 5659, certEnd: 5940 }, { label: "N-Z", certStart: 5941, certEnd: 6073 }],
            "Baltimore City": [{ label: "A-I", certStart: 6074, certEnd: 6486 }, { label: "J-Z", certStart: 6487, certEnd: 7016 }],
            "Montgomery": [{ label: "A-G", certStart: 7395, certEnd: 7516 }, { label: "H-Z", certStart: 7517, certEnd: 7735 }],
        },
        "04/1982": {
            "Baltimore": [{ label: "A-M", certStart: 8489, certEnd: 8763 }, { label: "N-Z", certStart: 8764, certEnd: 8907 }],
            "Baltimore City": [{ label: "A-F", certStart: 8908, certEnd: 9216 }, { label: "G-R", certStart: 9217, certEnd: 9676 }, { label: "S-Z", certStart: 9677, certEnd: 9891 }],
            "Prince George's": [{ label: "A-D", certStart: 10615, certEnd: 10672 }, { label: "E-Z", certStart: 10673, certEnd: 10840 }],
        },
        "05/1982": {
            "Baltimore": [{ label: "A-N", certStart: 11368, certEnd: 11635 }, { label: "O-Z", certStart: 11636, certEnd: 11750 }],
            "Baltimore City": [{ label: "A-Ha", certStart: 11752, certEnd: 12130 }, { label: "He-S", certStart: 12131, certEnd: 12630 }, { label: "T-Z", certStart: 12631, certEnd: 12789 }],
            "Prince George's": [{ label: "A-K", certStart: 13492, certEnd: 13618 }, { label: "L-Z", certStart: 13619, certEnd: 13750 }],
        },
        "06/1982": {
            "Baltimore City": [{ label: "A-L", certStart: 14595, certEnd: 15164 }, { label: "M-Z", certStart: 15165, certEnd: 15579 }],
        },
        "07/1982": {
            "Baltimore": [{ label: "A-W", certStart: 16968, certEnd: 17278 }, { label: "W-Z", certStart: 17279, certEnd: 17301 }],
            "Baltimore City": [{ label: "A-Le", certStart: 17302, certEnd: 17836 }, { label: "Li-Z", certStart: 17837, certEnd: 18308 }],
        },
        "08/1982": {
            "Baltimore": [{ label: "A-S", certStart: 19728, certEnd: 20061 }, { label: "T-Z", certStart: 20062, certEnd: 20122 }],
            "Baltimore City": [{ label: "A-L", certStart: 20123, certEnd: 20624 }, { label: "M-Z", certStart: 20625, certEnd: 21048 }],
            "Prince George's": [{ label: "A-B", certStart: 21719, certEnd: 21743 }, { label: "C-Z", certStart: 21744, certEnd: 21936 }],
        },
        "09/1982": {
            "Baltimore": [{ label: "A-Sta", certStart: 22472, certEnd: 22752 }, { label: "Ste-Z", certStart: 22753, certEnd: 22805 }],
            "Baltimore City": [{ label: "A-L", certStart: 22806, certEnd: 23257 }, { label: "M-Z", certStart: 23258, certEnd: 23649 }],
            "Prince George's": [{ label: "A-B", certStart: 24289, certEnd: 24308 }, { label: "C-Z", certStart: 24309, certEnd: 24510 }],
        },
        "10/1982": {
            "Baltimore": [{ label: "A-N", certStart: 25046, certEnd: 25281 }, { label: "O-Z", certStart: 25282, certEnd: 25419 }],
            "Baltimore City": [{ label: "A-G", certStart: 25420, certEnd: 25756 }, { label: "H-So", certStart: 25757, certEnd: 26227 }, { label: "Sp-Z", certStart: 26228, certEnd: 26409 }],
            "Prince George's": [{ label: "A-Ha", certStart: 27095, certEnd: 27189 }, { label: "He-Z", certStart: 27190, certEnd: 27332 }],
        },
        "11/1982": {
            "Baltimore": [{ label: "A-Se", certStart: 27900, certEnd: 28194 }, { label: "Sh-Z", certStart: 28195, certEnd: 28271 }],
            "Baltimore City": [{ label: "A-K", certStart: 28272, certEnd: 28753 }, { label: "L-Z", certStart: 28754, certEnd: 29198 }],
            "Montgomery": [{ label: "A-S", certStart: 29535, certEnd: 29845 }, { label: "T-Z", certStart: 29846, certEnd: 29870 }],
        },
        "12/1982": {
            "Baltimore": [{ label: "A-O", certStart: 30644, certEnd: 30898 }, { label: "P-Z", certStart: 30899, certEnd: 31034 }],
            "Baltimore City": [{ label: "A-Gu", certStart: 31035, certEnd: 31403 }, { label: "Gw-So", certStart: 31404, certEnd: 31904 }, { label: "Sp-Z", certStart: 31905, certEnd: 32086 }],
            "Prince George's": [{ label: "A-G", certStart: 32826, certEnd: 32924 }, { label: "H-Z", certStart: 32925, certEnd: 33109 }],
        },
        "01/1983": {
            "Baltimore": [{ label: "A-Ma", certStart: 254, certEnd: 475 }, { label: "Mc-Z", certStart: 476, certEnd: 634 }],
            "Baltimore City": [{ label: "A-G", certStart: 635, certEnd: 971 }, { label: "H-Ti", certStart: 972, certEnd: 1441 }, { label: "To-Z", certStart: 1442, certEnd: 1544 }],
            "Prince George's": [{ label: "A-G", certStart: 2288, certEnd: 2377 }, { label: "H-Z", certStart: 2378, certEnd: 2567 }],
        },
        "02/1983": {
            "Baltimore": [{ label: "A-L", certStart: 3125, certEnd: 3322 }, { label: "M-Z", certStart: 3323, certEnd: 3513 }],
            "Baltimore City": [{ label: "A-Gr", certStart: 3514, certEnd: 3826 }, { label: "Gu-R", certStart: 3827, certEnd: 4222 }, { label: "S-Z", certStart: 4223, certEnd: 4431 }],
        },
        "03/1983": {
            "Baltimore": [{ label: "A-M", certStart: 6001, certEnd: 6248 }, { label: "N-Z", certStart: 6249, certEnd: 6392 }],
            "Baltimore City": [{ label: "A-G", certStart: 6393, certEnd: 6763 }, { label: "H-S", certStart: 6764, certEnd: 7279 }, { label: "T-Z", certStart: 7280, certEnd: 7409 }],
            "Prince George's": [{ label: "A-G", certStart: 8168, certEnd: 8265 }, { label: "H-Z", certStart: 8266, certEnd: 8432 }],
        },
        "04/1983": {
            "Baltimore": [{ label: "A-L", certStart: 9035, certEnd: 9256 }, { label: "M-Z", certStart: 9257, certEnd: 9427 }],
            "Baltimore City": [{ label: "A-G", certStart: 9428, certEnd: 9751 }, { label: "H-Si", certStart: 9752, certEnd: 10238 }, { label: "Sk-Z", certStart: 10239, certEnd: 10435 }],
            "Prince George's": [{ label: "A-J", certStart: 11144, certEnd: 11235 }, { label: "K-Z", certStart: 11236, certEnd: 11365 }],
        },
        "05/1983": {
            "Baltimore": [{ label: "A-Oe", certStart: 11920, certEnd: 12158 }, { label: "On-Z", certStart: 12159, certEnd: 12288 }],
            "Baltimore City": [{ label: "A-Harp", certStart: 12259, certEnd: 12658 }, { label: "Harr-Va", certStart: 12659, certEnd: 13158 }, { label: "Vi-Z", certStart: 13159, certEnd: 13245 }],
            "Montgomery": [{ label: "A-B", certStart: 13644, certEnd: 13658 }, { label: "B-Z", certStart: 13659, certEnd: 13966 }],
            "Prince George's": [{ label: "A-Sa", certStart: 13967, certEnd: 14158 }, { label: "Sc-Z", certStart: 14159, certEnd: 14209 }],
        },
        "06/1983": {
            "Baltimore": [{ label: "A-R", certStart: 14733, certEnd: 15009 }, { label: "R-Z", certStart: 15010, certEnd: 15102 }],
            "Baltimore City": [{ label: "A-H", certStart: 15103, certEnd: 15512 }, { label: "I-Wa", certStart: 15513, certEnd: 16011 }, { label: "We-Z", certStart: 16012, certEnd: 16063 }],
            "Montgomery": [{ label: "A-C", certStart: 16463, certEnd: 16511 }, { label: "C-Z", certStart: 16512, certEnd: 16780 }],
            "Queen Anne's": [{ label: "A-Mi", certStart: 17006, certEnd: 17011 }, { label: "Mo-Z", certStart: 17012, certEnd: 17018 }],
        },
        "07/1983": {
            "Baltimore": [{ label: "A-Sc", certStart: 17508, certEnd: 17818 }, { label: "Sh-Z", certStart: 17819, certEnd: 17890 }],
            "Baltimore City": [{ label: "A-K", certStart: 17891, certEnd: 18379 }, { label: "K-Z", certStart: 18380, certEnd: 18837 }],
        },
        "08/1983": {
            "Baltimore": [{ label: "A-M", certStart: 20292, certEnd: 20536 }, { label: "N-Z", certStart: 20537, certEnd: 20685 }],
            "Baltimore City": [{ label: "A-Gra", certStart: 20686, certEnd: 20996 }, { label: "Gre-R", certStart: 20997, certEnd: 21393 }, { label: "S-Z", certStart: 21394, certEnd: 21622 }],
            "Prince George's": [{ label: "A-I", certStart: 22323, certEnd: 22437 }, { label: "J-Z", certStart: 22438, certEnd: 22569 }],
        },
        "09/1983": {
            "Baltimore City": [{ label: "A-Mag", certStart: 23434, certEnd: 23943 }, { label: "Mah-Z", certStart: 23944, certEnd: 24353 }],
            "Montgomery": [{ label: "A-Fr", certStart: 24719, certEnd: 24820 }, { label: "Fu-Z", certStart: 24821, certEnd: 25023 }],
        },
        "10/1983": {
            "Baltimore": [{ label: "A-N", certStart: 25843, certEnd: 26101 }, { label: "O-Z", certStart: 26102, certEnd: 26238 }],
            "Baltimore City": [{ label: "A-G", certStart: 26239, certEnd: 26587 }, { label: "H-T", certStart: 26588, certEnd: 27120 }, { label: "U-Z", certStart: 27123, certEnd: 27206 }],
            "Montgomery": [{ label: "A-B", certStart: 27567, certEnd: 27610 }, { label: "C-Z", certStart: 27611, certEnd: 27915 }],
            "Prince George's": [{ label: "A-S", certStart: 27916, certEnd: 28128 }, { label: "T-Z", certStart: 28129, certEnd: 28161 }],
        },
        "11/1983": {
            "Baltimore": [{ label: "A-L", certStart: 28695, certEnd: 28931 }, { label: "M-Z", certStart: 28932, certEnd: 29120 }],
            "Baltimore City": [{ label: "A-G", certStart: 29121, certEnd: 29447 }, { label: "H-S", certStart: 29448, certEnd: 29964 }, { label: "T-Z", certStart: 29965, certEnd: 30091 }],
            "Prince George's": [{ label: "A-D", certStart: 30884, certEnd: 30947 }, { label: "E-Z", certStart: 30948, certEnd: 31140 }],
        },
        "12/1983": {
            "Baltimore": [{ label: "A-L", certStart: 31680, certEnd: 31919 }, { label: "M-Z", certStart: 31920, certEnd: 32100 }],
            "Baltimore City": [{ label: "A-F", certStart: 32101, certEnd: 32413 }, { label: "G-R", certStart: 32414, certEnd: 32897 }, { label: "S-Z", certStart: 32898, certEnd: 33130 }],
            "Prince George's": [{ label: "A-B", certStart: 33904, certEnd: 33930 }, { label: "C-Z", certStart: 33931, certEnd: 34189 }],
            "Wicomico": [{ label: "A-B", certStart: 34411, certEnd: 34422 }, { label: "C-Z", certStart: 34423, certEnd: 34507 }],
        },
        "01/1984": {
            "Baltimore": [{ label: "A-P", certStart: 268, certEnd: 575 }, { label: "R-Z", certStart: 576, certEnd: 687 }],
            "Baltimore City": [{ label: "A-G", certStart: 688, certEnd: 1040 }, { label: "H-R", certStart: 1041, certEnd: 1463 }, { label: "S-Z", certStart: 1464, certEnd: 1703 }],
        },
        "02/1984": {
            "Baltimore": [{ label: "A-L", certStart: 3287, certEnd: 3502 }, { label: "L-Z", certStart: 3503, certEnd: 3671 }],
            "Baltimore City": [{ label: "A-G", certStart: 3672, certEnd: 3965 }, { label: "G-R", certStart: 3966, certEnd: 4388 }, { label: "R-Z", certStart: 4389, certEnd: 4629 }],
        },
        "03/1984": {
            "Baltimore": [{ label: "A-H", certStart: 6185, certEnd: 6345 }, { label: "I-Z", certStart: 6346, certEnd: 6565 }],
            "Baltimore City": [{ label: "A-D", certStart: 6566, certEnd: 6824 }, { label: "E-N", certStart: 6825, certEnd: 7258 }, { label: "O-Z", certStart: 7259, certEnd: 7592 }],
            "Montgomery": [{ label: "A-K", certStart: 7995, certEnd: 8174 }, { label: "L-Z", certStart: 8175, certEnd: 8353 }],
            "Prince George's": [{ label: "A-S", certStart: 8354, certEnd: 8587 }, { label: "T-Z", certStart: 8588, certEnd: 8620 }],
        },
        "04/1984": {
            "Baltimore": [{ label: "A-G", certStart: 9240, certEnd: 9414 }, { label: "H-Z", certStart: 9415, certEnd: 9676 }],
            "Baltimore City": [{ label: "A-C", certStart: 9677, certEnd: 9880 }, { label: "D-Po", certStart: 9881, certEnd: 10349 }, { label: "Pr-Z", certStart: 10350, certEnd: 10672 }],
            "Montgomery": [{ label: "A-C", certStart: 11058, certEnd: 11140 }, { label: "D-Z", certStart: 11141, certEnd: 11445 }],
            "Prince George's": [{ label: "A-K", certStart: 11446, certEnd: 11575 }, { label: "L-Z", certStart: 11576, certEnd: 11700 }],
        },
        "05/1984": {
            "Baltimore": [{ label: "A-Hu", certStart: 12231, certEnd: 12397 }, { label: "Hy-Z", certStart: 12398, certEnd: 12601 }],
            "Baltimore City": [{ label: "A-Fa", certStart: 12602, certEnd: 12860 }, { label: "Fe-Ra", certStart: 12861, certEnd: 13270 }, { label: "Ra-Z", certStart: 13271, certEnd: 13575 }],
            "Montgomery": [{ label: "A-Ja", certStart: 13989, certEnd: 14142 }, { label: "Ja-Z", certStart: 14143, certEnd: 14349 }],
        },
        "06/1984": {
            "Baltimore": [{ label: "A-M", certStart: 15165, certEnd: 15386 }, { label: "M-Z", certStart: 15387, certEnd: 15518 }],
            "Baltimore City": [{ label: "A-G", certStart: 15519, certEnd: 15837 }, { label: "G-S", certStart: 15838, certEnd: 16287 }, { label: "S-Z", certStart: 16288, certEnd: 16469 }],
            "Prince George's": [{ label: "A-Ke", certStart: 17144, certEnd: 17260 }, { label: "Ki-Z", certStart: 17261, certEnd: 17400 }],
        },
        "07/1984": {
            "Baltimore": [{ label: "A-Ra", certStart: 17971, certEnd: 18233 }, { label: "Ra-Z", certStart: 18234, certEnd: 18329 }],
            "Baltimore City": [{ label: "A-Ja", certStart: 18234, certEnd: 18738 }, { label: "Ja-Z", certStart: 18739, certEnd: 19240 }],
            "Montgomery": [{ label: "A-Hu", certStart: 19603, certEnd: 19741 }, { label: "Hu-Z", certStart: 19742, certEnd: 19927 }],
        },
        "08/1984": {
            "Baltimore": [{ label: "A-R", certStart: 20699, certEnd: 20976 }, { label: "R-Z", certStart: 20979, certEnd: 21079 }],
            "Baltimore City": [{ label: "A-J", certStart: 21080, certEnd: 21476 }, { label: "J-Z", certStart: 21477, certEnd: 21978 }],
            "Montgomery": [{ label: "A-Fi", certStart: 22389, certEnd: 22479 }, { label: "Fl-Z", certStart: 22480, certEnd: 22687 }],
        },
        "09/1984": {
            "Baltimore": [{ label: "A-R", certStart: 23472, certEnd: 23765 }, { label: "R-Z", certStart: 23766, certEnd: 23879 }],
            "Baltimore City": [{ label: "A-J", certStart: 23880, certEnd: 24265 }, { label: "K-W", certStart: 24266, certEnd: 24683 }, { label: "W-Z", certStart: 24684, certEnd: 24747 }],
            "Montgomery": [{ label: "A-B", certStart: 25106, certEnd: 25133 }, { label: "B-Z", certStart: 25134, certEnd: 25424 }],
            "Prince George's": [{ label: "A-M", certStart: 25425, certEnd: 25553 }, { label: "M-Z", certStart: 25554, certEnd: 25676 }],
        },
        "10/1984": {
            "Baltimore": [{ label: "A-J", certStart: 26234, certEnd: 26449 }, { label: "K-Z", certStart: 26450, certEnd: 26648 }],
            "Baltimore City": [{ label: "A-H", certStart: 26649, certEnd: 26981 }, { label: "H-S", certStart: 26982, certEnd: 27428 }, { label: "S-Z", certStart: 27429, certEnd: 27574 }],
        },
        "11/1984": {
            "Baltimore": [{ label: "A-K", certStart: 29124, certEnd: 29321 }, { label: "K-Z", certStart: 29322, certEnd: 29520 }],
            "Baltimore City": [{ label: "A-E", certStart: 29521, certEnd: 29772 }, { label: "E-R", certStart: 29773, certEnd: 30230 }, { label: "R-Z", certStart: 30231, certEnd: 30453 }],
        },
        "12/1984": {
            "Baltimore": [{ label: "A-G", certStart: 31971, certEnd: 32104 }, { label: "H-Z", certStart: 32105, certEnd: 32409 }],
            "Baltimore City": [{ label: "A-C", certStart: 32410, certEnd: 32565 }, { label: "C-Ma", certStart: 32566, certEnd: 32977 }, { label: "Ma-Z", certStart: 32978, certEnd: 33413 }],
        },
        "01/1985": {
            "Baltimore": [{ label: "A-J", certStart: 272, certEnd: 486 }, { label: "J-Z", certStart: 487, certEnd: 730 }],
            "Baltimore City": [{ label: "A-D", certStart: 731, certEnd: 945 }, { label: "D-R", certStart: 946, certEnd: 1443 }, { label: "R-Z", certStart: 1444, certEnd: 1734 }],
            "Montgomery": [{ label: "A-E", certStart: 2183, certEnd: 2287 }, { label: "E-Z", certStart: 2288, certEnd: 2580 }],
            "Prince George's": [{ label: "A-L", certStart: 2581, certEnd: 2724 }, { label: "L-Z", certStart: 2725, certEnd: 2854 }],
        },
        "02/1985": {
            "Baltimore": [{ label: "A-Ha", certStart: 3517, certEnd: 3670 }, { label: "He-Z", certStart: 3671, certEnd: 3946 }],
            "Baltimore City": [{ label: "A-C", certStart: 3947, certEnd: 4155 }, { label: "D-M", certStart: 4156, certEnd: 4625 }, { label: "N-Z", certStart: 4626, certEnd: 5017 }],
            "Montgomery": [{ label: "A-F", certStart: 5459, certEnd: 5579 }, { label: "G-Z", certStart: 5580, certEnd: 5872 }],
            "Prince George's": [{ label: "A-S", certStart: 5873, certEnd: 6114 }, { label: "T-Z", certStart: 6115, certEnd: 6145 }],
        },
        "03/1985": {
            "Baltimore": [{ label: "A-H", certStart: 6756, certEnd: 6937 }, { label: "H-Z", certStart: 6938, certEnd: 7219 }],
            "Baltimore City": [{ label: "A-C", certStart: 7220, certEnd: 7361 }, { label: "C-K", certStart: 7362, certEnd: 7759 }, { label: "K-U", certStart: 7760, certEnd: 8179 }, { label: "U-Z", certStart: 8180, certEnd: 8290 }],
            "Harford": [{ label: "A-J", certStart: 8582, certEnd: 8631 }, { label: "J-Z", certStart: 8632, certEnd: 8680 }],
            "Montgomery": [{ label: "A-W", certStart: 8746, certEnd: 9076 }, { label: "W-Z", certStart: 9077, certEnd: 9104 }],
        },
        "04/1985": {
            "Baltimore": [{ label: "A-G", certStart: 9984, certEnd: 10135 }, { label: "G-Z", certStart: 10136, certEnd: 10421 }],
            "Baltimore City": [{ label: "A-C", certStart: 10422, certEnd: 10597 }, { label: "C-O", certStart: 10598, certEnd: 11033 }, { label: "O-Z", certStart: 11034, certEnd: 11350 }],
            "Montgomery": [{ label: "A-H", certStart: 11762, certEnd: 11916 }, { label: "H-Z", certStart: 11917, certEnd: 12163 }],
            "Prince George's": [{ label: "A-Mc", certStart: 12164, certEnd: 12351 }, { label: "Mc-Z", certStart: 12352, certEnd: 12473 }],
        },
        "05/1985": {
            "Baltimore": [{ label: "A-Si", certStart: 13038, certEnd: 13361 }, { label: "Sm-Z", certStart: 13362, certEnd: 13430 }],
            "Baltimore City": [{ label: "A-K", certStart: 13431, certEnd: 13940 }, { label: "L-Z", certStart: 13941, certEnd: 14399 }],
        },
        "06/1985": {
            "Baltimore": [{ label: "A-S", certStart: 15892, certEnd: 16190 }, { label: "T-Z", certStart: 16191, certEnd: 16227 }],
            "Baltimore City": [{ label: "A-M", certStart: 16228, certEnd: 16737 }, { label: "Mc-Z", certStart: 16738, certEnd: 17116 }],
            "Prince George's": [{ label: "A-B", certStart: 17831, certEnd: 17862 }, { label: "C-Z", certStart: 17863, certEnd: 18084 }],
        },
        "07/1985": {
            "Baltimore": [{ label: "A-O", certStart: 18643, certEnd: 18891 }, { label: "P-Z", certStart: 19016, certEnd: 19387 }],
            "Baltimore City": [{ label: "A-H", certStart: 19015, certEnd: 19388 }, { label: "H-W", certStart: 19389, certEnd: 19888 }, { label: "W-Z", certStart: 19889, certEnd: 19937 }],
        },
        "08/1985": {
            "Baltimore": [{ label: "A-O", certStart: 21503, certEnd: 21747 }, { label: "O-Z", certStart: 21748, certEnd: 21879 }],
            "Baltimore City": [{ label: "A-I", certStart: 21880, certEnd: 22151 }, { label: "J-W", certStart: 22307, certEnd: 22747 }, { label: "W-Z", certStart: 22748, certEnd: 22811 }],
        },
        "09/1985": {
            "Baltimore": [{ label: "A-Ra", certStart: 24275, certEnd: 24595 }, { label: "Ra-Z", certStart: 24596, certEnd: 24721 }],
            "Baltimore City": [{ label: "A-Jo", certStart: 24723, certEnd: 25174 }, { label: "Jo-Te", certStart: 25175, certEnd: 25600 }, { label: "Te-Z", certStart: 25601, certEnd: 25704 }],
        },
        "10/1985": {
            "Baltimore": [{ label: "A-Ku", certStart: 27137, certEnd: 27350 }, { label: "Ku-Z", certStart: 27351, certEnd: 27593 }],
            "Baltimore City": [{ label: "A-Dr", certStart: 27564, certEnd: 27789 }, { label: "Du-N", certStart: 27790, certEnd: 28175 }, { label: "O-Z", certStart: 28178, certEnd: 28525 }],
            "Montgomery": [{ label: "A-Le", certStart: 28930, certEnd: 29106 }, { label: "Le-Z", certStart: 29107, certEnd: 29269 }],
        },
        "11/1985": {
            "Baltimore": [{ label: "A-Ham", certStart: 30077, certEnd: 30228 }, { label: "Har-Z", certStart: 30229, certEnd: 30494 }],
            "Baltimore City": [{ label: "A-Be", certStart: 30495, certEnd: 30565 }, { label: "Be-Hu", certStart: 30566, certEnd: 30951 }, { label: "Hu-St", certStart: 30952, certEnd: 31365 }, { label: "St-Z", certStart: 31366, certEnd: 31509 }],
            "Montgomery": [{ label: "A-R", certStart: 31902, certEnd: 32173 }, { label: "S-Z", certStart: 32174, certEnd: 32268 }],
        },
        "12/1985": {
            "Baltimore": [{ label: "A-Fi", certStart: 33087, certEnd: 33199 }, { label: "Fl-Z", certStart: 33200, certEnd: 33517 }],
            "Baltimore City": [{ label: "A-Cr", certStart: 33518, certEnd: 33706 }, { label: "Cr-P", certStart: 33707, certEnd: 34207 }, { label: "P-Z", certStart: 34206, certEnd: 34531 }],
            "Montgomery": [{ label: "A-Er", certStart: 34972, certEnd: 35076 }, { label: "Ev-Z", certStart: 35077, certEnd: 35370 }],
            "Prince George's": [{ label: "A-Ki", certStart: 35371, certEnd: 35503 }, { label: "Ki-Z", certStart: 35504, certEnd: 35632 }],
        },
        "01/1986": {
            "Baltimore": [{ label: "A-L", certStart: 292, certEnd: 544 }, { label: "M-Z", certStart: 545, certEnd: 754 }],
            "Baltimore City": [{ label: "A-Fos", certStart: 755, certEnd: 1044 }, { label: "Fox-Sim", certStart: 1045, certEnd: 1570 }, { label: "Sin-Z", certStart: 1571, certEnd: 1757 }],
        },
        "02/1986": {
            "Baltimore": [{ label: "A-Co", certStart: 3531, certEnd: 3620 }, { label: "Cr-Z", certStart: 3621, certEnd: 3996 }],
            "Baltimore City": [{ label: "A-Ha", certStart: 3997, certEnd: 4384 }, { label: "He-R", certStart: 4385, certEnd: 4742 }, { label: "S-Z", certStart: 4743, certEnd: 5005 }],
            "Montgomery": [{ label: "A-F", certStart: 5443, certEnd: 5563 }, { label: "G-Z", certStart: 5564, certEnd: 5804 }],
            "Prince George's": [{ label: "A-Mc", certStart: 5805, certEnd: 5974 }, { label: "Me-Z", certStart: 5975, certEnd: 6087 }],
        },
        "03/1986": {
            "Baltimore": [{ label: "A-H", certStart: 6759, certEnd: 6936 }, { label: "H-Z", certStart: 6937, certEnd: 7206 }],
            "Baltimore City": [{ label: "A-D", certStart: 7207, certEnd: 7451 }, { label: "D-R", certStart: 7452, certEnd: 7970 }, { label: "R-Z", certStart: 7971, certEnd: 8253 }],
            "Prince George's": [{ label: "A-H", certStart: 8711, certEnd: 8821 }, { label: "H-Z", certStart: 8822, certEnd: 8991 }],
            "Montgomery": [{ label: "A-M", certStart: 8992, certEnd: 9231 }, { label: "M-Z", certStart: 9231, certEnd: 9394 }],
        },
        "04/1986": {
            "Baltimore": [{ label: "A-P", certStart: 9980, certEnd: 10265 }, { label: "P-Z", certStart: 10266, certEnd: 10394 }],
            "Baltimore City": [{ label: "A-G", certStart: 10395, certEnd: 10704 }, { label: "G-Z", certStart: 10705, certEnd: 11355 }],
            "Prince George's": [{ label: "A-G", certStart: 12131, certEnd: 12215 }, { label: "G-Z", certStart: 12216, certEnd: 12420 }],
        },
        "05/1986": {
            "Baltimore": [{ label: "A-M", certStart: 12959, certEnd: 13149 }, { label: "M-Z", certStart: 13150, certEnd: 13346 }],
            "Baltimore City": [{ label: "A-F", certStart: 13347, certEnd: 13601 }, { label: "F-O", certStart: 13602, certEnd: 14007 }, { label: "O-Z", certStart: 14006, certEnd: 14344 }],
            "Montgomery": [{ label: "A-Cl", certStart: 14739, certEnd: 14789 }, { label: "Co-Z", certStart: 14790, certEnd: 15101 }],
            "Prince George's": [{ label: "A-Mac", certStart: 15102, certEnd: 15232 }, { label: "Mai-Z", certStart: 15233, certEnd: 15372 }],
        },
        "06/1986": {
            "Baltimore": [{ label: "A-O", certStart: 15938, certEnd: 16177 }, { label: "P-Z", certStart: 16178, certEnd: 16312 }],
            "Baltimore City": [{ label: "A-I", certStart: 16313, certEnd: 16672 }, { label: "J-Z", certStart: 16673, certEnd: 17189 }],
            "Prince George's": [{ label: "A-R", certStart: 17901, certEnd: 18080 }, { label: "S-Z", certStart: 18081, certEnd: 18137 }],
        },
        "07/1986": {
            "Baltimore": [{ label: "A-Mc", certStart: 18723, certEnd: 18948 }, { label: "Me-Z", certStart: 18949, certEnd: 19104 }],
            "Baltimore City": [{ label: "A-G", certStart: 19105, certEnd: 19454 }, { label: "H-Stam", certStart: 19455, certEnd: 19955 }, { label: "Stan-Z", certStart: 19956, certEnd: 20124 }],
        },
        "08/1986": {
            "Baltimore": [{ label: "A-R", certStart: 21716, certEnd: 21987 }, { label: "S-Z", certStart: 21988, certEnd: 22084 }],
            "Baltimore City": [{ label: "A-J", certStart: 22085, certEnd: 22489 }, { label: "K-Z", certStart: 22490, certEnd: 22972 }],
            "Montgomery": [{ label: "A-G", certStart: 23351, certEnd: 23498 }, { label: "H-Z", certStart: 23499, certEnd: 23687 }],
        },
        "09/1986": {
            "Baltimore": [{ label: "A-L", certStart: 24460, certEnd: 24696 }, { label: "M-Z", certStart: 24697, certEnd: 24865 }],
            "Baltimore City": [{ label: "A-G", certStart: 24864, certEnd: 25191 }, { label: "H-S", certStart: 25192, certEnd: 25669 }, { label: "T-Z", certStart: 25670, certEnd: 25784 }],
            "Prince George's": [{ label: "A-J", certStart: 26580, certEnd: 26707 }, { label: "K-Z", certStart: 26708, certEnd: 26851 }],
        },
        "10/1986": {
            "Baltimore": [{ label: "A-Kin", certStart: 27430, certEnd: 27615 }, { label: "Kir-Z", certStart: 27616, certEnd: 27851 }],
            "Baltimore City": [{ label: "A-Cur", certStart: 27852, certEnd: 28035 }, { label: "Cus-Mi", certStart: 28036, certEnd: 28455 }, { label: "Mi-Z", certStart: 28456, certEnd: 28817 }],
            "Prince George's": [{ label: "A-Ale", certStart: 29632, certEnd: 29635 }, { label: "Alv-Z", certStart: 29637, certEnd: 29908 }],
        },
        "11/1986": {
            "Baltimore": [{ label: "A-K", certStart: 30480, certEnd: 30680 }, { label: "K-Z", certStart: 30681, certEnd: 30909 }],
            "Baltimore City": [{ label: "A-C", certStart: 30910, certEnd: 31079 }, { label: "C-L", certStart: 31080, certEnd: 31440 }, { label: "L-Z", certStart: 31441, certEnd: 31967 }],
            "Montgomery": [{ label: "A-D", certStart: 32376, certEnd: 32456 }, { label: "D-Z", certStart: 32457, certEnd: 32728 }],
            "Prince George's": [{ label: "A-D", certStart: 32729, certEnd: 32800 }, { label: "D-Z", certStart: 32801, certEnd: 33014 }],
        },
        "12/1986": {
            "Baltimore": [{ label: "A-E", certStart: 33619, certEnd: 33725 }, { label: "E-Z", certStart: 33726, certEnd: 34096 }],
            "Baltimore City": [{ label: "A-I", certStart: 34097, certEnd: 34541 }, { label: "J-St", certStart: 34542, certEnd: 35006 }, { label: "Sw-Z", certStart: 35007, certEnd: 35143 }],
        },
        "01/1987": {
            "Baltimore": [{ label: "A-F", certStart: 278, certEnd: 427 }, { label: "G-Z", certStart: 428, certEnd: 750 }],
            "Baltimore City": [{ label: "A-B", certStart: 751, certEnd: 821 }, { label: "B-H", certStart: 822, certEnd: 1217 }, { label: "H-R", certStart: 1218, certEnd: 1560 }, { label: "R-Z", certStart: 1561, certEnd: 1805 }],
            "Montgomery": [{ label: "A-D", certStart: 2256, certEnd: 2335 }, { label: "D-Z", certStart: 2336, certEnd: 2650 }],
            "Prince George's": [{ label: "A-C", certStart: 2657, certEnd: 2708 }, { label: "C-Z", certStart: 2709, certEnd: 2967 }],
        },
        "02/1987": {
            "Baltimore": [{ label: "A-Kni", certStart: 3578, certEnd: 3778 }, { label: "Knu-Z", certStart: 3780, certEnd: 3987 }],
            "Baltimore City": [{ label: "A-C", certStart: 3988, certEnd: 4165 }, { label: "D-O", certStart: 4166, certEnd: 4565 }, { label: "P-Z", certStart: 4566, certEnd: 4866 }],
            "Montgomery": [{ label: "A-L", certStart: 5278, certEnd: 5456 }, { label: "L-Z", certStart: 5457, certEnd: 5641 }],
        },
        "03/1987": {
            "Baltimore": [{ label: "A-L", certStart: 6497, certEnd: 6758 }, { label: "L-Z", certStart: 6757, certEnd: 6989 }],
            "Baltimore City": [{ label: "A-G", certStart: 6990, certEnd: 7326 }, { label: "G-S", certStart: 7327, certEnd: 7855 }, { label: "S-Z", certStart: 7856, certEnd: 8058 }],
        },
        "04/1987": {
            "Baltimore": [{ label: "A-Kn", certStart: 9872, certEnd: 10074 }, { label: "Ko-Z", certStart: 10075, certEnd: 10275 }],
            "Baltimore City": [{ label: "A-J", certStart: 10276, certEnd: 10657 }, { label: "J-Z", certStart: 10658, certEnd: 11158 }],
            "Montgomery": [{ label: "A-H", certStart: 11578, certEnd: 11721 }, { label: "H-Z", certStart: 11722, certEnd: 11969 }],
        },
        "05/1987": {
            "Baltimore": [{ label: "A-Pas", certStart: 12838, certEnd: 13102 }, { label: "Pat-Z", certStart: 13103, certEnd: 13237 }],
            "Baltimore City": [{ label: "A-H", certStart: 13238, certEnd: 13602 }, { label: "H-W", certStart: 13603, certEnd: 14130 }, { label: "W-Z", certStart: 14131, certEnd: 14222 }],
            "Prince George's": [{ label: "A-C", certStart: 15011, certEnd: 15070 }, { label: "D-Z", certStart: 15071, certEnd: 15306 }],
        },
        "06/1987": {
            "Baltimore": [{ label: "A-L", certStart: 15884, certEnd: 16106 }, { label: "M-Z", certStart: 16107, certEnd: 16277 }],
            "Baltimore City": [{ label: "A-G", certStart: 16278, certEnd: 16630 }, { label: "H-Ta", certStart: 16631, certEnd: 17104 }, { label: "Te-Z", certStart: 17105, certEnd: 17205 }],
            "Montgomery": [{ label: "A-B", certStart: 17578, certEnd: 17632 }, { label: "C-Z", certStart: 17633, certEnd: 17945 }],
            "Prince George's": [{ label: "A-M", certStart: 17946, certEnd: 18106 }, { label: "N-Z", certStart: 18107, certEnd: 18191 }],
        },
        "07/1987": {
            "Baltimore": [{ label: "A-L", certStart: 18798, certEnd: 19043 }, { label: "M-Z", certStart: 19044, certEnd: 19242 }],
            "Baltimore City": [{ label: "A-E", certStart: 19243, certEnd: 19530 }, { label: "E-P", certStart: 19531, certEnd: 20018 }, { label: "R-Z", certStart: 20019, certEnd: 20329 }],
            "Montgomery": [{ label: "A-P", certStart: 20739, certEnd: 20994 }, { label: "R-Z", certStart: 20995, certEnd: 21109 }],
        },
        "08/1987": {
            "Baltimore": [{ label: "A-M", certStart: 21981, certEnd: 22259 }, { label: "N-Z", certStart: 22260, certEnd: 22423 }],
            "Baltimore City": [{ label: "A-G", certStart: 22424, certEnd: 22755 }, { label: "H-T", certStart: 22756, certEnd: 23271 }, { label: "U-Z", certStart: 23272, certEnd: 23374 }],
            "Prince George's": [{ label: "A-K", certStart: 24110, certEnd: 24253 }, { label: "L-Z", certStart: 24254, certEnd: 24389 }],
        },
        "09/1987": {
            "Baltimore": [{ label: "A-Q", certStart: 24981, certEnd: 25244 }, { label: "R-Z", certStart: 25245, certEnd: 25384 }],
            "Baltimore City": [{ label: "A-I", certStart: 25385, certEnd: 25789 }, { label: "J-Z", certStart: 25790, certEnd: 26268 }],
            "Prince George's": [{ label: "A-I", certStart: 27060, certEnd: 27180 }, { label: "J-Z", certStart: 27181, certEnd: 27325 }],
        },
        "10/1987": {
            "Baltimore": [{ label: "A-H", certStart: 27886, certEnd: 28107 }, { label: "I-Z", certStart: 28108, certEnd: 28357 }],
            "Baltimore City": [{ label: "A-D", certStart: 28358, certEnd: 28617 }, { label: "E-Q", certStart: 28618, certEnd: 29113 }, { label: "R-Z", certStart: 29114, certEnd: 29386 }],
        },
        "11/1987": {
            "Baltimore": [{ label: "A-En", certStart: 31098, certEnd: 31216 }, { label: "Er-Z", certStart: 31217, certEnd: 31570 }],
            "Baltimore City": [{ label: "A-B", certStart: 31571, certEnd: 31617 }, { label: "B-J", certStart: 31618, certEnd: 32018 }, { label: "J-Sy", certStart: 32019, certEnd: 32418 }, { label: "Sz-Z", certStart: 32419, certEnd: 32561 }],
        },
        "12/1987": {
            "Baltimore": [{ label: "A-E", certStart: 33868, certEnd: 33979 }, { label: "E-Z", certStart: 33980, certEnd: 34322 }],
            "Baltimore City": [{ label: "A-B", certStart: 34323, certEnd: 34379 }, { label: "B-G", certStart: 34380, certEnd: 34698 }, { label: "G-P", certStart: 34699, certEnd: 35099 }, { label: "P-Z", certStart: 35100, certEnd: 35405 }],
            "Montgomery": [{ label: "A-J", certStart: 36039, certEnd: 36245 }, { label: "J-Z", certStart: 36246, certEnd: 36468 }],
            "Prince George's": [{ label: "A-Sc", certStart: 36469, certEnd: 36724 }, { label: "Se-Z", certStart: 36725, certEnd: 36821 }],
        },
    };

    // Worcester's December record every year (1973-1987) also catches
    // any late-filed certificates from earlier that year, not from
    // the grid as a whole - one record with an enriched label, not
    // two. Just the note, not "Worcester" prefixed - location-search
    // results already show the location as its own field, and
    // lookupSeries() (where there's no separate location field)
    // builds the standalone "Worcester (...)" label itself.
    const WORCESTER_LATE_FILES_LABEL = "also includes late files for the year";

    // Certificate ranges for Worcester's December record, by record
    // number - these are single, unsplit records, so they don't fit
    // SPLIT_MONTHS's shape (which only stores data for jurisdictions
    // with more than one part that month).
    const KNOWN_CERT_RANGES = {
        325: { certStart: 32154, certEnd: 32185 },
        645: { certStart: 32104, certEnd: 32143 },
        968: { certStart: 31063, certEnd: 31102 },
        1290: { certStart: 31687, certEnd: 31724 },
        1615: { certStart: 31333, certEnd: 31368 },
        1942: { certStart: 32384, certEnd: 32425 },
        2259: { certStart: 32004, certEnd: 32062 },
        2582: { certStart: 33316, certEnd: 33397 },
        2910: { certStart: 33466, certEnd: 33505 },
        3234: { certStart: 33397, certEnd: 33442 },
        3569: { certStart: 34508, certEnd: 34595 },
        // 34948 (this range's own highest number) is scanned as the
        // FIRST page of this item, not the last - out of numerical
        // order. Fine for the range itself (used only for the label
        // right now), but would need a one-off exception if/when
        // pre-1988 certificate lookup with page-jump math gets built -
        // not accounted for here, a candidate for a future series note
        // instead of bespoke code for one record.
        3901: { certStart: 34683, certEnd: 34948 },
        4238: { certStart: 35951, certEnd: 36025 },
        4572: { certStart: 36657, certEnd: 36809 },
        4909: { certStart: 37333, certEnd: 37454 }
    };

    // These 7 records are what a jurisdiction's regular monthly slot
    // was pulled out and issued as instead - that jurisdiction has NO
    // record in the regular grid sequence for that specific month
    // (see se46.js's count=0 handling). Confirmed for all 7,
    // including Baltimore's Aug 1979 entry - there is only one
    // Baltimore record that month, the out-of-order one.
    const TRAILING_SPECIALS = [
        { number: 4910, month: 7, year: 1976, county: "Calvert", pulledOut: true },
        { number: 4911, month: 7, year: 1976, county: "Caroline", pulledOut: true },
        { number: 4912, month: 1, year: 1977, county: "Montgomery", pulledOut: true },
        { number: 4913, month: 8, year: 1979, county: "Baltimore", pulledOut: true },
        { number: 4914, month: 1, year: 1980, county: "Harford", pulledOut: true },
        { number: 4915, month: 1, year: 1981, county: "Cecil", pulledOut: true },
        { number: 4916, month: 4, year: 1981, county: "Cecil", pulledOut: true }
    ];

    // A single confirmed exception to strict alphabetical order within
    // a month - Prince George's was numbered before Montgomery this
    // one month only (both counties' own totals are unaffected,
    // confirmed against the Worcester = SE46-4909 anchor). See
    // ORDER_SWAPS' use in se46.js.
    const ORDER_SWAPS = [
        { month: 3, year: 1986, before: "Prince George's", after: "Montgomery" }
    ];

    // Confirmed unassigned series numbers within the 1973-1987 grid -
    // they consume a slot in the running sequence (shifting every
    // later number in that month, and every subsequent month, by one)
    // but were never tied to any jurisdiction's records. Same pattern
    // as CM1132's UNUSED_RECORDS: a real number that resolves to an
    // informative "not used" result via lookupSeries(), not a
    // location/date search result. More may exist beyond 1977 - not
    // yet checked.
    const UNASSIGNED_RECORDS = {
        189: "Unassigned",
        1606: "Unassigned"
    };

    const RECORDS_1988_1989 = [
        { number: 4917, year: 1988, certStart: 1, certEnd: 400 },
        { number: 4918, year: 1988, certStart: 401, certEnd: 800 },
        { number: 4919, year: 1988, certStart: 801, certEnd: 1200 },
        { number: 4920, year: 1988, certStart: 1201, certEnd: 1600 },
        { number: 4921, year: 1988, certStart: 1601, certEnd: 1909 },
        { number: 4922, year: 1988, certStart: 1910, certEnd: 2282 },
        { number: 4923, year: 1988, certStart: 2283, certEnd: 2707 },
        { number: 4924, year: 1988, certStart: 2708, certEnd: 3096 },
        { number: 4925, year: 1988, certStart: 3097, certEnd: 3324 },
        { number: 4926, year: 1988, certStart: 3325, certEnd: 3835 },
        { number: 4927, year: 1988, certStart: 3836, certEnd: 4342 },
        { number: 4928, year: 1988, certStart: 4343, certEnd: 4842 },
        { number: 4929, year: 1988, certStart: 4843, certEnd: 5384 },
        { number: 4930, year: 1988, certStart: 5385, certEnd: 5921 },
        { number: 4931, year: 1988, certStart: 5922, certEnd: 6374 },
        { number: 4932, year: 1988, certStart: 6375, certEnd: 6645 },
        { number: 4933, year: 1988, certStart: 6647, certEnd: 7148 },
        { number: 4934, year: 1988, certStart: 7149, certEnd: 7649 },
        { number: 4935, year: 1988, certStart: 7650, certEnd: 8151 },
        { number: 4936, year: 1988, certStart: 8152, certEnd: 9152 },
        { number: 4937, year: 1988, certStart: 9153, certEnd: 9636 },
        { number: 4938, year: 1988, certStart: 9637, certEnd: 9987 },
        { number: 4939, year: 1988, certStart: 9988, certEnd: 10304 },
        { number: 4940, year: 1988, certStart: 10305, certEnd: 10800 },
        { number: 4941, year: 1988, certStart: 10801, certEnd: 12311 },
        { number: 4942, year: 1988, certStart: 12312, certEnd: 12671 },
        { number: 4943, year: 1988, certStart: 12672, certEnd: 13116 },
        { number: 4944, year: 1988, certStart: 13117, certEnd: 13503 },
        { number: 4945, year: 1988, certStart: 13504, certEnd: 14004 },
        { number: 4946, year: 1988, certStart: 14005, certEnd: 14505 },
        { number: 4947, year: 1988, certStart: 14506, certEnd: 15006 },
        { number: 4948, year: 1988, certStart: 15007, certEnd: 15391 },
        { number: 4949, year: 1988, certStart: 15392, certEnd: 15499 },
        { number: 4950, year: 1988, certStart: 15500, certEnd: 16007 },
        { number: 4951, year: 1988, certStart: 16008, certEnd: 16426 },
        { number: 4952, year: 1988, certStart: 16427, certEnd: 16927 },
        { number: 4953, year: 1988, certStart: 16928, certEnd: 17428 },
        { number: 4954, year: 1988, certStart: 17429, certEnd: 17928 },
        { number: 4955, year: 1988, certStart: 17929, certEnd: 18428 },
        { number: 4956, year: 1988, certStart: 18429, certEnd: 18928 },
        { number: 4957, year: 1988, certStart: 18929, certEnd: 19428 },
        { number: 4958, year: 1988, certStart: 19429, certEnd: 19769 },
        { number: 4959, year: 1988, certStart: 19770, certEnd: 20271 },
        { number: 4960, year: 1988, certStart: 20272, certEnd: 20771 },
        { number: 4961, year: 1988, certStart: 20772, certEnd: 21271 },
        { number: 4962, year: 1988, certStart: 21272, certEnd: 21771 },
        { number: 4963, year: 1988, certStart: 21772, certEnd: 22271 },
        { number: 4964, year: 1988, certStart: 22272, certEnd: 22746 },
        { number: 4965, year: 1988, certStart: 22748, certEnd: 23149 },
        { number: 4966, year: 1988, certStart: 23150, certEnd: 23550 },
        { number: 4967, year: 1988, certStart: 23551, certEnd: 23950 },
        { number: 4968, year: 1988, certStart: 23951, certEnd: 24355 },
        { number: 4969, year: 1988, certStart: 24356, certEnd: 24511 },
        { number: 4970, year: 1988, certStart: 24512, certEnd: 24952 },
        { number: 4971, year: 1988, certStart: 24953, certEnd: 25350 },
        { number: 4972, year: 1988, certStart: 25351, certEnd: 25693 },
        { number: 4973, year: 1988, certStart: 25694, certEnd: 26194 },
        { number: 4974, year: 1988, certStart: 26195, certEnd: 26694 },
        { number: 4975, year: 1988, certStart: 26695, certEnd: 27103 },
        { number: 4976, year: 1988, certStart: 27104, certEnd: 27604 },
        { number: 4977, year: 1988, certStart: 27605, certEnd: 28104 },
        { number: 4978, year: 1988, certStart: 28105, certEnd: 28571 },
        { number: 4979, year: 1988, certStart: 28572, certEnd: 29072 },
        { number: 4980, year: 1988, certStart: 29073, certEnd: 29573 },
        { number: 4981, year: 1988, certStart: 29574, certEnd: 30074 },
        { number: 4982, year: 1988, certStart: 30075, certEnd: 30575 },
        { number: 4983, year: 1988, certStart: 30576, certEnd: 31075 },
        { number: 4984, year: 1988, certStart: 31076, certEnd: 31575 },
        { number: 4985, year: 1988, certStart: 31576, certEnd: 31812 },
        { number: 4986, year: 1988, certStart: 31813, certEnd: 32314 },
        { number: 4987, year: 1988, certStart: 32315, certEnd: 32861 },
        { number: 4988, year: 1988, certStart: 32862, certEnd: 33401 },
        { number: 4989, year: 1988, certStart: 33402, certEnd: 33854 },
        { number: 4990, year: 1988, certStart: 33855, certEnd: 34354 },
        { number: 4991, year: 1988, certStart: 34355, certEnd: 34669 },
        { number: 4992, year: 1988, certStart: 34670, certEnd: 35174 },
        { number: 4993, year: 1988, certStart: 35175, certEnd: 35666 },
        { number: 4994, year: 1988, certStart: 35667, certEnd: 36223 },
        { number: 4995, year: 1988, certStart: 36224, certEnd: 36718 },
        { number: 4996, year: 1988, certStart: 36719, certEnd: 37202 },
        { number: 4997, year: 1988, certStart: 37203, certEnd: 37665 },
        { number: 4998, year: 1988, certStart: 37666, certEnd: 38127 },
        { number: 4999, year: 1988, certStart: 38128, certEnd: 38414 },
        { number: 5000, year: 1989, certStart: 1, certEnd: 507 },
        { number: 5001, year: 1989, certStart: 508, certEnd: 1005 },
        { number: 5002, year: 1989, certStart: 1006, certEnd: 1502 },
        { number: 5003, year: 1989, certStart: 1503, certEnd: 2013 },
        { number: 5004, year: 1989, certStart: 2014, certEnd: 2504 },
        { number: 5005, year: 1989, certStart: 2506, certEnd: 2994 },
        { number: 5006, year: 1989, certStart: 2995, certEnd: 3228 },
        { number: 5007, year: 1989, certStart: 3229, certEnd: 3746 },
        { number: 5008, year: 1989, certStart: 3747, certEnd: 4260 },
        { number: 5009, year: 1989, certStart: 4261, certEnd: 4775 },
        { number: 5010, year: 1989, certStart: 4777, certEnd: 5292 },
        { number: 5011, year: 1989, certStart: 5293, certEnd: 5806 },
        { number: 5012, year: 1989, certStart: 5807, certEnd: 6299 },
        { number: 5013, year: 1989, certStart: 6300, certEnd: 6816 },
        { number: 5014, year: 1989, certStart: 6817, certEnd: 7241 },
        { number: 5015, year: 1989, certStart: 7242, certEnd: 7774 },
        { number: 5016, year: 1989, certStart: 7775, certEnd: 8251 },
        { number: 5017, year: 1989, certStart: 8252, certEnd: 8678 },
        { number: 5018, year: 1989, certStart: 8679, certEnd: 9025 },
        { number: 5019, year: 1989, certStart: 9026, certEnd: 9499 },
        { number: 5020, year: 1989, certStart: 9500, certEnd: 9969 },
        { number: 5021, year: 1989, certStart: 9970, certEnd: 10451 },
        { number: 5022, year: 1989, certStart: 10452, certEnd: 10933 },
        { number: 5023, year: 1989, certStart: 10934, certEnd: 11415 },
        { number: 5024, year: 1989, certStart: 11416, certEnd: 11896 },
        { number: 5025, year: 1989, certStart: 11897, certEnd: 12377 },
        { number: 5026, year: 1989, certStart: 12378, certEnd: 12858 },
        { number: 5027, year: 1989, certStart: 12859, certEnd: 13344 },
        { number: 5028, year: 1989, certStart: 13345, certEnd: 13829 },
        { number: 5029, year: 1989, certStart: 13830, certEnd: 14315 },
        { number: 5030, year: 1989, certStart: 14316, certEnd: 14801 },
        { number: 5031, year: 1989, certStart: 14802, certEnd: 15290 },
        { number: 5032, year: 1989, certStart: 15291, certEnd: 15776 },
        { number: 5033, year: 1989, certStart: 15777, certEnd: 16262 },
        { number: 5034, year: 1989, certStart: 16263, certEnd: 16748 },
        { number: 5035, year: 1989, certStart: 16749, certEnd: 17234 },
        { number: 5036, year: 1989, certStart: 17235, certEnd: 17720 },
        { number: 5037, year: 1989, certStart: 17721, certEnd: 18206 },
        { number: 5038, year: 1989, certStart: 18207, certEnd: 18691 },
        { number: 5039, year: 1989, certStart: 18692, certEnd: 19188 },
        { number: 5040, year: 1989, certStart: 19189, certEnd: 19674 },
        { number: 5041, year: 1989, certStart: 19675, certEnd: 20160 },
        { number: 5042, year: 1989, certStart: 20161, certEnd: 20646 },
        { number: 5043, year: 1989, certStart: 20647, certEnd: 20997 },
        { number: 5044, year: 1989, certStart: 20998, certEnd: 21346 },
        { number: 5045, year: 1989, certStart: 21347, certEnd: 21698 },
        { number: 5046, year: 1989, certStart: 21699, certEnd: 22184 },
        { number: 5047, year: 1989, certStart: 22185, certEnd: 22670 },
        { number: 5048, year: 1989, certStart: 22671, certEnd: 23045 },
        { number: 5049, year: 1989, certStart: 23046, certEnd: 23420 },
        { number: 5050, year: 1989, certStart: 23421, certEnd: 23794 },
        { number: 5051, year: 1989, certStart: 23795, certEnd: 24165 },
        { number: 5052, year: 1989, certStart: 24166, certEnd: 24641 },
        { number: 5053, year: 1989, certStart: 24642, certEnd: 25117 },
        { number: 5054, year: 1989, certStart: 25118, certEnd: 25593 },
        { number: 5055, year: 1989, certStart: 25594, certEnd: 26068 },
        { number: 5056, year: 1989, certStart: 26069, certEnd: 26544 },
        { number: 5057, year: 1989, certStart: 26545, certEnd: 27020 },
        { number: 5058, year: 1989, certStart: 27021, certEnd: 27495 },
        { number: 5059, year: 1989, certStart: 27496, certEnd: 27970 },
        { number: 5060, year: 1989, certStart: 27971, certEnd: 28471 },
        { number: 5061, year: 1989, certStart: 28472, certEnd: 28978 },
        { number: 5062, year: 1989, certStart: 28979, certEnd: 29485 },
        { number: 5063, year: 1989, certStart: 29486, certEnd: 30000 },
        { number: 5064, year: 1989, certStart: 30001, certEnd: 30500 },
        { number: 5065, year: 1989, certStart: 30501, certEnd: 31000 },
        { number: 5066, year: 1989, certStart: 31001, certEnd: 31500 },
        { number: 5067, year: 1989, certStart: 31501, certEnd: 32000 },
        { number: 5068, year: 1989, certStart: 32001, certEnd: 32500 },
        { number: 5069, year: 1989, certStart: 32501, certEnd: 33000 },
        { number: 5070, year: 1989, certStart: 33001, certEnd: 33500 },
        { number: 5071, year: 1989, certStart: 33501, certEnd: 33999 },
        { number: 5072, year: 1989, certStart: 34000, certEnd: 34500 },
        { number: 5073, year: 1989, certStart: 34501, certEnd: 35000 },
        { number: 5074, year: 1989, certStart: 35001, certEnd: 35500 },
        { number: 5075, year: 1989, certStart: 35501, certEnd: 36000 },
        { number: 5076, year: 1989, certStart: 36001, certEnd: 36500 },
        { number: 5077, year: 1989, certStart: 36501, certEnd: 36999 },
        { number: 5078, year: 1989, certStart: 37001, certEnd: 37381 },
        { number: 5079, year: 1989, certStart: 37382, certEnd: 37850 },
    ];

    // Every lot is exactly 500 certificates except the last one of the
    // year, which absorbs whatever remains - anywhere from 1 up to
    // just under 1000 certs, not capped at 500. lastNumber is stored
    // explicitly (not derived from totalCerts via a formula) because
    // deriving it wrongly assumed the last lot could only be
    // undersized - 7 years (1994, 1995, 1996, 1997, 2003, 2012, 2014)
    // actually have an oversized last lot instead, which silently
    // produced a nonexistent record number one past the real last one
    // for certificates in that overflow range. This is unrelated to
    // 1990's own irregularity below (YEAR_1990_EXCEPTIONS) - that's 7
    // lots in the MIDDLE of one specific year that don't follow the
    // 500-per-lot rule at all, not an oversized last lot. Different
    // years, different mechanism, coincidentally both involve "7".
    const YEAR_METADATA = {
        1990: { firstNumber: 5080, lastNumber: 5155, totalCerts: 37619 },
        1991: { firstNumber: 5156, lastNumber: 5231, totalCerts: 37640 },
        1992: { firstNumber: 5232, lastNumber: 5308, totalCerts: 38345 },
        1993: { firstNumber: 5309, lastNumber: 5388, totalCerts: 39740 },
        1994: { firstNumber: 5389, lastNumber: 5469, totalCerts: 40503 },
        1995: { firstNumber: 5470, lastNumber: 5552, totalCerts: 41512 },
        1996: { firstNumber: 5553, lastNumber: 5635, totalCerts: 41604 },
        1997: { firstNumber: 5636, lastNumber: 5718, totalCerts: 41551 },
        1998: { firstNumber: 5719, lastNumber: 5802, totalCerts: 41882 },
        1999: { firstNumber: 5803, lastNumber: 5888, totalCerts: 42901 },
        2000: { firstNumber: 5889, lastNumber: 5976, totalCerts: 43671 },
        2001: { firstNumber: 5977, lastNumber: 6064, totalCerts: 43696 },
        2002: { firstNumber: 6065, lastNumber: 6152, totalCerts: 43967 },
        2003: { firstNumber: 6153, lastNumber: 6241, totalCerts: 44521 },
        2004: { firstNumber: 6242, lastNumber: 6328, totalCerts: 43144 },
        2005: { firstNumber: 6329, lastNumber: 6416, totalCerts: 43922 },
        2006: { firstNumber: 6417, lastNumber: 6503, totalCerts: 43497 },
        2007: { firstNumber: 6504, lastNumber: 6591, totalCerts: 43682 },
        2008: { firstNumber: 6592, lastNumber: 6679, totalCerts: 43778 },
        2009: { firstNumber: 6680, lastNumber: 6767, totalCerts: 43701 },
        2010: { firstNumber: 6768, lastNumber: 6854, totalCerts: 43223 },
        2011: { firstNumber: 6855, lastNumber: 6942, totalCerts: 43617 },
        2012: { firstNumber: 6943, lastNumber: 7031, totalCerts: 44515 },
        2013: { firstNumber: 7032, lastNumber: 7123, totalCerts: 45597 },
        2014: { firstNumber: 7124, lastNumber: 7215, totalCerts: 46007 },
    };

    // 1990's 7 irregular middle lots - everything else in every
    // year follows the standard 500-per-lot formula exactly.
    const YEAR_1990_EXCEPTIONS = {
        5128: { certStart: 24001, certEnd: 24503 },
        5129: { certStart: 24504, certEnd: 25004 },
        5130: { certStart: 25005, certEnd: 25505 },
        5131: { certStart: 25506, certEnd: 26006 },
        5132: { certStart: 26007, certEnd: 26507 },
        5133: { certStart: 26508, certEnd: 27008 },
        5134: { certStart: 27009, certEnd: 27500 },
    };


    global.MDRecordSearch.SE46_DATA = {
        SPLIT_MONTHS,
        WORCESTER_LATE_FILES_LABEL,
        KNOWN_CERT_RANGES,
        TRAILING_SPECIALS,
        ORDER_SWAPS,
        UNASSIGNED_RECORDS,
        RECORDS_1988_1989,
        YEAR_METADATA,
        YEAR_1990_EXCEPTIONS
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = global.MDRecordSearch.SE46_DATA;
    }

})(typeof window !== "undefined" ? window : globalThis);
