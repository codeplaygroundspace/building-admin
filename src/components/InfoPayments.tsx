import CardWrapper from "@/components/CardWrapper";
import { Banknote, Calendar } from "lucide-react"; // Replace with appropriate Shadcn icons if different

export default function PaymentsInfo() {
  return (
    <CardWrapper title="Información de pago">
      <ul className="list-none p-0 m-0 space-y-4">
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Transferencias</h3>
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5" aria-hidden="true" />
            <p>Cuenta: xxx.</p>
          </div>
        </li>
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Red Pagos</h3>
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5" aria-hidden="true" />
            <p>Nombrar Demo Propiedades, edificio.</p>
          </div>
        </li>
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Fecha límite</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            <p>El día 10 de cada mes.</p>
          </div>
        </li>
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Recargo</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            <p>
              Luego del día 10 se generará recargo de acuerdo a la ley 1234.
            </p>
          </div>
        </li>
      </ul>
    </CardWrapper>
  );
}
