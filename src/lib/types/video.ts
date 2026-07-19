// Canonical processing statuses — must match the backend VideoStatus enum.
export type VideoStatus =
  | "pending_upload"
  | "processing"
  | "processed"
  | "failed";

export type ProgressMessage = {
  status: VideoStatus;
  progress: number;
  message?: string;
  step?: string;
  percent: number;
};

export type UseVideoProgressReturn = {
  status: VideoStatus | null;
  progress: number;
  message: string | null;
  step?: string | null;
  isConnected: boolean;
};

export interface VideoItem {
  video_id: string;
  filename: string;
  video_url: string | null;
  thumbnail_url: string | null;
  thumbnail_status: "ready" | "failed" | "processing";
}

export type PatchFn = (
  videoId: string,
  thumbnailUrl: string | null,
  status?: "ready" | "failed",
) => void;

type Step = {
  key: string;
  label: string;
  sub: string;
};

export const STEPS: Step[] = [
  { key: "queued", label: "Queued", sub: "Waiting for a worker" },
  {
    key: "video_received",
    label: "Video Received",
    sub: "Video received, starting pipeline...",
  },
  {
    key: "downloading",
    label: "Downloading",
    sub: "Fetching video from source",
  },
  {
    key: "extracting_audio",
    label: "Extracting audio",
    sub: "Isolating audio track for analysis",
  },
  {
    key: "analyzing_features",
    label: "Analyzing features",
    sub: "Extracting tempo, beats & onsets",
  },
  {
    key: "detecting_chords",
    label: "Detecting chords",
    sub: "Analysing audio frequencies to detect chords",
  },
  {
    key: "detecting_rhythm",
    label: "Detecting rhythm",
    sub: "Analyzing temporal patterns in the audio",
  },
  {
    key: "evaluating",
    label: "Evaluating",
    sub: "Scoring rhythm & timing",
  },
  {
    key: "saving_results",
    label: "Saving results",
    sub: "Saving results and generating thumbnail",
  },
  {
    key:"processed",
    label:"Completed",
    sub:"Processing complete!"
  }
];

export type StepState = "done" | "active" | "failed" | "pending";

export type Props = {
  step?: string | null;
  status: VideoStatus | null;
  percent: number;
  message: string | null;
  isConnected: boolean;
};
