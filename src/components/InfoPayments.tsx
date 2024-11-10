import CardWrapper from "./ui-custom/CardWrapper";

export default function PaymentsInfo() {
  return (
    <CardWrapper title="Información de pago">
      <ul className="list-disc list-inside">
        <li>
          <strong>Red Pagos:</strong> Nombrar Demo Propiedades, edificio
        </li>
        <li>
          <strong>Depósito o transferencia en :</strong> xxx
        </li>
      </ul>
      <p className="mt-2">
        La fecha límite para el pago es el día 10 de cada mes. Luego se generará
        recargo de acuerdo a la ley 1234.
      </p>
    </CardWrapper>
  );
}
