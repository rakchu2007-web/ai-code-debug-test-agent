function bugDetectionAgent(code, language) {

  const bugs = [];

  if (!code.trim()) {
    bugs.push({
      severity: "Critical",
      message: "No source code was provided."
    });
    return bugs;
  }

  // JavaScript checks
  if (language === "JavaScript") {

    if (/\ba\s*\/\s*c\b/.test(code)) {
      bugs.push({
        severity: "High",
        message: "Variable 'c' may be undefined."
      });
    }

    if (/\/\s*0\b/.test(code)) {
      bugs.push({
        severity: "High",
        message: "Possible division by zero detected."
      });
    }

    if (/\bvar\s+/.test(code)) {
      bugs.push({
        severity: "Medium",
        message: "Use let or const instead of var."
      });
    }

    if (/[^=]==[^=]/.test(code)) {
      bugs.push({
        severity: "Medium",
        message: "Use strict equality '===' instead of '=='."
      });
    }

    const lines = code.split("\n");

    lines.forEach((line, index) => {

      const trimmed = line.trim();

      if (
        trimmed &&
        !trimmed.endsWith(";") &&
        !trimmed.endsWith("{") &&
        !trimmed.endsWith("}") &&
        !trimmed.startsWith("//") &&
        (
          trimmed.includes("=") ||
          trimmed.includes("console")
        )
      ) {

        bugs.push({
          severity: "Low",
          message: `Possible missing semicolon near line ${index + 1}.`
        });

      }

    });
  }

  // Python checks
  if (language === "Python") {

    if (/print\s+[^(]/.test(code)) {
      bugs.push({
        severity: "Medium",
        message: "Use Python 3 print() syntax."
      });
    }

    if (/\/\s*0\b/.test(code)) {
      bugs.push({
        severity: "High",
        message: "Possible division by zero detected."
      });
    }

    if (/undefined_variable/.test(code)) {
      bugs.push({
        severity: "High",
        message: "Undefined variable detected."
      });
    }
  }

  // Java checks
  if (language === "Java") {

    if (/\/\s*0\b/.test(code)) {
      bugs.push({
        severity: "High",
        message: "Possible division by zero detected."
      });
    }

    if (!code.includes("System.out.println")) {
      bugs.push({
        severity: "Low",
        message: "No console output statement detected."
      });
    }
  }

  if (bugs.length === 0) {
    bugs.push({
      severity: "Good",
      message: "No major issues detected."
    });
  }

  return bugs;
}


function testGenerationAgent(code, language) {

  return [

    {
      name: "Normal Input Test",
      input: "Valid input",
      expected: "Program should execute correctly."
    },

    {
      name: "Boundary Test",
      input: "Minimum or maximum value",
      expected: "Program should handle boundary values safely."
    },

    {
      name: "Invalid Input Test",
      input: "Invalid input",
      expected: "Program should handle invalid input without crashing."
    }

  ];
}


function fixSuggestionAgent(bugs) {

  const fixes = [];

  bugs.forEach(bug => {

    if (bug.message.includes("Variable 'c'")) {

      fixes.push({
        title: "Fix undefined variable",
        suggestion:
          "Check the variable name and replace 'c' with the correct defined variable."
      });

    }

    else if (bug.message.includes("division by zero")) {

      fixes.push({
        title: "Prevent division by zero",
        suggestion:
          "Check that the denominator is not zero before performing division."
      });

    }

    else if (bug.message.includes("let or const")) {

      fixes.push({
        title: "Modernize variable declaration",
        suggestion:
          "Replace 'var' with 'let' or 'const'."
      });

    }

    else if (bug.message.includes("strict equality")) {

      fixes.push({
        title: "Use strict comparison",
        suggestion:
          "Replace '==' with '==='."
      });

    }

    else if (bug.message.includes("semicolon")) {

      fixes.push({
        title: "Add semicolon",
        suggestion:
          "Add a semicolon at the end of the statement."
      });

    }

    else if (bug.message.includes("print()")) {

      fixes.push({
        title: "Update Python print syntax",
        suggestion:
          "Use print(value) syntax in Python 3."
      });

    }

    else if (bug.message.includes("Undefined variable")) {

      fixes.push({
        title: "Define the variable",
        suggestion:
          "Declare and initialize the variable before using it."
      });

    }

  });

  if (fixes.length === 0) {

    fixes.push({
      title: "No immediate fix required",
      suggestion:
        "Continue testing the program with different inputs."
    });

  }

  return fixes;
}


function reportAgent(bugs, tests) {

  const realBugs =
    bugs.filter(bug => bug.severity !== "Good");

  let score = 100;

  realBugs.forEach(bug => {

    if (bug.severity === "Critical") score -= 35;
    if (bug.severity === "High") score -= 25;
    if (bug.severity === "Medium") score -= 15;
    if (bug.severity === "Low") score -= 5;

  });

  score = Math.max(score, 0);

  return {
    score: score,
    issues: realBugs.length,
    tests: tests.length
  };
}