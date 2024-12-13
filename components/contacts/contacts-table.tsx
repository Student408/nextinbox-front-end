import { ContactWithDetails } from "@/types/contacts";
import { formatDate } from "@/lib/utils/date";

interface ContactsTableProps {
  contacts: ContactWithDetails[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Sent Time</th>
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Email Address</th>
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Name</th>
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Template</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr 
              key={contact.email_id} 
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="p-2 sm:p-4 text-sm">
                {formatDate(contact.sent_at)}
              </td>
              <td className="p-2 sm:p-4 text-sm font-medium">{contact.email_address}</td>
              <td className="p-2 sm:p-4 text-sm text-muted-foreground">{contact.name || '-'}</td>
              <td className="p-2 sm:p-4 text-sm text-muted-foreground">{contact.template_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}