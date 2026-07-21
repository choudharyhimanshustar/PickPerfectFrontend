"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMe, useLogout } from "@/api/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { FaUserCircle } from "react-icons/fa";

function initialsFromEmail(email?: string | null) {
  const local = email?.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase() || "U";
}

function formatMemberSince(createdAt?: string | null) {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: me, isLoading } = useMe();
  const logoutMutation = useLogout();

  // Not authenticated → send back home, where the sign-in modal lives.
  useEffect(() => {
    if (!isLoading && !me?.authenticated) router.replace("/");
  }, [isLoading, me, router]);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
      </div>
    );
  }

  const memberSince = formatMemberSince(me.created_at);

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-semibold text-white">Profile</h1>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
            {me.email ? (
              <span className="text-xl font-semibold">
                {initialsFromEmail(me.email)}
              </span>
            ) : (
              <FaUserCircle size={40} />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-medium text-white">
              {me.email ?? "Unknown"}
            </p>
            {memberSince && (
              <p className="text-sm text-zinc-400">Member since {memberSince}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Email
            </p>
            <p className="mt-1 text-sm text-zinc-200">{me.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Member since
            </p>
            <p className="mt-1 text-sm text-zinc-200">{memberSince ?? "—"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            {logoutMutation.isPending ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
