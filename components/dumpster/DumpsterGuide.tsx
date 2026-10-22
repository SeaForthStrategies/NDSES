"use client";

import { useMemo, useState } from "react";
import type { DumpsterSize } from "@/types/cms";
import { trackEvent } from "@/lib/analytics";
import { DUMPSTER_SIZE_SELECTED_EVENT } from "@/lib/dumpster-events";

const projectTypes = ["All", "Cleanout", "Remodel", "Construction"];
const DIMENSIONS_NOTE = /\s*Dumpster dimensions may vary[^.]*\.?/i;

/**
 * Side-by-side size comparison. "Choose" hands the size to the inquiry form
 * on the same page (via DUMPSTER_SIZE_SELECTED_EVENT) and scrolls to it.
 */
export function DumpsterGuide({ sizes }: { sizes: DumpsterSize[] }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState("");
  const filtered = useMemo(
    () => sizes.filter((size) => filter === "All" || size.exampleProjects.some((project) => project.includes(filter))),
    [filter, sizes]
  );
  const note = sizes.map((size) => size.dimensions.match(DIMENSIONS_NOTE)?.[0]?.trim()).find(Boolean);

  function selectSize(size: DumpsterSize) {
    setSelected(size.slug);
    window.dispatchEvent(new CustomEvent(DUMPSTER_SIZE_SELECTED_EVENT, { detail: size.name }));
    document.getElementById("dumpster-inquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("dumpster_size_selected", { size: size.name });
  }

  return (
    <div className="size-guide">
      <div className="size-guide-head">
        <div>
          <p className="eyebrow">Dumpster Size Guide</p>
          <h2>Compare sizes for your project</h2>
        </div>
        <div className="filter-group" role="group" aria-label="Filter sizes by project type">
          {projectTypes.map((type) => (
            <button aria-pressed={filter === type} className="tab" key={type} onClick={() => setFilter(type)} type="button">{type}</button>
          ))}
        </div>
      </div>

      <div className="size-table" role="table" aria-label="Roll-off dumpster size comparison">
        <div className="size-row size-row-head" role="row">
          <span role="columnheader">Size</span>
          <span role="columnheader">Capacity</span>
          <span role="columnheader">Dimensions</span>
          <span role="columnheader">Good for</span>
          <span role="columnheader"><span className="sr-only">Choose</span></span>
        </div>
        {filtered.map((size) => (
          <div className={`size-row${selected === size.slug ? " is-selected" : ""}`} key={size.slug} role="row">
            <strong className="size-name" role="cell">{size.name}</strong>
            <span role="cell"><span className="size-label">Capacity</span>{size.capacity}</span>
            <span role="cell"><span className="size-label">Dimensions</span>{size.dimensions.replace(DIMENSIONS_NOTE, "")}</span>
            <span role="cell"><span className="size-label">Good for</span>{size.exampleProjects.join(", ")}</span>
            <span role="cell">
              <button className="btn btn-outline btn-sm" onClick={() => selectSize(size)} type="button">
                {selected === size.slug ? "Selected" : "Choose this size"}
              </button>
            </span>
          </div>
        ))}
      </div>
      {note ? <p className="fine-print stack-top-sm">{note}</p> : null}
    </div>
  );
}
