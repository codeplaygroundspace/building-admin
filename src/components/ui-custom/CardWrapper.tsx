import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardWrapperProps {
  title: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function CardWrapper({
  title,
  footer,
  className = "",
  children,
}: CardWrapperProps) {
  return (
    <section>
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </section>
  );
}
