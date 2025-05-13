"use client";

import { useState, useEffect } from "react";
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

export default function AdminPage() {
  const { building } = useBuilding();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  // Initialize with a single expense
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
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

  return (
    <div className="container mx-auto py-8">
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
    </div>
  );
}
