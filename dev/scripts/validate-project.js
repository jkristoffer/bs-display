
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

async function runTypeCheck() {
    // The astro check --json command is not officially documented and its behavior is quirky.
    // It exits with 1 even on success if there are no errors, printing nothing.
    // If there are errors, it prints a JSON object to stdout and exits with 1.
    const command = 'npm run check'; // Using the base command as --json is unreliable
    try {
        const { stdout } = await execAsync(command);
        // If it succeeds with no output, it means no errors.
        return { status: 'PASS', output: stdout.trim() || "No type errors found." };
    } catch (error) {
        // The error object contains the detailed output from the command.
        return { status: 'FAIL', output: error.stderr || error.stdout };
    }
}

async function runLint() {
    const outputFile = '.lint-results.json';
    // Using the --output-file flag is a reliable way to get structured data.
    const command = `npx eslint "src/**/*.{js,jsx,ts,tsx,astro}" --format json --output-file ${outputFile}`;
    const remediationCommand = `npm run lint:fix`;

    try {
        // ESLint exits with 1 if there are lint errors, so we expect it to throw.
        await execAsync(command);
        // If it doesn't throw, there are no errors.
        return { status: 'PASS', output: "No linting errors found." };
    } catch (error) {
        // This block is expected to run if there are lint errors.
        try {
            const content = await fs.readFile(outputFile, 'utf-8');
            await fs.unlink(outputFile); // Clean up the temp file
            const results = JSON.parse(content);
            const hasErrors = results.some(file => file.errorCount > 0);
            if (hasErrors) {
                return { status: 'FAIL', output: results, remediationCommand };
            }
            // This case handles warnings without errors.
            return { status: 'PASS', output: results };
        } catch (readError) {
            // If reading the file fails, return the raw error from the command.
            return { status: 'FAIL', output: error.stderr || error.stdout, remediationCommand };
        }
    }
}

async function runBuild() {
    const command = 'npm run build:fast'; // Use the faster build for validation
    try {
        const { stdout } = await execAsync(command);
        return { status: 'PASS', output: stdout.trim() };
    } catch (error) {
        return { status: 'FAIL', output: error.stderr.trim() || error.stdout.trim() };
    }
}

async function main() {
    const results = {
        status: 'PASS',
        checks: [],
    };

    const steps = [
        { name: 'typeCheck', fn: runTypeCheck },
        { name: 'lint', fn: runLint },
        { name: 'build', fn: runBuild },
    ];

    for (const step of steps) {
        const result = await step.fn();
        results.checks.push({ check: step.name, ...result });
        if (result.status === 'FAIL') {
            results.status = 'FAIL';
        }
    }

    console.log(JSON.stringify(results, null, 2));

    if (results.status === 'FAIL') {
        process.exit(1);
    }
}

main();
