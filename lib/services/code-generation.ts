import { GoogleGenerativeAI } from "@google/generative-ai";
import { CodeGenerationParams } from "@/types/automate";

/**
 * Generates code using Google's Generative AI
 */
export async function generateCodeWithAI({
  templateId,
  language,
  fields,
}: CodeGenerationParams): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Generate code in ${language} to send an email using a REST API. 
    The code should make a POST request to 'http://localhost:8080/send-emails' with the following JSON structure:
    {
      "user_key": "instert_user_key_here",
      "service_id": "insert_service_id_here",
      "template_id": "${templateId}",
      "recipients": [
        {
          "email_address": "recipient@example.com",
          "name": "Recipient Name"
        }
      ],
      "parameters": {
        ${fields.map(field => `"${field}": "value"`).join(',\n        ')}
      }
    }
    
    Requirements:
    - Return only the ${language} code without any explanations
    - use the 'fetch' API to make the request

    Include error handling and proper response handling. The API returns a JSON response with 'success' boolean and optional 'errors' array.
    Make the code reusable and well-documented.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}