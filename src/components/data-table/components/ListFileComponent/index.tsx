import ImageWrapper from "@/libs/image-wrapper";
import { ExternalLink, FileDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ListFileComponent({ value }: { value: any }) {
  if (value && value.startsWith("/")) {
    return (
      <Link
        href={process.env.NEXT_PUBLIC_FILE_URL + value}
        target="_blank"
        className="flex items-center"
      >
        <ExternalLink className="w-4 h-4 mr-1" />
        <span className="text-sm font-semibold">Aç</span>
      </Link>
    );
  } else {
    return <div>Link Bulunamadı</div>;
  }
}
