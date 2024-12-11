import { Template } from "@/types/templates";

export interface EmailRecipient {
  email_address: string;
  name: string;
  [key: string]: string;
}

export interface EmailParameters {
  [key: string]: string;
}

export interface EmailRequest {
  user_key: string;
  service_id: string;
  template_id: string;
  recipients: EmailRecipient[];
  parameters: EmailParameters;
}

export function createEmailRequest(
  userKey: string,
  serviceId: string,
  templateId: string,
  csvData: Record<string, string | number>[],
  fieldMappings: Record<string, string>,
  template: Template | undefined
): EmailRequest {
  if (!template) {
    throw new Error("Template not found");
  }

  // Create recipients with their individual parameters
  const recipients = csvData.map(row => {
    const recipientData: EmailRecipient = {
      email_address: getEmailFromRow(row),
      name: getNameFromRow(row)
    };

    return recipientData;
  });

  // Create parameters object with all mapped fields
  const parameters: EmailParameters = {};
  Object.entries(fieldMappings).forEach(([placeholder, csvField]) => {
    if (csvData[0][csvField] !== undefined) {
      parameters[placeholder] = csvData[0][csvField].toString();
    }
  });

  return {
    user_key: userKey,
    service_id: serviceId,
    template_id: templateId,
    recipients,
    parameters
  };
}

function getEmailFromRow(row: Record<string, string | number>): string {
  const emailFields = ['email', 'email_address', 'Email', 'EMAIL'];
  for (const field of emailFields) {
    if (row[field]) {
      return row[field].toString();
    }
  }
  return '';
}

function getNameFromRow(row: Record<string, string | number>): string {
  const nameFields = ['name', 'Name', 'NAME', 'full_name', 'recipient_name'];
  for (const field of nameFields) {
    if (row[field]) {
      return row[field].toString();
    }
  }
  return 'Recipient';
}