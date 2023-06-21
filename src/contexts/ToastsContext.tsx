import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import Toast, { ToastProps } from "@/components/Toast";

function noop() {
  return;
}

interface ToastParams extends Omit<ToastProps, "onClose"> {
  closable?: boolean;
}

type ToastsContextType = (toast: ToastParams) => void;
const ToastsContext = createContext<ToastsContextType>(noop);

function ToastsContextProvider({ children }: { children: React.ReactNode }) {
  const toasts = useRef<ToastParams[]>([]); // in ref to avoid stale closure issue
  const drainQueueId = useRef<NodeJS.Timer>();
  const [tickCount, forceUpdate] = useState(0); // serves to kick-off the dequeueing
  const activeToast = toasts.current[0] as ToastParams | undefined;

  useEffect(() => {
    if (toasts.current.length < 1 || drainQueueId.current !== undefined) {
      return;
    }

    const drainQueue = () => {
      if (toasts.current.length > 0) {
        toasts.current = toasts.current.slice(1);
        forceUpdate(c => c + 1);
      } else {
        clearInterval(drainQueueId.current);
        drainQueueId.current = undefined;
      }
    };

    drainQueueId.current = setInterval(drainQueue, 4000);

    return () => {
      if (drainQueueId.current !== undefined) {
        clearInterval(drainQueueId.current);
        drainQueueId.current = undefined;
      }
    };
  }, [tickCount]);

  const handleOnCreateToast = (toast: ToastProps) => {
    toasts.current = [...toasts.current, toast];
    forceUpdate(c => c + 1);
  };

  // This is the handler that will be passed to Toast component when press on close icon from Toast
  const handleOnCloseToast = () => {
    toasts.current = toasts.current.slice(0, -1);
    forceUpdate(c => c + 1);
  };

  return (
    <ToastsContext.Provider value={useMemo(() => handleOnCreateToast, [])}>
      {children}
      {activeToast !== undefined ? (
        <Toast
          {...activeToast}
          key={activeToast.message}
          onClose={activeToast.closable ? handleOnCloseToast : undefined}
        />
      ) : null}
    </ToastsContext.Provider>
  );
}

function useToasts() {
  return useContext(ToastsContext);
}

export { ToastsContextProvider, useToasts };
