"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
    router.refresh();
  }, []);

  return <p>404 Not Found</p>;
}
