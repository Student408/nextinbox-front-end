export interface Service {
    service_id: string;
    user_id: string;
    host_address: string;
    port: number;
    email_id: string;
    password: string;
    cors_origin: string | null;
  }