import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Types
interface AlertWrapperProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export default function AlertWrapper({
  className = "h-4 w-4",
  title,
  children,
}: AlertWrapperProps) {
  return (
    <Alert>
      <InfoIcon className={className} />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
