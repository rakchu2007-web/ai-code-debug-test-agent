function analyzeCode() {

  const code = document.getElementById("code").value;
  const language = document.getElementById("language").value;

  if (!code.trim()) {
    alert("Please paste source code first!");
    return;
  }

  document.getElementById("loading")
    .classList.remove("hidden");

  document.getElementById("results")
    .classList.add("hidden");

  setTimeout(function() {

    const bugs =
      bugDetectionAgent(code, language);

    const tests =
      testGenerationAgent(code, language);

    const fixes =
      fixSuggestionAgent(bugs);

    const report =
      reportAgent(bugs, tests);

    displayBugs(bugs);
    displayTests(tests);
    displayFixes(fixes);
    displayReport(report);

    document.getElementById("loading")
      .classList.add("hidden");

    document.getElementById("results")
      .classList.remove("hidden");

  }, 1000);
}


function displayBugs(bugs) {

  const box = document.getElementById("bugs");

  box.innerHTML = "";

  bugs.forEach(function(bug) {

    const className =
      bug.severity === "Good" ? "fix" : "issue";

    box.innerHTML += `
      <div class="${className}">
        <strong>${bug.severity}</strong>
        <p>${bug.message}</p>
      </div>
    `;

  });
}


function displayTests(tests) {

  const box = document.getElementById("tests");

  box.innerHTML = "";

  tests.forEach(function(test, index) {

    box.innerHTML += `
      <div class="test">
        <strong>
          Test Case ${index + 1}: ${test.name}
        </strong>

        <p>
          <b>Input:</b> ${test.input}
        </p>

        <p>
          <b>Expected:</b> ${test.expected}
        </p>
      </div>
    `;

  });
}


function displayFixes(fixes) {

  const box = document.getElementById("fixes");

  box.innerHTML = "";

  fixes.forEach(function(fix) {

    box.innerHTML += `
      <div class="fix">

        <strong>
          🔧 ${fix.title}
        </strong>

        <p>
          ${fix.suggestion}
        </p>

      </div>
    `;

  });
}


function displayReport(report) {

  const box = document.getElementById("report");

  box.innerHTML = `

    <div class="score">
      ${report.score}/100
    </div>

    <p>
      🐞 Issues detected:
      <b>${report.issues}</b>
    </p>

    <p>
      🧪 Test cases generated:
      <b>${report.tests}</b>
    </p>

    <hr>

    <p>
      🤖 Analysis workflow completed:
    </p>

    <p>1️⃣ Bug Detection Agent</p>
    <p>2️⃣ Test Generation Agent</p>
    <p>3️⃣ Fix Suggestion Agent</p>
    <p>4️⃣ Report Agent</p>

  `;
}