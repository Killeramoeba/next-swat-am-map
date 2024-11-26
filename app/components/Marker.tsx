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
  onDoubleClick?: () => void;
};

export default function Marker({
  id,
  x,
  y,
  selected,
  onClick,
  backgroundImage,
  onDoubleClick,
}: MarkerProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id.toString(),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => {
      onDoubleClick?.();
    }, 0);
  };

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
        width: `3%`,
        height: `3%`,
        backgroundImage: `url(${backgroundImage})`,
        transform: transform
          ? `translate(-50%, -50%) translate3d(${transform.x}px, ${transform.y}px, 0)`
          : "translate(-50%, -50%)",
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  );
}
