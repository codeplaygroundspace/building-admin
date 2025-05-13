"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useBuilding } from "@/contexts/building-context";
import CardWrapper from "@/components/CardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import dayjs from "dayjs";
import { formatUppercase } from "@/helpers/formatters";
import { PlusCircle, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define provider interface
interface Provider {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
}

// Define expense interface
interface ExpenseItem {
  id: string;
  description: string;
  amount: string;
  provider_id: string;
  provider_name: string;
  provider_category: string;
  expense_reporting_month: string;
}

// Define the fetched expense interface from the API
interface FetchedExpense {
  id: string;
  amount: number;
  provider_name: string;
  created_at: string;
  description: string;
  building_id: string;
  provider_id?: string;
  provider_category: string;
  expense_reporting_month: string;
}

// Define sort configuration type
type SortConfig = {
  key: keyof FetchedExpense | null;
  direction: "ascending" | "descending";
};

export default function AdminPage() {
  const { building } = useBuilding();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [allExpenses, setAllExpenses] = useState<FetchedExpense[]>([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [nextId, setNextId] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Function to get next stable ID
  const getNextStableId = useCallback(() => {
    const id = `expense-${nextId}`;
    setNextId((prev) => prev + 1);
    return id;
  }, [nextId]);

  // Initialize with a single expense
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: "expense-1",
      description: "",
      amount: "",
      provider_id: "",
      provider_name: "",
      provider_category: "General",
      expense_reporting_month: dayjs().format("YYYY-MM"),
    },
  ]);

  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoadingProviders(true);
        const response = await fetch("/api/providers");

        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }

        const data = await response.json();
        setProviders(data.providers || []);
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast({
          title: "Error",
          description: "Failed to load providers",
        });
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    if (!building?.id) return;

    try {
      setIsLoadingExpenses(true);
      const url = new URL("/api/expenses", window.location.origin);
      url.searchParams.append("building_id", building.id);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setAllExpenses(data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
      });
    } finally {
      setIsLoadingExpenses(false);
    }
  }, [building?.id]);

  // Fetch expenses when the building changes or after a successful submission
  useEffect(() => {
    if (building?.id) {
      fetchExpenses();
    }
  }, [building?.id, fetchExpenses]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    expenseId: string
  ) => {
    const { name, value } = e.target;
    setExpenses((prevExpenses) =>
      prevExpenses.map((exp) =>
        exp.id === expenseId ? { ...exp, [name]: value } : exp
      )
    );
  };

  const handleProviderChange = (providerId: string, expenseId: string) => {
    const selectedProvider = providers.find(
      (provider) => provider.id === providerId
    );

    setExpenses((prevExpenses) =>
      prevExpenses.map((exp) =>
        exp.id === expenseId
          ? {
              ...exp,
              provider_id: providerId,
              provider_name: selectedProvider?.name || "",
              provider_category: selectedProvider?.category_name || "General",
            }
          : exp
      )
    );
  };

  const handleAddExpense = () => {
    // Use the reporting month from the first expense for consistency
    const reportingMonth =
      expenses[0]?.expense_reporting_month || dayjs().format("YYYY-MM");

    setExpenses((prev) => [
      ...prev,
      {
        id: getNextStableId(),
        description: "",
        amount: "",
        provider_id: "",
        provider_name: "",
        provider_category: "General",
        expense_reporting_month: reportingMonth,
      },
    ]);
  };

  const handleRemoveExpense = (expenseId: string) => {
    // Don't allow removing if only one expense remains
    if (expenses.length <= 1) return;

    setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Update all expenses with the same reporting month
    setExpenses((prev) =>
      prev.map((exp) => ({
        ...exp,
        expense_reporting_month: value,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!building?.id) {
      toast({
        title: "Hay un error 🥴",
        description: "No building selected",
      });
      return;
    }

    // Validate all expenses
    const invalidExpenses = expenses.filter(
      (exp) => !exp.amount || !exp.provider_id
    );

    if (invalidExpenses.length > 0) {
      toast({
        title: "Hay un error 🥴",
        description: `Debes completar todos los datos requeridos en ${invalidExpenses.length} gastos`,
      });
      return;
    }

    // Validate expense_reporting_month format
    const reportingMonth = expenses[0].expense_reporting_month;
    const dateRegex = /^\d{4}-\d{2}$/;
    if (!dateRegex.test(reportingMonth)) {
      toast({
        title: "Hay un error 🥴",
        description: "El formato debe ser YYYY-MM",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare all expense data
      const expensesData = expenses.map((exp) => ({
        description: exp.description || null, // Allow null description
        amount: parseFloat(exp.amount),
        provider_id: exp.provider_id,
        provider_name: exp.provider_name,
        provider_category: exp.provider_category,
        building_id: building.id,
        expense_reporting_month: exp.expense_reporting_month,
      }));

      // Send the data to the API
      const response = await fetch("/api/expenses/add-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenses: expensesData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expenses");
      }

      // Reset the form with one empty expense
      setExpenses([
        {
          id: getNextStableId(),
          description: "",
          amount: "",
          provider_id: "",
          provider_name: "",
          provider_category: "General",
          expense_reporting_month: reportingMonth,
        },
      ]);

      toast({
        title: "Listo ✅",
        description: `${expensesData.length} gastos agregados correctamente`,
      });

      // Refresh expenses list after adding new ones
      fetchExpenses();
    } catch (error) {
      console.error("Error al agregar gastos:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Un error desconocido ha ocurrido",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format month for display (YYYY-MM to MM/YYYY)
  const formatMonth = (date: string) => {
    if (!date) return "-";
    try {
      return dayjs(date).format("MM/YYYY");
    } catch {
      return date;
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  // Handle sorting
  const requestSort = (key: keyof FetchedExpense) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Get sorted expenses
  const getSortedExpenses = () => {
    const sortableExpenses = [...allExpenses];

    if (sortConfig.key !== null) {
      sortableExpenses.sort((a, b) => {
        // Handle string comparison (case insensitive)
        if (
          typeof a[sortConfig.key!] === "string" &&
          typeof b[sortConfig.key!] === "string"
        ) {
          const valueA = (a[sortConfig.key!] as string).toLowerCase();
          const valueB = (b[sortConfig.key!] as string).toLowerCase();

          if (valueA < valueB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }

        // Handle number comparison
        if (
          typeof a[sortConfig.key!] === "number" &&
          typeof b[sortConfig.key!] === "number"
        ) {
          return sortConfig.direction === "ascending"
            ? (a[sortConfig.key!] as number) - (b[sortConfig.key!] as number)
            : (b[sortConfig.key!] as number) - (a[sortConfig.key!] as number);
        }

        // Default fallback
        return 0;
      });
    }

    return sortableExpenses;
  };

  // Get sort direction icon
  const getSortDirectionIcon = (columnKey: keyof FetchedExpense) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-300 ml-1">⇅</span>;
    }

    return sortConfig.direction === "ascending" ? (
      <span className="text-black ml-1">↑</span>
    ) : (
      <span className="text-black ml-1">↓</span>
    );
  };

  // Group providers by category for better organization
  const providersByCategory = providers.reduce((acc, provider) => {
    const category = provider.category_name || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(provider);
    return acc;
  }, {} as Record<string, Provider[]>);

  // Check if we can add more expenses (max 8)
  const canAddMoreExpenses = expenses.length < 8;

  // Get sorted expenses
  const sortedExpenses = getSortedExpenses();

  // Add this function to calculate available months from expenses
  const availableMonths = useMemo(() => {
    const uniqueMonths = [
      ...new Set(allExpenses.map((e) => e.expense_reporting_month)),
    ];
    return uniqueMonths.sort((a, b) => b.localeCompare(a)); // Sort in descending order (newest first)
  }, [allExpenses]);

  // Add this function to filter expenses by month and apply pagination
  const filteredAndPaginatedExpenses = useMemo(() => {
    // First filter by selected month if any
    const filtered =
      selectedMonth && selectedMonth !== "all"
        ? sortedExpenses.filter(
            (expense) => expense.expense_reporting_month === selectedMonth
          )
        : sortedExpenses;

    // Then apply pagination
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filtered.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedExpenses, selectedMonth, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalExpenses = useMemo(
    () =>
      selectedMonth && selectedMonth !== "all"
        ? sortedExpenses.filter(
            (expense) => expense.expense_reporting_month === selectedMonth
          ).length
        : sortedExpenses.length,
    [sortedExpenses, selectedMonth]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalExpenses / rowsPerPage)),
    [totalExpenses, rowsPerPage]
  );

  // Add a function to handle page changes and ensure they're valid
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Effect to reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, rowsPerPage]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <CardWrapper title="Agregar gastos">
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {/* Common month selector for all expenses */}
          <div className="space-y-2">
            <Label htmlFor="expense_reporting_month">
              Mes al que reportan todos los gastos (YYYY-MM):
            </Label>
            <Input
              id="expense_reporting_month"
              name="expense_reporting_month"
              type="month"
              value={expenses[0]?.expense_reporting_month || ""}
              onChange={handleMonthChange}
              required
            />
          </div>

          {/* Expenses list */}
          <div className="space-y-8">
            {expenses.map((exp, index) => (
              <div key={exp.id} className="border rounded-lg p-4 relative">
                <div className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600">
                  Gasto #{index + 1}
                </div>

                {expenses.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveExpense(exp.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <div className="flex flex-col space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`provider_id-${exp.id}`}>Proveedor:</Label>
                    <Select
                      value={exp.provider_id}
                      onValueChange={(value) =>
                        handleProviderChange(value, exp.id)
                      }
                      disabled={isLoadingProviders}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingProviders
                              ? "Cargando lista de proveedores..."
                              : "Seleccionar proveedor"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(providersByCategory).map(
                          ([category, categoryProviders]) => (
                            <div key={category}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                {category}
                              </div>
                              {categoryProviders.map((provider) => (
                                <SelectItem
                                  key={provider.id}
                                  value={provider.id}
                                >
                                  {formatUppercase(provider.name)}
                                </SelectItem>
                              ))}
                            </div>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`amount-${exp.id}`}>Monto:</Label>
                    <Input
                      id={`amount-${exp.id}`}
                      name="amount"
                      type="number"
                      step="0.01"
                      value={exp.amount}
                      onChange={(e) => handleInputChange(e, exp.id)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${exp.id}`}>
                      Descripcion de gasto (opcional):
                    </Label>
                    <Textarea
                      id={`description-${exp.id}`}
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleInputChange(e, exp.id)}
                      placeholder="Descripcion de gasto si fuera necesario"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add more expenses button */}
          {canAddMoreExpenses && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={handleAddExpense}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar otro gasto
            </Button>
          )}

          <div className="flex w-full">
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingProviders}
              className="w-full bg-black hover:bg-gray-800"
            >
              {isSubmitting
                ? `Agregando ${expenses.length} gastos...`
                : `Agregar ${expenses.length} gasto${
                    expenses.length > 1 ? "s" : ""
                  }`}
            </Button>
          </div>
        </form>
      </CardWrapper>

      {/* Expenses Table */}
      <CardWrapper title="Gastos registrados">
        <div className="p-4 space-y-4">
          {/* Month filter */}
          {!isLoadingExpenses && allExpenses.length > 0 && (
            <div className="flex items-center space-x-2">
              <label htmlFor="month-filter" className="text-sm font-medium">
                Filtrar por mes:
              </label>
              <Select
                value={selectedMonth || "all"}
                onValueChange={(value) => setSelectedMonth(value)}
              >
                <SelectTrigger id="month-filter" className="w-[200px]">
                  <SelectValue placeholder="Todos los meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {formatMonth(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isLoadingExpenses ? (
            <div className="text-center py-8">Cargando gastos...</div>
          ) : allExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay gastos registrados para este edificio.
            </div>
          ) : totalExpenses === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay gastos para el mes seleccionado.
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("provider_name")}
                      >
                        <div className="flex items-center">
                          Proveedor {getSortDirectionIcon("provider_name")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("provider_category")}
                      >
                        <div className="flex items-center">
                          Categoría {getSortDirectionIcon("provider_category")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("amount")}
                      >
                        <div className="flex items-center">
                          Monto {getSortDirectionIcon("amount")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("expense_reporting_month")}
                      >
                        <div className="flex items-center">
                          Mes que reporta{" "}
                          {getSortDirectionIcon("expense_reporting_month")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("description")}
                      >
                        <div className="flex items-center">
                          Descripción {getSortDirectionIcon("description")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndPaginatedExpenses.map((expense, index) => (
                      <TableRow
                        key={expense.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-primary/10 transition-colors`}
                      >
                        <TableCell className="font-medium">
                          {formatUppercase(expense.provider_name || "General")}
                        </TableCell>
                        <TableCell>{expense.provider_category}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>
                          {formatMonth(expense.expense_reporting_month)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {expense.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Filas por página:
                  </span>
                  <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(value) => setRowsPerPage(Number(value))}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={rowsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-2">
                  <div className="text-sm text-gray-500 whitespace-nowrap mr-2">
                    {totalExpenses} gastos en total | Página {currentPage} de{" "}
                    {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 px-3"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="h-8 px-3"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={fetchExpenses}
              disabled={isLoadingExpenses || !building?.id}
            >
              Actualizar lista
            </Button>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
}
