// Student progress management
export type StepKey = "resume" | "communication" | "domain" | "quants" | "interview" | "report";

const STEPS_ORDER: StepKey[] = ["resume", "communication", "domain", "quants", "interview", "report"];

const STORAGE_KEY = "vyona_progress";

export function getProgress(): Record<StepKey, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { resume: false, communication: false, domain: false, quants: false, interview: false, report: false };
}

export function completeStep(step: StepKey) {
  const p = getProgress();
  p[step] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function isStepUnlocked(step: StepKey): boolean {
  if (step === "resume") return true; // Always unlocked
  const p = getProgress();
  const idx = STEPS_ORDER.indexOf(step);
  // All previous steps must be completed
  for (let i = 0; i < idx; i++) {
    if (!p[STEPS_ORDER[i]]) return false;
  }
  return true;
}

export function isStepCompleted(step: StepKey): boolean {
  return getProgress()[step];
}

export function getCurrentStep(): StepKey {
  const p = getProgress();
  for (const s of STEPS_ORDER) {
    if (!p[s]) return s;
  }
  return "report";
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStepIndex(step: StepKey): number {
  return STEPS_ORDER.indexOf(step);
}

export const ALL_STEPS = STEPS_ORDER;
