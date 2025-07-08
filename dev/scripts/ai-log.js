import { promises as fs } from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), '.ai-events.log');

async function logEvent(event) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, ...event };
  try {
    await fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    console.error('Failed to write to AI event log:', error);
  }
}

export { logEvent };

