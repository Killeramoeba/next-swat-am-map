"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import Marker from "./Marker";
import MarkerMenu from "./MarkerMenu";
import IconModal from "./IconModal";

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
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
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

  return (
    <div>
      <MarkerMenu currentType={currentType} onTypeChange={setCurrentType} />

      <div className="relative w-full h-0" style={{ paddingBottom: "92.375%" }}>
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

      <IconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        markerType={currentType}
        onSelectIcon={handleIconSelect}
      />
    </div>
  );
}
