import React from "react";
import { X } from "lucide-react";
import { PropertyPanel } from "@papercast/react/editor";
import { useMobileBackHandler } from "../../hooks/useMobileBackHandler";

export const MobilePropertiesSheet = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  useMobileBackHandler(isOpen, onClose);

  if (!isOpen) return null;
  return (
    <div className="print:hidden fixed inset-0 z-[100] flex flex-col justify-end bg-background/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full bg-background border-t border-border shadow-2xl rounded-t-3xl flex flex-col h-[85vh] overflow-hidden animate-in slide-in-from-bottom-full duration-300 ease-out">
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-surface/50">
          <h3 className="font-bold text-foreground">Properties</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-surface hover:bg-border text-foreground/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <PropertyPanel />
        </div>
      </div>
    </div>
  );
};
