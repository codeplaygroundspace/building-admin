import { formatCurrency } from "@/helpers/formatCurrency";
import dayjs from "dayjs";
import { getCategoryColor } from "@/helpers/getCategoryColor";

interface ExpenseListItemProps {
  provider_name: string; // Name of the provider
  provider_id?: string; // Referenced but not directly displayed
  provider_category: string; // Provider's category (required)
  description: string;
  amount: number;
  colour?: string; // Still support custom color as a fallback
  date_from?: string | null; // Added date_from property
  date_to?: string | null; // Added date_to property
}

export default function ExpenseListItem({
  provider_name = "Desconocida",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider_id, // Keeping parameter for API consistency
  provider_category,
  description,
  amount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colour, // Keeping for backward compatibility but using category colors instead
  date_from,
  date_to,
}: ExpenseListItemProps) {
  // Debug logging
  console.log(`ExpenseListItem: ${description}`, {
    date_from,
    date_to,
    provider_name,
  });

  // Use provider_name from the API
  const displayName = provider_name;

  // Ensure we have a valid display name for the first letter
  const categoryInitial = (displayName || "X").charAt(0).toUpperCase();

  // Format dates if available
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return dayjs(dateString).format("DD/MM/YYYY");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString || "";
    }
  };

  // Create date range string - more reliable formatting
  let dateRange = "";
  if (date_from && date_to) {
    const fromFormatted = formatDate(date_from);
    const toFormatted = formatDate(date_to);
    dateRange = `${fromFormatted} - ${toFormatted}`;
  } else if (date_from) {
    dateRange = `Desde: ${formatDate(date_from)}`;
  } else if (date_to) {
    dateRange = `Hasta: ${formatDate(date_to)}`;
  }

  // Capitalize first letter of provider_category but keep the rest as is
  const formattedCategory =
    provider_category.charAt(0).toUpperCase() + provider_category.slice(1);

  // Get the appropriate category badge class
  const categoryBadgeClass = getCategoryColor(provider_category);

  return (
    <li className="flex justify-between items-start">
      <div className="flex items-start gap-2 pr-4">
        <div
          className="size-8 aspect-square rounded-lg flex items-center justify-center bg-black"
          aria-hidden="true"
        >
          <span className="text-white text-xl font-bold">
            {categoryInitial}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold uppercase">{displayName}</h3>
          <span className={`category-badge ${categoryBadgeClass}`}>
            {formattedCategory}
          </span>
          {dateRange && (
            <p className="text-sm font-semibold text-black mb-1">{dateRange}</p>
          )}
          <p className="text-neutral-500">{description}</p>
        </div>
      </div>
      <p className="whitespace-nowrap">{formatCurrency(amount)}</p>
    </li>
  );
}
