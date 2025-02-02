import MediaList from "@/components/media-picker";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ComponentPropDto } from "@/services/dto/prop.dto";
import { getMediaFromServer, uploadMediaToServer } from "@/services/media";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

export default function ImagePickerInput({
  propKey,
  value,
  setValue,
}: {
  propKey: string;
  value: any;
  setValue: any;
}) {
  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    "loading" | "success" | "error" | "idle"
  >("idle");
  const { data, isError } = useQuery(["media"], () =>
    getMediaFromServer({
      directory: "images",
    })
  );
  const handleImageSelect = (image: any) => {
    console.log(image);
    setValue(image.path);
    setMediaPickerOpen(false);
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (file: File) =>
      uploadMediaToServer({ file: file, route: "EXAMPLE_SITE/block" }),
    onSuccess: (response) => {
      setStatus("success");
      queryClient.invalidateQueries(["media"]);
      toast.success("Dosya Başarıyla Yüklendi");
    },
    onError: (error) => {
      setStatus("error");
    },
    onMutate: (file) => {
      setStatus("loading");
    },
  });
  if (isError) {
    return (
      <>
        <input
          className="px-2 py-1 border border-gray-200 rounded-md "
          id={propKey}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div>
          Dosya yükleme sistemine ulaşırken bir sorun oluştu. Resimleri link
          olarak ekleyebilirsiniz
        </div>
      </>
    );
  }
  return (
    <>
      {mediaPickerOpen &&
        createPortal(
          <MediaList
            handleImageSelect={handleImageSelect}
            images={data}
            status={status}
            setMediaPickerOpen={setMediaPickerOpen}
            handleUpload={(file: File) => mutation.mutate(file)}
          />,
          document.body
        )}
      <input
        className="px-2 py-1 text-black border border-gray-200 rounded-md "
        id={propKey}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        className="ml-2 w-fit"
        type={"button"}
        onClick={() => setMediaPickerOpen(true)}
        variant={"secondary"}
      >
        Medya Kütüphanesini Aç
      </Button>
    </>
  );
}
