'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { MailIcon, Trash2, PlusCircle, Plus, Edit2, Copy, CheckCircle, Code2 } from 'lucide-react'

interface Template {
  template_id: string
  name: string
  content: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<Omit<Template, 'template_id'>>({
    name: '',
    content: ''
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to view templates',
        variant: 'destructive',
      });
      return;
    }

    const { data, error } = await supabase.from('templates').select('*')
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to fetch templates: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      setTemplates(data || [])
    }
  }

  async function addTemplate() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add a template',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('templates').insert([{ ...newTemplate, user_id: user.id }])
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to add template: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      fetchTemplates()
      setNewTemplate({ name: '', content: '' })
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Template added successfully',
      });
    }
  }

  async function editTemplate() {
    if (!currentTemplate) return
    const { error } = await supabase.from('templates').update(currentTemplate).eq('template_id', currentTemplate.template_id)
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to edit template: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      fetchTemplates()
      setCurrentTemplate(null)
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
    }
  }

  async function deleteTemplate(id: string) {
    const { error } = await supabase.from('templates').delete().eq('template_id', id)
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to delete template: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      fetchTemplates()
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
    }
  }

  function copyToClipboard(templateId: string) {
    navigator.clipboard.writeText(templateId);
    setCopiedTemplateId(templateId);
    setTimeout(() => setCopiedTemplateId(null), 2000);
    toast({
      title: 'Copied',
      description: 'Template ID copied to clipboard',
    });
  }

  return (
    <div className="container mx-auto px-6 py-4 dark:bg-[#212121] dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center text-[#FF6C37]">
          <MailIcon className="mr-2" /> Email Templates
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2 bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> {currentTemplate ? 'Edit Template' : 'Add Template'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {currentTemplate ? 'Edit Email Template' : 'Create Email Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Template Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Welcome Email"
                  value={currentTemplate ? currentTemplate.name : newTemplate.name}
                  onChange={(e) => currentTemplate 
                    ? setCurrentTemplate({ ...currentTemplate, name: e.target.value })
                    : setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-gray-800 dark:border-[#FF6C37]/50 dark:text-gray-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">HTML & CSS Content</Label>
                <div className="w-full overflow-x-auto">
                  <CodeMirror
                    value={currentTemplate ? currentTemplate.content : newTemplate.content}
                    height="300px"
                    theme={vscodeDark}
                    extensions={[html()]}
                    onChange={(value) => currentTemplate 
                      ? setCurrentTemplate({ ...currentTemplate, content: value })
                      : setNewTemplate({ ...newTemplate, content: value })}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLineGutter: true,
                      foldGutter: true,
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={currentTemplate ? editTemplate : addTemplate} 
                className="w-full bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
              >
                {currentTemplate ? 'Save Changes' : 'Save Template'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card 
            key={template.template_id} 
            className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50"
          >
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Code2 className="text-[#FF6C37] w-6 h-6" />
                  <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[200px] dark:text-gray-100">
                    {template.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    onClick={() => copyToClipboard(template.template_id)}
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-[#FF6C37] hover:bg-[#FF6C37]/10 dark:text-gray-400 dark:hover:text-[#FF6C37]"
                  >
                    {copiedTemplateId === template.template_id ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    onClick={() => {
                      setCurrentTemplate(template)
                      setIsDialogOpen(true)
                    }} 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-[#FF6C37] hover:bg-[#FF6C37]/10 dark:text-gray-400 dark:hover:text-[#FF6C37]"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button 
                    onClick={() => deleteTemplate(template.template_id)} 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-500/10 dark:text-gray-400 dark:hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="relative">
                <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md max-h-[150px] overflow-hidden dark:bg-[#212121] dark:text-gray-300">
                  {template.content.substring(0, 200)}...
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-[#FF6C37]/30 dark:bg-[#212121] dark:border-[#FF6C37]/50">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No templates found. Create your first template.</p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
          >
            <Plus size={16} className="mr-2" /> Add New Template
          </Button>
        </div>
      )}
    </div>
  )
}