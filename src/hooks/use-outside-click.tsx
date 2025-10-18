import React, { useEffect } from "react";

type AnyEvent = MouseEvent | TouchEvent;

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: (ev: AnyEvent) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // DO NOTHING if the element being clicked is the target element or their children
      const target = event.target as Node | null;
      if (!ref.current || (target && ref.current.contains(target))) {
        return;
      }
      callback(event as AnyEvent);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
