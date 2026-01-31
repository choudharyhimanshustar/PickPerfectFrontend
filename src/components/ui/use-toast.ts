"use client";

import * as React from "react";

type ToastProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
};

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

const listeners: Array<(toasts: ToastProps[]) => void> = [];
let memoryState: ToastProps[] = [];

function dispatch(toasts: ToastProps[]) {
  memoryState = toasts;
  listeners.forEach((listener) => listener(toasts));
}

function toast(props: Omit<ToastProps, "id">) {
  const id = genId();
  dispatch([...memoryState, { ...props, id }]);
}

function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toast, toasts };
}

export { useToast, toast };
