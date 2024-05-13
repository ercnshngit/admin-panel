import { useDesigner } from "@/contexts/designer-context";
import React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
  const { block, updateBlockData } = useDesigner();
  // TODO: yukardaki refreshdata
  return <div className="container">{children}</div>;
}
