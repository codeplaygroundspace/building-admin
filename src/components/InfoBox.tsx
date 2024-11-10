import CardWrapper from "./ui-custom/CardWrapper";

export default function InfoBox() {
  return (
    <CardWrapper
      className="mt-6"
      title="Información Adicional"
      description="Detalles importantes sobre las opciones de pago y contactos."
      content={
        <>
          <p>
            <strong>Opciones de pago:</strong>
          </p>
          <ol className="list-decimal list-inside">
            <li>Red Pagos</li>
            <li>Depósito o transferencia</li>
          </ol>
          <ul>
            <li>
              <strong>Fecha límite de pago:</strong> día 10 de cada mes
            </li>
            <li>
              <strong>Administración:</strong> XXX
            </li>
            <li>
              <strong>Empresa de limpieza:</strong>XXX
            </li>
          </ul>
        </>
      }
    />
  );
}
