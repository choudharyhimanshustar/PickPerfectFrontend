"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import { usePresignedUrl, useUploadVideo } from "@/api/hooks/useUpload";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaUser } from "react-icons/fa";
import AuthCard from "@/components/ui/AuthCard";
import { useMe, useLogout } from "../api/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: getUrl, isPending } = usePresignedUrl();
  const uploadMutation = useUploadVideo();
  const { data, isLoading, isError } = useMe();
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("type of file.name:", typeof file.name);
    const { url } = await getUrl(file.name);
    console.log("Presigned URL:", url);
    await uploadMutation.mutateAsync({ file, url });
    // ✅ Proper JSX return
  };
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      // clear cached auth state
      queryClient.removeQueries({ queryKey: ["auth"] });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex w-full flex flex-row justify-between items-center  p-4">
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        onChange={handleFile} // ✅ file handler on input
      />
      <div className="flex flex-row items-center justify-center gap-8">
        <h1 className="font-proximaBold text-white text-lg">Pick Perfect</h1>
        {pathname !== "/" && (
          <div className="bg-white rounded-lg flex flex-row items-center justify-center">
            <Input
              type="text"
              placeholder="Search"
              className="border text-gray-500 border-white bg-white "
            />
            <Button
              type="submit"
              variant="outline"
              className="border border-white bg-white text-gray-500  cursor-pointer"
            >
              <IoIosSearch />
            </Button>
          </div>
        )}
      </div>
      {pathname === "/" ? (
        isLoading ? null : data?.authenticated ? (
          /* ---------- LOGOUT ---------- */
          <Button
            variant="outline"
            className="flex gap-2 text-white cursor-pointer"
            onClick={handleLogout}
          >
            <FaUser className="h-4 w-4" />
            Logout
          </Button>
        ) : (
          /* ---------- SIGN IN ---------- */
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 text-white cursor-pointer"
              >
                <FaUser className="h-4 w-4" />
                Sign In
              </Button>
            </DialogTrigger>

            <DialogContent
              className="
          bg-transparent 
          border-none 
          shadow-none 
          p-0 
          flex 
          items-center 
          justify-center
        "
            >
              <AuthCard />
            </DialogContent>
          </Dialog>
        )
      ) : (
        /* ---------- ADD BUTTON ---------- */
        <div
          className="bg-white border rounded-lg cursor-pointer flex flex-row items-center justify-center pl-2"
          onClick={() => fileRef.current?.click()}
        >
          <h6 className="text-gray-500">Add</h6>
          <Button type="submit" className="text-gray-500 cursor-pointer">
            <IoIosAdd />
          </Button>
        </div>
      )}
    </div>
  );
}
