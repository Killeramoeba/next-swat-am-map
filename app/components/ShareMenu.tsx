import { useState } from "react";

type ShareMenuProps = {
  onShare: (channelName: string) => void;
  sharedUrl: string | null;
  isSharing: boolean;
};

export default function ShareMenu({
  onShare,
  sharedUrl,
  isSharing,
}: ShareMenuProps) {
  const [channelName, setChannelName] = useState("");
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const handleShare = () => {
    if (channelName.trim()) {
      onShare(channelName.trim());
      setIsPromptOpen(false);
    }
  };

  return (
    <div className="mb-4 flex items-center gap-4">
      {!isSharing && (
        <button
          onClick={() => setIsPromptOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Share Map
        </button>
      )}

      {isPromptOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-black mb-4">Enter channel name:</h2>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="border p-2 text-black mb-4 w-full"
              placeholder="Channel name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPromptOpen(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {sharedUrl && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={sharedUrl}
            readOnly
            className="border p-2 text-black rounded"
          />
          <button
            onClick={() => navigator.clipboard.writeText(sharedUrl)}
            className="px-4 py-2 bg-gray-200 text-black rounded"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
