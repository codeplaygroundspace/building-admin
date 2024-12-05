import { formatCurrency } from "../lib/formatCurrencyUtils";

export default function FinTotal() {
  const totals = {
    gastosComunes: 112459.46,
    cajaReserva: 82555.82,
  };

  return (
    <div className="flex-col items-center justify-center">
      <div className=" flex justify-between bg-gradient-to-r from-gray-900 to-gray-700 p-6 rounded-lg">
        <h3 className="text-2xl font-semibold text-white">Total</h3>
        <p className="text-2xl font-bold text-white">
          {formatCurrency(totals.gastosComunes + totals.cajaReserva)}
        </p>
      </div>

      <div className="mt-[-12px] -z-10 relative mx-auto p-[1px] w-[95%] rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <div className="bg-[#EAEAEE] rounded-lg p-6 space-y-3">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold ">Gastos comunes</h3>
            <p className="text-lg ">${totals.gastosComunes.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold ">Fondo de reserva</h3>
            <p className="text-lg ">${totals.cajaReserva.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
