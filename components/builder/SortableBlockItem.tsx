"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";

export function SortableBlockItem({
  id,
  children,
}: {
  id: string;
  children: (props: {
    setNodeRef: (el: HTMLElement | null) => void;
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners | undefined;
    style: React.CSSProperties;
    isDragging: boolean;
  }) => React.ReactNode;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return children({
    setNodeRef,
    attributes,
    listeners,
    style,
    isDragging,
  });
}
