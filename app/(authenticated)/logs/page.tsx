'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid } from 'lucide-react';

export default function DashboardPage() {
  const [servicesCount, setServicesCount] = useState(0)
  const [templatesCount, setTemplatesCount] = useState(0)

  useEffect(() => {
    fetchCounts()
  }, [])

  async function fetchCounts() {
    const { count: servicesCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })

    const { count: templatesCount } = await supabase
      .from('templates')
      .select('*', { count: 'exact', head: true })

    setServicesCount(servicesCount || 0)
    setTemplatesCount(templatesCount || 0)
  }

  return (
    
    <div className="container mx-auto px-6 py-4">
      <h2 className="text-2xl font-bold flex items-center text-[#FF6C37] mb-2">
          <LayoutGrid className="mr-2" /> Dashboard
        </h2>
        <br />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{servicesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{templatesCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

