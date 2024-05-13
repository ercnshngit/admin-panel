import React from "react";

export default function Centerer({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center items-center">{children}</div>;
}
