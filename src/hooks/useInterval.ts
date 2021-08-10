import { useEffect } from "react";

export function useInterval(fn: Function, interval: number) {
  useEffect(
    () => {
      const timerId = setInterval(
        () => {
          fn();
        },
        interval
      );
      return () => {
        clearInterval(timerId);
      }
    },
    [interval, fn]
  );
}