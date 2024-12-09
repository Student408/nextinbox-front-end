export interface Contact {
    email_id: string;
    sent_at: string;
    email_address: string;
    name: string | null;
    template_name: string;
  }
  
  export interface ContactWithDetails extends Contact {
    template_name: string;
  }