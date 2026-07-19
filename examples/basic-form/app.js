const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDateRange(dateRange) {

    if (!dateRange) {
        return "";
    }

    const { startYear, startMonth, endYear, endMonth } = dateRange;

    // A boundary's month of 0 means "just a year, no month precision"
    // (see the comment on BaseSeries.inDateRange()) - show the bare
    // year rather than fabricating a month that isn't actually known.
    const start = startMonth ? `${MONTH_NAMES[startMonth - 1]} ${startYear}` : `${startYear}`;
    const end = endMonth ? `${MONTH_NAMES[endMonth - 1]} ${endYear}` : `${endYear}`;

    return `${start} - ${end}`;
}


renderSeriesInfo();

const versionEl = document.getElementById("mdrs-library-version");
if (versionEl && MDRecordSearch.VERSION) {
    versionEl.textContent = `(v${MDRecordSearch.VERSION})`;
}

const reportIssueEl = document.getElementById("mdrs-report-issue");
if (reportIssueEl && MDRecordSearch.ISSUES_URL) {
    reportIssueEl.href = MDRecordSearch.ISSUES_URL;
}


function renderSeriesInfo() {

    const container = document.getElementById("mdrs-series-info");
    const series = MDRecordSearch.listSeries();

    // Birth first, then death, matching the page's heading/toggle order.
    // Within each group, keep registry order (roughly chronological).
    const order = { birth: 0, death: 1 };
    const sorted = [...series].sort((a, b) => order[a.recordType] - order[b.recordType]);

    container.innerHTML = sorted.map(s => {

        const capabilities = ["series-ID search"];

        if (s.supportsLocationSearch) {
            capabilities.unshift("location/date search");
        }

        if (s.supportsCertificateNumberSearch) {
            const isFullRange =
                JSON.stringify(s.certificateSearchRange) === JSON.stringify(s.dateRange);

            capabilities.push(
                isFullRange
                    ? "certificate number search"
                    : `certificate number search (${formatDateRange(s.certificateSearchRange)})`
            );
        }

        return `
            <div class="mdrs-series-row">
                <span class="mdrs-series-name"><a href="${s.seriesHome}" target="_blank">${s.name}</a> (${s.seriesIdRange.end})</span>
                <span class="mdrs-series-type">${s.recordType}</span>
                <span class="mdrs-series-timeline">${formatDateRange(s.dateRange)}</span>
                <span class="mdrs-series-support">${capabilities.join(" + ")}</span>
            </div>
        `;
    }).join("");
}


const recordTypeToggle = document.getElementById("mdrs-record-type");

if (recordTypeToggle) {
    recordTypeToggle.addEventListener("change", function () {

        const labels =
            document.querySelectorAll(".mdrs-record-type-toggle .mdrs-toggle-label");

        labels[0].dataset.active = String(!this.checked);
        labels[1].dataset.active = String(this.checked);
    });
}


document
    .getElementById("mdrs-lookup-form")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const recordType =
            recordTypeToggle && recordTypeToggle.checked ? "death" : "birth";

        const seriesId =
            document.getElementById("mdrs-series-id").value.trim();

        const certificateNumber =
            document.getElementById("mdrs-certificate-number").value.trim();

        let results;

        if (seriesId) {

            // A series ID already names one specific series unambiguously,
            // so the toggle doesn't need to filter it - unlike the
            // location/date search below, where recordType is what tells
            // lookup() which series are even eligible to match.
            results = MDRecordSearch.lookup({ series: seriesId });

        } else if (certificateNumber) {

            // The number format alone no longer identifies a unique
            // series - CM1132 (death) and CM1135 (birth) both use the
            // same [YYYY-]LETTER?NUMBER shape, so the toggle has to
            // filter here too, same as the location/date search below.
            results = MDRecordSearch.lookup({ certificateNumber, recordType });

        } else {

            const location =
                document.getElementById("mdrs-location").value;

            const month =
                Number(document.getElementById("mdrs-month").value);

            const year =
                Number(document.getElementById("mdrs-year").value);

            results = MDRecordSearch.lookup({ location, month, year, recordType });

        }

        renderResults(results);

    });


document
    .getElementById("mdrs-series-id")
    .addEventListener("input", updateFieldStates);

document
    .getElementById("mdrs-certificate-number")
    .addEventListener("input", updateFieldStates);


function updateFieldStates() {

    const hasSeries =
        document.getElementById("mdrs-series-id").value.trim().length > 0;

    const hasCertificate =
        document.getElementById("mdrs-certificate-number").value.trim().length > 0;

    setFieldsDisabled(["mdrs-location", "mdrs-month", "mdrs-year"], hasSeries || hasCertificate);
    setFieldsDisabled(["mdrs-series-id"], hasCertificate);
    setFieldsDisabled(["mdrs-certificate-number"], hasSeries);
}


function setFieldsDisabled(ids, disabled) {

    for (const id of ids) {

        const element = document.getElementById(id);

        element.disabled = disabled;

        element
            .closest("label")
            .classList.toggle("mdrs-disabled", disabled);
    }
}


function renderResults(results) {

    const output = document.getElementById("mdrs-results");

    if (results.length === 0) {
        output.innerHTML = "<p>No matching records.</p>";
        return;
    }

    output.innerHTML = results.map(renderResult).join("");
}


function renderResult(result) {

    const seriesLabel =
        result.number ? `${result.series}-${result.number}` : result.series;

    const dateLabel =
        result.month && result.year
            ? ` ${String(result.month).padStart(2, "0")}/${result.year}`
            : result.year ? ` ${result.year}` : "";

    const locationLabel =
        result.location ? ` ${result.location}` : "";

    const extraLabel =
        result.label ? ` ${result.label}` : "";

    const certLabel =
        result.certificateNumber ? ` (cert ${result.certificateNumber})` : "";

    // Some results (S1963's no-file records, CM1132-244) have no real
    // scan - url is null. Show the label as plain text rather than a
    // broken href="null" link in that case.
    const mainLabel =
        result.url
            ? `<a href="${result.url}" target="_blank">${seriesLabel}</a>`
            : `${seriesLabel} <em>(no scan available)</em>`;

    const pageLink =
        result.approximatePageUrl
            ? ` &middot; <a href="${result.approximatePageUrl}" target="_blank">jump to approx. page</a>`
            : "";

    return `
        <div class="mdrs-result">
            ${mainLabel}${certLabel}${dateLabel}${locationLabel}${extraLabel}${pageLink}
        </div>
    `;
}
