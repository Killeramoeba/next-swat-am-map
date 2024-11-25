"use client";

import Image from "next/image";
import { useState } from "react";
import Marker from "./Marker";
import MarkerMenu from "./MarkerMenu";
import IconModal from "./IconModal";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

type MarkerData = {
  id: number;
  x: number;
  y: number;
  type: "Crate" | "Item" | "Objective";
  backgroundImage: string;
  label?: string;
};

export default function Map() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [currentType, setCurrentType] = useState<MarkerData["type"]>("Crate");
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [pendingMarker, setPendingMarker] =
    useState<Partial<MarkerData> | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPendingMarker({
      id: Date.now(),
      x,
      y,
      type: currentType,
    });
    setIsIconModalOpen(true);
  };

  const handleIconSelect = (backgroundImage: string) => {
    if (pendingMarker) {
      const newMarker: MarkerData = {
        ...(pendingMarker as MarkerData),
        backgroundImage,
        label: `${currentType} ${markers.length + 1}`,
      };
      setMarkers([...markers, newMarker]);
      setPendingMarker(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) return;

    const markerId = parseInt(active.id.toString());
    const marker = markers.find((m) => m.id === markerId);
    if (!marker) return;

    const rect = document
      .querySelector(".relative.w-full.h-0")
      ?.getBoundingClientRect();
    if (!rect) return;

    const deltaXPercent = (delta.x / rect.width) * 100;
    const deltaYPercent = (delta.y / rect.height) * 100;

    setMarkers(
      markers.map((m) =>
        m.id === markerId
          ? { ...m, x: m.x + deltaXPercent, y: m.y + deltaYPercent }
          : m
      )
    );
  };

  return (
    <div>
      <MarkerMenu currentType={currentType} onTypeChange={setCurrentType} />
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="relative w-full h-0"
          style={{ paddingBottom: "92.375%" }}
        >
          <div className="absolute inset-0" onClick={handleMapClick}>
            <Image
              src="/swatafterterrain.jpg"
              alt="SWAT: Aftermath Terrain"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 800px) 100vw, 800px"
              className="select-none pointer-events-none"
              priority
            />
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                {...marker}
                selected={selectedMarker === marker.id}
                onClick={() => setSelectedMarker(marker.id)}
              />
            ))}
          </div>
        </div>
      </DndContext>
      <IconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        markerType={currentType}
        onSelectIcon={handleIconSelect}
      />
    </div>
  );
}
