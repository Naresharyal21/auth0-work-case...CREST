import { describe, it, expect } from "vitest";
import { getInitials } from "./stringUtils";

describe("String format", () => {
  it("return empty when name is false ", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials(null)).toBe("");
    expect(getInitials(undefined)).toBe("");
  });
  it(" returns Result when name is true", () => {
    expect(getInitials("Naresh")).toBe("N");
  });

  it(" returns first letter when name has only one name word", () => {
    expect(getInitials("Naresh")).toBe("N");
  });

  it("Returns first letter if both words when there is TWO words name ",()=>{
    expect(getInitials("Naresh Aryal")).toBe("NA");
  });
});
