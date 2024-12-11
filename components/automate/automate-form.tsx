import { Service } from "@/types/services"
import { Template } from "@/types/templates"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CsvUploader } from "@/components/automate/csv-uploader"

interface AutomateFormProps {
  services: Service[]
  templates: Template[]
  selectedService: string
  selectedTemplate: string
  onServiceChange: (serviceId: string) => void
  onTemplateChange: (templateId: string) => void
  placeholders: string[]
  csvFields: string[]
  onFieldMapping: (placeholder: string, csvField: string) => void
  onRemoveCsv: () => void
  onCsvUpload: (data: Record<string, string>[]) => void
}

export function AutomateForm({
  services,
  templates,
  selectedService,
  selectedTemplate,
  onServiceChange,
  onTemplateChange,
  placeholders,
  csvFields,
  onFieldMapping,
  onRemoveCsv,
  onCsvUpload,
}: AutomateFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Email Automation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Email Service</Label>
          <Select value={selectedService} onValueChange={onServiceChange}>
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

        <div className="space-y-2">
          <Label>Email Template</Label>
          <Select value={selectedTemplate} onValueChange={onTemplateChange}>
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

        {placeholders.length > 0 && (
          <div className="space-y-4">
            <Label>Map Template Fields</Label>
            {placeholders.map((placeholder) => (
              <div key={placeholder} className="space-y-2">
                <Label>{placeholder}</Label>
                <Select onValueChange={(value) => onFieldMapping(placeholder, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select field for ${placeholder}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {csvFields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
        <CsvUploader onUpload={onCsvUpload} onRemoveCsv={onRemoveCsv} />
      </CardContent>
    </Card>
  )
}