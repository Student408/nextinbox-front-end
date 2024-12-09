import { ContactWithDetails } from "@/types/contacts";
import { formatDate } from "./date";

export function exportToCSV(contacts: ContactWithDetails[], filename: string = 'contacts'): void {
  // Define CSV headers
  const headers = [
    'Sent Time',
    'Email Address',
    'Name',
    'Template'
  ];

  // Convert contacts to CSV rows
  const rows = contacts.map(contact => [
    formatDate(contact.sent_at),
    contact.email_address,
    contact.name || '',
    contact.template_name
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${formatDate(new Date().toISOString())}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}