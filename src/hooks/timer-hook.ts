import { useEffect, useRef, useState } from "react";

import { TimerStatusEnum } from "@/types/timer";

export default function useTimer() {
  const [timer, setTimer] = useState<number>(30);
  const [remainingNumberOfRetries, setRemainingNumberOfRetries] = useState<number>(1);
  const [timerStatus, setTimerStatus] = useState<TimerStatusEnum>(TimerStatusEnum.NOT_STARTED);
  const timerRef = useRef<NodeJS.Timer>();
  const defaultTimerCountRef = useRef<number>(30);

  const startTimer = ({ timeToLive, autoRetryCount }: { timeToLive: number; autoRetryCount: number }) => {
    defaultTimerCountRef.current = timeToLive;
    setTimerStatus(TimerStatusEnum.RUNNING);
    setTimer(timeToLive);
    setRemainingNumberOfRetries(autoRetryCount);
    timerRef.current = setInterval(() => setTimer(t => t - 1), 1000);
  };

  const resumeTimer = () => {
    startTimer({ timeToLive: defaultTimerCountRef.current, autoRetryCount: remainingNumberOfRetries - 1 });
  };

  if (timer === 0 && timerStatus === "running") {
    clearInterval(timerRef.current);
    if (remainingNumberOfRetries > 1) {
      setTimerStatus(TimerStatusEnum.PAUSED);
    } else {
      setTimerStatus(TimerStatusEnum.STOPPED);
    }
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return { timer, startTimer, resumeTimer, timerStatus };
}
