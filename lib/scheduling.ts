export type ShiftRule = {
  id: string;
  holidayDate: string;
  shiftDays: number;
  affectedCommunities?: string[];
  affectedServices?: string[];
  effectiveStart?: string;
  effectiveEnd?: string;
  skipWeekends?: boolean;
};

export type ManualOverride = {
  originalServiceDate: string;
  revisedServiceDate: string;
  community?: string;
  serviceType?: string;
  explanation: string;
};

export type ScheduleInput = {
  normalServiceDate: string;
  community: string;
  serviceType: string;
  rules: ShiftRule[];
  overrides?: ManualOverride[];
  now?: Date;
};

export function calculateSchedule(input: ScheduleInput) {
  const normal = toDate(input.normalServiceDate);
  const override = input.overrides?.find((item) =>
    sameDay(toDate(item.originalServiceDate), normal) &&
    (!item.community || item.community === input.community) &&
    (!item.serviceType || item.serviceType === input.serviceType)
  );

  if (override) {
    return {
      revisedServiceDate: override.revisedServiceDate,
      alertStatus: "override" as const,
      explanation: override.explanation,
      community: input.community,
      serviceType: input.serviceType
    };
  }

  const rule = input.rules.find((candidate) => ruleApplies(candidate, input, normal));
  if (!rule) {
    return {
      revisedServiceDate: input.normalServiceDate,
      alertStatus: "normal" as const,
      explanation: "Normal service is expected.",
      community: input.community,
      serviceType: input.serviceType
    };
  }

  let revised = addDays(normal, rule.shiftDays);
  if (rule.skipWeekends) {
    while ([0, 6].includes(revised.getUTCDay())) revised = addDays(revised, 1);
  }

  return {
    revisedServiceDate: formatDate(revised),
    alertStatus: "shifted" as const,
    explanation: `Service shifts ${rule.shiftDays} day${rule.shiftDays === 1 ? "" : "s"} due to the configured holiday or operational rule.`,
    community: input.community,
    serviceType: input.serviceType
  };
}

function ruleApplies(rule: ShiftRule, input: ScheduleInput, normal: Date) {
  const now = input.now ?? new Date();
  if (rule.effectiveStart && toDate(rule.effectiveStart) > now) return false;
  if (rule.effectiveEnd && toDate(rule.effectiveEnd) < now) return false;
  if (rule.affectedCommunities?.length && !rule.affectedCommunities.includes(input.community)) return false;
  if (rule.affectedServices?.length && !rule.affectedServices.includes(input.serviceType)) return false;
  return sameDay(toDate(rule.holidayDate), normal);
}

function toDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function sameDay(a: Date, b: Date) {
  return formatDate(a) === formatDate(b);
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
