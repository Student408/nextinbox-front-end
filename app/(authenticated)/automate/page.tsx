'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Workflow } from 'lucide-react'
import { AutomateForm } from '@/components/automate/automate-form'
import { PreviewEmail } from '@/components/automate/preview-email'
import { Service } from '@/types/services'
import { Template } from '@/types/templates'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { extractPlaceholders } from '@/lib/utils/template'
import { findMatchingFields } from '@/lib/utils/field-mapping'
import { createEmailRequest } from '@/lib/utils/email'

const API_URL = process.env.NEXT_PUBLIC_NEXTINBOX_API_URL as string

export default function AutomatePage() {
  const [services, setServices] = useState<Service[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [userKey, setUserKey] = useState<string>('')
  const [csvData, setCsvData] = useState<Record<string, string | number>[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [placeholders, setPlaceholders] = useState<string[]>([])
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
  const [previewData, setPreviewData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchServicesAndTemplates()
    fetchUserKey()
  }, [])

  async function fetchServicesAndTemplates() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No user found')
        return
      }

      const [servicesResponse, templatesResponse] = await Promise.all([
        supabase.from('services').select('*').eq('user_id', user.id),
        supabase.from('templates').select('*').eq('user_id', user.id)
      ])

      if (servicesResponse.error) throw servicesResponse.error
      if (templatesResponse.error) throw templatesResponse.error

      setServices(servicesResponse.data || [])
      setTemplates(templatesResponse.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch services and templates')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserKey() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('profile')
        .select('user_key')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      if (data) setUserKey(data.user_key)
    } catch (error) {
      console.error('Error fetching user key:', error)
      toast.error('Failed to fetch API key')
    }
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.template_id === templateId)
    if (template) {
      const extractedPlaceholders = extractPlaceholders(template.content)
      setPlaceholders(extractedPlaceholders)
      
      if (csvData.length > 0) {
        const csvFields = Object.keys(csvData[0])
        const autoMappings = findMatchingFields(extractedPlaceholders, csvFields)
        setFieldMappings(autoMappings)
      } else {
        setFieldMappings({})
      }
    }
  }

  const handleCsvUpload = (data: Record<string, string | number>[]) => {
    setCsvData(data)
    if (data.length > 0) {
      setPreviewData(
        Object.fromEntries(
          Object.entries(data[0]).map(([key, value]) => [key, value.toString()])
        )
      )
      
      if (placeholders.length > 0) {
        const csvFields = Object.keys(data[0])
        const autoMappings = findMatchingFields(placeholders, csvFields)
        setFieldMappings(autoMappings)
      }
    }
  }

  const handleFieldMapping = (placeholder: string, csvField: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [placeholder]: csvField
    }))
  }

  const handleRemoveCsv = () => {
    setCsvData([])
    setPreviewData({})
    setFieldMappings({})
  }

  const handleSendEmails = async () => {
    if (!selectedService || !selectedTemplate || !csvData.length) {
      toast.error('Please select a service, template, and upload CSV data')
      return
    }

    const template = templates.find(t => t.template_id === selectedTemplate)
    
    try {
      const emailRequest = createEmailRequest(
        userKey,
        selectedService,
        selectedTemplate,
        csvData,
        fieldMappings,
        template
      );

      const response = await fetch(`${API_URL}/send-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailRequest),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send emails')
      }

      const data = await response.json()
      if (data.success) {
        toast.success(`Successfully sent emails to ${emailRequest.recipients.length} recipients`)
      } else {
        throw new Error(data.message || 'Failed to send emails')
      }
    } catch (error) {
      console.error('Error sending emails:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send emails')
    }
  }

  if (loading) {
    return (
      <div className="h-full">
        <div className="flex items-center h-14 px-6 border-b">
          <Workflow className="mr-2 text-[#FF6C37]" />
          <h2 className="text-2xl font-bold text-[#FF6C37]">Email Automation</h2>
        </div>
        <div className="p-6">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-14 px-6 border-b flex-shrink-0">
        <Workflow className="mr-2 text-[#FF6C37]" />
        <h2 className="text-2xl font-bold text-[#FF6C37]">Email Automation</h2>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="sticky top-0 space-y-6">
              <AutomateForm
                services={services}
                templates={templates}
                selectedService={selectedService}
                selectedTemplate={selectedTemplate}
                onServiceChange={setSelectedService}
                onTemplateChange={handleTemplateChange}
                placeholders={placeholders}
                csvFields={csvData.length > 0 ? Object.keys(csvData[0]) : []}
                fieldMappings={fieldMappings}
                onFieldMapping={handleFieldMapping}
                onRemoveCsv={handleRemoveCsv}
                onCsvUpload={handleCsvUpload}
              />
            </div>
          </div>
          <div className="relative">
            <div className="sticky top-0">
              <PreviewEmail
                template={templates.find(t => t.template_id === selectedTemplate)}
                previewData={previewData}
                fieldMappings={fieldMappings}
                onSendEmails={handleSendEmails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}