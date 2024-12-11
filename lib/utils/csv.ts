import Papa from 'papaparse'

export function parseCsvFile(file: File): Promise<{
  headers: string[]
  data: Record<string, string>[]
}> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          headers: results.meta.fields || [],
          data: results.data as Record<string, string>[]
        })
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}