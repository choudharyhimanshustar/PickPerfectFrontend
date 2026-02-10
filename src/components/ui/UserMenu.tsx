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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  name?: string;
  imageUrl?: string;
  onLogout: () => void;
};

export default function UserMenu({
  name = "Himanshu",
  imageUrl,
  onLogout,
}: Props) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

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
        >
          <FaUserCircle size={24} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
    w-48
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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href="/videos">
          <DropdownMenuItem className="cursor-pointer">Videos</DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            Settings
          </DropdownMenuItem>
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
