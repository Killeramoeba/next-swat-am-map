type IconModalProps = {
  isOpen: boolean;
  onClose: () => void;
  markerType: "Crate" | "Item" | "Objective";
  onSelectIcon: (icon: string) => void;
};

const iconsByType = {
  Crate: [
    { path: "/icons/crate/swat-metalcrate.jpg", title: "Metal Crate" },
    { path: "/icons/crate/swat-browncrate.jpg", title: "Brown Crate" },
    { path: "/icons/crate/swat-consumable.png", title: "Consumable Crate" },
    { path: "/icons/crate/swat-implant.png", title: "Implant Crate" },
    { path: "/icons/crate/swat-atme.png", title: "ATME Crate" },
    { path: "/icons/crate/swat-chrono.png", title: "Chrono Crate" },
  ],
  Item: [
    { path: "/icons/item/ability-lad.gif", title: "LAD" },
    { path: "/icons/item/item-clothing.jpg", title: "Clothing" },
    { path: "/icons/item/item-exosuit.gif", title: "Exosuit" },
    { path: "/icons/item/item-plans.gif", title: "Plans" },
  ],
  Objective: [
    { path: "/icons/item/item-hazmat.gif", title: "Hazmat" },
    { path: "/icons/objective/ability-frag.gif", title: "Green Rad" },
    { path: "/icons/objective/ability-fragb.jpg", title: "Blue Rad" },
    { path: "/icons/objective/ability-fragr.png", title: "Red Rad" },
    { path: "/icons/objective/abm.png", title: "ABM" },
    { path: "/icons/objective/obj-reactor.gif", title: "Reactor" },
    { path: "/icons/objective/obj-shroom.gif", title: "Shroom" },
  ],
};

export default function IconModal({
  isOpen,
  onClose,
  markerType,
  onSelectIcon,
}: IconModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-m font-bold">Select {markerType} Icon</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {iconsByType[markerType].map((icon) => (
            <button
              key={icon.path}
              onClick={() => {
                onSelectIcon(icon.path);
                onClose();
              }}
              className="w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
              title={icon.title}
            >
              <div
                className="w-12 h-12 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${icon.path})` }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
