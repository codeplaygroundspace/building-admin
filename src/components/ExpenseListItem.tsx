import { formatCurrency } from "@/helpers/formatCurrency";
import { getCategoryColor } from "@/helpers/getCategoryColor";

interface ExpenseListItemProps {
  provider_name: string; // Name of the provider
  provider_id?: string; // Referenced but not directly displayed
  provider_category: string; // Provider's category (required)
  description: string;
  amount: number;
  colour?: string; // Still support custom color as a fallback
}

export default function ExpenseListItem({
  provider_name = "Desconocida",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider_id, // Keeping parameter for API consistency
  provider_category = "General", // Add default value to prevent undefined
  description,
  amount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colour, // Keeping for backward compatibility but using category colors instead
}: ExpenseListItemProps) {
  // Debug logging - less verbose and only once per component update
  const showDebugInfo = false; // Set to true when debugging
  if (showDebugInfo) {
    console.log(`ExpenseListItem: ${description}`, {
      provider_name,
      provider_category,
    });
  }

  // Use provider_name from the API
  const displayName = provider_name || "Desconocida";

  // Ensure we have a valid display name for the first letter
  const categoryInitial = (displayName || "X").charAt(0).toUpperCase();

  // Safely format provider_category with additional null checks
  const safeCategory = provider_category || "General";

  // Safely capitalize first letter with proper type checking
  let formattedCategory = "General";
  try {
    if (typeof safeCategory === "string" && safeCategory.length > 0) {
      formattedCategory =
        safeCategory.charAt(0).toUpperCase() + safeCategory.slice(1);
    }
  } catch (error) {
    console.error("Error formatting category:", error);
  }

  // Get the appropriate category badge class
  const categoryBadgeClass = getCategoryColor(safeCategory);

  return (
    <li className="flex justify-between items-start">
      <div className="flex items-start gap-2 pr-4">
        <div
          className="h-8 w-8 rounded-md flex items-center justify-center bg-black self-stretch"
          aria-hidden="true"
        >
          <span className="text-white text-2xl font-bold">
            {categoryInitial}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold uppercase">{displayName}</h3>
          <span className={`category-badge ${categoryBadgeClass}`}>
            {formattedCategory}
          </span>
          {description && <p className="text-neutral-500">{description}</p>}
        </div>
      </div>
      <p className="whitespace-nowrap">{formatCurrency(amount)}</p>
    </li>
  );
}
