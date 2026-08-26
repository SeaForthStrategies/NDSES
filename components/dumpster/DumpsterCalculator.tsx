"use client";

import { useMemo, useState } from "react";
import { Calculator, MapPin } from "lucide-react";
import type { DumpsterSize } from "@/types/cms";
import { materialTypes, projectTypes, recommendDumpsters } from "@/lib/dumpsterRules";
import { trackEvent } from "@/lib/analytics";
import { DumpsterCard } from "./DumpsterCard";

export function DumpsterCalculator({ dumpsters }: { dumpsters: DumpsterSize[] }) {
  const [address, setAddress] = useState("");
  const [project, setProject] = useState(projectTypes[0]);
  const [material, setMaterial] = useState(materialTypes[0]);
  const [completed, setCompleted] = useState(false);
  const recommendations = useMemo(() => recommendDumpsters(project, material, dumpsters), [project, material, dumpsters]);

  function calculate() {
    setCompleted(true);
    trackEvent("dumpster_calculator_complete", { project, material, hasAddress: Boolean(address) });
  }

  return (
    <div className="calculator-panel">
      <div className="calculator-form card">
        <p className="eyebrow">Dumpster Calculator</p>
        <h2>Find the right size dumpster</h2>
        <p>Answer a few quick questions and get a practical roll-off size recommendation.</p>
        <div className="field">
          <label htmlFor="calculator-address">Enter your service address</label>
          <div className="input-with-icon">
            <MapPin size={18} aria-hidden />
            <input id="calculator-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street address, city" />
          </div>
          <small>Service-area lookup can be connected later.</small>
        </div>
        <div className="field">
          <label htmlFor="calculator-project">Select your project</label>
          <select id="calculator-project" value={project} onChange={(event) => setProject(event.target.value)}>
            {projectTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="calculator-material">What materials are you throwing away?</label>
          <select id="calculator-material" value={material} onChange={(event) => setMaterial(event.target.value)}>
            {materialTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        <button className="btn primary" onClick={calculate} type="button"><Calculator size={18} aria-hidden /> Show Recommendation</button>
        <p className="fine-print">This is a 15 day rental. If you use a credit card for payment, there will be a 3% fee.</p>
      </div>
      <div className="calculator-results">
        {completed ? (
          <>
            <p className="eyebrow">Recommended</p>
            <h2>Best fit for your project</h2>
            <div className="grid two">
              {recommendations.map((dumpster, index) => <DumpsterCard dumpster={dumpster} featured={index === 0} key={dumpster.slug} />)}
            </div>
          </>
        ) : (
          <div className="card tint">
            <p className="eyebrow">Compare Sizes</p>
            <h2>Start with your project details</h2>
            <p>Recommendations will appear here. You can still compare every available roll-off size below.</p>
          </div>
        )}
      </div>
    </div>
  );
}
