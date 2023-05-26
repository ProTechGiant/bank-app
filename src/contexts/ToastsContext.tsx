import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import Toast, { ToastProps } from "@/components/Toast";

function noop() {
  return;
}

type ToastsContextType = (toast: ToastProps) => void;
const ToastsContext = createContext<ToastsContextType>(noop);

function ToastsContextProvider({ children }: { children: React.ReactNode }) {
  const toasts = useRef<ToastProps[]>([]); // in ref to avoid stale closure issue
  const drainQueueId = useRef<NodeJS.Timer>();
  const [tickCount, forceUpdate] = useState(0); // serves to kick-off the dequeueing
  const activeToast = toasts.current[0] as ToastProps | undefined;

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

  return (
    <ToastsContext.Provider value={useMemo(() => handleOnCreateToast, [])}>
      {children}
      {activeToast !== undefined ? <Toast key={activeToast.message} {...activeToast} /> : null}
    </ToastsContext.Provider>
  );
}

function useToasts() {
  return useContext(ToastsContext);
}

export { ToastsContextProvider, useToasts };
