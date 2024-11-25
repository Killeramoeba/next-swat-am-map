"use client";

import React from "react";

type MarkerProps = {
  x: number;
  y: number;
  backgroundImage: string;
  type: "Crate" | "Item" | "Objective";
  selected?: boolean;
  onClick?: () => void;
};

export default function Marker({
  x,
  y,
  type,
  selected,
  onClick,
  backgroundImage,
}: MarkerProps) {
  return (
    <div
      className={`bg-center border-zinc-400 border box-border flex items-center justify-center shadow bg-white absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 bg-cover ${
        selected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `2.5%`,
        height: `2.5%`,
        backgroundImage: `url(${backgroundImage})`,
      }}
      onClick={onClick}
    ></div>
  );
}
