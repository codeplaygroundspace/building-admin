import CardWrapper from "./ui-custom/CardWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InfoDebt() {
  return (
    <CardWrapper title="Listado de Deudores">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidad</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Importe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>006P</TableCell>
            <TableCell>Deuda acumulada </TableCell>
            <TableCell>$25,437.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>006I</TableCell>
            <TableCell>Deuda acumulada</TableCell>
            <TableCell>$1,272.00</TableCell>
          </TableRow>

          {/* Total */}
          <TableRow>
            <TableCell colSpan={2} className="font-bold">
              Total:
            </TableCell>
            <TableCell className="font-bold">$26,709.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardWrapper>
  );
}
