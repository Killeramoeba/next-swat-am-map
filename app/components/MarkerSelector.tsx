import { iconsByType } from "../lib/icons";

type MarkerSelectorProps = {
  currentType: "Crate" | "Item" | "Objective";
  selectedIcon: string | null;
  onIconSelect: (icon: string) => void;
};

export default function MarkerSelector({
  currentType,
  selectedIcon,
  onIconSelect,
}: MarkerSelectorProps) {
  return (
    <div className="mb-4">
      <div className="flex gap-2">
        {iconsByType[currentType].map(
          (icon: { path: string; title: string }) => (
            <button
              key={icon.path}
              onClick={() => onIconSelect(icon.path)}
              className={`w-8 h-8 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center ${
                selectedIcon === icon.path
                  ? "bg-gray-700 ring-2 ring-blue-500"
                  : "bg-gray-800"
              }`}
              title={icon.title}
            >
              <div
                className="w-10 h-10 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${icon.path})` }}
              />
            </button>
          )
        )}
      </div>
    </div>
  );
}
