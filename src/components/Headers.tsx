"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import {
  usePresignedUrl,
  useUploadVideo,
} from "@/api/hooks/useUpload";
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
import { LoaderOne } from "@/components/ui/loader";

export default function Header() {
  // usestate
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [dialogRect, setDialogRect] = useState<DOMRect | null>(null);
  const [overlaySize, setOverlaySize] = useState<{
    w: number;
    h: number;
  } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: getUrl, isPending } = usePresignedUrl();
  const uploadMutation = useUploadVideo();
  const isUploading = isPending || uploadMutation.isPending;
  const { data, isLoading, isError } = useMe();
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // useeffect
  useEffect(() => {
    if (openUploadDialog) {
      // Wait one frame for dialog to render
      requestAnimationFrame(() => {
        if (dialogContentRef.current) {
          const r = dialogContentRef.current.getBoundingClientRect();
          setOverlaySize({ w: r.width, h: r.height });
        }
      });
    }
  }, [openUploadDialog]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    setOpenUploadDialog(true);
  };

  const handleUploadSubmit = async () => {
    const el = dialogRef.current?.closest(
      '[role="dialog"]',
    ) as HTMLElement | null;
    if (el) setDialogRect(el.getBoundingClientRect());
    if (!selectedFile) {
      toast({
        title: "No video selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const presigned = await getUrl({
        videoName: selectedFile.name,
        thumbnailName: thumbnailFile?.name,
      });

      const uploads = [
        uploadMutation.mutateAsync({
          file: selectedFile,
          url: presigned.video.url,
        }),
      ];

      if (thumbnailFile && presigned.thumbnail) {
        uploads.push(
          uploadMutation.mutateAsync({
            file: thumbnailFile,
            url: presigned.thumbnail.url,
          }),
        );
      }

      await Promise.all(uploads);
      console.log("Cache keys:", queryClient.getQueryCache().getAll().map(q => q.queryKey));
      console.log("[Header] queryClient hash:", queryClient.getMutationCache());
      await queryClient.invalidateQueries({ queryKey: ["all-videos"] });
      setOpenUploadDialog(false);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      router.push("/videos");
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload failed",
        variant: "destructive",
      });
    }
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

            <DialogContent className="bg-white text-black rounded-2xl p-0 overflow-hidden">
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
        <DialogOverlay className="bg-black/50 backdrop-blur-none" />
        <DialogContent
          ref={dialogContentRef}
          className="relative bg-white text-black max-w-5xl w-[95vw] 
  max-h-[90vh] rounded-2xl p-0
  z-[100] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  overflow-hidden"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <LoaderOne />
              <p className="text-sm font-medium text-gray-600">
                Uploading your video…
              </p>
            </div>
          ) : (
            <div
              className="relative w-full h-full max-h-[90vh] overflow-y-auto p-6 sm:p-10
      [&::-webkit-scrollbar]:w-[6px]
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-gray-500
      [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold">Upload Video</h2>
              </div>
              {/* TOP ROW — VIDEO + THUMBNAIL */}
              <div className="grid grid-cols-2 gap-6">
                {/* VIDEO */}
                <div className="rounded-xl border bg-gray-50 p-5">
                  <label className="text-sm font-medium text-gray-700">
                    Video
                  </label>
                  <div className="mt-4 h-56 flex items-center justify-center bg-white rounded-lg border">
                    {!selectedFile ? (
                      <div className="w-full h-full">
                        <FileUpload
                          onChange={(files: File[]) => {
                            if (!files.length) return;
                            const file = files[0];
                            setSelectedFile(file);
                            if (!title)
                              setTitle(file.name.replace(/\.[^/.]+$/, ""));
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <video
                          src={URL.createObjectURL(selectedFile)}
                          controls
                          className="w-full h-full object-contain"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-3 right-3"
                          onClick={() => setSelectedFile(null)}
                        >
                          Change
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* THUMBNAIL */}
                <div className="rounded-xl border bg-gray-50 p-5">
                  <label className="text-sm font-medium text-gray-700">
                    Thumbnail (Optional)
                  </label>
                  <div className="mt-4 h-56 flex items-center justify-center bg-white rounded-lg border">
                    {!thumbnailFile ? (
                      <div className="w-full h-full">
                        <FileUpload
                          accept="image/*"
                          onChange={(files: File[]) => {
                            if (!files.length) return;
                            setThumbnailFile(files[0]);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(thumbnailFile)}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-3 right-3"
                          onClick={() => setThumbnailFile(null)}
                        >
                          Change
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TITLE */}
              <div className="mt-8">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full mt-2 min-h-[120px] rounded-lg border p-3 resize-none focus:outline-none focus:ring-2 focus:ring-black/10"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* BUTTON */}
              <div className="mt-10 flex justify-center">
                <Button
                  onClick={handleUploadSubmit}
                  disabled={!selectedFile || !title.trim()}
                  className="px-10 py-3 rounded-xl border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
                >
                  Upload Video
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
