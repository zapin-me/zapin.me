import { z } from "zod";

export const pinFormSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Max message length is 500 characters."),
  amount: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(1000000, "Max amount is 1,000,000."),
});

/**
 * Validates the pin form and returns field-keyed error messages.
 * An empty object means the input is valid.
 * @param {{ message: string, amount: number }} input
 * @returns {Record<string, string>}
 */
export function validatePinForm(input) {
  try {
    pinFormSchema.parse(input);
    return {};
  } catch (e) {
    const formattedErrors = {};
    e.issues.forEach((issue) => {
      formattedErrors[issue.path[0]] = issue.message;
    });
    return formattedErrors;
  }
}
