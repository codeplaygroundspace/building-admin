/**
 * Maps expense categories to their corresponding badge color classes
 *
 * @param category - The expense provider category
 * @returns The appropriate CSS class name for the badge styling
 */
export function getCategoryColor(category: string | null | undefined): string {
  // Safely handle null or undefined category
  if (!category) return "badge-otros";

  try {
    // Normalize the category to lowercase for case-insensitive matching
    const normalizedCategory = category.toLowerCase();

    // Match exact category names from database
    if (normalizedCategory.includes("agua")) {
      return "badge-agua";
    }
    if (
      normalizedCategory.includes("comision") ||
      normalizedCategory.includes("bancaria")
    ) {
      return "badge-comision-bancaria";
    }
    if (normalizedCategory.includes("seguridad")) {
      return "badge-seguridad";
    }
    if (normalizedCategory.includes("emergencia")) {
      return "badge-emergencia";
    }
    if (normalizedCategory.includes("sanitaria")) {
      return "badge-sanitaria";
    }
    if (normalizedCategory.includes("administracion")) {
      return "badge-administracion";
    }
    if (normalizedCategory.includes("limpieza")) {
      return "badge-limpieza";
    }
    if (normalizedCategory.includes("electricista")) {
      return "badge-electricista";
    }
    if (normalizedCategory.includes("electricidad")) {
      return "badge-electricidad";
    }

    // Default for any categories not specifically matched
    return "badge-otros";
  } catch (error) {
    console.error("Error getting category color:", error);
    return "badge-otros";
  }
}
