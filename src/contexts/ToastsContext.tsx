import { createContext, useContext, useMemo, useState } from "react";

import { ToastProps } from "@/components/Toast";
import { ToastList } from "@/components/ToastList";

type ToastsContextType = (toast: ToastProps) => void;

function noop() {
  return;
}

const ToastsContext = createContext<ToastsContextType>(noop);

function ToastsContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const handleAddToast = (toast: ToastProps) => {
    setToasts(t => [...t, toast]);
  };

  const handleShiftToast = () => {
    setToasts(t => t.filter((_, index) => index !== 0));
  };

  return (
    <ToastsContext.Provider value={useMemo(() => handleAddToast, [])}>
      {children}
      <ToastList toasts={toasts} onShiftToast={handleShiftToast} />
    </ToastsContext.Provider>
  );
}

function useToasts() {
  return useContext(ToastsContext);
}

export { ToastsContextProvider, useToasts };
