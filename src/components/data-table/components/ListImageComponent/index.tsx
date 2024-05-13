import ImageWrapper from "@/libs/image-wrapper";
import Image from "next/image";
import React from "react";

export default function ListImageComponent({ value }: { value: any }) {
  if (value && value.startsWith("/")) {
    return (
      <ImageWrapper src={value} alt={value} className="w-8 h-8 rounded-full" />
    );
  } else {
    return <div>Resim Bulunamadı</div>;
  }
}
