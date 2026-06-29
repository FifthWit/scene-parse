import type { ParseResult } from "../types/core.ts";
import { parseTitle } from "./parseTitle.ts";

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: ParseResult | null;
};

export function validateTitle(title: string): ValidationResult {
  try {
    const result = parseTitle(title);
    const missingWarnings = result.warnings.filter((w) =>
      w.startsWith("Could not detect"),
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
