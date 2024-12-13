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
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Generate production-quality ${language} code that makes a POST request to 'http://localhost:8080/send-emails':

1. Uses this exact JSON structure:
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
        ${fields.map((field) => `"${field}": "get the value from the user"`).join(",\n      ")}
    }
}

Requirements:
- Use modern ${language} syntax and best practices:
- For only one recipient:
- Use given parameters names: ${fields.map((field) => `"${field}": "get the value from the user"`).join(",\n      ")}
- Use fetch API with async/await:
- Include comprehensive error handling for network and API errors:
- Handle rate limiting and retries:
- Validate input parameters before sending the request:

Return only the implementation code without explanations or comments.`;

  console.log('Generated prompt:', prompt); // Added logging

  const result = await model.generateContent(prompt);
  const generatedCode = result.response.text();
  
  // Remove code fence markers for any language
  const cleanedCode = generatedCode.replace(/^```.*\n|\n.*```\s*$/g, "").trim();
  
  return cleanedCode;
}
