import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CsvUploaderProps {
  onUpload: (data: Record<string, string>[]) => void
  onRemoveCsv: () => void
}

export function CsvUploader({ onUpload, onRemoveCsv }: CsvUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setLoading(true)
    try {
      const text = await file.text()
      const rows = text.split('\n')
      const headers = rows[0].split(',').map(header => header.trim())
      
      const data = rows.slice(1)
        .filter(row => row.trim()) // Skip empty rows
        .map(row => {
          const values = row.split(',').map(value => value.trim())
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || ''
            return obj
          }, {} as Record<string, string>)
        })

      onUpload(data)
      setFileName(file.name)
      toast.success('CSV file uploaded successfully')
    } catch (error) {
      console.error('Error parsing CSV:', error)
      toast.error('Failed to parse CSV file')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveFile = () => {
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemoveCsv()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
          <label htmlFor="csv-upload" className="sr-only">Upload CSV</label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={loading || !!fileName}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Uploading...' : 'Upload CSV'}
          </Button>
          {fileName && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-sm text-muted-foreground">{fileName}</p>
              <Button
                onClick={handleRemoveFile}
                variant="outline"
                className="mt-2"
              >
                Remove File
              </Button>
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a CSV file with recipient data
          </p>
        </div>
      </CardContent>
    </Card>
  )
}