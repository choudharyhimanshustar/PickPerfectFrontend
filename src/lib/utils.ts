import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { STEPS, VideoStatus, StepState } from "./types/video";
/**
 * Utility to merge class names conditionally.
 * Used by shadcn/ui components to handle Tailwind className merging.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStepIndex(stepKey: string): number {
  const idx = STEPS.findIndex((s) => s.key === stepKey);
  return idx === -1 ? 0 : idx;
}

export function resolveStepState(
  stepIdx: number,
  activeIdx: number,
  status: VideoStatus,
): StepState {
  if (status === "processed") return "done"; // ← ALL steps done when processed
  if (status === "failed" && stepIdx === activeIdx) return "failed";
  if (stepIdx < activeIdx) return "done";
  if (stepIdx === activeIdx && status === "processing") return "active";
  return "pending";
}
