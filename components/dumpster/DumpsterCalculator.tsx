"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, CheckCircle2, MapPin } from "lucide-react";
import type { DumpsterSize } from "@/types/cms";
import { materialTypes, projectTypes, recommendDumpsters } from "@/lib/dumpsterRules";
import { trackEvent } from "@/lib/analytics";
import { DumpsterCard } from "./DumpsterCard";

const SERVICE_COUNTIES = ["Walworth", "Rock", "Jefferson", "Waukesha", "Kenosha"];

type GeocodeResult = { label: string; lat: number; lon: number; county: string | null; state: string | null };
type ResolvedAddress = { label: string; county: string | null; inServiceArea: boolean };

export function DumpsterCalculator({ dumpsters }: { dumpsters: DumpsterSize[] }) {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [resolved, setResolved] = useState<ResolvedAddress | null>(null);
  const [project, setProject] = useState(projectTypes[0]);
  const [material, setMaterial] = useState(materialTypes[0]);
  const [completed, setCompleted] = useState(false);
  const recommendations = useMemo(() => recommendDumpsters(project, material, dumpsters), [project, material, dumpsters]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (resolved && address !== resolved.label) setResolved(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (address.trim().length < 3 || (resolved && address === resolved.label)) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);
        const data = await response.json();
        setSuggestions(data.results ?? []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  function selectSuggestion(result: GeocodeResult) {
    setAddress(result.label);
    setShowSuggestions(false);
    setSuggestions([]);
    setResolved({
      label: result.label,
      county: result.county,
      inServiceArea: Boolean(result.county && SERVICE_COUNTIES.includes(result.county))
    });
  }

  function calculate() {
    setCompleted(true);
    trackEvent("dumpster_calculator_complete", { project, material, hasAddress: Boolean(address), inServiceArea: resolved?.inServiceArea ?? "unknown" });
  }

  return (
    <div className="calculator-panel">
      <div className="calculator-form card">
        <p className="eyebrow">Dumpster Calculator</p>
        <h2>Find the right size dumpster</h2>
        <p>Answer a few quick questions and get a practical roll-off size recommendation.</p>
        <div className="field address-field">
          <label htmlFor="calculator-address">Enter your service address</label>
          <div className="input-with-icon">
            <MapPin size={18} aria-hidden />
            <input
              autoComplete="off"
              id="calculator-address"
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onChange={(event) => setAddress(event.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Street address, city"
              value={address}
            />
          </div>
          {showSuggestions && suggestions.length > 0 ? (
            <ul className="address-suggestions">
              {suggestions.map((result) => (
                <li key={`${result.lat}-${result.lon}`}>
                  <button onClick={() => selectSuggestion(result)} type="button">{result.label}</button>
                </li>
              ))}
            </ul>
          ) : null}
          {resolved ? (
            <small className={resolved.inServiceArea ? "address-status in-area" : "address-status"}>
              {resolved.inServiceArea ? (
                <><CheckCircle2 size={14} aria-hidden /> {resolved.county} County is in the NDS service area.</>
              ) : (
                <>{resolved.county ? `${resolved.county} County` : "This address"} is outside the core NDS service area — call {" "}262-233-6131 to confirm.</>
              )}
            </small>
          ) : (
            <small>Start typing for address suggestions, powered by OpenStreetMap.</small>
          )}
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
