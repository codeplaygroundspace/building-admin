import { formatCurrency } from "../lib/formatCurrency";

interface ExpenseListItemProps {
  category_name?: string;
  description: string;
  amount: number;
  colour: string;
}

export default function ExpenseListItem({
  category_name = "Desconocida",
  description,
  amount,
  colour,
}: ExpenseListItemProps) {
  return (
    <li className="flex justify-between items-start">
      <div className="flex items-start gap-2 pr-4">
        <div
          className="size-8 aspect-square rounded-lg border-2 border-gray-300 flex items-center justify-center bg-gray-100"
          style={{ backgroundColor: colour || "black" }}
          aria-hidden="true"
        >
          <span className="text-white text-xl font-bold">
            {category_name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{category_name}</h3>
          <p className="text-neutral-500">{description}</p>
        </div>
      </div>
      <p className="whitespace-nowrap">{formatCurrency(amount)}</p>
    </li>
  );
}
