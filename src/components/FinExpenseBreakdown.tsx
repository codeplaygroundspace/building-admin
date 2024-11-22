"use client";
import { useEffect, useState } from "react";
import CardWrapper from "./ui-custom/CardWrapper";
import { Separator } from "@/components/ui/separator";
import { supabase } from "../supabase/supabaseClient";

// Define the type for Expense
interface Expense {
  category: string;
  description: string;
  amount: number;
}

export default function ExpenseBreakdown() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        console.log("Fetched data from Supabase:", data);
        console.log("Supabase error:", error);

        setExpenses(data || []);
      } catch (err: unknown) {
        console.log(
          "😵‍💫 Error fetching expenses:",
          err instanceof Error ? err.message : "Unknown error"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  // Calculate total expenses
  const totalExpenses: number = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  const expensesSummary = [
    {
      category: "Gastos comunes",
      items: [
        { label: "Saldo anterior", amount: 59138.77 },
        { label: "Cobranza", amount: 8691.01 },
        { label: "Gastos", amount: 27376.74 },
        { label: "Créditos", amount: 0.0 },
        { label: "Débitos", amount: 10549.4 },
      ],
    },
  ];

  return (
    <>
      <CardWrapper title="Detalle de gastos ↗️">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Total</h2>
          <p>
            -$
            {totalExpenses.toFixed(2)}
          </p>
        </div>
        <Separator className="my-4" />
        {loading ? (
          <p>Cargando datos...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((expense, index) => (
              <li key={index} className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-semibold">{expense.category}</h3>
                  <p className="text-neutral-500">{expense.description}</p>
                </div>
                <p className="whitespace-nowrap ">
                  -${expense.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardWrapper>
      <CardWrapper title="Resumen">
        {expensesSummary.map((fund, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{fund.category}</h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
              {fund.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <p className="text-lg">{item.label}</p>
                  <p>
                    <span className="text-sm">$</span>
                    {item.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardWrapper>
    </>
  );
}
