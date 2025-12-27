"use client";
import React from "react";
import { PiGuitar, PiRankingDuotone } from "react-icons/pi";
import { MdModelTraining } from "react-icons/md";
import { GoPulse } from "react-icons/go";
import TiltCard from "./TiltCard";
import { Button } from "@/components/ui/button";
import { FaUpload } from "react-icons/fa6";

type AnalysisItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type ScoreItem = {
  label: string;
  value: number;
  color: string;
};

const analysisItems: AnalysisItem[] = [
  {
    title: "Chord Accuracy",
    description:
      "Detects correct, missed, and incorrect chord transitions in real time.",
    icon: <PiGuitar />,
  },
  {
    title: "Rhythm & Timing",
    description:
      "Measures tempo drift, beat consistency, and timing precision.",
    icon: <GoPulse />,
  },
  {
    title: "Pitch & Tone",
    description:
      "Identifies off-pitch notes and tonal instability with precision.",
    icon: <MdModelTraining />,
  },
  {
    title: "Performance Score",
    description:
      "A single clear score with a detailed breakdown of your performance.",
    icon: <PiRankingDuotone />,
  },
];

const scoreData: ScoreItem[] = [
  { label: "Chords", value: 82, color: "bg-emerald-400" },
  { label: "Rhythm", value: 65, color: "bg-blue-400" },
  { label: "Pitch", value: 74, color: "bg-amber-400" },
];

const AnalysisSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-24">
      {/* Header */}
      <div className="max-w-2xl mb-16 mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Hear Your Playing Like a Pro Coach
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          AI feedback that tells you what went wrong, where, and how to fix it.{" "}
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">
        {/* LEFT: Bullet Points */}
        <div className="space-y-8">
          {analysisItems.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div
                className="
                  text-2xl text-white
                  mt-1
                "
              >
                {item.icon}
              </div>

              <div>
                <h4 className="text-white font-medium text-lg">{item.title}</h4>
                <p className="mt-1 text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Mock Data Card */}
        <div className="relative">
          <TiltCard>
            <div
              className="
        rounded-2xl p-8
        bg-gradient-to-br from-zinc-900 to-zinc-800
        border border-white/5
        shadow-[0_20px_60px_rgba(0,0,0,0.8)]
        transition-transform duration-200 ease-out
        will-change-transform"
            >
              <h3 className="text-white text-lg font-semibold mb-6">
                Performance Score
              </h3>

              <div className="flex items-end gap-2 mb-8">
                <span className="text-5xl font-bold text-white">78</span>
                <span className="text-zinc-500 text-2xl">/ 100</span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {scoreData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-300">{item.label}</span>
                      <span className="text-zinc-400">{item.value}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`
    h-full rounded-full
    ${item.color}
    transition-all duration-500 ease-out
  `}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback */}
              <div className="mt-8 p-4 rounded-lg bg-black/30 border border-white/5">
                <p className="text-sm text-zinc-300">
                  ⚠ Missed transition <span className="text-white">G → D</span>{" "}
                  at <span className="text-white">1:12</span>
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  Recommendation: Practice transitions at 80 BPM.
                </p>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* CTA */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none top-full mt-20">
          <Button
            size="lg"
            className="
        pointer-events-auto
        cursor-pointer
        gap-2
        rounded-xl
        bg-emerald-500 text-black
        hover:bg-emerald-400
        shadow-[0_15px_40px_rgba(16,185,129,0.2)]
      "
          >
            Upload Video
            <span className="transition-transform group-hover:translate-x-1">
              <FaUpload />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
