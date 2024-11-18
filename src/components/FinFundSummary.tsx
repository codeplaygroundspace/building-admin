import CardWrapper from "./ui-custom/CardWrapper";
import { Separator } from "@/components/ui/separator";

export default function FundSummary() {
  const fundSummary = [
    {
      category: "Gastos comunes",
      items: [
        { label: "Saldo anterior", amount: 59138.77 },
        { label: "Cobranza", amount: 8691.01 },
        { label: "Gastos", amount: 27376.74 },
        { label: "Créditos", amount: 0.0 },
        { label: "Débitos", amount: 10549.4 },
      ],
    },
    {
      category: "Fondo de reserva",
      items: [
        { label: "Saldo anterior", amount: 338491.83 },
        { label: "Cobranza", amount: 27642.99 },
        { label: "Gastos", amount: 283579.0 },
        { label: "Créditos", amount: 0.0 },
        { label: "Débitos", amount: 0.0 },
      ],
    },
  ];

  const totals = {
    gastosComunes: 112459.46,
    cajaReserva: 82555.82,
    overall: 112459.46 + 82555.82,
  };

  return (
    <CardWrapper title="Resumen">
      {fundSummary.map((fund, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{fund.category}</h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
            {fund.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <p className="text-lg">{item.label}</p>
                <p>
                  <span className="text-sm">$</span>
                  {item.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Separator className="my-6" />

      {/* Totals */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Total Gastos comunes</h3>
          <p className="text-lg font-bold">
            ${totals.gastosComunes.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Total Fondo de reserva</h3>
          <p className="text-lg font-bold">${totals.cajaReserva.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Total general</h3>
          <p className="text-lg font-bold">${totals.overall.toFixed(2)}</p>
        </div>
      </div>
    </CardWrapper>
  );
}
