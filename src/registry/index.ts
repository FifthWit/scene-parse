import type { HandlerConfig, RegisteredHandler } from "./types.ts";

const handlers = new Map<string, RegisteredHandler>();
let counter = 0;

function generateId(): string {
  counter++;
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${ts}-${counter}-${rand}`;
}

function toRegExp(regex: RegExp | string): RegExp {
  return typeof regex === "string" ? new RegExp(regex) : regex;
}

function extractValue(match: RegExpMatchArray, type: string): unknown {
  switch (type) {
    case "string":
      return match[1] ?? match[0];
    case "number":
      return parseFloat(match[1] ?? match[0]);
    case "boolean":
      return true;
    case "string[]":
      return match.slice(1).filter((s): s is string => s !== undefined);
    case "number[]":
      return match
        .slice(1)
        .filter((s): s is string => s !== undefined)
        .map(Number);
    default:
      return match[0];
  }
}
/**
 * Instantiates a new handler to be ran when {@link applyHandlers} is ran
 * @param config configuration used to define a handler
 * ```ts
 * import type { HandlerConfig } from "jsr:@fifth/scene-parser"
 * const handlerConfig: HandlerConfig = {
 *    field: "password",
 *    regex: /(?<=Password\.)\d+/i
 *    type: "string"
 * }
 * 
 * const title = "Incredible.Protected.File.Password.19171645747200"
 * ```
 * @returns uniquely generated id string for use in functions like {@link removeHandler}
 */
export function registerHandler(config: HandlerConfig): string {
  const id = generateId();
  handlers.set(id, {
    ...config,
    id,
    createdAt: new Date(),
  });
  return id;
}

/**
 * Removes handlers based on id
 * @param id deletes handler matching the id field in the {@link RegisteredHandler|handler's config}
 * @returns true or false on whether or not there was a handler found to delete
 */
export function removeHandler(id: string): boolean {
  return handlers.delete(id);
}

/**
 * function for retrieving all registered handlers
 * @returns array of {@link RegisteredHandler}
 */
export function getHandlers(): readonly RegisteredHandler[] {
  return Array.from(handlers.values()).sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );
}
/**
 * Filters all handlers to return all handlers that use the field described in the field parameter
 * @param field the unqiue `field` for handler as defined in {@link HandlerConfig} to filter parsers by
 * @returns array of all {@link RegisteredHandler|registered handlers} where their `field` key matches the `field` parameter
 */
export function getHandlersForField(
  field: string,
): readonly RegisteredHandler[] {
  return getHandlers().filter((h) => h.field === field);
}

/**
 * Clears all registered handlers. Important to use in order to not have unintended side effects from other handlers 
 */
export function clearHandlers(): void {
  handlers.clear();
}

/**
 * Function for parsing a title through parsers applied via {@link registerHandler}
 * @param title title of content you need ran through handlers. For example: "Show.Name.S01E01.1080p-GROUP"
 * @param context object for parsed information to be appended to. 
 * @returns object with the destructured context input, and all appended data applied by other handlers through the {@link registerHandler} function
 * 
 * ```ts
 * import { applyHandlers, registerHandler, type HandlerConfig } from "jsr:@fifth/scene-parser"
 * 
 * const handlerConfig: HandlerConfig = {
 *    field: "password",
 *    regex: /(?<=Password\.)\d+/i
 *    type: "string"
 * }
 * 
 * const title = "Incredible.Protected.File.Password.19171645747200"
 * 
 * const contextToTheTitle = {
 *   protected: true,
 *   good: true,
 *   regret: "none"
 * },
 * 
 * registerHandler(handlerConfig)
 * const extraParsedInfo = applyHandlers(title, contextToTheTitle)
 * 
 * console.log(extraParsedInfo)
 * // {
 * //   protected: true,
 * //   good: true,
 * //   regret: "none",
 * //   password: "19171645747200"
 * // }
 * 
 * clearHandlers() // best practice is to clear all handlers when finished using them.
 * ```
 */
export function applyHandlers(
  title: string,
  context: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...context };
  for (const handler of getHandlers()) {
    const match = title.match(toRegExp(handler.regex));
    if (match) {
      result[handler.field] = handler.postProcess
        ? handler.postProcess(match)
        : extractValue(match, handler.type);
    }
  }
  return result;
}
