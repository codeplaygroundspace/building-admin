"use client";

import CardWrapper from "./ui-custom/CardWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for the apartment data
interface ApartmentData {
  aptNumber: string;
  previousBalance: number;
  payments: number;
  newBalance: number;
  commonExpenses: number;
  reserveFund: number;
  constructionFee: number;
  monthlyTotal: number;
  lateFee: number;
  totalDue: number;
}

export default function ApartmentFinancialBreakdown() {
  const apartmentData: ApartmentData[] = [
    {
      aptNumber: "001P",
      previousBalance: -53938,
      payments: 0,
      newBalance: -53938,
      commonExpenses: 0,
      reserveFund: 415,
      constructionFee: 7616,
      monthlyTotal: 8031,
      lateFee: 0,
      totalDue: -45907,
    },
  ];

  return (
    <>
      <CardWrapper title="Detalle de pagos">
        <Tabs defaultValue="propietario" className="w-full">
          <div className="flex items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {apartmentData[0].aptNumber}
            </span>
            <TabsList>
              <TabsTrigger value="propietario">Propietario</TabsTrigger>
              <TabsTrigger value="inquilino">Inquilino</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="propietario">
            <div className="space-y-4">
              {Object.entries(apartmentData[0]).map(
                ([key, value], index) =>
                  key !== "aptNumber" && (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium">{key}</span>
                      <span className="text-sm">${value.toFixed(2)}</span>
                    </div>
                  )
              )}
            </div>
          </TabsContent>
          <TabsContent value="inquilino">
            <div className="text-center text-sm text-muted-foreground py-4">
              No hay información disponible
            </div>
          </TabsContent>
        </Tabs>
      </CardWrapper>
    </>
  );
}
