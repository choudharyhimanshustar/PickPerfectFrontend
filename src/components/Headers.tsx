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
import { useToast } from "@/components/ui/use-toast";
import UserMenu from "./ui/UserMenu";
import { FileUpload } from "@/components/ui/file-upload";

export default function Header() {
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: getUrl, isPending } = usePresignedUrl();
  const uploadMutation = useUploadVideo();
  const { data, isLoading, isError } = useMe();
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    setOpenUploadDialog(true);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No video selected",
        variant: "destructive",
      });
      return;
    }

    const { url } = await getUrl(selectedFile.name);

    await uploadMutation.mutateAsync({
      file: selectedFile,
      url,
      metadata: {
        title,
        description,
      },
    });

    setOpenUploadDialog(false);
    setSelectedFile(null);
    setTitle("");
    setDescription("");
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
      // router.push("/");
    } catch (err) {
      console.log(err);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
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
        <h1
          className="font-proximaBold text-white text-lg cursor-pointer"
          onClick={(e) => router.push("/")}
        >
          Pick Perfect
        </h1>
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
          <UserMenu name={"User"} imageUrl={""} onLogout={handleLogout} />
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
          onClick={() => setOpenUploadDialog(true)}
        >
          <h6 className="text-gray-500">Add</h6>
          <Button className="text-gray-500">
            <IoIosAdd />
          </Button>
        </div>
      )}
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent className="bg-white text-black max-w-4xl rounded-2xl p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Upload Video</h2>

            <div className="grid grid-cols-2 gap-8 items-stretch">
              {/* LEFT SIDE — METADATA */}
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full h-[14.5rem] rounded-lg border p-3 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={handleUploadSubmit}
                  className="rounded-2xl w-[50%] cursor-pointer"
                >
                  Upload Video
                </Button>
              </div>

              {/* RIGHT SIDE — FILE UPLOAD */}
              <div className="flex flex-col h-full space-y-4">
  <label className="text-sm font-medium">Video</label>

  <div className="flex-1 rounded-xl border border-dashed p-4 bg-gray-50">
    {!selectedFile ? (
      <div className="h-full flex items-center justify-center">
        <FileUpload
          onChange={(files: File[]) => {
            if (!files.length) return;
            const file = files[0];
            setSelectedFile(file);

            if (!title) {
              setTitle(file.name.replace(/\.[^/.]+$/, ""));
            }
          }}
        />
      </div>
    ) : (
      <div className="relative w-full h-full">
        <video
          src={URL.createObjectURL(selectedFile)}
          controls
          className="w-full h-full object-contain rounded-lg"
        />

        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2"
          onClick={() => setSelectedFile(null)}
        >
          Change
        </Button>
      </div>
    )}
  </div>
</div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
