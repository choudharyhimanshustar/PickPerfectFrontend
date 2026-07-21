"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  email?: string | null;
  createdAt?: string | null;
  onLogout: () => void;
};

// Two-letter initials from the email's local part, e.g. "hello@x.ai" -> "HE".
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
  });
}

export default function UserMenu({ email, createdAt, onLogout }: Props) {
  const initials = initialsFromEmail(email);
  const memberSince = formatMemberSince(createdAt);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
      flex items-center justify-center
      h-9 w-9
      rounded-full
      bg-white/10
      hover:bg-white/20
      text-white
      transition
      cursor-pointer
    "
          aria-label="Open profile menu"
        >
          {email ? (
            <span className="text-sm font-semibold">{initials}</span>
          ) : (
            <FaUserCircle size={24} />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
    w-56
    bg-white
    text-black
    border
    shadow-xl
    rounded-xl
    p-1

    data-[state=open]:animate-in
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    data-[state=open]:fade-in-0
    data-[state=closed]:zoom-out-95
    data-[state=open]:zoom-in-95
    data-[side=bottom]:slide-in-from-top-2
  "
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-xs font-normal text-gray-500">
            Signed in as
          </span>
          <span className="truncate text-sm font-medium">
            {email ?? "Unknown"}
          </span>
          {memberSince && (
            <span className="text-xs font-normal text-gray-400">
              Member since {memberSince}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
        </Link>

        <Link href="/videos">
          <DropdownMenuItem className="cursor-pointer">Videos</DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-red-500"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
