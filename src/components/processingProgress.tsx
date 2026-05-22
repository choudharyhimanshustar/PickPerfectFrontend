"use client";
import React from "react";
import {Props} from "../lib/types/video";
import { getStepIndex } from "@/lib/utils";
import { STEPS, VideoStatus,StepState } from "@/lib/types/video";
import { resolveStepState } from "@/lib/utils";

function ConnectionPill({
  isConnected,
  status,
}: {
  isConnected: boolean;
  status: VideoStatus | null;
}) {
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Done
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Failed
      </span>
    );
  }
  return (
    <span className={`flex items-center gap-1.5 text-xs ${isConnected ? "text-blue-400" : "text-zinc-500"}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isConnected ? "bg-blue-400 animate-pulse" : "bg-zinc-600"
        }`}
      />
      {isConnected ? "Live" : "Connecting..."}
    </span>
  );
}


function StepIcon({ state }: { state: StepState }) {
  const base = "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300";
 
  if (state === "done") {
    return (
      <div className={`${base} bg-emerald-500/15 border border-emerald-500/40`}>
        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 7l3 3 6-6" />
        </svg>
      </div>
    );
  }
 
  if (state === "active") {
    return (
      <div className={`${base} bg-blue-500/15 border border-blue-500/40`}>
        <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
      </div>
    );
  }
 
  if (state === "failed") {
    return (
      <div className={`${base} bg-red-500/15 border border-red-500/40`}>
        <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 8M11 3l-8 8" />
        </svg>
      </div>
    );
  }
 
  // pending
  return (
    <div className={`${base} bg-white/5 border border-white/10`}>
      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
    </div>
  );
}

export default function ProcessingProgress({
  step,
  status,
  percent,
  message,
  isConnected,
}: Props) {
  const activeIdx = step ? getStepIndex(step) : 0;
 
  return (
    <div className="rounded-2xl p-6 bg-zinc-900 border border-white/5 min-h-[300px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-zinc-300">Processing</h3>
        <ConnectionPill isConnected={isConnected} status={status} />
      </div>
 
      {/* Steps */}
      <div className="flex-1 space-y-0">
        {STEPS.map((s, i) => {
          const state = resolveStepState(i, activeIdx, status ?? "pending");
          const isLast = i === STEPS.length - 1;
 
          return (
            <div key={s.key} className="flex gap-3">
              {/* Icon + connector column */}
              <div className="flex flex-col items-center">
                <StepIcon state={state} />
                {!isLast && (
                  <div
                    className={`w-px flex-1 min-h-[20px] transition-colors duration-300 ${
                      state === "done"
                        ? "bg-emerald-500/50"
                        : state === "active"
                        ? "bg-blue-500/40"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
 
              {/* Label column */}
              <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                <p
                  className={`text-sm leading-8 transition-colors duration-200 ${
                    state === "pending"
                      ? "text-zinc-500"
                      : state === "failed"
                      ? "text-red-400 font-medium"
                      : state === "active"
                      ? "text-white font-medium"
                      : "text-zinc-300"
                  }`}
                >
                  {s.label}
                </p>
                {state === "active" && (
                  <p className="text-xs text-zinc-500 -mt-2 mb-1">
                    {message ?? s.sub}
                  </p>
                )}
                {state === "failed" && (
                  <p className="text-xs text-red-400/70 -mt-2 mb-1">
                    {message ?? "Processing failed"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
 
      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-zinc-500">{percent}%</span>
          {message && status === "processing" && (
            <span className="text-xs text-zinc-500 truncate max-w-[200px] text-right">
              {message}
            </span>
          )}
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percent}%`,
              background:
                status === "failed"
                  ? "rgb(248 113 113)"
                  : status === "completed"
                  ? "rgb(52 211 153)"
                  : "rgb(96 165 250)",
            }}
          />
        </div>
      </div>
    </div>
  );
}