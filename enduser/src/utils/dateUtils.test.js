import { describe, it, expect } from "vitest";

import { utcToLocal, formatDate } from "./dateUtils";

describe("Date Utils", () => {
  it("formatDate formats date string to MMM dd, yyyy, hh:mm a", () => {
    const date = new Date("2023-01-01T12:00:00Z");

    const formatted = formatDate(date);

    expect(formatted).toBe("Jan 01, 2023, 05:45 PM");
  });

  it("utcToLocal converts UTC to local time", () => {
    const utcDate = new Date("2023-01-01T12:00:00Z");

    const localDate = utcToLocal(utcDate);

    expect(localDate).toBe("Jan 01, 2023, 05:45 PM");
  });
});