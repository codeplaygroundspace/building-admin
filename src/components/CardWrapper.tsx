import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CardWrapperProps } from "@/types/cardWrapper";

export default function CardWrapper({
  title,
  footer,
  children,
}: CardWrapperProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold pb-2">{title}</h2>
      <Card className="pt-4">
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </section>
  );
}
