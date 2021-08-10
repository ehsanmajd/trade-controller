import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T) {
  const val = useRef<T | undefined>();
  useEffect(
    () => {
      val.current = value;
    },
    [value]
  );
  return val.current;
}