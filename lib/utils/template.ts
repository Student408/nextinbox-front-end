export function extractTemplateFields(content: string): string[] {
  const regex = /{{(.*?)}}/g
  const matches = content.match(regex) || []
  return matches.map(match => match.replace(/[{}]/g, '').trim())
}

export function extractFieldsFromTemplate(content: string): string[] {
  const regex = /{{(.*?)}}/g;
  const matches = content.match(regex) || [];
  return matches.map(match => match.replace(/[{}]/g, '').trim());
}

export function generatePreview(
  templateContent: string,
  data: Record<string, string>,
  fieldMapping: Record<string, string>
): string {
  let preview = templateContent
  Object.entries(fieldMapping).forEach(([templateField, csvField]) => {
    const value = data[csvField] || ''
    preview = preview.replace(new RegExp(`{{${templateField}}}`, 'g'), value)
  })
  return preview
}