import CardWrapper from "./CardWrapper";
import { formatCurrency } from "../lib/formatCurrency";

export default function FundSummary() {
  const fundSummary = [
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

  return (
    <CardWrapper title="Resumen de Fondo">
      {fundSummary.map((fund, index) => (
        <div key={index}>
          <div className="space-y-4">
            {fund.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <p className="text-lg">{item.label}</p>
                <p>{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </CardWrapper>
  );
}
