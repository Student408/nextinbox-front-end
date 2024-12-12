// Define types for the code generation feature
export interface Language {
    id: string;
    name: string;
  }
  
  export interface Service {
    service_id: string;
    email_id: string;
    user_id: string;
  }
  
  export interface Template {
    template_id: string;
    name: string;
    content: string;
    user_id: string;
  }
  
  export interface Profile {
    user_key: string;
    user_id: string;
  }
  
  export interface CodeGenerationParams {
    userKey: string;
    serviceId: string;
    templateId: string;
    language: string;
    fields: string[];
  }