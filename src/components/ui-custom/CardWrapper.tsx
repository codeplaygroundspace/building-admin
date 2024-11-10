import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface CardWrapperProps {
  title: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function CardWrapper({
  title,
  content,
  footer,
  className = "",
}: CardWrapperProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
