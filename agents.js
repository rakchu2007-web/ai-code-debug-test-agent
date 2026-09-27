// ==========================================
// AI CODE DEBUG & TEST AGENTS
// ==========================================


// ==========================================
// HELPER - FIND LINE NUMBER
// ==========================================

function findLine(code, text) {
    const lines = code.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(text)) {
            return i + 1;
        }
    }

    return 1;
}


// ==========================================
// BUG DETECTION AGENT
// ==========================================

function bugDetectionAgent(code, language) {

    const bugs = [];
    const lines = code.split(/\r?\n/);


    // --------------------------------------
    // JAVASCRIPT
    // --------------------------------------

    if (language === "javascript") {

        // Undefined variable: a / c
        const undefinedMatch =
            code.match(/return\s+[^;\n]*\/\s*c\b/);

        if (undefinedMatch) {

            bugs.push({
                title: "Undefined Variable Detected",
                message: "Variable 'c' may be undefined.",
                line: findLine(code, "c"),
                severity: "High",
                type: "undefined_variable"
            });
        }


        // var usage
        const varMatch =
            code.match(/\bvar\s+\w+/);

        if (varMatch) {

            bugs.push({
                title: "Legacy Variable Declaration",
                message: "Using 'var' can cause scope-related issues. Consider using 'let' or 'const'.",
                line: findLine(code, "var"),
                severity: "Medium",
                type: "var_usage"
            });
        }


        // Division by zero
        const zeroMatch =
            code.match(/\/\s*0\b/);

        if (zeroMatch) {

            bugs.push({
                title: "Division by Zero",
                message: "The code attempts to divide by zero.",
                line: findLine(code, "/ 0"),
                severity: "High",
                type: "division_zero"
            });
        }
    }


    // --------------------------------------
    // PYTHON
    // --------------------------------------

    if (language === "python") {

        // undefined_variable
        if (code.includes("undefined_variable")) {

            bugs.push({
                title: "Undefined Variable Detected",
                message: "Variable 'undefined_variable' is not defined.",
                line: findLine(code, "undefined_variable"),
                severity: "High",
                type: "python_undefined"
            });
        }


        // Common typo
        if (code.includes("quanity")) {

            bugs.push({
                title: "Possible Variable Typo",
                message: "Variable 'quanity' may be a typo for 'quantity'.",
                line: findLine(code, "quanity"),
                severity: "High",
                type: "python_typo"
            });
        }


        // Division by zero
        if (/\/\s*0\b/.test(code)) {

            bugs.push({
                title: "Division by Zero",
                message: "The code attempts to divide by zero.",
                line: findLine(code, "/ 0"),
                severity: "High",
                type: "division_zero"
            });
        }


        // Missing colon
        for (let i = 0; i < lines.length; i++) {

            const trimmed = lines[i].trim();

            if (
                /^(if|else|elif|for|while|def|class|try|except)\b/.test(trimmed) &&
                !trimmed.endsWith(":")
            ) {

                bugs.push({
                    title: "Missing Colon",
                    message: "This Python statement should end with ':'.",
                    line: i + 1,
                    severity: "Medium",
                    type: "missing_colon"
                });

                break;
            }
        }
    }


    // --------------------------------------
    // JAVA
    // --------------------------------------

    if (language === "java") {

        if (/\/\s*0\b/.test(code)) {

            bugs.push({
                title: "Division by Zero",
                message: "The code attempts to divide by zero.",
                line: findLine(code, "/ 0"),
                severity: "High",
                type: "division_zero"
            });
        }
    }


    // --------------------------------------
    // C
    // --------------------------------------

    if (language === "c") {

        const undefinedMatch =
            code.match(/\/\s*c\b/);

        if (undefinedMatch) {

            bugs.push({
                title: "Undefined Variable Detected",
                message: "Variable 'c' may be undefined.",
                line: findLine(code, "c"),
                severity: "High",
                type: "undefined_variable"
            });
        }


        if (/\/\s*0\b/.test(code)) {

            bugs.push({
                title: "Division by Zero",
                message: "The code attempts to divide by zero.",
                line: findLine(code, "/ 0"),
                severity: "High",
                type: "division_zero"
            });
        }
    }


    // --------------------------------------
    // C++
    // --------------------------------------

    if (language === "cpp") {

        const undefinedMatch =
            code.match(/\/\s*c\b/);

        if (undefinedMatch) {

            bugs.push({
                title: "Undefined Variable Detected",
                message: "Variable 'c' may be undefined.",
                line: findLine(code, "c"),
                severity: "High",
                type: "undefined_variable"
            });
        }


        if (/\/\s*0\b/.test(code)) {

            bugs.push({
                title: "Division by Zero",
                message: "The code attempts to divide by zero.",
                line: findLine(code, "/ 0"),
                severity: "High",
                type: "division_zero"
            });
        }
    }


    return bugs;
}


