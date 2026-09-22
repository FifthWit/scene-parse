import type { registerHandler as _registerHandler } from "./index.ts";

/**
 * Configuration for creating a new handler with the {@link _registerHandler|registerHandler} function. if `postProcess()` is defined, it will be ran every time the handler is called.
 */
export type HandlerConfig = {
  field: string;
  regex: RegExp | string;
  type: "string" | "number" | "boolean" | "string[]" | "number[]";
  priority?: number;
  description?: string;
  postProcess?: (match: RegExpMatchArray) => unknown;
};

/**
 * Type for working with custom handlers with the parser
 * 
 * @remarks
 * This type is for internal use to keep track of handlers by internal functions.
 */
export type RegisteredHandler = HandlerConfig & {
  /** Must be a *unique* identifier */
  id: string;
  createdAt: Date;
};
