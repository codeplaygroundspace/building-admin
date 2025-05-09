import { formatCurrency } from "@/helpers/formatCurrency";

interface ExpenseListItemProps {
  provider_name: string; // Name of the provider
  provider_id?: string; // Referenced but not directly displayed
  provider_category: string; // Provider's category (required)
  description: string;
  amount: number;
  colour?: string;
}

export default function ExpenseListItem({
  provider_name = "Desconocida",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider_id, // Keeping parameter for API consistency
  provider_category,
  description,
  amount,
  colour,
}: ExpenseListItemProps) {
  // Use provider_name from the API
  const displayName = provider_name;

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
          <h3 className="text-lg font-semibold uppercase">
            {displayName}
            <span className="ml-2 text-sm font-normal text-neutral-500">
              ({provider_category})
            </span>
          </h3>
          <p className="text-neutral-500">{description}</p>
        </div>
      </div>
      <p className="whitespace-nowrap">{formatCurrency(amount)}</p>
    </li>
  );
}
