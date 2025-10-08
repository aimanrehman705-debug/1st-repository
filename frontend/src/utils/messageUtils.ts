import type { CsvContact } from './csvParser';

export function renderTemplate(content: string, variables: Record<string, any>) {
  return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return variables?.[key] ?? '';
  });
}

export function buildMessageForContact(baseMessage: string, contact: CsvContact, extraVars?: Record<string, any>) {
  return renderTemplate(baseMessage, { name: contact.name || '', phone: contact.phone, ...(extraVars || {}) });
}
