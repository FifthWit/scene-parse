import type { ParseResult } from "../types/core.ts";
import { parseTitle } from "./parseTitle.ts";

/** Results of {@link validateTitle} */
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: ParseResult | null;
};

/**
 * Validates if a release title when ran through {@link parseTitle} has errors
 * @param title Title of the release you are validating
 * @returns The {@link ValidationResult} object
 */
export function validateTitle(title: string): ValidationResult {
  try {
    const result = parseTitle(title);
    const missingWarnings = result.warnings.filter((w) =>
      w.startsWith("Could not detect")
    );
    return {
      isValid: missingWarnings.length === 0,
      errors: [],
      warnings: missingWarnings,
      info: result,
    };
  } catch (err) {
    return {
      isValid: false,
      errors: [err instanceof Error ? err.message : String(err)],
      warnings: [],
      info: null,
    };
  }
}
