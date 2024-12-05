import { ReactNode } from "react";

export interface CardWrapperProps {
  title: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}
