import { ContactWithDetails } from "@/types/contacts";

export function filterAndSortContacts(
  contacts: ContactWithDetails[],
  sortOrder: "asc" | "desc",
  selectedDate?: Date,
  searchQuery: string = ""
): ContactWithDetails[] {
  let filteredContacts = [...contacts];

  // Apply date filter if selected
  if (selectedDate) {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    filteredContacts = filteredContacts.filter(contact => {
      const contactDate = new Date(contact.sent_at);
      return contactDate >= startOfDay && contactDate <= endOfDay;
    });
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredContacts = filteredContacts.filter(contact => 
      contact.email_address.toLowerCase().includes(query) ||
      (contact.name && contact.name.toLowerCase().includes(query)) ||
      contact.template_name.toLowerCase().includes(query)
    );
  }

  // Sort contacts
  return filteredContacts.sort((a, b) => {
    const dateA = new Date(a.sent_at).getTime();
    const dateB = new Date(b.sent_at).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
}