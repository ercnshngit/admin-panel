"use client";
import MediaList from "@/components/media-picker";
import { getMediaFromServer, uploadMediaToServer } from "@/services/media";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function QuillImagePicker({
  handleImageSelect,
  setOpen,
}: {
  handleImageSelect: (image: any) => void;
  setOpen: any;
}) {
  const [status, setStatus] = React.useState<
    "loading" | "success" | "error" | "idle"
  >("idle");
  const { data, isError } = useQuery(["media"], () =>
    getMediaFromServer({
      directory: "images",
    })
  );

  const uploadMedia = async (file: File) => {
    setStatus("loading");
    const res = await uploadMediaToServer({
      file: file,
      route: "EXAMPLE_SITE/editor",
    });
    if (res.status === 200) {
      setStatus("success");
      handleImageSelect(res.data);
    } else {
      setStatus("error");
    }
  };
  return (
    <MediaList
      images={data}
      handleImageSelect={handleImageSelect}
      handleUpload={uploadMedia}
      setMediaPickerOpen={setOpen}
      status={status}
    />
  );
}
