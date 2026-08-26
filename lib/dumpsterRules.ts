import type { DumpsterSize } from "@/types/cms";

export const projectTypes = [
  "Home/Garage Cleanout",
  "Home Remodel",
  "Bathroom/Kitchen Demo",
  "Roofing/Siding Teardown",
  "Concrete, Dirt, and Rocks",
  "Other"
];

export const materialTypes = [
  "Mixed Household Trash",
  "Construction Debris",
  "Wood",
  "Other Heavy Materials"
];

type Rule = {
  project: string;
  materials: string[];
  recommendedSlugs: string[];
};

// TODO: ACF - Move calculator rules into editable CMS fields when WordPress ACF is connected.
export const dumpsterRecommendationRules: Rule[] = [
  { project: "Home/Garage Cleanout", materials: ["Mixed Household Trash", "Wood"], recommendedSlugs: ["10-12-yard", "15-yard"] },
  { project: "Home Remodel", materials: ["Construction Debris", "Wood"], recommendedSlugs: ["15-yard", "20-yard"] },
  { project: "Bathroom/Kitchen Demo", materials: ["Construction Debris"], recommendedSlugs: ["10-12-yard", "15-yard"] },
  { project: "Roofing/Siding Teardown", materials: ["Construction Debris"], recommendedSlugs: ["20-yard", "30-yard"] },
  { project: "Concrete, Dirt, and Rocks", materials: ["Other Heavy Materials"], recommendedSlugs: ["10-12-yard"] },
  { project: "Other", materials: materialTypes, recommendedSlugs: ["15-yard", "20-yard"] }
];

export function recommendDumpsters(project: string, material: string, dumpsters: DumpsterSize[]) {
  const rule =
    dumpsterRecommendationRules.find((item) => item.project === project && item.materials.includes(material)) ??
    dumpsterRecommendationRules.find((item) => item.project === project) ??
    dumpsterRecommendationRules[dumpsterRecommendationRules.length - 1];

  const recommended = rule.recommendedSlugs
    .map((slug) => dumpsters.find((dumpster) => dumpster.slug === slug))
    .filter((dumpster): dumpster is DumpsterSize => Boolean(dumpster));

  return recommended.length ? recommended : dumpsters.slice(0, 2);
}
