export interface Template {
    template_id: string;
    name: string;
    content: string;
    to_email: string | null;
    from_name: string;
    reply_to: string | null;
    subject: string;
    bcc: string | null;
    cc: string | null;
  }