export interface Log {
    log_id: string;
    created_at: string;
    status: string;
    template_id: string;
    service_id: string;
    message: string;
    template_name?: string;
    host_address?: string;
    email_id?: string;
  }
  
  export interface LogWithDetails extends Log {
    template_name: string;
    host_address: string;
    email_id: string;
  }