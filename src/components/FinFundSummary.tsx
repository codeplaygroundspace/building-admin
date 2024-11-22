import CardWrapper from "./ui-custom/CardWrapper";

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
    </CardWrapper>
  );
}
