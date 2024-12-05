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
import { FileText, Trash2, PlusCircle, Plus, Edit2, Copy, CheckCircle, Code2 } from 'lucide-react'

interface Template {
  template_id: string
  name: string
  content: string
  to_email: string | null
  from_name: string
  reply_to: string | null
  subject: string
  bcc: string | null
  cc: string | null
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<Omit<Template, 'template_id'>>({
    name: '',
    content: '',
    to_email: '',
    from_name: '',
    reply_to: '',
    subject: '',
    bcc: '',
    cc: ''
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

    const { error } = await supabase.from('templates').insert([{ 
      ...newTemplate, 
      user_id: user.id,
      to_email: newTemplate.to_email || null,
      reply_to: newTemplate.reply_to || null,
      bcc: newTemplate.bcc || null,
      cc: newTemplate.cc || null
    }])
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to add template: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      fetchTemplates()
      setNewTemplate({ name: '', content: '', to_email: '', from_name: '', reply_to: '', subject: '', bcc: '', cc: '' })
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Template added successfully',
      });
    }
  }

  async function editTemplate() {
    if (!currentTemplate) return
    const { error } = await supabase.from('templates').update({
      ...currentTemplate,
      to_email: currentTemplate.to_email || null,
      reply_to: currentTemplate.reply_to || null,
      bcc: currentTemplate.bcc || null,
      cc: currentTemplate.cc || null
    }).eq('template_id', currentTemplate.template_id)
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center text-[#FF6C37]">
          <FileText className="mr-2" /> Email Templates
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2 bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> {currentTemplate ? 'Edit Template' : 'Add New Template'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] w-[95vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {currentTemplate ? 'Edit Email Template' : 'Create Email Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col lg:flex-row h-[calc(90vh-180px)]">
              <div className="lg:w-[30%] p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Template Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Welcome Email"
                      value={currentTemplate ? currentTemplate.name : newTemplate.name}
                      onChange={(e) => currentTemplate 
                        ? setCurrentTemplate({ ...currentTemplate, name: e.target.value })
                        : setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-[#212121] dark:border-[#FF6C37]/50 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Email subject"
                      value={currentTemplate ? currentTemplate.subject : newTemplate.subject}
                      onChange={(e) => currentTemplate 
                        ? setCurrentTemplate({ ...currentTemplate, subject: e.target.value })
                        : setNewTemplate({ ...newTemplate, subject: e.target.value })}
                      className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-[#212121] dark:border-[#FF6C37]/50 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="from_name" className="text-gray-700 dark:text-gray-300">From Name</Label>
                    <Input
                      id="from_name"
                      placeholder="Sender's name"
                      value={currentTemplate ? currentTemplate.from_name : newTemplate.from_name}
                      onChange={(e) => currentTemplate 
                        ? setCurrentTemplate({ ...currentTemplate, from_name: e.target.value })
                        : setNewTemplate({ ...newTemplate, from_name: e.target.value })}
                      className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-[#212121] dark:border-[#FF6C37]/50 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="to_email" className="text-gray-700 dark:text-gray-300">To Email (optional)</Label>
                    <Input
                      id="to_email"
                      placeholder="Recipient's email"
                      value={(currentTemplate ? currentTemplate.to_email : newTemplate.to_email) ?? ''}
                      onChange={(e) => currentTemplate 
                        ? setCurrentTemplate({ ...currentTemplate, to_email: e.target.value })
                        : setNewTemplate({ ...newTemplate, to_email: e.target.value })}
                      className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-[#212121] dark:border-[#FF6C37]/50 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reply_to" className="text-gray-700 dark:text-gray-300">Reply-To (optional)</Label>
                    <Input
                      id="reply_to"
                      placeholder="Reply-to email"
                      value={(currentTemplate ? currentTemplate.reply_to : newTemplate.reply_to) ?? ''}
                      onChange={(e) => currentTemplate 
                        ? setCurrentTemplate({ ...currentTemplate, reply_to: e.target.value })
                        : setNewTemplate({ ...newTemplate, reply_to: e.target.value })}
                      className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-[#212121] dark:border-[#FF6C37]/50 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cc" className="text-gray-700 dark:text-gray-300">CC (optional)</Label>
                    <Input
                      id="cc"
                      placeholder="CC email addresses"
                      value={(currentTemplate ? currentTemplate.cc : newTemplate.cc) ?? ''}
                      onChange={(e) => currentTemplate 
                        ? setCurrentTemplate({ ...currentTemplate, cc: e.target.value })
                        : setNewTemplate({ ...newTemplate, cc: e.target.value })}
                      className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-[#212121] dark:border-[#FF6C37]/50 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bcc" className="text-gray-700 dark:text-gray-300">BCC (optional)</Label>
                    <Input
                      id="bcc"
                      placeholder="BCC email addresses"
                      value={(currentTemplate ? currentTemplate.bcc : newTemplate.bcc) ?? ''}
                      onChange={(e) => currentTemplate 
                        ? setCurrentTemplate({ ...currentTemplate, bcc: e.target.value })
                        : setNewTemplate({ ...newTemplate, bcc: e.target.value })}
                      className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-[#212121] dark:border-[#FF6C37]/50 dark:text-gray-100"
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button 
                      onClick={currentTemplate ? editTemplate : addTemplate} 
                      className="w-full bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
                    >
                      {currentTemplate ? 'Save Changes' : 'Save Template'}
                    </Button>
                  </DialogFooter>
                </div>
              </div>
              <div className="lg:w-[70%] h-full p-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 mb-2 block">HTML & CSS Content</Label>
                <div className="w-full flex-grow overflow-hidden relative">
                  <div className="absolute inset-0 overflow-auto scrollbar-hide">
                    <CodeMirror
                      value={currentTemplate ? currentTemplate.content : newTemplate.content}
                      height="100%"
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
            </div>
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
