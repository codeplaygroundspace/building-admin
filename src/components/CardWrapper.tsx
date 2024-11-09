import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface CardWrapperProps {
  title: ReactNode;
  description?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function CardWrapper({
  title,
  description,
  content,
  footer,
  className = "",
}: CardWrapperProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
