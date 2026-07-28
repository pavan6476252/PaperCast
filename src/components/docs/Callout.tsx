import React from "react";

interface CalloutProps {
  type?: "info" | "warning" | "success" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-green-50 border-green-200 text-green-900",
    danger: "bg-red-50 border-red-200 text-red-900",
  };

  const iconStyles = {
    info: "text-blue-500",
    warning: "text-amber-500",
    success: "text-green-500",
    danger: "text-red-500",
  };

  const Icon = () => {
    switch (type) {
      case "info":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case "warning":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />;
      case "success":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case "danger":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  return (
    <div className={`my-6 flex rounded-xl border p-4 shadow-sm ${styles[type]}`}>
      <div className={`mr-4 mt-0.5 shrink-0 ${iconStyles[type]}`}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <Icon />
        </svg>
      </div>
      <div className="flex-1">
        {title && <h5 className="mb-1 font-semibold tracking-tight">{title}</h5>}
        <div className="text-sm leading-relaxed opacity-90 prose-p:my-0 prose-p:mb-2 last:prose-p:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
