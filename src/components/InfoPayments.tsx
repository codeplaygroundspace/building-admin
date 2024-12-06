import CardWrapper from "@/components/CardWrapper";
import { Banknote, Calendar } from "lucide-react"; // Replace with appropriate Shadcn icons if different

export default function PaymentsInfo() {
  return (
    <CardWrapper title="Información de pago">
      <ul className="list-none p-0 m-0 space-y-4">
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Depósito o transferencia</h3>
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5" aria-hidden="true" />
            <span>Cuenta: xxx.</span>
          </div>
        </li>
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Red Pagos</h3>
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5" aria-hidden="true" />
            <span>Nombrar Demo Propiedades, edificio.</span>
          </div>
        </li>
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Fecha límite</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            <span>El día 10 de cada mes.</span>
          </div>
        </li>
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Recargo</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            <span>
              Luego del día 10 se generará recargo de acuerdo a la ley 1234.
            </span>
          </div>
        </li>
      </ul>
    </CardWrapper>
  );
}
