"use client";
import { ReactQuillWrapper } from "@/libs/react-quill";
import { useState } from "react";

export default function RichTextEditor({
  propKey,
  value,
  setValue,
}: {
  propKey: string;
  value: any;
  setValue: any;
}) {
  const [text, setText] = useState(value || "");
  const handleSetValue = (value: string) => {
    setText(value);
    setValue(value);
  };
  return (
    <div className="border min-h-[100px] border-gray-200 rounded-md">
      <ReactQuillWrapper value={text} setValue={handleSetValue} />
    </div>
  );
}
