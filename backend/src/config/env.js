import dotenv from 'dotenv';

dotenv.config();

const required = (value, name, optional = false) => {
  if (!optional && (value === undefined || value === null || value === '')) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    serviceAccountB64: process.env.FIREBASE_SERVICE_ACCOUNT_B64,
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  },
  cronSchedule: process.env.CRON_SCHEDULE || '* * * * *',
  allowOpenRegistration: (process.env.ALLOW_OPEN_REGISTRATION || 'true').toLowerCase() === 'true',
};
