import { useQuery, useMutation } from "@tanstack/react-query";
import { VideoService } from "../endpoints/videos";
import { useEffect, useRef, useState } from "react";
import { ProgressMessage, VideoStatus } from "../../lib/types/video";
import { UseVideoProgressReturn } from "../../lib/types/video";
import { VideoItem, PatchFn } from "../../lib/types/video";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";

// --- Exponential backoff config ---
const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;
const BACKOFF_MULTIPLIER = 2;

// --- Heartbeat config ---
const PING_INTERVAL_MS = 30000; // send ping every 30s
const PONG_TIMEOUT_MS = 10000; // expect pong within 10s

const TERMINAL_CLOSE_CODES = [
  1002, // Protocol error
  1003, // Unsupported data
  1008, // Policy violation (e.g. auth failure)
  1011, // Server encountered an error (unrecoverable)
];

const TERMINAL_STATUSES: VideoStatus[] = ["completed", "failed"];

function getBackoffDelay(attempt: number): number {
  const delay =
    INITIAL_RECONNECT_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, attempt);
  return Math.min(delay, MAX_RECONNECT_DELAY_MS);
}

export const useAllVideos = () => {
  return useQuery({
    queryKey: ["all-videos"],
    queryFn: () => {
      console.log("[useAllVideos] queryFn fired");
      return VideoService.getAllVideos();
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useVideoAnalysis = (videoId: string) => {
  return useQuery({
    queryKey: ["video-analysis", videoId],
    queryFn: () => VideoService.getVideoAnalysis(videoId),
    enabled: !!videoId,
  });
};

export function useThumbnailSSE(videos: VideoItem[], onPatch: PatchFn) {
  const esRef = useRef<EventSource | null>(null);
  const onPatchRef = useRef(onPatch);
  useEffect(() => {
    onPatchRef.current = onPatch;
  }, [onPatch]);

  useEffect(() => {
    if (!videos?.length) return;

    const pendingIds = videos
      .filter((v) => !v.thumbnail_url && v.thumbnail_status !== "failed") // ← skip already-failed
      .map((v) => v.video_id);

    if (!pendingIds.length) return;

    const params = new URLSearchParams();
    pendingIds.forEach((id) => params.append("video_ids", id));

    const url = `/videos/thumbnails/progress?${params.toString()}`;
    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.onopen = () => console.log("ES opened, readyState:", es.readyState);
    es.onerror = (e) => console.log("ES error, readyState:", es.readyState, e);

    es.addEventListener("ping", () => {
      console.log("SSE connected");
    });

    es.addEventListener("thumbnail_ready", (e: MessageEvent) => {
      const { video_id, thumbnail_url } = JSON.parse(e.data);
      onPatchRef.current(video_id, thumbnail_url, "ready");
    });

    // ← NEW
    es.addEventListener("thumbnail_failed", (e: MessageEvent) => {
      const { video_id } = JSON.parse(e.data);
      onPatchRef.current(video_id, null, "failed"); // null url, failed status
    });

    es.addEventListener("done", () => es.close());

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) es.close();
    };

    return () => es.close();
  }, [
    videos
      ?.filter((v) => !v.thumbnail_url && v.thumbnail_status !== "failed") // ← skip failed
      .map((v) => v.video_id)
      .join(","),
  ]);
}

export function useRetryThumbnail(
  onOptimisticUpdate: (videoId: string) => void,
  onError: (videoId: string) => void,
) {
  return useMutation({
    mutationFn: (videoId: string) => VideoService.retryThumbnail(videoId),

    onMutate: (videoId) => {
      // optimistically flip to processing before request fires
      onOptimisticUpdate(videoId);
    },

    onError: (_err, videoId) => {
      // revert back to failed if request fails
      onError(videoId);
    },
  });
}

export function useVideoProgress(
  videoId: string,
  enabled: boolean = true,
): UseVideoProgressReturn {
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [step, setStep] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTerminal = useRef<boolean>(false);
  const attemptCount = useRef<number>(0);

  useEffect(() => {
    if (!videoId || !enabled) return;

    isTerminal.current = false; // ← reset so Strict Mode remount can connect
    attemptCount.current = 0; // ← reset backoff too

    function clearHeartbeat() {
      if (pingTimer.current) clearInterval(pingTimer.current);
      if (pongTimer.current) clearTimeout(pongTimer.current);
      pingTimer.current = null;
      pongTimer.current = null;
    }

    function startHeartbeat(ws: WebSocket) {
      pingTimer.current = setInterval(() => {
        if (ws.readyState !== WebSocket.OPEN) return;

        // Send ping
        ws.send(JSON.stringify({ type: "__ping__" }));

        // Expect pong back within PONG_TIMEOUT_MS
        pongTimer.current = setTimeout(() => {
          console.warn("[WS] Pong timeout — connection is stale, reconnecting");
          ws.close();
        }, PONG_TIMEOUT_MS);
      }, PING_INTERVAL_MS);
    }

    async function connectWithToken() {
      try {
        const res = await fetch("/api/auth/ws-token", {
          credentials: "include",
        });
        const { token } = await res.json();
        connect(token);
      } catch (e) {
        console.error("[WS] Failed to fetch ws-token:", e);
        // retry after backoff
        const delay = getBackoffDelay(attemptCount.current);
        attemptCount.current += 1;
        reconnectTimer.current = setTimeout(connectWithToken, delay);
      }
    }

    function connect(token: string) {
      if (isTerminal.current) return;
      const ws = new WebSocket(
        `${WS_BASE_URL}/videos/ws/progress/${videoId}?token=${token}`,
      );
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        attemptCount.current = 0; // reset backoff on successful connect
        startHeartbeat(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data: ProgressMessage & { type?: string } = JSON.parse(
            event.data,
          );
          console.log("📨 Message:", data.type, data.step, data.percent);

          // Handle pong — clear the pong timeout
          if (data.type === "__pong__") {
            if (pongTimer.current) {
              clearTimeout(pongTimer.current);
              pongTimer.current = null;
            }
            return;
          }

          setStep(data.step ?? null);
          setStatus(data.type as VideoStatus);
          setProgress(data.percent ?? 0);
          setMessage(data.message ?? null);

          if (data.type && TERMINAL_STATUSES.includes(data.type as VideoStatus)) {
            isTerminal.current = true;
            ws.close(1000, "Job complete");
          }
        } catch (e) {
          console.warn("[WS] Failed to parse message:", e);
        }
      };

      ws.onclose = (event) => {
        console.log(
          "WS closed — code:",
          event.code,
          "reason:",
          event.reason,
          "wasClean:",
          event.wasClean,
        );
        setIsConnected(false);
        clearHeartbeat();

        // Don't reconnect if job is done or close code is unrecoverable
        if (isTerminal.current) return;

        if (TERMINAL_CLOSE_CODES.includes(event.code)) {
          console.error(
            `[WS] Terminal close code ${event.code} — not reconnecting`,
          );
          isTerminal.current = true;
          return;
        }

        // Exponential backoff reconnect
        const delay = getBackoffDelay(attemptCount.current);
        console.log(
          `[WS] Reconnecting in ${delay}ms (attempt ${attemptCount.current + 1})`,
        );
        attemptCount.current += 1;
        reconnectTimer.current = setTimeout(connectWithToken, delay);
      };

      ws.onerror = (event) => {
        console.log("WS error:", event);
        // onerror always fires onclose right after — reconnect logic lives there
        ws.close();
      };
    }

    connectWithToken();

    return () => {
      isTerminal.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (pingTimer.current) clearInterval(pingTimer.current);
      if (pongTimer.current) clearTimeout(pongTimer.current);
      wsRef.current?.close();
      setIsConnected(false);
    };
  }, [videoId, enabled]);

  return { status, progress, message, step, isConnected };
}
