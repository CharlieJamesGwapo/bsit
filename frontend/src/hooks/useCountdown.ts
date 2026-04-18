import { useState, useEffect } from "react";
import type { CountdownStatus } from "../types";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: CountdownStatus;
}

export function useCountdown(date: string, startTime: string, endTime: string): CountdownResult {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startDate = new Date(`${date}T${startTime}:00`);
  const endDate = endTime ? new Date(`${date}T${endTime}:00`) : new Date(startDate.getTime() + 3600000);

  if (now >= startDate && now <= endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "happening" };
  }

  if (now > endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "completed" };
  }

  const diff = startDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, status: "upcoming" };
}
