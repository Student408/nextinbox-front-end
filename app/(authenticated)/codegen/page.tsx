'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CodeDisplay } from '@/components/automate/code-display'
import { SUPPORTED_LANGUAGES } from '@/lib/constants/languages'
import { extractFieldsFromTemplate } from '@/lib/utils/template'
import { generateCodeWithAI } from '@/lib/services/code-generation'
import { fetchCodeGenerationData } from '@/lib/services/data'
import { Service, Template } from '@/types/automate'

export default function AutomatePage() {
  const [services, setServices] = useState<Service[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedService, setSelectedService] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [userKey, setUserKey] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function initData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          toast.error('No user found')
          return
        }

        const { services, templates, profile } = await fetchCodeGenerationData(user.id)
        setServices(services)
        setTemplates(templates)
        setUserKey(profile.user_key)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch data')
      }
    }

    initData()
  }, [])

  async function handleGenerateCode() {
    if (!selectedService || !selectedTemplate || !selectedLanguage) {
      toast.error('Please select all required fields')
      return
    }

    setIsLoading(true)

    try {
      const selectedTemplateData = templates.find(t => t.template_id === selectedTemplate)
      if (!selectedTemplateData) {
        throw new Error('Selected template not found')
      }

      const fields = extractFieldsFromTemplate(selectedTemplateData.content)
      const code = await generateCodeWithAI({
        userKey,
        serviceId: selectedService,
        templateId: selectedTemplate,
        language: selectedLanguage,
        fields
      })

      setGeneratedCode(code)
    } catch (error) {
      console.error('Error generating code:', error)
      toast.error('Failed to generate code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
      <h2 className="text-2xl font-bold flex items-center text-[#FF6C37] mb-6">
        <LayoutGrid className="mr-2" /> Code Generation
      </h2>

      <div className="grid gap-6">
        <Card className="w-full max-w-full md:max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Generate API Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.service_id} value={service.service_id}>
                      {service.email_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.template_id} value={template.template_id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateCode} 
              disabled={isLoading || !selectedService || !selectedTemplate || !selectedLanguage}
              className="w-full bg-[#FF6C37] hover:bg-[#FF6C37]/90 transition-colors duration-200"
            >
              {isLoading ? 'Generating...' : 'Generate Code'}
            </Button>
          </CardContent>
        </Card>

        {generatedCode && (
          <CodeDisplay code={generatedCode} />
        )}
      </div>
    </div>
  )
}