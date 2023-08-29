import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import NotificationBanner, { NotificationBannerProps } from "@/components/NotificationBanner";

function noop() {
  return;
}

interface NotificationParams extends Omit<NotificationBannerProps, "onClose"> {
  closable?: boolean;
}

type NotificationContextType = (notification: NotificationParams) => void;
const NotificationContext = createContext<NotificationContextType>(noop);

function NotificationContextProvider({ children }: { children: React.ReactNode }) {
  const notifications = useRef<NotificationParams[]>([]); // in ref to avoid stale closure issue
  const drainQueueId = useRef<NodeJS.Timer>();
  const [tickCount, forceUpdate] = useState(0); // serves to kick-off the dequeueing
  const activeNotification = notifications.current[0] as NotificationParams | undefined;

  useEffect(() => {
    if (notifications.current.length < 1 || drainQueueId.current !== undefined) {
      return;
    }

    const drainQueue = () => {
      if (notifications.current.length > 0) {
        notifications.current = notifications.current.slice(1);
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

  const handleOnCreateNotification = (notification: NotificationBannerProps) => {
    notifications.current = [...notifications.current, notification];
    forceUpdate(c => c + 1);
  };

  // This is the handler that will be passed to Notification component when press on close icon from Notification
  const handleOnCloseNotification = () => {
    notifications.current = notifications.current.slice(0, -1);
    forceUpdate(c => c + 1);
  };

  const handleOnClick = () => {
    activeNotification?.onClick();
    notifications.current = notifications.current.slice(0, -1);
    forceUpdate(c => c + 1);
  };

  return (
    <NotificationContext.Provider value={useMemo(() => handleOnCreateNotification, [])}>
      {children}
      {activeNotification !== undefined ? (
        <NotificationBanner
          onClose={activeNotification.closable ? handleOnCloseNotification : undefined}
          {...activeNotification}
          key={activeNotification.message}
          onClick={handleOnClick}
        />
      ) : null}
    </NotificationContext.Provider>
  );
}

function useNotification() {
  return useContext(NotificationContext);
}

export { NotificationContextProvider, useNotification };
