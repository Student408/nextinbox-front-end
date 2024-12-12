'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Code, Server, Mail, Key, Workflow, Shield } from 'lucide-react'
import { GettingStartedDocs } from '@/components/docs/getting-started'
import { TemplatesDocs } from '@/components/docs/templates'

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('getting-started')

  const renderContent = () => {
    switch (activeTab) {
      case 'getting-started':
        return <GettingStartedDocs />
      case 'templates':
        return <TemplatesDocs />
      // Add other tab components here
      default:
        return <GettingStartedDocs />
    }
  }

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center mb-6">
        <FileText className="mr-2 text-[#FF6C37]" />
        <h2 className="text-2xl font-bold text-[#FF6C37]">Documentation</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 p-4">
          <nav className="space-y-2">
            <h3 className="font-semibold mb-4 text-lg">Contents</h3>
            <div className="space-y-1">
              {[
                { id: 'getting-started', label: 'Getting Started', icon: <Code className="w-4 h-4" /> },
                { id: 'services', label: 'Email Services', icon: <Server className="w-4 h-4" /> },
                { id: 'templates', label: 'Email Templates', icon: <Mail className="w-4 h-4" /> },
                { id: 'api-keys', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
                { id: 'automation', label: 'Automation', icon: <Workflow className="w-4 h-4" /> },
                { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#FF6C37] text-white'
                      : 'hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}