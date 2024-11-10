import CardWrapper from "./ui-custom/CardWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ApartmentFinancialBreakdown() {
  return (
    <CardWrapper
      title="Detalle Financiero de Apartamentos"
      content={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Apto N</TableHead>
              <TableHead>Salto anterior</TableHead>
              <TableHead>Pagos</TableHead>
              <TableHead>Nuevo saldo</TableHead>
              <TableHead>Gastos comunes</TableHead>
              <TableHead>Fondo de reserva</TableHead>
              <TableHead>Cuota obra 5/12</TableHead>
              <TableHead>Total del mes</TableHead>
              <TableHead>Recardo por mora</TableHead>
              <TableHead>Total a pagar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Example Data Rows */}
            <TableRow>
              <TableCell>001P</TableCell>
              <TableCell>-53938</TableCell>
              <TableCell>0</TableCell>
              <TableCell>-53938</TableCell>
              <TableCell>0</TableCell>
              <TableCell>415</TableCell>
              <TableCell>7616</TableCell>
              <TableCell>8031</TableCell>
              <TableCell>0</TableCell>
              <TableCell>-45907</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>001I</TableCell>
              <TableCell>1085</TableCell>
              <TableCell>1085</TableCell>
              <TableCell>0</TableCell>
              <TableCell>1085</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>1085</TableCell>
              <TableCell>0</TableCell>
              <TableCell>1085</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>002P</TableCell>
              <TableCell>-58679</TableCell>
              <TableCell>1699</TableCell>
              <TableCell>-60378</TableCell>
              <TableCell>1229</TableCell>
              <TableCell>470</TableCell>
              <TableCell>8625</TableCell>
              <TableCell>10324</TableCell>
              <TableCell>0</TableCell>
              <TableCell>-50054</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>003P</TableCell>
              <TableCell>-68192</TableCell>
              <TableCell>535</TableCell>
              <TableCell>-68727</TableCell>
              <TableCell>0</TableCell>
              <TableCell>535</TableCell>
              <TableCell>9818</TableCell>
              <TableCell>10353</TableCell>
              <TableCell>0</TableCell>
              <TableCell>-58374</TableCell>
            </TableRow>
            {/* Additional Rows Follow the Same Structure */}

            {/* Total Row */}
            <TableRow>
              <TableCell className="font-bold">--------</TableCell>
              <TableCell className="font-bold">-452214</TableCell>
              <TableCell className="font-bold">36334</TableCell>
              <TableCell className="font-bold">-488548</TableCell>
              <TableCell className="font-bold">13078</TableCell>
              <TableCell className="font-bold">5000</TableCell>
              <TableCell className="font-bold">91758</TableCell>
              <TableCell className="font-bold">109835</TableCell>
              <TableCell className="font-bold">267</TableCell>
              <TableCell className="font-bold">-378446</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
    />
  );
}
