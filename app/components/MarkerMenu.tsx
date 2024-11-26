type MarkerMenuProps = {
  currentType: "Crate" | "Item" | "Objective";
  onTypeChange: (type: "Crate" | "Item" | "Objective") => void;
};

export default function MarkerMenu({
  currentType,
  onTypeChange,
}: MarkerMenuProps) {
  const markerTypes = ["Crate", "Item", "Objective"] as const;

  return (
    <div className="mb-4 space-x-2">
      {markerTypes.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`text-xs px-4 py-2 rounded ${
            currentType === type
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
