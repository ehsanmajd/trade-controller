import { useEffect, useState } from 'react';


export function useDebounce(val: string) {
  const [temp, setTemp] = useState<string | undefined>();

  useEffect(
    () => {
      const id = setTimeout(
        () => {
          setTemp(val);
        },
        500
      );
      return () => {
        clearTimeout(id);
      }
    },
    [val]
  );

  return temp;
}