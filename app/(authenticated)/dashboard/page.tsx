'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid, Mail, FileText, Clock, Zap } from 'lucide-react'

export default function DashboardPage() {
  const [servicesCount, setServicesCount] = useState(0)
  const [templatesCount, setTemplatesCount] = useState(0)
  const [rateLimit, setRateLimit] = useState(0)
  const [emailsSentToday, setEmailsSentToday] = useState(0)

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

    const { data: profileData } = await supabase
      .from('profile')
      .select('rate_limit')
      .single()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count: todayEmailsCount } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', today.toISOString())

    setServicesCount(servicesCount || 0)
    setTemplatesCount(templatesCount || 0)
    setRateLimit(profileData?.rate_limit || 0)
    setEmailsSentToday(todayEmailsCount || 0)
  }

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center text-[#FF6C37]">
          <LayoutGrid className="mr-2" /> Dashboard Overview
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Mail className="text-[#FF6C37] w-6 h-6" />
              <CardTitle className="text-lg">Email Services</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{servicesCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active services</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <FileText className="text-[#FF6C37] w-6 h-6" />
              <CardTitle className="text-lg">Email Templates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{templatesCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available templates</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="text-[#FF6C37] w-6 h-6" />
              <CardTitle className="text-lg">Emails Today</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{emailsSentToday}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sent in last 24h</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="text-[#FF6C37] w-6 h-6" />
              <CardTitle className="text-lg">Daily Rate Limit</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{rateLimit}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Emails remaining</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}