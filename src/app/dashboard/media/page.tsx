"use client";
import FileUpload from "@/components/FileUpload";
import { getMediaFromServer, uploadMediaToServer } from "@/services/media";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { deleteMediaFromServer } from "@/services/media";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/delete-dialog-base";

export default function MediaPage() {
  const { data: images } = useQuery(["media"], () =>
    getMediaFromServer({ directory: "images" })
  );

  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    "loading" | "success" | "error" | "idle"
  >("idle");
  const { data, isError } = useQuery(["media"], () =>
    getMediaFromServer({
      directory: "images",
    })
  );

  const mutation = useMutation({
    mutationFn: (file: File) =>
      uploadMediaToServer({ file, route: "EXAMPLE_SITE/uncategorized" }),
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

  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const openDeleteDialog = (id: number) => {
    setOpen(true);
    setId(id);
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteMediaFromServer({
        id: Number(id),
      }),
    onSuccess: (response) => {
      toast.success("Silme işlemi başarılı");
      queryClient.invalidateQueries(["media"]);
    },
    onError: (error) => {
      toast.error("Silme işlemi başarısız");
    },
  });

  const imagesGroupedByPath = images?.reduce((acc: any, image: any) => {
    console.log(image.path);
    if (!acc[image.path.split("/")[2]]) {
      acc[image.path.split("/")[2]] = [];
    }
    acc[image.path.split("/")[2]].push(image);
    console.log(acc);
    return acc;
  }, {} as any);

  return (
    <>
      <div>
        {
          <FileUpload
            status={status}
            uploadFile={(file: File) => mutation.mutate(file)}
          />
        }
      </div>
      <div className="">
        <Accordion type="single" collapsible className="w-full">
          {(Object.entries(imagesGroupedByPath) as [string, any][]).map(
            ([group, images]) => (
              <AccordionItem key={group} value={group}>
                <AccordionTrigger>{group}</AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-8 md:grid-cols-3 xl:grid-cols-4">
                  {Array.isArray(images) &&
                    images?.map((image: any, index: number) => (
                      <div
                        key={image.id}
                        className="relative flex items-center justify-center overflow-hidden bg-gray-200 rounded-lg w-60 h-60"
                      >
                        <div className="absolute flex gap-2 cursor-pointer top-2 right-2 left-2">
                          <Button
                            size={"sm"}
                            variant={"destructive"}
                            className=""
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(image.id);
                            }}
                          >
                            <Trash2Icon size={18} className="text-white" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 w-full px-2 py-2 text-xs font-semibold text-white break-words bg-black/60 text-wrap">
                          {image?.originalname}
                        </div>
                        {image?.type_id === 6 ? (
                          <p className="w-full px-2 text-xl font-semibold text-center">
                            PDF
                          </p>
                        ) : (
                          <img
                            className="object-contain"
                            src={process.env.NEXT_PUBLIC_FILE_URL + image.path}
                            alt=""
                          />
                        )}
                      </div>
                    ))}
                </AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>
      </div>

      <DeleteDialog
        open={open}
        setOpen={setOpen}
        handleDelete={deleteMutation.mutate}
      />
    </>
  );
}
