"use client";

import { useMemo, useState } from "react";
import type { DumpsterSize } from "@/types/cms";
import { trackEvent } from "@/lib/analytics";
import { DUMPSTER_SIZE_SELECTED_EVENT } from "@/lib/dumpster-events";

const projectTypes = ["All", "Cleanout", "Remodel", "Construction", "Commercial"];

export function DumpsterGuide({ sizes }: { sizes: DumpsterSize[] }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(sizes[0]?.slug || "");
  const filtered = useMemo(
    () => sizes.filter((size) => filter === "All" || size.exampleProjects.some((project) => project.includes(filter))),
    [filter, sizes]
  );

  function selectSize(size: DumpsterSize) {
    setSelected(size.slug);
    window.dispatchEvent(new CustomEvent(DUMPSTER_SIZE_SELECTED_EVENT, { detail: size.name }));
    document.getElementById("dumpster-inquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("dumpster_size_selected", { size: size.name });
  }

  return (
    <div>
      <p className="eyebrow">Dumpster Size Guide</p>
      <h2>Choose a size for your project</h2>
      <div className="tabs" role="tablist" aria-label="Project type filter">
        {projectTypes.map((type) => (
          <button aria-selected={filter === type} className="tab" key={type} onClick={() => setFilter(type)} role="tab" type="button">{type}</button>
        ))}
      </div>
      <div className="grid four">
        {filtered.map((size) => (
          <article className={`card ${selected === size.slug ? "tint" : ""}`} key={size.slug}>
            <span className="badge">{size.availability}</span>
            <h3 className="stack-top-sm">{size.name}</h3>
            <p><strong>Capacity:</strong> {size.capacity}</p>
            <p><strong>Dimensions:</strong> {size.dimensions}</p>
            <p>{size.recommendedUses}</p>
            <ul>
              {size.exampleProjects.map((project) => <li key={project}>{project}</li>)}
            </ul>
            <button className="btn primary" onClick={() => selectSize(size)} type="button">Request This Size</button>
          </article>
        ))}
      </div>
    </div>
  );
}
