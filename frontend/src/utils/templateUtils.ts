export function handleVariableReplacement(messageBody: string, contact: Record<string, any>): string {
  if (!messageBody) return ''
  return messageBody.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const value = contact?.[key]
    return value === undefined || value === null ? '' : String(value)
  })
}

export const exampleContact = {
  name: 'John',
  date: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date()),
  time: '10:00 AM',
}
