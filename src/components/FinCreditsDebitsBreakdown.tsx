import CardWrapper from "./ui-custom/CardWrapper";
import { Separator } from "@/components/ui/separator";

export default function CreditsDebitsBreakdown() {
  const transactions = [
    {
      fund: "Gastos comunes",
      description: "BSE - SEGURO DE INCENDIO CUOTA 2/4",
      amount: 3849.4,
    },
    {
      fund: "Gastos comunes",
      description: "LIMPIEZA POST OBRA",
      amount: 4200.0,
    },
    {
      fund: "Gastos comunes",
      description: "ELECTRICISTA MIGUEL VITALIS",
      amount: 2500.0,
    },
    {
      fund: "Fondo de reserva",
      description: "CONSTRUCOM - BPS 09.2024 - 15/10/2024",
      amount: 33568.0,
    },
    {
      fund: "Fondo de reserva",
      description: "CONSTRUCOM - 4ta ENTREGA SALDO",
      amount: 223052.0,
    },
    {
      fund: "Fondo de reserva",
      description: "CONSTRUCOM - CUOTA 1 DE 9",
      amount: 26709.0,
    },
    {
      fund: "Fondo de reserva",
      description: "CONSTRUCOM - BPS TIMBRE PROFESIONAL",
      amount: 250.0,
    },
  ];

  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  return (
    <CardWrapper title="Detalle de créditos y débitos">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total</h2>
        <p className="text-2xl font-bold">
          <span className="text-sm">$</span>
          {totalAmount.toFixed(2)}
        </p>
      </div>
      <Separator className="my-4" />
      <ul className="space-y-4">
        {transactions.map((transaction, index) => (
          <li key={index} className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold">{transaction.fund}</h3>
              <p className="text-neutral-500">{transaction.description}</p>
            </div>
            <p className="whitespace-nowrap">{transaction.amount.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </CardWrapper>
  );
}
