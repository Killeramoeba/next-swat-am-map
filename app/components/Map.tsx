"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Marker from "./Marker";
import MarkerMenu from "./MarkerMenu";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { pusherClient } from "../lib/pusher";
import ShareMenu from "./ShareMenu";
import MarkerSelector from "./MarkerSelector";

type MarkerData = {
  id: number;
  x: number;
  y: number;
  type: "Crate" | "Item" | "Objective";
  backgroundImage: string;
  label?: string;
};

export default function Map() {
  const searchParams = useSearchParams();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [currentType, setCurrentType] = useState<MarkerData["type"]>("Crate");
  const [isSharing, setIsSharing] = useState(false);
  const [channel, setChannel] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const subscribeToChannel = useCallback(
    (channelName: string) => {
      const channel = pusherClient.subscribe(channelName);
      setIsSharing(true);

      channel.bind("markers-update", (data: MarkerData[]) => {
        setMarkers(data);
        setIsInitialized(true);
      });

      channel.bind("client-new-member", () => {
        broadcastMarkers(markers, channelName);
      });

      // Notify other clients
      channel.trigger("client-new-member", {});
    },
    [markers]
  );

  useEffect(() => {
    const channelParam = searchParams.get("channel");
    if (channelParam) {
      setChannel(channelParam);
      setIsSharing(true);
      subscribeToChannel(channelParam);

      const url = new URL(window.location.href);
      url.searchParams.set("channel", channelParam);
      setSharedUrl(url.toString());
    } else {
      setIsInitialized(true);
    }
  }, [searchParams, subscribeToChannel]);

  const handleShare = (channelName: string) => {
    setChannel(channelName);
    setIsSharing(true);
    subscribeToChannel(channelName);
    const url = new URL(window.location.href);
    url.searchParams.set("channel", channelName);
    setSharedUrl(url.toString());
  };

  const broadcastMarkers = async (
    updatedMarkers: MarkerData[],
    channelName: string
  ) => {
    try {
      await fetch("/api/markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markers: updatedMarkers,
          channel: channelName,
        }),
      });
    } catch (error) {
      console.error("Error broadcasting markers:", error);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isInitialized || !selectedIcon) return;

    if (e.target !== e.currentTarget) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: MarkerData = {
      id: Date.now(),
      x,
      y,
      type: currentType,
      backgroundImage: selectedIcon,
      label: `${currentType} ${markers.length + 1}`,
    };

    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    if (channel) {
      broadcastMarkers(updatedMarkers, channel);
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

    const updatedMarkers = markers.map((m) =>
      m.id === markerId
        ? { ...m, x: m.x + deltaXPercent, y: m.y + deltaYPercent }
        : m
    );
    setMarkers(updatedMarkers);
    broadcastMarkers(updatedMarkers, channel!);
  };

  const handleMarkerDelete = async (markerId: number) => {
    if (!isInitialized) return;

    const updatedMarkers = markers.filter((m) => m.id !== markerId);

    if (channel) {
      try {
        // First broadcast the update
        await broadcastMarkers(updatedMarkers, channel);
        // Only update local state after successful broadcast
        setMarkers(updatedMarkers);
        setSelectedMarker(null);
      } catch (error) {
        console.error("Error deleting marker:", error);
      }
    } else {
      // If not in sharing mode, just update local state
      setMarkers(updatedMarkers);
      setSelectedMarker(null);
    }
  };

  return (
    <div className="pt-4 pb-4">
      {!isInitialized ? (
        <div className="flex flex-col justify-center items-center h-[600px] gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500"></div>
          {channel && (
            <p className="text-lg text-gray-200">Waiting for channel data...</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <MarkerMenu
              currentType={currentType}
              onTypeChange={setCurrentType}
            />
            <ShareMenu
              onShare={handleShare}
              sharedUrl={sharedUrl}
              isSharing={isSharing}
            />
          </div>
          <MarkerSelector
            currentType={currentType}
            selectedIcon={selectedIcon}
            onIconSelect={setSelectedIcon}
          />
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
                    onDoubleClick={() => handleMarkerDelete(marker.id)}
                  />
                ))}
              </div>
            </div>
          </DndContext>
        </>
      )}
    </div>
  );
}
