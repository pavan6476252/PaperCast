import React from "react";
import { X } from "lucide-react";
import { useMobileBackHandler } from "../../hooks/useMobileBackHandler";

interface MobileSidebarProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  title,
  onClose,
  children,
}) => {
  useMobileBackHandler(true, onClose);

  return (
    <div className="md:hidden flex flex-col z-50 absolute inset-0 shadow-2xl shrink-0 print:hidden w-full bg-background animate-in slide-in-from-bottom-8 fade-in duration-300 ease-out">
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface shrink-0 z-50 relative shadow-sm">
        <h3 className="font-bold text-sm text-foreground tracking-wide">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-background border border-border hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors text-foreground/70"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden relative z-0 bg-background">
        {children}
      </div>
    </div>
  );
};
