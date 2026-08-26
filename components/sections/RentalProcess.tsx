import { ClipboardList, PackageCheck, PhoneCall, Truck } from "lucide-react";

const steps = [
  { title: "Request a Quote", body: "Tell us about your project so we can help you find the dumpster that fits your needs.", icon: ClipboardList },
  { title: "Schedule Delivery", body: "Call 262-233-6131 to schedule a delivery window and placement details.", icon: Truck },
  { title: "Fill It Up", body: "Fill the dumpster during your 15 day rental period, keeping material below the top edge.", icon: PackageCheck },
  { title: "We Pick It Up", body: "Call when you are done and we will come haul everything away.", icon: PhoneCall }
];

export function RentalProcess() {
  return (
    <div className="process-grid">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <article className="card process-card" key={step.title}>
            <span className="service-number">0{index + 1}</span>
            <Icon size={28} aria-hidden />
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        );
      })}
    </div>
  );
}
