import { useState, useEffect, useCallback } from "react";

export interface TimerOptions {
  initialTime: number;
  onTick?: (timeLeft: number) => void;
  onExpire?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

export const useTimer = (options: TimerOptions) => {
  const [timeLeft, setTimeLeft] = useState<number>(options.initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // Start timer
  const start = useCallback(() => {
    setIsRunning(true);
    setIsExpired(false);
    options.onStart?.();
  }, [options]);

  // Pause timer
  const pause = useCallback(() => {
    setIsRunning(false);
    options.onPause?.();
  }, [options]);

  // Reset timer
  const reset = useCallback(
    (newTime?: number) => {
      const time = newTime ?? options.initialTime;
      setTimeLeft(time);
      setIsRunning(false);
      setIsExpired(false);
      options.onReset?.();
    },
    [options],
  );

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          options.onTick?.(newTime);

          if (newTime <= 0) {
            setIsRunning(false);
            setIsExpired(true);
            options.onExpire?.();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, options]);

  // Utility functions
  const getProgress = useCallback(() => {
    return (timeLeft / options.initialTime) * 100;
  }, [timeLeft, options.initialTime]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, "0")}`
      : `${secs}s`;
  }, []);

  const getUrgencyLevel = useCallback(() => {
    const progress = getProgress();
    if (progress <= 20) return "critical"; // Last 20%
    if (progress <= 50) return "warning"; // Last 50%
    return "normal";
  }, [getProgress]);

  return {
    timeLeft,
    isRunning,
    isExpired,
    progress: getProgress(),
    formattedTime: formatTime(timeLeft),
    urgencyLevel: getUrgencyLevel(),
    start,
    pause,
    reset,
  };
};

export const TimerDisplay = ({
  timeLeft,
  totalTime,
  urgencyLevel = "normal",
  showProgress = true,
  showUrgencyMessage = true,
  className = "",
}: {
  timeLeft: number;
  totalTime: number;
  urgencyLevel?: "normal" | "warning" | "critical";
  showProgress?: boolean;
  showUrgencyMessage?: boolean;
  className?: string;
}) => {
  const progress = (timeLeft / totalTime) * 100;

  const getTimerStyles = () => {
    switch (urgencyLevel) {
      case "critical":
        return {
          container: "animate-pulse border-red-500 bg-red-50",
          text: "text-red-700",
          indicator: "bg-red-500 animate-pulse",
          progress: "bg-red-500",
        };
      case "warning":
        return {
          container: "border-yellow-500 bg-yellow-50",
          text: "text-yellow-700",
          indicator: "bg-yellow-500",
          progress: "bg-yellow-500",
        };
      default:
        return {
          container: "",
          text: "text-black",
          indicator: "bg-green-500",
          progress: "bg-green-500",
        };
    }
  };

  const styles = getTimerStyles();

  return (
    <div
      className={`bg-white border border-black rounded-[12px] p-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${styles.container} ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <div className={`w-3 h-3 rounded-full ${styles.indicator}`}></div>
        <p className={`font-hartone text-[18px] ${styles.text}`}>
          Time Left: {timeLeft}s
        </p>
      </div>

      {showProgress && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2 border border-black">
          <div
            className={`h-1.5 rounded-full transition-all duration-1000 ${styles.progress}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {showUrgencyMessage && urgencyLevel === "critical" && (
        <div className="mt-2 text-center">
          <p className="font-sintony text-[12px] text-red-600 animate-bounce">
            ⚡ Hurry up! Time is running out!
          </p>
        </div>
      )}
    </div>
  );
};
