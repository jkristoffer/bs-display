import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { logEvent } from './ai-log.js';

const intentsFilePath = path.join(process.cwd(), 'ai-intents.json');

async function runCommand(command, args, intentName) {
  return new Promise((resolve, reject) => {
    const fullCommand = `${command} ${args.join(' ')}`.trim();
    console.log(`Executing: ${fullCommand}`);
    exec(fullCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        logEvent({
          type: 'command_execution',
          intent: intentName,
          command: fullCommand,
          status: 'failed',
          error: error.message,
          stdout: stdout,
          stderr: stderr,
        });
        return reject({ error, stdout, stderr });
      }
      logEvent({
        type: 'command_execution',
        intent: intentName,
        command: fullCommand,
        status: 'success',
        stdout: stdout,
        stderr: stderr,
      });
      resolve({ stdout, stderr });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const intentName = args[0];
  const intentParams = args.slice(1);

  if (!intentName) {
    console.error('Usage: node ai-do.js <intentName> [params...]');
    logEvent({
      type: 'ai_do_invocation',
      status: 'failed',
      reason: 'no_intent_specified',
    });
    process.exit(1);
  }

  // Handle list-intents discovery flag (both --list-intents and list-intents)
  if (intentName === 'list-intents') {
    try {
      const intentsConfig = JSON.parse(await fs.readFile(intentsFilePath, 'utf-8'));
      console.log(JSON.stringify(intentsConfig.intents, null, 2));
      await logEvent({
        type: 'ai_do_invocation',
        status: 'success',
        intent: 'list-intents',
        reason: 'intents_listed'
      });
      process.exit(0);
    } catch (error) {
      console.error('Failed to read intents configuration:', error);
      await logEvent({
        type: 'ai_do_invocation',
        status: 'failed',
        intent: 'list-intents',
        reason: 'config_read_error',
        error: error.message
      });
      process.exit(1);
    }
  }

  try {
    const intentsConfig = JSON.parse(await fs.readFile(intentsFilePath, 'utf-8'));
    const intent = intentsConfig.intents[intentName];

    if (!intent) {
      console.error(`Intent '${intentName}' not found in ${intentsFilePath}`);
      logEvent({
        type: 'ai_do_invocation',
        status: 'failed',
        reason: 'intent_not_found',
        intent: intentName,
      });
      process.exit(1);
    }

    const commandTemplate = intent.command;
    let finalCommand = commandTemplate;

    // Simple parameter substitution (can be made more robust)
    intent.params.forEach((param, index) => {
      const paramValue = intentParams[index];
      if (paramValue === undefined && param.required) {
        console.error(`Missing required parameter '${param.name}' for intent '${intentName}'`);
        logEvent({
          type: 'ai_do_invocation',
          status: 'failed',
          reason: 'missing_required_parameter',
          intent: intentName,
          parameter: param.name,
        });
        process.exit(1);
      }
      finalCommand = finalCommand.replace(`{{${param.name}}}`, paramValue || param.defaultValue || '');
    });

    logEvent({
      type: 'ai_do_invocation',
      status: 'success',
      intent: intentName,
      command_executed: finalCommand,
      params: intentParams,
    });

    await runCommand(finalCommand, intentParams, intentName);
    console.log(`Intent '${intentName}' executed successfully.`);

  } catch (error) {
    console.error(`Failed to execute intent '${intentName}':`, error);
    logEvent({
      type: 'ai_do_invocation',
      status: 'failed',
      reason: 'exception_caught',
      intent: intentName,
      error: error.message,
    });
    process.exit(1);
  }
}

main();
