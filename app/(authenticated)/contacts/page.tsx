'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ContactRound } from 'lucide-react';
import { ContactsTable } from '@/components/contacts/contacts-table'
import { SortOptions } from '@/components/contacts/sort-options'
import { ContactWithDetails } from '@/types/contacts'
import { Skeleton } from '@/components/ui/skeleton'
import { filterAndSortContacts } from '@/lib/utils/contacts'
import { exportToCSV } from '@/lib/utils/export'
import { toast } from '@/components/ui/use-toast'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No user found')
        return
      }

      const { data, error } = await supabase
        .from('emails')
        .select(`
          *,
          templates:template_id (name)
        `)
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })

      if (error) {
        throw error
      }

      const contactsWithDetails: ContactWithDetails[] = data.map(contact => ({
        ...contact,
        template_name: contact.templates?.name || 'Unknown Template'
      }))

      setContacts(contactsWithDetails)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleExport = () => {
    try {
      exportToCSV(filteredAndSortedContacts, 'contacts')
      toast({
        title: "Success",
        description: "Contacts exported successfully",
      })
    } catch (error) {
      console.error('Error exporting contacts:', error)
      toast({
        title: "Error",
        description: "Failed to export contacts",
        variant: "destructive",
      })
    }
  }

  const filteredAndSortedContacts = filterAndSortContacts(
    contacts,
    sortOrder,
    selectedDate,
    searchQuery
  )

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center mb-6">
          <ContactRound className="mr-2 text-[#FF6C37]" />
          <h2 className="text-2xl font-bold text-[#FF6C37]">Contacts</h2>
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
        <ContactRound className="mr-2 text-[#FF6C37]" />
        <h2 className="text-2xl font-bold text-[#FF6C37]">Contacts</h2>
      </div>
      
      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">No contacts found</p>
        </div>
      ) : (
        <>
          <SortOptions
            sortOrder={sortOrder}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            onSortChange={handleSortChange}
            onDateSelect={handleDateSelect}
            onSearchChange={handleSearchChange}
            onExport={handleExport}
          />
          <ContactsTable contacts={filteredAndSortedContacts} />
        </>
      )}
    </div>
  )
}