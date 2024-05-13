"use client";
import Image from "next/image";
import React, { forwardRef } from "react";
import { cn } from "./utils";
import { motion } from "framer-motion";

interface Props {
  className?: string;
  src: string;
  alt?: string;
  imageClassName?: string;
  local?: boolean;
  [key: string]: any;
}
const ImageWrapper = forwardRef<HTMLDivElement, Props>(
  ({ className, src, alt, local, imageClassName, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)}>
        {src && (
          <Image
            src={
              (!local ? process.env.NEXT_PUBLIC_FILE_URL : "") +
              (src.startsWith("/") ? src : "/" + src)
            }
            alt={alt || src}
            fill
            className={cn("object-fill", imageClassName)}
            {...rest}
          />
        )}
      </div>
    );
  }
);
ImageWrapper.displayName = "ImageWrapper";

export default ImageWrapper;
export const MotionImageWrapper = motion(ImageWrapper);
