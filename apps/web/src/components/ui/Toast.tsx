"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    id: number;
    count: number;
  } | null>(null);

  const showToast = useCallback((message: string) => {
    setToast((current) => {
      const isSame = current && current.message === message;
      const newCount = isSame ? current.count + 1 : 1;
      return { message, id: Date.now(), count: newCount };
    });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
            {toast.message}
            {toast.count > 1 && (
              <span className="bg-background/20 text-xs px-1.5 py-0.5 rounded-full ml-1">
                x{toast.count}
              </span>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
