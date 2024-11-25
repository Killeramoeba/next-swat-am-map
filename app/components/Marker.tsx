"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

type MarkerProps = {
  id: number;
  x: number;
  y: number;
  backgroundImage: string;
  type: "Crate" | "Item" | "Objective";
  selected?: boolean;
  onClick?: () => void;
};

export default function Marker({
  id,
  x,
  y,
  type,
  selected,
  onClick,
  backgroundImage,
}: MarkerProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-center border-zinc-400 border box-border flex items-center justify-center shadow bg-white absolute cursor-move bg-cover ${
        selected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `2.5%`,
        height: `2.5%`,
        backgroundImage: `url(${backgroundImage})`,
        transform: transform
          ? `translate(-50%, -50%) translate3d(${transform.x}px, ${transform.y}px, 0)`
          : "translate(-50%, -50%)",
      }}
      onClick={onClick}
    />
  );
}
