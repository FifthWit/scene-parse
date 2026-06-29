import { expect } from "@std/expect";
import { validateTitle } from "./validateTitle.ts";
import { describe, it } from "@std/testing/bdd";

describe("validateTitle", () => {
  it("validates a complete scene title", () => {
    const result = validateTitle(
      "Better.Call.Saul.S03.1080p.NF.WEBRip.DD5.1.x264-ViSUM",
    );
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.info).not.toBe(null);
  });

  it("returns warnings for incomplete titles", () => {
    const result = validateTitle("Movie.Title.2020");
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.info).not.toBe(null);
  });

  it("returns errors for non-parseable titles", () => {
    const result = validateTitle("");
    expect(result.isValid).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("considers a title with detected source as valid", () => {
    const result = validateTitle(
      "Show.Name.S01.E01.1080p.AMZN.WEB-DL.DD5.1.x264-GROUP",
    );
    expect(result.isValid).toBe(true);
  });
});
