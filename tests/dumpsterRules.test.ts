import { describe, expect, it } from "vitest";
import { dumpsterSizes } from "@/lib/cms/mock-data";
import { dumpsterRecommendationRules, recommendDumpsters } from "@/lib/dumpsterRules";

const slugs = (project: string, material: string) => recommendDumpsters(project, material, dumpsterSizes).map((size) => size.slug);

describe("dumpster recommendations", () => {
  it("only references sizes that exist", () => {
    const known = new Set(dumpsterSizes.map((size) => size.slug));
    for (const rule of dumpsterRecommendationRules) {
      for (const slug of rule.recommendedSlugs) expect(known.has(slug)).toBe(true);
    }
  });

  it("recommends the separate 10 and 12 yard sizes", () => {
    expect(slugs("Home/Garage Cleanout", "Mixed Household Trash")).toEqual(["10-yard", "12-yard"]);
    expect(slugs("Bathroom/Kitchen Demo", "Construction Debris")).toEqual(["12-yard", "15-yard"]);
    expect(slugs("Concrete, Dirt, and Rocks", "Other Heavy Materials")).toEqual(["10-yard"]);
  });
});
