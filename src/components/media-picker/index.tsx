import { deleteMediaFromServer } from "@/services/media";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import FileUpload from "../FileUpload";
import DeleteDialog from "../delete-dialog-base";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function MediaList({
  justPDF,
  images,
  handleImageSelect,
  setMediaPickerOpen,
  handleUpload,
  status,
}: {
  justPDF?: boolean;
  images: any[];
  handleImageSelect: (image: any) => void;
  setMediaPickerOpen: any;
  handleUpload: any;
  status: string;
}) {
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

  const imagesGroupedByPath = images
    ?.filter((image) => {
      if (justPDF) {
        return image.type_id === 6;
      }
      return true;
    })
    ?.reduce((acc, image) => {
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        onClick={() => setMediaPickerOpen(false)}
      >
        <div
          className="absolute flex flex-col gap-4 p-8 bg-white rounded-lg shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Medya Kütüphanesi</h1>
            <button type={"button"} onClick={() => setMediaPickerOpen(false)}>
              Kapat
            </button>
          </div>
          <div className=" overflow-y-auto max-h-[50vh] w-[784px] max-w-[80vw]">
            <Accordion type="single" collapsible className="w-full">
              {(Object.entries(imagesGroupedByPath) as [string, any][]).map(
                ([group, images]) => (
                  <AccordionItem key={group} value={group}>
                    <AccordionTrigger>{group}</AccordionTrigger>
                    <AccordionContent className="grid grid-cols-3 gap-8">
                      {Array.isArray(images) &&
                        images?.map((image: any, index: number) => (
                          <div
                            key={image.id}
                            onClick={() => handleImageSelect(image)}
                            className="relative flex items-center justify-center overflow-hidden bg-gray-200 rounded-lg w-60 h-60"
                          >
                            <div className="absolute flex gap-2 cursor-pointer top-2 right-2 left-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageSelect(image);
                                }}
                                type="button"
                                size={"sm"}
                              >
                                <CheckIcon size={18} className="text-white" />
                              </Button>
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
                                src={
                                  process.env.NEXT_PUBLIC_FILE_URL + image.path
                                }
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
          <div>{<FileUpload status={status} uploadFile={handleUpload} />}</div>
        </div>
      </div>
      <DeleteDialog
        open={open}
        setOpen={setOpen}
        handleDelete={deleteMutation.mutate}
      />
    </>
  );
}
