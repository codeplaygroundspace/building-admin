import CardWrapper from "./ui-custom/CardWrapper";
import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";

export default function ExpenseBreakdown() {
  const expenses = [
    {
      title: "U.T.E.",
      description: "Consumo 23/08/2024 - 23/09/2024",
      category: "Mantenimiento y consumo",
      amount: 1052.0,
    },
    {
      title: "U.T.E.",
      description: "Consumo 23/08/2024 - 23/09/2024 Bomba",
      category: "Mantenimiento y consumo",
      amount: 863.0,
    },
    {
      title: "O.S.E.",
      description: "Consumo 07/09/2024 - 08/10/2024",
      category: "Mantenimiento y consumo",
      amount: 2973.0,
    },
    {
      title: "Limpieza",
      description: "Júpiter Setiembre 2024",
      category: "Servicios",
      amount: 4600.0,
    },
    {
      title: "Sanitaria",
      description: "Patrón, hidrolavado en camaras generales y desagues",
      category: "Servicios",
      amount: 13398.0,
    },
    {
      title: "Honorarios",
      description: "Inmco Octubre 2024",
      category: "Administración",
      amount: 4338.0,
    },
    {
      title: "Comisiones",
      description: "BROU",
      category: "Banco",
      amount: 152.74,
    },
  ];

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <CardWrapper title="Desglose de Gastos">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total</h2>
        <p className="text-xl font-bold">
          <span className="text-sm">$</span>
          {totalExpenses.toFixed(2)}
        </p>
      </div>
      <Separator className="my-4" />
      <ul className="space-y-4">
        {expenses.map((expense, index) => (
          <li key={index} className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h3 className="font-semibold">{expense.title}</h3>
              <p className="text-neutral-500">{expense.description}</p>
            </div>
            <p className="text-xl font-bold whitespace-nowrap">
              {expense.amount.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </CardWrapper>
  );
}
