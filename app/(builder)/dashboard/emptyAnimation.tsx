"use client";

import Lottie from "lottie-react";
import emptyAnimation from "@/public/lottie/spaceboy.json";

export default function EmptyFormsAnimation() {
  return (
    <div className="w-72 h-72 mb-4">
      <Lottie animationData={emptyAnimation} loop autoplay />
    </div>
  );
}
