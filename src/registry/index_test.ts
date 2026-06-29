import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import {
  registerHandler,
  removeHandler,
  getHandlers,
  getHandlersForField,
  applyHandlers,
  clearHandlers,
  resetHandlers,
} from "./index.ts";

describe("Registry", () => {
  it("registerHandler stores and returns an id", () => {
    clearHandlers();
    const id = registerHandler({
      field: "test",
      regex: /test/,
      type: "string",
    });
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);

    const all = getHandlers();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe(id);
    expect(all[0].field).toBe("test");
    expect(all[0].createdAt).toBeInstanceOf(Date);
  });

  it("removeHandler removes and returns true for existing handler", () => {
    clearHandlers();
    const id = registerHandler({
      field: "test",
      regex: /test/,
      type: "string",
    });
    expect(removeHandler(id)).toBe(true);
    expect(getHandlers().length).toBe(0);
  });

  it("removeHandler returns false for non-existent id", () => {
    clearHandlers();
    expect(removeHandler("nonexistent")).toBe(false);
  });

  it("getHandlers returns handlers sorted by priority (highest first)", () => {
    clearHandlers();
    registerHandler({ field: "a", regex: /a/, type: "string", priority: 1 });
    registerHandler({ field: "b", regex: /b/, type: "string", priority: 10 });
    registerHandler({ field: "c", regex: /c/, type: "string", priority: 5 });

    const sorted = getHandlers();
    expect(sorted[0].field).toBe("b");
    expect(sorted[1].field).toBe("c");
    expect(sorted[2].field).toBe("a");
  });

  it("getHandlers treats missing priority as 0", () => {
    clearHandlers();
    registerHandler({ field: "low", regex: /low/, type: "string" });
    registerHandler({
      field: "high",
      regex: /high/,
      type: "string",
      priority: 5,
    });

    const sorted = getHandlers();
    expect(sorted[0].field).toBe("high");
    expect(sorted[1].field).toBe("low");
  });

  it("getHandlersForField filters by field name", () => {
    clearHandlers();
    registerHandler({ field: "year", regex: /\d{4}/, type: "number" });
    registerHandler({ field: "year", regex: /\((\d{4})\)/, type: "number" });
    registerHandler({ field: "quality", regex: /1080p/, type: "string" });

    const yearHandlers = getHandlersForField("year");
    expect(yearHandlers.length).toBe(2);
    for (const h of yearHandlers) {
      expect(h.field).toBe("year");
    }
  });

  it("applyHandlers sets string type from full match", () => {
    clearHandlers();
    registerHandler({
      field: "quality",
      regex: /1080p|720p|2160p/,
      type: "string",
    });
    const result = applyHandlers("Show.Name.S01E01.1080p-GROUP", {});
    expect(result.quality).toBe("1080p");
  });

  it("applyHandlers sets string type from capture group", () => {
    clearHandlers();
    registerHandler({
      field: "year",
      regex: /\((\d{4})\)/,
      type: "string",
    });
    const result = applyHandlers("Movie.Name.(2023).1080p-GROUP", {});
    expect(result.year).toBe("2023");
  });

  it("applyHandlers sets number type", () => {
    clearHandlers();
    registerHandler({
      field: "year",
      regex: /\((\d{4})\)/,
      type: "number",
    });
    const result = applyHandlers("Movie.Name.(2023).1080p-GROUP", {});
    expect(result.year).toBe(2023);
  });

  it("applyHandlers sets boolean type", () => {
    clearHandlers();
    registerHandler({
      field: "isRemux",
      regex: /REMUX/i,
      type: "boolean",
    });
    const result = applyHandlers("Movie.Name.REMUX.1080p-GROUP", {});
    expect(result.isRemux).toBe(true);
  });

  it("applyHandlers sets string[] type from capture groups", () => {
    clearHandlers();
    registerHandler({
      field: "episodes",
      regex: /E(\d+)E(\d+)E(\d+)/i,
      type: "string[]",
    });
    const result = applyHandlers("Show.S01E01E02E03.1080p", {});
    expect(result.episodes).toEqual(["01", "02", "03"]);
  });

  it("applyHandlers sets number[] type from capture groups", () => {
    clearHandlers();
    registerHandler({
      field: "episodes",
      regex: /E(\d+)E(\d+)/i,
      type: "number[]",
    });
    const result = applyHandlers("Show.S01E01E02.1080p", {});
    expect(result.episodes).toEqual([1, 2]);
  });

  it("applyHandlers uses postProcess when provided", () => {
    clearHandlers();
    registerHandler({
      field: "season",
      regex: /S(\d+)/i,
      type: "string",
      postProcess: (match) => parseInt(match[1], 10),
    });
    const result = applyHandlers("Show.S05E01.1080p", {});
    expect(result.season).toBe(5);
  });

  it("applyHandlers preserves existing context values", () => {
    clearHandlers();
    registerHandler({
      field: "quality",
      regex: /1080p/,
      type: "string",
    });
    const result = applyHandlers("Show.S01E01.1080p", {
      title: "Show",
      existing: 42,
    });
    expect(result.title).toBe("Show");
    expect(result.existing).toBe(42);
    expect(result.quality).toBe("1080p");
  });

  it("clearHandlers removes all handlers", () => {
    clearHandlers();
    registerHandler({ field: "a", regex: /a/, type: "string" });
    registerHandler({ field: "b", regex: /b/, type: "string" });
    expect(getHandlers().length).toBe(2);

    clearHandlers();
    expect(getHandlers().length).toBe(0);
  });

  it("resetHandlers is an alias for clearHandlers", () => {
    clearHandlers();
    registerHandler({ field: "a", regex: /a/, type: "string" });
    expect(getHandlers().length).toBe(1);

    resetHandlers();
    expect(getHandlers().length).toBe(0);
  });

  it("applyHandlers does not set value when regex does not match", () => {
    clearHandlers();
    registerHandler({
      field: "year",
      regex: /\((\d{4})\)/,
      type: "number",
    });
    const result = applyHandlers("Movie.Name.1080p-GROUP", {});
    expect(result.year).toBeUndefined();
  });

  it("applyHandlers uses string regex", () => {
    clearHandlers();
    registerHandler({
      field: "quality",
      regex: "1080p|720p",
      type: "string",
    });
    const result = applyHandlers("Show.S01E01.720p-GROUP", {});
    expect(result.quality).toBe("720p");
  });
});
