import { Building2, Home, MapPinned, Truck } from "lucide-react";
import type { ServiceArea } from "@/types/cms";

const serviceMeta = {
  residential: { label: "Residential", icon: Home },
  commercial: { label: "Commercial", icon: Building2 },
  rollOff: { label: "Roll-off", icon: Truck }
};

export function ServiceAreaMap({ areas }: { areas: ServiceArea[] }) {
  return (
    <div className="service-map-wrap">
      <div className="service-map" aria-label="NDS service area map">
        <div className="map-grid" aria-hidden />
        {areas.map((area) => (
          <div className="map-point" style={{ left: `${area.coordinates?.x ?? 50}%`, top: `${area.coordinates?.y ?? 50}%` }} key={area.name}>
            <span className={`point-dot ${area.serviceTypes.includes("residential") ? "residential" : area.serviceTypes.includes("commercial") ? "commercial" : "rollOff"}`} />
            <span className="point-label">{area.name}</span>
          </div>
        ))}
        <MapPinned className="map-emblem" size={58} aria-hidden />
      </div>
      <div className="card map-list">
        <p className="eyebrow">Service Area</p>
        <h2>Southern Wisconsin coverage</h2>
        <p>Residential service is concentrated in listed communities. Commercial and temporary roll-off service is available in select areas of nearby counties.</p>
        <div className="map-legend">
          {Object.entries(serviceMeta).map(([key, meta]) => {
            const Icon = meta.icon;
            return <span key={key}><Icon size={16} aria-hidden /> {meta.label}</span>;
          })}
        </div>
        <ul className="area-list">
          {areas.map((area) => (
            <li key={area.name}>
              <strong>{area.name}</strong>
              <span>{area.county}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