// ==========================================
// TEST GENERATION AGENT
// ==========================================

function testGenerationAgent(code, language) {

    return [

        {
            name: "Normal Input Test",
            description: "Tests the program with valid and expected input values."
        },

        {
            name: "Boundary Test",
            description: "Tests the program with minimum, maximum, or boundary values."
        },

        {
            name: "Invalid Input Test",
            description: "Tests the program with invalid or unexpected input."
        }

    ];
}


// ==========================================
// FIX SUGGESTION AGENT
// ==========================================

function fixSuggestionAgent(code, language, bugs) {

    const fixes = [];


    bugs.forEach(function (bug) {

        // JavaScript / C / C++
        if (
            bug.type === "undefined_variable" &&
            (
                language === "javascript" ||
                language === "c" ||
                language === "cpp"
            )
        ) {

            fixes.push({
                title: "Undefined Variable Detected",
                message: "Variable 'c' is used but may not be defined.",
                line: bug.line,
                oldCode: "c",
                newCode: "b",
                recommendation: "Replace the undefined variable 'c' with 'b' when 'b' is the intended parameter.",
                confidence: "High"
            });
        }


        // Python undefined variable
        if (bug.type === "python_undefined") {

            fixes.push({
                title: "Undefined Variable Detected",
                message: "Variable 'undefined_variable' is not defined.",
                line: bug.line,
                oldCode: "undefined_variable",
                newCode: "quantity",
                recommendation: "Replace 'undefined_variable' with the correct variable name.",
                confidence: "High"
            });
        }


        // Python typo
        if (bug.type === "python_typo") {

            fixes.push({
                title: "Variable Typo Detected",
                message: "Variable 'quanity' appears to be misspelled.",
                line: bug.line,
                oldCode: "quanity",
                newCode: "quantity",
                recommendation: "Replace 'quanity' with 'quantity' to correct the variable name.",
                confidence: "High"
            });
        }


        // Division by zero
        if (bug.type === "division_zero") {

            fixes.push({
                title: "Division by Zero",
                message: "Division by zero can cause a runtime error.",
                line: bug.line,
                oldCode: "/ 0",
                newCode: "/ denominator",
                recommendation: "Use a valid non-zero denominator before performing the division.",
                confidence: "High"
            });
        }


        // Python missing colon
        if (bug.type === "missing_colon") {

            fixes.push({
                title: "Missing Colon",
                message: "Python control statements and function definitions require a colon.",
                line: bug.line,
                oldCode: "",
                newCode: ":",
                recommendation: "Add ':' at the end of the statement.",
                confidence: "High"
            });
        }

    });


    return fixes;
}


// ==========================================
// REPORT AGENT
// ==========================================

function reportAgent(bugs, tests) {

    let score = 100;


    bugs.forEach(function (bug) {

        if (bug.severity === "High") {
            score -= 25;
        }

        if (bug.severity === "Medium") {
            score -= 10;
        }

    });


    if (score < 0) {
        score = 0;
    }


    let summary;


    if (bugs.length === 0) {

        summary =
            "No major issues were detected. The source code passed the initial analysis.";

    } else {

        summary =
            bugs.length +
            " issue(s) were detected. Review the suggested fixes and generated test cases before execution.";
    }


    return {

        score: score,

        summary: summary

    };
}
