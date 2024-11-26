"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function InstructionsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenInstructions = Cookies.get("hasSeenInstructions");
    setIsOpen(!hasSeenInstructions);
    setIsLoaded(true);
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      Cookies.set("hasSeenInstructions", "true", { expires: 365 });
    }
    setIsOpen(false);
  };

  if (!isLoaded || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold text-black mb-4">
          How to Use This Map
        </h2>

        <div className="text-black mb-6">
          <p className="mb-2">
            1. Select a market type (crate, item, or objective).
          </p>
          <p className="mb-2">2. Click on the map to add markers.</p>
          <p className="mb-2">3. Double click a marker to remove it.</p>
          <p className="mb-2">4. Drag a marker to move it.</p>
          <p className="mb-2">
            5. Share your map with others using the Share button.
          </p>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="dontShowAgain" className="text-black text-sm">
            Don&apos;t show this again
          </label>
        </div>

        <button
          onClick={handleClose}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
