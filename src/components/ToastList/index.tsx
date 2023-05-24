import { useEffect, useState } from "react";

import Toast, { ToastProps } from "../Toast";

interface ToastListProps {
  toasts: ToastProps[];
  onShiftToast: () => void;
}

export function ToastList({ toasts, onShiftToast }: ToastListProps) {
  const [activeToast, setActiveToast] = useState<ToastProps | undefined>(undefined);

  useEffect(() => {
    setActiveToast(toasts.length > 0 ? toasts[0] : undefined);
    const intervalId = setInterval(() => {
      setActiveToast(undefined);
      onShiftToast();
      setActiveToast(toasts[0]);
    }, 4000);
    return () => {
      if (toasts.length > 0) {
        clearInterval(intervalId);
      }
    };
  }, [onShiftToast, toasts]);

  return activeToast !== undefined ? (
    <Toast icon={activeToast.icon} variant={activeToast.variant} message={activeToast.message} />
  ) : null;
}
