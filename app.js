let currentAnalysis = null;

function analyzeCode() {
    const code = document.getElementById("codeInput").value;
    const language = document.getElementById("language").value;

    if (!code.trim()) {
        alert("Please enter some code.");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("results").style.display = "none";

    setTimeout(() => {
        const bugs = bugDetectionAgent(code, language);
        const tests = testGenerationAgent(code, language);
        const fixes = fixSuggestionAgent(code, language, bugs);
        const report = reportAgent(bugs, tests);

        currentAnalysis = {
            bugs: bugs,
            tests: tests,
            fixes: fixes,
            report: report
        };

        displayResults(bugs, tests, fixes, report);

        document.getElementById("loading").style.display = "none";
        document.getElementById("results").style.display = "block";
    }, 500);
}


function displayResults(bugs, tests, fixes, report) {

    document.getElementById("issueCount").textContent = bugs.length;
    document.getElementById("testCount").textContent = tests.length;
    document.getElementById("score").textContent = report.score + "/100";


    const bugBox = document.getElementById("bugResults");

    if (bugs.length === 0) {

        bugBox.innerHTML =
            `<div class="success-box">
                ✓ No major issues detected.
            </div>`;

    } else {

        bugBox.innerHTML = bugs.map(bug => `
            <div class="bug-card ${bug.severity.toLowerCase()}">

                <strong>
                    ${escapeHtml(bug.title)}
                </strong>

                <p>
                    ${escapeHtml(bug.message)}
                </p>

                <span>
                    Line ${bug.line}
                </span>

            </div>
        `).join("");
    }


    const testBox = document.getElementById("testResults");

    testBox.innerHTML = tests.map(test => `
        <div class="test-card">

            <strong>
                ${escapeHtml(test.name)}
            </strong>

            <p>
                ${escapeHtml(test.description)}
            </p>

        </div>
    `).join("");


    displayFixes(fixes);


    document.getElementById("reportResults").innerHTML = `
        <div class="report-box">

            <h3>Analysis Report</h3>

            <p>
                <strong>Code Score:</strong>
                ${report.score}/100
            </p>

            <p>
                <strong>Issues Detected:</strong>
                ${bugs.length}
            </p>

            <p>
                <strong>Test Cases Generated:</strong>
                ${tests.length}
            </p>

            <p>
                ${escapeHtml(report.summary)}
            </p>

        </div>
    `;
}


function displayFixes(fixes) {

    const fixBox = document.getElementById("fixResults");


    if (fixes.length === 0) {

        fixBox.innerHTML =
            `<div class="success-box">
                ✓ No fixes required.
            </div>`;

        return;
    }


    fixBox.innerHTML = fixes.map((fix, index) => `

        <div class="fix-card">

            <h3>
                🔧 ${escapeHtml(fix.title)}
            </h3>

            <p>
                <strong>Issue:</strong>
                ${escapeHtml(fix.message)}
            </p>

            <p>
                <strong>Location:</strong>
                Line ${fix.line}
            </p>

            <h4>
                Recommended Change
            </h4>

            <div class="code-diff">

                <div class="old-code">
                    − ${escapeHtml(fix.oldCode)}
                </div>

                <div class="new-code">
                    + ${escapeHtml(fix.newCode)}
                </div>

            </div>

            <p class="recommendation">
                <strong>Recommendation:</strong>
                ${escapeHtml(fix.recommendation)}
            </p>

            <p>
                <strong>Confidence:</strong>
                ${escapeHtml(fix.confidence)}
            </p>


            <button
                class="apply-btn"
                onclick="applyFix(${index})">

                ✓ Apply Fix

            </button>


            <div
                id="fixMessage${index}"
                class="fix-message">
            </div>

        </div>

    `).join("");
}


function applyFix(index) {

    if (
        !currentAnalysis ||
        !currentAnalysis.fixes ||
        !currentAnalysis.fixes[index]
    ) {
        return;
    }


    const fix = currentAnalysis.fixes[index];

    const textarea =
        document.getElementById("codeInput");

    let source = textarea.value;

    const oldCode = fix.oldCode;
    const newCode = fix.newCode;


    /*
     * First try exact replacement
     */

    const position =
        source.indexOf(oldCode);


    if (position !== -1) {

        textarea.value =
            source.substring(0, position) +
            newCode +
            source.substring(
                position + oldCode.length
            );


        showFixMessage(
            index,
            "✓ Fix applied successfully! Re-analyzing code...",
            "success"
        );


        /*
         * Re-analyze after applying fix
         */

        setTimeout(() => {

            analyzeCode();

        }, 700);


        return;
    }


    /*
     * If exact replacement fails,
     * try replacing inside the detected line.
     */

    const lines =
        source.split(/\r?\n/);

    const lineNumber =
        Number(fix.line);


    if (
        lineNumber >= 1 &&
        lineNumber <= lines.length
    ) {

        const line =
            lines[lineNumber - 1];

        /*
         * Special handling for
         * missing colon fixes.
         */

        if (
            oldCode === "" &&
            newCode === ":"
        ) {

            if (!line.trim().endsWith(":")) {

                lines[lineNumber - 1] =
                    line + ":";

                textarea.value =
                    lines.join("\n");


                showFixMessage(
                    index,
                    "✓ Fix applied successfully! Re-analyzing code...",
                    "success"
                );


                setTimeout(() => {

                    analyzeCode();

                }, 700);


                return;
            }
        }


        const linePosition =
            line.indexOf(oldCode);


        if (linePosition !== -1) {

            lines[lineNumber - 1] =
                line.substring(
                    0,
                    linePosition
                ) +
                newCode +
                line.substring(
                    linePosition +
                    oldCode.length
                );


            textarea.value =
                lines.join("\n");


            showFixMessage(
                index,
                "✓ Fix applied successfully! Re-analyzing code...",
                "success"
            );


            setTimeout(() => {

                analyzeCode();

            }, 700);


            return;
        }
    }


    showFixMessage(
        index,
        "⚠ Suggested pattern is not present in the current source.",
        "warning"
    );
}


function showFixMessage(index, message, type) {

    const box =
        document.getElementById(
            "fixMessage" + index
        );


    if (!box) {
        return;
    }


    box.textContent = message;


    box.className =
        "fix-message " + type;


    setTimeout(() => {

        box.textContent = "";

        box.className =
            "fix-message";

    }, 4000);
}


function escapeHtml(text) {

    if (
        text === undefined ||
        text === null
    ) {
        return "";
    }


    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}
