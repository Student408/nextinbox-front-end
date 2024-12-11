'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow, Upload,  Send, Trash2, Eye } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Service } from '@/types/services'
import { Template } from '@/types/templates'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import DOMPurify from 'dompurify'
import { parseCsvFile } from '@/lib/utils/csv'
import { extractTemplateFields, generatePreview } from '@/lib/utils/template'
import { sendEmails } from '@/lib/utils/email'
import { ProgressDialog } from '@/components/automate/progress-dialog'

// const API_URL = process.env.NEXT_PUBLIC_NEXTINBOX_API_URL as string

export default function AutomatePage() {
  const [services, setServices] = useState<Service[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvData, setCsvData] = useState<Record<string, string>[]>([])
  const [templateFields, setTemplateFields] = useState<string[]>([])
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [previewHtml] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sendProgress, setSendProgress] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    fetchServicesAndTemplates()
  }, [])

  async function fetchServicesAndTemplates() {
    try {
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')

      if (servicesError) throw servicesError
      setServices(servicesData)

      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('*')

      if (templatesError) throw templatesError
      setTemplates(templatesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch services and templates')
    }
  }

  async function handleTemplateChange(templateId: string) {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.template_id === templateId)
    if (template) {
      const fields = extractTemplateFields(template.content)
      setTemplateFields(fields)
      
      // Initialize field mapping with email_address and name
      const initialMapping: Record<string, string> = {}
      fields.forEach(field => {
        if (csvHeaders.includes(field)) {
          initialMapping[field] = field
        }
      })
      setFieldMapping(initialMapping)

      // Generate preview with first row of CSV data if available
      if (csvData.length > 0) {
        generatePreview(template.content, csvData[0], fieldMapping)
      }
    }
  }

  async function handleCsvUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setCsvFile(file)
      const { headers, data } = await parseCsvFile(file)
      setCsvHeaders(headers)
      setCsvData(data)

      // Reset field mapping
      const newMapping: Record<string, string> = {}
      templateFields.forEach(field => {
        if (headers.includes(field)) {
          newMapping[field] = field
        }
      })
      setFieldMapping(newMapping)
    } catch (error) {
      console.error('Error parsing CSV:', error)
      toast.error('Failed to parse CSV file')
    }
  }

  async function handleSendEmails() {
    if (!selectedService || !selectedTemplate || !csvFile) {
      toast.error('Please select a service, template, and CSV file')
      return
    }

    try {
      setIsSending(true)
      setSendProgress(0)
      setProcessedCount(0)

      const recipients = csvData.map(row => ({
        email_address: row.email_address,
        name: row.name || '',
        parameters: Object.entries(fieldMapping).reduce((acc, [templateField, csvField]) => {
          acc[templateField] = row[csvField] || ''
          return acc
        }, {} as Record<string, string>)
      }))

      await sendEmails({
        serviceId: selectedService,
        templateId: selectedTemplate,
        recipients,
        onProgress: (progress) => {
          setSendProgress(progress)
          setProcessedCount(Math.floor((progress / 100) * recipients.length))
        }
      })

      toast.success('All emails sent successfully!')
    } catch (error) {
      console.error('Error sending emails:', error)
      toast.error('Failed to send emails')
    } finally {
      setIsSending(false)
      setSendProgress(0)
      setProcessedCount(0)
    }
  }

  return (
    <>
      <div className="container mx-auto px-6 py-4">
        <h2 className="text-2xl font-bold flex items-center text-[#FF6C37] mb-6">
          <Workflow className="mr-2" /> Email Automation
        </h2>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Service & Template Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Service</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.service_id} value={service.service_id}>
                          {service.email_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email Template</label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.template_id} value={template.template_id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSV Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {csvFile ? 'Replace CSV' : 'Upload CSV'}
                </Button>
                {csvFile && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCsvFile(null)
                        setCsvHeaders([])
                        setCsvData([])
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {csvFile.name}
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                title="Upload CSV file"
              />

              {templateFields.length > 0 && csvHeaders.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Field Mapping</h3>
                  <div className="grid gap-4">
                    {templateFields.map((field) => (
                      <div key={field} className="grid grid-cols-2 gap-4 items-center">
                        <span className="text-sm font-medium">{field}</span>
                        <Select
                          value={fieldMapping[field] || ''}
                          onValueChange={(value) => {
                            setFieldMapping(prev => ({
                              ...prev,
                              [field]: value
                            }))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select CSV field" />
                          </SelectTrigger>
                          <SelectContent>
                            {csvHeaders.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {csvFile && selectedTemplate && Object.keys(fieldMapping).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-x-4">
                <Button
                  onClick={() => {
                    const template = templates.find(t => t.template_id === selectedTemplate)
                    if (template && csvData.length > 0) {
                      generatePreview(template.content, csvData[0], fieldMapping)
                      setShowPreview(true)
                    }
                  }}
                  variant="outline"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  onClick={handleSendEmails}
                  disabled={isLoading}
                  className="bg-[#FF6C37] hover:bg-[#FF6C37]/90"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isLoading ? 'Sending...' : 'Send Emails'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto mt-4">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border rounded-md"
                title="Email Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ProgressDialog
        open={isSending}
        progress={sendProgress}
        total={csvData.length}
        processed={processedCount}
      />
    </>
  )
}