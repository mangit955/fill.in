"use client";

import { useRef, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";

type DropOffItem = {
  id: string;
  label: string;
  count: number;
};

type Props = {
  effectiveViews: number;
  submits: number;
  completionRate: number;
  dropOffItems: DropOffItem[];
};

export default function AnalyticsDrawer({
  effectiveViews,
  submits,
  completionRate,
  dropOffItems,
}: Props) {
  const [open, setOpen] = useState(false);
  const [animatedCompletion, setAnimatedCompletion] = useState(0);
  const openAnimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (openAnimTimer.current) {
      clearTimeout(openAnimTimer.current);
      openAnimTimer.current = null;
    }

    if (!nextOpen) {
      setAnimatedCompletion(0);
      return;
    }

    setAnimatedCompletion(0);
    openAnimTimer.current = setTimeout(() => {
      setAnimatedCompletion(completionRate);
    }, 50);
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="text-gray-500 hover:text-gray-700">
          View analytics
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className="max-h-[85vh] overflow-hidden"
        overlayClassName="backdrop-blur"
      >
        <DrawerHeader>
          <DrawerTitle>Form analytics</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 min-h-0 px-6 pb-10 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-lg border-gray-300 shadow-sm p-4">
              <div className="text-sm text-muted-foreground">Views</div>
              <div className="text-2xl font-semibold">
                {effectiveViews ?? 0}
              </div>
            </div>

            <div className="border rounded-lg border-gray-300 shadow-sm p-4">
              <div className="text-sm text-muted-foreground">Submits</div>
              <div className="text-2xl font-semibold">{submits ?? 0}</div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-muted-foreground">Completion</div>
              <div className="text-2xl font-semibold">{completionRate}%</div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 text-center">Completion graph</h3>
            <div className="flex items-center justify-center">
              {open && (
                <AnimatedCircularProgressBar
                  className="size-28 text-lg"
                  value={animatedCompletion}
                  min={0}
                  max={100}
                  gaugePrimaryColor="#16a34a"
                  gaugeSecondaryColor="#e5e7eb"
                />
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {submits} completed out of {effectiveViews} views
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Drop‑off by question</h3>
            <div className="space-y-2">
              {dropOffItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
