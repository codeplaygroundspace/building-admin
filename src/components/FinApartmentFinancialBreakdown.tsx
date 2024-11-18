import CardWrapper from "./ui-custom/CardWrapper";

export default function ApartmentFinancialBreakdown() {
  const apartmentData = {
    aptNumber: "001P",
    previousBalance: -53938,
    payments: 0,
    newBalance: -53938,
    commonExpenses: 0,
    reserveFund: 415,
    constructionFee: 7616,
    monthlyTotal: 8031,
    lateFee: 0,
    totalDue: -45907,
  };

  return (
    <CardWrapper title="Detalle financiero">
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
        <h2 className="text-xl font-semibold mb-4">
          Apto N° {apartmentData.aptNumber} - Propietario
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p>Saldo anterior</p>
            <p>${apartmentData.previousBalance.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Pagos</p>
            <p>${apartmentData.payments.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Nuevo saldo</p>
            <p>${apartmentData.newBalance.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Gastos comunes</p>
            <p>${apartmentData.commonExpenses.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Fondo de reserva</p>
            <p>${apartmentData.reserveFund.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Cuota obra 5/12</p>
            <p>${apartmentData.constructionFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Total del mes</p>
            <p>${apartmentData.monthlyTotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Recargo por mora</p>
            <p>${apartmentData.lateFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Total a pagar</p>
            <p>${apartmentData.totalDue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
