export function extractPlaceholders(content: string): string[] {
    const placeholderRegex = /{{([^}]+)}}/g
    const matches = content.match(placeholderRegex) || []
    return matches
      .map(match => match.replace(/[{}]/g, '').trim())
      .filter((value, index, self) => self.indexOf(value) === index)
  }