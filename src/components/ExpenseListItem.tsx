import { formatCurrency } from "@/helpers/formatCurrency";

interface ExpenseListItemProps {
  category_name?: string;
  provider_id?: string;
  description: string;
  amount: number;
  colour?: string;
}

export default function ExpenseListItem({
  category_name = "Desconocida",
  provider_id,
  description,
  amount,
  colour,
}: ExpenseListItemProps) {
  // Use category_name which should contain the provider name from the backend
  // (provider_id is just the ID value)
  const displayName = category_name;

  // Ensure we have a valid display name for the first letter
  const categoryInitial = (displayName || "X").charAt(0).toUpperCase();

  return (
    <li className="flex justify-between items-start">
      <div className="flex items-start gap-2 pr-4">
        <div
          className="size-8 aspect-square rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colour || "#000000" }}
          aria-hidden="true"
        >
          <span className="text-white text-xl font-bold">
            {categoryInitial}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{displayName}</h3>
          <p className="text-neutral-500">{description}</p>
        </div>
      </div>
      <p className="whitespace-nowrap">{formatCurrency(amount)}</p>
    </li>
  );
}
