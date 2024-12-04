'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Template {
  template_id: string
  name: string
  content: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [newTemplate, setNewTemplate] = useState<Omit<Template, 'template_id'>>({
    name: '',
    content: ''
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    const { data, error } = await supabase.from('templates').select('*')
    if (error) console.error('Error fetching templates:', error)
    else setTemplates(data || [])
  }

  async function addTemplate() {
    const { error } = await supabase.from('templates').insert([newTemplate])
    if (error) console.error('Error adding template:', error)
    else {
      fetchTemplates()
      setNewTemplate({ name: '', content: '' })
    }
  }

  async function deleteTemplate(id: string) {
    const { error } = await supabase.from('templates').delete().eq('template_id', id)
    if (error) console.error('Error deleting template:', error)
    else fetchTemplates()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Email Templates</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.template_id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{template.content.substring(0, 100)}...</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => deleteTemplate(template.template_id)} variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Template</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Email Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addTemplate} className="w-full sm:w-auto">Add Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

