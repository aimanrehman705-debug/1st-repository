import cron from 'node-cron';
import { env } from '../config/env.js';
import { processDueScheduledMessages } from './whatsappService.js';

let started = false;

export function startScheduler() {
  if (started) return;
  cron.schedule(env.cronSchedule, async () => {
    try {
      await processDueScheduledMessages();
    } catch (err) {
      console.error('Scheduler tick error:', err);
    }
  });
  started = true;
}
