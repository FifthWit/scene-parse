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

export function registerHandler(config: HandlerConfig): string {
  const id = generateId();
  handlers.set(id, {
    ...config,
    id,
    createdAt: new Date(),
  });
  return id;
}

export function removeHandler(id: string): boolean {
  return handlers.delete(id);
}

export function getHandlers(): readonly RegisteredHandler[] {
  return Array.from(handlers.values()).sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );
}

export function getHandlersForField(
  field: string,
): readonly RegisteredHandler[] {
  return getHandlers().filter((h) => h.field === field);
}

export function clearHandlers(): void {
  handlers.clear();
}

export const resetHandlers = clearHandlers;

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
