import React from "react";
import { ImSpinner2 } from "react-icons/im";

function Loading() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <ImSpinner2 className="w-12 h-12 animate-spin" />
    </div>
  );
}

export default Loading;
