// Inspired by react-hot-toast library
import { useState, useEffect, useCallback } from "react";

const TOAST_LIMIT = 1;

type ToastType = "default" | "destructive";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toasts: Toast[] = [];

type ToasterToast = Toast & {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
};

const listeners: Array<(toasts: ToasterToast[]) => void> = [];

export const toast = ({ ...props }: Omit<Toast, "id">) => {
  const id = genId();

  const update = (props: Omit<Toast, "id">) => {
    toasts.forEach((t) => {
      if (t.id === id) {
        t.title = props.title ?? t.title;
        t.description = props.description ?? t.description;
        t.type = props.type ?? t.type;
        listeners.forEach((listener) => listener([...toasts]));
      }
    });
  };

  const dismiss = () => {
    toasts.forEach((t) => {
      if (t.id === id) {
        listeners.forEach((listener) =>
          listener(toasts.filter((t) => t.id !== id))
        );
      }
    });
  };

  const newToast = {
    id,
    title: props.title,
    description: props.description,
    type: props.type || "default",
    duration: props.duration || 3000,
  };

  toasts.push(newToast);

  if (toasts.length > TOAST_LIMIT) {
    toasts.shift();
  }

  listeners.forEach((listener) => listener([...toasts]));

  return {
    id,
    dismiss,
    update,
  };
};

export function useToast() {
  const [localToasts, setLocalToasts] = useState<ToasterToast[]>([]);

  useEffect(() => {
    listeners.push(setLocalToasts);
    return () => {
      const index = listeners.indexOf(setLocalToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    listeners.forEach((listener) =>
      listener(toasts.filter((t) => t.id !== id))
    );
  }, []);

  return {
    toasts: localToasts,
    toast,
    dismiss: dismissToast,
  };
}
