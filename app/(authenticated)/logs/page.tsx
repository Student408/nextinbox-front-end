'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FileClock } from 'lucide-react'
import { LogTable } from '@/components/logs/log-table'
import { LogWithDetails } from '@/types/logs'
import { Skeleton } from '@/components/ui/skeleton'
import { SortOptions } from '@/components/logs/sort-options'
import { sortLogs } from '@/lib/utils/sorting'

export default function LogsPage() {
  const [logs, setLogs] = useState<LogWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"date" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No user found')
        return
      }

      const { data, error } = await supabase
        .from('logs')
        .select(`
          *,
          templates:template_id (name),
          services:service_id (host_address, email_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const logsWithDetails: LogWithDetails[] = data.map(log => ({
        ...log,
        template_name: log.templates?.name || 'Unknown Template',
        host_address: log.services?.host_address || 'Unknown Host',
        email_id: log.services?.email_id || 'Unknown Email'
      }))

      setLogs(logsWithDetails)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (by: "date" | "status") => {
    if (sortBy === by) {
      // If clicking the same sort option, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // If clicking a different sort option, set it with descending order
      setSortBy(by)
      setSortOrder("desc")
    }
  }

  const sortedLogs = sortLogs(logs, sortBy, sortOrder)

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center mb-6">
          <FileClock className="mr-2 text-[#FF6C37]" />
          <h2 className="text-2xl font-bold text-[#FF6C37]">Email Logs</h2>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center mb-6">
        <FileClock className="mr-2 text-[#FF6C37]" />
        <h2 className="text-2xl font-bold text-[#FF6C37]">Email Logs</h2>
      </div>
      
      {logs.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">No logs found</p>
        </div>
      ) : (
        <>
          <SortOptions
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          <LogTable logs={sortedLogs} />
        </>
      )}
    </div>
  )
}