import CardWrapper from "./ui-custom/CardWrapper";
import { Separator } from "@/components/ui/separator";

export default function InfoDebt() {
  const debts = [
    { unit: "006P", description: "Deuda acumulada", amount: 25437.0 },
    { unit: "006I", description: "Deuda acumulada", amount: 1272.0 },
  ];

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <CardWrapper title="Listado de deudores">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total</h2>
        <p className=" text-red-500">
          <span className="text-sm">$</span>
          {totalDebt.toFixed(2)}
        </p>
      </div>
      <Separator className="my-4" />
      <ul className="space-y-4">
        {debts.map((debt, index) => (
          <li key={index} className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold">{debt.unit}</h3>
              <p className="text-neutral-500">{debt.description}</p>
            </div>
            <p className="whitespace-nowrap">${debt.amount.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </CardWrapper>
  );
}
