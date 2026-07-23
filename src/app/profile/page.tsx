"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Check, LogOut, Loader2 } from "lucide-react";
import { IoArrowBack } from "react-icons/io5";
import { useMe, useLogout } from "@/api/hooks/useAuth";
import { useAllVideos } from "@/api/hooks/getVideos";
import { useToast } from "@/components/ui/use-toast";
import { VideoItem } from "@/lib/types/video";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function initialsFromEmail(email?: string | null) {
  const local = email?.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  const letters =
    parts.length >= 2 ? parts[0][0] + parts[1][0] : local.slice(0, 2);
  return letters.toUpperCase() || "U";
}

/* ------------------------------------------------------------------ */
/*  Reusable pieces                                                    */
/* ------------------------------------------------------------------ */

function Field({
  label,
  value,
  copyValue,
  mono,
}: {
  label: string;
  value: string;
  copyValue?: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p
          className={cn(
            "mt-1 truncate text-sm text-zinc-100",
            mono && "font-mono text-[13px] text-zinc-300",
          )}
        >
          {value}
        </p>
      </div>
      {copyValue && (
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}

function SectionCard({
  id,
  title,
  description,
  children,
  footer,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40"
    >
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="border-t border-white/10 bg-white/[0.015] px-6 py-3.5">
          {footer}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: me, isLoading } = useMe();
  const { data: videos, isLoading: videosLoading } = useAllVideos();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isLoading && !me?.authenticated) router.replace("/");
  }, [isLoading, me, router]);

  // Go back to wherever the user came from; fall back to the grid when this
  // page was opened directly (no history to pop).
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/videos");
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      queryClient.setQueryData(["me"], { authenticated: false });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (err) {
      console.log(err);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !me?.authenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-zinc-500" />
      </div>
    );
  }

  const displayName = me.email?.split("@")[0] ?? "User";
  const list: VideoItem[] = Array.isArray(videos) ? videos : [];
  const total = list.length;
  const analyzed = list.filter((v) => v.thumbnail_status === "ready").length;
  const inProgress = list.filter(
    (v) => v.thumbnail_status === "processing",
  ).length;

  const stats = [
    { label: "Total uploads", value: total },
    { label: "Analyzed", value: analyzed },
    { label: "In progress", value: inProgress },
  ];

  return (
    <div className="w-full p-4">
      {/* Back button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <IoArrowBack className="text-lg" />
        <span className="text-sm">Back</span>
      </button>

      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your account details and review your activity.
        </p>
      </div>

      <div className="space-y-6">
          {/* Profile */}
          <SectionCard
            id="profile"
            title="Identity"
            description="Your public identity within PickPerfect."
          >
            <div className="flex items-center gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-xl font-semibold text-emerald-300 ring-1 ring-inset ring-white/10">
                {initialsFromEmail(me.email)}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-medium text-white">{displayName}</p>
                <p className="mt-0.5 truncate text-sm text-zinc-500">
                  {me.email}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Usage */}
          <SectionCard
            id="usage"
            title="Usage"
            description="A snapshot of your uploaded performances."
          >
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {stats.map((s, i) => (
                <div key={s.label} className={cn(i === 0 ? "pr-6" : "px-6")}>
                  <p className="text-3xl font-semibold tabular-nums text-white">
                    {videosLoading ? (
                      <span className="inline-block h-8 w-10 animate-pulse rounded bg-white/10 align-middle" />
                    ) : (
                      s.value
                    )}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Account */}
          <SectionCard
            id="account"
            title="Account"
            description="Details tied to your login and identity."
          >
            <Field
              label="Email address"
              value={me.email ?? "—"}
              copyValue={me.email ?? undefined}
            />
          </SectionCard>

          {/* Danger zone */}
          <SectionCard
            id="danger"
            title="Sign out"
            description="End your session on this device. You can sign back in anytime."
            footer={
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-500">
                  Signed in as {me.email}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {logoutMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing out…
                    </>
                  ) : (
                    <>
                      <LogOut className="size-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            }
          >
            <p className="text-sm text-zinc-400">
              Logging out clears your session cookie. Any in-progress uploads
              will continue processing in the background.
            </p>
          </SectionCard>
      </div>
    </div>
  );
}
