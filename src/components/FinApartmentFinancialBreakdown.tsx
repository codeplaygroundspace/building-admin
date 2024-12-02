"use client";

import CardWrapper from "./CardWrapper";
import { formatCurrency } from "../lib/formatCurrency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for the apartment data
interface ApartmentData {
  "NRO. APTO.": string;
  "SALDO ANTERIOR": number;
  PAGOS: number;
  "NUEVO SALDO": number;
  "GASTOS COMUNES": number;
  "FONDO DE RESERVA": number;
  "CUOTA OBRA": number;
  "5/12 DEL MES": number;
  "POR MORA": number;
  "TOTAL A PAGAR": number;
}

export default function ApartmentFinancialBreakdown() {
  const apartmentData: ApartmentData[] = [
    {
      "NRO. APTO.": "001P",
      "SALDO ANTERIOR": -53938,
      PAGOS: 0,
      "NUEVO SALDO": -53938,
      "GASTOS COMUNES": 0,
      "FONDO DE RESERVA": 415,
      "CUOTA OBRA": 7616,
      "5/12 DEL MES": 8031,
      "POR MORA": 0,
      "TOTAL A PAGAR": -45907,
    },
  ];

  return (
    <>
      <CardWrapper title="Detalle de pagos">
        <Tabs defaultValue="propietario" className="w-full">
          <div className="flex items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {apartmentData[0]["NRO. APTO."]}
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
                      <span className="text-sm">{formatCurrency(value)}</span>
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
