
import fs from 'fs';
import path from 'path';

const logPath = path.resolve('backend/logs/analytics.json');

export const logAnalytics = (data) => {
  const entry = { ...data, timestamp: new Date().toISOString() };
  let existing = [];
  try {
    if (fs.existsSync(logPath)) {
      const raw = fs.readFileSync(logPath, 'utf-8');
      existing = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading analytics log:', e);
  }

  existing.push(entry);
  try {
    fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
  } catch (e) {
    console.error('Failed writing analytics log:', e);
  }
};
