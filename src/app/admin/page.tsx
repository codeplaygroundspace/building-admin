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

// Define provider interface
interface Provider {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
}

export default function AdminPage() {
  const { building } = useBuilding();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [expense, setExpense] = useState({
    description: "",
    amount: "",
    provider_id: "",
    provider_name: "",
    provider_category: "General",
    expense_reporting_month: dayjs().format("YYYY-MM"), // Default to current month
  });

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProviderChange = (providerId: string) => {
    const selectedProvider = providers.find(
      (provider) => provider.id === providerId
    );

    setExpense((prev) => ({
      ...prev,
      provider_id: providerId,
      provider_name: selectedProvider?.name || "",
      provider_category: selectedProvider?.category_name || "General",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!building?.id) {
      toast({
        title: "Error",
        description: "No building selected",
      });
      return;
    }

    if (
      !expense.amount ||
      !expense.provider_id ||
      !expense.expense_reporting_month
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los cambios requeridos",
      });
      return;
    }

    // Validate expense_reporting_month format
    const dateRegex = /^\d{4}-\d{2}$/;
    if (!dateRegex.test(expense.expense_reporting_month)) {
      toast({
        title: "Error",
        description: "El formato debe ser YYYY-MM",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare the expense data
      const expenseData = {
        description: expense.description || null, // Allow null description
        amount: parseFloat(expense.amount),
        provider_id: expense.provider_id,
        provider_name: expense.provider_name,
        provider_category: expense.provider_category,
        building_id: building.id,
        expense_reporting_month: expense.expense_reporting_month,
      };

      // Send the data to the API
      const response = await fetch("/api/expenses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      // Reset the form
      setExpense({
        description: "",
        amount: "",
        provider_id: "",
        provider_name: "",
        provider_category: "General",
        expense_reporting_month: dayjs().format("YYYY-MM"),
      });

      toast({
        title: "Listo!",
        description: "Gasto agregado correctamente",
      });
    } catch (error) {
      console.error("Error al agregar gasto:", error);
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gastos</h1>

      <CardWrapper title="Agregar nuevo gasto">
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider_id">Proveedor (requerido)</Label>
              <Select
                value={expense.provider_id}
                onValueChange={handleProviderChange}
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
                          <SelectItem key={provider.id} value={provider.id}>
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
              <Label htmlFor="amount">Monto (requerido)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={expense.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_reporting_month">
                Mes al que reporta (YYYY-MM) (requerido)
              </Label>
              <Input
                id="expense_reporting_month"
                name="expense_reporting_month"
                type="month"
                value={expense.expense_reporting_month}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripcion de gasto</Label>
              <Textarea
                id="description"
                name="description"
                value={expense.description}
                onChange={handleInputChange}
                placeholder="Descripcion de gasto si fuera necesario"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex w-full">
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingProviders}
              className="w-full"
            >
              {isSubmitting ? "Agregando gasto..." : "Agregar gasto"}
            </Button>
          </div>
        </form>
      </CardWrapper>
    </div>
  );
}
