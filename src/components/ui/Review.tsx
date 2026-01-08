"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[27rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <h2 className="text-3xl font-semibold tracking-tight text-white mb-8">
        AI Feedback Musicians Actually Trust
      </h2>
      <InfiniteMovingCards items={reviews} direction="left" speed="slow" />
    </div>
  );
}

const reviews = [
  {
    quote:
      "PickPerfect instantly showed me where my chord transitions were off. I fixed mistakes in minutes that used to take weeks.",
    name: "Aarav Mehta",
    title: "Guitarist · Indie Rock",
    rating: 5,
  },
  {
    quote:
      "The rhythm and timing feedback is insanely accurate. It feels like having a personal music coach 24/7.",
    name: "Riya Sharma",
    title: "Singer-Songwriter",
    rating: 5,
  },
  {
    quote:
      "Uploading a video and getting clear, actionable feedback is a game changer for daily practice.",
    name: "Kunal Verma",
    title: "Music Student",
    rating: 4,
  },
  {
    quote:
      "PickPerfect helped me identify pitch issues I couldn’t hear myself. Super helpful for vocal training.",
    name: "Sneha Patel",
    title: "Vocalist",
    rating: 5,
  },
];
