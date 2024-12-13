'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CodeDisplay } from '@/components/codegen/code-display'
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
    <div className="container mx-auto p-2 sm:px-4 sm:py-4 md:px-6 md:py-6">
      <h2 className="text-xl sm:text-2xl font-bold flex items-center text-[#FF6C37] mb-4 sm:mb-6">
        <Code className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Code Generation
      </h2>

      <div className="grid gap-4 sm:gap-6">
        <Card className="w-full md:max-w-5xl md:mx-auto">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Generate API Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
              className="w-full mt-2 sm:mt-4 bg-[#FF6C37] hover:bg-[#FF6C37]/90 transition-colors duration-200 text-sm sm:text-base py-2 sm:py-3"
            >
              {isLoading ? 'Generating...' : 'Generate Code'}
            </Button>
          </CardContent>
        </Card>

        {generatedCode && (
          <div className="w-full overflow-x-auto md:max-w-5xl md:mx-auto">
            <CodeDisplay code={generatedCode} />
          </div>
        )}
      </div>
    </div>
  )
}