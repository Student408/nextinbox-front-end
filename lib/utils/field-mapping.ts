import { normalizeString } from './string'

export function findMatchingFields(
  placeholders: string[],
  csvFields: string[]
): Record<string, string> {
  const mappings: Record<string, string> = {}
  const normalizedCsvFields = csvFields.map(field => ({
    original: field,
    normalized: normalizeString(field)
  }))

  placeholders.forEach(placeholder => {
    const normalizedPlaceholder = normalizeString(placeholder)
    
    // Try exact match first
    const exactMatch = normalizedCsvFields.find(
      field => field.normalized === normalizedPlaceholder
    )
    
    if (exactMatch) {
      mappings[placeholder] = exactMatch.original
      return
    }

    // Try contains match
    const containsMatch = normalizedCsvFields.find(
      field => 
        field.normalized.includes(normalizedPlaceholder) ||
        normalizedPlaceholder.includes(field.normalized)
    )

    if (containsMatch) {
      mappings[placeholder] = containsMatch.original
    }
  })

  return mappings
}