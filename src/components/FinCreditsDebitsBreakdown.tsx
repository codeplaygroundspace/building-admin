import CardWrapper from "./ui-custom/CardWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CreditsDebitsBreakdown() {
  return (
    <CardWrapper
      title="Detalle de Créditos/Débitos"
      content={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fondo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Importe $</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* GASTOS COMUNES */}
            <TableRow>
              <TableCell>Gastos comunes</TableCell>
              <TableCell>BSE - SEGURO DE INCENDIO CUOTA 2/4</TableCell>
              <TableCell>-3,849.40</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gastos comunes</TableCell>
              <TableCell>LIMPIEZA POST OBRA</TableCell>
              <TableCell>-4,200.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gastos comunes</TableCell>
              <TableCell>ELECTRICISTA MIGUEL VITALIS</TableCell>
              <TableCell>-2,500.00</TableCell>
            </TableRow>

            {/* FONDO DE RESERVA */}
            <TableRow>
              <TableCell>Fondo de reserva</TableCell>
              <TableCell>CONSTRUCOM - BPS 09.2024 - 15/10/2024</TableCell>
              <TableCell>-33,568.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fondo de reserva</TableCell>
              <TableCell>CONSTRUCOM - 4ta ENTREGA SALDO</TableCell>
              <TableCell>-223,052.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fondo de reserva</TableCell>
              <TableCell>CONSTRUCOM - CUOTA 1 DE 9</TableCell>
              <TableCell>-26,709.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fondo de reserva</TableCell>
              <TableCell>CONSTRUCOM - BPS TIMBRE PROFESIONAL</TableCell>
              <TableCell>-250.00</TableCell>
            </TableRow>

            {/* Total Row */}
            <TableRow>
              <TableCell colSpan={2} className="font-bold">
                Total de Créditos/Débitos:
              </TableCell>
              <TableCell className="font-bold">-294,128.40</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
    />
  );
}
