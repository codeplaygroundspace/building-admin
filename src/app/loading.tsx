import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <LoadingSpinner size="large" text="Cargando..." />
    </div>
  );
}
