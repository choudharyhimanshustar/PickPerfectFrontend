"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAllVideos,
  useVideoAnalysis,
  useVideoProgress,
} from "@/api/hooks/getVideos";
import { IoArrowBack } from "react-icons/io5";
import { PiGuitar } from "react-icons/pi";
import { GoPulse } from "react-icons/go";
import { PiRankingDuotone } from "react-icons/pi";
import ProcessingProgress from "@/components/processingProgress";
import { VideoItem } from "@/lib/types/video";

function getGradeColor(grade: string) {
  switch (grade) {
    case "Excellent":
      return "text-emerald-400";
    case "Good":
      return "text-blue-400";
    case "Fair":
      return "text-amber-400";
    default:
      return "text-zinc-400";
  }
}

function getRhythmColor(quality: string) {
  switch (quality) {
    case "excellent":
      return "bg-emerald-400";
    case "good":
      return "bg-blue-400";
    case "moderate":
      return "bg-amber-400";
    default:
      return "bg-red-400";
  }
}

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: videos } = useAllVideos();
  const { data: analysis, isLoading, isError } = useVideoAnalysis(id);
  const isProcessed = analysis?.status === "processed";
  const { status, progress, message, step, isConnected } = useVideoProgress(
    id,
    !isProcessed,
  );

  // The WS only updates local progress state — it doesn't refetch the analysis
  // query. When processing finishes, pull the freshly-saved analysis (and
  // refresh the grid) so the results render without a manual page refresh.
  React.useEffect(() => {
    if (status === "processed") {
      queryClient.invalidateQueries({ queryKey: ["video-analysis", id] });
      queryClient.invalidateQueries({ queryKey: ["all-videos"] });
    }
  }, [status, id, queryClient]);
  const isStillProcessing =
    !isProcessed &&
    (isLoading ||
      isError || // ← treat error as "still processing, not failed yet"
      (analysis && analysis.status !== "processed"));

  const video = videos?.find((v: VideoItem) => v.video_id === id);

  // Go back to wherever the user came from; fall back to the grid when this
  // page was opened directly (no history to pop).
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/videos");
  };

  const [descExpanded, setDescExpanded] = React.useState(false);
  const description = video?.description?.trim();
  const isLongDescription = (description?.length ?? 0) > 180;

  return (
    <div className="min-h-screen p-4 text-white">
      {/* Back button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <IoArrowBack className="text-lg" />
        <span className="text-sm">Back</span>
      </button>

      <div className="w-full space-y-8">
        {/* Video Player — full width, top */}
        <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
          {video?.video_url ? (
            <video
              src={video.video_url}
              className="w-full max-h-[70vh] object-contain bg-black"
              controls
              autoPlay
            />
          ) : (
            <div className="w-full aspect-video max-h-[70vh] bg-black flex items-center justify-center">
              <span className="text-zinc-500">Loading video...</span>
            </div>
          )}
        </div>

        {/* 2 x 2 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Details Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/5 flex flex-col">
            <h1 className="text-lg font-semibold break-words">
              {video?.title ||
                video?.filename ||
                analysis?.original_filename ||
                "Video"}
            </h1>
            {description && (
              <>
                <p
                  className={`text-sm leading-relaxed text-zinc-400 mt-3 whitespace-pre-line break-words ${
                    isLongDescription && !descExpanded ? "line-clamp-4" : ""
                  }`}
                >
                  {description}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => setDescExpanded((v) => !v)}
                    className="mt-2 self-start text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {descExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </>
            )}
            {analysis?.analyzed_at && (
              <p className="text-xs text-zinc-500 mt-auto pt-4">
                Analyzed {new Date(analysis.analyzed_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Processing / error states */}
          {!isProcessed && (isStillProcessing || isConnected) && (
            <ProcessingProgress
              step={step}
              status={status}
              percent={progress}
              message={message}
              isConnected={isConnected}
            />
          )}
          {isError && !isConnected && (
            <div className="rounded-2xl p-8 bg-zinc-900 border border-red-500/20">
              <p className="text-red-400 text-sm">
                Failed to load analysis. The video may still be processing.
              </p>
            </div>
          )}
          {analysis && analysis.status !== "processed" && (
            <div className="rounded-2xl p-8 bg-zinc-900 border border-white/5 flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-zinc-400 text-sm">
                  Video is still being processed...
                </span>
              </div>
            </div>
          )}

          {analysis?.status === "processed" && analysis.analysis && (
            <>
            {/* Performance Score Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <PiRankingDuotone className="text-xl text-emerald-400" />
                <h3 className="text-lg font-semibold">Performance Score</h3>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold">
                  {analysis.analysis.performance_score.score}
                </span>
                <span className="text-zinc-500 text-2xl">/ 100</span>
              </div>

              <span
                className={`text-sm font-medium ${getGradeColor(analysis.analysis.performance_score.grade)}`}
              >
                {analysis.analysis.performance_score.grade}
              </span>

              {/* Score breakdown bars */}
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-300">Chord Confidence</span>
                    <span className="text-zinc-400">
                      {Math.round(
                        analysis.analysis.performance_score.details
                          .chord_confidence * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{
                        width: `${analysis.analysis.performance_score.details.chord_confidence * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-300">Rhythm Score</span>
                    <span className="text-zinc-400">
                      {Math.round(
                        analysis.analysis.performance_score.details
                          .rhythm_score * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-400 transition-all duration-500"
                      style={{
                        width: `${analysis.analysis.performance_score.details.rhythm_score * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/5">
                <p className="text-sm text-zinc-300">
                  {analysis.analysis.performance_score.feedback}
                </p>
              </div>
            </div>

            {/* Rhythm Analysis Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <GoPulse className="text-xl text-emerald-400" />
                <h3 className="text-lg font-semibold">Rhythm & Timing</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-black/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Tempo
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {analysis.analysis.rhythm.tempo_bpm}
                    <span className="text-sm text-zinc-500 ml-1">BPM</span>
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Strums/sec
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {analysis.analysis.rhythm.strums_per_second}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Rhythm Score
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {Math.round(analysis.analysis.rhythm.rhythm_score * 100)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Quality
                  </p>
                  <p className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-black capitalize ${getRhythmColor(analysis.analysis.rhythm.rhythm_quality)}`}
                    >
                      {analysis.analysis.rhythm.rhythm_quality}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Chord Analysis Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <PiGuitar className="text-xl text-emerald-400" />
                <h3 className="text-lg font-semibold">Chord Detection</h3>
              </div>

              <div className="mb-4">
                <p className="text-sm text-zinc-400">Top Detected Chord</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-bold">
                    {analysis.analysis.chords.top_chord.chord}
                  </span>
                  <span className="text-sm text-emerald-400">
                    {Math.round(
                      analysis.analysis.chords.top_chord.confidence * 100,
                    )}
                    % confidence
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-2">Alternatives</p>
                <div className="space-y-2">
                  {analysis.analysis.chords.alternatives
                    .slice(1)
                    .map((alt: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-zinc-300">{alt.chord}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-zinc-500 transition-all duration-500"
                              style={{ width: `${alt.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-zinc-500 w-10 text-right">
                            {Math.round(alt.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
